import { Dialect, Op, QueryTypes } from 'sequelize';
import { CountryCurrencyPhone } from 'country-currency-phone';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { IStatisticsRepo } from '../../../../repository.interfaces/statistics/statistics.repo.interface';
import Person from '../../models/person/person.model';
import Patient from '../../models/users/patient/patient.model';
import { Helper } from '../../../../../common/helper';
import HealthProfile from '../../models/users/patient/health.profile.model';
import UserLoginSession from '../../models/users/user/user.login.session.model';
import UserDeviceDetails from '../../models/users/user/user.device.details.model';
import CareplanEnrollment from '../../models/clinical/careplan/enrollment.model';
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
import Doctor from '../../models/users/doctor.model';
import EmergencyContact from '../../models/users/patient/emergency.contact.model';
import { DurationType } from '../../../../../domain.types/miscellaneous/time.types';
import { StatisticSearchFilters } from '../../../../../domain.types/statistics/statistics.search.type';
import { Sequelize } from 'sequelize-typescript';
 
////////////////////////////////////////////////////////////////////////////////////////////

const sequelizeStats = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_USER_PASSWORD, {
        host    : process.env.DB_HOST,
        dialect : process.env.DB_DIALECT  as Dialect,
    });
    
//////////////////////////////////////////////////////////////////////////////////////////////

export class StatisticsRepo implements IStatisticsRepo {

