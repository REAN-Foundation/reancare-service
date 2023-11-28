import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodPressureRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { BloodPressureDto } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BloodPressureSearchFilters, BloodPressureSearchResults } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.search.types';
import { BloodPressureStore } from "../../../modules/ehr/services/blood.pressure.store";
import { Loader } from "../../../startup/loader";
import { ConfigurationManager } from "../../../config/configuration.manager";
import * as MessageTemplates from '../../../modules/communication/message.template/message.templates.json';
import { Logger } from "../../../common/logger";
import { IUserDeviceDetailsRepo } from "../../../database/repository.interfaces/users/user/user.device.details.repo.interface ";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodPressureService {

    _ehrBloodPressureStore: BloodPressureStore = null;

    constructor(
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBloodPressureStore = Loader.container.resolve(BloodPressureStore);
        }
    }

    create = async (bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {

        if (this._ehrBloodPressureStore) {
            const ehrId = await this._ehrBloodPressureStore.add(bloodPressureDomainModel);
            bloodPressureDomainModel.EhrId = ehrId;
        }

        var dto = await this._bloodPressureRepo.create(bloodPressureDomainModel);
        return dto;
    };

    getById = async (id: uuid): Promise<BloodPressureDto> => {
        return await this._bloodPressureRepo.getById(id);
    };

    search = async (filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults> => {
        return await this._bloodPressureRepo.search(filters);
    };

    update = async (id: uuid, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        var dto = await this._bloodPressureRepo.update(id, bloodPressureDomainModel);
        if (this._ehrBloodPressureStore) {
            await this._ehrBloodPressureStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodPressureRepo.delete(id);
    };

    sendBPNotification = async (patientUserId: uuid, model: BloodPressureDomainModel) => {
        var user = await this._userRepo.getById(patientUserId);
        var person = await this._personRepo.getById(user.PersonId);

        var deviceList = await this._userDeviceDetailsRepo.getByUserId(patientUserId);
        var deviceListsStr = JSON.stringify(deviceList, null, 2);
        Logger.instance().log(`Sent blood pressure notifications to following devices - ${deviceListsStr}`);

        var title = MessageTemplates['BPNotification'].Title;
        title = title.replace("{{PatientName}}", person.FirstName ?? "there");
        var body = MessageTemplates['BPNotification'].Body;
        body = body.replace("{{Systolic}}", model.Systolic.toString());
        body = body.replace("{{Diastolic}}",model.Diastolic.toString());

        Logger.instance().log(`Notification Title: ${title}`);
        Logger.instance().log(`Notification Body: ${body}`);

        var message = Loader.notificationService.formatNotificationMessage(
            MessageTemplates.BPNotification.NotificationType, title, body
        );
        for await (var device of deviceList) {
            await Loader.notificationService.sendNotificationToDevice(device.Token, message);
        }
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._bloodPressureRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._bloodPressureRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: BloodPressureDomainModel, appName?: string) => {

        if (model.Systolic) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.BloodPressure,
                model.Systolic,
                model.Unit,
                'Systolic Blood Pressure',
                'Blood Pressure',
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
        if (model.Diastolic) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.BloodPressure,
                model.Diastolic,
                model.Unit,
                'Distolic Blood Pressure',
                'Blood Pressure',
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

}
