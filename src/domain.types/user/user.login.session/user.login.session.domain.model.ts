import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export interface UserLoginSessionDomainModel {
    id?        : uuid;
    UserId     : uuid;
    IsActive   : boolean;
    StartedAt? : Date;
    ValidTill? : Date;

}
