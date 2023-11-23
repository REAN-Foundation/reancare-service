import multer from 'multer';
import { ConfigurationManager } from '../config/configuration.manager';

export class Multer{

    static storage:multer.StorageEngine = null;

    static setMulterStorage = ()=>{
        Multer.storage = multer.diskStorage({
            destination : function (req, file, cb) {
                cb(null, ConfigurationManager.UploadTemporaryFolder());
            },
            filename : function (req, file, cb) {
                cb(null, file.originalname);
            }
        });
    };

    static getMulterInstance = ()=>{
        Multer.setMulterStorage();
        return multer({ storage: Multer.storage });
    };

}
