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
import { EmailService } from '../../../modules/communication/email/email.service';
import { EmailDetails } from '../../../modules/communication/email/email.details';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class BiometricAlertEmailHandler implements IBiometricAlert {

    private _numAsyncTasks = 4;

    private _emailService: EmailService = Injector.Container.resolve(EmailService);

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

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for blood glucose alert');
                return;
            }

            const template = await this._emailService.getTemplate('biometric.alert.template.html');
            const body = template.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : body
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent blood glucose email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood glucose email alert: ${error}`);
        }
    }

    private async sendBloodPressureAlert(model: BloodPressureAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBloodPressureAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for blood pressure alert');
                return;
            }

            const template = await this._emailService.getTemplate('biometric.alert.template.html');
            const body = template.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : body
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent blood pressure email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood pressure email alert: ${error}`);
        }
    }

    private async sendPulseAlert(model: PulseAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getPulseAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for pulse alert');
                return;
            }

            const template = await this._emailService.getTemplate('biometric.alert.template.html');
            const body = template.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : body
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent pulse email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending pulse email alert: ${error}`);
        }
    }

    private async sendBodyTemperatureAlert(model: BodyTemperatureAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBodyTemperatureAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for body temperature alert');
                return;
            }

            const template = await this._emailService.getTemplate('biometric.alert.template.html');
            const body = template.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : body
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent body temperature email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending body temperature email alert: ${error}`);
        }
    }

    private async sendBloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBloodOxygenSaturationAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for blood oxygen saturation alert');
                return;
            }

            const template = await this._emailService.getTemplate('biometric.alert.template.html');
            const body = template.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : body
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent blood oxygen saturation email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending blood oxygen saturation email alert: ${error}`);
        }
    }

    private async sendBodyBmiAlert(model: BodyBmiAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBodyBmiAlertMessage(model);

            if (!alertMessage.Email) {
                Logger.instance().log('User email not found for body bmi alert');
                return;
            }

            const template = await this._emailService.getTemplate('biometric.alert.template.html');
            const body = template.replace('{{TITLE}}', alertMessage.Title).replace('{{MESSAGE}}', alertMessage.Message);

            const emailDetails: EmailDetails = {
                EmailTo : alertMessage.Email,
                Subject : alertMessage.Title,
                Body    : body
            };

            await this._emailService.sendEmail(emailDetails, false);
            Logger.instance().log(`Successfully sent body bmi email alert to ${alertMessage.Email}`);

        } catch (error) {
            Logger.instance().log(`Error sending body bmi email alert: ${error}`);
        }
    }

}
