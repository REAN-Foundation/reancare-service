import { PersonRepo } from "../../../database/sql/sequelize/repositories/person/person.repo";
import { BloodGlucoseAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { Injector } from "../../../startup/injector";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { UserRepo } from "../../../database/sql/sequelize/repositories/users/user/user.repo";
import { BloodPressureAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { ErrorHandler } from "../../../common/handlers/error.handler";
import { Logger } from "../../../common/logger";
import { AlertMessage, DEFAULT_ALERT_TITLE } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { PulseAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { BodyTemperatureAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BloodOxygenAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";
import { BodyBmiAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";

///////////////////////////////////////////////////////////////////////////////

export class AlertHelper {

    private static _userRepo: IUserRepo = Injector.Container.resolve(UserRepo);

    private static _personRepo: IPersonRepo = Injector.Container.resolve(PersonRepo);

    static async getBloodGlucoseAlertMessage(model: BloodGlucoseAlertModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }
         
        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = DEFAULT_ALERT_TITLE.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.GlucoseNotification.message;
        body = body.replace("{{BloodGlucose}}", model.BloodGlucose.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        return {
            Title             : notificationTitle,
            Message           : body,
            Phone             : person.Phone,
            UniqueReferenceId : person.UniqueReferenceId,
            TenantCode        : user.TenantCode,
            Email             : person.Email,
        };
    }

    static async getBloodPressureAlertMessage(model: BloodPressureAlertModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }
            
        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = DEFAULT_ALERT_TITLE.replace("{{PatientName}}", person.FirstName ?? '');

        var body = model.BloodPressureNotification.message;
        body = body.replace("{{Systolic}}", model.Systolic.toString());
        body = body.replace("{{Diastolic}}", model.Diastolic.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        return {
            Title             : notificationTitle,
            Message           : body,
            Phone             : person.Phone,
            UniqueReferenceId : person.UniqueReferenceId,
            TenantCode        : user.TenantCode,
            Email             : person.Email,
        };
    }

    static async getPulseAlertMessage(model: PulseAlertModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = DEFAULT_ALERT_TITLE.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.PulseNotification.message;
        body = body.replace("{{Pulse}}", model.Pulse.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        return {
            Title             : notificationTitle,
            Message           : body,
            Phone             : person.Phone,
            UniqueReferenceId : person.UniqueReferenceId,
            TenantCode        : user.TenantCode,
            Email             : person.Email,
        };
    }

    static async getBodyTemperatureAlertMessage(model: BodyTemperatureAlertModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = DEFAULT_ALERT_TITLE.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.TemperatureNotification.message;
        body = body.replace("{{BodyTemperature}}", model.BodyTemperature.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        return {
            Title             : notificationTitle,
            Message           : body,
            Phone             : person.Phone,
            UniqueReferenceId : person.UniqueReferenceId,
            TenantCode        : user.TenantCode,
            Email             : person.Email,
        };
    }

    static async getBloodOxygenSaturationAlertMessage(model: BloodOxygenAlertModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = DEFAULT_ALERT_TITLE.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.OxygenNotification.message;
        body = body.replace("{{BloodOxygenSaturation}}", model.BloodOxygenSaturation.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        return {
            Title             : notificationTitle,
            Message           : body,
            Phone             : person.Phone,
            UniqueReferenceId : person.UniqueReferenceId,
            TenantCode        : user.TenantCode,
            Email             : person.Email,
        };
    }

    static async getBodyBmiAlertMessage(model: BodyBmiAlertModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = DEFAULT_ALERT_TITLE.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.BmiNotification.message;
        body = body.replace("{{BMI}}", model.Bmi.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        return {
            Title             : notificationTitle,
            Message           : body,
            Phone             : person.Phone,
            UniqueReferenceId : person.UniqueReferenceId,
            TenantCode        : user.TenantCode,
            Email             : person.Email,
        };
    }

}
