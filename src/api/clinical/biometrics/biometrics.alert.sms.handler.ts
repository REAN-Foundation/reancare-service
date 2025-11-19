import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { BloodPressureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { IBiometricAlertHandler } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { BloodGlucoseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { AlertQueue } from './alert.queue';
import { MessagingService } from '../../../modules/communication/messaging.service/messaging.service';
import { Injector } from '../../../startup/injector';
import { Helper } from '../../../common/helper';
import { AlertHelper } from './alert.helper';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertSmsHandler implements IBiometricAlertHandler {

    private _messagingService: MessagingService = Injector.Container.resolve(MessagingService);

    bloodPressureAlert = async (model: BloodPressureAlertModel) => {
        AlertQueue.pushNotification(model, this.sendBloodPressureAlert);
    };

    bloodGlucoseAlert = async (model: BloodGlucoseAlertModel) => {
        AlertQueue.pushNotification(model, this.sendBloodGlucoseAlert);
    };

    pulseAlert = async (model: PulseAlertModel) => {
        AlertQueue.pushNotification(model, this.sendPulseAlert);
    };

    bodyTemperatureAlert = async (model: BodyTemperatureAlertModel) => {
        AlertQueue.pushNotification(model, this.sendBodyTemperatureAlert);
    };

    bloodOxygenSaturationAlert = async (model: BloodOxygenAlertModel) => {
        AlertQueue.pushNotification(model, this.sendBloodOxygenSaturationAlert);
    };

    bmiAlert = async (model: BodyBmiAlertModel) => {
        AlertQueue.pushNotification(model, this.sendBodyBmiAlert);
    };

    private sendBloodGlucoseAlert = async (model: BloodGlucoseAlertModel) => {
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
    };

    private sendBloodPressureAlert = async (model: BloodPressureAlertModel) => {
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
    };

    private sendPulseAlert = async (model: PulseAlertModel) => {
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
    };

    private sendBodyTemperatureAlert = async (model: BodyTemperatureAlertModel) => {
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
    };

    private sendBloodOxygenSaturationAlert = async (model: BloodOxygenAlertModel) => {
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
    };

    private sendBodyBmiAlert = async (model: BodyBmiAlertModel) => {
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
    };

    private formatSmsMessage(title: string, message: string): string {
        return `ALERT: ${title}\n\n${message}\n\n- Reancare Health Monitoring`;
    }

}
