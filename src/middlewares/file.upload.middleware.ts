import fileUpload from "express-fileupload";
import { ConfigurationManager } from "./../config/configuration.manager";
import express from "express";

/////////////////////////////////////////////////////////////////////////

export const fileUploadMiddleware = (router: express.Router) => {
    const MAX_UPLOAD_FILE_SIZE = ConfigurationManager.MaxUploadFileSize();

    router.use(fileUpload({
        limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
        preserveExtension: true,
        createParentPath: true,
        parseNested: true,
        useTempFiles: true,
        tempFileDir: '/tmp/uploads/'
    }));
};
