import express from 'express';
import { BaseValidator, Where } from './base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PersonValidator extends BaseValidator{

    constructor() {
        super();
    }

    getParamId = async(request): Promise<string> => {

        await this.validateUuid(request, 'id', Where.Param, true, false);

        this.validateRequest(request);
        return request.params.id;
    }

    addOrRemoveAddress = async (request: express.Request): Promise<{ id, addressId }> => {

        await this.validateUuid(request, 'id', Where.Param, true, false);
        await this.validateUuid(request, 'addressId', Where.Param, true,false);
        
        this.validateRequest(request);
        
        const id = request.params.id;
        const addressId = request.params.addressId;

        return { id, addressId };

    };

    getAllPersonsWithPhoneAndRole = async (request: express.Request): Promise<{ phone: string; roleId: number }> => {

        await this.validateUuid(request, 'phone', Where.Param, true, false);
        await this.validateInt(request, 'roleId', Where.Param, true, false);
        
        this.validateRequest(request);

        const phone = request.params.phone;
        const roleId = parseInt(request.params.roleId);

        return { phone, roleId };
        
    };

}
