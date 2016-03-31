# What is this?
This is a tool to extract data from Xiaomi's MiBand. It was not initially developed by me (you can check the original thread where it came from bellow) but, I am currently involved with a lot of personal data extraction so I am expanding this with my needs and maybe it can fulfill yours too.

What I added from the original version:  
1. Scripts to merge files
  * Xiaomi is not good at keeping their data. At least they have failed me countless times, so with that in mind I added two scripts.
    1. merge.py
        This merges two .csv files into one. The newly generated one with any previously generated. I did this because I had files from days that were not stored in my cellphone and if I just ran the original scripts it would completely overwrite any old data. Instead, I pick the old one, copy to a new .csv and bring data back with the new one. Replacing the last day of the previous file with the new one (if the days match).
    2. generate_js.py
        This is just for the data visualization tool. It just generates a new extrac.js from a .csv file.
2. Changed around the shell scripts a little bit

What I plan to do:
- [ ] Make a data visualization tool for D3.js
- [ ] Automate the scripts a little bit more.
- [ ] Add stuff from MiBand 1S (Heart rate, etc)

I do not have a MiScale yet so I cannot test those features, but I plan to get one soon and maybe do more stuff on that are aswell.

# Requirements
You cannot use version of MiFit 2.0+ since they use a different db from sqlite.

1. If you do not have a rooted (is that the term?) phone:
  1. MiFit version 1.7 or less or;
  2. Altered MiFit version 1.8
    * In MiFit 1.8 the flag to allow database backup is set to false. That means you cannot retrieve the database files from this version. But, fortunately, there is ways to change that. One of the methods is downloading the apk from a mirror (Lookup apkmirror dot com) decompress the apk and change the flag android:allowBackup to false in the Manifest File. How to do that is out of the scope of this document but it is not that hard.
2. If you have a phone with rooted phone:
  1. adb should be able to get the database with no problems.

# Dependencies
1. Windows
  * All the binaries inside bin/ folder should work. If adb cannot perform the data extraction, you should download the newest version of android sdk and use their version of adb instead.
  1. python3
2. GNU/Linux & Mac
  1. adb from Android
  2. sqlite3 version 2.8.3> (Linux versions tend to come with older sqlite versions, those won't work)
  3. python3

# How to use:  
Preparation steps:  
  1. Make sure you have USB drivers for your device properly installed and that your device is accessible by ADB when you connect it through USB  
  2. Connect your phone through USB and make sure USB debugging setting is enabled on your phone.  
  3. Execute `run.bat` - if your phone is rooted, the data would be pulled automatically. If your phone is not rooted you would see backup screen and you need to press "Back up my data" button in the bottom left corner.  
  4. Data from your mi band will be saved to extract.csv file and extract.js. If UseScirpts is set to 'Y', the data will automatically be merged with any old data and saved inside ./data/csv/extract.csv and ./data/extract.js will be generated. 
  5. HTML reports are using Google Charts framework and Google TOS does not allow storing their scripts offline along with the application, therefore you will need to have working internet access for reports to work. Your data is not being sent to Google, the internet connection is only used to download latest version of Google Charts javascripts.  


# Checking configuration settings:
  1. Review SDPath parameter value in `run.bat/run.sh`. The program will copy files from Mi app location to folder specified in SDPath before pulling
   them to desktop. In most cases default value (`/sdcard`) shoud work fine, however if your phone does not have this directory, find the path where
   your Internal/External SD is mounted and put that path string into SDPath value. Second most common value might be `/storage/sdcard0`
  2. Review config.js and make any changes to your liking (set Goals for sleep hours and daily steps, force override UI language to specific value)
  3. If you do not want main report being open every time you run extract, change `OpenHTML=Y` in `run.bat/run.sh` to `OpenHTML=N`
  4. If your device is not rooted or have any issues with first (root) method that application uses and prefer to skip straight to the second (backup)
   method, set `ForceBackupMode` value to `Y` in `run.bat`.
  5. If you are planning to use ADB over WiFi, edit run.sh and set up IPAddr value to IP address of your phone, if you use USB cable, leave `IPAddr`
   value blank. If you using non-default port, you may need to change `TCPPort` value.

You may also think of a great idea of running syncronization automatically and unattended using ADB over Wifi - at least I liked that idea initially.  
I gave that idea more thought and as of now I strongly recommend not to do it - having ADB running over Wifi is a security risk, if you have to use it over Wifi, enable it manually, run the sync and disable ADB over Wifi right away.

# For Linux/OSX users:
1. You would need to to manually install android-sdk for (adb binary), sqlite3 and openssl to uncompress zlib data. Please note that versions of sqlite3
   and openssl that are preinstalled on your machine might be too old to be used with this package, so you might need to obtain newer versions. For example,
   I was told that sqlite3 3.7.13 that comes preinstalled with OSX was incompatible with some of functions used in script. I would recommend using version
   3.8.x at least.
2. You'll need to grant execute permissions to run.sh by using chmod +x run.sh and you will need to execute run.sh instead of run.bat in steps listed below.
   You'll also need to make configuration changes in run.sh instead of run.bat
3. Check that your sqlite3 is properly configured for your time zone. Run following command and see if it returns correct timestamp:
```bash
bin\sqlite3 dbfile "select datetime('now','localtime');"
```

# Configuration and localization:
`config.js` - Set initial daily goal values; select interface language
`locale.js` - contains all locale data
`run.bat/run.js` - OpenHTML defines whether to open web browser upon extract completion

#Original versions
[Original version here](http://forum.xda-developers.com/general/accessories/xiaomi-mi-band-data-extraction-t3019156/post58575745#post58575745)  
[Original russian description here](http://4pda.ru/forum/index.php?showtopic=596501)

![Screenshot](http://i.imgur.com/ALWh4zf.gif)
![Screenshot](http://i.imgur.com/id5BV3q.gif)
![Screenshot](http://i.imgur.com/tg1XKO9.gif)
