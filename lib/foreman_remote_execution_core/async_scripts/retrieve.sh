#!/bin/sh

if ! pgrep --help 2>/dev/null >/dev/null; then
    echo DONE 1
    echo "pgrep is required" >&2
    exit 1
fi

BASE_DIR="$(dirname $(readlink -f "${BASH_SOURCE[0]}"))"

function release_lock() {
    rm $BASE_DIR/retrieve_lock
}

# acquiring the lock before proceeding, to ensure only one instance of the script is running
while ! mkfifo $BASE_DIR/retrieve_lock 1>/dev/null 2>&1; do
    # we failed to create retrieve_lock - assuming there is already another retrieve script running
    # waiting until it finished before we try to acquire it
    read -t 10 <>$BASE_DIR/retrieve_lock
done
# ensure the release the lock at exit
trap "release_lock" EXIT

pid=$(cat "$BASE_DIR/pid")

if [ -e $BASE_DIR/manual_mode ] || ([ -n "$PID"] && pgrep -P "$pid" >/dev/null 2>&1); then
  echo RUNNING
else
  echo "DONE $(cat "$BASE_DIR/exit_code" 2>/dev/null)"
fi
[ -f "$BASE_DIR/output" ] || exit 0
[ -f "$BASE_DIR/position" ] || echo 1 > "$BASE_DIR/position"
position=$(cat "$BASE_DIR/position")
tail --bytes "+${position}" "$BASE_DIR/output" > "$BASE_DIR/tmp"
bytes=$(cat "$BASE_DIR/tmp" | wc --bytes)
expr "${position}" + "${bytes}" > "$BASE_DIR/position"
cat "$BASE_DIR/tmp"

