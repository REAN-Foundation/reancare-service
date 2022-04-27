import fs from 'fs';
import path from 'path';
import { Logger } from '../../../common/logger';
import { IFileStorageService } from '../interfaces/file.storage.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class CustomFileStorageService implements IFileStorageService {

    _storagePath: string = path.join(process.env.STORAGE_BUCKET, process.env.NODE_ENV);

    //#region Publics

    exists = async (storageKey: string): Promise<string> => {
        try {
            const location = path.join(this._storagePath, storageKey);
            var fileExists = fs.existsSync(location);
            if (!fileExists) {
                return null;
            }
            return storageKey;
        }
        catch (error) {
            Logger.instance().log(JSON.stringify(error, null, 2));
            return null;
        }
    };
    
    upload = async (storageKey: string, localFilePath?: string): Promise<string> => {
        try {
            const fileContent = fs.readFileSync(localFilePath);
            const location = path.join(this._storagePath, storageKey);

            const directory = path.dirname(location);
            await fs.promises.mkdir(directory, { recursive: true });

            fs.writeFileSync(location, fileContent, { flag: 'w' });
            return storageKey;
        }
        catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    download = async (storageKey: string, localFilePath: string): Promise<string> => {
        try {
            const location = path.join(this._storagePath, storageKey);
            const fileContent = fs.readFileSync(location);

            const directory = path.dirname(localFilePath);
            await fs.promises.mkdir(directory, { recursive: true });

            fs.writeFileSync(localFilePath, fileContent, { flag: 'w' });
            return localFilePath;
        }
        catch (error) {
            Logger.instance().log(error.message);
            return null;
        }
    };

    rename = async (storageKey: string, newFileName: string): Promise<boolean> => {
        try {
            var oldPath = path.join(this._storagePath, storageKey);
            var tokens = oldPath.split('/');
            var existingFileName = tokens[tokens.length - 1];
            var newPath = oldPath.replace(existingFileName, newFileName);
            if (newPath === oldPath){
                throw new Error('Old and new file identifiers are same!');
            }
            fs.renameSync(oldPath, newPath);
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    delete = async (storageKey: string): Promise<boolean> => {
        try {
            const location = path.join(this._storagePath, storageKey);
            fs.unlinkSync(location);
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getShareableLink(storageKey: string, _durationInMinutes: number): string {
        return path.join(this._storagePath, storageKey);
    }

    //#endregion

}
