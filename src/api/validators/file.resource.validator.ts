import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { ResourceReferenceItem } from '../../domain.types/file.resource/file.resource.types';
import { Helper } from '../../common/helper';
import {
    FileResourceRenameDomainModel,
    FileResourceSearchDownloadDomainModel,
    FileResourceUploadDomainModel,
    FileResourceVersionDomainModel,
} from '../../domain.types/file.resource/file.resource.domain.model';
import { FileResourceSearchFilters } from '../../domain.types/file.resource/file.resource.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceValidator {

    //#region Publics

    static getUploadDomainModel = (request: express.Request): FileResourceUploadDomainModel => {
        var currentUserId = request.currentUser.UserId;

        var references: ResourceReferenceItem[] = [];
        if (request.body.References !== undefined && request.body.References.length > 0) {
            request.body.References.array.forEach((element) => {
                var item: ResourceReferenceItem = {
                    ItemId   : element.ItemId,
                    ItemType : element.ItemType ?? null,
                    Keyword  : element.Keyword ?? null,
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

        const domainModel: FileResourceUploadDomainModel = {
            OwnerUserId            : request.body.OwnerUserId ?? currentUserId,
            UploadedByUserId       : currentUserId,
            IsPublicResource       : request.body.IsPublicResource ?? false,
            IsMultiResolutionImage : request.body.IsMultiResolutionImage ?? false,
            References             : references,
            StorageKey             : null,
            Tags                   : tags,
            MimeType               : null,
            MetaInformation        : null,
            SizeInKB               : null,
            UploadedDate           : new Date(),
        };

        return domainModel;
    };

    static upload = async (request: express.Request): Promise<FileResourceUploadDomainModel> => {
        await FileResourceValidator.validateBody(request);
        return FileResourceValidator.getUploadDomainModel(request);
    };

    static uploadVersion = async (request: express.Request): Promise<FileResourceVersionDomainModel> => {
        return await FileResourceValidator.getIdAndVersion(request);
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

    static getIdAndVersion = async (request: express.Request): Promise<FileResourceVersionDomainModel> => {

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

        var model: FileResourceVersionDomainModel = {
            ResourceId : request.params.id,
            Version    : request.params.version,
            StorageKey : null
        };

        return model;
    }

    static searchAndDownload = async (request): Promise<FileResourceSearchDownloadDomainModel> => {

        await FileResourceValidator.searchQueryParams(request);

        var model: FileResourceSearchDownloadDomainModel = {
            OwnerUserId      : request.query.ownerUserId ?? null,
            IsPublicResource : request.query.isPublicResource ?? false,
            Version          : request.query.version ?? null,
            ReferenceId      : request.query.referenceId ?? null,
            ReferenceType    : request.query.referenceType ?? null,
            Tag              : request.query.tag ?? null
        };

        return model;
    };

    static downloadByVersion = async (request: express.Request): Promise<FileResourceVersionDomainModel> => {
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

    //#endregion

}
