How to migrate database from one environment to other environment:

For eg: DEV (Source) to UAT (Destination) database migration

- Take a SQL dump of UAT database.
- Take a SQL dump of DEV database.
- Run a python script to clean the data from both DEV and UAT SQL dump files, as a result it will generate corresponding two files containing only the structure/skeleton of the database.
- Use diff tool application to visually compare both files and find out the differences.
- Create a file to apply those changes on UAT database.

Python Script:
```py
 with open("out_dev.sql", 'w') as fout:
    with open("Dump.sql", 'r', encoding='UTF-8') as fin:
        insertion_found = False
        for line in fin:
            if line.find("UNLOCK TABLES") != -1:
                insertion_found = False
                continue
            if line.find("LOCK TABLES") != -1:
                insertion_found = True
                continue
            if insertion_found :
                continue
            else:
                fout.write(line)
                fout.flush()
```