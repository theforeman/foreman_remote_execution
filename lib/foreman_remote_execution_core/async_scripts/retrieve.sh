#!/bin/sh

if ! pgrep --help 2>/dev/null >/dev/null; then
    echo DONE 1
    echo "pgrep is required" >&2
    exit 1
fi

BASE_DIR="$(dirname "$(readlink -f "$0")")"

# load the data required for generating the callback
. "$BASE_DIR/env.sh"
URL_PREFIX="$CALLBACK_HOST/dynflow/tasks/$TASK_ID"
AUTH="$TASK_ID:$OTP"
CURL="curl --silent --show-error --fail --max-time 10"

MY_LOCK_FILE="$BASE_DIR/retrieve_lock.$$"
MY_PID=$$
echo $MY_PID >"$MY_LOCK_FILE"
LOCK_FILE="$BASE_DIR/retrieve_lock"

RUN_TIMEOUT=30 # for how long can the script hold the lock
WAIT_TIMEOUT=60 # for how long the script is trying to acquire the lock
START_TIME=$(date +%s)

fail() {
    echo RUNNING
    echo "$1"
    exit 1
}

acquire_lock() {
    # try to acquire lock by creating the file (ln should be atomic an fail in case
    # another process succeeded first). We also check the content of the lock file,
    # in case our process won when competing over the lock while invalidating
    # the lock on timeout.
    ln "$MY_LOCK_FILE" "$LOCK_FILE" 2>/dev/null || [ "$(head -n1 "$LOCK_FILE")" = "$MY_PID" ]
    return $?
}

# acquiring the lock before proceeding, to ensure only one instance of the script is running
while ! acquire_lock; do
    # we failed to create retrieve_lock - assuming there is already another retrieve script running
    current_pid=$(head -n1 "$LOCK_FILE")
    if [ -z "$current_pid" ]; then
        continue
    fi
    # check whether the lock is not too old (compared to $RUN_TIMEOUT) and try to kill
    # if it is, so that we don't have a stalled processes here
    lock_lines_count=$(wc -l < "$LOCK_FILE")
    current_lock_time=$(stat --format "%Y" "$LOCK_FILE")
    current_time=$(date +%s)

    if [ "$(( current_time - START_TIME ))" -gt "$WAIT_TIMEOUT" ]; then
        # We were waiting for the lock for too long - just give up
        fail "Wait time exceeded $WAIT_TIMEOUT"
    elif [ "$(( current_time - current_lock_time ))" -gt "$RUN_TIMEOUT" ]; then
        # The previous lock it hold for too long - re-acquiring procedure
        if [ "$lock_lines_count" -gt 1 ]; then
           # there were multiple processes waiting for lock without resolution
           # longer than the $RUN_TIMEOUT - we reset the lock file and let processes
           # to compete
           echo "RETRY" > "$LOCK_FILE"
        fi
        if [ "$current_pid" != "RETRY" ]; then
            # try to kill the currently stalled process
            kill -9 "$current_pid" 2>/dev/null
        fi
        # try to add our process as one candidate
        echo $MY_PID >> "$LOCK_FILE"
        if [ "$( head -n2 "$LOCK_FILE" | tail -n1 )" = "$MY_PID" ]; then
            # our process won the competition for the new lock: it is the first pid
            # after the original one in the lock file - take ownership of the lock
            # next iteration only this process will get through
            echo $MY_PID >"$LOCK_FILE"
        fi
    else
        # still waiting for the original owner to finish
        sleep 1
    fi
done

release_lock() {
    rm "$MY_LOCK_FILE"
    rm "$LOCK_FILE"
}
# ensure the release the lock at exit
trap "release_lock" EXIT

pid=$(cat "$BASE_DIR/pid")
[ -f "$BASE_DIR/position" ] || echo 1 > "$BASE_DIR/position"
position=$(cat "$BASE_DIR/position")

prepare_output() {
    if [ -e "$BASE_DIR/manual_mode" ] || ([ -n "$pid" ] && pgrep -P "$pid" >/dev/null 2>&1); then
        echo RUNNING
    else
        echo "DONE $(cat "$BASE_DIR/exit_code" 2>/dev/null)"
    fi
    [ -f "$BASE_DIR/output" ] || exit 0
    tail --bytes "+${position}" "$BASE_DIR/output" > "$BASE_DIR/tmp"
    cat "$BASE_DIR/tmp"
}

# prepare the callback payload
payload() {
    if [ -n "$1" ]; then
        exit_code="$1"
    else
        exit_code=null
    fi

    if [ -e "$BASE_DIR/manual_mode" ]; then
        manual_mode=true
        output=$(prepare_output | base64 -w0)
    else
        manual_mode=false
    fi

    echo "{ \"exit_code\": $exit_code,"\
         "  \"step_id\": \"$STEP_ID\","\
         "  \"manual_mode\": $manual_mode,"\
         "  \"output\": \"$output\" }"
}

if [ "$1" = "push_update" ]; then
    if [ -e "$BASE_DIR/exit_code" ]; then
        exit_code="$(cat "$BASE_DIR/exit_code")"
        action="done"
    else
        exit_code=""
        action="update"
    fi
    $CURL -X POST -d "$(payload $exit_code)" -u "$AUTH" "$URL_PREFIX"/$action 2>>"$BASE_DIR/curl_stderr"
    success=$?
else
    prepare_output
    success=$?
fi

if [ "$success" = 0 ]; then
    # in case the retrieval was successful, move the position of the cursor to be read next time
    bytes=$(wc --bytes < "$BASE_DIR/tmp")
    expr "${position}" + "${bytes}" > "$BASE_DIR/position"
fi
