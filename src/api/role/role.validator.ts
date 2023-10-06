import express from 'express';
import { RoleDomainModel, RoleSearchFilters } from '../../domain.types/role/role.domain.model';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class RoleValidator extends BaseValidator {

    constructor() {
        super();
    }

    create = async (request: express.Request): Promise<RoleDomainModel> => {

        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateUuid(request, 'TenantId', Where.Body, false, true);
        await this.validateUuid(request, 'ParentRoleId', Where.Body, false, true);
        await this.validateBoolean(request, 'IsSystemRole', Where.Body, false, true);
        await this.validateBoolean(request, 'IsUserRole', Where.Body, false, true);

        this.validateRequest(request);

        const body = request.body;

        const model: RoleDomainModel = {
            RoleName      : body.Name ?? null,
            Description   : body.Description ?? null,
            TenantId      : body.TenantId ?? null,
            ParentRoleId  : body.ParentRoleId ?? null,
            IsSystemRole  : body.IsSystemRole ?? false,
            IsUserRole    : body.IsUserRole ?? false,
            IsDefaultRole : false, //All roles added later are not default roles
        };
        return model;
    };

    search = async (request: express.Request): Promise<RoleSearchFilters> => {

        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'tenantId', Where.Query, false, false);
        await this.validateInt(request, 'parentRoleId', Where.Query, false, false);
        await this.validateBoolean(request, 'isSystemRole', Where.Query, false, false);
        await this.validateBoolean(request, 'isUserRole', Where.Query, false, false);
        await this.validateBoolean(request, 'isDefaultRole', Where.Query, false, false);
        this.validateRequest(request);

        const model: RoleSearchFilters = {
            RoleName      : request.query.name as string ?? null,
            ParentRoleId  : request.query.parentRoleId ? parseInt(request.query.parentRoleId as string) : null,
            IsSystemRole  : request.query.isSystemRole ? request.query.isSystemRole as string === 'true' : null,
            IsUserRole    : request.query.isUserRole ? request.query.isUserRole as string === 'true' : null,
            TenantId      : request.query.tenantId as string ?? null,
            IsDefaultRole : request.query.isDefaultRole ? request.query.isDefaultRole as string === 'true' : null,
        };
        return model;
    };

    update = async (request: express.Request): Promise<RoleDomainModel> => {

        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateUuid(request, 'TenantId', Where.Body, false, true);
        await this.validateUuid(request, 'ParentRoleId', Where.Body, false, true);
        await this.validateBoolean(request, 'IsSystemRole', Where.Body, false, true);
        await this.validateBoolean(request, 'IsUserRole', Where.Body, false, true);

        this.validateRequest(request);

        const body = request.body;

        const model: RoleDomainModel = {
            RoleName     : body.Name ?? null,
            Description  : body.Description ?? null,
            TenantId     : body.TenantId ?? null,
            ParentRoleId : body.ParentRoleId ?? null,
            IsSystemRole : body.IsSystemRole ?? false,
            IsUserRole   : body.IsUserRole ?? false,
        };
        return model;
    };

}
