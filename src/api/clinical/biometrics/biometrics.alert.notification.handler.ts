import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { IUserDeviceDetailsRepo } from '../../../database/repository.interfaces/users/user/user.device.details.repo.interface ';
import { Injector } from '../../../startup/injector';
import { UserDeviceDetailsRepo } from '../../../database/sql/sequelize/repositories/users/user/user.device.details.repo';
import { Loader } from '../../../startup/loader';
import { BloodPressureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { BiometricAlertType } from '../../../domain.types/clinical/biometrics/biometrics.types';
import { IBiometricAlert } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { BloodGlucoseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { AlertHelper } from './alert.helper';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertNotificationHandler implements IBiometricAlert{

    private _numAsyncTasks = 4;

    private _userDeviceDetailsRepo: IUserDeviceDetailsRepo = Injector.Container.resolve(UserDeviceDetailsRepo);

    private _bloodGlucoseAlertQueue = AlertHelper.createNotificationQueue(
        async (model) => this.sendBloodGlucoseAlert(model),
        this._numAsyncTasks
    );

    private _bloodPressureAlertQueue = AlertHelper.createNotificationQueue <BloodPressureAlertCreateModel>(
        async (model) => this.sendBloodPressureAlert(model),
        this._numAsyncTasks
    );

    private _pulseAlertQueue = AlertHelper.createNotificationQueue <PulseAlertCreateModel>(
        async (model) => this.sendPulseAlert(model),
        this._numAsyncTasks
    );

    private _bodyTemperatureAlertQueue = AlertHelper.createNotificationQueue <BodyTemperatureAlertCreateModel>(
        async (model) => this.sendBodyTemperatureAlert(model),
        this._numAsyncTasks
    );

    private _bloodOxygenAlertQueue = AlertHelper.createNotificationQueue <BloodOxygenAlertCreateModel>(
        async (model) => this.sendBloodOxygenSaturationAlert(model),
        this._numAsyncTasks
    );

    private _bodyBmiAlertQueue = AlertHelper.createNotificationQueue <BodyBmiAlertCreateModel>(
        async (model) => this.sendBodyBmiAlert(model),
        this._numAsyncTasks
    );

    async bodyTemperatureAlert(model: BodyTemperatureAlertCreateModel) {
        await AlertHelper.pushNotification(this._bodyTemperatureAlertQueue, model, 'body temperature');
    }

    async bloodPressureAlert(model: BloodPressureAlertCreateModel) {
        await AlertHelper.pushNotification(this._bloodPressureAlertQueue, model, 'blood pressure');
    }

    async bloodGlucoseAlert(model: BloodGlucoseAlertCreateModel) {
        await AlertHelper.pushNotification(this._bloodGlucoseAlertQueue, model, 'blood glucose');
    }

    async pulseAlert(model: PulseAlertCreateModel) {
        await AlertHelper.pushNotification(this._pulseAlertQueue, model, 'pulse');
    }

    async bloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel) {
        await AlertHelper.pushNotification(this._bloodOxygenAlertQueue, model, 'blood oxygen saturation');
    }

    async bmiAlert(model: BodyBmiAlertCreateModel) {
        await AlertHelper.pushNotification(this._bodyBmiAlertQueue, model, 'body bmi');
    }

    private async sendBloodGlucoseAlert(model: BloodGlucoseAlertCreateModel) {
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
    }

    private async sendBloodPressureAlert(model: BloodPressureAlertCreateModel) {
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
    }

    private async sendPulseAlert(model: PulseAlertCreateModel) {
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
    }

    private async sendBodyTemperatureAlert(model: BodyTemperatureAlertCreateModel) {
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
    }

    private async sendBloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel) {
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
    }

    private async sendBodyBmiAlert (model: BodyBmiAlertCreateModel) {
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
    }

}
