import express from 'express';
import { OrganizationDomainModel } from '../../../domain.types/general/organization/organization.domain.model';
import { OrganizationSearchFilters } from '../../../domain.types/general/organization/organization.search.types';
import { BaseValidator, Where } from '../../../api/base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): OrganizationDomainModel => {
        const organizationModel: OrganizationDomainModel = {
            Type                             : request.body.Type ?? null,
            Name                             : request.body.Name ?? null,
            ContactUserId                    : request.body.ContactUserId ?? null,
            ContactPhone                     : request.body.ContactPhone ?? null,
            ContactEmail                     : request.body.ContactEmail ?? null,
            About                            : request.body.About ?? null,
            OperationalSince                 : request.body.OperationalSince ?? null,
            ParentOrganizationId             : request.body.ParentOrganizationId ?? null,
            AddressIds                       : request.body.AddressIds ?? [],
            ImageResourceId                  : request.body.ImageResourceId ?? null,
            IsHealthFacility                 : request.body.IsHealthFacility ?? null,
            NationalHealthFacilityRegistryId : request.body.NationalHealthFacilityRegistryId ?? null,
        };
        
        return organizationModel;
    };

    create = async (request: express.Request): Promise<OrganizationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<OrganizationSearchFilters> => {

        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'contactUserId', Where.Query, false, false);
        await this.validatePhone(request, 'contactPhone', Where.Query, false, false);
        await this.validateEmail(request, 'contactEmail', Where.Query, false, false);
        await this.validateDate(request, 'operationalSinceFrom', Where.Query, false, false);
        await this.validateDate(request, 'operationalSinceTo', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<OrganizationDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'Type', Where.Body, false, false);
        await this.validateUuid(request, 'ContactUserId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, true);
        await this.validatePhone(request, 'ContactPhone', Where.Body, true, false);
        await this.validateEmail(request, 'ContactEmail', Where.Body, true, false);
        await this.validateString(request, 'About', Where.Body, false, true);
        await this.validateDate(request, 'OperationalSince', Where.Body, false, true);
        await this.validateUuid(request, 'ParentOrganizationId', Where.Body, false, true);
        await this.validateArray(request, 'AddressIds', Where.Body, false, true);
        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
        await this.validateBoolean(request, 'IsHealthFacility', Where.Body, false, true);
        await this.validateUuid(request, 'NationalHealthFacilityRegistryId', Where.Body, false, true);
        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {
        await this.validateUuid(request, 'Type', Where.Body, false, true);
        await this.validateUuid(request, 'ContactUserId', Where.Body, false, true);
        await this.validateString(request, 'Name', Where.Body, false, true);
        await this.validatePhone(request, 'ContactPhone', Where.Body, false, true);
        await this.validateEmail(request, 'ContactEmail', Where.Body, false, true);
        await this.validateString(request, 'About', Where.Body, false, true);
        await this.validateDate(request, 'OperationalSince', Where.Body, false, true);
        await this.validateUuid(request, 'ParentOrganizationId', Where.Body, false, true);
        await this.validateArray(request, 'AddressIds', Where.Body, false, true);
        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
        await this.validateBoolean(request, 'IsHealthFacility', Where.Body, false, true);
        await this.validateUuid(request, 'NationalHealthFacilityRegistryId', Where.Body, false, true);
        this.validateRequest(request);
    }

    private getFilter(request): OrganizationSearchFilters {

        var filters: OrganizationSearchFilters = {
            Type                 : request.query.type ?? null,
            Name                 : request.query.name ?? null,
            ContactUserId        : request.query.contactUserId ?? null,
            ContactPhone         : request.query.contactPhone ?? null,
            ContactEmail         : request.query.contactEmail ?? null,
            OperationalSinceFrom : request.query.operationalSinceFrom ?? null,
            OperationalSinceTo   : request.query.operationalSinceTo ?? null,
            CreatedDateFrom      : request.query.createdDateFrom ?? null,
            CreatedDateTo        : request.query.createdDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
