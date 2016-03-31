#!/bin/bash

SDPath=/sdcard
OpenHTML=Y
ForceBackupMode=Y
UseScripts=Y

# 1i8n support
export TEXTDOMAIN=mibandextract
# folder with .mo langage file, comment this line if you want to move
# .mo file in /usr/share/locale/XX/LC_MESSAGES/
export TEXTDOMAINDIR=./i18n/

if [ ! -d ./logs ]; then
    mkdir logs
fi

if [ ! $ForceBackupMode == 'Y' ];then
    echo $"Extract Started" 2>&1 | tee ./logs/log
    echo `date +"%m-%d-%y %H:%M"` 2>&1 | tee -a ./logs/log

    echo $"Renaming" 2>&1 | tee -a ./logs/log
    [[ -f ./db/origin_db ]] && mv ./db/origin_db ./origin_db.bak 2>&1 | tee -a ./logs/log
    [[ -f ./db/origin_db-journal ]] && mv ./db/origin_db-journal ./db/origin_db-journal.bak 2>&1 | tee -a ./logs/log

    echo $"ADB SU copy to sdcard" 2>&1 | tee -a ./logs/log
    adb shell "su -c 'cp /data/data/com.xiaomi.hm.health/databases/origin_db* $SDPath/.'" 2>&1 | tee -a ./logs/log
    echo $"ADB pull" >> ./logs/log
    adb pull $SDPath/origin_db  ./db/origin_db 2>&1 | tee -a ./logs/log
    adb pull $SDPath/origin_db-journal ./db/origin_db-journal 2>&1 | tee -a ./logs/log
    adb shell "rm /sdcard/origin_db && rm /sdcard/origin_db-journal" 2>&1 | tee -a ./logs/log
else
    echo "ok"
    if [ ! -f ./db/origin_db ] || [ $ForceBackupMode == 'Y' ]
    then
        echo $"Cannot find database files. Non-rooted phone? Attemting backup approach" 2>&1 | tee -a ./logs/log
        echo $"Press Backup My Data button on device..." 2>&1 | tee -a ./logs/log
        adb backup -f mi.ab -noapk -noshared com.xiaomi.hm.health
        echo $"unpacking backup file"  2>&1 | tee -a ./logs/log
        dd if=mi.ab bs=1 skip=24 | python -c "import zlib,sys;sys.stdout.write(zlib.decompress(sys.stdin.read()))" > mi.tar 2>&1 | tee -a ./logs/log
        tar xvf mi.tar apps/com.xiaomi.hm.health/db/origin_db apps/com.xiaomi.hm.health/db/origin_db-journal 2>&1 | tee -a ./logs/log

        echo $"deleting temp file" 2>&1 | tee -a ./logs/log
        rm mi.ab
        rm mi.tar
        cp -f apps/com.xiaomi.hm.health/db/origin_db* ./db/
        rm -rf apps/
    fi


    if [ ! -f ./db/origin_db ]
    then
        echo $"Extraction failed"
        echo $"Still cannot find files. Restoring original files"
        [[ -f ./db/origin_db.bak ]] && mv ./db/origin_db.bak ./db/origin_db
        [[ -f ./db/origin_db-journal.bak ]] && mv ./db/origin_db-journal.bak origin_db-journal
    else
        echo $"sqlite operation started" 2>&1 | tee -a ./logs/log
        sqlite3 ./db/origin_db < ./db/miband.sql | tee -a ./logs/log
        [[ -f ./db/origin_db.bak ]] && rm ./db/origin_db.bak | tee -a ./logs/log
        [[ -f ./db/origin_db-journal.bak ]] && rm ./db/origin_db-journal.bak | tee -a ./logs/log

        rm ./app_locale.js

        if [ $UseScripts == 'Y' ]
        then
            python3 merge.py | tee -a ./logs/log
            python3 generate_js.py | tee -a ./logs/log
        else
            rm ./data/extract.js
            mv ./extract.js ./data/
        fi

        if [ $OpenHTML == 'Y' ]
        then
            if [ "$(uname)" == "Darwin" ]
            then
                open data/mi_data.html        
            elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
                xdg-open data/mi_data.html
            fi
        fi
    fi
fi
