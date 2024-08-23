import express, { query } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Helper } from '../../common/helper';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PersonValidator  extends BaseValidator {

    constructor() {
        super();
    }

    validateId = async (request: express.Request): Promise<string> => {
        return await this.getParamId(request);
    };

    private async getParamId(request): Promise<string> {

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

    addOrRemoveAddress = async (request: express.Request): Promise<{ id: string; addressId: string }> => {

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

    getPersonRolesByPhone = async (request: express.Request): Promise<string> => {
        await this.validateString(request, 'phone', Where.Query, true, false);
        this.validateRequest(request);
        return request.query.phone as string;
    };

    getPersonRolesByEmail = async (request: express.Request): Promise<string> => {
        await this.validateEmail(request, 'email', Where.Query, true, false);
        this.validateRequest(request);
        return request.query.email as string;
    };

    static getAllPersonsWithPhoneAndRole = async (request: express.Request)
        : Promise<{ phone: string; roleId: number }> => {

        await param('phone').trim()
            .escape()
            .run(request);

        await param('roleId').trim()
            .escape()
            .isInt()
            .toInt()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        const phone = request.params.phone;
        const roleId = parseInt(request.params.roleId);

        return { phone, roleId };
    };

    static getAllPersonsWithPhone = async (request: express.Request)
        : Promise<{ phone: string }> => {

        await param('phone').trim()
            .escape()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        const phone = request.params.phone;

        return { phone };
    };

}
