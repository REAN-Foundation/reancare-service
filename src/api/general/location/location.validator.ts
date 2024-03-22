import express from 'express';
import { LocationDomainModel } from '../../../domain.types/general/location/location.domain.model';
import { AddressDomainModel } from '../../../domain.types/general/address/address.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class LocationValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (requestBody: any): LocationDomainModel => {

        const createModel: LocationDomainModel = {
            PatientUserId  : requestBody.PatientUserId,
            City           : requestBody.City ?? null,
            Longitude      : requestBody.Longitude ?? null,
            Lattitude      : requestBody.Lattitude ?? null,
            CurrentTimezone: requestBody.CurrentTimezone ?? null,
            IsActive       : requestBody.IsActive ?? true,

        };

        return createModel;
    };

    create = async (request: express.Request): Promise<LocationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request.body);
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'City', Where.Body, false, true);
        await this.validateString(request, 'Longitude', Where.Body, false, true);
        await this.validateString(request, 'Lattitude', Where.Body, false, true);
        await this.validateString(request, 'CurrentTimezone', Where.Body, false, true);
        await this.validateBoolean(request, 'IsActive', Where.Body, false, true);
        await this.validateRequest(request);
    }

}
