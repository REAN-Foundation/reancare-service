import express from 'express';
import { LabRecordTypeDomainModel } from '../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.domain.model';
import { RoleDomainModel } from '../../../domain.types/role/role.domain.model';
import { GoalTypeDomainModel } from '../../../domain.types/users/patient/goal.type/goal.type.domain.model';
import { HealthPriorityTypeDomainModel } from '../../../domain.types/users/patient/health.priority.type/health.priority.type.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesValidator extends BaseValidator {

    constructor() {
        super();
    }

    getPriorityTypeDomainModel = (request: express.Request): HealthPriorityTypeDomainModel => {

        const createModel: HealthPriorityTypeDomainModel = {
            Type : request.body.Type ?? null,
            Tags : request.body.Tags ?? []
        };

        return createModel;
    };

    getRoleTypeDomainModel = (request: express.Request): RoleDomainModel => {

        const createModel: RoleDomainModel = {
            RoleName    : request.body.RoleName ?? null,
            Description : request.body.Description ?? null
        };

        return createModel;
    };

    getLabRecordTypeDomainModel = (request: express.Request): LabRecordTypeDomainModel => {

        const createModel: LabRecordTypeDomainModel = {
            TypeName       : request.body.TypeName ?? null,
            DisplayName    : request.body.DisplayName ?? null,
            SnowmedCode    : request.body.SnowmedCode ?? null,
            LoincCode      : request.body.LoincCode ?? null,
            NormalRangeMin : request.body.NormalRangeMin ?? null,
            NormalRangeMax : request.body.NormalRangeMax ?? null,
            Unit           : request.body.Unit ?? null,
        };

        return createModel;
    };

    getGoalTypeDomainModel = (request: express.Request): GoalTypeDomainModel => {

        const createModel: GoalTypeDomainModel = {
            Type : request.body.Type ?? null,
            Tags : request.body.Tags ?? []
        };

        return createModel;
    };

    createPriorityType = async (request: express.Request): Promise<HealthPriorityTypeDomainModel> => {
        await this.validateCreatePriorityTypeBody(request);
        return this.getPriorityTypeDomainModel(request);
    };

    updatePriorityType = async (request: express.Request): Promise<HealthPriorityTypeDomainModel> => {
        await this.validateUpdatePriorityTypeBody(request);
        const domainModel = this.getPriorityTypeDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    createRoleType = async (request: express.Request): Promise<RoleDomainModel> => {
        await this.validateCreateRoleTypeBody(request);
        return this.getRoleTypeDomainModel(request);
    };

    updateRoleType = async (request: express.Request): Promise<RoleDomainModel> => {
        await this.validateUpdateRoleTypeBody(request);
        const domainModel = this.getRoleTypeDomainModel(request);
        domainModel.id = parseInt(request.params.id);
        return domainModel;
    };

    createLabRecordType = async (request: express.Request): Promise<LabRecordTypeDomainModel> => {
        await this.validateUpdateLabRecordTypeBody(request);
        return this.getLabRecordTypeDomainModel(request);
    };

    updateLabRecordType = async (request: express.Request): Promise<LabRecordTypeDomainModel> => {
        await this.validateCreateLabRecordTypeBody(request);
        const domainModel = this.getLabRecordTypeDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    createGoalType = async (request: express.Request): Promise<GoalTypeDomainModel> => {
        await this.validateCreateGoalTypeBody(request);
        return this.getGoalTypeDomainModel(request);
    };

    updateGoalType = async (request: express.Request): Promise<GoalTypeDomainModel> => {
        await this.validateUpdateGoalTypeBody(request);
        const domainModel = this.getGoalTypeDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreatePriorityTypeBody(request) {
        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdatePriorityTypeBody(request) {
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateCreateRoleTypeBody(request) {
        await this.validateString(request, 'RoleName', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdateRoleTypeBody(request) {
        await this.validateString(request, 'RoleName', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateCreateLabRecordTypeBody(request) {
        await this.validateString(request, 'TypeName', Where.Body, true, false);
        await this.validateString(request, 'DisplayName', Where.Body, true, false);
        await this.validateString(request, 'SnowmedCode ', Where.Body, false, true);
        await this.validateString(request, 'LoincCode', Where.Body, false, true);
        await this.validateDecimal(request, 'NormalRangeMin', Where.Body, false, true);
        await this.validateDecimal(request, 'NormalRangeMax', Where.Body, false, true);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdateLabRecordTypeBody(request) {
        await this.validateString(request, 'TypeName', Where.Body, false, false);
        await this.validateString(request, 'DisplayName', Where.Body, false, false);
        await this.validateString(request, 'SnowmedCode ', Where.Body, false, true);
        await this.validateString(request, 'LoincCode', Where.Body, false, true);
        await this.validateDecimal(request, 'NormalRangeMin', Where.Body, false, true);
        await this.validateDecimal(request, 'NormalRangeMax', Where.Body, false, true);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateCreateGoalTypeBody(request) {
        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdateGoalTypeBody(request) {
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateRequest(request);
    }

}
