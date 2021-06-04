import { CurrentUser } from "../../interfaces/current.user.interface";
import { CurrentClient } from "../../interfaces/current.client.interface";

declare global{
    namespace Express {
        interface Request {
            currentUser: CurrentUser,
            currentClient: CurrentClient
            context: string,
        }
    }
}

