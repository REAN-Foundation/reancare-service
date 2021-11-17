import { ResourceOwnerType, uuid } from "../domain.types/miscellaneous/system.types";
import { Roles } from "../domain.types/role/role.types";

//////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class BaseResourceService {

    abstract getById(id: uuid): Promise<any>;

    setResourceOwnerUserId = async (
        resourceId: uuid,
        resourceOwnerType: ResourceOwnerType,
        request: Express.Request): Promise<void> => {
        var ownerUserId = await this.getResourceOwnerId(resourceId, resourceOwnerType);
        request.resourceOwnerUserId = ownerUserId;
    }

    setResourceOwnerUserIdForSearch = (
        filters: any,
        resourceOwnerType: ResourceOwnerType,
        request: Express.Request): void => {

        const currentUserId  = request.currentUser.UserId;
        const currentUserRole = request.currentUser.CurrentRole;

        if (resourceOwnerType === ResourceOwnerType.Patient) {
            if (filters.PatientUserId === undefined || filters.PatientUserId === null) {
                if (currentUserRole === Roles.Patient) {
                    //If filter does not contain patient user id (in case owner type is patient)
                    //and current user is patient, set filter to use current user id and patient user id
                    filters.PatientUserId = currentUserId;
                    request.resourceOwnerUserId = currentUserId;
                    return;
                }
            }
            else {
                request.resourceOwnerUserId = filters.PatientUserId;
            }
        }
        else if (resourceOwnerType === ResourceOwnerType.MedicalPractitioner) {
            if (filters.MedicalPractitionerUserId !== undefined || filters.MedicalPractitionerUserId !== null) {
                request.resourceOwnerUserId = filters.MedicalPractitionerUserId;
            }
        }
    }

    getResourceOwnerId = async (
        resourceId: uuid,
        resourceOwnerType: ResourceOwnerType): Promise<uuid|null> => {

        var resource = await this.getById(resourceId);
        if (resource === null) {
            return null;
        }

        if (resourceOwnerType === ResourceOwnerType.Patient) {
            if (resource.PatientUserId !== undefined || resource.PatientUserId !== null) {
                return resource.PatientUserId;
            }
        }
        else if (resourceOwnerType === ResourceOwnerType.MedicalPractitioner) {
            if (resource.MedicalPractitionerUserId !== undefined || resource.MedicalPractitionerUserId !== null) {
                return resource.MedicalPractitionerUserId;
            }
        }
        
        return null;
    }

}
