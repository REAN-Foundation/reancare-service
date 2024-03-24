import { CurrentClient } from "../../domain.types/miscellaneous/current.client";
import { CurrentUser, RequestType } from "../../domain.types/miscellaneous/current.user";

declare global{
    namespace Express {
        interface Request {
            currentUser          : CurrentUser;
            currentClient        : CurrentClient;
            currentUserTenantId  : string;
            context              : string;
            resourceType         : string;
            resourceId           : string | number | null | undefined;
            requestType          : RequestType | null | undefined;
            resourceOwnerUserId  : string | null | undefined;
            resourceTenantId     : string | null | undefined;
            allowAnonymous       : boolean;
            clientAppRoutes      : boolean; //This flag indicates that the request is for the client app specific endpoints
            singleResourceRequest: boolean;
            patientOwnedResource : boolean;
            customAuthorization  : boolean;
            publicUrl            : boolean;
        }
    }
}
