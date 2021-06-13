import { CurrentUser } from "../../data/dtos/current.user.dto";
import { CurrentClient } from "../../data/dtos/current.client.dto";

declare global{
    namespace Express {
        interface Request {
            currentUser: CurrentUser,
            currentClient: CurrentClient
            context: string,
        }
    }
}

