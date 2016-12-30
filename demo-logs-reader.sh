#!/bin/bash
#
# Read one log file line by line and 
# write each line in desitnation tmp file.
# This script is called by demo-logs-injector.sh
# 
# This destination file (ex ./tmp/inc.log) is watch by
# log.io-harvester in another process
#

LOGFILE=$1
LOGRATE=0.2

while true
do
  echo -n "" > ./tmp/$(basename $LOGFILE)
  while IFS='' read -r line || [[ -n "$line" ]]; do
      echo $line >> ./tmp/$(basename $LOGFILE)
      sleep $LOGRATE
  done < $LOGFILE
done
