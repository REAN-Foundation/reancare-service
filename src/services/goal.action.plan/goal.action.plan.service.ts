import { CareplanHandler } from "../../modules/careplan/careplan.handler";
import { inject, injectable } from "tsyringe";
import { IGoalRepo } from "../../database/repository.interfaces/patient/goal.repo.interface";
import { IHealthPriorityRepo } from "../../database/repository.interfaces/health.priority/health.priority.repo.interface";
import { ActionPlanDto } from "../../domain.types/goal.action.plan/goal.action.plan.dto";
import { ActionPlanDomainModel } from "../../domain.types/goal.action.plan/goal.action.plan.domain.model";
import { IActionPlanRepo } from "../../database/repository.interfaces/goal.action.plan/goal.action.plan.repo.interface";
import { IPatientRepo } from "../../database/repository.interfaces/patient/patient.repo.interface";
import { ApiError } from "../../common/api.error";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/user/user.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ActionPlanService {

    _careplanHandler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IGoalRepo') private _goalRepo: IGoalRepo,
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,
        @inject('IActionPlanRepo') private _actionPlanRepo: IActionPlanRepo,

    ) {}

    create = async (model: ActionPlanDomainModel): Promise<ActionPlanDto> => {
        return await this._actionPlanRepo.create(model);
    };

    getSelectedActionPlans = async (model: ActionPlanDomainModel): Promise<ActionPlanDto[]> => {

        var patient = await this.getPatient(model.PatientUserId);
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        var actionPlans = await this._actionPlanRepo.getAll(model);

        if (!actionPlans) {
            throw new ApiError(500, 'Error while fetching action plans for given patient');
        }

        return actionPlans;
    };
    
    getActionPlans = async (model: ActionPlanDomainModel): Promise<ActionPlanDto[]> => {
        var goal =  await this._goalRepo.getById(model.GoalId);
        var priority = await this._healthPriorityRepo.getById(goal.HealthPriorityId);

        var actionPlans =  await this._careplanHandler.getActionPlans(priority.PatientUserId,
            priority.ProviderEnrollmentId,
            priority.Provider,priority.HealthPriorityType);

        const actionPlanModels = actionPlans.map(x => {
            var a: ActionPlanDomainModel = {
                PatientUserId        : priority.PatientUserId,
                ProviderEnrollmentId : priority.ProviderEnrollmentId,
                Provider             : priority.Provider,
                ProviderCareplanName : priority.ProviderCareplanName,
                ProviderCareplanCode : priority.ProviderCareplanCode,
                GoalId               : goal.id,
                Title                : x.Title,
            };
            return a;
        });

        return actionPlanModels;
    };

    private async getPatient(patientUserId: uuid) {

        var patientDto = await this._patientRepo.getByUserId(patientUserId);

        var user = await this._userRepo.getById(patientDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        patientDto.User = user;
        return patientDto;
    }

}
