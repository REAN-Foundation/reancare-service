import multer from 'multer';
import { ConfigurationManager } from '../config/configuration.manager';
import { DateStringFormat } from '../domain.types/miscellaneous/time.types';
import { TimeHelper } from '../common/time.helper';
import path from 'path';
import * as fs from 'fs';

export class Multer {

    static storage:multer.StorageEngine = null;

    static setMulterStorage = ()=>{
        Multer.storage = multer.diskStorage({
            destination : function (req, file, cb) {
                const uploadFolder = ConfigurationManager.UploadTemporaryFolder();
                var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
                var fileFolder = path.join(uploadFolder, dateFolder);
                if (!fs.existsSync(`${fileFolder}`)) {
                    fs.mkdirSync(`${fileFolder}`, { recursive: true });
                }
                cb(null, fileFolder);
            },
            filename : function (req, file, cb) {
                cb(null, file.originalname);
            },
        });
    };

    static getMulterInstance = ()=>{
        Multer.setMulterStorage();
        return multer({ storage: Multer.storage });
    };

}
