#!/bin/sh

start_server () {
  ./bin/server &
  pid=$!
}

kill_server() {
  kill $pid
  wait $pid 2> /dev/null
}

is_server_ready() {
  lsof -i :8000 > /dev/null
}

wait_server() {
  while ! is_server_ready; do sleep 0.1; done
}

trap kill_server EXIT

start_server

wait_server
