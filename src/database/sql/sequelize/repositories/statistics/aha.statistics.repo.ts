import { Op } from 'sequelize';
import { IAhaStatisticsRepo } from '../../../../../database/repository.interfaces/statistics/aha.statistics.repo.interface';
import { Logger } from '../../../../../common/logger';
import { CareplanHealthSystem } from '../../../../../domain.types/statistics/aha/aha.type';
import User from '../../models/users/user/user.model';
import Person from '../../models/person/person.model';
import Patient from '../../models/users/patient/patient.model';
import Doctor from '../../models/users/doctor.model';
import UserDeviceDetails from '../../models/users/user/user.device.details.model';
import CareplanEnrollment from '../../models/clinical/careplan/enrollment.model';
import HealthSystem from '../../models/hospitals/health.system.model';
import Tenant from '../../models/tenant/tenant.model';

////////////////////////////////////////////////////////////////////////////////////////////

export class AhaStatisticsRepo implements IAhaStatisticsRepo {

    getAhaTenant = async (): Promise<string> => {
        try {
            const tenant = await Tenant.findOne({ where: { Code: 'default' }, paranoid: false });
            return tenant ? tenant.id : null;
        } catch (error) {
            Logger.instance().log(`Unable to get AHA tenant id: ${error.message}`);
            return null;
        }
    };

    getTotalPatients = async (): Promise<number> => {
        return await Patient.count({
            include  : [{ model: User, required: true, attributes: [], where: { IsTestUser: false }, paranoid: false }],
            paranoid : false,
        });
    };

    getTotalActivePatients = async (): Promise<number> => {
        return await Patient.count({
            distinct : true,
            col      : 'UserId',
            include  : [{
                model      : User,
                required   : true,
                attributes : [],
                where      : { IsTestUser: false, DeletedAt: { [Op.is]: null } },
                paranoid   : false,
            }],
            paranoid : false,
        });
    };

    getTotalDeletedPatients = async (): Promise<number> => {
        return await Patient.count({
            distinct : true,
            col      : 'UserId',
            include  : [{
                model      : User,
                required   : true,
                attributes : [],
                where      : { IsTestUser: false, DeletedAt: { [Op.not]: null } },
                paranoid   : false,
            }],
            paranoid : false,
        });
    };

    getTotalUsersWithMissingDeviceDetail = async (): Promise<number> => {
        const deviceRows = await UserDeviceDetails.findAll({ attributes: ['UserId'], paranoid: false, raw: true });
        const deviceUserIds = [...new Set(deviceRows.map((d: any) => d.UserId).filter((id) => id != null))];
        const where: any = { IsTestUser: false };
        if (deviceUserIds.length > 0) {
            where.id = { [Op.notIn]: deviceUserIds };
        }
        return await User.count({ where, paranoid: false });
    };

    getTotalUniqueUsersInDeviceDetail = async (): Promise<number> => {
        return await UserDeviceDetails.count({
            distinct : true,
            col      : 'UserId',
            include  : [{ model: User, required: true, attributes: [], where: { IsTestUser: false }, paranoid: false }],
            paranoid : false,
        });
    };

    getTotalUsers = async (): Promise<number> => {
        return await User.count({ where: { IsTestUser: false }, paranoid: false });
    };

    getTotalDeletedUsers = async (): Promise<number> => {
        return await User.count({ where: { IsTestUser: false, DeletedAt: { [Op.not]: null } }, paranoid: false });
    };

    getTotalActiveUsers = async (): Promise<number> => {
        return await User.count({ where: { IsTestUser: false, DeletedAt: { [Op.is]: null } }, paranoid: false });
    };

    getTotalPersons = async (): Promise<number> => {
        return await Person.count({ paranoid: false });
    };

    getTotalActivePersons = async (): Promise<number> => {
        return await Person.count({ where: { DeletedAt: { [Op.is]: null } }, paranoid: false });
    };

    getTotalDeletedPersons = async (): Promise<number> => {
        return await Person.count({ where: { DeletedAt: { [Op.not]: null } }, paranoid: false });
    };

    getTotalDoctors = async (): Promise<number> => {
        return await Doctor.count({
            include  : [{ model: User, required: true, attributes: [], where: { IsTestUser: false }, paranoid: false }],
            paranoid : false,
        });
    };

    getTotalActiveDoctors = async (): Promise<number> => {
        return await Doctor.count({
            include : [{
                model      : User,
                required   : true,
                attributes : [],
                where      : { IsTestUser: false, DeletedAt: { [Op.is]: null } },
                paranoid   : false,
            }],
            paranoid : false,
        });
    };

