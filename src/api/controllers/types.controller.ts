import express from 'express';
import { ApiError } from '../../common/api.error';
import { ResponseHandler } from '../../common/response.handler';
import { BloodGroupList, MaritalStatusList, SeverityList } from '../../domain.types/miscellaneous/system.types';
import { TypesService } from '../../services/types.service';
import { Loader } from '../../startup/loader';
import { BaseController } from './base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesController extends BaseController {

    //#region member variables and constructors

    _service: TypesService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(TypesService);
    }

    //#endregion

    //#region Action methods

    getPersonRoleTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.GetPersonRoleTypes', request, response, false);

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
            await this.setContext('Types.GetOrganizationTypes', request, response, false);

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

            await this.setContext('Types.GetGenderTypes', request, response, false);

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
    
    getBloodGroups = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Types.GetBloodGroups', request, response, false);

            ResponseHandler.success(request, response, 'Blood group types retrieved successfully!', 200, {
                BloodGroups : BloodGroupList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getMaritalStatuses = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Types.GetMaritalStatuses', request, response, false);

            ResponseHandler.success(request, response, 'Marital status types retrieved successfully!', 200, {
                MaritalStatuses : MaritalStatusList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getSeverities = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Types.GetSeverities', request, response, false);

            ResponseHandler.success(request, response, 'Severity types retrieved successfully!', 200, {
                Severities : SeverityList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPriorityTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('HealthPriority.GetPriorityTypes', request, response, false);

            const tags : string = request.query.tags as string ?? null;
            const priorityTypes = await this._service.getPriorityTypes(tags);
            if (priorityTypes.length === 0) {
                throw new ApiError(400, 'Cannot fetch priorities types!');
            }

            ResponseHandler.success(request, response, 'Fetched priority types successfully!', 201, {
                PriorityTypes : priorityTypes,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    //#endregion

}
