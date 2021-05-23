import { CurrentUser } from "../../interfaces/current.user.interface";

declare global{
    namespace Express {
        interface Request {
            currentUser: CurrentUser,
            context: string,
            clientId: string
        }
    }
}