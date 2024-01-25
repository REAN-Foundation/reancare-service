import express from 'express';
import { FileResourceController } from './file.resource.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FileResourceController();

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

    router.post('/:id/upload-version', auth('General.FileResource.Upload'), controller.uploadVersion);
    router.post('/upload-binary', auth('General.FileResource.Upload'), controller.uploadBinary);
    router.post('/upload', auth('General.FileResource.Upload'), controller.upload);
    router.post('/:id/rename/:newFileName', auth('General.FileResource.Rename'), controller.rename);
    router.put('/:id', auth('General.FileResource.Update'), controller.update);

    //#endregion

    //#region Download routes

    //Routes to download the file resource

    //Following are query params
    //1. isPublicResource=true
    //2. version=v1. For multi-resolution-images, version=v1-preview or version=v1=thumbnail
    //3. referenceId=<> and optional referenceType=<>
    //4. tag=<>

    router.get('/search-download', auth('General.FileResource.SearchAndDownload'), controller.searchAndDownload);
    router.get('/:id/download-by-version-name/:version', auth('General.FileResource.DownloadByVersionName'), controller.downloadByVersionName);
    router.get('/:id/download-by-version-id/:versionId', auth('General.FileResource.DownloadByVersionId'), controller.downloadByVersionId);
    router.get('/:id/download', auth('General.FileResource.DownloadById'), controller.downloadById);

    //#endregion

    //#region Get resource info routes

    //The following routes will only return the resource metadata. No file downloads!

    //Following are query params
    //1. isPublicResource=true
    //2. version=v1. For multi-resolution-images, version=v1-preview or version=v1=thumbnail
    //3. referenceId=<> and optional referenceType=<>
    //4. tag=<>

    router.get('/search', auth('General.FileResource.Search'), controller.search);
    router.get('/:id/versions/:versionId', auth('General.FileResource.GetVersionById'), controller.getVersionById);
    router.get('/:id/versions', auth('General.FileResource.GetVersions'), controller.getVersions);
    router.get('/:id', auth('General.FileResource.GetResourceInfo'), controller.getResourceInfo);

    //#endregion

    //#region Resource deletion

    //Routes to delete resource. These routes will wipe out resources from storage and database.
    //NOTE: Please note that only those resources will be deleted which are owned by requesting user.

    router.delete('/:id/versions/:versionId', auth('General.FileResource.DeleteVersionByVersionId'), controller.deleteVersionByVersionId);
    router.delete('/:id', auth('General.FileResource.Delete'), controller.delete);

    //#endregion

    app.use('/api/v1/file-resources', router);
};
