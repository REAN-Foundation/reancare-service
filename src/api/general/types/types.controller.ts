import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { BloodGroupList, EthnicityTypeList, MaritalStatusList, RaceTypeList, SeverityList, uuid } from '../../../domain.types/miscellaneous/system.types';
import { TypesService } from '../../../services/general/types.service';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { AwardsFactsService } from '../../../modules/awards.facts/awards.facts.service';
import { ReminderTypeList, RepeatAfterEveryUnitList } from '../../../domain.types/general/reminder/reminder.domain.model';
import { TypesValidator } from './types.validator';
import { UserEngagementCategoryList } from '../../../domain.types/statistics/user.engagement.types';

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

            ResponseHandler.success(request, response, 'Fetched priority types successfully!', 200, {
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

    getGroupActivityTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.GroupActivityTypes', request, response, false);
            const groupActivityTypes = AwardsFactsService._groupActivityTypes;
            ResponseHandler.success(request, response, 'Group activity types successfully!', 200, {
                GroupActivityTypes : groupActivityTypes,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getReminderTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.ReminderTypes', request, response, false);
            ResponseHandler.success(request, response, 'Reminder types successfully!', 200, {
                ReminderTypes : ReminderTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getReminderRepeatAfterEveryTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.ReminderTypes', request, response, false);
            ResponseHandler.success(request, response, 'Reminder types successfully!', 200, {
                RepeatAfterEveryUnitTypes : RepeatAfterEveryUnitList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getQueryResponseTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.GetQueryResponseTypes', request, response, false);

            const types = await this._service.getQueryResponseTypes();
            if (types === null || types.length === 0) {
                throw new ApiError(400, 'Cannot get query response types!');
            }

            ResponseHandler.success(request, response, 'Query response types retrieved successfully!', 200, {
                QueryResponseTypes : types,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUserEngagementCategories = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Types.GetUserEngagementCategories', request, response, false);
            ResponseHandler.success(request, response, 'User engagement categories retrieved successfully!', 200, {
                UserEngagementCategories : UserEngagementCategoryList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // Priority type
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

    // Role type

    createRoleType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('RoleType.Create', request, response);

            const domainModel = await this._validator.createRoleType(request);
            const roleType = await this._service.createRoleType(domainModel);
            if (roleType  == null) {
                throw new ApiError(400, 'Cannot create role type!');
            }

            ResponseHandler.success(request, response, 'Role type created successfully!', 201, {
                RoleType : roleType ,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getRoleTypeById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('RoleType.GetById', request, response);

            const id:number = parseInt(request.params.id);
            const roleType = await this._service.getRoleTypeById(id);
            if (roleType == null) {
                throw new ApiError(404, 'Role type not found.');
            }

            ResponseHandler.success(request, response, 'Role type retrieved successfully!', 200, {
                RoleType : roleType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateRoleType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('RoleType.Update', request, response);

            const domainModel = await this._validator.updateRoleType(request);
            const id:number = parseInt(request.params.id);
            const existingRecord = await this._service.getRoleTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Role type  not found.');
            }

            const updated = await this._service.updateRoleType(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a role type !');
            }

            ResponseHandler.success(request, response, 'Role type updated successfully!', 200, {
                RoleType : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteRoleType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('RoleType.Delete', request, response);

            const id:number = parseInt(request.params.id);
            const existingRecord = await this._service.getRoleTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Role type record not found.');
            }

            const deleted = await this._service.deleteRoleType(id);
            if (!deleted) {
                throw new ApiError(400, 'Role type can not be deleted.');
            }

            ResponseHandler.success(request, response, 'Role type  deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // Lab record type

    createLabRecordType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecordType.Create', request, response);

            const model = await this._validator.createLabRecordType(request);
            const labRecordType = await this._service.createLabRecordType(model);
            if (labRecordType == null) {
                throw new ApiError(400, 'Could not create a lab record Type!');
            }

            ResponseHandler.success(request, response, 'Lab record type created successfully!', 201, {
                LabRecordType : labRecordType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getLabRecordTypeById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecordType.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const labRecordType = await this._service.getLabRecordTypeById(id);
            if (labRecordType == null) {
                throw new ApiError(404, 'Lab record type not found.');
            }

            ResponseHandler.success(request, response, 'Lab record type retrieved successfully!', 200, {
                LabRecordType : labRecordType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateLabRecordType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecordType.Update', request, response);

            const domainModel = await this._validator.updateLabRecordType(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getLabRecordTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'LabRecordType not found.');
            }

            const updated = await this._service.updateLabRecordType(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a lab record type!');
            }

            ResponseHandler.success(request, response, 'Lab record type updated successfully!', 200, {
                LabRecordType : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteLabRecordType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecordType.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getLabRecordTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Lab record type record not found.');
            }

            const deleted = await this._service.deleteLabRecordType(id);
            if (!deleted) {
                throw new ApiError(400, 'Lab record type can not be deleted.');
            }

            ResponseHandler.success(request, response, 'Lab record type deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //Goal type

    createGoalType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('GoalType.Create', request, response);

            const model = await this._validator.createGoalType(request);
            const goalType = await this._service.createGoalType(model);
            if (goalType == null) {
                throw new ApiError(400, 'Could not create a Goal type!');
            }

            ResponseHandler.success(request, response, 'Goal type created successfully!', 201, {
                GoalType : goalType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGoalTypeById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('GoalType.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const goalType = await this._service.getGoalTypeById(id);
            if (goalType == null) {
                throw new ApiError(404, 'Goal type not found.');
            }

            ResponseHandler.success(request, response, 'Goal type retrieved successfully!', 200, {
                GoalType : goalType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGoalTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('GoalType.GetGoalTypes', request, response, false);

            const tags : string = request.query.tags as string ?? null;
            const goalTypes = await this._service.getGoalTypes(tags);

            const count = goalTypes.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} goal types retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                GoalTypes : goalTypes ,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateGoalType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('GoalType.Update', request, response);

            const domainModel = await this._validator.updateGoalType(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getGoalTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Goal type not found.');
            }

            const updated = await this._service.updateGoalType(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a Goal type!');
            }

            ResponseHandler.success(request, response, 'Goal type updated successfully!', 200, {
                GoalType : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteGoalType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('GoalType.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getGoalTypeById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Goal type record not found.');
            }

            const deleted = await this._service.deleteGoalType(id);
            if (!deleted) {
                throw new ApiError(400, 'Goal type can not be deleted.');
            }

            ResponseHandler.success(request, response, 'Goal type deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
