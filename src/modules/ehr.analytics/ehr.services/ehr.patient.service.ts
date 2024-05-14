import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientAppNameCache } from "../patient.appname.cache";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";
import { EmergencyContactDto } from "../../../domain.types/users/patient/emergency.contact/emergency.contact.dto";
import { EmergencyContactRoles } from "../../../domain.types/users/patient/emergency.contact/emergency.contact.types";
import { HealthProfileDto } from "../../../domain.types/users/patient/health.profile/health.profile.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRPatientService {

    public addEHRRecordPatientForAppNames = async (model: PatientDetailsDto, location?: string) => {
        try {
            const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(model.UserId);
            if (eligibleToAddEhrRecord) {
                this.addEHRRecord(model, null, location);
            }

        } catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message)}`);
        }
    };

    public deleteStaticEHRRecord = async (id: string ) => {
        try {
            EHRAnalyticsHandler.deletePatientStaticRecord(id);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public addEHRRecordEmergencyContactForAppNames = async (model: EmergencyContactDto) => {
        try {
            const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(model.PatientUserId);
            if (eligibleToAddEhrRecord) {
                if (model.ContactRelation === EmergencyContactRoles.Doctor) {
                    await EHRAnalyticsHandler.addOrUpdatePatient(
                        model.PatientUserId,
                        {
                            DoctorPersonId_1 : model.ContactPersonId,
                        },
                        null
                    );
                }
            }
            
        } catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message)}`);
        }
    };

    public addEHRRecord = (model: PatientDetailsDto, appName?: string, location?: string) => {
        const user = model?.User;
        const person = user?.Person;
        const healthProfile = model?.HealthProfile;

        var details = {};
        if (person?.BirthDate) {
            details['BirthDate'] = person?.BirthDate;
        }
        if (person?.Age) {
            details['Age'] = person?.Age;
        }
        if (person?.Gender) {
            details['Gender'] = person?.Gender;
        }
        if (person?.SelfIdentifiedGender) {
            details['SelfIdentifiedGender'] = person?.SelfIdentifiedGender;
        }
        if (healthProfile && healthProfile?.MaritalStatus) {
            details['MaritalStatus'] = healthProfile?.MaritalStatus;
        }
        if (healthProfile && healthProfile?.Ethnicity) {
            details['Ethnicity'] = healthProfile?.Ethnicity;
        }
        if (healthProfile && healthProfile?.Race) {
            details['Race'] = healthProfile?.Race;
        }
        if (model.HealthSystem) {
            details['HealthSystem'] = model.HealthSystem;
        }
        if (model.AssociatedHospital) {
            details['AssociatedHospital'] = model.AssociatedHospital;
        }
        if (healthProfile && healthProfile?.HasHeartAilment != null) {
            details['HasHeartAilment'] = healthProfile?.HasHeartAilment;
        }
        if (healthProfile && healthProfile?.HasHighBloodPressure != null) {
            details['HasHighBloodPressure'] = healthProfile?.HasHighBloodPressure;
        }
        if (healthProfile && healthProfile?.HasHighCholesterol != null) {
            details['HasHighCholesterol'] = healthProfile?.HasHighCholesterol;
        }
        if (healthProfile && healthProfile?.IsDiabetic != null) {
            details['IsDiabetic'] = healthProfile?.IsDiabetic;
        }
        if (healthProfile && healthProfile?.Occupation) {
            details['Occupation'] = healthProfile?.Occupation;
        }
        if (healthProfile && healthProfile?.MajorAilment) {
            details['MajorAilment'] = healthProfile?.MajorAilment;
        }
        if (healthProfile && healthProfile?.IsSmoker) {
            details['IsSmoker'] = healthProfile?.IsSmoker;
        }
        if (healthProfile && healthProfile?.BloodGroup) {
            details['BloodGroup'] = healthProfile?.BloodGroup;
        }
        if (healthProfile && healthProfile?.Nationality) {
            details['Nationality'] = healthProfile?.Nationality;
        }
        if (location) {
            details['Location'] = location;
        }
        if (healthProfile && healthProfile?.OtherConditions) {
            details['OtherConditions'] = healthProfile?.OtherConditions;
        }
        // if (model.EmergencyContacts.DoctorPersonId_1) {
        //     details['DoctorPersonId_1'] = model.DoctorPersonId_1;
        // }
        // if (model.DoctorPersonId_2) {
        //     details['DoctorPersonId_2'] = model.DoctorPersonId_2;
        // }
        details['RecordDate'] = new Date(model.CreatedAt);
        if (healthProfile && healthProfile?.CreatedAt) {
            details['RecordDate'] = new Date(healthProfile?.CreatedAt);
        }

        EHRAnalyticsHandler.addOrUpdatePatient(user.id, details, appName);
    };

    private addEHRRecordHealthProfile = (model: HealthProfileDto, appName?: string) => {
        var details = {};
        if (model.Race) {
            details['Race'] = model.Race;
        }
        if (model.Ethnicity) {
            details['Ethnicity'] = model.Ethnicity;
        }
        if (model.MajorAilment) {
            details['MajorAilment'] = model.MajorAilment;
        }
        if (model.BloodGroup) {
            details['BloodGroup'] = model.BloodGroup;
        }
        if (model.IsDiabetic != null) {
            details['IsDiabetic'] = model.IsDiabetic;
        }
        if (model.IsSmoker != null) {
            details['IsSmoker'] = model.IsSmoker;
        }
        if (model.Nationality) {
            details['Nationality'] = model.Nationality;
        }
        if (model.HasHeartAilment != null) {
            details['HasHeartAilment'] = model.HasHeartAilment;
        }
        if (model.HasHighBloodPressure != null) {
            details['HasHighBloodPressure'] = model.HasHighBloodPressure;
        }
        if (model.HasHighCholesterol != null) {
            details['HasHighCholesterol'] = model.HasHighCholesterol;
        }
        if (model.Occupation) {
            details['Occupation'] = model.Occupation;
        }
        if (model.OtherConditions) {
            details['OtherConditions'] = model.OtherConditions;
        }
        if (model.IsDiabetic != null) {
            details['IsDiabetic'] = model.IsDiabetic;
        }
        if (model.MaritalStatus) {
            details['MaritalStatus'] = model.MaritalStatus;
        }
        if (model.CreatedAt) {
            details['RecordDate'] = new Date(model.CreatedAt);
        }

        EHRAnalyticsHandler.addOrUpdatePatient(model.PatientUserId, details, appName);
    };

    public addEHRRecordHealthProfileForAppNames = async (model: HealthProfileDto) => {
        try {
            const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(model.PatientUserId);
            if (eligibleToAddEhrRecord) {
                this.addEHRRecordHealthProfile(model, null);
            }
        } catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message)}`);
        }
    };

}
