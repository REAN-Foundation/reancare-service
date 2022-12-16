import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import { TimeHelper } from '../../../../../common/time.helper';
import { DurationType } from '../../../../../domain.types/miscellaneous/time.types';
import Patient from '../../models/users/patient/patient.model';
import User from '../../models/users/user/user.model';

///////////////////////////////////////////////////////////////////////

export class HelperRepo {

    static async getPatientTimezone(patientUserId: uuid) {
        let timezone = '+05:30';
        const patient = await Patient.findOne({
            where : {
                UserId : patientUserId
            },
            include : [
                {
                    model    : User,
                    as       : 'User',
                    required : true,
                }
            ]
        });
        if (patient) {
            timezone = patient.User.CurrentTimeZone;
        }
        return timezone;
    }

    static async getPatientTimezoneOffsets(patientUserId: uuid) {
        const timezone = await HelperRepo.getPatientTimezone(patientUserId);
        const offsetMinutes = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
        return offsetMinutes;
    }

}
