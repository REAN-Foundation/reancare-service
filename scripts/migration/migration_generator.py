from datetime import datetime
import getopt
import os
import sys

########################################################################################

cwd = "./"
PRISMA_DEFAULT_DB_URL = "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public" #Please do not modify this
fromUrl = "mysql://root:root@localhost:3306/reancare_local"
toUrl = "mysql://root:root@localhost:3306/reancare_devx"
localUrl = "mysql://root:root@localhost:3306/temp"
cwd = "D:/current_projects/rean/db-migration"
########################################################################################

def createProjectDirectory(dbInfo):
    try:
        os.chdir(cwd)
        if (os.path.exists(cwd+'/'+dbInfo['ProjectFolderName']) == False):
            os.mkdir(cwd+'/'+dbInfo['ProjectFolderName'])
        else:
            os.chdir(cwd+'/'+dbInfo['ProjectFolderName'])
        print("Project Directory created successfully")
    except Exception as e:
        raise Exception('Unable to create project directory')

########################################################################################

def createPrismaProjectSetup(dbInfo):
    try:
        os.chdir(cwd+'/'+dbInfo['ProjectFolderName'])
        os.system('npm init -y')
        os.system('npm install prisma --save-dev')
        os.system('npx prisma init')
        newCwd = cwd+'/'+dbInfo['ProjectFolderName']+"/prisma"
        os.chdir(newCwd)
        if (os.path.exists(newCwd) == True):
            setupSchemaPrisma(dbInfo)
        print("Created prisma project setup")
    except Exception as e:
        raise Exception('Unable to create prisma project setup')

########################################################################################

def setupEnv(dbInfo, dbUrlFrom, dbUrlTo):
    try:
        os.chdir(cwd+'/'+dbInfo['ProjectFolderName'])
        if (os.path.exists(cwd+"/"+dbInfo['ProjectFolderName']+"/.env") == True):
            f = open('.env', 'r')
            fileContent = f.read()
            updatedContent = fileContent.replace(dbUrlFrom, dbUrlTo)
            f.close()
            f = open(".env", 'w')
            f.write(updatedContent)
            f.close()
            print("Updated database URL successfully")
    except Exception as e:
        raise Exception('Unable to update Database Url inside the .env')

########################################################################################

def setupSchemaPrisma(dbInfo):
    try:
        os.chdir(cwd+'/'+dbInfo['ProjectFolderName']+'/prisma')
        if (os.path.exists(os.getcwd()+"/schema.prisma") == True):
            f = open('schema.prisma', 'r')
            fileContent = f.read()
            f.close()
            updateContent = fileContent.replace(
                "postgresql", dbInfo['DatabaseProvider'])
            f = open('schema.prisma', 'w')
            f.write(updateContent)
            f.close()
            print("set up database provider")
    except Exception as e:
        raise Exception('Unable to update Database Provider in schema.prisma')

########################################################################################

def converDbSchemaToPrsimaSchema(dbInfo):
    try:
        os.chdir(cwd + '/' + dbInfo['ProjectFolderName'])
        os.system('npx prisma db pull')
        print("Database schemma converted to prisma schema successfully")
    except Exception as e:
        raise Exception(
            'Error in converting database schema into prisma schema')

########################################################################################

def applyMigration(dbInfo):
    try:
        setupEnv(dbInfo, dbInfo['DatabaseUrl'],
                 dbInfo['DatabaseUrlForMigration'])
        os.system('npx prisma migrate dev --name init')
        print("Database migration completed successfully")
    except Exception as e:
        raise Exception('Error in database migration')

########################################################################################

def getDbDifferences(fromDbUrl, toDbUrl):
    try:
        print("DB Difference is=>")
        cmd = 'npx prisma migrate diff --from-url {toDbUrl} --to-url {fromDbUrl} --script > ../migration.sql'.format(
            fromDbUrl=fromDbUrl, toDbUrl=toDbUrl);
        os.system(cmd)
    except Exception as e:
        raise Exception('Error in npx prisma migrate diff')

########################################################################################

def writeLinesToFile(filename, lines):
    with open(filename, mode='w') as fp:
        for line in lines:
            if not line.endswith('\n'):
                line += '\n'
            fp.write(line)

