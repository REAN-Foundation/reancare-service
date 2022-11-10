
import { inject, injectable } from "tsyringe";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { IFoodConsumptionRepo } from "../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { IDocumentRepo } from "../../../database/repository.interfaces/users/patient/document.repo.interface";
import { IPhysicalActivityRepo } from "../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { IBodyWeightRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { ILabRecordRepo } from "../../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { DocumentRepo } from "../../../database/sql/sequelize/repositories/users/patient/document.repo";
import { Loader } from "../../../startup/loader";
import { LabRecordRepo } from "../../../database/sql/sequelize/repositories/clinical/lab.record/lab.record.repo";
import { AssessmentRepo } from "../../../database/sql/sequelize/repositories/clinical/assessment/assessment.repo";
import { BodyWeightRepo } from "../../../database/sql/sequelize/repositories/clinical/biometrics/body.weight.repo";
import { MedicationConsumptionRepo } from "../../../database/sql/sequelize/repositories/clinical/medication/medication.consumption.repo";
import { MedicationRepo } from "../../../database/sql/sequelize/repositories/clinical/medication/medication.repo";
import { PersonRepo } from "../../../database/sql/sequelize/repositories/person/person.repo";
import { PatientRepo } from "../../../database/sql/sequelize/repositories/users/patient/patient.repo";
import { UserRepo } from "../../../database/sql/sequelize/repositories/users/user/user.repo";
import { PhysicalActivityRepo } from "../../../database/sql/sequelize/repositories/wellness/exercise/physical.activity.repo";
import { FoodConsumptionRepo } from "../../../database/sql/sequelize/repositories/wellness/nutrition/food.consumption.repo";
import { ISleepRepo } from "../../../database/repository.interfaces/wellness/daily.records/sleep.repo.interface";
import { SleepRepo } from "../../../database/sql/sequelize/repositories/wellness/daily.records/sleep.repo";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StatisticsService {

    constructor(
        @inject('IDocumentRepo') private _documentRepo: IDocumentRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('ILabRecordRepo') private _labRecordsRepo: ILabRecordRepo,
        @inject('ISleepRepo') private _sleepRepo: ISleepRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,

    ) {
        this._documentRepo = Loader.container.resolve(DocumentRepo);
        this._patientRepo = Loader.container.resolve(PatientRepo);
        this._userRepo = Loader.container.resolve(UserRepo);
        this._personRepo = Loader.container.resolve(PersonRepo);
        this._foodConsumptionRepo = Loader.container.resolve(FoodConsumptionRepo);
        this._medicationConsumptionRepo = Loader.container.resolve(MedicationConsumptionRepo);
        this._medicationRepo = Loader.container.resolve(MedicationRepo);
        this._physicalActivityRepo = Loader.container.resolve(PhysicalActivityRepo);
        this._bodyWeightRepo = Loader.container.resolve(BodyWeightRepo);
        this._labRecordsRepo = Loader.container.resolve(LabRecordRepo);
        this._sleepRepo = Loader.container.resolve(SleepRepo);
        this._assessmentRepo = Loader.container.resolve(AssessmentRepo);
    }

    public getPatientStats = async (patientUserId: uuid) => {

        //Nutrition
        const nutritionLastWeek = await this._foodConsumptionRepo.getNutritionStatsForLastWeek(patientUserId);
        const nutritionLastMonth = await this._foodConsumptionRepo.getNutritionStatsForLastMonth(patientUserId);
        const nutrition = {
            LastWeek  : nutritionLastWeek,
            LastMonth : nutritionLastMonth,
        };

        //Physical activity
        const exerciseLastWeek = await this._physicalActivityRepo.getPhysicalActivityStatsForLastWeek(patientUserId);
        const exerciseLastMonth = await this._physicalActivityRepo.getPhysicalActivityStatsForLastMonth(patientUserId);
        const physicalActivityTrends = {
            LastWeek  : exerciseLastWeek,
            LastMonth : exerciseLastMonth,
        };

        //Body weight
        const bodyWeightLast3Months = await this._bodyWeightRepo.getBodyWeightStatsForLast3Months(patientUserId);
        const bodyWeightLast6Months = await this._bodyWeightRepo.getBodyWeightStatsForLast6Months(patientUserId);
        const bodyWeightTrends = {
            LastWeek  : bodyWeightLast3Months,
            LastMonth : bodyWeightLast6Months,
        };

        //Lab values
        const labRecordsLastMonth = await this._labRecordsRepo.getLabRecordsForLastMonth(patientUserId);
        const labRecordsLast3Months = await this._labRecordsRepo.getLabRecordsForLast3Months(patientUserId);
        const labRecordsLast6Months = await this._labRecordsRepo.getLabRecordsForLast6Months(patientUserId);
        const labRecords = {
            LastMonth   : labRecordsLastMonth,
            Last3Months : labRecordsLast3Months,
            Last6Months : labRecordsLast6Months,
        };

        //Sleep trend
        const SleepTrendLastWeek = await this._sleepRepo.getSleepStatsForLastWeek(patientUserId);
        const SleepTrendLastMonth = await this._sleepRepo.getSleepStatsForLastMonth(patientUserId);
        const sleepTrend = {
            LastWeek  : SleepTrendLastWeek,
            LastMonth : SleepTrendLastMonth,
        };

        //Medication trends
        const medsLastWeek = await this._medicationConsumptionRepo.getMedicationStats(patientUserId, 7);
        const medsLastMonth = await this._medicationConsumptionRepo.getMedicationStats(patientUserId, 30);
        const medicationTrend = {
            LastWeek  : medsLastWeek,
            LastMonth : medsLastMonth,
        };

        const stats = {
            Nutrition        : nutrition,
            PhysicalActivity : physicalActivityTrends,
            BodyWeight       : bodyWeightTrends,
            LabRecords       : labRecords,
            SleepTrend       : sleepTrend,
            MedicationTrend  : medicationTrend
        };

        return stats;
    }

    public generateReport = async (stats: any) => {
        throw new Error('Method not implemented.');
    }

    //#endregion

}
