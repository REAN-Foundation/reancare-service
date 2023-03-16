import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { BloodGroupList, EthnicityTypeList, MaritalStatusList, RaceTypeList, SeverityList, uuid } from '../../../domain.types/miscellaneous/system.types';
import { TypesService } from '../../../services/general/types.service';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { TypesValidator } from './types.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesController extends BaseController {

    //#region member variables and constructors

    _service: TypesService = null;
    
    _validator = new TypesValidator();

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

    getRaceTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Types.GetRaceTypes', request, response, false);

            ResponseHandler.success(request, response, 'Race types retrieved successfully!', 200, {
                RaceTypes : RaceTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getEthnicityTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Types.GetEthnicityTypes', request, response, false);

            ResponseHandler.success(request, response, 'Ethnicity types retrieved successfully!', 200, {
                EthnicityTypes : EthnicityTypeList,
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

    getLabRecordTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.LabRecords', request, response, false);

            const displayName : string = request.query.displayName as string ?? null;
            const labRecordTypes = await this._service.getLabRecordTypes(displayName);
            if (labRecordTypes.length === 0) {
                throw new ApiError(400, 'Cannot fetch lab record types!');
            }

            ResponseHandler.success(request, response, 'Fetched lab record types successfully!', 200, {
                LabRecordTypes : labRecordTypes,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createPriorityType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthPriorityType.Create', request, response);

            const domainModel = await this._validator.createPriorityType(request);
            const priorityType = await this._service.createPriorityType(domainModel);
            if (priorityType == null) {
                throw new ApiError(400, 'Cannot create priority type!');
            }

            ResponseHandler.success(request, response, 'Priority type created successfully!', 201, {
                PriorityType : priorityType,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPriorityTypeById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('HealthPriorityType.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const priorityType = await this._service.getPriorityTypeById(id);
            if (priorityType == null) {
                throw new ApiError(404, 'Priority type not found.');
            }

            ResponseHandler.success(request, response, 'Priority type retrieved successfully!', 200, {
                PriorityType : priorityType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updatePriorityType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('HealthPriorityType.Update', request, response);

            const domainModel = await this._validator.updatePriorityType(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getPriorityTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Priority type not found.');
            }

            const updated = await this._service.updatePriorityType(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a priority type!');
            }

            ResponseHandler.success(request, response, 'Priority type updated successfully!', 200, {
                PriorityType : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deletePriorityType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('HealthPriorityType.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getPriorityTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Priority type record not found.');
            }

            const deleted = await this._service.deletePriorityType(id);
            if (!deleted) {
                throw new ApiError(400, 'Priority type can not be deleted.');
            }

            ResponseHandler.success(request, response, ' Priority type deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    //#endregion

}
