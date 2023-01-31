import express from 'express';
import * as expressFileupload from 'express-fileupload';
import { body, param, query, validationResult } from 'express-validator';
import * as _ from 'lodash';
import path from 'path';
import { InputValidationError } from '../../../common/input.validation.error';
import { Helper } from "../../../common/helper";
import { TimeHelper } from '../../../common/time.helper';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { FileResourceRenameDomainModel, FileResourceUpdateModel, FileResourceUploadDomainModel } from '../../../domain.types/general/file.resource/file.resource.domain.model';
import { FileResourceSearchFilters } from '../../../domain.types/general/file.resource/file.resource.search.types';
import { DownloadDisposition, FileResourceMetadata, ResourceReference } from '../../../domain.types/general/file.resource/file.resource.types';
import { BaseValidator } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceValidator extends BaseValidator{

    constructor() {
        super();
    }

    //#region Publics

    getUploadDomainModel = (request: express.Request): FileResourceUploadDomainModel[] => {

        var currentUserId = request.currentUser.UserId;
        var models: FileResourceUploadDomainModel[] = [];
        var fileMetadataList = this.getFileMetadataList(request);

        var mimeType = null;
        if (fileMetadataList.length > 0) {
            mimeType = fileMetadataList[0].MimeType;
        }

        for (var x of fileMetadataList) {
            const model: FileResourceUploadDomainModel = {
                FileMetadata           : x,
                OwnerUserId            : request.body.OwnerUserId ?? currentUserId,
                UploadedByUserId       : currentUserId,
                IsPublicResource       : request.body.IsPublicResource && request.body.IsPublicResource === 'true' ? true : false,
                IsMultiResolutionImage : request.body.IsMultiResolutionImage && request.body.IsMultiResolutionImage === 'true' ? true : false,
                MimeType               : mimeType,
            };
            models.push(model);
        }

        return models;
    };

    upload = async (request: express.Request): Promise<FileResourceUploadDomainModel[]> => {
        if (!request.files) {
            Helper.handleValidationError('No file uploaded!!');
        }
        await this.validateBody(request);
        return this.getUploadDomainModel(request);
    };

    update = async (request: express.Request): Promise<FileResourceUpdateModel> => {

        await param('id').exists()
            .escape()
            .isUUID()
            .run(request);

        await body('References').optional()
            .run(request);

        await body('Tags').optional()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var references: ResourceReference[] = [];
        if (request.body.References !== undefined && request.body.References.length > 0) {
            request.body.References.forEach((element) => {
                var item: ResourceReference = {
                    ItemId   : element.ItemId,
                    ItemType : element.ItemType ?? null,
                    Keyword  : element.Keyword ?? null
                };
                references.push(item);
            });
        }

        var tags: string[] = [];
        if (request.body.Tags !== undefined && request.body.Tags.length > 0) {
            request.body.Tags.forEach((element) => {
                tags.push(element);
            });
        }

        var updateModel : FileResourceUpdateModel = {
            ResourceId : request.params.id,
            References : references,
            Tags       : tags
        };

        return updateModel;
    };

    uploadVersion = async (request: express.Request): Promise<FileResourceMetadata> => {

        if (!request.files) {
            throw new InputValidationError(['No file uploaded!!']);
        }

        await param('id').exists()
            .escape()
            .isUUID()
            .run(request);

        await body('Version').optional()
            .trim()
            .run(request);

        await body('MakeAsDefault').optional()
            .trim()
            .isBoolean()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var metadataList = this.getFileMetadataList(request);
        if (metadataList.length === 0) {
            throw new InputValidationError(['Missing file metadata!']);
        }

        var metadata = metadataList[0];
        metadata.ResourceId = request.params.id;
        metadata.Version = request.body.Version;
        metadata.IsDefaultVersion = request.body.MakeAsDefault === 'false' ? false : true;

        return metadata;
    };

    rename = async (request: express.Request): Promise<FileResourceRenameDomainModel> => {

        await param('id').exists()
            .escape()
            .isUUID()
            .run(request);

        await param('newFileName').exists()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var domainModel: FileResourceRenameDomainModel = {
            id          : request.params.id,
            NewFileName : request.params.newFileName
        };

        return domainModel;
    };

    getByVersionName = async (request: express.Request): Promise<FileResourceMetadata> => {

        await param('id').exists()
            .escape()
            .isUUID()
            .run(request);

        await param('version').exists()
            .trim()
            .run(request);

        await query('disposition').optional()
            .trim()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var disposition = this.getDownloadDisposition(request);

        var metadata: FileResourceMetadata = {
            ResourceId  : request.params.id,
            Version     : request.params.version,
            Disposition : disposition
        };

        return metadata;
    };

    getByVersionId = async (request: express.Request): Promise<FileResourceMetadata> => {

        await param('id').exists()
            .escape()
            .isUUID()
            .run(request);

        await param('versionId').exists()
            .trim()
            .isUUID()
            .run(request);

        await query('disposition').optional()
            .trim()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var disposition = this.getDownloadDisposition(request);

        var metadata: FileResourceMetadata = {
            ResourceId  : request.params.id,
            VersionId   : request.params.versionId,
            Disposition : disposition
        };

        return metadata;
    };

    downloadById = async (request: express.Request): Promise<FileResourceMetadata> => {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        await query('disposition').optional()
            .trim()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var disposition = this.getDownloadDisposition(request);

        var metadata: FileResourceMetadata = {
            ResourceId  : request.params.id,
            Disposition : disposition
        };

        return metadata;
    };

    getById = async (request: express.Request): Promise<string> => {
        return await this.getParamId(request);
    };

    search = async (request: express.Request): Promise<FileResourceSearchFilters> => {
        await this.searchQueryParams(request);
        return this.getFilter(request);
    };

    delete = async (request: express.Request): Promise<string> => {
        return await this.getParamId(request);
    };

    deleteByReference = async (request: express.Request): Promise<string> => {

        await param('referenceId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.referenceId;
    };

    public getDownloadDisposition(request) {
        var disposition = DownloadDisposition.Auto;
        if (request.query.disposition) {
            if (request.query.disposition === 'inline') {
                disposition = DownloadDisposition.Inline;
            }
            else if (request.query.disposition === 'stream') {
                disposition = DownloadDisposition.Stream;
            }
            else {
                disposition = DownloadDisposition.Attachment;
            }
        }
        return disposition;
    }

    public getFileMetadataList(request) {
        var timestamp = TimeHelper.timestamp(new Date());
        var tempUploadFolder = ConfigurationManager.UploadTemporaryFolder();
        var folderPath = path.join(tempUploadFolder, timestamp);
        var fileMetadataList = this.storeLocally(folderPath, request.files);
        return fileMetadataList;
    }

    //#endregion

    //#region Privates

    private async searchQueryParams(request) {

        await query('ownerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('isPublicResource').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('version').optional()
            .trim()
            .escape()
            .run(request);

        await query('referenceId').optional()
            .trim()
            .isUUID()
            .escape()
            .run(request);

        await query('referenceType').optional()
            .trim()
            .escape()
            .run(request);

        await query('referenceKeyword').optional()
            .trim()
            .escape()
            .run(request);

        await query('tag').optional()
            .trim()
            .escape()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private async validateBody(request) {

        await body('FileName').optional()
            .trim()
            .escape()
            .run(request);

        await body('OwnerUserId').optional()
            .trim()
            .escape()
            .run(request);

        await body('IsPublicResource').optional()
            .trim()
            .escape()
            .run(request);

        await body('IsMultiResolutionImage').optional()
            .trim()
            .escape()
            .run(request);

        await body('References').optional()
            .run(request);

        await body('Tags').optional()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private getFilter(request): FileResourceSearchFilters {

        const pageIndex = request.query.pageIndex ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: FileResourceSearchFilters = {
            OwnerUserId      : request.query.ownerUserId ?? null,
            IsPublicResource : request.query.isPublicResource ?? null,
            ReferenceId      : request.query.referenceId ?? null,
            ReferenceType    : request.query.referenceType ?? null,
            ReferenceKeyword : request.query.referenceKeyword ?? null,
            Tag              : request.query.tag ?? null,
            CreatedDateFrom  : request.query.createdDateFrom ?? null,
            CreatedDateTo    : request.query.createdDateTo ?? null,
            OrderBy          : request.query.orderBy ?? 'CreatedAt',
            Order            : request.query.order ?? 'descending',
            PageIndex        : pageIndex,
            ItemsPerPage     : itemsPerPage,
        };
        return filters;
    }

    private async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

    storeLocally = (tempFolder: string, files: expressFileupload.FileArray): FileResourceMetadata[] => {

        var metadataDetails = [];
        _.forEach(_.keysIn(files), (key) => {
            const file = files[key];
            if (Array.isArray(file)) {
                var fileArray = file;
                for (var fileElement of fileArray) {
                    var metadata = this.moveToTempFolder(tempFolder, fileElement);
                    metadataDetails.push(metadata);
                }
            }
            else {
                var metadata = this.moveToTempFolder(tempFolder, file);
                metadataDetails.push(metadata);
            }
        });
        return metadataDetails;
    };

    moveToTempFolder = (folder, file): FileResourceMetadata => {

        var timestamp = TimeHelper.timestamp(new Date());
        var filename = file.name;
        var ext = Helper.getFileExtension(filename);

        filename = filename.replace('.' + ext, "");
        filename = filename.replace(' ', "_");
        filename = filename + '_' + timestamp + '.' + ext;
        var tempFilename = path.join(folder, filename);

        var moveIt = async (m, tempFilename) => {

            return new Promise((resolve, reject) => {
                m.mv(tempFilename, function (error) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(true);
                });
            });

        };

        (async () => {
            await moveIt(file, tempFilename);
        })();

        var metadata: FileResourceMetadata = {
            FileName       : filename,
            OriginalName   : file.name,
            SourceFilePath : tempFilename,
            MimeType       : Helper.getMimeType(tempFilename),
            Size           : file.size,
            StorageKey     : null
        };
        return metadata;
    };

    //#endregion

}
