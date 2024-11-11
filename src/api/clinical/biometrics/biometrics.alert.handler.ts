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
import { BloodPressureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
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

   private static _bloodPressureAlertQueue = asyncLib.queue((model: BloodPressureAlertCreateModel, onCompleted) => {
       (async () => {
           await BiometricAlertHandler.sendBloodPressureAlert(model);
           onCompleted();
       })();
   }, BiometricAlertHandler._numAsyncTasks);

   static async BloodPressureAlert(model: BloodPressureAlertCreateModel) {
       BiometricAlertHandler._bloodPressureAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing blood pressure alert notification event:' + err.message);
           }
       });
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

}
