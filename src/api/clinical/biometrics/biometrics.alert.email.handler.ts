import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { BloodPressureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { IBiometricAlertHandler } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { BloodGlucoseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { BodyWeightAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.weight';
import { AlertQueue } from './alert.queue';
import { EmailService } from '../../../modules/communication/email/email.service';
import { EmailDetails } from '../../../modules/communication/email/email.details';
import { Injector } from '../../../startup/injector';
import { AlertHelper } from './alert.helper';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertEmailHandler implements IBiometricAlertHandler {

    private _emailService: EmailService = Injector.Container.resolve(EmailService);

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

    bodyWeightAlert = async (model: BodyWeightAlertModel) => {
        AlertQueue.pushNotification(model, this.sendBodyWeightAlert);
    };

    private sendBloodGlucoseAlert = async (model: BloodGlucoseAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodGlucoseAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for blood glucose alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent blood glucose email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood glucose email alert: ${error}`);
        }
    };

    private sendBloodPressureAlert = async (model: BloodPressureAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodPressureAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for blood pressure alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent blood pressure email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood pressure email alert: ${error}`);
        }
    };

    private sendPulseAlert = async (model: PulseAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getPulseAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for pulse alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent pulse email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending pulse email alert: ${error}`);
        }
    };

    private sendBodyTemperatureAlert = async (model: BodyTemperatureAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBodyTemperatureAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for body temperature alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent body temperature email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending body temperature email alert: ${error}`);
        }
    };

    private sendBloodOxygenSaturationAlert = async (model: BloodOxygenAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodOxygenSaturationAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for blood oxygen saturation alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent blood oxygen saturation email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood oxygen saturation email alert: ${error}`);
        }
    };

    private sendBodyBmiAlert = async (model: BodyBmiAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBodyBmiAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for body bmi alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent body bmi email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending body bmi email alert: ${error}`);
        }
    };

    private sendBodyWeightAlert = async (model: BodyWeightAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBodyWeightAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for body weight alert');
                return;
            }

            const emailTemplate = await this._emailService.getTemplate('biometric.alert.template.html');
            const emailBody = emailTemplate.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : emailBody
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent body weight email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending body weight email alert: ${error}`);
        }
    };

}
