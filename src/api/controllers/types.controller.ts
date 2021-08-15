import express from 'express';

import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { ApiError } from '../../common/api.error';
import { TypesService } from '../../services/types.service';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesController {

    //#region member variables and constructors

    _service: TypesService = null;

    constructor() {
        this._service = Loader.container.resolve(TypesService);
    }

    //#endregion

    //#region Action methods

    getPersonRoleTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Types.GetPersonRoleTypes';

            const types = await this._service.getPersonRoleTypes();
            if (types === null || types.length === 0) {
                throw new ApiError(400, 'Cannot get person role types!');
            }

            ResponseHandler.success(request, response, 'Person role types retrieved successfully!', 200, {
                PersonRoleTypes : types,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getOrganizationTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Types.GetOrganizationTypes';

            const types = await this._service.getOrganizationTypes();
            if (types === null || types.length === 0) {
                throw new ApiError(400, 'Cannot get organization types!');
            }

            ResponseHandler.success(request, response, 'Organization types retrieved successfully!', 200, {
                OrganizationTypes : types,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGenderTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Types.GetGenderTypes';

            const types = await this._service.getGenderTypes();
            if (types === null || types.length === 0) {
                throw new ApiError(400, 'Cannot get gender types!');
            }

            ResponseHandler.success(request, response, 'Gender types retrieved successfully!', 200, {
                GenderTypes : types,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
