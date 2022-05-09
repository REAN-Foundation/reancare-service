import express from 'express';
import { OrganizationDomainModel } from '../../domain.types/organization/organization.domain.model';
import { OrganizationSearchFilters } from '../../domain.types/organization/organization.search.types';
import { BaseValidator, Where } from './base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class OrganizationValidator extends BaseValidator {

    constructor(){
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
            AddressIds                       : request.body.AddressIds ?? null,
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

    private async validateCreateBody(request) {
        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, true);
        await this.validateString(request, 'contactUserId', Where.Query, false, true);
        await this.validateString(request, 'contactPhone', Where.Query, false, false);
        await this.validateString(request, 'contactEmail', Where.Query, false, true);
        await this.validateString(request, 'parentOrganizationId', Where.Query, false, true);
        await this.validateString(request, 'about', Where.Query, false, true);
        await this.validateDate(request, 'operationalSinceFrom', Where.Query, false, true);
        await this.validateDate(request, 'operationalSinceTo', Where.Query, false, true);
        await this.validateUuid(request, 'location', Where.Query, false, false);
        await this.validateBoolean(request, 'isHealthFacility', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'orderBy', Where.Query, false, false);
        await this.validateUuid(request, 'order', Where.Query, false, false);
        await this.validateUuid(request, 'pageIndex', Where.Query, false, false);
        await this.validateUuid(request, 'itemsPerPage', Where.Query, false, false);

        this.validateRequest(request);
    }
    
    search = async (request: express.Request): Promise<OrganizationSearchFilters> => {
        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'contactUserId', Where.Query, false, false);
        await this.validateString(request, 'contactPhone', Where.Query, false, false);
        await this.validateString(request, 'contactEmail', Where.Query, false, false);
        await this.validateString(request, 'parentOrganizationId', Where.Query, false, false);
        await this.validateString(request, 'about', Where.Query, false, false);
        await this.validateDate(request, 'operationalSinceFrom', Where.Query, false, false);
        await this.validateDate(request, 'operationalSinceTo', Where.Query, false, false);
        await this.validateUuid(request, 'location', Where.Query, false, false);
        await this.validateBoolean(request, 'isHealthFacility', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'orderBy', Where.Query, false, false);
        await this.validateUuid(request, 'order', Where.Query, false, false);
        await this.validateUuid(request, 'pageIndex', Where.Query, false, false);
        await this.validateUuid(request, 'itemsPerPage', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);
       
    };

    private getFilter(request): OrganizationSearchFilters {
        
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

    update = async (request: express.Request): Promise<OrganizationDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateUpdateBody (request){
        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'contactUserId', Where.Query, false, false);
        await this.validateString(request, 'contactPhone', Where.Query, false, false);
        await this.validateString(request, 'contactEmail', Where.Query, false, false);
        await this.validateString(request, 'parentOrganizationId', Where.Query, false, false);
        await this.validateString(request, 'about', Where.Query, false, false);
        await this.validateDate(request, 'operationalSinceFrom', Where.Query, false, false);
        await this.validateDate(request, 'operationalSinceTo', Where.Query, false, false);
        await this.validateUuid(request, 'location', Where.Query, false, false);
        await this.validateBoolean(request, 'isHealthFacility', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'orderBy', Where.Query, false, false);
        await this.validateUuid(request, 'order', Where.Query, false, false);
        await this.validateUuid(request, 'pageIndex', Where.Query, false, false);
        await this.validateUuid(request, 'itemsPerPage', Where.Query, false, false);

        this.validateRequest(request);
    }

    getByContactUserId = async (request: express.Request) => {
        await this.validateString(request, 'contactUserId', Where.Query, true, false);
        
        this.validateRequest(request);
        return request.params.contactUserId;
    };

    public async getParamId(request) {
        await this.validateString(request, 'id', Where.Query, false, false);
        
        this.validateRequest(request);
        return request.params.id;
    }

    addOrRemoveAddress = async (request: express.Request): Promise<{ id: string; addressId: string }> => {

        await this.validateString(request, 'id', Where.Query, false, false);
        await this.validateString(request, 'id', Where.Query, false, false);
    
        this.validateRequest(request);

        const id = request.params.id;
        const addressId = request.params.addressId;

        return { id, addressId };
    };

    addOrRemovePerson = async (request: express.Request): Promise<{ id: string; personId: string }> => {
        await this.validateString(request, 'id', Where.Query, false, false);
        await this.validateString(request, 'personId', Where.Query, false, false);

        this.validateRequest(request);

        const id = request.params.id;
        const personId = request.params.personId;

        return { id, personId };
    };

}
