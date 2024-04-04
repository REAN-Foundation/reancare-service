import { RequestType, ResourceOwnership, ActionScope } from "../../auth/auth.types";
import { CurrentClient } from "../../domain.types/miscellaneous/current.client";
import { CurrentUser } from "../../domain.types/miscellaneous/current.user";

declare global{
    namespace Express {
        interface Request {
            currentUser          : CurrentUser;
            currentClient        : CurrentClient;
            currentUserTenantId  : string;
            context              : string;
            actionScope          : ActionScope;
            ownership            : ResourceOwnership;
            requestType          : RequestType | null | undefined;
            resourceId           : string | number | null | undefined;
            resourceOwnerUserId  : string | null | undefined;
            resourceTenantId     : string | null | undefined;
            clientAppAuth        : boolean; //This flag indicates that the request is for the client app specific endpoints
            controllerAuth       : boolean; //This flag indicates that the authorization is done at the controller level
            customAuthorization  : boolean; //This flag indicates that the authorization is done using a custom function
        }
    }
}
