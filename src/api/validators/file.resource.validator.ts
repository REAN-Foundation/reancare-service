import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { FileResourceMetadata, ResourceReference } from '../../domain.types/file.resource/file.resource.types';
import { FileResourceRenameDomainModel, FileResourceUploadDomainModel } from '../../domain.types/file.resource/file.resource.domain.model';
import { FileResourceSearchFilters } from '../../domain.types/file.resource/file.resource.search.types';
import * as _ from 'lodash';
import { ValidationError } from 'sequelize';
import * as expressFileupload from 'express-fileupload';
import mime from 'mime';
import path from 'path';
import { Helper } from "../../common/helper";
import { TimeHelper } from '../../common/time.helper';
import { ConfigurationManager } from '../../configs/configuration.manager';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceValidator {

    //#region Publics

    static getUploadDomainModel = (request: express.Request): FileResourceUploadDomainModel[] => {

        var currentUserId = request.currentUser.UserId;

        var references: ResourceReference[] = [];
        if (request.body.References !== undefined && request.body.References.length > 0) {
            request.body.References.array.forEach((element) => {
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
            request.body.Tags.array.forEach((element) => {
                references.push(element);
            });
        }

        var models: FileResourceUploadDomainModel[] = [];

        var fileMetadataList = FileResourceValidator.getFileMetadataList(request);

        var mimeType = null;
        if (fileMetadataList.length > 0) {
            mimeType = fileMetadataList[0].MimeType;
        }
        for (var x of fileMetadataList) {
            const model: FileResourceUploadDomainModel = {
                FileMetadata           : x,
                OwnerUserId            : request.body.OwnerUserId ?? currentUserId,
                UploadedByUserId       : currentUserId,
                IsPublicResource       : request.body.IsPublicResource ?? false,
                IsMultiResolutionImage : request.body.IsMultiResolutionImage ?? false,
                References             : references,
                Tags                   : tags,
                MimeType               : mimeType,
            };
            models.push(model);
        }

        return models;
    };

    static upload = async (request: express.Request): Promise<FileResourceUploadDomainModel[]> => {
        if (!request.files) {
            throw new ValidationError('No file uploaded!!');
        }
        await FileResourceValidator.validateBody(request);
        return FileResourceValidator.getUploadDomainModel(request);
    };

    static uploadVersion = async (request: express.Request): Promise<FileResourceMetadata> => {

        if (!request.files) {
            throw new ValidationError('No file uploaded!!');
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

        var metadataList = FileResourceValidator.getFileMetadataList(request);
        if (metadataList.length === 0) {
            throw new ValidationError('Missing file metadata!');
        }

        var metadata = metadataList[0];
        metadata.ResourceId = request.params.id;
        metadata.VersionIdentifier = request.body.Version;
        metadata.IsDefaultVersion = request.body.MakeAsDefault === 'false' ? false : true;
        
        return metadata;
    };

    static rename = async (request: express.Request): Promise<FileResourceRenameDomainModel> => {

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
    }

    static getIdAndVersion = async (request: express.Request): Promise<FileResourceMetadata> => {

        await param('id').exists()
            .escape()
            .isUUID()
            .run(request);

        await param('version').exists()
            .trim()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var model: FileResourceMetadata = {
            ResourceId        : request.params.id,
            VersionIdentifier : request.params.version,
        };

        return model;
    }

    static downloadByVersion = async (request: express.Request): Promise<FileResourceMetadata> => {
        return await FileResourceValidator.getIdAndVersion(request);
    };

    static downloadById = async (request: express.Request): Promise<string> => {
        return await FileResourceValidator.getParamId(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await FileResourceValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<FileResourceSearchFilters> => {
        await FileResourceValidator.searchQueryParams(request);
        return FileResourceValidator.getFilter(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await FileResourceValidator.getParamId(request);
    };

    static deleteByReference = async (request: express.Request): Promise<string> => {

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

    private static getFileMetadataList(request) {
        var timestamp = TimeHelper.timestamp(new Date());
        var tempUploadFolder = ConfigurationManager.UploadTemporaryFolder();
        var folderPath = path.join(tempUploadFolder, timestamp);
        var fileMetadataList = this.storeLocally(folderPath, request.files);
        return fileMetadataList;
    }

    //#endregion

    //#region Privates

    private static async searchQueryParams(request) {

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

    private static async validateBody(request) {

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

    private static getFilter(request): FileResourceSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: FileResourceSearchFilters = {
            OwnerUserId      : request.query.ownerUserId ?? null,
            IsPublicResource : request.query.isPublicResource ?? false,
            Version          : request.query.version ?? null,
            ReferenceId      : request.query.referenceId ?? null,
            ReferenceType    : request.query.referenceType ?? null,
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

    private static async getParamId(request) {
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

    static storeLocally = (tempFolder: string, files: expressFileupload.FileArray): FileResourceMetadata[] => {

        var metadataDetails = [];
        _.forEach(_.keysIn(files), (key) => {
            const file = files[key];
            if (Array.isArray(file)) {
                var fileArray = file;
                for (var fileElement of fileArray) {
                    var metadata = FileResourceValidator.moveToTempFolder(tempFolder, fileElement);
                    metadataDetails.push(metadata);
                }
            }
            else {
                var metadata = FileResourceValidator.moveToTempFolder(tempFolder, file);
                metadataDetails.push(metadata);
            }
        });
        return metadataDetails;
    }

    static moveToTempFolder = (folder, file): FileResourceMetadata => {

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
            MimeType       : mime.lookup(tempFilename),
            Size           : file.size,
            StorageKey     : null
        };
        return metadata;
    }
    
    //#endregion

}
