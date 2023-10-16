import { WearableDeviceDetailsSearchFilters } from "../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types";
import { WearableDeviceDetailsDomainModel } from "../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.domain.model";
import { WearableDeviceDetailsDto } from "../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.dto";
import { WearableDeviceDetailsSearchResults } from "../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types";

export interface IWearableDeviceDetailsRepo {

    create(entity: WearableDeviceDetailsDomainModel): Promise<WearableDeviceDetailsDto>;

    getById(id: string): Promise<WearableDeviceDetailsDto>;

    search(filters: WearableDeviceDetailsSearchFilters): Promise<WearableDeviceDetailsSearchResults>;

    update(id: string, bloodGlucoseDomainModel: WearableDeviceDetailsDomainModel): Promise<WearableDeviceDetailsDto>;

    delete(id: string): Promise<boolean>;

    getAvailableDeviceList(patientUserId: string): Promise<WearableDeviceDetailsDto[]>;

    getWearableDeviceDetails(oldTerraUserId: string, provider : string ): Promise<WearableDeviceDetailsDto>;

    getAllUsers(): Promise<WearableDeviceDetailsDto[]>;

    getByPatientUserId(patientUserId: string): Promise<WearableDeviceDetailsDto>;
    
}
