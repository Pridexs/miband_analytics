# Merge a newly created .csv file with an old one.
# xiaomi often makes my data disappear so if that happens
# I have an script to merge two .csv files so no old data
# is lost.
#
# It also makes a backup of the old file if somehow the merge bugs out.
# It's called extract_old.csv 

import csv
import sys
import os
from datetime import date

# Variables
extractFile     = 'extract.csv'
extractNewFile  = 'extract_new.csv'
extractOldFile  = 'extract_old.csv'

dataPath        = os.path.join('.', 'data')
csvPath         = os.path.join(dataPath, 'csv')

csvCurPathFile  = os.path.join(csvPath, extractFile)
csvNewPathFile  = os.path.join(csvPath, extractNewFile)
csvOldPathFile  = os.path.join(csvPath, extractOldFile)

# Just to make sure there is no trash from a failed merge
if (os.path.exists(csvNewPathFile)):
    try:
        os.remove(csvNewPathFile)
    except:
        print('data/csv/extract_new.csv could not be removed. Is the file in use?')

try:
    f_newlyGen      = open(extractFile, 'r')
except:
    print ('No extract.csv found. Did you run the generation script first?')
    sys.exit()

f_new               = open(csvNewPathFile, 'w')

try:
    f_cur           = open(csvCurPathFile, 'r')
except:
    f_cur           = None

# Create the directories needed if they dont exist
if (not os.path.exists(dataPath)):
    os.makedir(dataPath)

if (not os.path.exists(csvPath)):
    os.makedir(csvPath)

# Check if there is a previously generated .csv, if it does, merge the two.
if (f_cur is not None):
    f_cur = open(csvCurPathFile, 'r')
    writer_new = csv.writer(f_new, delimiter=',', lineterminator='\n')
    reader_cur = csv.reader(f_cur)
    reader_newlyGen = csv.reader(f_newlyGen)

    count = sum(1 for _ in reader_cur)
    f_cur.seek(0)
    reader_cur = csv.reader(f_cur)

    i = 0
    last_row = []
    for row in reader_cur:
        if (i >= count - 1):
            last_row = row
            break

        writer_new.writerow(row)
        i += 1

    # Check to see if the last day of the current .csv is equal to the first
    # day of the newly generated .csv
    # (Updating the band in the same day)
    # Skipping the first row
    reader_newlyGen.__next__()
    row = []
    for row in reader_newlyGen:
        if (row[0] < last_row[0]):
            continue

    if (not row[0] == last_row[0]):
        writer_new.writerow(last_row)
    else:
        writer_new.writerow(row)

    for row in reader_newlyGen:
        writer.new_writerow(last_row)

    f_cur.close()
    f_new.close()
    f_newlyGen.close()

    if (os.path.exists(csvOldPathFile)):
        try:
            os.remove(csvOldPathFile)
        except:
            print('Could not remove extract_old.csv. Is the file in use?')
            print('Stopping and deleting new file.')
            os.remove(csvNewPathFile)
            sys.exit()

    if (os.path.exists(csvCurPathFile)):
        try:
            os.rename(csvCurPathFile, csvOldPathFile)
        except:
            print('Could not rename extract.csv to extract_old.csv. Is the file in use?')
            print('Stopping.')
            os.remove(csvNewPathFile)
            sys.exit()

    os.rename(csvNewPathFile, csvCurPathFile)
