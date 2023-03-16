
import express from 'express';
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

    createPriorityType = async (request: express.Request): Promise<HealthPriorityTypeDomainModel> => {
        await this.validateCreateBody(request);
        return this.getPriorityTypeDomainModel(request);
    }

    updatePriorityType = async (request: express.Request): Promise<HealthPriorityTypeDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getPriorityTypeDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    }

    private async validateCreateBody(request) {
        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        await this.validateRequest(request);
    }

}
