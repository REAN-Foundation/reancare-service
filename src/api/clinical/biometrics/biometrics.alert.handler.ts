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

///////////////////////////////////////////////////////////////////////////////

const title = 'Dear {{PatientName}},';
const notificationType = 'Alert';

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

   static async BloodGlucoseAlert(model: BloodGlucoseAlertCreateModel) {
       BiometricAlertHandler._bloodGlucoseAlertQueue.push(model, (err) => {
           if (err) {
               Logger.instance().log('Error pushing send blood glucose alert notification event:' + err.message);
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

           Logger.instance().log(`Notification Title: ${title}`);
           Logger.instance().log(`Notification Body: ${body}`);

           var message = Loader.notificationService.formatNotificationMessage(
               notificationType, notificationTitle, body
           );
           for await (var device of deviceList) {
               await Loader.notificationService.sendNotificationToDevice(device.Token, message);
           }
       } catch (error) {
           Logger.instance().log(`Error sending blood Glucose alert notification: ${error}`);
       }
   }

}
