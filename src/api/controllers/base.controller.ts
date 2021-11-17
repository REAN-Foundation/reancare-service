import express from 'express';
import { Authorizer } from '../../auth/authorizer';
import { ApiError } from '../../common/api.error';
import { ResourceCreatorType, ResourceOwnerType } from '../../domain.types/miscellaneous/system.types';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {
   
    _authorizer: Authorizer = null;

    _resourceOwnerType: ResourceOwnerType = ResourceOwnerType.Public;

    _resourceCreatorTypes: ResourceCreatorType[] = [];

    constructor() {
        this._authorizer = Loader.authorizer;
        this._resourceOwnerType = ResourceOwnerType.Public;
    }

    setContext = async (
        context: string,
        request: express.Request,
        response: express.Response,
        authorize = true) => {

        if (context === undefined || context === null) {
            throw new ApiError(500, 'Invalid request context');
        }
        const tokens = context.split('.');
        if (tokens.length < 2) {
            throw new ApiError(500, 'Invalid request context');
        }
        
        const resourceType = tokens[0];
        request.context = context;
        request.resourceType = resourceType;
        if (request.params.id !== undefined && request.params.id !== null) {
            request.resourceId = request.params.id;
        }
        if (this.checkCurrentUserPermissionsForResourceCreation(request)) {
            //No need to authorize if the resource creation permissions are fulfileld
            return;
        }
        
        if (authorize) {
            const authorized = await Loader.authorizer.authorize(request, response);
            if (!authorized) {
                throw new ApiError(403, 'Unauthorized access');
            }
        }
    }

    checkCurrentUserPermissionsForResourceCreation = (request: express.Request) => {

        if (!request.context.includes('Create')) {
            return false;
        }

        //First determine the resource owner id during creation

        if (request.resourceOwnerUserId === null ||
            request.resourceOwnerUserId === undefined) { //Set only when not already set

            if (request.body.PatientUserId !== undefined &&
                this._resourceOwnerType === ResourceOwnerType.Patient) {
                request.resourceOwnerUserId = request.body.PatientUserId;
            }
            else if (this._resourceOwnerType === ResourceOwnerType.MedicalPractitioner) {
                if (request.body.MedicalPractitionerUserId !== undefined) {
                    request.resourceOwnerUserId = request.body.MedicalPractitionerUserId;
                }
                else if (request.body.DoctorUserId !== undefined) {
                    request.resourceOwnerUserId = request.body.DoctorUserId;
                }
            }
        }
        
        if (request.currentUser) {
            
            //Now check if the current user is the owner of the resource to be created
            if (request.currentUser.UserId === request.resourceOwnerUserId) {
                return true;
            }

            //Now check if the current user role has creation permissions
            const currentUserRole = request.currentUser.CurrentRole as ResourceCreatorType;
            if (this._resourceCreatorTypes.includes(currentUserRole)) {
                return true;
            }

            //Now check if this resource allows creation by any role
            if (this._resourceCreatorTypes.includes(ResourceCreatorType.Anybody)) {
                return true;
            }

        }
        return false;
    }

}
