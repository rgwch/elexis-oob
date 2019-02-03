#! /bin/sh

fdate=`date '+%Y-%m-%d-%H%M'`
dest=/backup
dirname=$dest'/elexisbackup_'$fdate
log=/backup/lastlog.log

echo $dirname > $log
mkdirs $dirname
rc=$?; if [[ $rc != 0 ]]; then
	echo could not create $dirname: $rc >>$log
	exit $rc
fi
log=$dirname/backup.log
echo start `date` > $log

make_backup(){
  name=$1
  file=$dirname/$name.tgz
  echo $file `date` >> $log
  tar -czf $file /mnt/$name
  rc=$?; if [[ $rc != 0 ]]; then
	  echo $name failed with error code $rc >>$log
	  exit $rc
  fi

}

make_backup elexisdb
make_backup lucindadata
make_backup lucindabase
make_backup webelexisdata
make_backup pacsdata

echo elexisbackup ended normally >>$log
