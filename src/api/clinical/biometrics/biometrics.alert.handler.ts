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
import { Loader } from '../../../startup/loader';
import { BloodGlucoseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { BloodPressureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { PulseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { BiometricAlertType } from '../../../domain.types/clinical/biometrics/biometrics.types';

///////////////////////////////////////////////////////////////////////////////

const title = 'Dear {{PatientName}},';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertHandler {

    private static _numAsyncTasks = 4;

    private static _userRepo: IUserRepo = Injector.Container.resolve(UserRepo);

    private static _personRepo: IPersonRepo = Injector.Container.resolve(PersonRepo);

    private static _userDeviceDetailsRepo: IUserDeviceDetailsRepo = Injector.Container.resolve(UserDeviceDetailsRepo);

   private static _bloodGlucoseAlertQueue = asyncLib.queue((model: BloodGlucoseAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendBloodGlucoseAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   private static _bloodPressureAlertQueue = asyncLib.queue((model: BloodPressureAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendBloodPressureAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   private static _pulseAlertQueue = asyncLib.queue((model: PulseAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendPulseAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   private static _bodyTemperatureAlertQueue = asyncLib.queue((model: BodyTemperatureAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendBodyTemperatureAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   private static _bloodOxygenAlertQueue = asyncLib.queue((model: BloodOxygenAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendBloodOxygenSaturationAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   private static _bodyBmiAlertQueue = asyncLib.queue((model: BodyBmiAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendBodyBmiAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   static async BloodGlucoseAlert(model: BloodGlucoseAlertCreateModel) {
       BiometricAlertHandler._bloodGlucoseAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing blood glucose alert notification event:' + err.message);
           }
       });
   }

   static async BloodPressureAlert(model: BloodPressureAlertCreateModel) {
       BiometricAlertHandler._bloodPressureAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing blood pressure alert notification event:' + err.message);
           }
       });
   }

   static async PulseAlert(model: PulseAlertCreateModel) {
       BiometricAlertHandler._pulseAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing pulse alert notification event: ' + err.message);
           }
       });
   }

   static async BodyTemperatureAlert(model: BodyTemperatureAlertCreateModel) {
       BiometricAlertHandler._bodyTemperatureAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing body temperature alert notification event: ' + err.message);
           }
       });
   }

   static async BloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel) {
       BiometricAlertHandler._bloodOxygenAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing send blood oxygen saturation alert notification event: ' + err.message);
           }
       });
   }

   static async BmiAlert(model: BodyBmiAlertCreateModel) {
       BiometricAlertHandler._bodyBmiAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing body bmi alert notification event: ' + err.message);
           }
       });
   }

   private static async sendBloodGlucoseAlert(model: BloodGlucoseAlertCreateModel) {
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

           const notificationTitle = title.replace("{{PatientName}}", person.FirstName ?? "there");

           var body = model.GlucoseNotification.message;
           body = body.replace("{{BloodGlucose}}", model.BloodGlucose.toString());

           Logger.instance().log(`Notification Title: ${notificationTitle}`);
           Logger.instance().log(`Notification Body: ${body}`);

           var message = Loader.notificationService.formatNotificationMessage(
               BiometricAlertType.BloodGlucoseAlert, notificationTitle, body
           );
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending blood Glucose alert notification: ${error}`);
       }
   }

   private static async sendBloodPressureAlert(model: BloodPressureAlertCreateModel) {
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
           Logger.instance().log(`Sent blood pressure notifications to - ${deviceListsStr}`);

           const notificationTitle = title.replace("{{PatientName}}", person.FirstName ?? "there");

           var body = model.BloodPressureNotification.message;
           body = body.replace("{{Systolic}}", model.Systolic.toString());
           body = body.replace("{{Diastolic}}", model.Diastolic.toString());

           Logger.instance().log(`Notification Title: ${notificationTitle}`);
           Logger.instance().log(`Notification Body: ${body}`);
           
           const message = Loader.notificationService.formatNotificationMessage(
               BiometricAlertType.BloodPressureAlert, notificationTitle, body
           );
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending blood pressure alert notification: ${error}`);
       }
   }

   private static async sendPulseAlert(model: PulseAlertCreateModel) {
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
           Logger.instance().log(`Sent pulse notifications to - ${deviceListsStr}`);

           const notificationTitle = title.replace("{{PatientName}}", person.FirstName ?? "there");

           var body = model.PulseNotification.message;
           body = body.replace("{{Pulse}}", model.Pulse.toString());

           Logger.instance().log(`Notification Title: ${notificationTitle}`);
           Logger.instance().log(`Notification Body: ${body}`);

           var message = Loader.notificationService.formatNotificationMessage(
               BiometricAlertType.PulseAlert, notificationTitle, body
           );
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending pulse alert notification: ${error}`);
       }
   }

   private static async sendBodyTemperatureAlert(model: BodyTemperatureAlertCreateModel) {
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
           Logger.instance().log(`Sent body temperature notifications to - ${deviceListsStr}`);

           const notificationTitle = title.replace("{{PatientName}}", person.FirstName ?? "there");

           var body = model.TemperatureNotification.message;
           body = body.replace("{{BodyTemperature}}", model.BodyTemperature.toString());

           Logger.instance().log(`Notification Title: ${notificationTitle}`);
           Logger.instance().log(`Notification Body: ${body}`);

           var message = Loader.notificationService.formatNotificationMessage(
               BiometricAlertType.BodyTemperatureAlert, notificationTitle, body
           );
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending body temperature alert notification: ${error}`);
       }
   }

   private static async sendBloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel) {
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
           Logger.instance().log(`Sent blood oxygen saturation notifications to - ${deviceListsStr}`);

           const notificationTitle = title.replace("{{PatientName}}", person.FirstName ?? "there");

           var body = model.OxygenNotification.message;
           body = body.replace("{{BloodOxygenSaturation}}", model.BloodOxygenSaturation.toString());

           Logger.instance().log(`Notification Title: ${notificationTitle}`);
           Logger.instance().log(`Notification Body: ${body}`);

           var message = Loader.notificationService.formatNotificationMessage(
               BiometricAlertType.BloodOxygenSaturationAlert, notificationTitle, body
           );
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending blood oxygen saturation alert notification: ${error}`);
       }
   }

   private static async sendBodyBmiAlert (model: BodyBmiAlertCreateModel) {
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

           const notificationTitle = title.replace("{{PatientName}}", person.FirstName ?? "there");

           var body = model.BmiNotification.message;
           body = body.replace("{{BMI}}", model.Bmi.toString());

           Logger.instance().log(`Notification Title: ${notificationTitle}`);
           Logger.instance().log(`Notification Body: ${body}`);

           var message = Loader.notificationService.formatNotificationMessage(
               BiometricAlertType.BodyBmiAlert, notificationTitle, body
           );
           
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending body bmi alert notification: ${error}`);
       }
   }

}
