import { inject, injectable } from "tsyringe";
import { IAhaStatisticsRepo } from "../../../database/repository.interfaces/statistics/aha.statistics.repo.interface";
import { AppName, CareplanCode, CareplanStats } from "../../../domain.types/statistics/aha/aha.type";
import { exportAHAStatsReportToPDF } from './aha.report.generator';
import { Logger } from "../../../common/logger";
import { FileResourceDto } from "../../../domain.types/general/file.resource/file.resource.dto";
import path from "path";
import { TimeHelper } from "../../../common/time.helper";
import { DateStringFormat } from "../../../domain.types/miscellaneous/time.types";
import { FileResourceService } from "../../general/file.resource.service";
import { EmailService } from "../../../modules/communication/email/email.service";
import { EmailDetails } from "../../../modules/communication/email/email.details";
import { Injector } from "../../../startup/injector";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaStatisticsService {

    constructor(
        @inject('IAhaStatisticsRepo') private _ahaStatisticsRepo: IAhaStatisticsRepo,
    ) {}

    getAhaStatistics = async(): Promise<any> => {
        try {
            const careplanStats: CareplanStats[] = [];
            const listOfCareplans = await this._ahaStatisticsRepo.getListOfCareplan();
            for (let i = 0; i < listOfCareplans.length; i++) {
                const totalCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(
                    listOfCareplans[i]
                );
                const totalActiveCareplanEnrollments = await this._ahaStatisticsRepo.getTotalActiveEnrollments(
                    listOfCareplans[i]
                );
                const totalDeletedCareplanEnrollments = await this._ahaStatisticsRepo.getTotalDeletedEnrollments(
                    listOfCareplans[i]
                );
                const careplan: CareplanStats = {
                    Careplan           : listOfCareplans[i],
                    Enrollments        : totalCareplanEnrollments,
                    ActiveEnrollments  : totalActiveCareplanEnrollments,
                    DeletedEnrollments : totalDeletedCareplanEnrollments
                };
                careplanStats.push(careplan);
            }
            
            const listOfHealthSystem = await this._ahaStatisticsRepo.getListOfHealthSystem();
            const careplanHealthSystemStats = [];
            for (let i = 0; i < listOfCareplans.length; i++) {
                for (let j = 0; listOfHealthSystem.length; j++) {
                    const careplanHealthSystem = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                        listOfCareplans[i], listOfHealthSystem[j]
                    );
                    careplanHealthSystemStats.push(careplanHealthSystem);
                }
            }

            const ahaStats = {
                CareplanStats             : careplanStats,
                CareplanHealthSystemStats : careplanHealthSystemStats,
                Careplans                 : listOfCareplans,
                HealthSystems             : listOfHealthSystem
            };
            return ahaStats;
        } catch (error) {
            Logger.instance().log(`Error in creating AHA statistics:${error.message}`);
        }
        
    };

    getUserStatistics = async(): Promise<any> => {
        try {
            const totalPatientCount =  await this._ahaStatisticsRepo.getTotalPatients();
            const totalActivePatientCount =  await this._ahaStatisticsRepo.getTotalActivePatients();
            const totalDeletedPatients = await this._ahaStatisticsRepo.getTotalDeletedPatients();
            const totalTestPatientCount = await this._ahaStatisticsRepo.getTotalTestPatients();
            const totalDeletedTestPatientCount = await this._ahaStatisticsRepo.getTotalDeletedTestPatients();
    
            const totalUsers = await this._ahaStatisticsRepo.getTotalUsers();
            const totalActiveUsers = await this._ahaStatisticsRepo.getTotalActiveUsers();
            const totalDeletedUsers = await this._ahaStatisticsRepo.getTotalDeletedUsers();
            const totalTestUsers = await this._ahaStatisticsRepo.getTotalTestUsers();
            const totalDeletedTestUsers = await this._ahaStatisticsRepo.getTotalDeletedTestUsers();
           
            const totalPersons = await this._ahaStatisticsRepo.getTotalPersons();
            const totalActivePersons = await this._ahaStatisticsRepo.getTotalActivePersons();
            const totalDeletedPersons = await this._ahaStatisticsRepo.getTotalDeletedPersons();
            const totalTestPersons = await this._ahaStatisticsRepo.getTotalTestPersons();
            const totalDeletedTestPersons = await this._ahaStatisticsRepo.getTotalDeletedTestPersons();
           
            const totalCareplanEnrollments = await this._ahaStatisticsRepo.getTotalCareplanEnrollments();
            
            const totalTestUsersForCholesterolCareplan =
            await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.Cholesterol);
            const totalDeletedTestUsersForCholesterolCareplan =
            await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.Cholesterol);
            
            const totalTestUsersForStrokeCareplan = await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(
                CareplanCode.Stroke
            );
            const totalDeletedTestUsersForStrokeCareplan =
            await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.Stroke
            );
            
            const totalCholesterolMiniCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(
                CareplanCode.CholesterolMini
            );
            const totalActiveCholesterolMiniCareplanEnrollments = await this._ahaStatisticsRepo.getTotalActiveEnrollments(
                CareplanCode.CholesterolMini
            );
            const totalDeletedCholesterolMiniCareplanEnrollments = await this._ahaStatisticsRepo.getTotalDeletedEnrollments(
                CareplanCode.CholesterolMini
            );
            const totalTestUsersForCholesterolMiniCareplan =
            await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.CholesterolMini);
            const totalDeletedTestUsersForCholesterolMiniCareplan =
            await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.CholesterolMini);
          
            const totalTestUsersForHeartFailureCareplan =
            await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.HeartFailure);
            const totalDeletedTestUsersForHeartFailureCareplan =
            await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.HeartFailure);
     
            const totalDoctors = await this._ahaStatisticsRepo.getTotalDoctors();
            const totalActiveDoctors = await this._ahaStatisticsRepo.getTotalActiveDoctors();
            const totalDeletedDoctors = await this._ahaStatisticsRepo.getTotalDeletedDoctors();
            const totalTestDoctors = await this._ahaStatisticsRepo.getTotalTestDoctors();
            const totalDeletedTestDoctors = await this._ahaStatisticsRepo.getTotalDeletedTestDoctors();
            
            const usersWithMissingDeviceDetails = await this._ahaStatisticsRepo.getTotalUsersWithMissingDeviceDetail();
            const uniqueUsersInDeviceDetails = await this._ahaStatisticsRepo.getTotalUniqueUsersInDeviceDetail();
     
            const hsUserCount = await this._ahaStatisticsRepo.getAppSpecificTotalUsers(AppName.HS);
            const usersLoggedCountToHSAndHF = await this._ahaStatisticsRepo.getTotalUsersLoggedToHSAndHF();
    
            const patientHealthProfileDataCount = await this._ahaStatisticsRepo.getAppSpecificPatientHealthProfileData(
                AppName.HS
            );
            const hsPatientCount = await this._ahaStatisticsRepo.getAppSpecificTotalPatients(AppName.HS);
            const hsPersonCount = await this._ahaStatisticsRepo.getAppSpecificTotalPerson(AppName.HS);
            const hsDailyAssessmentCount = await this._ahaStatisticsRepo.getAppSpecificDailyAssessmentCount(AppName.HS);
            const hsBodyWeightDataCount = await this._ahaStatisticsRepo.getAppSpecificBodyWeightDataCount(AppName.HS);
            const hsLabRecordCount = await this._ahaStatisticsRepo. getAppSpecificLabRecordCount(AppName.HS);
            const hsCareplanActivityCount = await this._ahaStatisticsRepo.getAppSpecificCareplanActivityCount(AppName.HS);
            const hsMedicationConsumptionCount = await this._ahaStatisticsRepo.getAppSpecificMedicationConsumptionCount(
                AppName.HS
            );
      
            const userAssessmentCount = await this._ahaStatisticsRepo.getUserAssessmentCount();
            
            const userStats = {
                TotalPatientCount             : totalPatientCount,
                TotalActivePatientCount       : totalActivePatientCount,
                TotalDeletedPatients          : totalDeletedPatients,
                TotalTestPatientCount         : totalTestPatientCount,
                TotalDeletedTestPatientCount  : totalDeletedTestPatientCount,
                UsersWithMissingDeviceDetails : usersWithMissingDeviceDetails,
                UniqueUsersInDeviceDetails    : uniqueUsersInDeviceDetails,
                HSUserCount                   : hsUserCount,
                UsersLoggedCountToHSAndHF     : usersLoggedCountToHSAndHF,
                PatientHealthProfileDataCount : patientHealthProfileDataCount,
                HSPatientCount                : hsPatientCount,
                HSPersonCount                 : hsPersonCount,
                HSDailyAssessmentCount        : hsDailyAssessmentCount,
                HSBodyWeightDataCount         : hsBodyWeightDataCount,
                HSLabRecordCount              : hsLabRecordCount,
                HSCareplanActivityCount       : hsCareplanActivityCount,
                HSMedicationConsumptionCount  : hsMedicationConsumptionCount,
                UserAssessmentCount           : userAssessmentCount,
    
                TotalUsers            : totalUsers,
                TotalActiveUsers      : totalActiveUsers,
                TotalDeletedUsers     : totalDeletedUsers,
                TotalTestUsers        : totalTestUsers,
                TotalDeletedTestUsers : totalDeletedTestUsers,
     
                TotalPersons            : totalPersons,
                TotalActivePersons      : totalActivePersons,
                TotalDeletedPersons     : totalDeletedPersons,
                TotalTestPersons        : totalTestPersons,
                TotalDeletedTestPersons : totalDeletedTestPersons,
     
                TotalDoctors            : totalDoctors,
                TotalActiveDoctors      : totalActiveDoctors,
                TotalDeletedDoctors     : totalDeletedDoctors,
                TotalTestDoctors        : totalTestDoctors,
                TotalDeletedTestDoctors : totalDeletedTestDoctors,
             
                TotalCareplanEnrollments                    : totalCareplanEnrollments,
                TotalTestUsersForCholesterolCareplan        : totalTestUsersForCholesterolCareplan,
                TotalDeletedTestUsersForCholesterolCareplan : totalDeletedTestUsersForCholesterolCareplan,
             
                TotalTestUsersForStrokeCareplan        : totalTestUsersForStrokeCareplan,
                TotalDeletedTestUsersForStrokeCareplan : totalDeletedTestUsersForStrokeCareplan,
               
                TotalCholesterolMiniEnrollments                 : totalCholesterolMiniCareplanEnrollments,
                TotalActiveCholesterolMiniEnrollments           : totalActiveCholesterolMiniCareplanEnrollments,
                TotalDeletedCholesterolMiniEnrollments          : totalDeletedCholesterolMiniCareplanEnrollments,
                TotalTestUsersForCholesterolMiniCareplan        : totalTestUsersForCholesterolMiniCareplan,
                TotalDeletedTestUsersForCholesterolMiniCareplan : totalDeletedTestUsersForCholesterolMiniCareplan,
             
                TotalTestUsersForHeartFailureCareplan        : totalTestUsersForHeartFailureCareplan,
                TotalDeletedTestUsersForHeartFailureCareplan : totalDeletedTestUsersForHeartFailureCareplan,
                
            };
            return userStats;
        } catch (error) {
            Logger.instance().log(`Error in creating user statistics:${error.message}`);
        }
    };

    generateAHAStatsReport = async (reportModel: any) => {
        try {
            return await exportAHAStatsReportToPDF(reportModel);
        } catch (error) {
            Logger.instance().log(`Error in creating stats report in pdf :${error.message}`);
        }
    };

    sendStatisticsByEmail = async (filePath: string, fileName: string) => {
        try {
            const { emailService, emailDetails } = await this.getEmailDetails(filePath, fileName);
            await emailService.sendEmail(emailDetails, false);
        } catch (error) {
            Logger.instance().log(`Error in sending stats by email :${error.message}`);
        }
    };

    private getEmailDetails = async (filePath: string, fileName: string) => {
        const emailService = new EmailService();
        // var body = await emailService.getTemplate('AHA.user.stats.template.html');
        var body = 'Hi This is test mail, Dont reply';
        const emailDetails: EmailDetails = {
            EmailTo     : process.env.EMAIL_TO,
            Subject     : `User statistics recent update: ${TimeHelper.getDateString(new Date(),DateStringFormat.YYYY_MM_DD)}`,
            Body        : body,
            Attachments : [
                // {
                //     filename : fileName,
                //     content  : fs.createReadStream(path.join(filePath)),
                // },
            ]
        };
        return { emailService, emailDetails };
    };

    uploadFile = async (sourceLocation: string): Promise<FileResourceDto> => {
        try {
            const filename = path.basename(sourceLocation);
            const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
            const storageKey = `resources/${dateFolder}/${filename}`;
            const fileResourceService = Injector.Container.resolve(FileResourceService);
            return await fileResourceService.uploadLocal(sourceLocation, storageKey, true);
        } catch (error) {
            Logger.instance().log(`Error in uploading pdf :${error.message}`);
        }
        
    };
    
}
