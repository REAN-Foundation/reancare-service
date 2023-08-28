import express from 'express';
import { UserLearningDomainModel } from '../../../../domain.types/educational/learning/user.learning/user.learning.domain.model';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserLearningValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): UserLearningDomainModel => {

        const model: UserLearningDomainModel = {
            UserId               : request.params.userId,
            ContentId            : request.params.contentId,
            LearningPathId       : request.body.LearningPathId,
            ActionId             : request.body.ActionId,
            ProgressStatus       : request.body.ProgressStatus,
            PercentageCompletion : request.body.PercentageCompletion,
        };

        return model;
    };

    updateUserLearning = async (request: express.Request): Promise<UserLearningDomainModel> => {
        await this.validateBody(request);
        return this.getDomainModel(request);
    };

    private  async validateBody(request) {
        await this.validateUuid(request, 'userId', Where.Param, true, false);
        await this.validateUuid(request, 'contentId', Where.Param, true, false);
        await this.validateUuid(request, 'LearningPathId', Where.Body, false, false);
        await this.validateUuid(request, 'ActionId', Where.Body, false, false);
        await this.validateString(request, 'ProgressStatus', Where.Body, false, true);
        await this.validateDecimal(request, 'PercentageCompletion', Where.Body, false, true);
        this.validateRequest(request);
    }

}
