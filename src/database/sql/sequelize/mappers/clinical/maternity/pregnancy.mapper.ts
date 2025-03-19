// import { UserDetailsDto } from 'src/domain.types/users/user/user.dto';
import { UserDetailsDto, UserDto } from '../../../../../../domain.types/users/user/user.dto';

import { PregnancyDetailsDto,PregnancyDto } from '../../../../../../domain.types/clinical/maternity/pregnancy/pregnancy.dto';
import Pregnancy from '../../../models/clinical/maternity/pregnancy.model';
import PregnancyModel from '../../../models/clinical/maternity/pregnancy.model';

///////////////////////////////////////////////////////////////////////////////////

export class PregnancyMapper {

    static toDetailsDto = (pregnancy: Pregnancy, userDetailsDto: UserDetailsDto = null): PregnancyDetailsDto => {
        if (pregnancy == null) {
            return null;
        }

        const dto: PregnancyDetailsDto = {
            id                           : pregnancy.id,
            PatientUserId                : pregnancy.PatientUserId,
            ExternalPregnancyId          : pregnancy.ExternalPregnancyId,
            DateOfLastMenstrualPeriod    : pregnancy.DateOfLastMenstrualPeriod,
            EstimatedDateOfChildBirth    : pregnancy.EstimatedDateOfChildBirth,
            Gravidity                    : pregnancy.Gravidity,
            Parity                       : pregnancy.Parity,
        };
        return dto;
    };

    static toDto = (pregnancy: Pregnancy,userDto: UserDto = null
    ): PregnancyDto => {
        if (pregnancy == null) {
            return null;
        }

        const dto: PregnancyDto = {
            id                           : pregnancy.id,
            PatientUserId                : pregnancy.PatientUserId,
            ExternalPregnancyId          : pregnancy.ExternalPregnancyId,
            DateOfLastMenstrualPeriod    : pregnancy.DateOfLastMenstrualPeriod,
            EstimatedDateOfChildBirth    : pregnancy.EstimatedDateOfChildBirth,
            Gravidity                    : pregnancy.Gravidity,
            Parity                       : pregnancy.Parity,
        };
        return dto;
    };

}

// export class PregnancyMapper {


//     static toDto = (pregnancy: Pregnancy, userDto:UserDetailsDto ): PregnancyDto => {
//         if (pregnancy == null) {
//             return null;
//         }
//         const dto: PregnancyDto = {
//             id                           : pregnancy.id,
//             PatientUserId                : pregnancy.PatientUserId,
//             DateOfLastMenstrualPeriod    : pregnancy.DateOfLastMenstrualPeriod,
//             EstimatedDateOfChildBirth    : pregnancy.EstimatedDateOfChildBirth,
//             Gravidity                    : pregnancy.Gravidity,
//             Parity                       : pregnancy.Parity,
//             CreatedAt                    : pregnancy.CreatedAt,
//             UpdatedAt                    : pregnancy.UpdatedAt,
//             DeletedAt                    : pregnancy.DeletedAt,
        
//         };
//         return dto;
//     };

// }
