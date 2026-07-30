import { Op } from 'sequelize';
import { CountryCurrencyPhone } from 'country-currency-phone';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { IStatisticsRepo } from '../../../../repository.interfaces/statistics/statistics.repo.interface';
import Person from '../../models/person/person.model';
import { Helper } from '../../../../../common/helper';
import { AppDownloadDomainModel } from '../../../../../domain.types/statistics/app.download.domain.model';
import { AppDownloadDto } from '../../../../../domain.types/statistics/app.download.dto';
import AppDownloadsModel from '../../models/statistics/app.downloads.model';
import { AppDownloadMapper } from '../../mappers/statistics/app.download.mapper';
import BodyHeight from '../../models/clinical/biometrics/body.height.model';
import BodyWeight from '../../models/clinical/biometrics/body.weight.model';
import PhysicalActivity from '../../models/wellness/exercise/physical.activity.model';
import Medication from '../../models/clinical/medication/medication.model';
import Meditation from '../../models/wellness/exercise/meditation.model';
import Symptom from '../../models/clinical/symptom/symptom.model';
import FoodConsumption from '../../models/wellness/nutrition/food.consumption.model';
import WaterConsumption from '../../models/wellness/nutrition/water.consumption.model';
import BloodCholesterol from '../../models/clinical/biometrics/blood.cholesterol.model';
import BloodGlucose from '../../models/clinical/biometrics/blood.glucose.model';
import BloodOxygenSaturation from '../../models/clinical/biometrics/blood.oxygen.saturation.model';
import BloodPressure from '../../models/clinical/biometrics/blood.pressure.model';
import BodyTemperature from '../../models/clinical/biometrics/body.temperature.model';
import Pulse from '../../models/clinical/biometrics/pulse.model';
import { TimeHelper } from '../../../../../common/time.helper';
import User from '../../models/users/user/user.model';
import Role from '../../models/role/role.model';
import HealthProfile from '../../models/users/patient/health.profile.model';
import UserDeviceDetails from '../../models/users/user/user.device.details.model';
import UserLoginSession from '../../models/users/user/user.login.session.model';
import CareplanEnrollment from '../../models/clinical/careplan/enrollment.model';
import { DurationType } from '../../../../../domain.types/miscellaneous/time.types';
import { StatisticSearchFilters } from '../../../../../domain.types/statistics/statistics.search.type';
import { queryAppDownloadCount } from './query/system.sql';
import { GenderDetails } from '../../../../../domain.types/person/person.types';
import { MajorAilmentDetails, MaritalStatusDetails } from '../../../../../domain.types/users/patient/health.profile/health.profile.types';
import { DatabaseSchemaType } from '../../../../../common/database.utils/database.config';
import { queryTotalActiveTenantDoctors, queryTotalActiveTenantPersons, queryTotalActiveTenantUsers, queryTotalDeletedTenantDoctors, queryTotalDeletedTenantPersons, queryTotalDeletedTenantUsers, queryTotalTenantDoctors, queryTotalTenantPersons, queryTotalTenantUsers } from './query/tenant.user.sql';
import { DatabaseClient } from '../../../../../common/database.utils/dialect.clients/database.client';

//////////////////////////////////////////////////////////////////////////////////////////////

export class StatisticsRepo implements IStatisticsRepo {

    public dbConnector: DatabaseClient = null;

    constructor() {
        this.dbConnector = new DatabaseClient();
    }

    createConnection = async (schemaType: DatabaseSchemaType) => {
        await this.dbConnector._client.connect(schemaType);
    };

    private buildUserWhere = (filter: any): any => {
        const where: any = { IsTestUser: false };
        if (filter && filter.TenantId) {
            where.TenantId = filter.TenantId;
        }
        return where;
    };

    private userInclude = (filter: any): any => ({
        model      : User,
        required   : true,
        attributes : [],
        where      : this.buildUserWhere(filter),
        paranoid   : false,
    });

    private groupByYearAndField = (rows: any[], field: string): any[] => {
        const counts = new Map<string, any>();
        for (const r of rows) {
            const year = getUtcYear(r.CreatedAt);
            const key = `${year}|${r[field]}`;
            const existing = counts.get(key);
            if (existing) {
                existing.totalCount++;
            } else {
                counts.set(key, { year, [field]: r[field], totalCount: 1 });
            }
        }
        return [...counts.values()];
    };

    private healthProfileCount = async (filter: any, profileWhere: any): Promise<number> => {
        return await HealthProfile.count({
            where    : profileWhere,
            include  : [this.userInclude(filter)],
            paranoid : false,
        });
    };

