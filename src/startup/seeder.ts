import { Roles } from "../data/domain.types/role.domain.types";
import { injectable, inject } from "tsyringe";
import { IRoleRepo } from "../data/repository.interfaces/role.repo.interface";
import { Logger } from "../common/logger";

//////////////////////////////////////////////////////////////////////////////

@injectable()
export class Seeder {

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {
    }

    public init = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                await this.seedDefaultRoles();
                resolve(true);
            } catch (error) {
                reject(error);
                Logger.instance().log(error.message);
            }
        });
    };

    private seedDefaultRoles = async () => {
        var existing = await this._roleRepo.search();
        if (existing.length > 0) {
            return;
        }
        this._roleRepo.create({
            RoleName: Roles.Patient,
            Description: 'Represents a patient.',
        });
        await this._roleRepo.create({
            RoleName: Roles.Doctor,
            Description: 'Represents a doctor/physician.',
        });
        await this._roleRepo.create({
            RoleName: Roles.LabUser,
            Description: 'Represents a pathology/radiology lab representative/technician/pathologist/radiologist.',
        });
        await this._roleRepo.create({
            RoleName: Roles.PharmacyUser,
            Description: 'Represents a pharmacy/pharmacist/pharmacy shop owner/drug dispenser.',
        });
        await this._roleRepo.create({
            RoleName: Roles.Nurse,
            Description: 'Represents an nurse and medical care taker.',
        });
        await this._roleRepo.create({
            RoleName: Roles.AmbulanceServiceUser,
            Description: 'Represents an ambulance service provider/driver/mobile emergency medic.',
        });
        await this._roleRepo.create({
            RoleName: Roles.PatientFamilyMember,
            Description: 'Represents a family member of the patient.',
        });
        await this._roleRepo.create({
            RoleName: Roles.PatientFriend,
            Description: 'Represents a friend of the patient.',
        });
        await this._roleRepo.create({
            RoleName: Roles.SocialHealthWorker,
            Description: 'Represents a health social worker/health support professional representing government/private health service.',
        });
        await this._roleRepo.create({
            RoleName: Roles.SystemAdmin,
            Description: 'Admin of the system having elevated privileges.',
        });
    }
}
