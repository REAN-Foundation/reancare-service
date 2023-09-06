import { inject, injectable } from "tsyringe";
import { HealthAppStatus, WearableDeviceDetailsDomainModel } from "../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.domain.model";
import { IWearableDeviceDetailsRepo } from "../../database/repository.interfaces/webhook/webhook.wearable.device.details.repo.interface";
import { WearableDeviceDetailsDto } from "../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.dto";
import { WearableDeviceDetailsSearchFilters } from "../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types";
import { WearableDeviceDetailsSearchResults } from "../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types";
import Terra from "terra-api";

@injectable()

export class WearableDeviceDetailsService {

    constructor(
        @inject('IWearableDeviceDetailsRepo') private _webhookWearableDeviceDetailsRepo: IWearableDeviceDetailsRepo
    ) {}

    create = async (wearableDeviceDetailsDomainModel: WearableDeviceDetailsDomainModel):
        Promise<WearableDeviceDetailsDto> => {
        return await this._webhookWearableDeviceDetailsRepo.create(wearableDeviceDetailsDomainModel);
    };

    getById = async (id: string): Promise<WearableDeviceDetailsDto> => {
        return await this._webhookWearableDeviceDetailsRepo.getById(id);
    };

    update = async (id: string, wearableDeviceDetailsDomainModel: WearableDeviceDetailsDomainModel):
        Promise<WearableDeviceDetailsDto> => {
        var dto = await this._webhookWearableDeviceDetailsRepo.update(id, wearableDeviceDetailsDomainModel);
        return dto;
    };

    search = async (filters: WearableDeviceDetailsSearchFilters): Promise<WearableDeviceDetailsSearchResults> => {
        return await this._webhookWearableDeviceDetailsRepo.search(filters);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._webhookWearableDeviceDetailsRepo.delete(id);
    };
    
    getAvailableDeviceList = async (patientUserId: string): Promise<HealthAppStatus[]> => {
        //const connectedDevices = await this._webhookWearableDeviceDetailsRepo.getAvailableDeviceList(patientUserId);

        const terra = new Terra(process.env.TERRA_DEV_ID, process.env.TERRA_API_KEY, process.env.TERRA_SIGNING_SECRET);
        const terraUsers = await terra.getUsers();
        const connectedDevices = terraUsers.users.filter( user => user.reference_id === patientUserId);
        const allTerraApps = ["BIOSTRAP","CARDIOMOOD","CONCEPT2","COROS","CRONOMETER","DEXCOM","EATTHISMUCH",
            "EIGHT","FATSECRET","FINALSURGE","FITBIT","FREESTYLELIBRE","GARMIN","GOOGLE","HAMMERHEAD",
            "HUAWEI","IFIT","INBODY","KOMOOT","LIVEROWING","LEZYNE","MOXY",
            "NUTRACHECK","OMRON","OMRONUS","OURA","PELOTON","POLAR","PUL","RENPHO","RIDEWITHGPS",
            "ROUVY","SUUNTO","TECHNOGYM","TEMPO","TRIDOT","TREDICT","TRAININGPEAKS","TRAINASONE","TRAINERROAD",
            "UNDERARMOUR","VIRTUAGYM","WAHOO","WEAROS","WHOOP","WITHINGS","XOSS","ZWIFT","XERT","BRYTONSPORT",
            "TODAYSPLAN","WGER","VELOHERO","CYCLINGANALYTICS","NOLIO","TRAINXHALE","KETOMOJOUS","KETOMOJOEU",
            "STRAVA","CLUE","HEALTHGAUGE","MACROSFIRST","SOMNOFY"];
        const healthAppStatuses = [];
        for (const device of allTerraApps) {
            const healthAppStatus : HealthAppStatus = {
                PatientUserId   : patientUserId,
                TerraUserId     : null,
                Provider        : device,
                Status          : "Disconnected",
                AuthenticatedAt : null
            };
            healthAppStatuses.push(healthAppStatus);
        }
        for (const healthAppStatus of healthAppStatuses) {
            for (const connectedDevice of connectedDevices) {
                if ( healthAppStatus.Provider === connectedDevice.provider) {
                    healthAppStatus.Status = "Connected";
                    healthAppStatus.TerraUserId = connectedDevice.user_id;
                    healthAppStatus.AuthenticatedAt = connectedDevice.last_webhook_update;
                }
            }
        }
        return healthAppStatuses;
    };

    getAllUsers = async (): Promise<WearableDeviceDetailsDto[]> => {
        return await this._webhookWearableDeviceDetailsRepo.getAllUsers();
    };

}
