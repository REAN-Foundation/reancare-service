import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { BloodPressureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { BiometricAlertSettings } from '../../../domain.types/clinical/biometrics/biometrics.types';
import { IBiometricAlert } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { BloodGlucoseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { AlertHelper } from './alert.helper';
import { MessagingService } from '../../../modules/communication/messaging.service/messaging.service';
import { Injector } from '../../../startup/injector';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertSmsHandler implements IBiometricAlert {

    private _numAsyncTasks = 4;

    private _messagingService: MessagingService = Injector.Container.resolve(MessagingService);

    private _bloodGlucoseAlertQueue = AlertHelper.createMessagingQueue<BloodGlucoseAlertCreateModel>(
        (model, metaData) => this.sendBloodGlucoseAlert(model, metaData),
        this._numAsyncTasks
    );

    private _bloodPressureAlertQueue = AlertHelper.createMessagingQueue<BloodPressureAlertCreateModel>(
        (model, metaData) => this.sendBloodPressureAlert(model, metaData),
        this._numAsyncTasks
    );

    private _bodyTemperatureAlertQueue = AlertHelper.createMessagingQueue<BodyTemperatureAlertCreateModel>(
        (model, metaData) => this.sendBodyTemperatureAlert(model, metaData),
        this._numAsyncTasks
    );

    private _pulseAlertQueue = AlertHelper.createMessagingQueue<PulseAlertCreateModel>(
        (model, metaData) => this.sendPulseAlert(model, metaData),
        this._numAsyncTasks
    );

    private _bloodOxygenAlertQueue = AlertHelper.createMessagingQueue<BloodOxygenAlertCreateModel>(
        (model, metaData) => this.sendBloodOxygenSaturationAlert(model, metaData),
        this._numAsyncTasks
    );

    private _bodyBmiAlertQueue = AlertHelper.createMessagingQueue<BodyBmiAlertCreateModel>(
        (model, metaData) => this.sendBodyBmiAlert(model, metaData),
        this._numAsyncTasks
    );

    async bloodPressureAlert(model: BloodPressureAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
        AlertHelper.pushMessaging(this._bloodPressureAlertQueue, model, metaData, 'blood pressure');
    }

    async bloodGlucoseAlert(model: BloodGlucoseAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
        AlertHelper.pushMessaging(this._bloodGlucoseAlertQueue, model, metaData, 'blood glucose');
    }

    async pulseAlert(model: PulseAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
        AlertHelper.pushMessaging(this._pulseAlertQueue, model, metaData, 'pulse');
    }

    async bodyTemperatureAlert(model: BodyTemperatureAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
        AlertHelper.pushMessaging(this._bodyTemperatureAlertQueue, model, metaData, 'body temperature');
    }

    async bloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
        AlertHelper.pushMessaging(this._bloodOxygenAlertQueue, model, metaData, 'blood oxygen saturation');
    }

    async bmiAlert(model: BodyBmiAlertCreateModel, metaData: BiometricAlertSettings | null = null) {
        AlertHelper.pushMessaging(this._bodyBmiAlertQueue, model, metaData, 'body bmi');
    }

    private async sendBloodGlucoseAlert(model: BloodGlucoseAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBloodGlucoseAlertMessage(model);

            if (!alertMessage.Phone) {
                Logger.instance().log('User phone number not found for blood glucose alert');
                return;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(alertMessage.Phone);
            const smsMessage = this.formatSmsMessage(alertMessage.Title, alertMessage.Message);

            await this._messagingService.sendSMS(normalizedPhoneNumber, smsMessage);
            Logger.instance().log(`Successfully sent blood glucose SMS alert to ${normalizedPhoneNumber}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood glucose SMS alert: ${error}`);
        }
    }

    private async sendBloodPressureAlert(model: BloodPressureAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBloodPressureAlertMessage(model);

            if (!alertMessage.Phone) {
                Logger.instance().log('User phone number not found for blood pressure alert');
                return;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(alertMessage.Phone);
            const smsMessage = this.formatSmsMessage(alertMessage.Title, alertMessage.Message);

            await this._messagingService.sendSMS(normalizedPhoneNumber, smsMessage);
            Logger.instance().log(`Successfully sent blood pressure SMS alert to ${normalizedPhoneNumber}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood pressure SMS alert: ${error}`);
        }
    }

    private async sendPulseAlert(model: PulseAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getPulseAlertMessage(model);

            if (!alertMessage.Phone) {
                Logger.instance().log('User phone number not found for pulse alert');
                return;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(alertMessage.Phone);
            const smsMessage = this.formatSmsMessage(alertMessage.Title, alertMessage.Message);

            await this._messagingService.sendSMS(normalizedPhoneNumber, smsMessage);
            Logger.instance().log(`Successfully sent pulse SMS alert to ${normalizedPhoneNumber}`);

        } catch (error) {
            Logger.instance().log(`Error sending pulse SMS alert: ${error}`);
        }
    }

    private async sendBodyTemperatureAlert(model: BodyTemperatureAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBodyTemperatureAlertMessage(model);

            if (!alertMessage.Phone) {
                Logger.instance().log('User phone number not found for body temperature alert');
                return;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(alertMessage.Phone);
            const smsMessage = this.formatSmsMessage(alertMessage.Title, alertMessage.Message);

            await this._messagingService.sendSMS(normalizedPhoneNumber, smsMessage);
            Logger.instance().log(`Successfully sent body temperature SMS alert to ${normalizedPhoneNumber}`);

        } catch (error) {
            Logger.instance().log(`Error sending body temperature SMS alert: ${error}`);
        }
    }

    private async sendBloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBloodOxygenSaturationAlertMessage(model);

            if (!alertMessage.Phone) {
                Logger.instance().log('User phone number not found for blood oxygen saturation alert');
                return;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(alertMessage.Phone);
            const smsMessage = this.formatSmsMessage(alertMessage.Title, alertMessage.Message);

            await this._messagingService.sendSMS(normalizedPhoneNumber, smsMessage);
            Logger.instance().log(`Successfully sent blood oxygen saturation SMS alert to ${normalizedPhoneNumber}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood oxygen saturation SMS alert: ${error}`);
        }
    }

    private async sendBodyBmiAlert(model: BodyBmiAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBodyBmiAlertMessage(model);

            if (!alertMessage.Phone) {
                Logger.instance().log('User phone number not found for body bmi alert');
                return;
            }

            const normalizedPhoneNumber = Helper.normalizePhoneNumber(alertMessage.Phone);
            const smsMessage = this.formatSmsMessage(alertMessage.Title, alertMessage.Message);

            await this._messagingService.sendSMS(normalizedPhoneNumber, smsMessage);
            Logger.instance().log(`Successfully sent body bmi SMS alert to ${normalizedPhoneNumber}`);

        } catch (error) {
            Logger.instance().log(`Error sending body bmi SMS alert: ${error}`);
        }
    }

    private formatSmsMessage(title: string, message: string): string {
        return `ALERT: ${title}\n\n${message}\n\n- Reancare Health Monitoring`;
    }

}
