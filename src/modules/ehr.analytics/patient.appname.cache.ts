import { Injector } from "../../startup/injector";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { UserService } from "../../services/users/user/user.service";
import { UserDeviceDetailsService } from "../../services/users/user/user.device.details.service";

///////////////////////////////////////////////////////////////////////////////////////

const eligibleToAddInEhrRecords = (userAppRegistrations) => {

    const eligibleToAddInEhrRecords =
    userAppRegistrations.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
    userAppRegistrations.indexOf('REAN HealthGuru') >= 0 ||
    userAppRegistrations.indexOf('HF Helper') >= 0;

    return eligibleToAddInEhrRecords;
};

const getEligibleAppNames = async (patientUserId: uuid) => {
    const userService = Injector.Container.resolve(UserService);
    const userDetails = await userService.getById(patientUserId);
    var appNames = [];
    if (!userDetails || userDetails?.IsTestUser) {
        return appNames;
    }
    const userDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);
    var userDevices = await userDeviceDetailsService.getByUserId(patientUserId);
    if (userDevices.length > 0) {
        userDevices.forEach(userDevice => {
            var deviceEligibility = eligibleToAddInEhrRecords(userDevice.AppName);
            if (deviceEligibility) {
                appNames.push(userDevice.AppName);
            }
        });
    }
    // app is not invalidating old devices, hence considering only unique devices
    var uniqueAppNames = appNames.filter((item, i, ar) => ar.indexOf(item) === i);
    return uniqueAppNames;
};

///////////////////////////////////////////////////////////////////////////////////////

export class PatientAppNameCache {

    private static cache: Map<uuid, string[]> = new Map();

    public static add(patientId: string, appNames: string[]): void {
        PatientAppNameCache.cache.set(patientId, appNames);
    }

    public static getEligibility = async (patientUserId: uuid) => {
        const userService = Injector.Container.resolve(UserService);
        const userDetails = await userService.getById(patientUserId);
        
        if (userDetails && userDetails.IsTestUser == false) {
            return true;
        }
        return false;
    };

    static update(patientId: string, appNames: string[]): void {
        PatientAppNameCache.cache.set(patientId, appNames);
    }

    static async get(patientId: string): Promise<string[] | undefined> {
        const list = PatientAppNameCache.cache.get(patientId);
        if (!list || list.length === 0) {
            const appNames = await getEligibleAppNames(patientId);
            PatientAppNameCache.cache.set(patientId, appNames);
        }
        return PatientAppNameCache.cache.get(patientId);
    }

    static remove(patientId: string): boolean {
        return PatientAppNameCache.cache.delete(patientId);
    }

    static clear(): void {
        PatientAppNameCache.cache.clear();
    }

}

