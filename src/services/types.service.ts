import { OrganizationTypes } from "../domain.types/organization.domain.types";
import { inject, injectable } from "tsyringe";

import { IRoleRepo } from "../database/repository.interfaces/role.repo.interface";
import { RoleDto } from "../domain.types/role.domain.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TypesService {

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
    ) {}

    getPersonRoleTypes = async (): Promise<RoleDto[]> => {
        return await this._roleRepo.search();
    };

    getOrganizationTypes = async (): Promise<string[]> => {
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve([
                OrganizationTypes.Clinic,
                OrganizationTypes.Hospital,
                OrganizationTypes.DiagnosticLab,
                OrganizationTypes.Pharmacy,
                OrganizationTypes.AmbulanceService,
                OrganizationTypes.GovernmentPrimaryHealthCareCentre,
                OrganizationTypes.GovernmentNodalHospital,
                OrganizationTypes.GovernmentDistrictHospital,
                OrganizationTypes.MunicipalHospital,
                OrganizationTypes.MunicipalHospital,
                OrganizationTypes.BloodBank,
                OrganizationTypes.NursingHome,
                OrganizationTypes.SpecializedCareCentre,
                OrganizationTypes.AmbulatoryProcedureCentre,
                OrganizationTypes.Unknown,
            ]);
        });
    };

    getGenderTypes = async (): Promise<string[]> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve([
                'Male',
                'Female',
                'Other',
                'Unknown'
            ]);
        });
    };

}
