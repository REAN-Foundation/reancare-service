import { inject, injectable } from "tsyringe";
import { CareplanHandler } from '../../../modules/careplan/careplan.handler';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { ILabRecordRepo } from "../../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { LabRecordDomainModel } from "../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model";
import { LabRecordDto } from "../../../domain.types/clinical/lab.record/lab.record/lab.record.dto";
import { LabRecordTypeDomainModel } from "../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.domain.model";
import { LabRecordTypeDto } from "../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.dto";
import { LabRecordSearchFilters } from "../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types";
import { LabRecordSearchResults } from "../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types";
import { LabRecordTypeSearchFilters, LabRecordTypeSearchResults }
    from "../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.search.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class LabRecordService {

    _handler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('ILabRecordRepo') private _labRecordRepo: ILabRecordRepo,

    ) {}

    create = async (model: LabRecordDomainModel): Promise<LabRecordDto> => {
        const labRecord = await this._labRecordRepo.getTypeByDisplayName(model.DisplayName);
        model.TypeId = labRecord.id;

        return await this._labRecordRepo.create(model);
    };

    createType = async (domainModel: LabRecordTypeDomainModel): Promise<LabRecordTypeDto> => {
        return await this._labRecordRepo.createType(domainModel);
    };

    searchType = async (filters: LabRecordTypeSearchFilters): Promise<LabRecordTypeSearchResults> => {
        return await this._labRecordRepo.searchType(filters);
    };

    getTypeByDisplayName = async (displayName: string): Promise<LabRecordTypeDto> => {
        return await this._labRecordRepo.getTypeByDisplayName(displayName);
    };

    getById = async (id: uuid): Promise<LabRecordDto> => {
        return await this._labRecordRepo.getById(id);
    };

    search = async (filters: LabRecordSearchFilters): Promise<LabRecordSearchResults> => {
        return await this._labRecordRepo.search(filters);
    };

    update = async (id: uuid, healthPriorityDomainModel: LabRecordDomainModel): Promise<LabRecordDto> => {
        var dto = await this._labRecordRepo.update(id, healthPriorityDomainModel);
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._labRecordRepo.delete(id);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: LabRecordDomainModel, appName?: string) => {
        if (model) {
            EHRAnalyticsHandler.addIntegerRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.LabRecord, model.PrimaryValue, model.Unit, model.DisplayName, model.DisplayName, appName, 
                model.RecordedAt ? model.RecordedAt : null
                );
        }
    };

}
