import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { IUserDeviceDetailsRepo } from '../../../database/repository.interfaces/users/user/user.device.details.repo.interface ';
import { Injector } from '../../../startup/injector';
import { UserDeviceDetailsRepo } from '../../../database/sql/sequelize/repositories/users/user/user.device.details.repo';
import { Loader } from '../../../startup/loader';
import { BloodPressureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { BiometricAlertType } from '../../../domain.types/clinical/biometrics/biometrics.types';
import { IBiometricAlertHandler } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { BloodGlucoseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { BodyWeightAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.weight';
import { AlertQueue } from './alert.queue';
import { AlertHelper } from './alert.helper';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertNotificationHandler implements IBiometricAlertHandler{

    private _userDeviceDetailsRepo: IUserDeviceDetailsRepo = Injector.Container.resolve(UserDeviceDetailsRepo);

    bodyTemperatureAlert = async (model: BodyTemperatureAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendBodyTemperatureAlert);
    };

    bloodPressureAlert = async (model: BloodPressureAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendBloodPressureAlert);
    };

    bloodGlucoseAlert = async (model: BloodGlucoseAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendBloodGlucoseAlert);
    };

    pulseAlert = async (model: PulseAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendPulseAlert);
    };

    bloodOxygenSaturationAlert = async (model: BloodOxygenAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendBloodOxygenSaturationAlert);
    };

    bmiAlert = async (model: BodyBmiAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendBodyBmiAlert);
    };

    bodyWeightAlert = async (model: BodyWeightAlertModel) => {
        await AlertQueue.pushNotification(model, this.sendBodyWeightAlert);
    };

    private sendBloodGlucoseAlert = async (model: BloodGlucoseAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodGlucoseAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent blood glucose notifications to - ${deviceListsStr}`);

            var message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.BloodGlucoseAlert, alertMessage.Title, alertMessage.Message
            );
            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending blood Glucose alert notification: ${error}`);
        }
    };

    private sendBloodPressureAlert = async (model: BloodPressureAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodPressureAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent blood pressure notifications to - ${deviceListsStr}`);
           
            const message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.BloodPressureAlert, alertMessage.Title, alertMessage.Message
            );
            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending blood pressure alert notification: ${error}`);
        }
    };

    private sendPulseAlert = async (model: PulseAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getPulseAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent pulse notifications to - ${deviceListsStr}`);

            var message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.PulseAlert, alertMessage.Title, alertMessage.Message
            );
            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending pulse alert notification: ${error}`);
        }
    };

    private sendBodyTemperatureAlert = async (model: BodyTemperatureAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBodyTemperatureAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent body temperature notifications to - ${deviceListsStr}`);

            var message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.BodyTemperatureAlert, alertMessage.Title, alertMessage.Message
            );
            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending body temperature alert notification: ${error}`);
        }
    };

    private sendBloodOxygenSaturationAlert = async (model: BloodOxygenAlertModel) => {
        try {

            const alertMessage = await AlertHelper.getBloodOxygenSaturationAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent blood oxygen saturation notifications to - ${deviceListsStr}`);

            var message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.BloodOxygenSaturationAlert, alertMessage.Title, alertMessage.Message
            );
            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending blood oxygen saturation alert notification: ${error}`);
        }
    };

    private sendBodyBmiAlert = async (model: BodyBmiAlertModel) => {
        try {

            const alertMessage = await AlertHelper.getBodyBmiAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent body bmi notifications to - ${deviceListsStr}`);

            var message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.BodyBmiAlert, alertMessage.Title, alertMessage.Message
            );

            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending body bmi alert notification: ${error}`);
        }
    };

    private sendBodyWeightAlert = async (model: BodyWeightAlertModel) => {
        try {

            const alertMessage = await AlertHelper.getBodyWeightAlertMessage(model);

            var deviceList = await this._userDeviceDetailsRepo.getByUserId(model.PatientUserId);
            var deviceListsStr = JSON.stringify(deviceList, null, 2);
            Logger.instance().log(`Sent body weight notifications to - ${deviceListsStr}`);

            var message = Loader.notificationService.formatNotificationMessage(
                BiometricAlertType.BodyWeightAlert, alertMessage.Title, alertMessage.Message
            );

            for await (var device of deviceList) {
                await Loader.notificationService.sendNotificationToDevice(device.Token, message);
            }
        } catch (error) {
            Logger.instance().log(`Error sending body weight alert notification: ${error}`);
        }
    };

}
