import { ActionPlanSearchFilters } from '../../../domain.types/users/patient/action.plan/action.plan.search.types';
import { PermissionHandler } from '../../../auth/custom/permission.handler';
import express from 'express';
import { BaseController } from '../../../api/base.controller';
import { ApiError } from '../../../common/api.error';
import { Roles } from '../../../domain.types/role/role.types';
import { DocumentSearchFilters } from '../../../domain.types/users/patient/document/document.search.types';
import { EmergencyContactSearchFilters } from '../../../domain.types/users/patient/emergency.contact/emergency.contact.search.types';
import { GoalSearchFilters } from '../../../domain.types/users/patient/goal/goal.search.types';
import { HealthPrioritySearchFilters } from '../../../domain.types/users/patient/health.priority/health.priority.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export type PatientBaseSearchFilters =  ActionPlanSearchFilters
    | DocumentSearchFilters
    | EmergencyContactSearchFilters
    | GoalSearchFilters
    | HealthPrioritySearchFilters;

///////////////////////////////////////////////////////////////////////////////////////

export class PatientBaseController extends BaseController {

    //#region  Authorization methods

        authorizeSearch = async (
            request: express.Request,
            searchFilters: PatientBaseSearchFilters
        ): Promise<PatientBaseSearchFilters> => {
            
            const currentUser = request.currentUser;
            const currentRole = request.currentUser.CurrentRole;
    
            if (searchFilters.PatientUserId != null) {
                if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                    const permitted = await PermissionHandler.checkConsent(
                        searchFilters.PatientUserId,
                        currentUser.UserId,
                        request.context
                    );
                    if (!permitted) {
                        throw new ApiError(403, 'Permission denied.');
                    }
                }
            } else  if (currentRole === Roles.Patient) {
                searchFilters.PatientUserId = currentUser.UserId;
            } else if (
                currentRole !== Roles.TenantAdmin &&
                    currentRole !== Roles.SystemAdmin &&
                    currentRole !== Roles.SystemUser
            ) {
                throw new ApiError(403, 'Permission denied.');
            }

            return searchFilters;
        };
    
    //#endregion
    
}
