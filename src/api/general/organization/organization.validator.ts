import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { OrganizationDomainModel } from '../../../domain.types/general/organization/organization.domain.model';
import { OrganizationSearchFilters } from '../../../domain.types/general/organization/organization.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationValidator {

    static getDomainModel = (request: express.Request): OrganizationDomainModel => {
        const organizationModel: OrganizationDomainModel = {
            Type                             : request.body.Type ?? null,
            Name                             : request.body.Name ?? null,
            ContactUserId                    : request.body.ContactUserId ?? null,
            ContactPhone                     : request.body.ContactPhone ?? null,
            ContactEmail                     : request.body.ContactEmail ?? null,
            About                            : request.body.About ?? null,
            OperationalSince                 : request.body.OperationalSince ?? null,
            ParentOrganizationId             : request.body.ParentOrganizationId ?? null,
            AddressIds                       : request.body.AddressIds ?? null,
            ImageResourceId                  : request.body.ImageResourceId ?? null,
            IsHealthFacility                 : request.body.IsHealthFacility ?? null,
            NationalHealthFacilityRegistryId : request.body.NationalHealthFacilityRegistryId ?? null,
        };

        return organizationModel;
    };

    static create = async (request: express.Request): Promise<OrganizationDomainModel> => {
        await OrganizationValidator.validateBody(request, true);
        return OrganizationValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await OrganizationValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await OrganizationValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<OrganizationSearchFilters> => {
        await query('type').optional()
            .trim()
            .escape()
            .run(request);

        await query('name').optional()
            .trim()
            .escape()
            .run(request);

        await query('contactUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('contactPhone')
            .optional()
            .notEmpty()
            .trim()
            .escape()
            .customSanitizer(Helper.sanitizePhone)
            .custom(Helper.validatePhone)
            .run(request);

        await body('contactEmail').optional()
            .trim()
            .isEmail()
            .escape()
            .normalizeEmail()
            .run(request);

        await query('parentOrganizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('about').optional()
            .trim()
            .run(request);

        await query('operationalSinceFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('operationalSinceTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('location').optional()
            .trim()
            .escape()
            .run(request);

        await query('isHealthFacility').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('createdDateTo').optional()
            .trim()
            .escape()
            .toDate()
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

        return OrganizationValidator.getFilter(request);
    };

    private static async validateBody(request, create = true) {
        await body('Type').optional()
            .trim()
            .escape()
            .run(request);

        await body('Name').optional()
            .trim()
            .escape()
            .run(request);

        await body('ContactUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        if (create) {
            await body('ContactPhone')
                .exists()
                .notEmpty()
                .trim()
                .escape()
                .customSanitizer(Helper.sanitizePhone)
                .custom(Helper.validatePhone)
                .run(request);
        } else {
            await body('ContactPhone')
                .optional()
                .notEmpty()
                .trim()
                .escape()
                .customSanitizer(Helper.sanitizePhone)
                .custom(Helper.validatePhone)
                .run(request);
        }

        await body('ContactEmail').optional()
            .trim()
            .isEmail()
            .escape()
            .normalizeEmail()
            .run(request);

        await body('ParentOrganizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('About').optional()
            .trim()
            .escape()
            .run(request);

        await body('OperationalSince').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await body('AddressId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('ImageResourceId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('IsHealthFacility').optional()
            .trim()
            .escape()
            .isBoolean()
            .toBoolean()
            .run(request);

        await body('NationalHealthFacilityRegistryId').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): OrganizationSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: OrganizationSearchFilters = {
            Type                 : request.query.type ?? null,
            Name                 : request.query.name ?? null,
            ContactPhone         : request.query.contactPhone ?? null,
            ContactEmail         : request.query.contactEmail ?? null,
            OperationalSinceFrom : request.query.operationalSinceFrom ?? null,
            OperationalSinceTo   : request.query.operationalSinceTo ?? null,
            CreatedDateFrom      : request.query.createdDateFrom ?? null,
            CreatedDateTo        : request.query.createdDateTo ?? null,
            OrderBy              : request.query.orderBy ?? 'CreatedAt',
            Order                : request.query.order ?? 'descending',
            PageIndex            : pageIndex,
            ItemsPerPage         : itemsPerPage,
        };
        return filters;
    }

    static update = async (request: express.Request): Promise<OrganizationDomainModel> => {
        const id = await OrganizationValidator.getParamId(request);
        await OrganizationValidator.validateBody(request, false);
        const domainModel = OrganizationValidator.getDomainModel(request);
        domainModel.id = id;
        return domainModel;
    };

    static getByContactUserId = async (request: express.Request) => {
        await param('contactUserId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.contactUserId;
    };

    public static async getParamId(request) {
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

    static addOrRemoveAddress = async (request: express.Request): Promise<{ id: string; addressId: string }> => {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        await param('addressId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        const id = request.params.id;
        const addressId = request.params.addressId;

        return { id, addressId };
    };

    static addOrRemovePerson = async (request: express.Request): Promise<{ id: string; personId: string }> => {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        await param('personId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        const id = request.params.id;
        const personId = request.params.personId;

        return { id, personId };
    };

}
