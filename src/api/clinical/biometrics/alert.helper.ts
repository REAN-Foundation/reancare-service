import { PersonRepo } from "../../../database/sql/sequelize/repositories/person/person.repo";
import { BloodGlucoseAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { Injector } from "../../../startup/injector";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { UserRepo } from "../../../database/sql/sequelize/repositories/users/user/user.repo";
import { BloodPressureAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { ErrorHandler } from "../../../common/handlers/error.handler";
import { Logger } from "../../../common/logger";
import { AlertMessage, BiometricAlertSettings } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { PulseAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { BodyTemperatureAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BloodOxygenAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";
import { BodyBmiAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";
import * as asyncLib from 'async';

///////////////////////////////////////////////////////////////////////////////

export class AlertHelper {

    private static _userRepo: IUserRepo = Injector.Container.resolve(UserRepo);

    private static _personRepo: IPersonRepo = Injector.Container.resolve(PersonRepo);

    static createNotificationQueue<T>(handlerFunction: (task: T) => Promise<void>, concurrency = 4) {
        return asyncLib.queue(async (task: T, done) => {
            (async () => {
                await handlerFunction(task);
                done();
            })();
        }, concurrency);
    }

    static createMessagingQueue<T>(handlerFunction: (model: T,
        metadata: BiometricAlertSettings) => Promise<void>, concurrency = 4) {
        return asyncLib.queue(async (task: any, done) => {
            (async () => {
                await handlerFunction(task.model, task.metaData);
                done();
            })();
        }, concurrency);
    }

    static async pushNotification<T>(queue: any, task: T, alertName: string) {
        await queue.push(task, (err: any) => {
            if (err) {
                Logger.instance().log(`Error pushing ${alertName} alert: ${err.message}`);
            }
        });
    }

    static async pushMessaging<T>(queue: any, model: T, metaData: BiometricAlertSettings, alertName: string) {
        await queue.push({ model, metaData }, (err: any) => {
            if (err) {
                Logger.instance().log(`Error pushing ${alertName} alert: ${err.message}`);
            }
        });
    }

    static async getBloodGlucoseAlertMessage(model: BloodGlucoseAlertCreateModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }
         
        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = model.GlucoseNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

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

    static async getBloodPressureAlertMessage(model: BloodPressureAlertCreateModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }
            
        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = model.BloodPressureNotification.title.replace("{{PatientName}}", person.FirstName ?? '');

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

    static async getPulseAlertMessage(model: PulseAlertCreateModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = model.PulseNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

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

    static async getBodyTemperatureAlertMessage(model: BodyTemperatureAlertCreateModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = model.TemperatureNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

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

    static async getBloodOxygenSaturationAlertMessage(model: BloodOxygenAlertCreateModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = model.OxygenNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

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

    static async getBodyBmiAlertMessage(model: BodyBmiAlertCreateModel): Promise<AlertMessage> {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        const notificationTitle = model.BmiNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

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
