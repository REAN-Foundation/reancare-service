import { Logger } from "../../../../../common/logger";
import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { IUserEngagementRepo } from "../../../../repository.interfaces/statistics/user.engagement.repo.interface";
import FoodConsumption from "../../models/wellness/nutrition/food.consumption.model";
import WaterConsumption from "../../models/wellness/nutrition/water.consumption.model";
import NutritionQuestionnaire from "../../models/wellness/nutrition/nutrition.questionnaire.model";
import PhysicalActivity from "../../models/wellness/exercise/physical.activity.model";
import Meditation from "../../models/wellness/exercise/meditation.model";
import Sleep from "../../models/wellness/daily.records/sleep.model";
import StepCount from "../../models/wellness/daily.records/step.count.model";
import UserLearning from "../../models/educational/learning/user.learning.model";
import Chat from "../../models/community/chat/chat.message.model";
import Assessment from "../../models/clinical/assessment/assessment.model";
import CareplanActivity from "../../models/clinical/careplan/careplan.activity.model";
import BloodCholesterol from "../../models/clinical/biometrics/blood.cholesterol.model";
import BloodGlucose from "../../models/clinical/biometrics/blood.glucose.model";
import BloodPressure from "../../models/clinical/biometrics/blood.pressure.model";
import BodyTemperature from "../../models/clinical/biometrics/body.temperature.model";
import BodyWeight from "../../models/clinical/biometrics/body.weight.model";
import Pulse from "../../models/clinical/biometrics/pulse.model";
import HowDoYouFeel from "../../models/clinical/daily.assessment/daily.assessment.model";
import SymptomAssessment from "../../models/clinical/symptom/symptom.assessment.model";
import MedicationConsumption from "../../models/clinical/medication/medication.consumption.model";
import UserTask from "../../models/users/user/user.task.model";
import Notice from "../../models/general/notice/notice.model";
import LabRecord from "../../models/clinical/lab.record/lab.record.model";
import HealthProfile from "../../models/users/patient/health.profile.model";

////////////////////////////////////////////////////////////////////////////////////////////

export class UserEngagementRepo implements IUserEngagementRepo {

    public getUserEngagementStatsByYear = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByQuarter = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByMonth = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByWeek = async (): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsByDateRange = async (from: string, to: string): Promise<any> => {
        return null;
    };

    public getUserEngagementStatsForUser = async (userId: uuid): Promise<any> => {
        return null;
    };

    public recordUserEngagementsForDay = async (): Promise<any> => {
        try {
            await this.recordUserEngagementsForDay_Nutrition();
            await this.recordUserEngagementsForDay_Medication();
            await this.recordUserEngagementsForDay_Careplan();
            await this.recordUserEngagementsForDay_Assessment();
            await this.recordUserEngagementsForDay_Vitals();
            await this.recordUserEngagementsForDay_LabRecords();
            await this.recordUserEngagementsForDay_Symptom();
            await this.recordUserEngagementsForDay_Educational();
            await this.recordUserEngagementsForDay_Chat();
            await this.recordUserEngagementsForDay_Appointment();
            await this.recordUserEngagementsForDay_Task();
            await this.recordUserEngagementsForDay_Goal();
            await this.recordUserEngagementsForDay_Newsfeed();
            await this.recordUserEngagementsForDay_Profile();
            await this.recordUserEngagementsForDay_Notice();
            await this.recordUserEngagementsForDay_Form();
            await this.recordUserEngagementsForDay_Survey();

            //await this.recordUserEngagementsForDay_Overall();
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    //#region Private methods

    private recordUserEngagementsForDay_Nutrition = async () => {
        // try {
        // }
        // catch (error) {
        //     Logger.instance().log(error.message);
        // }
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Medication = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Careplan = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Assessment = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Vitals = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_LabRecords = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Symptom = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Educational = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Chat = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Appointment = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Task = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Goal = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Newsfeed = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Profile = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Notice = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Form = async () => {
        throw new Error("Method not implemented.");
    };

    private recordUserEngagementsForDay_Survey = async () => {
        throw new Error("Method not implemented.");
    };

    // private recordUserEngagementsForDay_Overall = async () => {
    //     try {
    //     }
    //     catch (error) {
    //         Logger.instance().log(error.message);
    //     }
    // };

    //#endregion


}
