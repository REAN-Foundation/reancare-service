import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';
import { Helper } from '../../common/helper';
import { TypeHandler } from '../../common/type.handler';
import { ClientDomainModel } from '../../data/domain.types/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientInputValidator {
    static getDomainModel = async (clientBody: any): Promise<ClientDomainModel> => {
        var clientModel: ClientDomainModel = null;
        var address = TypeHandler.checkObj(clientBody);
        if (address != null) {
            clientModel = {
                ClientName: clientBody.ClientName ?? null,
                ClientCode: clientBody.ClientCode ?? null,
                Phone: clientBody.Phone ?? null,
                Email: clientBody.Email ?? null,
                Password: clientBody.Password ?? null,
            };
        }
        return clientModel;
    };

    static create = async (
        request: express.Request,
        response: express.Response
    ): Promise<ClientDomainModel> => {
        await body('ClientName').exists().isLength({ min: 1 }).trim().escape().run(request);
        await body('Phone').exists().trim().escape().isLength({ min: 10 }).run(request);
        await body('Email').exists().trim().escape().isEmail().isLength({ min: 5 }).run(request);
        await body('Password').exists().trim().escape().isLength({ min: 8 }).run(request);
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ClientInputValidator.getDomainModel(request);
    };
}
