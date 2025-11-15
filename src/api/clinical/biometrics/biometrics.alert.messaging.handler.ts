import * as asyncLib from 'async';
import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IUserDeviceDetailsRepo } from '../../../database/repository.interfaces/users/user/user.device.details.repo.interface ';
import { Injector } from '../../../startup/injector';
import { UserRepo } from '../../../database/sql/sequelize/repositories/users/user/user.repo';
import { UserDeviceDetailsRepo } from '../../../database/sql/sequelize/repositories/users/user/user.device.details.repo';
import { PersonRepo } from '../../../database/sql/sequelize/repositories/person/person.repo';
import { BloodPressureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import axios from 'axios';
import { BotRequestDomainModel } from '../../../domain.types/miscellaneous/bot,request.types';
import { BotMessagingType } from '../../../domain.types/miscellaneous/bot,request.types';
import { BiometricAlertSettings } from '../../../domain.types/clinical/biometrics/biometrics.types';
import { NotificationChannel } from '../../../domain.types/general/notification/notification.types';
import { IBiometricAlert } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { Helper } from '../../../common/helper';
import { BloodGlucoseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertMessagingHandler implements IBiometricAlert {

    private _numAsyncTasks = 4;

    private _userRepo: IUserRepo = Injector.Container.resolve(UserRepo);

    private _personRepo: IPersonRepo = Injector.Container.resolve(PersonRepo);

    private _userDeviceDetailsRepo: IUserDeviceDetailsRepo = Injector.Container.resolve(UserDeviceDetailsRepo);

    private _bloodGlucoseAlertQueue = asyncLib.queue((task:
        { model: BloodGlucoseAlertCreateModel, metaData: BiometricAlertSettings | null }, onCompleted) => {
        (async () => {
            await this.sendBloodGlucoseAlert(task.model, task.metaData);
            onCompleted();
        })();
    }, this._numAsyncTasks);
    
   private  _bloodPressureAlertQueue = asyncLib.queue((task:
    { model: BloodPressureAlertCreateModel, metaData: BiometricAlertSettings | null }, onCompleted) => {
       (async () => {
           await this.sendBloodPressureAlert(task.model, task.metaData);
           onCompleted();
       })();
   }, this._numAsyncTasks);

   private _bodyTemperatureAlertQueue = asyncLib.queue((task :
    { model: BodyTemperatureAlertCreateModel, metaData: BiometricAlertSettings | null }, onCompleted) => {
       (async () => {
           await this.sendBodyTemperatureAlert(task.model, task.metaData);
           onCompleted();
       })();
   }, this._numAsyncTasks);

   private _pulseAlertQueue = asyncLib.queue((task:
    { model: PulseAlertCreateModel, metaData: BiometricAlertSettings | null }, onCompleted) => {
       (async () => {
           await this.sendPulseAlert(task.model, task.metaData);
           onCompleted();
       })();
   }, this._numAsyncTasks);

   private _bloodOxygenAlertQueue = asyncLib.queue((task:
    { model: BloodOxygenAlertCreateModel, metaData: BiometricAlertSettings | null }, onCompleted) => {
       (async () => {
           await this.sendBloodOxygenSaturationAlert(task.model, task.metaData);
           onCompleted();
       })();
   }, this._numAsyncTasks);

private _bodyBmiAlertQueue = asyncLib.queue((task:
    { model: BodyBmiAlertCreateModel, metaData: BiometricAlertSettings | null }, onCompleted) => {
    (async () => {
        await this.sendBodyBmiAlert(task.model, task.metaData);
        onCompleted();
    })();
}, this._numAsyncTasks);

async bloodPressureAlert(model: BloodPressureAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
    this._bloodPressureAlertQueue.push({ model, metaData }, (err) => {
        if (err) {
            Logger.instance().log('Error pushing blood pressure alert notification event:' + err.message);
        }
    });
}

async bloodGlucoseAlert(model: BloodGlucoseAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
    this._bloodGlucoseAlertQueue.push( { model, metaData }, (err) => {
        if (err) {
            Logger.instance().log('Error pushing blood glucose alert notification event:' + err.message);
        }
    });
}

async pulseAlert(model: PulseAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
    this._pulseAlertQueue.push({ model, metaData }, (err) => {
        if (err) {
            Logger.instance().log('Error pushing pulse alert notification event:' + err.message);
        }
    });
}

async bodyTemperatureAlert(model: BodyTemperatureAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
    this._bodyTemperatureAlertQueue.push({ model, metaData }, (err) => {
        if (err) {
            Logger.instance().log('Error pushing body temperature alert notification event: ' + err.message);
        }
    });
}

async bloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
    this._bloodOxygenAlertQueue.push({ model, metaData }, (err) => {
        if (err) {
            Logger.instance().log('Error pushing send blood oxygen saturation alert notification event: ' + err.message);
        }
    });
}

async bmiAlert(model: BodyBmiAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
    this._bodyBmiAlertQueue.push({ model, metaData }, (err) => {
        if (err) {
            Logger.instance().log('Error pushing body bmi alert notification event: ' + err.message);
        }
    });
}

private async sendBloodGlucoseAlert(model: BloodGlucoseAlertCreateModel,
    biometricAlertSettings: BiometricAlertSettings | null = null) {
    try {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }
      
        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
        var deviceListsStr = JSON.stringify(deviceList, null, 2);
        Logger.instance().log(`Sent blood glucose notifications to - ${deviceListsStr}`);

        const notificationTitle = model.GlucoseNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.GlucoseNotification.message;
        body = body.replace("{{BloodGlucose}}", model.BloodGlucose.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);

        const phoneNumber = this.getReceipantPhoneNumber(person, biometricAlertSettings?.Channel);

        if (!phoneNumber) {
            ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
        }
           
        const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
        const botRequestModel: BotRequestDomainModel = {
            PhoneNumber : normalizedPhoneNumber,
            ClientName  : biometricAlertSettings?.ClientName ?? user.TenantCode,
            Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
            AgentName   : "Reancare",
            Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
            Message     : body,
            Payload     : {}
        };

        await this.sendMessagingAlert(botRequestModel);
    } catch (error) {
        Logger.instance().log(`Error sending blood Glucose alert notification: ${error}`);
    }
}

private  async sendBloodPressureAlert(model: BloodPressureAlertCreateModel,
    biometricAlertSettings: BiometricAlertSettings | null = null) {
    try {
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

        const phoneNumber = this.getReceipantPhoneNumber(person, biometricAlertSettings?.Channel);

        if (!phoneNumber) {
            ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
        }
           
        const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
        const botRequestModel: BotRequestDomainModel = {
            PhoneNumber : normalizedPhoneNumber,
            ClientName  : biometricAlertSettings?.ClientName ?? user.TenantCode,
            Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
            AgentName   : "Reancare",
            Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
            Message     : body,
            Payload     : {}
        };

        await this.sendMessagingAlert(botRequestModel);
    } catch (error) {
        Logger.instance().log(`Error sending blood pressure alert notification: ${error}`);
    }
}

private async sendPulseAlert(model: PulseAlertCreateModel, biometricAlertSettings: BiometricAlertSettings | null = null) {
    try {
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

        const phoneNumber = this.getReceipantPhoneNumber(person, biometricAlertSettings?.Channel);

        if (!phoneNumber) {
            ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
        }
           
        const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
        const botRequestModel: BotRequestDomainModel = {
            PhoneNumber : normalizedPhoneNumber,
            ClientName  : biometricAlertSettings?.ClientName ?? user.TenantCode,
            Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
            AgentName   : "Reancare",
            Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
            Message     : body,
            Payload     : {}
        };

        await this.sendMessagingAlert(botRequestModel);
    } catch (error) {
        Logger.instance().log(`Error sending pulse alert notification: ${error}`);
    }
}

private async sendBodyTemperatureAlert(model: BodyTemperatureAlertCreateModel,
    biometricAlertSettings: BiometricAlertSettings | null = null) {
    try {
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

        const phoneNumber = this.getReceipantPhoneNumber(person, biometricAlertSettings?.Channel);

        if (!phoneNumber) {
            ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
        }
           
        const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
        const botRequestModel: BotRequestDomainModel = {
            PhoneNumber : normalizedPhoneNumber,
            ClientName  : biometricAlertSettings?.ClientName ?? user.TenantCode,
            Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
            AgentName   : "Reancare",
            Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
            Message     : body,
            Payload     : {}
        };

        await this.sendMessagingAlert(botRequestModel);
    } catch (error) {
        Logger.instance().log(`Error sending body temperature alert notification: ${error}`);
    }
}

private async sendBloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel,
    biometricAlertSettings: BiometricAlertSettings | null = null) {
    try {
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

        const phoneNumber = this.getReceipantPhoneNumber(person, biometricAlertSettings?.Channel);

        if (!phoneNumber) {
            ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
        }
           
        const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
        const botRequestModel: BotRequestDomainModel = {
            PhoneNumber : normalizedPhoneNumber,
            ClientName  : biometricAlertSettings?.ClientName ?? user.TenantCode,
            Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
            AgentName   : "Reancare",
            Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
            Message     : body,
            Payload     : {}
        };

        await this.sendMessagingAlert(botRequestModel);

    } catch (error) {
        Logger.instance().log(`Error sending blood oxygen saturation alert notification: ${error}`);
    }
}

