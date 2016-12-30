#!/bin/bash
#
# Run 10 demo-log-reader.sh in parallel
# On run example: ./demo-log-reader.sh ./demo-logs/inc.log
#

if [ ! -f /usr/bin/parallel ]; then
  apt-get update && apt-get install -y parallel
fi

ls -1 demo-logs/*.log | parallel \
  --no-notice \
  -j $(ls -1 demo-logs/*.log | wc -l) \
  --workdir $PWD \
  ./demo-log-reader.sh {}
