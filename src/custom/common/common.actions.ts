import { Loader } from '../../startup/loader';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';
import { AssessmentDomainModel } from '../../domain.types/clinical/assessment/assessment.domain.model';
import { UserTaskDomainModel } from '../../domain.types/users/user.task/user.task.domain.model';
import { UserActionType, UserTaskCategory } from '../../domain.types/users/user.task/user.task.types';
import { Logger } from '../../common/logger';
import { AssessmentTemplateService } from '../../services/clinical/assessment/assessment.template.service';
import { AssessmentService } from '../../services/clinical/assessment/assessment.service';
import { UserTaskService } from '../../services/users/user/user.task.service';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { CustomTaskService } from '../../services/users/user/custom.task.service';
import { CustomTaskDomainModel } from '../../domain.types/users/custom.task/custom.task.domain.model';
import { ApiError } from '../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class CommonActions {

    _customTaskService: CustomTaskService = null;

    _assessmentService: AssessmentService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    constructor() {
        this._customTaskService = Loader.container.resolve(CustomTaskService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
    }

    //#region Public

    public createAssessmentTask = async (
        patientUserId: uuid,
        templateName: string): Promise<any> => {

        const templates = await this._assessmentTemplateService.search({ Title: templateName });
        if (templates.Items.length === 0) {
            return null;
        }
        const template = templates.Items[0];

        const templateId: string = template?.id;
        const assessmentBody : AssessmentDomainModel = {
            PatientUserId        : patientUserId,
            Title                : template?.Title,
            Type                 : template?.Type,
            AssessmentTemplateId : templateId,
            ScoringApplicable    : template.ScoringApplicable ?? false,
            ScheduledDateString  : new Date().toISOString()
                .split('T')[0]
        };

        const assessment = await this._assessmentService.create(assessmentBody);
        const assessmentId = assessment.id;

        var scheduledEndTime = TimeHelper.addDuration(new Date(), 9, DurationType.Day);
        if (templateName === 'Medical Profile Details') {
            scheduledEndTime = TimeHelper.addDuration(new Date(), 6, DurationType.Month);
        }

        const userTaskBody : UserTaskDomainModel = {
            UserId             : patientUserId,
            Task               : templateName,
            Category           : UserTaskCategory.Assessment,
            ActionType         : UserActionType.Careplan,
            ActionId           : assessmentId,
            ScheduledStartTime : new Date(),
            ScheduledEndTime   : scheduledEndTime,
            IsRecurrent        : false
        };

        const userTask = await this._userTaskService.create(userTaskBody);
        Logger.instance().log(`[KCCQTask] Action id for Quality of Life Questionnaire is ${userTask.ActionId}`);

        return userTask.ActionId;
    };

    createCustomTask = async (domainModel: CustomTaskDomainModel) => {
        const customTask = await this._customTaskService.create(domainModel);
        if (customTask == null) {
            throw new ApiError(400, 'Cannot create custom task!');
        }

        const userTaskModel: UserTaskDomainModel = {
            UserId             : customTask.UserId,
            ActionId           : customTask.id,
            ActionType         : UserActionType.Custom,
            Task               : customTask.Task,
            Description        : customTask.Description,
            ScheduledStartTime : customTask.ScheduledStartTime,
            ScheduledEndTime   : customTask.ScheduledEndTime ?? null,
            Category           : customTask.Category,
            Status             : customTask.Status
        };

        var userTask = await this._userTaskService.create(userTaskModel);
        userTask['Action'] = customTask;
        return userTask;
    };

}
