import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { BloodPressureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { BotRequestDomainModel } from '../../../domain.types/miscellaneous/bot.request.types';
import { BotMessagingType } from '../../../domain.types/miscellaneous/bot.request.types';
import { NotificationChannel } from '../../../domain.types/general/notification/notification.types';
import { IBiometricAlertHandler } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { Helper } from '../../../common/helper';
import { BloodGlucoseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { AlertQueue } from './alert.queue';
import { Injector } from '../../../startup/injector';
import { IBotService } from '../../../modules/communication/bot.service/bot.service.interface';
import { BotService } from '../../../modules/communication/bot.service/bot.service';
import { AlertHelper } from './alert.helper';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertBotHandler implements IBiometricAlertHandler {
    
    private _botService: IBotService = Injector.Container.resolve(BotService);
    
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

            const phoneNumber = this.getRecipientPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                model.BiometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : model.BiometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : model.BiometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : model.BiometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending blood Glucose alert notification: ${error}`);
        }
    };

    private sendBloodPressureAlert = async (model: BloodPressureAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodPressureAlertMessage(model);

            const phoneNumber = this.getRecipientPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                model.BiometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : model.BiometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : model.BiometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : model.BiometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending blood pressure alert notification: ${error}`);
        }
    };

    private sendPulseAlert = async (model: PulseAlertModel) => {
        try {
            Logger.instance().log(`Sending pulse alert notification to bot handler: ${JSON.stringify(model)}`);
            const alertMessage = await AlertHelper.getPulseAlertMessage(model);
            const phoneNumber = this.getRecipientPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                model.BiometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : model.BiometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : model.BiometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : model.BiometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            Logger.instance().log(`Sending pulse alert notification to bot handler: ${JSON.stringify(botRequestModel)}`);
            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending pulse alert notification: ${error}`);
        }
    };

    private sendBodyTemperatureAlert = async (model: BodyTemperatureAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBodyTemperatureAlertMessage(model);

            const phoneNumber = this.getRecipientPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                model.BiometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : model.BiometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : model.BiometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : model.BiometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending body temperature alert notification: ${error}`);
        }
    };

    private sendBloodOxygenSaturationAlert = async (model: BloodOxygenAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBloodOxygenSaturationAlertMessage(model);
            const phoneNumber = this.getRecipientPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                model.BiometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : model.BiometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : model.BiometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : model.BiometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);

        } catch (error) {
            Logger.instance().log(`Error sending blood oxygen saturation alert notification: ${error}`);
        }
    };

    private sendBodyBmiAlert = async (model: BodyBmiAlertModel) => {
        try {
            const alertMessage = await AlertHelper.getBodyBmiAlertMessage(model);
        
            const phoneNumber = this.getRecipientPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                model.BiometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : model.BiometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : model.BiometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : model.BiometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);

        } catch (error) {
            Logger.instance().log(`Error sending body bmi alert notification: ${error}`);
        }
    };

    private sendMessage = async (channel: NotificationChannel, model: BotRequestDomainModel) => {
        switch (channel) {
            case NotificationChannel.WhatsappMeta:
                return await this._botService.sendWhatsappMessage(model);
            case NotificationChannel.Telegram:
                return await this._botService.sendTelegramMessage(model);
            default:
                Logger.instance().log(`Invalid channel: ${channel}`);
                return null;
        }
    };

    private getRecipientPhoneNumber = (phone: string, uniqueReferenceId: string, channel: NotificationChannel) => {
        switch (channel) {
            case NotificationChannel.WhatsappMeta:
                return phone ;
            case NotificationChannel.Telegram:
                return uniqueReferenceId;
            default:
                return null;
        }
    };

}