private async sendBodyBmiAlert (model: BodyBmiAlertCreateModel,
    biometricAlertSettings: BiometricAlertSettings | null = null) {
    try {
        var user = await this._userRepo.getById(model.PatientUserId);
        if (!user) {
            ErrorHandler.throwNotFoundError('User not found');
        }

        var person = await this._personRepo.getById(user.PersonId);
        if (!person) {
            ErrorHandler.throwNotFoundError('Person not found');
        }

        var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
        var deviceListsStr = JSON.stringify(deviceList, null, 2);
        Logger.instance().log(`Sent body bmi notifications to - ${deviceListsStr}`);

        const notificationTitle = model.BmiNotification.title.replace("{{PatientName}}", person.FirstName ?? "there");

        var body = model.BmiNotification.message;
        body = body.replace("{{BMI}}", model.Bmi.toString());

        Logger.instance().log(`Notification Title: ${notificationTitle}`);
        Logger.instance().log(`Notification Body: ${body}`);
        const phoneNumber = this.getReceipantPhoneNumber(person, biometricAlertSettings?.Channel);

        if (!phoneNumber) {
            ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
        }
           
        const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
        const botRequestModel: BotRequestDomainModel = {
            PhoneNumber : normalizedPhoneNumber,
            ClientName  : biometricAlertSettings?.ClientName ?? user.TenantCode,
            Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
            AgentName   : "Reancare",
            Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
            Message     : body,
            Payload     : {}
        };

        await this.sendMessagingAlert(botRequestModel);

    } catch (error) {
        Logger.instance().log(`Error sending body bmi alert notification: ${error}`);
    }
}

private async sendMessagingAlert(model: BotRequestDomainModel) {
    try {
        const headers = {
            'Content-Type'    : 'application/json',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
        };

        var url = process.env.REANBOT_BACKEND_BASE_URL + '/' + model.ClientName + '/' + model.Channel + '/' + process.env.REANBOT_WEBHOOK_CLIENT_URL_TOKEN + '/send';
        var body = {
            type      : model.Type,
            message   : model.Message,
            userId    : model.PhoneNumber,
            agentName : model.AgentName,
            payload   : model.Payload ?? {}
        };
        var response = await axios.post(url, body, { headers });
        if (response.status === 201 || response.status === 200) {
            Logger.instance().log(`Successfully sent biometric messaging alert! ${body?.userId}`);
        } else {
            Logger.instance().error('Unable to send biometric messaging alert!', response.status, response.data);
        }
    } catch (error) {
        Logger.instance().log(`${error.message}`);
    }
}

private getReceipantPhoneNumber(person: PersonDomainModel, channel: NotificationChannel) {
    switch (channel) {
        case NotificationChannel.WhatsappMeta:
            return person.Phone;
        case NotificationChannel.Telegram:
            return person.UniqueReferenceId;
        default:
            return null;
    }
}

}