    getTotalDeletedDoctors = async (): Promise<number> => {
        return await Doctor.count({
            include : [{
                model      : User,
                required   : true,
                attributes : [],
                where      : { IsTestUser: false, DeletedAt: { [Op.not]: null } },
                paranoid   : false,
            }],
            paranoid : false,
        });
    };

    getTotalEnrollments = async (careplanCode: string, tenantId: string): Promise<number> => {
        const userIds = await this.getUserIds({ IsTestUser: false, TenantId: tenantId });
        if (userIds.length === 0) {
            return 0;
        }
        return await CareplanEnrollment.count({
            where    : { PlanCode: careplanCode, PatientUserId: { [Op.in]: userIds } },
            paranoid : false,
        });
    };

    getTotalActiveEnrollments = async (careplanCode: string, tenantId: string): Promise<number> => {
        const userIds = await this.getPatientUserIdsByPersonDeletedState(tenantId, false);
        if (userIds.length === 0) {
            return 0;
        }
        return await CareplanEnrollment.count({
            distinct : true,
            col      : 'PatientUserId',
            where    : { PlanCode: careplanCode, PatientUserId: { [Op.in]: userIds } },
            paranoid : false,
        });
    };

    getTotalDeletedEnrollments = async (careplanCode: string, tenantId: string): Promise<number> => {
        const userIds = await this.getPatientUserIdsByPersonDeletedState(tenantId, true);
        if (userIds.length === 0) {
            return 0;
        }
        return await CareplanEnrollment.count({
            distinct : true,
            col      : 'PatientUserId',
            where    : { PlanCode: careplanCode, PatientUserId: { [Op.in]: userIds } },
            paranoid : false,
        });
    };

    getHealthSystemEnrollmentCount =
    async (careplanCode: string, healthSystem: string, tenantId: string): Promise<CareplanHealthSystem> => {
        const patientRows = await Patient.findAll({
            attributes : ['UserId'],
            where      : { HealthSystem: healthSystem },
            include    : [{
                model      : User,
                required   : true,
                attributes : [],
                where      : { IsTestUser: false, TenantId: tenantId },
                paranoid   : false,
            }],
            paranoid : false,
            raw      : true,
        });
        const userIds = [...new Set(patientRows.map((p: any) => p.UserId).filter((id) => id != null))];
        let enrollments = 0;
        if (userIds.length > 0) {
            enrollments = await CareplanEnrollment.count({
                distinct : true,
                col      : 'PatientUserId',
                where    : { PlanCode: careplanCode, PatientUserId: { [Op.in]: userIds } },
                paranoid : false,
            });
        }
        return {
            Careplan     : careplanCode,
            HealthSystem : healthSystem,
            Enrollments  : enrollments,
        };
    };

    getListOfCareplan = async (tenantId: string) => {
        const userIds = await this.getUserIds({ TenantId: tenantId });
        if (userIds.length === 0) {
            return [];
        }
        const rows = await CareplanEnrollment.findAll({
            attributes : ['PlanCode'],
            where      : { PatientUserId: { [Op.in]: userIds } },
            group      : ['PlanCode'],
            paranoid   : false,
            raw        : true,
        });
        return this.extractCareplanCode(rows);
    };

    getListOfHealthSystem = async () => {
        const rows = await HealthSystem.findAll({
            attributes : ['Name'],
            group      : ['Name'],
            paranoid   : false,
            raw        : true,
        });
        return this.extractHealthSystems(rows);
    };

    private getUserIds = async (where: any): Promise<string[]> => {
        const rows = await User.findAll({ attributes: ['id'], where, paranoid: false, raw: true });
        return rows.map((u: any) => u.id);
    };

    private getPatientUserIdsByPersonDeletedState =
    async (tenantId: string, personDeleted: boolean): Promise<string[]> => {
        const personWhere = personDeleted ? { DeletedAt: { [Op.not]: null } } : { DeletedAt: { [Op.is]: null } };
        const rows = await Patient.findAll({
            attributes : ['UserId'],
            include    : [{
                model      : User,
                required   : true,
                attributes : [],
                where      : { IsTestUser: false, TenantId: tenantId },
                paranoid   : false,
                include    : [{ model: Person, required: true, attributes: [], where: personWhere, paranoid: false }],
            }],
            paranoid : false,
            raw      : true,
        });
        return [...new Set(rows.map((p: any) => p.UserId).filter((id) => id != null))];
    };

    private extractHealthSystems = (data) => {
        const healthSystems = [];
        data.forEach((healthSystem) => {
            healthSystems.push(healthSystem.Name);
        });
        return healthSystems;
    };

    private extractCareplanCode = (data) => {
        const careplans = [];
        data.forEach((careplan) => {
            careplans.push(careplan.PlanCode);
        });
        return careplans;
    };

}
