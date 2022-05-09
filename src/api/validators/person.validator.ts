import express from 'express';
import { BaseValidator, Where } from './base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PersonValidator extends BaseValidator{

    constructor() {
        super();
    }

    getParamId = async(request): Promise<string> => {

        await this.validateString(request, 'id', Where.Body, false, false);

        this.validateRequest(request);
        return request.params.id;
    }

    addOrRemoveAddress = async (request: express.Request): Promise<{ id, addressId }> => {
        await this.validateString(request, 'id', Where.Body, false, true);
        await this.validateString(request, 'addressId', Where.Body, false, true);
        
        this.validateRequest(request);
        
        const id = request.params.id;
        const addressId = request.params.addressId;

        return { id, addressId };

    };

    getAllPersonsWithPhoneAndRole = async (request: express.Request): Promise<{ phone: string; roleId: number }> => {

        await this.validateString(request, 'phone', Where.Body, false, true);
        await this.validateUuid(request, 'roleId', Where.Body, false, true);
        
        this.validateRequest(request);

        const phone = request.params.phone;
        const roleId = parseInt(request.params.roleId);

        return { phone, roleId };
        
    };

}
