@echo off
set SDPath=/sdcard
set OpenHTML=Y
set ForceBackupMode=N
set IPAddr=
set TCPPort=5555
set ExtractRaw=N
set Height=185
set Weight=65
set ADBUsb=-d

IF NOT EXIST logs mkdir logs

bin\adb kill-server
echo Extract Started > logs\log
date /t >> logs\log

echo Renaming >> logs\log
ren .\db\origin_db origin_db.bak >> logs\log
ren .\db\origin_db-journal origin_db-journal.bak >> logs\log
ren .\db\mihealth_db mihealth_db.bak >> logs\log
ren .\db\mihealth_db-journal mihealth_db-journal.bak >> logs\log

if .%IPAddr%.==.. goto Wired
echo Connecting to ADB over WiFi >> logs\log
set ADBUsb=
bin\adb tcpip %TCPPort%
bin\adb connect %IPAddr%
::Wait for 5 seconds before attempting to copy data
ping -n 5 0.0.0.0 > nul

:Wired
if .%ForceBackupMode%.==.Y. goto Backup

echo ADB SU copy to sdcard >> logs\log
bin\adb %ADBUsb% shell "su -c 'cp /data/data/com.xiaomi.hm.health/databases/origin_db* %SDPath%/. && cp /data/data/com.xiaomi.hm.health/databases/mihealth* %SDPath%/.'"

echo ADB pull >> logs\log
bin\adb %ADBUsb% pull %SDPath%/origin_db  .\db\origin_db
bin\adb %ADBUsb% pull %SDPath%/origin_db-journal .\db\origin_db-journal
bin\adb %ADBUsb% pull %SDPath%/mihealth.db  .\db\mihealth_db
bin\adb %ADBUsb% pull %SDPath%/mihealth.db-journal .\db\mihealth_db-journal

bin\adb %ADBUsb% shell "rm /sdcard/origin_db && rm /sdcard/origin_db-journal && rm /sdcard/mihealth.db && rm /sdcard/mihealth.db-journal"
bin\adb kill-server

if exist .\db\origin_db goto Cont

echo Cannot find database files. Non-rooted phone? Attemting backup approach >>logs\log

:Backup
echo Press "Backup My Data" button on device...
bin\adb %ADBUsb% backup -f mi.ab -noapk -noshared com.xiaomi.hm.health
bin\adb kill-server

:Cont2
echo unpacking backup file >>logs\log
bin\tail -c +25 mi.ab > mi.zlb
bin\deflate d mi.zlb mi.tar >> logs\log
bin\tar xvf mi.tar apps/com.xiaomi.hm.health/db/origin_db* 2>> logs\log
bin\tar xvf mi.tar apps/com.xiaomi.hm.health/db/mihealth* 2>> logs\log

echo deleting temp files >> logs\log
del mi.ab
del mi.zlb
del mi.tar
copy /Y apps\com.xiaomi.hm.health\db\origin_db* db\. >>logs\log
copy /Y apps\com.xiaomi.hm.health\db\mihealth.db db\mihealth_db >>logs\log
copy /Y apps\com.xiaomi.hm.health\db\mihealth.db-journal db\mihealth_db-journal >>logs\log
rd /s/q apps >>logs\log 2>> logs\log_adb

if exist db\origin_db goto Cont

:Err2
echo Extraction failed
echo Still cannot find files. Restoring original files >> logs\log
ren .\db\origin_db.bak origin_db >> logs\log
ren .\db\origin_db-journal.bak origin_db-journal >> logs\log
ren .\db\mihealth_db.bak mihealth_db >> logs\log
ren .\db\mihealth_db-journal.bak mihealth_db-journal >> logs\log
goto End

:Cont
echo sqlite operation started >> logs\log
bin\sqlite3 db\origin_db < db\miband.sql >>logs\log
if exist db\mihealth_db bin\sqlite3 db\mihealth_db < db\miscale.sql >>logs\log

if not .%ExtractRaw%.==.Y. goto Cont3

echo sqlite Raw extraction started >> logs\log
echo INSERT INTO _PersonParams (Height,Weight) VALUES ( %Height%,%Weight%); > db\health.sql
bin\sqlite3 db\origin_db < db\miband_raw.sql >>logs\log

:Cont3
del .\db\origin_db.bak >>logs\log
del .\db\origin_db-journal.bak >>logs\log
del .\db\mihealth_db.bak >>logs\log
del .\db\mihealth_db-journal.bak >>logs\log

move extract.js data\ >> logs\log

if not .%OpenHTML%.==.Y. goto End
if exist data\mi_data.html start mi_data.html

:End