    private yearWiseHealthProfileCount = async (filter: any, profileWhere: any): Promise<any[]> => {
        const rows = await HealthProfile.findAll({
            attributes : ['CreatedAt'],
            where      : profileWhere,
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<number, number>();
        for (const r of rows as any[]) {
            const y = getUtcYear(r.CreatedAt);
            counts.set(y, (counts.get(y) ?? 0) + 1);
        }
        return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }));
    };

    getUsersCount = async (filters: StatisticSearchFilters): Promise<any> => {
        try {
            const totalUsers = await this.getOnboardedUsers(filters);
            const notDeletedUsers = await this.getNotDeletedUsers(filters);
            const usersWithActiveSession = await this.getUsersWithActiveSession(filters);
            const deletedUsers = await this.getDeletedUsers(filters);
            const enrolledUsers = await this.getEnrolledUsers(filters);

            return this.aggregateUserStats(
                totalUsers,
                notDeletedUsers,
                usersWithActiveSession,
                deletedUsers,
                enrolledUsers);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByRole = async (filters): Promise<any> => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const maxCreatedDate = getMaxDate(filters);
            const search: any = { where: {}, include: [],  paranoid: false };

            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {},
                paranoid : false
            };

            includesObj.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            if (filters.Year != null)  {
                includesObj.where['CreatedAt'] = {
                    [Op.between] : [minDate, maxDate],
                };
            }

            if (filters.Year != null && filters.Month != null)  {
                includesObj.where['CreatedAt'] = {
                    [Op.lt] : maxCreatedDate,
                };
            }

            search.include.push(includesObj);

            const allUsers = await User.findAndCountAll(search);

            const allRoles = await Role.findAndCountAll();

            const userRoles = [];

            for (const u of allUsers.rows) {
                const userRole = u.RoleId;
                userRoles.push(userRole);
            }

            const userRoleDetails = [];

            for (const r of allRoles.rows) {
                const roles = userRoles.filter(x => x === r.id);
                const ratio = ((roles.length) / (allUsers.count) * 100).toFixed(2);
                const userRoleDetail = {
                    Role  : r.RoleName,
                    Count : roles.length,
                    Ratio : ratio,
                };
                userRoleDetails.push(userRoleDetail);
            }

            return userRoleDetails;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByGender = async (filter): Promise<any> => {
        const rows = await Person.findAll({
            attributes : ['Gender'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<any, number>();
        for (const r of rows as any[]) {
            counts.set(r.Gender, (counts.get(r.Gender) ?? 0) + 1);
        }
        const genderWiseUsers = [...counts.entries()].map(([Gender, totalCount]) => ({ Gender, totalCount }));
        return this.aggregateUserByGender(genderWiseUsers);
    };

    public getYearWiseAgeDetails = async (filter) => {
        const years = await this.getAllYears();
        const rows = await Person.findAll({
            attributes : ['BirthDate', 'CreatedAt'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const result = [];
        for (const y of years as any[]) {
            const yearRows = (rows as any[]).filter((r) => getUtcYear(r.CreatedAt) === Number(y.year));
            const userByAge = yearRows.map((r) => ({ age: r.BirthDate ? computeAge(r.BirthDate) : null }));
            const ageDetails = this.aggregateUserByAge(userByAge);
            result.push({
                Year       : y.year,
                AgeDetails : ageDetails
            });
        }
        return result;
    };

    getUsersByAge = async (filter): Promise<any> => {
        const rows = await Person.findAll({
            attributes : ['BirthDate'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const userByAge = (rows as any[]).map((r) => ({ age: r.BirthDate ? computeAge(r.BirthDate) : null }));
        return this.aggregateUserByAge(userByAge);
    };

    getUsersByMaritalStatus = async (filter): Promise<any> => {
        const rows = await HealthProfile.findAll({
            attributes : ['MaritalStatus'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<any, number>();
        for (const r of rows as any[]) {
            counts.set(r.MaritalStatus, (counts.get(r.MaritalStatus) ?? 0) + 1);
        }
        return [...counts.entries()].map(([MaritalStatus, Count]) => ({ MaritalStatus, Count }));
    };

    getUsersByDeviceDetail = async (filter): Promise<any> => {
        const rows = await UserDeviceDetails.findAll({
            attributes : ['OSType'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<any, number>();
        for (const r of rows as any[]) {
            counts.set(r.OSType, (counts.get(r.OSType) ?? 0) + 1);
        }
        return [...counts.entries()].map(([OSType, Count]) => ({ OSType, Count }));
    };

    updateAppDownloadCount = async (createModel: AppDownloadDomainModel):
        Promise<AppDownloadDto> => {
        try {
            const entity = {
                AppName          : createModel.AppName,
                TotalDownloads   : createModel.TotalDownloads,
                IOSDownloads     : createModel.IOSDownloads,
                AndroidDownloads : createModel.AndroidDownloads,
            };

            const download = await AppDownloadsModel.create(entity);
            return await AppDownloadMapper.toDto(download);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAppDownlodCount = async (): Promise<any> => {
        let totalAppDownload = null;
        const query =  queryAppDownloadCount;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalAppDownload_: any = rows;
        if (totalAppDownload_.length === 1) {
            totalAppDownload = totalAppDownload_[0].totalAppDownload;
        }
        return {
            Count : totalAppDownload
        };
    };

    getUsersByCountry = async (filters): Promise<any> => {
        try {
            const totalUsers = await this.getTotalUsers(filters);

            const usersCountryCodes = [];
            for (const u of totalUsers.rows) {
                var phone = u.User.Person.Phone;
                const countryCode = phone.split("-")[0];
                usersCountryCodes.push(countryCode);
            }

            const countryCurrencyPhone = new CountryCurrencyPhone();

            const  usersCountries = [];
            for (const c of usersCountryCodes) {
                const countryArray =  countryCurrencyPhone.getByPhoneCode(c);
                let country  = undefined;
                for (const a of countryArray){
                    country = a.country.names[0];
                }
                usersCountries.push(country);
            }

            var uniqueContries = Array.from(new Set(usersCountries));

            const countryWiseUsers = [];

            for (const c of uniqueContries) {
                const countryUsers = usersCountries.filter(x => x === c);
                const ratio = ((countryUsers.length) / (totalUsers.count) * 100).toFixed(2);
                const countryUsersDetail = {
                    Country : c,
                    Count   : countryUsers.length,
                    Ratio   : ratio,
                };
                countryWiseUsers.push(countryUsersDetail);
            }

            return countryWiseUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByMajorAilment = async (filter): Promise<any> => {
        const rows = await HealthProfile.findAll({
            attributes : ['MajorAilment'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<any, number>();
        for (const r of rows as any[]) {
            counts.set(r.MajorAilment, (counts.get(r.MajorAilment) ?? 0) + 1);
        }
        return [...counts.entries()].map(([MajorAilment, Count]) => ({ MajorAilment, Count }));
    };

    getUsersByObesity = async (filters): Promise<any> => {
        try {
            const search: any = {
                where    : {},
                include  : [],
                paranoid : false,
            };

            const includeObj =
            {
                model    : User,
                required : true,
                where    : {},
                include  : [{
                    model    : Person,
                    required : true,
                    where    : {
                        Phone : {
                            [Op.notBetween] : [1000000000, 1000000100]
                        }
                    },
                }]
            };

            search.include.push(includeObj);

            if (filters.PastMonths != null) {

                const majorAilmentUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const weightDetails = await BodyWeight.findAndCountAll(search);

                    const heightDetails = await BodyHeight.findAndCountAll(search);

                    const heightWeightArray = [];
                    for (const x of heightDetails.rows) {
                        for (const y of weightDetails.rows) {
                            if (x.PatientUserId === y.PatientUserId) {
                                heightWeightArray.push({
                                    bodyHeight  : x.BodyHeight ?? null,
                                    heightUnits : x.Unit ?? null,
                                    bodyWeight  : y.BodyWeight ?? null,
                                    weightUnits : y.Unit ?? null,
                                });
                            }
                        }
                    }

                    const usresBmi = [];
                    for (const u of heightWeightArray) {
                        if (u.bodyHeight !== null && u.bodyWeight !== null){
                            const bmi = Helper.calculateBMI(u.bodyHeight, u.heightUnits, u.bodyWeight, u.weightUnits);
                            usresBmi.push((bmi.bmi).toFixed(2));
                        }
                    }

                    const underWeight = usresBmi.filter(x => x < 18.5);
                    const healthy  = usresBmi.filter(x => x >= 18.5 && x <= 24.9);
                    const overWeight  = usresBmi.filter(x => x >= 25 && x <= 29.9);
                    const obese  = usresBmi.filter(x => x >= 30);

                    const underWeightUsers = {
                        Status : "Under Weight",
                        Count  : underWeight.length
                    };

                    const healthyUsers = {
                        Status : "Healthy",
                        Count  : healthy.length
                    };

                    const overWeightUsers = {
                        Status : "Over Weight",
                        Count  : overWeight.length
                    };

                    const obeseUsers = {
                        Status : "Obese",
                        Count  : obese.length
                    };

                    const obesityUsers = [underWeightUsers, healthyUsers, overWeightUsers, obeseUsers];

                    var majorAilmentUsersForMonth = {
                        Month        : monthName,
                        ObesityUsers : obesityUsers

                    };
                    majorAilmentUsersForMonths.push(majorAilmentUsersForMonth);
                }
                return majorAilmentUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const weightDetails = await BodyWeight.findAndCountAll(search);

                const heightDetails = await BodyHeight.findAndCountAll(search);

                const heightWeightArray = [];
                for (const x of heightDetails.rows) {
                    for (const y of weightDetails.rows) {
                        if (x.PatientUserId === y.PatientUserId) {
                            heightWeightArray.push({
                                bodyHeight  : x.BodyHeight ?? null,
                                heightUnits : x.Unit ?? null,
                                bodyWeight  : y.BodyWeight ?? null,
                                weightUnits : y.Unit ?? null,
                            });
                        }
                    }
                }

                const usresBmi = [];
                for (const u of heightWeightArray) {
                    if (u.bodyHeight !== null && u.bodyWeight !== null){
                        const bmi = Helper.calculateBMI(u.bodyHeight, u.heightUnits, u.bodyWeight, u.weightUnits);
                        usresBmi.push((bmi.bmi).toFixed(2));
                    }
                }

                const underWeight = usresBmi.filter(x => x < 18.5);
                const healthy  = usresBmi.filter(x => x >= 18.5 && x <= 24.9);
                const overWeight  = usresBmi.filter(x => x >= 25 && x <= 29.9);
                const obese  = usresBmi.filter(x => x >= 30);

                const underWeightUsers = {
                    Status : "Under Weight",
                    Count  : underWeight.length
                };

                const healthyUsers = {
                    Status : "Healthy",
                    Count  : healthy.length
                };

                const overWeightUsers = {
                    Status : "Over Weight",
                    Count  : overWeight.length
                };

                const obeseUsers = {
                    Status : "Obese",
                    Count  : obese.length
                };

                const obesityUsers = [underWeightUsers, healthyUsers, overWeightUsers, obeseUsers];

                return obesityUsers;

            }

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByAddiction = async (filter): Promise<any> => {
        const tobaccoSmokers = await this.healthProfileCount(filter, { TobaccoQuestionAns: true });
        const heavyDrinkers = await this.healthProfileCount(filter, { IsDrinker: true, DrinkingSeverity: 'High' });
        const substanceAbuse = await this.healthProfileCount(filter, { SubstanceAbuse: true });
        const notAddicted = await this.healthProfileCount(filter,
            { SubstanceAbuse: false, IsDrinker: false, TobaccoQuestionAns: false });

        const totalUsers = tobaccoSmokers + heavyDrinkers + substanceAbuse + notAddicted;
        const tobaccoSmokerUsers = {
            Status : "Tobacco Smokers",
            Count  : tobaccoSmokers,
            Ratio  : totalUsers ? ((tobaccoSmokers / totalUsers) * 100).toFixed(2) : "0.00"
        };

        const heavyDrinkerUsers = {
            Status : "Heavy Drinker",
            Count  : heavyDrinkers,
            Ratio  : totalUsers ? ((heavyDrinkers / totalUsers) * 100).toFixed(2) : "0.00"
        };

        const substanceAbuseUsers = {
            Status : "Substance Abuse",
            Count  : substanceAbuse,
            Ratio  : totalUsers ? ((substanceAbuse / totalUsers) * 100).toFixed(2) : "0.00"
        };

        const nonAddictedUsers = {
            Status : "Non Addicted",
            Count  : notAddicted,
            Ratio  : totalUsers ? ((notAddicted / totalUsers) * 100).toFixed(2) : "0.00"
        };

        const addictionDetails = [
            tobaccoSmokerUsers,
            heavyDrinkerUsers,
            substanceAbuseUsers,
            nonAddictedUsers
        ];

        return addictionDetails;
    };

    getUsersByHealthPillar = async (filters): Promise<any> => {
        try {
            const totalUsers = await this.getTotalUsers(filters);

            const physicalActivityUsers = await this.getPhysicalActivityUsers(totalUsers, filters);

            const meditationUsers = await this.getMeditationUsers(totalUsers, filters);

            const medicationUsers = await this.getMedicationUsers(totalUsers, filters);

            const symptomUsers = await this.getSymptomUsers(totalUsers, filters);

            const labRecordUsers = await this.getLabRecordUsers(totalUsers, filters);

            const nutritionUsers = await this.getNutritionUsers(totalUsers, filters);

            const vitalUsers = await this.getVitalUsers(totalUsers);

            let healthPillarDistribution: object | any[] = {};

            if (filters.Year === null) {
                healthPillarDistribution =
                [
                    physicalActivityUsers,
                    meditationUsers,
                    medicationUsers,
                    symptomUsers,
                    labRecordUsers,
                    nutritionUsers,
                    vitalUsers
                ];

            }
            else {
                healthPillarDistribution =
                {
                    PhysicalActivityUsers : physicalActivityUsers,
                    MeditationUsers       : meditationUsers,
                    MedicationUsers       : medicationUsers,
                    SymptomUsers          : symptomUsers,
                    LabRecordUsers        : labRecordUsers,
                    NutritionUsers        : nutritionUsers,
                };
            }

            return healthPillarDistribution;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersStats = async (filters): Promise<any> => {
        try {
            const totalPersons = await this.getTotalPersons(filters);

            const notDeletedPersons = await this.getTotalActivePersons(filters);

            const deletedPersons = await this.getTotalDeletedPersons(filters);

            const totalUsers = await this.getTotalUsers(filters);

            const notDeletedUsers = await this.getTotalActiveUsers(filters);

            const deletedUsers = await this.getTotalDeletedUsers(filters);

            const totalDoctors = await this.getTotalDoctors(filters);

            const notDeletedDoctors = await this.getTotalActiveDoctors(filters);

            const deletedDoctors = await this.getTotalDeletedDoctors(filters);

            const usersStats = {
                TotalPersons   : totalPersons,
                ActivePersons  : notDeletedPersons,
                DeletedPersons : deletedPersons,
                TotalUsers     : totalUsers,
                ActiveUsers    : notDeletedUsers,
                DeletedUsers   : deletedUsers,
                TotalDoctors   : totalDoctors,
                ActiveDoctors  : notDeletedDoctors,
                DeletedDoctors : deletedDoctors,
            };

            return usersStats;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByBiometrics = async (filters): Promise<any> => {
        try {
            const totalUsers = await this.getTotalUsers(filters);
            let biometricUsers : object | any[] = {};

            const cholesterolUsers = await this.getCholestrolUsers(totalUsers,filters);

            const glucoseUsers = await this.getGlucoseUsers(totalUsers, filters);

            const oxygenSaturationUsers = await this.getOxygenSaturationUsers(totalUsers, filters);

            const bloodPressureUsers = await this.getBloodPressureUsers(totalUsers, filters);

            const bodyHeightUsers = await this.getBodyHeightUsers(totalUsers, filters);

            const bodyWeightUsers = await this.getBodyWeightUsers(totalUsers, filters);

            const bodyTempratureUsers = await this.getBodyTempratureUsers(totalUsers, filters);

            const pulseUsers = await this.getPulseUsers(totalUsers, filters);

            if (filters.PastMonths != null) {
                biometricUsers = {
                    CholesterolUsers      : cholesterolUsers,
                    GlucoseUsers          : glucoseUsers,
                    OxygenSaturationUsers : oxygenSaturationUsers,
                    BloodPressureUsers    : bloodPressureUsers,
                    BodyHeightUsers       : bodyHeightUsers,
                    BodyWeightUsers       : bodyWeightUsers ,
                    BodyTempratureUsers   : bodyTempratureUsers,
                    PulseUsers            : pulseUsers,
                };
            }

            else {
                biometricUsers =
                [
                    cholesterolUsers,
                    glucoseUsers,
                    oxygenSaturationUsers,
                    bloodPressureUsers,
                    bodyHeightUsers,
                    bodyWeightUsers,
                    bodyTempratureUsers,
                    pulseUsers
                ];
            }

            return biometricUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllYears = async (): Promise<any> => {
        const rows = await Person.findAll({ attributes: ['CreatedAt'], paranoid: false, raw: true });
        const years = [...new Set((rows as any[]).map((r) => getUtcYear(r.CreatedAt)))].sort((a, b) => a - b);
        return years.map((year) => ({ year }));
    };

    getYearWiseUserCount = async (filter) => {
        const rows = await User.findAll({
            attributes : ['CreatedAt'],
            where      : this.buildUserWhere(filter),
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<number, number>();
        for (const r of rows as any[]) {
            const y = getUtcYear(r.CreatedAt);
            counts.set(y, (counts.get(y) ?? 0) + 1);
        }
        return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([year, totalUsers]) => ({ year, totalUsers }));
    };

    getYearWiseDeviceDetails = async (filter, yearWiseUserCount) => {
        const rows = await UserDeviceDetails.findAll({
            attributes : ['OSType', 'CreatedAt'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        const counts = new Map<string, { year: number; OSType: any; totalUsers: number }>();
        for (const r of rows as any[]) {
            const year = getUtcYear(r.CreatedAt);
            const key = `${year}|${r.OSType}`;
            const existing = counts.get(key);
            if (existing) {
                existing.totalUsers++;
            } else {
                counts.set(key, { year, OSType: r.OSType, totalUsers: 1 });
            }
        }
        return this.aggregateYearWiseDeviceDetails([...counts.values()], yearWiseUserCount);
    };

    getYearWiseGenderDetails = async (filter) => {
        const rows = await Person.findAll({
            attributes : ['Gender', 'CreatedAt'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        return this.aggregateYearWiseGenderDetails(this.groupByYearAndField(rows as any[], 'Gender'));
    };

    getYearWiseMaritalDetails = async (filter) => {
        const rows = await HealthProfile.findAll({
            attributes : ['MaritalStatus', 'CreatedAt'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        return this.aggregateYearWiseMaritalDetails(this.groupByYearAndField(rows as any[], 'MaritalStatus'));
    };

    getYearWiseMajorAilmentDistributionDetails = async (filter) => {
        const rows = await HealthProfile.findAll({
            attributes : ['MajorAilment', 'CreatedAt'],
            include    : [this.userInclude(filter)],
            paranoid   : false,
            raw        : true,
        });
        return this.aggregateYearWiseMajorAilmentDetails(this.groupByYearAndField(rows as any[], 'MajorAilment'));
    };

    getYearWiseAddictionDistributionDetails = async (filter, yearWiseUserCount) => {
        const tobacco = (await this.yearWiseHealthProfileCount(filter, { TobaccoQuestionAns: true }))
            .map((x) => ({ year: x.year, tobaccoUserCount: x.count }));
        const drinkers = (await this.yearWiseHealthProfileCount(filter, { IsDrinker: true, DrinkingSeverity: 'High' }))
            .map((x) => ({ year: x.year, drinkerUserCount: x.count }));
        const substance = (await this.yearWiseHealthProfileCount(filter, { SubstanceAbuse: true }))
            .map((x) => ({ year: x.year, substanceAbuseUserCount: x.count }));
        const notAddicted = (await this.yearWiseHealthProfileCount(filter,
            { SubstanceAbuse: false, IsDrinker: false, TobaccoQuestionAns: false }))
            .map((x) => ({ year: x.year, notAddedUserCount: x.count }));

        return this.aggregateYearWiseAddictionDetails(
            tobacco,
            drinkers,
            substance,
            notAddicted,
            yearWiseUserCount
        );
    };

    // #private region

    private getOnboardedUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        return await User.count({ where: this.buildUserWhere(filters), paranoid: false });
    };

    private getNotDeletedUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        return await User.count({
            where    : { ...this.buildUserWhere(filters), DeletedAt: { [Op.is]: null } },
            paranoid : false,
        });
    };

    private getDeletedUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        return await User.count({
            where    : { ...this.buildUserWhere(filters), DeletedAt: { [Op.not]: null } },
            paranoid : false,
        });
    };

    private getUsersWithActiveSession = async (filters: StatisticSearchFilters): Promise<any> => {
        return await UserLoginSession.count({
            distinct : true,
            col      : 'UserId',
            where    : { ValidTill: { [Op.gt]: new Date() } },
            include  : [this.userInclude(filters)],
            paranoid : false,
        });
    };

    private getEnrolledUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        const userIds = (await User.findAll({
            attributes : ['id'],
            where      : this.buildUserWhere(filters),
            paranoid   : false,
            raw        : true,
        })).map((u: any) => u.id);
        if (userIds.length === 0) {
            return 0;
        }
        return await CareplanEnrollment.count({
            where    : { PatientUserId: { [Op.in]: userIds } },
            paranoid : false,
        });
    };

    private getTotalUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        const query = Helper.replaceAll(queryTotalTenantUsers, "{{tenantId}}", filters.TenantId);
        let totalUsers = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalUsers_: any = rows;
        if (totalUsers_.length === 1) {
            totalUsers = totalUsers_[0].totalUsers;
        }
        return totalUsers;
    };

    private getTotalActiveUsers = async (filters): Promise<number> => {
        const query = Helper.replaceAll(queryTotalActiveTenantUsers, "{{tenantId}}", filters.TenantId);
        let totalActiveUsers = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActiveUsers_: any = rows;
        if (totalActiveUsers_.length === 1) {
            totalActiveUsers = totalActiveUsers_[0].totalActiveUsers;
        }
        return totalActiveUsers;
    };

    private getTotalDeletedUsers = async (filters): Promise<number> => {
        const query = Helper.replaceAll(queryTotalDeletedTenantUsers, "{{tenantId}}", filters.TenantId);
        let totalDeletedUsers = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedUsers_: any = rows;
        if (totalDeletedUsers_.length === 1) {
            totalDeletedUsers = totalDeletedUsers_[0].totalDeletedUsers;
        }
        return totalDeletedUsers;
    };

    private  getPhysicalActivityUsers = async (totalUsers, filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const physicalActivityDetails = [];
            var physicalActivityUsers = {};

            if (filters.Year != null)  {
                for (const u of totalUsers.rows) {
                    const physicalActivityDetail = await PhysicalActivity.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (physicalActivityDetail !== null){
                        physicalActivityDetails.push(physicalActivityDetail);
                    }
                }

                physicalActivityUsers = getMonthlyUsers(physicalActivityDetails, totalUsers);
            }
            else
            {
                for (const u of totalUsers.rows) {
                    const physicalActivityDetail = await PhysicalActivity.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (physicalActivityDetail !== null){
                        physicalActivityDetails.push(physicalActivityDetail);
                    }
                }

                const physicalActivityUsersRatio =
                ((physicalActivityDetails.length) / (totalUsers.count) * 100).toFixed(2);

                physicalActivityUsers = {
                    Status : "Physical Activity",
                    Count  : physicalActivityDetails.length,
                    Ratio  : physicalActivityUsersRatio
                };

            }

            return physicalActivityUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getMeditationUsers = async (totalUsers, filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const meditationDetails = [];
            let meditationUsers = {};

            if (filters.Year != null)  {
                for (const u of totalUsers.rows) {
                    const meditationDetail = await Meditation.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (meditationDetail !== null){
                        meditationDetails.push(meditationDetail);
                    }
                }
                meditationUsers = getMonthlyUsers(meditationDetails,totalUsers);
            }
            else {
                for (const u of totalUsers.rows) {
                    const meditationDetail = await Meditation.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (meditationDetail !== null){
                        meditationDetails.push(meditationDetail);
                    }
                }

                const meditationUsersRatio =
                ((meditationDetails.length) / (totalUsers.count) * 100).toFixed(2);

                meditationUsers = {
                    Status : "Meditation",
                    Count  : meditationDetails.length,
                    Ratio  : meditationUsersRatio
                };
            }

            return meditationUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getMedicationUsers = async (totalUsers, filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const medicationDetails = [];
            let medicationUsers = {};

            if (filters.Year != null)  {
                for (const u of totalUsers.rows) {
                    const medicationDetail = await Medication.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (medicationDetail !== null){
                        medicationDetails.push(medicationDetail);
                    }
                }
                medicationUsers = getMonthlyUsers(medicationDetails,totalUsers);
            }

            else {
                for (const u of totalUsers.rows) {
                    const medicationDetail = await Medication.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (medicationDetail !== null){
                        medicationDetails.push(medicationDetail);
                    }
                }

                const medicationUsersRatio =
                ((medicationDetails.length) / (totalUsers.count) * 100).toFixed(2);

                medicationUsers = {
                    Status : "Medication",
                    Count  : medicationDetails.length,
                    Ratio  : medicationUsersRatio
                };
            }

            return medicationUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getSymptomUsers = async (totalUsers, filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const symptomDetails = [];
            let symptomUsers = {};

            if (filters.Year != null)
            {
                for (const u of totalUsers.rows) {
                    const symptomDetail = await Symptom.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (symptomDetail !== null){
                        symptomDetails.push(symptomDetail);
                    }
                }

                symptomUsers = getMonthlyUsers(symptomDetails,totalUsers);

            }

            else {
                for (const u of totalUsers.rows) {
                    const symptomDetail = await Symptom.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (symptomDetail !== null){
                        symptomDetails.push(symptomDetail);
                    }
                }

                const symptomUsersRatio =
                ((symptomDetails.length) / (totalUsers.count) * 100).toFixed(2);

                symptomUsers = {
                    Status : "Symptoms",
                    Count  : symptomDetails.length,
                    Ratio  : symptomUsersRatio
                };
            }
            return symptomUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getLabRecordUsers = async (totalUsers, filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const labRecordDetails = [];
            let labRecordUsers = {};

            if (filters.Year != null)
            {
                for (const u of totalUsers.rows) {
                    const labRecordDetail = await Symptom.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (labRecordDetail !== null){
                        labRecordDetails.push(labRecordDetail);
                    }
                }
                labRecordUsers = getMonthlyUsers(labRecordDetails,totalUsers);
            }

            else {
                for (const u of totalUsers.rows) {
                    const labRecordDetail = await Symptom.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (labRecordDetail !== null){
                        labRecordDetails.push(labRecordDetail);
                    }
                }

                const labRecordRatio =
                ((labRecordDetails.length) / (totalUsers.count) * 100).toFixed(2);

                labRecordUsers = {
                    Status : "Lab Record",
                    Count  : labRecordDetails.length,
                    Ratio  : labRecordRatio
                };
            }

            return labRecordUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getNutritionUsers = async (totalUsers, filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const nutritionDetails = [];
            let nutritionUsers = {};

            if (filters.Year != null) {
                for (const u of totalUsers.rows) {
                    const foodConsumptionDetail = await FoodConsumption.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (foodConsumptionDetail !== null){
                        nutritionDetails.push(foodConsumptionDetail);
                    }
                }

                for (const u of totalUsers.rows) {
                    const waterConsumptionDetail = await WaterConsumption.findOne({ where : {
                        PatientUserId : u.UserId,
                        CreatedAt     : {
                            [Op.between] : [minDate, maxDate],
                        }
                    }, paranoid : false });
                    if (waterConsumptionDetail !== null){
                        nutritionDetails.push(waterConsumptionDetail);
                    }
                }

                const uniqueNutritionUsers = getUniqueUsers(nutritionDetails);

                nutritionUsers = getMonthlyUsers(uniqueNutritionUsers,totalUsers);

            }

            else {
                for (const u of totalUsers.rows) {
                    const foodConsumptionDetail = await FoodConsumption.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (foodConsumptionDetail !== null){
                        nutritionDetails.push(foodConsumptionDetail);
                    }
                }

                for (const u of totalUsers.rows) {
                    const waterConsumptionDetail = await WaterConsumption.findOne({ where : {
                        PatientUserId : u.UserId,
                    }, paranoid : false });
                    if (waterConsumptionDetail !== null){
                        nutritionDetails.push(waterConsumptionDetail);
                    }
                }

                const uniqueNutrition =  Array.from(new Set(nutritionDetails.map((x) => x.PatientUserId)));

                const nutritionRatio =
                ((uniqueNutrition.length) / (totalUsers.count) * 100).toFixed(2);

                nutritionUsers = {
                    Status : "Nutrition",
                    Count  : uniqueNutrition.length,
                    Ratio  : nutritionRatio
                };
            }

            return nutritionUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getVitalUsers = async (totalUsers ) => {
        try {
            const vitalDetails = [];
            let vitalsUsers = {};

            for (const u of totalUsers.rows) {
                const cholestrolDetail = await BloodCholesterol.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (cholestrolDetail !== null){
                    vitalDetails.push(cholestrolDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const glucoseDetail = await BloodGlucose.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (glucoseDetail !== null){
                    vitalDetails.push(glucoseDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const oxygenSaturationDetail = await BloodOxygenSaturation.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (oxygenSaturationDetail !== null){
                    vitalDetails.push(oxygenSaturationDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const bloodPressureDetail = await BloodPressure.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (bloodPressureDetail !== null){
                    vitalDetails.push(bloodPressureDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const bodyHeightDetail = await BodyHeight.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (bodyHeightDetail !== null){
                    vitalDetails.push(bodyHeightDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const bodyWeightDetail = await BodyWeight.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (bodyWeightDetail !== null){
                    vitalDetails.push(bodyWeightDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const bodyTempratureDetail = await BodyTemperature.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (bodyTempratureDetail !== null){
                    vitalDetails.push(bodyTempratureDetail);
                }
            }

            for (const u of totalUsers.rows) {
                const pulseDetail = await Pulse.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (pulseDetail !== null){
                    vitalDetails.push(pulseDetail);
                }
            }
            const uniqueVitalsDetails = Array.from(new Set(vitalDetails.map((x) => x.PatientUserId)));

            const vitalsRatio =
                ((uniqueVitalsDetails.length) / (totalUsers.count) * 100).toFixed(2);

            vitalsUsers = {
                Status : "Vitals",
                Count  : uniqueVitalsDetails.length,
                Ratio  : vitalsRatio
            };

            return vitalsUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getTotalPersons = async (filters) => {
        const query = Helper.replaceAll(queryTotalTenantPersons, "{{tenantId}}", filters.TenantId);
        let totalPersons = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalPersons_: any = rows;
        if (totalPersons_.length === 1) {
            totalPersons = totalPersons_[0].totalPersons;
        }
        return totalPersons;
    };

    private getTotalActivePersons = async (filters) => {
        const query = Helper.replaceAll(queryTotalActiveTenantPersons, "{{tenantId}}", filters.TenantId);
        let totalActivePersons = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActivePersons_: any = rows;
        if (totalActivePersons_.length === 1) {
            totalActivePersons = totalActivePersons_[0].totalActivePersons;
        }
        return totalActivePersons;
    };

    private getTotalDeletedPersons = async (filters): Promise<number> => {
        const query = Helper.replaceAll(queryTotalDeletedTenantPersons, "{{tenantId}}", filters.TenantId);
        let totalDeletedPersons = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedPersons_: any = rows;
        if (totalDeletedPersons_.length === 1) {
            totalDeletedPersons = totalDeletedPersons_[0].totalDeletedPersons;
        }
        return totalDeletedPersons;
    };

    private  getTotalDoctors = async (filters) => {
        const query = Helper.replaceAll(queryTotalTenantDoctors, "{{tenantId}}", filters.TenantId);
        let totalDoctors = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDoctors_: any = rows;
        if (totalDoctors_.length === 1) {
            totalDoctors = totalDoctors_[0].totalDoctors;
        }
        return totalDoctors;
    };

    private getTotalActiveDoctors = async (filters): Promise<number> => {
        const query = Helper.replaceAll(queryTotalActiveTenantDoctors, "{{tenantId}}", filters.TenantId);
        let totalActiveDoctors = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActiveDoctors_: any = rows;
        if (totalActiveDoctors_.length === 1) {
            totalActiveDoctors = totalActiveDoctors_[0].totalActiveDoctors;
        }
        return totalActiveDoctors;
    };

    private getTotalDeletedDoctors = async (filters): Promise<number> => {
        const query = Helper.replaceAll(queryTotalDeletedTenantDoctors, "{{tenantId}}", filters.TenantId);
        let totalDeletedDoctors = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedDoctors_: any = rows;
        if (totalDeletedDoctors_.length === 1) {
            totalDeletedDoctors = totalDeletedDoctors_[0].totalDeletedDoctors;
        }
        return totalDeletedDoctors;
    };

    private  getCholestrolUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const cholestrolUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const cholestrolUsers = await BloodCholesterol.findAndCountAll(search);

                    var cholestrolUsersForMonth = {
                        Month : monthName,
                        Count : cholestrolUsers.count
                    };
                    cholestrolUsersForMonths.push(cholestrolUsersForMonth);
                }
                return cholestrolUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const cholestrols = await BloodCholesterol.findAndCountAll(search);

                const cholestrolUsersRatio = ((cholestrols.count) / (totalUsers.count) * 100).toFixed(2);

                const  cholestrolUsers = {
                    Biometrics : 'Cholestrol',
                    Count      : cholestrols.count,
                    Ratio      : cholestrolUsersRatio
                };

                return cholestrolUsers;

            }
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getGlucoseUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const glucoseUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const glucoseUsers = await BloodGlucose.findAndCountAll(search);

                    var glucoseUsersForMonth = {
                        Month : monthName,
                        Count : glucoseUsers.count
                    };
                    glucoseUsersForMonths.push(glucoseUsersForMonth);
                }

                return glucoseUsersForMonths;

            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const glucoseUsers = await BloodGlucose.findAndCountAll(search);

                const glucoseUsersUsersRatio = ((glucoseUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const glucoseUsersData = {
                    Biometrics : 'Glucose',
                    Count      : glucoseUsers.count,
                    Ratio      : glucoseUsersUsersRatio
                };

                return glucoseUsersData;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getOxygenSaturationUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {

            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const oxygenSaturationUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const oxygenSaturationUsers = await BloodOxygenSaturation.findAndCountAll(search);

                    var oxygenSaturationUsersForMonth = {
                        Month : monthName,
                        Count : oxygenSaturationUsers.count
                    };
                    oxygenSaturationUsersForMonths.push(oxygenSaturationUsersForMonth);
                }
                return oxygenSaturationUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const oxygenSaturationUsers = await BloodOxygenSaturation.findAndCountAll(search);

                const oxygenSaturationUsersRatio = ((oxygenSaturationUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const oxygenSaturationUsersData = {
                    Biometrics : 'Oxygen Saturation',
                    Count      : oxygenSaturationUsers.count,
                    Ratio      : oxygenSaturationUsersRatio
                };

                return oxygenSaturationUsersData;

            }

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getBloodPressureUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const bloodPressureUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const bloodPressureUsers = await BloodPressure.findAndCountAll(search);

                    var bloodPressureUsersForMonth = {
                        Month : monthName,
                        Count : bloodPressureUsers.count
                    };
                    bloodPressureUsersForMonths.push(bloodPressureUsersForMonth);
                }
                return bloodPressureUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const bloodPressureUsers = await BloodPressure.findAndCountAll(search);

                const bloodPressureUsersRatio = ((bloodPressureUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const bloodPressureUsersData = {
                    Biometrics : 'Blood Pressure',
                    Count      : bloodPressureUsers.count,
                    Ratio      : bloodPressureUsersRatio
                };

                return bloodPressureUsersData;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getBodyHeightUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const bodyHeightUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const bodyHeightUsers = await BodyHeight.findAndCountAll(search);

                    var bodyHeightUsersForMonth = {
                        Month : monthName,
                        Count : bodyHeightUsers.count
                    };
                    bodyHeightUsersForMonths.push(bodyHeightUsersForMonth);
                }
                return bodyHeightUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const bodyHeightUsers = await BodyHeight.findAndCountAll(search);

                const bodyHeightUsersRatio = ((bodyHeightUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const bodyHeightUsersData = {
                    Biometrics : 'Body Height',
                    Count      : bodyHeightUsers.count,
                    Ratio      : bodyHeightUsersRatio
                };

                return bodyHeightUsersData;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getBodyWeightUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const bodyWeightUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const bodyWeightUsers = await BodyWeight.findAndCountAll(search);

                    var bodyWeightUsersForMonth = {
                        Month : monthName,
                        Count : bodyWeightUsers.count
                    };
                    bodyWeightUsersForMonths.push(bodyWeightUsersForMonth);
                }
                return bodyWeightUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const bodyWeightUsers = await BodyWeight.findAndCountAll(search);

                const bodyWeightUsersRatio = ((bodyWeightUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const bodyWeightUsersData = {
                    Biometrics : 'Body Weight',
                    Count      : bodyWeightUsers.count,
                    Ratio      : bodyWeightUsersRatio
                };

                return bodyWeightUsersData;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getBodyTempratureUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const bodyTempratureUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const bodyTempratureUsers = await BodyTemperature.findAndCountAll(search);

                    var bodyTempratureUsersForMonth = {
                        Month : monthName,
                        Count : bodyTempratureUsers.count
                    };
                    bodyTempratureUsersForMonths.push(bodyTempratureUsersForMonth);
                }
                return bodyTempratureUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const bodyTempratureUsers = await BodyTemperature.findAndCountAll(search);

                const bodyTempratureUsersRatio = ((bodyTempratureUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const bodyTempratureUsersData = {
                    Biometrics : 'Body Temprature',
                    Count      : bodyTempratureUsers.count,
                    Ratio      : bodyTempratureUsersRatio
                };

                return bodyTempratureUsersData;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private aggregateUserStats =
     (
         totalUsers: number,
         notDeletedUsers: number,
         usersWithActiveSession: number,
         deletedUsers: number,
         enrolledUsers: number) => {
         return {
             TotalUsers : {
                 Count : totalUsers
             },
             NotDeletedUsers : {
                 Count : notDeletedUsers,
                 Ratio : totalUsers ? ((Number(notDeletedUsers) / Number(totalUsers)) * 100).toFixed(2) : "0.00"
             },
             UsersWithActiveSession : {
                 Count : usersWithActiveSession,
                 Ratio : totalUsers ? ((Number(usersWithActiveSession) / Number(totalUsers)) * 100).toFixed(2) : "0.00"
             },
             DeletedUsers : {
                 Count : deletedUsers,
                 Ratio : totalUsers ? ((Number(deletedUsers) / Number(totalUsers)) * 100).toFixed(2) : "0.00"
             },
             EnrolledUsers : {
                 Count : enrolledUsers,
                 Ratio : totalUsers ? ((Number(enrolledUsers) / Number(totalUsers)) * 100).toFixed(2) : "0.00"
             }
         };
     };

    private aggregateYearWiseDeviceDetails = (yearWiseDeviceDetails, yearWiseUserCount) => {
        const year = [];
        const result = [];

        for (let i = 0; i < yearWiseUserCount.length; i++) {
            if (!year.includes(yearWiseUserCount[i].year)) {
                year.push(yearWiseUserCount[i].year);
                result.push({
                    Year          : yearWiseUserCount[i].year,
                    UserCount     : yearWiseUserCount[i].totalUsers,
                    DeviceDetails : [
                        {
                            OSType : "Android",
                            Count  : 0
                        },
                        {
                            OSType : "iOS",
                            Count  : 0
                        }
                    ]
                });
            }
        }

        for (let i = 0; i < year.length; i++) {
            const y = year[i];

            for (let j = 0; j < yearWiseDeviceDetails.length; j++) {
                if (yearWiseDeviceDetails[j].year === y) {
                    if (yearWiseDeviceDetails[j].OSType === "Android") {
                        result[i].DeviceDetails[0].Count = yearWiseDeviceDetails[j].totalUsers;
                    }
                    if (yearWiseDeviceDetails[j].OSType === "iOS") {
                        result[i].DeviceDetails[1].Count = yearWiseDeviceDetails[j].totalUsers;
                    }
                }
            }
        }
        return result;
    };

    private aggregateYearWiseAddictionDetails = (
        yearWiseTobaccoSmokers,
        yearWiseHeavyDrinkers,
        yearWiseSubstanceAbuse,
        yearWisenotAddicted,
        yearWiseUserCount
    ) => {
        const year = [];
        const result = [];

        for (let i = 0; i < yearWiseUserCount.length; i++) {
            if (!year.includes(yearWiseUserCount[i].year)) {
                year.push(yearWiseUserCount[i].year);
                result.push({
                    Year            : yearWiseUserCount[i].year,
                    UserCount       : yearWiseUserCount[i].totalUsers,
                    AdditionDetails : [
                        {
                            Status : "Tobacco Smokers",
                            Count  : 0,
                        },

                        {
                            Status : "Heavy Drinker",
                            Count  : 0,
                        },

                        {
                            Status : "Substance Abuse",
                            Count  : 0,
                        },

                        {
                            Status : "Non Addicted",
                            Count  : 0,
                        }
                    ]
                });
            }
        }

        for (let i = 0; i < year.length; i++) {
            const y = year[i];

            for (let j = 0; j < yearWiseTobaccoSmokers.length; j++) {
                if (yearWiseTobaccoSmokers[j].year === y) {
                    result[i].AdditionDetails[0].Count = yearWiseTobaccoSmokers[j].tobaccoUserCount;
                }
            }
            for (let j = 0; j < yearWiseHeavyDrinkers.length; j++) {
                if (yearWiseHeavyDrinkers[j].year === y) {
                    result[i].AdditionDetails[1].Count = yearWiseHeavyDrinkers[j].drinkerUserCount;
                }
            }
            for (let j = 0; j < yearWiseSubstanceAbuse.length; j++) {
                if (yearWiseSubstanceAbuse[j].year === y) {
                    result[i].AdditionDetails[2].Count = yearWiseSubstanceAbuse[j].substanceAbuseUserCount;
                }
            }
            for (let j = 0; j < yearWisenotAddicted.length; j++) {
                if (yearWisenotAddicted[j].year === y) {
                    result[i].AdditionDetails[3].Count = yearWisenotAddicted[j].notAddedUserCount;
                }
            }
        }
        return result;
    };

    private  getPulseUsers = async (totalUsers, filters: StatisticSearchFilters) => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const pulseUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const pulseUsers = await Pulse.findAndCountAll(search);

                    var pulseUsersForMonth = {
                        Month : monthName,
                        Count : pulseUsers.count
                    };
                    pulseUsersForMonths.push(pulseUsersForMonth);
                }
                return pulseUsersForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    search.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    search.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                const pulseUsers = await Pulse.findAndCountAll(search);

                const pulseUsersRatio = ((pulseUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const pulseUsersData = {
                    Biometrics : 'Pulse',
                    Count      : pulseUsers.count,
                    Ratio      : pulseUsersRatio
                };

                return pulseUsersData;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private aggregateYearWiseGenderDetails = (yearWiseGenderDetails) => {
        const year = [];
        const result = [];

        for (let i = 0; i < yearWiseGenderDetails.length; i++) {
            if (!year.includes(yearWiseGenderDetails[i].year)) {
                year.push(yearWiseGenderDetails[i].year);
            }
        }

        for (let i = 0; i < year.length; i++) {
            const y = year[i];
            const details = [];
            let totalUsers = 0;
            for (let j = 0; j < yearWiseGenderDetails.length; j++) {
                if (yearWiseGenderDetails[j].year === y) {
                    totalUsers = totalUsers + yearWiseGenderDetails[j].totalCount;
                }
            }
            for (let j = 0; j < yearWiseGenderDetails.length; j++) {
                if (yearWiseGenderDetails[j].year === y) {
                    const genderDetails: GenderDetails = {
                        Gender : yearWiseGenderDetails[j].Gender,
                        Count  : yearWiseGenderDetails[j].totalCount,
                        Ratio  : totalUsers ? ((yearWiseGenderDetails[j].totalCount / totalUsers) * 100).toFixed(2) : "0.00"
                    };
                    details.push(genderDetails);
                }
            }
            result.push({
                Year          : y,
                GenderDetails : details
            });
        }
        return result;
    };

    private aggregateUserByGender = (genderWiseUsers) => {
        let totalGenders = 0;
        const result = [];
        for (let i = 0; i < genderWiseUsers.length; i++) {
            totalGenders += genderWiseUsers[i].totalCount;
        }

        for (let i = 0; i < genderWiseUsers.length; i++) {
            result.push({
                Gender : genderWiseUsers[i].Gender,
                Count  : genderWiseUsers[i].totalCount,
                Ratio  : totalGenders ? ((genderWiseUsers[i].totalCount / totalGenders) * 100).toFixed(2) : "0.00"
            });
        }
        return result;
    };

    private aggregateUserByAge = (userByAge) => {
        let below35 = 0;
        let above35Below70 = 0;
        let above71 = 0;
        let notSpecified = 0;

        for (let i = 0; i < userByAge.length; i++) {

            if (!userByAge[i].age) {
                notSpecified += 1;
            } else if (userByAge[i].age <= 35 ) {
                below35 += 1;
            } else if (userByAge[i].age >= 36 && userByAge[i].age <= 70) {
                above35Below70 += 1;
            } else {
                above71 += 1;
            }
        }

        return [
            {
                Status : "Below 35",
                Count  : below35,
                Ratio  : userByAge.length ? ((below35 / userByAge.length) * 100).toFixed(2) : "0.00"
            },
            {
                Status : "36 to 70",
                Count  : above35Below70,
                Ratio  : userByAge.length ? ((above35Below70 / userByAge.length) * 100).toFixed(2) : "0.00"
            },
            {
                Status : "Above 71",
                Count  : above71,
                Ratio  : userByAge.length ? ((above71 / userByAge.length) * 100).toFixed(2) : "0.00"
            },
            {
                Status : "Not Specified",
                Count  : notSpecified,
                Ratio  : userByAge.length ? ((notSpecified / userByAge.length) * 100).toFixed(2) : "0.00"
            }
        ];
    };

    private aggregateYearWiseMaritalDetails = (yearWiseMaritalDetails) => {
        const year = [];
        const result = [];

        for (let i = 0; i < yearWiseMaritalDetails.length; i++) {
            if (!year.includes(yearWiseMaritalDetails[i].year)) {
                year.push(yearWiseMaritalDetails[i].year);
            }
        }

        for (let i = 0; i < year.length; i++) {
            const y = year[i];
            const details = [];
            for (let j = 0; j < yearWiseMaritalDetails.length; j++) {
                if (yearWiseMaritalDetails[j].year === y) {
                    const maritalDetails: MaritalStatusDetails = {
                        MaritalStatus : yearWiseMaritalDetails[j].MaritalStatus,
                        Count         : yearWiseMaritalDetails[j].totalCount
                    };
                    details.push(maritalDetails);
                }
            }
            result.push({
                Year           : y,
                MaritalDetails : details
            });
        }
        return result;
    };

    private aggregateYearWiseMajorAilmentDetails = (yearWiseMajorAilment) => {
        const year = [];
        const result = [];

        for (let i = 0; i < yearWiseMajorAilment.length; i++) {
            if (!year.includes(yearWiseMajorAilment[i].year)) {
                year.push(yearWiseMajorAilment[i].year);
            }
        }

        for (let i = 0; i < year.length; i++) {
            const y = year[i];
            const details = [];
            for (let j = 0; j < yearWiseMajorAilment.length; j++) {
                if (yearWiseMajorAilment[j].year === y) {
                    const ailmentDetails: MajorAilmentDetails = {
                        MajorAilment : yearWiseMajorAilment[j].MajorAilment,
                        Count        : yearWiseMajorAilment[j].totalCount
                    };
                    details.push(ailmentDetails);
                }
            }
            result.push({
                Year           : y,
                AilmentDetails : details
            });
        }
        return result;
    };

}

function getUtcYear(date: Date | string): number {
    return new Date(date).getUTCFullYear();
}

function computeAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getUTCFullYear() - birth.getUTCFullYear();
    const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birth.getUTCDate())) {
        age--;
    }
    return age;
}

function getMinMaxDatesForYear(filters) {
    const minDate = new Date();
    minDate.setUTCFullYear(filters.Year, 0, 1);
    minDate.setUTCHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setUTCFullYear(filters.Year, 11, 31);
    maxDate.setUTCHours(0, 0, 0, 0);

    return { minDate, maxDate };
}

function getMaxDate(filters):Date {
    const numberOfDays = getNumberOfDays(filters.Year, filters.Month);
    const maxDate = new Date();
    maxDate.setUTCFullYear(filters.Year,filters.Month - 1, numberOfDays);
    maxDate.setUTCHours(0, 0, 0, 0);

    return maxDate ;
}

function getNumberOfDays (year: number, month: number): number {
    const nextMonth = new Date(year, month, 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    return nextMonth.getDate();
}

function getMonthlyUsers(usersData, totalUsers) {
    var months =
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthyDetails = [];
    for (const p of usersData) {
        const month = TimeHelper.getMonth(p.CreatedAt);
        monthyDetails.push(month);
    }

    const monthlyUsersData = [];
    for (const m of months) {
        const monthlyUsers = monthyDetails.filter((x) => x === m);
        const ratio = ((monthlyUsers.length) / (totalUsers.count) * 100).toFixed(2);
        const monthlyUsersDetail = {
            Month : m,
            Count : monthlyUsers.length,
            Ratio : ratio,
        };
        monthlyUsersData.push(monthlyUsersDetail);
    }
    return monthlyUsersData;
}

function getUniqueUsers(usersData) {
    const compareObjects = (a, b) => {
        return a.PatientUserId === b.PatientUserId;
    };
    const uniqueArray = usersData.filter((obj, index, self) => {
        return (
            index ===
            self.findIndex((innerObj) => compareObjects(innerObj, obj))
        );
    });
    return uniqueArray;
}

