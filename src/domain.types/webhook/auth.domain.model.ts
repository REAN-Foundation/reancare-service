import { uuid } from '../../domain.types/miscellaneous/system.types';
import { EventStatus, EventType, TerraUser } from './webhook.event';

///////////////////////////////////////////////////////////////////////////////////////

export interface AuthDomainModel {
    Status            : EventStatus;
    Type              ?: EventType;
    User              : TerraUser;
    Message           ?: string;
    WidgetSessionId   ?: string;
    ReferenceId       ?: uuid;
    Version           ?: Date;
}
