import { CurrentClient } from "../../domain.types/miscellaneous/current.client";
import { CurrentUser } from "../../domain.types/miscellaneous/current.user";

declare global{
    namespace Express {
        interface Request {
            currentUser: CurrentUser,
            currentClient: CurrentClient
            context: string,
            resourceType: string,
            resourceId: string | number | null | undefined
            resourceOwnerUserId: string
        }
    }
}
