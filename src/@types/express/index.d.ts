import { CurrentUser } from "../../domain.types/current.user";
import { CurrentClient } from "../../domain.types/current.client";

declare global{
    namespace Express {
        interface Request {
            currentUser: CurrentUser,
            currentClient: CurrentClient
            context: string,
            resourceOwnerUserId: string
        }
    }
}

