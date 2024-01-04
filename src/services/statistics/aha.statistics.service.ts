import { inject, injectable } from "tsyringe";
import { IAhaStatisticsRepo } from "../../database/repository.interfaces/statistics/aha.statistics.repo.interface";
import { AppName, CareplanCode, HealthSystem } from "../../domain.types/statistics/aha/aha.type";
import { PDFGenerator } from "../../modules/reports/pdf.generator";
import fs from 'fs';
import { addBottom, addFooter, addTop } from "../users/patient/statistics/stat.report.commons";
import { TableRowProperties, addTableRow } from "../users/patient/statistics/report.helper";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaStatisticsService {

    constructor(
        @inject('IAhaStatisticsRepo') private _ahaStatisticsRepo: IAhaStatisticsRepo,
    ) {}

    getAhaStatistics = async() => {
        //total patient including test users
        const totalPatientCount =  await this._ahaStatisticsRepo.getTotalPatients();
        //patient count without test users plus excluding soft deleted rows
        const totalActivePatientCount =  await this._ahaStatisticsRepo.getTotalActivePatients();
        //deleted patients
        const totalDeletedPatients = await this._ahaStatisticsRepo.getTotalDeletedPatients();
        // total patient count of test users
        const totalTestPatientCount = await this._ahaStatisticsRepo.getTotalTestPatients();
        // Total patient records - test deleted
        const totalDeletedTestPatientCount = await this._ahaStatisticsRepo.getTotalDeletedTestPatients();
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Total users - including test users
        const totalUsers = await this._ahaStatisticsRepo.getTotalUsers();
        //Total users - excluding test users
        const totalActiveUsers = await this._ahaStatisticsRepo.getTotalActiveUsers();
        const totalDeletedUsers = await this._ahaStatisticsRepo.getTotalDeletedUsers();
        const totalTestUsers = await this._ahaStatisticsRepo.getTotalTestUsers();
        const totalDeletedTestUsers = await this._ahaStatisticsRepo.getTotalDeletedTestUsers();
        /////////////////////////////////////////////////////////////////////////////////////////////////
        const totalPersons = await this._ahaStatisticsRepo.getTotalPersons();
        //Total users - excluding test users
        const totalActivePersons = await this._ahaStatisticsRepo.getTotalActivePersons();
        const totalDeletedPersons = await this._ahaStatisticsRepo.getTotalDeletedPersons();
        const totalTestPersons = await this._ahaStatisticsRepo.getTotalTestPersons();
        const totalDeletedTestPersons = await this._ahaStatisticsRepo.getTotalDeletedTestPersons();
        //////////////////////////////////////////////////////////////////////////////////////////////////
        const totalCareplanEnrollments = await this._ahaStatisticsRepo.getTotalCareplanEnrollments();
        //Including test users
        const totalCholesterolCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalEnrollments(CareplanCode.Cholesterol);
        //excluding test users
        const totalActiveCholesterolCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalActiveEnrollments(CareplanCode.Cholesterol);
        //excluding test users
        const totalDeletedCholesterolCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalDeletedEnrollments(CareplanCode.Cholesterol);
        const totalTestUsersForCholesterolCareplan =
        await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.Cholesterol);
        const totalDeletedTestUsersForCholesterolCareplan =
        await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.Cholesterol);
        /////////////////////////////////////////////////////////////////////////////////
        const totalStrokeCareplanEnrollments = await this._ahaStatisticsRepo.getTotalEnrollments(CareplanCode.Stroke);
        //excluding test users
        const totalActiveStrokeCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalActiveEnrollments(CareplanCode.Stroke);
        //excluding test users
        const totalDeletedStrokeCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalDeletedEnrollments(CareplanCode.Stroke);
        const totalTestUsersForStrokeCareplan =
        await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.Stroke);
        const totalDeletedTestUsersForStrokeCareplan =
        await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.Stroke);
        //////////////////////////////////////////////////////////////////////////////////////////////////
        const totalCholesterolMiniCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalEnrollments(CareplanCode.CholesterolMini);
        //excluding test users
        const totalActiveCholesterolMiniCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalActiveEnrollments(CareplanCode.CholesterolMini);
        //excluding test users
        const totalDeletedCholesterolMiniCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalDeletedEnrollments(CareplanCode.CholesterolMini);
        const totalTestUsersForCholesterolMiniCareplan =
        await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.CholesterolMini);
        const totalDeletedTestUsersForCholesterolMiniCareplan =
        await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.CholesterolMini);
        /////////////////////////////////////////////////////////////////////////////////////////////////
        const totalHeartFailureCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalEnrollments(CareplanCode.HeartFailure);
        const totalActiveHeartFailureCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalActiveEnrollments(CareplanCode.HeartFailure);
        //excluding test users
        const totalDeletedHeartFailureCareplanEnrollments =
        await this._ahaStatisticsRepo.getTotalDeletedEnrollments(CareplanCode.HeartFailure);
        const totalTestUsersForHeartFailureCareplan =
        await this._ahaStatisticsRepo.getTotalTestUsersForCareplanEnrollments(CareplanCode.HeartFailure);
        const totalDeletedTestUsersForHeartFailureCareplan =
        await this._ahaStatisticsRepo.getTotalDeletedTestUsersForCareplanEnrollments(CareplanCode.HeartFailure);
        ////////////////////////////////////////////////////////////////////////////////////////////
        const totalDoctors = await this._ahaStatisticsRepo.getTotalDoctors();
        //Total users - excluding test users
        const totalActiveDoctors = await this._ahaStatisticsRepo.getTotalActiveDoctors();
        const totalDeletedDoctors = await this._ahaStatisticsRepo.getTotalDeletedDoctors();
        const totalTestDoctors = await this._ahaStatisticsRepo.getTotalTestDoctors();
        const totalDeletedTestDoctors = await this._ahaStatisticsRepo.getTotalDeletedTestDoctors();
        
        const usersWithMissingDeviceDetails = await this._ahaStatisticsRepo.getTotalUsersWithMissingDeviceDetail();
        const uniqueUsersInDeviceDetails = await this._ahaStatisticsRepo.getTotalUniqueUsersInDeviceDetail();
        
        ///////////////////////////////////////////////////////////////////////////////////////
        //APP - HS
        const hsUserCount = await this._ahaStatisticsRepo.getAppSpecificTotalUsers(AppName.HS);
        const usersLoggedCountToHSAndHF = await this._ahaStatisticsRepo.getTotalUsersLoggedToHSAndHF();
        // For Heart &amp; Stroke Helper™
        const patientHealthProfileDataCount =
        await this._ahaStatisticsRepo.getAppSpecificpatientHealthProfileData(AppName.HS);
        const hsPatientCount = await this._ahaStatisticsRepo.getAppSpecificTotalPatients(AppName.HS);
        const hsPersonCount = await this._ahaStatisticsRepo.getAppSpecificTotalPerson(AppName.HS);
        const hsDailyAssessmentCount = await this._ahaStatisticsRepo.getAppSpecificDailyAssessmentCount(AppName.HS);
        const hsBodyWeightDataCount = await this._ahaStatisticsRepo.getAppSpecificBodyWeightDataCount(AppName.HS);
        const hsLabRecordCount = await this._ahaStatisticsRepo. getAppSpecificLabRecordCount(AppName.HS);
        const hsCareplanActivityCount = await this._ahaStatisticsRepo.getAppSpecificCareplanActivityCount(AppName.HS);
        const hsMedicationConsumptionCount =
        await this._ahaStatisticsRepo.getAppSpecificMedicationConsumptionCount(AppName.HS);
        
        ////////////////////////////////////////////////////////////////////////////////////////////
        const userEnrollmentForWellstarHealthSystem =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.WellstarHealthSystem);
        const userEnrollmentForUCSanDiegoHealth =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.UCSanDiegoHealth);
        const userEnrollmentForAtriumHealth =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.AtriumHealth);
        const userEnrollmentForMHealthFairview =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.MHealthFairview);
        const userEnrollmentForKaiserPermanente =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.KaiserPermanente);
        const userEnrollmentForNebraskaHealthSystem =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.NebraskaHealthSystem);
        const userEnrollmentForHCAHealthcare =
        await this._ahaStatisticsRepo.getHealthSystemSpecificUserCareplanEnrollmentCount(HealthSystem.HCAHealthcare);
        const userAssessmentCount = await this._ahaStatisticsRepo.getUserAssessmentCount();
        const reportModel = {
            TotalPatientCount                               : totalPatientCount,
            TotalActivePatientCount                         : totalActivePatientCount,
            TotalDeletedPatients                            : totalDeletedPatients,
            TotalTestPatientCount                           : totalTestPatientCount,
            TotalDeletedTestPatientCount                    : totalDeletedTestPatientCount,
            UsersWithMissingDeviceDetails                   : usersWithMissingDeviceDetails,
            UniqueUsersInDeviceDetails                      : uniqueUsersInDeviceDetails,
            HSUserCount                                     : hsUserCount,
            UsersLoggedCountToHSAndHF                       : usersLoggedCountToHSAndHF,
            PatientHealthProfileDataCount                   : patientHealthProfileDataCount,
            HSPatientCount                                  : hsPatientCount,
            HSPersonCount                                   : hsPersonCount,
            HSDailyAssessmentCount                          : hsDailyAssessmentCount,
            HSBodyWeightDataCount                           : hsBodyWeightDataCount,
            HSLabRecordCount                                : hsLabRecordCount,
            HSCareplanActivityCount                         : hsCareplanActivityCount,
            HSMedicationConsumptionCount                    : hsMedicationConsumptionCount,
            UserAssessmentCount                             : userAssessmentCount,
            /////////////////////////////////////////////////////////
            TotalUsers                                      : totalUsers,
            TotalActiveUsers                                : totalActiveUsers,
            TotalDeletedUsers                               : totalDeletedUsers,
            TotalTestUsers                                  : totalTestUsers,
            TotalDeletedTestUsers                           : totalDeletedTestUsers,
            ////////////////////////////////////////////////////////
            TotalPersons                                    : totalPersons,
            TotalActivePersons                              : totalActivePersons,
            TotalDeletedPersons                             : totalDeletedPersons,
            TotalTestPersons                                : totalTestPersons,
            TotalDeletedTestPersons                         : totalDeletedTestPersons,
            ////////////////////////////////////////////////////////
            TotalDoctors                                    : totalDoctors,
            TotalActiveDoctors                              : totalActiveDoctors,
            TotalDeletedDoctors                             : totalDeletedDoctors,
            TotalTestDoctors                                : totalTestDoctors,
            TotalDeletedTestDoctors                         : totalDeletedTestDoctors,
            /////////////////////////////////////////////////////////
            TotalCareplanEnrollments                        : totalCareplanEnrollments,
            TotalCholesterolEnrollments                     : totalCholesterolCareplanEnrollments,
            TotalActiveCholesterolEnrollments               : totalActiveCholesterolCareplanEnrollments,
            TotalDeletedCholesterolEnrollments              : totalDeletedCholesterolCareplanEnrollments,
            TotalTestUsersForCholesterolCareplan            : totalTestUsersForCholesterolCareplan,
            TotalDeletedTestUsersForCholesterolCareplan     : totalDeletedTestUsersForCholesterolCareplan,
            /////////////////////////////////////////////////////////
            TotalStrokeEnrollments                          : totalStrokeCareplanEnrollments,
            TotalActiveStrokeEnrollments                    : totalActiveStrokeCareplanEnrollments,
            TotalDeletedStrokeEnrollments                   : totalDeletedStrokeCareplanEnrollments,
            TotalTestUsersForStrokeCareplan                 : totalTestUsersForStrokeCareplan,
            TotalDeletedTestUsersForStrokeCareplan          : totalDeletedTestUsersForStrokeCareplan,
            ///////////////////////////////////////////////////////
            TotalCholesterolMiniEnrollments                 : totalCholesterolMiniCareplanEnrollments,
            TotalActiveCholesterolMiniEnrollments           : totalActiveCholesterolMiniCareplanEnrollments,
            TotalDeletedCholesterolMiniEnrollments          : totalDeletedCholesterolMiniCareplanEnrollments,
            TotalTestUsersForCholesterolMiniCareplan        : totalTestUsersForCholesterolMiniCareplan,
            TotalDeletedTestUsersForCholesterolMiniCareplan : totalDeletedTestUsersForCholesterolMiniCareplan,
            /////////////////////////////////////////////////////
            TotalHeartFailureEnrollments                    : totalHeartFailureCareplanEnrollments,
            TotalActiveHeartFailureEnrollments              : totalActiveHeartFailureCareplanEnrollments,
            TotalDeletedHeartFailureEnrollments             : totalDeletedHeartFailureCareplanEnrollments,
            TotalTestUsersForHeartFailureCareplan           : totalTestUsersForHeartFailureCareplan,
            TotalDeletedTestUsersForHeartFailureCareplan    : totalDeletedTestUsersForHeartFailureCareplan,
            ///////////////////////////////////////////////////////////////////////////////////////////////
            UserEnrollmentForWellstarHealthSystem           : userEnrollmentForWellstarHealthSystem,
            UserEnrollmentForUCSanDiegoHealth               : userEnrollmentForUCSanDiegoHealth,
            UserEnrollmentForAtriumHealth                   : userEnrollmentForAtriumHealth,
            UserEnrollmentForMHealthFairview                : userEnrollmentForMHealthFairview,
            UserEnrollmentForKaiserPermanente               : userEnrollmentForKaiserPermanente,
            UserEnrollmentForNebraskaHealthSystem           : userEnrollmentForNebraskaHealthSystem,
            UserEnrollmentForHCAHealthcare                  : userEnrollmentForHCAHealthcare
        };
        this.generateReport(reportModel);
        // var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('AHA-weekly-statistics');
        // console.log('absFilepath=',absFilepath);
        // console.log('filename=',filename);
        // var writeStream = fs.createWriteStream(absFilepath);
        // const reportTitle = `Health History`;
        // reportModel.ReportTitle = reportTitle;
        // //reportModel.ChartImagePaths = chartImagePaths;
        // reportModel.Author = 'REAN Foundation';
        // reportModel.TotalPages = 7;
        // reportModel.HeaderImagePath = './assets/images/AHA_header_2.png';
        // reportModel.FooterImagePath = './assets/images/AHA_footer_1.png';
        // var document = PDFGenerator.createDocument('AHA weekly statistics', 'REAN Foundation', writeStream);
        // document.text(JSON.stringify(reportModel),0,15);
        // document.end();
        return reportModel;
        // return {
        //     TotalPatientCount                               : totalPatientCount,
        //     TotalActivePatientCount                         : totalActivePatientCount,
        //     TotalDeletedPatients                            : totalDeletedPatients,
        //     TotalTestPatientCount                           : totalTestPatientCount,
        //     TotalDeletedTestPatientCount                    : totalDeletedTestPatientCount,
        //     UsersWithMissingDeviceDetails                   : usersWithMissingDeviceDetails,
        //     UniqueUsersInDeviceDetails                      : uniqueUsersInDeviceDetails,
        //     HSUserCount                                     : hsUserCount,
        //     UsersLoggedCountToHSAndHF                       : usersLoggedCountToHSAndHF,
        //     PatientHealthProfileDataCount                   : patientHealthProfileDataCount,
        //     HSPatientCount                                  : hsPatientCount,
        //     HSPersonCount                                   : hsPersonCount,
        //     HSDailyAssessmentCount                          : hsDailyAssessmentCount,
        //     HSBodyWeightDataCount                           : hsBodyWeightDataCount,
        //     HSLabRecordCount                                : hsLabRecordCount,
        //     HSCareplanActivityCount                         : hsCareplanActivityCount,
        //     HSMedicationConsumptionCount                    : hsMedicationConsumptionCount,
        //     UserAssessmentCount                             : userAssessmentCount,
        //     /////////////////////////////////////////////////////////
        //     TotalUsers                                      : totalUsers,
        //     TotalActiveUsers                                : totalActiveUsers,
        //     TotalDeletedUsers                               : totalDeletedUsers,
        //     TotalTestUsers                                  : totalTestUsers,
        //     TotalDeletedTestUsers                           : totalDeletedTestUsers,
        //     ////////////////////////////////////////////////////////
        //     TotalPersons                                    : totalPersons,
        //     TotalActivePersons                              : totalActivePersons,
        //     TotalDeletedPersons                             : totalDeletedPersons,
        //     TotalTestPersons                                : totalTestPersons,
        //     TotalDeletedTestPersons                         : totalDeletedTestPersons,
        //     ////////////////////////////////////////////////////////
        //     TotalDoctors                                    : totalDoctors,
        //     TotalActiveDoctors                              : totalActiveDoctors,
        //     TotalDeletedDoctors                             : totalDeletedDoctors,
        //     TotalTestDoctors                                : totalTestDoctors,
        //     TotalDeletedTestDoctors                         : totalDeletedTestDoctors,
        //     /////////////////////////////////////////////////////////
        //     TotalCareplanEnrollments                        : totalCareplanEnrollments,
        //     TotalCholesterolEnrollments                     : totalCholesterolCareplanEnrollments,
        //     TotalActiveCholesterolEnrollments               : totalActiveCholesterolCareplanEnrollments,
        //     TotalDeletedCholesterolEnrollments              : totalDeletedCholesterolCareplanEnrollments,
        //     TotalTestUsersForCholesterolCareplan            : totalTestUsersForCholesterolCareplan,
        //     TotalDeletedTestUsersForCholesterolCareplan     : totalDeletedTestUsersForCholesterolCareplan,
        //     /////////////////////////////////////////////////////////
        //     TotalStrokeEnrollments                          : totalStrokeCareplanEnrollments,
        //     TotalActiveStrokeEnrollments                    : totalActiveStrokeCareplanEnrollments,
        //     TotalDeletedStrokeEnrollments                   : totalDeletedStrokeCareplanEnrollments,
        //     TotalTestUsersForStrokeCareplan                 : totalTestUsersForStrokeCareplan,
        //     TotalDeletedTestUsersForStrokeCareplan          : totalDeletedTestUsersForStrokeCareplan,
        //     ///////////////////////////////////////////////////////
        //     TotalCholesterolMiniEnrollments                 : totalCholesterolMiniCareplanEnrollments,
        //     TotalActiveCholesterolMiniEnrollments           : totalActiveCholesterolMiniCareplanEnrollments,
        //     TotalDeletedCholesterolMiniEnrollments          : totalDeletedCholesterolMiniCareplanEnrollments,
        //     TotalTestUsersForCholesterolMiniCareplan        : totalTestUsersForCholesterolMiniCareplan,
        //     TotalDeletedTestUsersForCholesterolMiniCareplan : totalDeletedTestUsersForCholesterolMiniCareplan,
        //     /////////////////////////////////////////////////////
        //     TotalHeartFailureEnrollments                    : totalHeartFailureCareplanEnrollments,
        //     TotalActiveHeartFailureEnrollments              : totalActiveHeartFailureCareplanEnrollments,
        //     TotalDeletedHeartFailureEnrollments             : totalDeletedHeartFailureCareplanEnrollments,
        //     TotalTestUsersForHeartFailureCareplan           : totalTestUsersForHeartFailureCareplan,
        //     TotalDeletedTestUsersForHeartFailureCareplan    : totalDeletedTestUsersForHeartFailureCareplan,
        // };
    };

    public generateReport = async (reportModel: any) => {
        return await this.generateReportPDF(reportModel);
        // var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('AHA-weekly-statistics');
        // var writeStream = fs.createWriteStream(absFilepath);
        // const reportTitle = `Health History`;
        // reportModel.Author = 'REAN Foundation';
    };

    private generateReportPDF = async (reportModel: any) => {
        return await this.exportReportToPDF(reportModel);
    };

    private exportReportToPDF = async (reportModel: any) => {
        try {
            var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Heart & Stroke statistics');
            var writeStream = fs.createWriteStream(absFilepath);
            const reportTitle = `Heart & Stroke statistics`;
            const options: Intl.DateTimeFormatOptions = {
                day   : '2-digit',
                month : 'long',
                year  : 'numeric',
            };
            const reportDateStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
            reportModel.ReportTitle = reportTitle;
            reportModel.Author = 'REAN Foundation';
            reportModel.TotalPages = 1;
            reportModel.HeaderImagePath = './assets/images/AHA_header_2.png';
            reportModel.FooterImagePath = './assets/images/AHA_footer_1.png';
            reportModel.ReportDateStr = reportDateStr;

            var document = PDFGenerator.createDocument(reportTitle, reportModel.Author, writeStream);
            
            const pageNumber = 1;
            const serialNumber = 1;
            reportModel.TotalPages = 3;
            let pageInfo = this.addSummaryPage(document, reportModel, pageNumber, serialNumber);
            // pageNumber = pageInfo.pageNumber;
            // serialNumber = pageInfo.lastSerialNumber;
            pageInfo = this.continueSummaryPage(document, reportModel, pageInfo.pageNumber, pageInfo.lastSerialNumber);
            // pageNumber = pageInfo.pageNumber;
            // serialNumber = pageInfo.lastSerialNumber;
            pageInfo = this.continueSummaryPage(document, reportModel, pageInfo.pageNumber, pageInfo.lastSerialNumber);
            document.end();
            const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
        } catch (error) {
            throw new Error(`Unable to generate assessment report! ${error.message}`);
        }
    };

    private addSummaryPage = (document, model, pageNumber, serialNumber) => {
        var y = addTop(document, model, null, false);
        // y = addReportMetadata(document, model, y);
        // y = addReportSummary(document, model, y);

        // var clientList = ["HCHLSTRL", "REANPTNT"];
        // if (clientList.indexOf(model.ClientCode) >= 0) {
        //     addHealthJourney(document, model, y);
        // }
        const lastSerialNumber = this.addSummary(model, document, y, pageNumber, serialNumber);
        addBottom(document, pageNumber, model);
        addFooter(document, "https://www.heart.org/", model.FooterImagePath);
        pageNumber += 1;
        return {
            pageNumber,
            lastSerialNumber
        };
    };

    private continueSummaryPage = (document, model, pageNumber, serialNumber) => {
        var y = addTop(document, model, null, true);
        // y = addReportMetadata(document, model, y);
        // y = addReportSummary(document, model, y);

        // var clientList = ["HCHLSTRL", "REANPTNT"];
        // if (clientList.indexOf(model.ClientCode) >= 0) {
        //     addHealthJourney(document, model, y);
        // }
        const lastSerialNumber = this.addSummary(model, document, y, pageNumber, serialNumber);
        addBottom(document, pageNumber, model);
        addFooter(document, "https://www.heart.org/", model.FooterImagePath);
        pageNumber += 1;
        return {
            pageNumber,
            lastSerialNumber
        };
    };

    // private addSummaryPage = (document, model, pageNumber) => {
    //     var y = addTop(document, model, 'Summary over Last 30 Days');
    //     //y = addLabValuesTable(model, document, y);
    //     //y = y + 15;
    //     // addSummaryGraphs(model, document, y);
    //     addBottom(document, pageNumber, model);
    //     addFooter(document, '', model.FooterImagePath);
    //     pageNumber += 1;
    //     return pageNumber;
    // };

    private addSummary = (model, document, y, pageNumber, serialNumber) => {
        let vals = [];
        const { RowData, lastSerialNumber } = this.composeRowsData(model, pageNumber, serialNumber);
        vals = [[true, 'Sr.No', 'Title', 'Count'], ...RowData];
        for (var r of vals) {
            const row: TableRowProperties = {
                IsHeaderRow : r[0],
                FontSize    : 14,
                RowOffset   : 25,
                Columns     : [
                    {
                        XOffset : 50,
                        Text    : r[1]
                    },
                    {
                        XOffset : 170,
                        Text    : r[2]
                    },
                    {
                        XOffset : 500,
                        Text    : r[3]
                    },
                ]
            };
            y = addTableRow(document, y, row);
        }
        return lastSerialNumber;
    };

    private composeRowsData = (model, pageNumber, serialNumber) => {
        const rows = [];
        let sequence = serialNumber;
        if (pageNumber === 1) {
            if ('TotalPatientCount' in model) {
                rows.push([false, sequence, 'Total patient records', model.TotalPatientCount]);
                sequence += 1;
            }
            if ('TotalActivePatientCount' in model) {
                rows.push([false, sequence, 'Total patient records - real active', model.TotalActivePatientCount]);
                sequence += 1;
            }
            if ('TotalDeletedPatients' in model) {
                rows.push([false, sequence, 'Total patient records - real deleted', model.TotalDeletedPatients]);
                sequence += 1;
            }
            if ('TotalTestPatientCount' in model) {
                rows.push([false, sequence, 'Total patient records - test active', model.TotalTestPatientCount]);
                sequence += 1;
            }
            if ('TotalDeletedTestPatientCount' in model) {
                rows.push([false, sequence, 'Total patient records - test deleted', model.TotalDeletedTestPatientCount]);
                sequence += 1;
            }
            if ('TotalUsers' in model) {
                rows.push([false, sequence, 'Total user records', model.TotalUsers]);
                sequence += 1;
            }
            if ('TotalActiveUsers' in model) {
                rows.push([false, sequence, 'Total user - real active', model.TotalActiveUsers]);
                sequence += 1;
            }
            if ('TotalDeletedUsers' in model) {
                rows.push([false, sequence, 'Total user - real deleted', model.TotalDeletedUsers]);
                sequence += 1;
            }
            if ('TotalTestUsers' in model) {
                rows.push([false, sequence, 'Total user - test active', model.TotalTestUsers]);
                sequence += 1;
            }
            if ('TotalDeletedTestUsers' in model) {
                rows.push([false, sequence, 'Total user - test deleted', model.TotalDeletedTestUsers]);
                sequence += 1;
            }
            if ('TotalPersons' in model) {
                rows.push([false, sequence, 'Total person records', model.TotalPersons]);
                sequence += 1;
            }
            if ('TotalActivePersons' in model) {
                rows.push([false, sequence, 'Total person - real active', model.TotalActivePersons]);
                sequence += 1;
            }
            if ('TotalDeletedPersons' in model) {
                rows.push([false, sequence, 'Total person - real deleted', model.TotalDeletedPersons]);
                sequence += 1;
            }
            if ('TotalTestPersons' in model) {
                rows.push([false, sequence, 'Total person - test active', model.TotalTestPersons]);
                sequence += 1;
            }
            if ('TotalDeletedTestPersons' in model) {
                rows.push([false, sequence, 'Total person - test deleted', model.TotalDeletedTestPersons]);
                sequence += 1;
            }
            if ('TotalDoctors' in model) {
                rows.push([false, sequence, 'Total doctors records', model.TotalDoctors]);
                sequence += 1;
            }
            if ('TotalActiveDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - real active', model.TotalActiveDoctors]);
                sequence += 1;
            }
            if ('TotalDeletedDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - real deleted', model.TotalDeletedDoctors]);
                sequence += 1;
            }
            if ('TotalTestDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - test active', model.TotalTestDoctors]);
                sequence += 1;
            }
            if ('TotalDeletedTestDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - test deleted', model.TotalDeletedTestDoctors]);
                sequence += 1;
            }
            if ('TotalPersons' in model) {
                rows.push([false, sequence, 'Total person records', model.TotalPersons]);
                sequence += 1;
            }
            if ('TotalActivePersons' in model) {
                rows.push([false, sequence, 'Total person - real active', model.TotalActivePersons]);
                sequence += 1;
            }
            if ('TotalDeletedPersons' in model) {
                rows.push([false, sequence, 'Total person - real deleted', model.TotalDeletedPersons]);
                sequence += 1;
            }
            if ('TotalTestPersons' in model) {
                rows.push([false, sequence, 'Total person - test active', model.TotalTestPersons]);
                sequence += 1;
            }
        }
        
        if (pageNumber === 2) {
            if ('TotalDeletedTestPersons' in model) {
                rows.push([false, sequence, 'Total person - test deleted', model.TotalDeletedTestPersons]);
                sequence += 1;
            }
            if ('TotalDoctors' in model) {
                rows.push([false, sequence, 'Total doctors records', model.TotalDoctors]);
                sequence += 1;
            }
            if ('TotalActiveDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - real active', model.TotalActiveDoctors]);
                sequence += 1;
            }
            if ('TotalDeletedDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - real deleted', model.TotalDeletedDoctors]);
                sequence += 1;
            }
            if ('TotalTestDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - test active', model.TotalTestDoctors]);
                sequence += 1;
            }
            if ('TotalDeletedTestDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - test deleted', model.TotalDeletedTestDoctors]);
                sequence += 1;
            }
            if ('TotalDeletedTestDoctors' in model) {
                rows.push([false, sequence, 'Total doctors - test deleted', model.TotalDeletedTestDoctors]);
                sequence += 1;
            }
            if ('TotalCareplanEnrollments' in model) {
                rows.push([false, sequence, 'Total careplan enrollments ', model.TotalCareplanEnrollments]);
                sequence += 1;
            }
            if ('TotalCholesterolEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - Cholesterol', model.TotalCholesterolEnrollments]);
                sequence += 1;
            }
            if ('TotalActiveCholesterolEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - Cholesterol - real active', model.TotalActiveCholesterolEnrollments]);
                sequence += 1;
            }
            if ('TotalDeletedCholesterolEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - Cholesterol - real deleted', model.TotalDeletedCholesterolEnrollments]);
                sequence += 1;
            }
            if ('TotalTestUsersForCholesterolCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - Cholesterol - test active', model.TotalTestUsersForCholesterolCareplan]);
                sequence += 1;
            }
            if ('TotalDeletedTestUsersForCholesterolCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - Cholesterol - test deleted', model.TotalDeletedTestUsersForCholesterolCareplan]);
                sequence += 1;
            }
            if ('TotalStrokeEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - Stroke', model.TotalStrokeEnrollments]);
                sequence += 1;
            }
            if ('TotalActiveStrokeEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - Stroke - real active', model.TotalActiveStrokeEnrollments]);
                sequence += 1;
            }
            if ('TotalDeletedStrokeEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - Stroke - real deleted', model.TotalDeletedStrokeEnrollments]);
                sequence += 1;
            }
            if ('TotalTestUsersForStrokeCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - Stroke - test active', model.TotalTestUsersForStrokeCareplan]);
                sequence += 1;
            }
            if ('TotalDeletedTestUsersForStrokeCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - Stroke - test deleted', model.TotalDeletedTestUsersForStrokeCareplan]);
                sequence += 1;
            }
            if ('TotalCholesterolMiniEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - CholesterolMini', model.TotalCholesterolMiniEnrollments]);
                sequence += 1;
            }
            if ('TotalActiveCholesterolMiniEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - CholesterolMini - real active', model.TotalActiveCholesterolMiniEnrollments]);
                sequence += 1;
            }
            if ('TotalDeletedCholesterolMiniEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - CholesterolMini - real deleted', model.TotalDeletedCholesterolMiniEnrollments]);
                sequence += 1;
            }
            if ('TotalTestUsersForCholesterolMiniCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - CholesterolMini - test active', model.TotalTestUsersForCholesterolMiniCareplan]);
                sequence += 1;
            }
            if ('TotalDeletedTestUsersForCholesterolMiniCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - CholesterolMini - test deleted', model.TotalDeletedTestUsersForCholesterolMiniCareplan]);
                sequence += 1;
            }
            if ('TotalHeartFailureEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - HeartFailure', model.TotalHeartFailureEnrollments]);
                sequence += 1;
            }
        }

        if (pageNumber === 3) {
            if ('TotalActiveHeartFailureEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - HeartFailure - real active', model.TotalActiveHeartFailureEnrollments]);
                sequence += 1;
            }
            if ('TotalDeletedHeartFailureEnrollments' in model) {
                rows.push([false, sequence, 'Total enrollments - HeartFailure - real deleted', model.TotalDeletedHeartFailureEnrollments]);
                sequence += 1;
            }
            if ('TotalTestUsersForHeartFailureCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - HeartFailure - test active', model.TotalTestUsersForHeartFailureCareplan]);
                sequence += 1;
            }
            if ('TotalDeletedTestUsersForHeartFailureCareplan' in model) {
                rows.push([false, sequence, 'Total enrollments - HeartFailure - test deleted', model.TotalDeletedTestUsersForHeartFailureCareplan]);
                sequence += 1;
            }
        }
        
        return {
            RowData          : rows,
            lastSerialNumber : serialNumber
        };
    };

    private continueOnNextPage = (document, model, pageNumber) => {
        var y = addTop(document, model, null, true);
        addBottom(document, pageNumber, model);
        addFooter(document, "https://www.heart.org/", model.FooterImagePath);
    };

}
