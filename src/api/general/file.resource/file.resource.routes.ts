import express from 'express';
import { FileResourceController } from './file.resource.controller';
import { auth } from '../../../auth/auth.handler';
import { FileResourceAuth } from './file.resource.auth';
import { fileUploadMiddleware } from '../../../middlewares/file.upload.middleware';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FileResourceController();
    fileUploadMiddleware(router);

    //#region Upload routes

    //Routes to upload file resources. One can set various options in the post body.

    //- IsPublicResource - Allow download resource without authentication. Suitable for profile images
    //- IsMultiResolutionImage -
    //        - If the uploaded image is jpeg or png, this option will create and store 3 versions:
    //          1. Original,
    //          2. Preview(640,480) keeping aspect ratio same,
    //          3. Thumbnail (200x200)
    //- References - This option allows to associate references with file resources. References will be associated
    //               in the form of reference item id and reference item type
    //- Tags - This option allows to associate tags with file resources.

    //Upload a new version of existing resource

    router.post('/:id/upload-version', auth(FileResourceAuth.upload), controller.uploadVersion);
    router.post('/upload-binary', auth(FileResourceAuth.upload), controller.uploadBinary);
    router.post('/upload', auth(FileResourceAuth.upload), controller.upload);
    router.post('/:id/rename/:newFileName', auth(FileResourceAuth.rename), controller.rename);
    router.put('/:id', auth(FileResourceAuth.update), controller.update);

    //#endregion

    //#region Download routes

    //Routes to download the file resource

    //Following are query params
    //1. isPublicResource=true
    //2. version=v1. For multi-resolution-images, version=v1-preview or version=v1=thumbnail
    //3. referenceId=<> and optional referenceType=<>
    //4. tag=<>

    router.get('/search-download', auth(FileResourceAuth.searchAndDownload), controller.searchAndDownload);
    router.get('/:id/download-by-version-name/:version', auth(FileResourceAuth.downloadByVersionName), controller.downloadByVersionName);
    router.get('/:id/download-by-version-id/:versionId', auth(FileResourceAuth.downloadByVersionId), controller.downloadByVersionId);
    router.get('/:id/download', auth(FileResourceAuth.downloadById), controller.downloadById);
    //#endregion

    //#region Get resource info routes

    //The following routes will only return the resource metadata. No file downloads!

    //Following are query params
    //1. isPublicResource=true
    //2. version=v1. For multi-resolution-images, version=v1-preview or version=v1=thumbnail
    //3. referenceId=<> and optional referenceType=<>
    //4. tag=<>

    router.get('/search', auth(FileResourceAuth.search), controller.search);
    router.get('/:id/versions/:versionId', auth(FileResourceAuth.getVersionById), controller.getVersionById);
    router.get('/:id/versions', auth(FileResourceAuth.getVersions), controller.getVersions);
    router.get('/:id', auth(FileResourceAuth.getResourceInfo), controller.getResourceInfo);

    //#endregion

    //#region Resource deletion

    //Routes to delete resource. These routes will wipe out resources from storage and database.
    //NOTE: Please note that only those resources will be deleted which are owned by requesting user.

    router.delete('/:id/versions/:versionId', auth(FileResourceAuth.deleteVersionByVersionId), controller.deleteVersionByVersionId);
    router.delete('/:id', auth(FileResourceAuth.delete), controller.delete);

    //#endregion

    app.use('/api/v1/file-resources', router);
};
