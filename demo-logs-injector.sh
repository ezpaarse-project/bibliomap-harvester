#!/bin/bash
#
# Run 10 demo-logs-reader.sh in parallel
# On run example: ./demo-logs-reader.sh ./demo-logs/inc.log
#

if [ ! -f /usr/bin/parallel ]; then
  apt-get update && apt-get install -y parallel
fi

ls -1 $BBH_LOG_FOLDER/*.log | parallel \
  --no-notice \
  -j $(ls -1 $BBH_LOG_FOLDER/*.log | wc -l) \
  --workdir $PWD \
  ./demo-logs-reader.sh {}
