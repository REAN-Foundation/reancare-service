import express from 'express';
import {
    UserGroupCreateDomainModel,
    UserGroupUpdateDomainModel,
    UserGroupSearchFilters } from '../../../domain.types/community/user.groups/user.group.domain.model';
import { BaseValidator, Where } from '../../base.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { body } from 'express-validator';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class UserGroupValidator extends BaseValidator {

    constructor() {
        super();
    }

    create = async (request: express.Request): Promise<UserGroupCreateDomainModel> => {
        await this.validateCreate(request);
        return this.getCreateModel(request.body, request.currentUser.UserId);
    };

    public search = async (request: express.Request): Promise<UserGroupSearchFilters> => {
        await this.validateSearch(request);
        const filters = this.getSearchFilters(request);
        return filters;
    };

    public update = async (request: express.Request): Promise<UserGroupUpdateDomainModel> => {
        await this.validateUpdate(request);
        const filters = this.getUpdateModel(request.body);
        return filters;
    };

    validateGroupActivityTypes = async (request: express.Request): Promise<string[]> => {

        request.body = request.body ?? [];

        const result = await body()
            .isArray()
            .run(request);

        Logger.instance().log(JSON.stringify(result));
        this.validateRequest(request);

        return request.body;
    };

    private getCreateModel = (requestBody: any, currentUserId: uuid): UserGroupCreateDomainModel => {

        const model: UserGroupCreateDomainModel = {
            Name        : requestBody.Name ?? null,
            Description : requestBody.Description ?? null,
            ImageUrl    : requestBody.ImageUrl ?? null,
            OwnerUserId : currentUserId,
        };
        return model;
    };

    private getUpdateModel = (requestBody: any): UserGroupUpdateDomainModel => {

        const model: UserGroupUpdateDomainModel = {
            Name        : requestBody.Name ?? null,
            Description : requestBody.Description ?? null,
            ImageUrl    : requestBody.ImageUrl ?? null,
        };

        return model;
    };

    private getSearchFilters = (request: express.Request): UserGroupSearchFilters => {

        var filters: UserGroupSearchFilters = {
            Name   : request.params.name ?? null,
            UserId : request.params.userId ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    };

    private async validateCreate(request) {
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateUpdate(request) {
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateSearch(request) {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateRequest(request);
    }

}
