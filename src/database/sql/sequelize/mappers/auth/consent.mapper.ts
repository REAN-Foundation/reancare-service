import { ConsentDto } from '../../../../../domain.types/auth/consent.types';
import Consent from '../../models/auth/consent.model';

///////////////////////////////////////////////////////////////////////////////////

export class ConsentMapper {

    static toDto = (consent: Consent): ConsentDto => {
        if (consent == null){
            return null;
        }
        const dto: ConsentDto = {
            id                     : consent.id,
            ResourceId             : consent.ResourceId,
            ResourceCategory       : consent.ResourceCategory,
            ResourceName           : consent.ResourceName,
            TenantId               : consent.TenantId,
            OwnerUserId            : consent.OwnerUserId,
            ConsentHolderUserId    : consent.ConsentHolderUserId,
            AllResourcesInCategory : consent.AllResourcesInCategory,
            TenantOwnedResource    : consent.TenantOwnedResource,
            Perpetual              : consent.Perpetual,
            Revoked                : consent.Revoked,
            RevokedTimestamp       : consent.RevokedTimestamp,
            ConsentGivenOn         : consent.ConsentGivenOn,
            ConsentValidFrom       : consent.ConsentValidFrom,
            ConsentValidTill       : consent.ConsentValidTill,
        };
        return dto;
    };

}
