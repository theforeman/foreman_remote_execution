#!/bin/sh
#
# Control script for the remote execution jobs.
#
# The initial script calls `$CONTROL_SCRIPT init-script-finish` once the original script exits.
# In automatic mode, the exit code is sent back to the proxy on `init-script-finish`.
#
# What the script provides is also a manual mode, where the author of the rex script can take
# full control of the job lifecycle. This allows keeping the marked as running even when
# the initial script finishes.
#
# The manual mode is turned on by calling `$CONTROL_SCRIPT manual-control`. After calling this,
# one can call `echo message | $CONTROL_SCRIPT update` to send output to the remote execution jobs
# and `$CONTROL_SCRIPT finish 0` once finished (with 0 as exit code) to send output to the remote execution jobs
# and `$CONTROL_SCRIPT finish 0` once finished (with 0 as exit code)
BASE_DIR="$(dirname "$(readlink -f "$0")")"

if ! command -v curl >/dev/null; then
    echo 'curl is required' >&2
    exit 1
fi

# send the callback data to proxy
update() {
    "$BASE_DIR/retrieve.sh" push_update
}

# wait for named pipe $1 to retrieve data. If $2 is provided, it serves as timeout
# in seconds on how long to wait when reading.
wait_for_pipe() {
    pipe_path=$1
    if [ -n "$2" ]; then
        timeout="-t $2"
    fi
    if read $timeout <>"$pipe_path"; then
        rm "$pipe_path"
        return 0
    else
        return 1
    fi
}

# function run in background, when receiving update data via STDIN.
periodic_update() {
    interval=1
    # reading some data from periodic_update_control signals we're done
    while ! wait_for_pipe "$BASE_DIR/periodic_update_control" "$interval"; do
        update
    done
    # one more update before we finish
    update
    # signal the main process that we are finished
    echo > "$BASE_DIR/periodic_update_finished"
}

# signal the periodic_update process that the main process is finishing
periodic_update_finish() {
    if [ -e "$BASE_DIR/periodic_update_control" ]; then
       echo > "$BASE_DIR/periodic_update_control"
    fi
}

ACTION=${1:-finish}

case "$ACTION" in
    init-script-finish)
        if ! [ -e "$BASE_DIR/manual_mode" ]; then
            # make the exit code of initialization script the exit code of the whole job
            cp init_exit_code exit_code
            update
        fi
        ;;
    finish)
        # take exit code passed via the command line, with fallback
        # to the exit code of the initialization script
        exit_code=${2:-$(cat "$BASE_DIR/init_exit_code")}
        echo $exit_code > "$BASE_DIR/exit_code"
        update
        if [ -e "$BASE_DIR/manual_mode" ]; then
            rm "$BASE_DIR/manual_mode"
        fi
        ;;
    update)
        # read data from input when redirected though a pipe
        if ! [ -t 0 ]; then
            # couple of named pipes to coordinate the main process with the periodic_update
            mkfifo "$BASE_DIR/periodic_update_control"
            mkfifo "$BASE_DIR/periodic_update_finished"
            trap "periodic_update_finish" EXIT
            # run periodic update as separate process to keep sending updates in output to server
            periodic_update &
            # redirect the input into output
            tee -a "$BASE_DIR/output"
            periodic_update_finish
            # ensure the periodic update finished before we return
            wait_for_pipe "$BASE_DIR/periodic_update_finished"
        else
            update
        fi
        ;;
    # mark the script to be in manual mode: this means the script author needs to use `update` and `finish`
    # commands to send output to the remote execution job or mark it as finished.
    manual-mode)
        touch "$BASE_DIR/manual_mode"
        ;;
    *)
        echo "Unknown action $ACTION"
        exit 1
        ;;
esac
