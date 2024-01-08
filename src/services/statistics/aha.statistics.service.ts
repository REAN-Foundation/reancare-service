import { inject, injectable } from "tsyringe";
import { IAhaStatisticsRepo } from "../../database/repository.interfaces/statistics/aha.statistics.repo.interface";
import { AppName, CareplanCode, HealthSystem } from "../../domain.types/statistics/aha/aha.type";
import { generateAhaStatsReport } from './aha.pdf';
import { Logger } from "../../common/logger";
import { FileResourceDto } from "../../domain.types/general/file.resource/file.resource.dto";
import path from "path";
import { TimeHelper } from "../../common/time.helper";
import { DateStringFormat } from "../../domain.types/miscellaneous/time.types";
import { Loader } from "../../startup/loader";
import { FileResourceService } from "../general/file.resource.service";
import { EmailService } from "../../modules/communication/email/email.service";
import { EmailDetails } from "../../modules/communication/email/email.details";
import fs from 'fs';
////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaStatisticsService {

    constructor(
        @inject('IAhaStatisticsRepo') private _ahaStatisticsRepo: IAhaStatisticsRepo,
    ) {}

    getAhaStatistics = async(): Promise<any> => {
        try {
            const totalCholesterolCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(
                CareplanCode.Cholesterol
            );
            const totalActiveCholesterolCareplanEnrollments = await this._ahaStatisticsRepo.getTotalActiveEnrollments(
                CareplanCode.Cholesterol
            );
            const totalDeletedCholesterolCareplanEnrollments = await this._ahaStatisticsRepo.getTotalDeletedEnrollments(
                CareplanCode.Cholesterol
            );
            
            const totalStrokeCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(CareplanCode.Stroke);
            const totalActiveStrokeCareplanEnrollments = await this._ahaStatisticsRepo.getTotalActiveEnrollments(
                CareplanCode.Stroke
            );
            const totalDeletedStrokeCareplanEnrollments = await this._ahaStatisticsRepo.getTotalDeletedEnrollments(
                CareplanCode.Stroke
            );
          
            const totalHeartFailureCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(
                CareplanCode.HeartFailure
            );
            const totalActiveHeartFailureCareplanEnrollments = await this._ahaStatisticsRepo.getTotalActiveEnrollments(
                CareplanCode.HeartFailure
            );
            const totalDeletedHeartFailureCareplanEnrollments = await this._ahaStatisticsRepo.getTotalDeletedEnrollments(
                CareplanCode.HeartFailure
            );
      
            const cholesterolWellstarHealthSystem = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Cholesterol, HealthSystem.WellstarHealthSystem
            );
    
            const cholesterolUCSanDiegoHealth = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Cholesterol, HealthSystem.UCSanDiegoHealth
            );
    
            const cholesterolAtriumHealth = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Cholesterol, HealthSystem.AtriumHealth
            );
    
            const cholesterolMHealthFairview = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Cholesterol, HealthSystem.MHealthFairview
            );
    
            const cholesterolKaiserPermanente = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Cholesterol, HealthSystem.KaiserPermanente
            );
    
            const cholesterolNebraskaHealthSystem = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Cholesterol, HealthSystem.NebraskaHealthSystem
            );
    
            const strokeForHCAHealthcare = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                CareplanCode.Stroke, HealthSystem.HCAHealthcare
            );
    
            const ahaStats = {
                TotalCholesterolEnrollments        : totalCholesterolCareplanEnrollments,
                TotalActiveCholesterolEnrollments  : totalActiveCholesterolCareplanEnrollments,
                TotalDeletedCholesterolEnrollments : totalDeletedCholesterolCareplanEnrollments,
             
                TotalStrokeEnrollments        : totalStrokeCareplanEnrollments,
                TotalActiveStrokeEnrollments  : totalActiveStrokeCareplanEnrollments,
                TotalDeletedStrokeEnrollments : totalDeletedStrokeCareplanEnrollments,
              
                TotalHeartFailureEnrollments        : totalHeartFailureCareplanEnrollments,
                TotalActiveHeartFailureEnrollments  : totalActiveHeartFailureCareplanEnrollments,
                TotalDeletedHeartFailureEnrollments : totalDeletedHeartFailureCareplanEnrollments,
     
                CholesterolWellstarHealthSystem       : cholesterolWellstarHealthSystem,
                UserEnrollmentForUCSanDiegoHealth     : cholesterolUCSanDiegoHealth,
                UserEnrollmentForAtriumHealth         : cholesterolAtriumHealth,
                UserEnrollmentForMHealthFairview      : cholesterolMHealthFairview,
                UserEnrollmentForKaiserPermanente     : cholesterolKaiserPermanente,
                UserEnrollmentForNebraskaHealthSystem : cholesterolNebraskaHealthSystem,
                UserEnrollmentForHCAHealthcare        : strokeForHCAHealthcare
            };
            const pdfModel = await generateAhaStatsReport(ahaStats);
            await this.sendStatisticsByEmail(pdfModel.absFilepath, pdfModel.filename);
            const fileDto = await this.uploadFile(pdfModel.absFilepath);
            return {
                AhaStatistics : ahaStats,
                ResourceId    : fileDto.id ?? null
            };
        } catch (error) {
            Logger.instance().log(`Error in creating AHA statistics:${error.message}`);
            return {
                AhaStatistics : null,
                ResourceId    : null
            };
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

    private sendStatisticsByEmail = async (filePath: string, fileName: string) => {
        const { emailService, emailDetails } = await this.getEmailDetails(filePath, fileName);
        await emailService.sendEmail(emailDetails, false);
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
                {
                    filename : 'My File name.pdf',
                    content  : fs.createReadStream(path.join('C:\\Users\\91920\\Documents\\demo.pdf')),
                },
                // {
                //     filename : fileName,
                //     content  : fs.createReadStream(path.join(filePath)),
                // },
            ]
        };
        return { emailService, emailDetails };
    };

    private uploadFile = async (sourceLocation: string): Promise<FileResourceDto> => {
        const filename = path.basename(sourceLocation);
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const storageKey = `resources/${dateFolder}/${filename}`;
        const fileResourceService = Loader.container.resolve(FileResourceService);
        return await fileResourceService.uploadLocal(sourceLocation, storageKey, true);
    };
    
}
