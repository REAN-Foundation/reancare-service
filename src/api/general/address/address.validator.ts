import express from 'express';
import { AddressDomainModel } from '../../../domain.types/general/address/address.domain.model';
import { AddressSearchFilters } from '../../../domain.types/general/address/address.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AddressValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (requestBody: any): AddressDomainModel => {

        const createModel: AddressDomainModel = {
            Type        : requestBody.Type ?? 'Home',
            AddressLine : requestBody.AddressLine,
            City        : requestBody.City ?? null,
            District    : requestBody.District ?? null,
            State       : requestBody.State ?? null,
            Country     : requestBody.Country ?? null,
            PostalCode  : requestBody.PostalCode ?? null,
            Longitude   : requestBody.Longitude ?? null,
            Lattitude   : requestBody.Lattitude ?? null,
            Location    : requestBody.Location ?? null,
        };

        return createModel;
    };

    getUpdateDomainModel = (requestBody: any): AddressDomainModel => {

        const updateModel: AddressDomainModel = {
            Type        : requestBody.Type !== undefined ? requestBody.Type : undefined,
            AddressLine : requestBody.AddressLine,
            City        : requestBody.City !== undefined ? requestBody.City : undefined,
            District    : requestBody.District !== undefined ? requestBody.District : undefined,
            State       : requestBody.State !== undefined ? requestBody.State : undefined,
            Country     : requestBody.Country !== undefined ? requestBody.Country : undefined,
            PostalCode  : requestBody.PostalCode !== undefined ? requestBody.PostalCode : undefined,
            Longitude   : requestBody.Longitude !== undefined ? requestBody.Longitude : undefined,
            Lattitude   : requestBody.Lattitude !== undefined ? requestBody.Lattitude : undefined,
            Location    : requestBody.Location !== undefined ? requestBody.Location : undefined,
        };

        return updateModel;
    };

    create = async (request: express.Request): Promise<AddressDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request.body);
    };

    search = async (request: express.Request): Promise<AddressSearchFilters> => {

        await this.validateUuid(request, 'personId', Where.Query, false, false);
        await this.validateUuid(request, 'organizationId', Where.Query, false, false);
        await this.validateString(request, 'type', Where.Query, false, false);
        await this.validateString(request, 'addressLine', Where.Query, false, false);
        await this.validateString(request, 'city', Where.Query, false, false);
        await this.validateString(request, 'district', Where.Query, false, false);
        await this.validateString(request, 'state', Where.Query, false, false);
        await this.validateString(request, 'country', Where.Query, false, false);
        await this.validateString(request, 'postalCode', Where.Query, false, false);
        await this.validateString(request, 'longitudeFrom', Where.Query, false, false);
        await this.validateString(request, 'longitudeTo', Where.Query, false, false);
        await this.validateString(request, 'lattitudeFrom', Where.Query, false, false);
        await this.validateString(request, 'lattitudeTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<AddressDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getUpdateDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateString(request, 'AddressLine', Where.Body, true, false);
        await this.validateString(request, 'City', Where.Body, false, true);
        await this.validateString(request, 'District', Where.Body, false, true);
        await this.validateString(request, 'State', Where.Body, false, true);
        await this.validateString(request, 'Country', Where.Body, false, true);
        await this.validateString(request, 'Location', Where.Body, false, true);
        await this.validateString(request, 'PostalCode', Where.Body, false, true);
        await this.validateString(request, 'Longitude', Where.Body, false, true);
        await this.validateString(request, 'Lattitude', Where.Body, false, true);
        await this.validateString(request, 'State', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'AddressLine', Where.Body, false, false);
        await this.validateString(request, 'City', Where.Body, false, true);
        await this.validateString(request, 'District', Where.Body, false, true);
        await this.validateString(request, 'State', Where.Body, false, true);
        await this.validateString(request, 'Country', Where.Body, false, true);
        await this.validateString(request, 'Location', Where.Body, false, true);
        await this.validateString(request, 'PostalCode', Where.Body, false, true);
        await this.validateString(request, 'Longitude', Where.Body, false, true);
        await this.validateString(request, 'Lattitude', Where.Body, false, true);
        await this.validateString(request, 'State', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private getFilter(request): AddressSearchFilters {

        const filters: AddressSearchFilters = {
            Type           : request.query.type ?? null,
            PersonId       : request.query.personId ?? null,
            OrganizationId : request.query.organizationId ?? null,
            AddressLine    : request.query.addressLine ?? null,
            City           : request.query.city ?? null,
            District       : request.query.district ?? null,
            State          : request.query.state ?? null,
            Country        : request.query.country ?? null,
            PostalCode     : request.query.postalCode ?? null,
            LongitudeFrom  : request.query.longitudeFrom ?? null,
            LongitudeTo    : request.query.longitudeTo ?? null,
            LattitudeFrom  : request.query.lattitudeFrom ?? null,
            LattitudeTo    : request.query.lattitudeTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