    getUsersCount = async (filters: StatisticSearchFilters): Promise<any> => {
        try {
            const totalUsers = await this.getOnboardedUsers(filters);
            const notDeletedUsers = await this.getNotDeletedUsers(filters);
            const usersWithActiveSession = await this.getUsersWithActiveSession(filters);
            const deletedUsers = await this.getDeletedUsers(filters);
            const enrolledUsers = await this.getEnrolledUsers(filters);

            const usersData = {
                TotalUsers             : totalUsers,
                NotDeletedUsers        : notDeletedUsers,
                UsersWithActiveSession : usersWithActiveSession,
                DeletedUsers           : deletedUsers,
                EnrolledUsers          : enrolledUsers,
            };

            return usersData;
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

    getUsersByGender = async (filters): Promise<any> => {
        try {
            const totalUsers = await this.getTotalUsers(filters);

            const totalUsers_ = totalUsers.rows.map(x => x.Person.Gender);

            const totalMaleUsers = totalUsers_.filter(x => x === "Male");

            const maleUsersRatio = ((totalMaleUsers.length) / (totalUsers.count) * 100).toFixed(2);

            const maleUsers = {
                Status : "Male",
                Count  : totalMaleUsers.length,
                Ratio  : maleUsersRatio,
            };

            const totalFemaleUsers = totalUsers_.filter(x => x === "Female");
            const femaleUsersRatio = ((totalFemaleUsers.length) / (totalUsers.count) * 100).toFixed(2);

            const femaleUsers = {
                Status : "Female",
                Count  : totalFemaleUsers.length,
                Ratio  : femaleUsersRatio,
            };

            const totalIntersexUsers = totalUsers_.filter(x => x === "Intersex");
            const IntersexUsersRatio = ((totalIntersexUsers.length) / (totalUsers.count) * 100).toFixed(2);

            const intersexUsers = {
                Status : "Intersex",
                Count  : totalIntersexUsers.length,
                Ratio  : IntersexUsersRatio,
            };

            const totalGenderNotSpecifiedUsers = totalUsers_.filter(x => x === "Other" || x === "Unknown" );

            const genderNotSpecifiedUsersRatio =
            ((totalGenderNotSpecifiedUsers.length) / (totalUsers.count) * 100).toFixed(2);

            const genderNotSpecifiedUsers = {
                Status : "Not Specified",
                Count  : totalGenderNotSpecifiedUsers.length,
                Ratio  : genderNotSpecifiedUsersRatio,
            };

            const genderWiseUsers = [
                maleUsers,
                femaleUsers,
                intersexUsers,
                genderNotSpecifiedUsers
            ];

            return genderWiseUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByAge = async (filters): Promise<any> => {
        try {
            const totalUsers_ = await this.getTotalUsers(filters);
            const totalUsers = totalUsers_.rows.map(x => x.Person.BirthDate);

            const usersWithBirthDate = totalUsers.filter(x => x != null);

            const totalAgeNotSpecifiedUsers = (totalUsers.length) - (usersWithBirthDate.length);

            const ageNotSpecifiedUsersRatio = ((totalAgeNotSpecifiedUsers) / (totalUsers_.count) * 100).toFixed(2);

            const ageNotSpecifiedUsers = {
                Status : 'Not Specified',
                Count  : totalAgeNotSpecifiedUsers,
                Ratio  : ageNotSpecifiedUsersRatio,
            };

            const totalUsresWithAge = [];

            for ( const u of usersWithBirthDate ) {
                var userAge = Helper.getAgeFromBirthDate(u, true);
                var usrAge = userAge.split(" ");
                const user = Number(usrAge[0]);
                totalUsresWithAge.push(user);
            }

            // var usersBetweenTwoNumbers = {};

            if (filters.AgeFrom != null && filters.AgeTo != null) {
                const totalUsersBetweenTwoNumbers =
                    totalUsresWithAge.filter(x => x > filters.AgeFrom && x < filters.AgeTo);
                const usersBetweenTwoNumbersRatio =
                    ((totalUsersBetweenTwoNumbers.length) / (totalUsers_.count) * 100).toFixed(2);

                // usersBetweenTwoNumbers = {
                //     Count : totalUsersBetweenTwoNumbers.length,
                //     Ratio : usersBetweenTwoNumbersRatio,
                // };
            }

            const totalUsersBelowThirtyfive = totalUsresWithAge.filter(x => x <= 35);
            const usersBelowThirtyfiveRatio = ((totalUsersBelowThirtyfive.length) / (totalUsers_.count) * 100).toFixed(2);

            const usersBelowThirtyfive = {
                Status : 'Below 35',
                Count  : totalUsersBelowThirtyfive.length,
                Ratio  : usersBelowThirtyfiveRatio,
            };

            const totalUsersBetweenThirtysixToSeventy = totalUsresWithAge.filter(x => x >= 36 && x <= 70);

            const usersBetweenThirtysixToSeventyRatio =
            ((totalUsersBetweenThirtysixToSeventy.length) / (totalUsers_.count) * 100).toFixed(2);

            const usersBetweenThirtysixToSeventy = {
                Status : '36 to 70',
                Count  : totalUsersBetweenThirtysixToSeventy.length,
                Ratio  : usersBetweenThirtysixToSeventyRatio,
            };

            const totalUsersAboveSeventy = totalUsresWithAge.filter(x => x >= 71);
            const usersAboveSeventyRatio =
            ((totalUsersAboveSeventy.length) / (totalUsers_.count) * 100).toFixed(2);

            const usersAboveSeventy = {
                Status : 'Above 71',
                Count  : totalUsersAboveSeventy.length,
                Ratio  : usersAboveSeventyRatio,
            };

            const ageWiseUsers = [
                usersBelowThirtyfive,
                usersBetweenThirtysixToSeventy,
                usersAboveSeventy,
                ageNotSpecifiedUsers,
            ];

            return ageWiseUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByMaritalStatus = async (filters): Promise<any> => {
        try {
            const search: any = {
                where      : {},
                include    : [],
                paranoid   : false,
                attributes : ['MaritalStatus'],
                group      : ['MaritalStatus']
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

                const usersByMaritalStatusForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const healthProfileDetails = await HealthProfile.findAndCountAll(search);

                    var usersByMaritalStatusForMonth = {
                        Month : monthName,
                        Count : healthProfileDetails.count
                    };
                    usersByMaritalStatusForMonths.push(usersByMaritalStatusForMonth);
                }
                return usersByMaritalStatusForMonths;
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

                const usersByMaritalStatus = await HealthProfile.findAndCountAll(search);

                return usersByMaritalStatus.count;

            }

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByDeviceDetail = async (filters): Promise<any> => {
        try {

            const search: any = {
                where      : {},
                include    : [],
                paranoid   : false,
                attributes : ['OSType'],
                group      : ['OSType']
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

                const userDeviceDetailsForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const usersByDeviceDetails = await UserDeviceDetails.findAndCountAll(search);

                    var userDeviceDetailsForMonth = {
                        Month : monthName,
                        Count : usersByDeviceDetails.count
                    };
                    userDeviceDetailsForMonths.push(userDeviceDetailsForMonth);
                }
                return userDeviceDetailsForMonths;
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

                const usersByDeviceDetails = await UserDeviceDetails.findAndCountAll(search);

                return usersByDeviceDetails.count;

            }

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByEnrollment = async (filters): Promise<any> => {
        try {

            const query = `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = "Cholesterol"
            AND ce.PatientUserId IN
            (
             SELECT distinct (pt.UserId) from patients as pt
                JOIN users as u ON pt.UserId = u.id
                JOIN persons as p ON u.PersonId = p.id
                WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is null
            )`;

            const response = await sequelizeStats.query(query,
                {
                    type : QueryTypes.SELECT,
                }
            );

            return response;

            // const totalUsers = await this.getTotalUsers(filters);
            // const enrollmentDetails = [];
            // for (const u of totalUsers.rows) {
            //     const enrollmentDetail = await CareplanEnrollment.findOne({ where : {
            //         PatientUserId : u.UserId,
            //     }, paranoid : false });
            //     enrollmentDetails.push(enrollmentDetail);
            // }

            // const totalEnrollnemtUsers = enrollmentDetails.filter(x => x !== null);

            // const totalEnrollnemtUsersRatio =
            //  ((totalEnrollnemtUsers.length) / (totalUsers.count) * 100).toFixed(2);

            // const deviceDetails = [];
            // for (const u of totalEnrollnemtUsers) {
            //     const deviceDetail  = await UserDeviceDetails.findOne({ where : {
            //         UserId : u.PatientUserId,
            //     } });
            //     deviceDetails.push(deviceDetail);
            // }

            // const deviceDatilUsers = deviceDetails.filter(x => x !== null);

            // const androidUsers = deviceDatilUsers.filter(x => x.OSType === 'Android');

            // const androidUsersRatio = ((androidUsers.length) / (totalEnrollnemtUsers.length) * 100).toFixed(2);

            // const iOSUsers = deviceDatilUsers.filter(x => x.OSType === 'iOS');

            // const iOSUsersRatio = ((iOSUsers.length) / (totalEnrollnemtUsers.length) * 100).toFixed(2);

            // const  androidUsersDetails = {
            //     Count : androidUsers.length,
            //     Ratio : androidUsersRatio
            // };

            // const  iOSUsersDetails = {
            //     Count : iOSUsers.length,
            //     Ratio : iOSUsersRatio
            // };
            // const  totalEnrollnemtUsersDetails = {
            //     Count : totalEnrollnemtUsers.length,
            //     Ratio : totalEnrollnemtUsersRatio,
            // };

            // const  enrollmentUsers = {
            //     TotalEnrollnemtUsers : totalEnrollnemtUsersDetails,
            //     AndroidUsers         : androidUsersDetails,
            //     IOSUsers             : iOSUsersDetails,
            // };

            // return enrollmentUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
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
        try {
            const appDownload = await AppDownloadsModel.findAndCountAll();
            return appDownload;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUsersByCountry = async (filters): Promise<any> => {
        try {
            const totalUsers = await this.getTotalUsers(filters);

            const usersCountryCodes = [];
            for (const u of totalUsers.rows) {
                var phone = u.Person.Phone;
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

    getUsersByMajorAilment = async (filters): Promise<any> => {
        try {
            const search: any = {
                where      : {},
                include    : [],
                paranoid   : false,
                attributes : ['MajorAilment'],
                group      : ['MajorAilment']
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

                    const usersBymajorAilments = await HealthProfile.findAndCountAll(search);

                    var majorAilmentUsersForMonth = {
                        Month : monthName,
                        Count : usersBymajorAilments.count
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

                const usersBymajorAilments = await HealthProfile.findAndCountAll(search);

                return usersBymajorAilments.count;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
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

    getUsersByAddiction = async (filters): Promise<any> => {
        try {
            const totalUsers = await this.getTotalUsers(filters);

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

            const healthProfileDetails = await HealthProfile.findAndCountAll(search);

            const tobaccoSmokers = healthProfileDetails.rows.filter(x => x.TobaccoQuestionAns === true);

            const heavyDrinkers = healthProfileDetails.rows.filter(x => x.IsDrinker === true && x.DrinkingSeverity === 'High');

            const substanceAbuse = healthProfileDetails.rows.filter(x => x.SubstanceAbuse === true);

            const nonAddicted  = healthProfileDetails.rows.filter(
                x => x.SubstanceAbuse === false &&
                x.IsDrinker === false &&
                (x.TobaccoQuestionAns === false) || (x.TobaccoQuestionAns === null));

            const tobaccoSmokersRatio =  ((tobaccoSmokers.length) / (totalUsers.count) * 100).toFixed(2);

            const heavyDrinkersRatio =  ((heavyDrinkers.length) / (totalUsers.count) * 100).toFixed(2);

            const substanceAbuseRatio =  ((substanceAbuse.length) / (totalUsers.count) * 100).toFixed(2);

            const nonAddictedRatio =  ((nonAddicted.length) / (totalUsers.count) * 100).toFixed(2);

            const tobaccoSmokerUsers = {
                Status : "Tobacco Smokers",
                Count  : tobaccoSmokers.length,
                Ratio  : tobaccoSmokersRatio
            };

            const heavyDrinkerUsers = {
                Status : "Heavy Drinker",
                Count  : heavyDrinkers.length,
                Ratio  : heavyDrinkersRatio
            };

            const substanceAbuseUsers = {
                Status : "Substance Abuse",
                Count  : substanceAbuse.length,
                Ratio  : substanceAbuseRatio
            };

            const nonAddictedUsers = {
                Status : "Non Addicted",
                Count  : nonAddicted.length,
                Ratio  : nonAddictedRatio
            };

            const addictionDetails = [
                tobaccoSmokerUsers,
                heavyDrinkerUsers,
                substanceAbuseUsers,
                nonAddictedUsers
            ];

            return addictionDetails;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
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

            let healthPillarDistribution = {} || [];

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
            const persons = await this.getPersons(filters);

            const users = await this.getUsers(filters);

            const admins = await this.getAdmins(filters);

            const doctors = await this.getDoctors(filters);

            const totalPatients = await this.getTotalUsers(filters);

            const nonDetetedPatients = await this.getNotDeletedUsers(filters);

            const detetedPatients = await this.getDeletedUsers(filters);

            const enrollments = await this.getEnrollments(filters);

            const emergencyContacts  = await this.getEmergencyContacts(filters);

            const paitents = {
                TotalPatients      : totalPatients.count,
                NonDetetedPatients : nonDetetedPatients,
                DetetedPatients    : detetedPatients,
            };

            const usersStats = {
                Persons           : persons,
                Users             : users,
                Admins            : admins,
                Doctors           : doctors,
                Paitents          : paitents,
                Enrollments       : enrollments,
                EmergencyContacts : emergencyContacts
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
            let biometricUsers = {} || [] ;

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
        try {
           
            const search: any = {
                where      : {},
                include    : [],
                paranoid   : false,
                attributes : [
                    [sequelizeStats.fn('YEAR', sequelizeStats.col('CreatedAt')), 'year'], // Extract year from createdAt
                ],
                group : [sequelizeStats.fn('YEAR', sequelizeStats.col('CreatedAt'))],
            };

            const allYears = await Patient.findAll(search);
            return allYears;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // #private region

    private getOnboardedUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        try {
            const search: any = { where: {}, include: [], paranoid: false };
            const includesObj =
             {
                 model    : Person,
                 required : true,
                 where    : {},
                 paranoid : false,
             };

            includesObj.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            if (filters.PastMonths != null)  {
                const usersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    includesObj.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };
                    search.include.push(includesObj);

                    const totalUsers = await Patient.findAndCountAll(search);

                    var usersForMonth = {
                        Month : monthName,
                        Count : totalUsers.count
                    };
                    usersForMonths.push(usersForMonth);
                }
                return usersForMonths;
            }
            else
            {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    includesObj.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }
                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    includesObj.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    includesObj.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                search.include.push(includesObj);

                const totalUsers = await Patient.findAndCountAll(search);

                const totalUsersDetails = {
                    Count : totalUsers.count,
                };

                return totalUsersDetails;
            }

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

   private  getNotDeletedUsers = async (filters: StatisticSearchFilters): Promise<any> => {
       try {
           const totalUsers = await this.getTotalUsers(filters);
           const { minDate, maxDate } = getMinMaxDatesForYear(filters);
           const maxCreatedDate = getMaxDate(filters);
           const search: any = { where: {}, include: [], paranoid: false };

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

           includesObj.where['DeletedAt'] = {
               [Op.eq] : null
           };

           if (filters.PastMonths != null)  {
               const notDeletedUsersDetails = [];
               for (var i = 0; i < filters.PastMonths; i++) {
                   var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                   var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                   var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                   var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                   includesObj.where['CreatedAt'] = {
                       [Op.between] : [startOfMonth, endOfMonth],
                   };
                   search.include.push(includesObj);

                   const nonDeletedUsers = await Patient.findAndCountAll(search);

                   var usersForMonth = {
                       Month : monthName,
                       Count : nonDeletedUsers.count
                   };
                   notDeletedUsersDetails.push(usersForMonth);
               }
               return notDeletedUsersDetails;
           }

           else
           {
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
               if (filters.From != null && filters.To != null)  {
                   includesObj.where['CreatedAt'] = {
                       [Op.between] : [filters.From, filters.To],
                   };
               }
               search.include.push(includesObj);

               const nonDeletedUsers = await Patient.findAndCountAll(search);

               const nonDeletedUsersRatio =  ((nonDeletedUsers.count) / (totalUsers.count) * 100).toFixed(2);

               const notDeletedUsersDetails = {
                   Count : nonDeletedUsers.count,
                   Ratio : nonDeletedUsersRatio
               };
               return notDeletedUsersDetails;
           }

       } catch (error) {
           Logger.instance().log(error.message);
           throw new ApiError(500, error.message);
       }
   };

   private  getDeletedUsers = async (filters: StatisticSearchFilters): Promise<any> => {
       try {
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

           includesObj.where['DeletedAt'] = {
               [Op.not] : null
           };

           if (filters.PastMonths != null) {

               const deletedUsersDetails = [];

               for (var i = 0; i < filters.PastMonths; i++) {
                   var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                   var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                   var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                   var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                   includesObj.where['CreatedAt'] = {
                       [Op.between] : [startOfMonth, endOfMonth],
                   };

                   search.include.push(includesObj);

                   const deletedUsers = await Patient.findAndCountAll(search);

                   var deletedUsersForMonth = {
                       Month : monthName,
                       Count : deletedUsers.count
                   };
                   deletedUsersDetails.push(deletedUsersForMonth);
               }
               return deletedUsersDetails;
           }
           else {
               const { minDate, maxDate } = getMinMaxDatesForYear(filters);
               if (filters.Year != null)  {
                   includesObj.where['CreatedAt'] = {
                       [Op.between] : [minDate, maxDate],
                   };
               }
               const maxCreatedDate = getMaxDate(filters);
               if (filters.Year != null && filters.Month != null)  {
                   includesObj.where['CreatedAt'] = {
                       [Op.lt] : maxCreatedDate,
                   };
               }
               if (filters.From != null && filters.To != null)  {
                   includesObj.where['CreatedAt'] = {
                       [Op.between] : [filters.From, filters.To],
                   };
               }

               search.include.push(includesObj);

               const deletedUsers = await Patient.findAndCountAll(search);

               const totalUsers = await this.getTotalUsers(filters);

               const deletedUsersRatio =  ((deletedUsers.count) / (totalUsers.count) * 100).toFixed(2);

               const  deletedUsersDetails = {
                   Count : deletedUsers.count,
                   Ratio : deletedUsersRatio
               };

               return deletedUsersDetails;

           }
       } catch (error) {
           Logger.instance().log(error.message);
           throw new ApiError(500, error.message);
       }
   };

    private getUsersWithActiveSession = async (filters: StatisticSearchFilters): Promise<any> => {
        try {
            const search: any = { where: {}, include: [], paranoid: false };

            const includesObj =
             {
                 model    : Person,
                 required : true,
                 where    : {},
             };

            includesObj.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            includesObj.where['DeletedAt'] = {
                [Op.eq] : null
            };

            if (filters.PastMonths != null) {

                const usersWithActiveSessionForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    includesObj.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    search.include.push(includesObj);

                    const totalUsers_ = await Patient.findAndCountAll(search);

                    const totalUsers  = totalUsers_.rows.map(x => x.UserId);

                    const loginSessions = [];
                    for (const u of totalUsers) {
                        const loginSession = await UserLoginSession.findOne({ where : {
                            UserId    : u,
                            ValidTill : { [Op.gte]: new Date() },
                        } });
                        if (loginSession != null) {
                            loginSessions.push(loginSession);
                        }
                    }

                    var usersWithActiveSessionForMonth = {
                        Month : monthName,
                        Count : loginSessions.length
                    };
                    usersWithActiveSessionForMonths.push(usersWithActiveSessionForMonth);
                }
                return usersWithActiveSessionForMonths;
            }
            else {
                const { minDate, maxDate } = getMinMaxDatesForYear(filters);
                if (filters.Year != null)  {
                    includesObj.where['CreatedAt'] = {
                        [Op.between] : [minDate, maxDate],
                    };
                }

                const maxCreatedDate = getMaxDate(filters);
                if (filters.Year != null && filters.Month != null)  {
                    includesObj.where['CreatedAt'] = {
                        [Op.lt] : maxCreatedDate,
                    };
                }
                if (filters.From != null && filters.To != null)  {
                    includesObj.where['CreatedAt'] = {
                        [Op.between] : [filters.From, filters.To],
                    };
                }

                search.include.push(includesObj);

                const totalUsers_ = await Patient.findAndCountAll(search);

                const totalUsers  = totalUsers_.rows.map(x => x.UserId);

                const activeLoginSessions = [];
                for (const u of totalUsers) {
                    const loginSession = await UserLoginSession.findOne({ where : {
                        UserId    : u,
                        ValidTill : { [Op.gte]: new Date() },
                    } });
                    if (loginSession != null) {
                        activeLoginSessions.push(loginSession);
                    }
                }

                const activeUsersRatio = ((activeLoginSessions.length) / (totalUsers_.count) * 100).toFixed(2);

                const  activeUsers = {
                    Count : activeLoginSessions.length,
                    Ratio : activeUsersRatio,
                };
                return activeUsers;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private getEnrolledUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        try {
            const search: any = { where: {}, };

            if (filters.PastMonths != null) {

                const enrolledUsersForMonths = [];

                for (var i = 0; i < filters.PastMonths; i++) {
                    var date = TimeHelper.subtractDuration(new Date(), i, DurationType.Month);
                    var startOfMonth = TimeHelper.startOf(date, DurationType.Month);
                    var endOfMonth = TimeHelper.endOf(date, DurationType.Month);
                    var monthName = TimeHelper.format(date, 'MMMM, YYYY');

                    search.where['CreatedAt'] = {
                        [Op.between] : [startOfMonth, endOfMonth],
                    };

                    const enrolledUsers = await CareplanEnrollment.findAndCountAll(search);

                    var enrolledUsersForMonth = {
                        Month : monthName,
                        Count : enrolledUsers.count
                    };
                    enrolledUsersForMonths.push(enrolledUsersForMonth);
                }
                return enrolledUsersForMonths;
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

                const enrolledUsers = await CareplanEnrollment.findAndCountAll(search);

                const totalUsers = await this.getTotalUsers(filters);

                const enrolledUsersRatio = ((enrolledUsers.count) / (totalUsers.count) * 100).toFixed(2);

                const  enrolledUsersDetails = {
                    Count : enrolledUsers.count,
                    Ratio : enrolledUsersRatio,
                };

                return enrolledUsersDetails;

            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private getTotalUsers = async (filters: StatisticSearchFilters): Promise<any> => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const maxCreatedDate = getMaxDate(filters);
            const search: any = { where: {}, include: [], paranoid: false };

            const includesObj =
             {
                 model    : Person,
                 required : true,
                 where    : {},
                 paranoid : false,
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
            if (filters.From != null && filters.To != null)  {
                includesObj.where['CreatedAt'] = {
                    [Op.between] : [filters.From, filters.To],
                };
            }

            search.include.push(includesObj);

            const totalUsers = await Patient.findAndCountAll(search);

            return totalUsers;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
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

                physicalActivityUsers = getMonthlyUsers(physicalActivityDetails,totalUsers);

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

    private  getPersons = async (filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const search: any = { where: {}, paranoid: false };

            search.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            search.where['DeletedAt'] = {
                [Op.eq] : null
            };

            if (filters.Year != null)  {
                search.where['CreatedAt'] = {
                    [Op.between] : [minDate, maxDate],
                };
            }

            const nonDeletedPersons = await Person.findAndCountAll(search);

            search.where['DeletedAt'] = {
                [Op.not] : null
            };

            const deletedPersons = await Person.findAndCountAll(search);

            const totalPresons = nonDeletedPersons.count + deletedPersons.count;

            const presons = {
                TotalPresons      : totalPresons,
                NonDeletedPersons : nonDeletedPersons.count,
                DeletedPersons    : deletedPersons.count
            };

            return presons;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getUsers = async (filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
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

            includesObj.where['DeletedAt'] = {
                [Op.eq] : null
            };

            if (filters.Year != null)  {
                includesObj.where['CreatedAt'] = {
                    [Op.between] : [minDate, maxDate],
                };
            }

            search.include.push(includesObj);

            const nonDeletedUsers = await User.findAndCountAll(search);

            includesObj.where['DeletedAt'] = {
                [Op.not] : null
            };

            search.include.push(includesObj);

            const deletedUsers = await User.findAndCountAll(search);

            const totalUsers = nonDeletedUsers.count + deletedUsers.count;

            const users = {
                TotalUsers      : totalUsers,
                nonDeletedUsers : nonDeletedUsers.count,
                DeletedUsers    : deletedUsers.count
            };

            return users;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getDoctors = async (filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
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

            includesObj.where['DeletedAt'] = {
                [Op.eq] : null
            };

            if (filters.Year != null)  {
                includesObj.where['CreatedAt'] = {
                    [Op.between] : [minDate, maxDate],
                };
            }

            search.include.push(includesObj);

            const nonDeletedDoctors = await Doctor.findAndCountAll(search);

            includesObj.where['DeletedAt'] = {
                [Op.not] : null
            };

            search.include.push(includesObj);

            const deletedDoctors = await Doctor.findAndCountAll(search);

            const totalDoctors = nonDeletedDoctors.count + deletedDoctors.count;

            const doctors = {
                TotalDoctors      : totalDoctors,
                NonDeletedDoctors : nonDeletedDoctors.count,
                DeletedDoctors    : deletedDoctors.count
            };

            return doctors;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getAdmins = async (filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const search: any = { where: {}, include: [],  paranoid: false };

            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {},
                paranoid : false
            };

            search.where['RoleId'] = {
                [Op.eq] : 1,
            };

            includesObj.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            includesObj.where['DeletedAt'] = {
                [Op.eq] : null
            };

            if (filters.Year != null)  {
                includesObj.where['CreatedAt'] = {
                    [Op.between] : [minDate, maxDate],
                };
            }

            search.include.push(includesObj);

            const adminUsers = await User.findAndCountAll(search);

            search.include.push(includesObj);

            const admins = {
                TotalAdmins : adminUsers.count
            };

            return admins;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getEnrollments = async (filters) => {
        try {

            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const maxCreatedDate = getMaxDate(filters);
            const search: any = { where: {}, include: [], paranoid: false };

            const includesObj =
            {
                model    : Person,
                required : true,
                where    : {

                },
                paranoid : false
            };

            includesObj.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            includesObj.where['DeletedAt'] = {
                [Op.eq] : null
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

            const nonDeletedUsers = await Patient.findAndCountAll(search);

            includesObj.where['DeletedAt'] = {
                [Op.not] : null
            };

            search.include.push(includesObj);

            const deletedUsers = await Patient.findAndCountAll(search);

            const nonDeletedEnrollmentDetails = [];
            for (const u of nonDeletedUsers.rows) {
                const enrollmentDetail = await CareplanEnrollment.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (enrollmentDetail !== null){
                    nonDeletedEnrollmentDetails.push(enrollmentDetail);
                }
            }

            const deletedEnrollmentDetails = [];
            for (const u of deletedUsers.rows) {
                const enrollmentDetail = await CareplanEnrollment.findOne({ where : {
                    PatientUserId : u.UserId,
                }, paranoid : false });
                if (enrollmentDetail !== null){
                    deletedEnrollmentDetails.push(enrollmentDetail);
                }

            }

            const totalEnrollments = nonDeletedEnrollmentDetails.length + deletedEnrollmentDetails.length;

            const nonDeletedCholestrolEnrollment = nonDeletedEnrollmentDetails.filter(x => x.PlanCode === 'Cholesterol');

            const deletedCholestrolEnrollment = deletedEnrollmentDetails.filter(x => x.PlanCode === 'Cholesterol');

            const totalCholestrolEnrollment = nonDeletedCholestrolEnrollment.length + deletedCholestrolEnrollment.length;

            const nonDeletedStrokeEnrollment = nonDeletedEnrollmentDetails.filter(x => x.PlanCode === 'Stroke');

            const deletedStrokeEnrollment = deletedEnrollmentDetails.filter(x => x.PlanCode === 'Stroke');

            const totalStrokeEnrollment = nonDeletedStrokeEnrollment.length + deletedStrokeEnrollment.length;

            const nonDeletedHFMotivatorEnrollment = nonDeletedEnrollmentDetails.filter(x => x.PlanCode === 'HFMotivator');

            const deletedHFMotivatorEnrollment = deletedEnrollmentDetails.filter(x => x.PlanCode === 'HFMotivator');

            const totalHFMotivatorEnrollment = nonDeletedHFMotivatorEnrollment.length + deletedHFMotivatorEnrollment.length;

            const enrollments = {
                TotalEnrollments                : totalEnrollments,
                NonDeletedEnrollment            : nonDeletedEnrollmentDetails.length,
                DeletedEnrollment               : deletedEnrollmentDetails.length,
                TotalCholestrolEnrollment       : totalCholestrolEnrollment,
                NonDeletedCholestrolEnrollment  : nonDeletedCholestrolEnrollment.length,
                DeletedCholestrolEnrollment     : deletedCholestrolEnrollment.length,
                TotalStrokeEnrollment           : totalStrokeEnrollment,
                NonDeletedStrokeEnrollment      : nonDeletedStrokeEnrollment.length,
                DeletedStrokeEnrollment         : deletedStrokeEnrollment.length,
                TotalHFMotivatorEnrollment      : totalHFMotivatorEnrollment,
                NonDeletedHFMotivatorEnrollment : nonDeletedHFMotivatorEnrollment.length,
                DeletedHFMotivatorEnrollment    : deletedHFMotivatorEnrollment.length

            };

            return enrollments;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private  getEmergencyContacts = async (filters) => {
        try {
            const { minDate, maxDate } = getMinMaxDatesForYear(filters);
            const search: any = { where: {}, paranoid: false };

            search.where['Phone'] = {
                [Op.notBetween] : [1000000000, 1000000100],
            };

            if (filters.Year != null)  {
                search.where['CreatedAt'] = {
                    [Op.between] : [minDate, maxDate],
                };
            }

            const persons = await Person.findAndCountAll(search);

            const emergencyContactDetails = [];
            for (const p of persons.rows) {
                const emergencyContactDetail = await EmergencyContact.findOne({ where : {
                    ContactPersonId : p.id,
                }, paranoid : false });
                if (emergencyContactDetail !== null){
                    emergencyContactDetails.push(emergencyContactDetail);
                }
            }

            const usersDetails = [];
            for (const p of emergencyContactDetails) {
                const user = await User.findOne({ where : {
                    PersonId : p.ContactPersonId,
                }, paranoid : false });
                if (user !== null){
                    usersDetails.push(user);
                }
            }

            const onlyEmergencyContact =  emergencyContactDetails.length - usersDetails.length;

            const emergencyContacts = {
                TotalEmergencyContacts          : emergencyContactDetails.length,
                EmergencyContactsWhoAreAppUsers : usersDetails.length,
                OnlyEmergencyContacts           : onlyEmergencyContact

            };

            return emergencyContacts;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
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
    const numberOfDays = getNumberOfDays(filters.Year,filters.Month);
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

