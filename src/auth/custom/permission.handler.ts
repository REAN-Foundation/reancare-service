import express from 'express';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import { Injector } from '../../startup/injector';
import { ActionScope, RequestType, ResourceOwnership } from "../auth.types";
import { ConsentService } from "../../services/auth/consent.service";
import { CurrentUser } from "../../domain.types/miscellaneous/current.user";
import { Roles } from "../../domain.types/role/role.types";
import { Logger } from "../../common/logger";
import { uuid } from '../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////

export class PermissionHandler {

    public static checkRoleBasedPermissions = async (request: express.Request): Promise<boolean> => {
        const currentUser = request.currentUser;
        const roleId = currentUser.CurrentRoleId;
        const context = request.context;
        const rolePrivilegeService = Injector.Container.resolve(RolePrivilegeService);
        const hasPrivilege = await rolePrivilegeService.hasPrivilegeForRole(roleId, context);
        return hasPrivilege;
    };

    public static checkConsent = async (
        resourceOwnerUserId: uuid,
        requesterUserId: uuid,
        context: string
    ) => {
        const consentService = Injector.Container.resolve(ConsentService);
        const consents = await consentService.getActiveConsents(
            resourceOwnerUserId,
            requesterUserId,
            context
        );
        if (consents == null || consents.length === 0) {
            return false;
        }
        return true;
    };
    
    // Check permissions by ownership, action scope and consent
    public static checkFineGrained = async (request: express.Request): Promise<boolean> => {

        const currentUser = request.currentUser ?? null;
        const currentUserRole = currentUser.CurrentRole;

        // 2. SuperAdmin (System Admin) has access to all resources
        if (currentUserRole === Roles.SystemAdmin) {
            return true;
        }

        // 3. SystemUser
        // System user access has already been checked for role based permissions
        if (currentUserRole === Roles.SystemUser) {
            const msg = `System User access has already been checked for role based permissions`;
            Logger.instance().log(msg);
            return true;
        }

        return await this.checkByRequestType(request, currentUser);
    };

    private static checkForXOne = (
        ownership: ResourceOwnership,
        actionScope: ActionScope,
        isOwner: boolean,
        areTenantsSame: boolean,
        hasConsent: boolean
    ): boolean => {
        //visible to the individual owner only
        if (ownership === ResourceOwnership.Owner) {
            if (actionScope === ActionScope.Owner) {
                return isOwner;
            }
            if (actionScope === ActionScope.Tenant) {
                return areTenantsSame;
            }
            if (actionScope === ActionScope.System) {
                return hasConsent;
            }
            return false;
        } else if (ownership === ResourceOwnership.Tenant) {
            return areTenantsSame;
        } else if (ownership === ResourceOwnership.System) {
            return true;
        }
        return false;
    };

    private static checkXMany = (
        ownership: ResourceOwnership,
        actionScope: ActionScope,
        isOwner: boolean,
        areTenantsSame: boolean,
        hasConsent: boolean
    ): boolean => {
        if (ownership === ResourceOwnership.Owner) {
            if (actionScope === ActionScope.Owner) {
                return isOwner;
            }
            if (actionScope === ActionScope.Tenant) {
                return areTenantsSame;
            }
            if (actionScope === ActionScope.System) {
                return hasConsent;
            }
        } else if (ownership === ResourceOwnership.Tenant) {
            return areTenantsSame;
        } else if (ownership === ResourceOwnership.System) {
            return true;
        }
        return false;
    };

    private static checkCreateOne = (
        ownership: ResourceOwnership,
        actionScope: ActionScope,
        isOwner: boolean,
        areTenantsSame: boolean,
        hasConsent: boolean
    ): boolean => {
        if (ownership === ResourceOwnership.Owner) {
            if (actionScope === ActionScope.Owner) {
                return isOwner;
            }
            if (actionScope === ActionScope.Tenant) {
                return areTenantsSame && hasConsent;
            }
            if (actionScope === ActionScope.System) {
                return hasConsent;
            }
        } else if (ownership === ResourceOwnership.Tenant) {
            return areTenantsSame;
        } else if (ownership === ResourceOwnership.System) {
            return true;
        }
        return false;
    };

    private static checkByRequestType = async (request: express.Request, currentUser: CurrentUser) => {
        const requestType = request.requestType;
        const ownership = request.ownership;
        const actionScope = request.actionScope;
        const isOwner = request.resourceOwnerUserId === currentUser.UserId;
        const areTenantsSame = request.resourceTenantId === currentUser.TenantId;
        const hasConsent = await this.hasConsent(request);
        const customAuthorization = request.customAuthorization;
        const systemOwnedResource = request.ownership === ResourceOwnership.System;

        //Check if it is single resource request...
        if (
            requestType === RequestType.GetOne ||
            requestType === RequestType.UpdateOne ||
            requestType === RequestType.DeleteOne
        ) {
            //visible to the individual owner only
            return this.checkForXOne(ownership, actionScope, isOwner, areTenantsSame, hasConsent);
        }
        if (requestType === RequestType.CreateOne) {
            return this.checkCreateOne(ownership, actionScope, isOwner, areTenantsSame, hasConsent);
        }
        if (requestType === RequestType.Search) {
            return true;
        }
        if (requestType === RequestType.GetMany ||
            requestType === RequestType.UpdateMany ||
            requestType === RequestType.DeleteMany) {
            return this.checkXMany(ownership, actionScope, isOwner, areTenantsSame, hasConsent);
        }

        return customAuthorization;
    };

    private static hasConsent = async (request: express.Request): Promise<boolean> => {
        return await this.checkConsent(
            request.resourceOwnerUserId,
            request.currentUser.UserId,
            request.context);
    };

}
