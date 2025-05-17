#!/bin/sh
# wait-for-it.sh
#
# Use this script to test if a given TCP host/port are available

set -e

TIMEOUT=15

usage() {
  echo "Usage: $0 host:port [--timeout=seconds] [--] command args"
  exit 1
}

if [ $# -lt 2 ]; then
  usage
fi

HOSTPORT=$1
shift

if [ "$1" != "" ] && echo "$1" | grep -q -- "^--timeout="; then
  TIMEOUT=${1#*=}
  shift
fi

if [ "$1" = "--" ]; then
  shift
fi

COMMAND=$@

HOST=$(echo $HOSTPORT | cut -d: -f1)
PORT=$(echo $HOSTPORT | cut -d: -f2)

for i in $(seq $TIMEOUT); do
  nc -z $HOST $PORT && break
  echo "Waiting for $HOST:$PORT..."
  sleep 1
done

if [ $i -eq $TIMEOUT ]; then
  echo "Timeout waiting for $HOST:$PORT"
  exit 1
fi

exec $COMMAND