import { Logger } from '../../../common/logger';
import { injectable } from 'tsyringe';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { BloodPressureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure';
import { BotRequestDomainModel } from '../../../domain.types/miscellaneous/bot.request.types';
import { BotMessagingType } from '../../../domain.types/miscellaneous/bot.request.types';
import { BiometricAlertSettings } from '../../../domain.types/clinical/biometrics/biometrics.types';
import { NotificationChannel } from '../../../domain.types/general/notification/notification.types';
import { IBiometricAlert } from '../../../database/repository.interfaces/clinical/biometrics/biometric.alert.interface';
import { Helper } from '../../../common/helper';
import { BloodGlucoseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose';
import { PulseAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/pulse';
import { BodyTemperatureAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature';
import { BloodOxygenAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation';
import { BodyBmiAlertCreateModel } from '../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi';
import { AlertHelper } from './alert.helper';
import { Injector } from '../../../startup/injector';
import { IBotService } from '../../../modules/communication/bot.service/bot.service.interface';
import { BotService } from '../../../modules/communication/bot.service/bot.service';

///////////////////////////////////////////////////////////////////////////////
@injectable()
export class BiometricAlertBotHandler implements IBiometricAlert {

    private _numAsyncTasks = 4;

    private _botService: IBotService = Injector.Container.resolve(BotService);

    private _bloodGlucoseAlertQueue = AlertHelper.createMessagingQueue <BloodGlucoseAlertCreateModel>(
        (model, metaData) => this.sendBloodGlucoseAlert(model, metaData),
        this._numAsyncTasks
    );
    
    private _bloodPressureAlertQueue = AlertHelper.createMessagingQueue <BloodPressureAlertCreateModel>(
        (model, metaData) => this.sendBloodPressureAlert(model, metaData),
        this._numAsyncTasks
    );
    
    private _bodyTemperatureAlertQueue = AlertHelper.createMessagingQueue <BodyTemperatureAlertCreateModel>(
        (model, metaData) => this.sendBodyTemperatureAlert(model, metaData),
        this._numAsyncTasks
    );
    
    private _pulseAlertQueue = AlertHelper.createMessagingQueue <PulseAlertCreateModel>(
        (model, metaData) => this.sendPulseAlert(model, metaData),
        this._numAsyncTasks
    );
    
    private _bloodOxygenAlertQueue = AlertHelper.createMessagingQueue <BloodOxygenAlertCreateModel>(
        (model, metaData) => this.sendBloodOxygenSaturationAlert(model, metaData),
        this._numAsyncTasks
    );
    
    private _bodyBmiAlertQueue = AlertHelper.createMessagingQueue <BodyBmiAlertCreateModel>(
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

            const phoneNumber = this.getReceipantPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                biometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : biometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending blood Glucose alert notification: ${error}`);
        }
    }

    private  async sendBloodPressureAlert(model: BloodPressureAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBloodPressureAlertMessage(model);

            const phoneNumber = this.getReceipantPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                biometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : biometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending blood pressure alert notification: ${error}`);
        }
    }

    private async sendPulseAlert(
        model: PulseAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getPulseAlertMessage(model);
            const phoneNumber = this.getReceipantPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                biometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : biometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending pulse alert notification: ${error}`);
        }
    }

    private async sendBodyTemperatureAlert(model: BodyTemperatureAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {
            const alertMessage = await AlertHelper.getBodyTemperatureAlertMessage(model);

            const phoneNumber = this.getReceipantPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                biometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : biometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);
        } catch (error) {
            Logger.instance().log(`Error sending body temperature alert notification: ${error}`);
        }
    }

    private async sendBloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {

            const alertMessage = await AlertHelper.getBloodOxygenSaturationAlertMessage(model);
            const phoneNumber = this.getReceipantPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                biometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : biometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);

        } catch (error) {
            Logger.instance().log(`Error sending blood oxygen saturation alert notification: ${error}`);
        }
    }

    private async sendBodyBmiAlert (model: BodyBmiAlertCreateModel,
        biometricAlertSettings: BiometricAlertSettings | null = null) {
        try {

            const alertMessage = await AlertHelper.getBodyBmiAlertMessage(model);
        
            const phoneNumber = this.getReceipantPhoneNumber(
                alertMessage.Phone,
                alertMessage.UniqueReferenceId,
                biometricAlertSettings?.Channel
            );

            if (!phoneNumber) {
                ErrorHandler.throwNotFoundError('User phone number or unique reference id not found');
            }
           
            const normalizedPhoneNumber = Helper.normalizePhoneNumber(phoneNumber);
           
            const botRequestModel: BotRequestDomainModel = {
                PhoneNumber : normalizedPhoneNumber,
                ClientName  : biometricAlertSettings?.ClientName ?? alertMessage.TenantCode,
                Channel     : biometricAlertSettings?.Channel ?? NotificationChannel.WhatsappMeta,
                AgentName   : "Reancare",
                Type        : biometricAlertSettings?.Type ?? BotMessagingType.Text,
                Message     : alertMessage.Message,
                Payload     : {}
            };

            await this.sendMessage(botRequestModel.Channel, botRequestModel);

        } catch (error) {
            Logger.instance().log(`Error sending body bmi alert notification: ${error}`);
        }
    }

    private async sendMessage(channel: NotificationChannel, model: BotRequestDomainModel) {
        switch (channel) {
            case NotificationChannel.WhatsappMeta:
                return await this._botService.sendWhatsappMessage(model);
            case NotificationChannel.Telegram:
                return await this._botService.sendTelegramMessage(model);
            default:
                Logger.instance().log(`Invalid channel: ${channel}`);
                return null;
        }
    }

    private getReceipantPhoneNumber(phone: string, uniqueReferenceId: string, channel: NotificationChannel) {
        switch (channel) {
            case NotificationChannel.WhatsappMeta:
                return phone ;
            case NotificationChannel.Telegram:
                return uniqueReferenceId;
            default:
                return null;
        }
    }

}
