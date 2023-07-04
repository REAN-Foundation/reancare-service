import { LabRecordTypeSearchResults, LabRecordTypeSearchFilters }
    from "../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.search.types";
import { LabRecordTypeDomainModel } from "../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.domain.model";
import { LabRecordTypeDto } from "../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.dto";
import { LabRecordDomainModel } from "../../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model";
import { LabRecordDto } from "../../../../domain.types/clinical/lab.record/lab.record/lab.record.dto";
import { LabRecordSearchResults } from "../../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types";
import { LabRecordSearchFilters } from "../../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types";

export interface ILabRecordRepo {

    create(labRecordDomainModel: LabRecordDomainModel): Promise<LabRecordDto>;

    getById(id: string): Promise<LabRecordDto>;

    search(filters: LabRecordSearchFilters): Promise<LabRecordSearchResults>;

    searchType(filters: LabRecordTypeSearchFilters): Promise<LabRecordTypeSearchResults>;

    update(id: string, labRecordDomainModel: LabRecordDomainModel): Promise<LabRecordDto>;

    delete(id: string): Promise<boolean>;

    getLabRecordTypes(displayName?: string): Promise<LabRecordTypeDto[]>;

    totalTypesCount(): Promise<number>;

    createType(labRecordTypeDomainModel: LabRecordTypeDomainModel): Promise<LabRecordTypeDto>;

    getTypeByDisplayName(displayName: string): Promise<any>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

    getRecords(patientUserId: string, numMonths: number): Promise<any>;

    getRecent(patientUserId: string, displayName: string): Promise<LabRecordDto>;
    
    getLabRecordTypeById(id: string): Promise<LabRecordTypeDto>;

    updateLabRecordType(id: string, labRecordTypeDomainModel: LabRecordTypeDomainModel): Promise<LabRecordTypeDto>;

    deleteLabRecordType(id: string): Promise<boolean>;

}
