#!/bin/sh

if ! pgrep --help 2>/dev/null >/dev/null; then
    echo DONE 1
    echo "pgrep is required" >&2
    exit 1
fi

BASE_DIR="$(dirname $(readlink -f "$0"))"

# load the data required for generating the callback
. "$BASE_DIR/env.sh"
URL_PREFIX="$CALLBACK_HOST/dynflow/tasks/$TASK_ID"
AUTH="$TASK_ID:$OTP"
CURL="curl --silent --show-error --fail --max-time 10"

# acquiring the lock before proceeding, to ensure only one instance of the script is running
while ! mkfifo $BASE_DIR/retrieve_lock 1>/dev/null 2>&1; do
    # we failed to create retrieve_lock - assuming there is already another retrieve script running
    # waiting until it finished before we try to acquire it
    read -t 10 <>$BASE_DIR/retrieve_lock
done

release_lock() {
    rm $BASE_DIR/retrieve_lock
}
# ensure the release the lock at exit
trap "release_lock" EXIT

pid=$(cat "$BASE_DIR/pid")
[ -f "$BASE_DIR/position" ] || echo 1 > "$BASE_DIR/position"
position=$(cat "$BASE_DIR/position")

prepare_output() {
    if [ -e $BASE_DIR/manual_mode ] || ([ -n "$pid" ] && pgrep -P "$pid" >/dev/null 2>&1); then
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

    echo "{ \"step_id\": \"$STEP_ID\","\
         "  \"manual_mode\": $manual_mode,"\
         "  \"exit_code\": $exit_code,"\
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
