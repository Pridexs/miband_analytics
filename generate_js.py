import csv
import os
import datetime
import sys

f_csv = open(os.path.join('data', 'csv', 'extract.csv'), 'r')
reader = csv.reader(f_csv)

extract_js_path = os.path.join('data', 'extract.js')

if (os.path.exists(extract_js_path)):
    try:
        os.remove(extract_js_path)
    except:
        sys.exit('Cannot remove extract.js, is the file in use?')

f_js = open(extract_js_path, 'w')
f_js.write('data.addRows([\n')

row = reader.__next__()

first = True
for row in reader:
    # row[0] = Date, row[1] = InBedMin ... etc
    # 0Date, 1InBedMin, 2DeepSleepMin, 3LightSleepMin, 4SleepStart, 5SleepEnd, 6AwakeMin,
    # 7DailyDistanceMeter, 8DailySteps, 9DailyBurnCalories, 10WalkDistance, 11WalkTimeMin,
    # 12WalkBurnCalories, 13RunDistanceMeter, 14RunTimeMin, 15RunBurnCalories, 16WalkRunSeconds,
    # 17DateUS, 18Activity, 19BedHour, 20BedMinute, 21AwakeHour, 22AwakeMinute, 23DateUnix,
    # 24SleepStartUnix,25SleepEndUnix, 26WalkStart, 27WalkEnd, 28RunkEnd
    if (not first):
        f_js.write(',\n')
    first = False

    year, month, day = row[0].split('-')

    dDay = datetime.date(int(year), int(month), int(day))
    isoYear, isoWeekNumber, isoWeekday = dDay.isocalendar()

    dtSleepStart = datetime.datetime.strptime(row[4], '%Y-%m-%d %H:%M:%S')
    dtSleepEnd = datetime.datetime.strptime(row[5], '%Y-%m-%d %H:%M:%S')

    f_js.write( '[new Date({},{},{}),{},\"{}-{}\",{},\"{}-{}\",{},{},{},{},{},'
                '{},{},{},{},{},{},{},{},{},{},{},new Date({},{},{},{},{},{}),'
                'new Date({},{},{},{},{},{})]'
                .format(
                    year, str(int(month)-1), day, year, year, month, month, year,
                    isoWeekNumber, isoWeekNumber, isoWeekday % 7, day,
                    int(row[3]) + int(row[2]), row[2], row[3], row[6], row[7], row[8],
                    row[9], int(row[7]) - int(row[13]), row[11], int(row[9]) - int(row[15]),
                    row[13], row[14], row[15], 0, 0, '-1' if row[4] < row[0] else 0,
                    dtSleepStart.strftime('%H'), dtSleepStart.strftime('%M'),
                    dtSleepStart.strftime('%S'), 0, 0, -1 if row[5] < row[0] else 0,
                    dtSleepEnd.strftime('%H'), dtSleepEnd.strftime('%M'),
                    dtSleepEnd.strftime('%S')
                )
            )

f_js.write('\n]);')
f_js.close()