########################################################################################

def isLineEmpty(line):
    l = line.strip()
    if len(l) == 0:
        return True
    return False

########################################################################################

def getFileLines(infile):
    lines = []
    file = open(infile, 'r')
    while True:
        line = file.readline()
        if len(line) == 0:
            break
        lines.append(line)
    file.close()
    return lines

########################################################################################

def sanitize(migrationFile, outoutFile):
    outputLines = []
    lines = getFileLines(migrationFile)
    for line in lines:
        l = line.strip()
        if isLineEmpty(l):
            continue
        if l.startswith("-- AddForeignKey") or l.startswith("-- DropForeignKey"):
            continue
        idx = l.find("DROP FOREIGN KEY")
        if idx != -1:
            continue
        idx = l.find("ADD CONSTRAINT")
        if idx != -1:
            continue
        if len(l) == 0:
            continue
        outputLines.append(l)
    writeLinesToFile(outoutFile, outputLines)

########################################################################################

def createProjectSetup(dbInfo):
    try:
        createProjectDirectory(dbInfo)
        createPrismaProjectSetup(dbInfo)
        setupEnv(dbInfo, PRISMA_DEFAULT_DB_URL, dbInfo['DatabaseUrl'])
        converDbSchemaToPrsimaSchema(dbInfo)
        applyMigration(dbInfo)
    except Exception as e:
        print(e)

########################################################################################

def usage():
    print("""
        usage: %s [-h --help|-f --from|-t --to|-w --workdir|-l --local] [folder/file|-]

        -h, --help      : Get usage help
        -f, --from      : Migrations to be generated from this database URL [Mandatory]
        -t, --to        : Migrations to be generated to this database URL [Mandatory]
        -l, --local     : Local database url to generate intermediate migration files [Mandatory]
        -w, --workdir   : Working directory to generate migrations
        """ % sys.argv[0])

########################################################################################

if __name__ == '__main__':

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hf:t:w:l", [
                                   "help", "from=", "to=", "workdir=", "local="])
    except getopt.GetoptError as err:
        sys.exit(2)

    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
            sys.exit()
        if o in ("-f", "--from"):
            fromUrl = a
        if o in ("-t", "--to"):
            toUrl = a
        if o in ("-w", "--workdir"):
            cwd = a
        if o in ("-l", "--local"):
            localUrl = a

    if len(fromUrl) == 0 or len(toUrl) == 0 or len(cwd) == 0:
        usage()
        sys.exit()

    now = datetime.now()
    timestamp = now.strftime("%Y%m%d%H%M%S")
    cwd = cwd + '/' + timestamp

    try:

        fromDbInfo = {
            'DatabaseProvider': 'mysql',
            'DatabaseUrl': fromUrl,  # 'mysql://root:root@localhost:3306/reancare_uat',
            'DatabaseUrlForMigration': localUrl + '_from_' + timestamp, # 'mysql://root:root@localhost:3306/DNL1',
            'ProjectFolderName': 'from'
        }

        toDbInfo = {
            'DatabaseProvider': 'mysql',
            'DatabaseUrl': toUrl,  # 'mysql://root:root@localhost:3306/reancare_dev',
            'DatabaseUrlForMigration': localUrl + '_to_' + timestamp, # 'mysql://root:root@localhost:3306/DNL2',
            'ProjectFolderName': 'to'
        }

        fromFolder = os.path.join(cwd, fromDbInfo['ProjectFolderName'])
        if not os.path.exists(fromFolder):
            os.makedirs(fromFolder)

        toFolder = os.path.join(cwd, toDbInfo['ProjectFolderName'])
        if not os.path.exists(toFolder):
            os.makedirs(toFolder)

        createProjectSetup(fromDbInfo)
        createProjectSetup(toDbInfo)
        getDbDifferences(
            fromDbInfo['DatabaseUrlForMigration'], toDbInfo['DatabaseUrlForMigration'])

        migrationFile = os.path.join(cwd, 'migration.sql')
        migrationSanitizedFile = os.path.join(cwd, 'migration_sanitized.sql')
        sanitize(migrationFile, migrationSanitizedFile)

    except Exception as e:
        print(e)

########################################################################################
