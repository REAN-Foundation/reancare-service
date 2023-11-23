import fileUpload from "express-fileupload";
import { ConfigurationManager } from "../config/configuration.manager";

export class ExpressFileUpload{

    static options:fileUpload.Options = null;

    static setFileUploadOptions = ()=>{
        const MAX_UPLOAD_FILE_SIZE = ConfigurationManager.MaxUploadFileSize();
        return ExpressFileUpload.options = {
            limits            : { fileSize: MAX_UPLOAD_FILE_SIZE },
            preserveExtension : true,
            createParentPath  : true,
            parseNested       : true,
            useTempFiles      : true,
            tempFileDir       : '/tmp/uploads/'
        };
    };

    static getExpressFileUpload = ()=>{
        return fileUpload(ExpressFileUpload.setFileUploadOptions());
    };

}
