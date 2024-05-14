import { inject, injectable } from "tsyringe";
import { IAhaStatisticsRepo } from "../../../database/repository.interfaces/statistics/aha.statistics.repo.interface";
import { CareplanStats } from "../../../domain.types/statistics/aha/aha.type";
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

    getAhaStatistics = async(tenantId: string): Promise<any> => {
        try {
            const careplanStats: CareplanStats[] = [];
            const listOfCareplans = await this._ahaStatisticsRepo.getListOfCareplan(tenantId);
            for (let i = 0; i < listOfCareplans.length; i++) {
                const totalCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(
                    listOfCareplans[i],
                    tenantId
                );
                const totalActiveCareplanEnrollments = await this._ahaStatisticsRepo.getTotalActiveEnrollments(
                    listOfCareplans[i],
                    tenantId
                );
                const totalDeletedCareplanEnrollments = await this._ahaStatisticsRepo.getTotalDeletedEnrollments(
                    listOfCareplans[i],
                    tenantId
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
                for (let j = 0; j < listOfHealthSystem.length; j++) {
                    const careplanHealthSystem = await this._ahaStatisticsRepo.getHealthSystemEnrollmentCount(
                        listOfCareplans[i],
                        listOfHealthSystem[j],
                        tenantId
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
             
            const totalUsers = await this._ahaStatisticsRepo.getTotalUsers();
            const totalActiveUsers = await this._ahaStatisticsRepo.getTotalActiveUsers();
            const totalDeletedUsers = await this._ahaStatisticsRepo.getTotalDeletedUsers();
                   
            const totalPersons = await this._ahaStatisticsRepo.getTotalPersons();
            const totalActivePersons = await this._ahaStatisticsRepo.getTotalActivePersons();
            const totalDeletedPersons = await this._ahaStatisticsRepo.getTotalDeletedPersons();
            
            const totalDoctors = await this._ahaStatisticsRepo.getTotalDoctors();
            const totalActiveDoctors = await this._ahaStatisticsRepo.getTotalActiveDoctors();
            const totalDeletedDoctors = await this._ahaStatisticsRepo.getTotalDeletedDoctors();
                
            const usersWithMissingDeviceDetails = await this._ahaStatisticsRepo.getTotalUsersWithMissingDeviceDetail();
            const uniqueUsersInDeviceDetails = await this._ahaStatisticsRepo.getTotalUniqueUsersInDeviceDetail();
     
            const userStats = {
                TotalPatientCount             : totalPatientCount,
                TotalActivePatientCount       : totalActivePatientCount,
                TotalDeletedPatients          : totalDeletedPatients,
                UsersWithMissingDeviceDetails : usersWithMissingDeviceDetails,
                UniqueUsersInDeviceDetails    : uniqueUsersInDeviceDetails,
   
                TotalUsers        : totalUsers,
                TotalActiveUsers  : totalActiveUsers,
                TotalDeletedUsers : totalDeletedUsers,
      
                TotalPersons        : totalPersons,
                TotalActivePersons  : totalActivePersons,
                TotalDeletedPersons : totalDeletedPersons,
      
                TotalDoctors        : totalDoctors,
                TotalActiveDoctors  : totalActiveDoctors,
                TotalDeletedDoctors : totalDeletedDoctors,
            };
            return userStats;
        } catch (error) {
            Logger.instance().log(`Error in creating user statistics:${error.message}`);
        }
    };

    getAHATenant = async (): Promise<string> => {
        try {
            return await this._ahaStatisticsRepo.getAhaTenant();
        } catch (error) {
            Logger.instance().log(`Error in retrieving AHA tenant :${error.message}`);
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

    private getEmailDetails = async (_filePath: string, _fileName: string) => {
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
