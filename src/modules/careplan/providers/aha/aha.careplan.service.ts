import { ICareplanService } from "../../interfaces/careplan.service.interface";
import needle = require('needle');
import { Logger } from '../../../../common/logger';
import { AhaCache } from './aha.cache';
import { ApiError } from "../../../../common/api.error";
import { injectable } from "tsyringe";
import { EnrollmentDomainModel } from "../../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { Helper } from "../../../../common/helper";
import { CareplanActivity } from "../../../../domain.types/clinical/careplan/activity/careplan.activity";
import { ParticipantDomainModel } from "../../../../domain.types/clinical/careplan/participant/participant.domain.model";
import { ProgressStatus } from "../../../../domain.types/miscellaneous/system.types";
import { UserTaskCategory } from "../../../../domain.types/user/user.task/user.task.types";
import {
    AssessmentType,
    //ConditionCompositionType,
    ConditionOperandDataType,
    ConditionOperatorType,
    SAssessment,
    SAssessmentListNode,
    SAssessmentMessageNode,
    SAssessmentNode,
    SAssessmentNodePath,
    SAssessmentPathCondition,
    SAssessmentQueryOption,
    SAssessmentQuestionNode,
    SAssessmentTemplate,
} from '../../../../domain.types/clinical/assessment/assessment.types';

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaCareplanService implements ICareplanService {

    public providerName(): string {
        return "AHA";
    }

    public init = async (): Promise<boolean> => {
        try {
            var headers = {
                'Content-Type'    : 'application/x-www-form-urlencoded',
                Accept            : '*/*',
                'Cache-Control'   : 'no-cache',
                'Accept-Encoding' : 'gzip, deflate, br',
                Connection        : 'keep-alive',
            };

            var options = {
                headers    : headers,
                compressed : true,
                json       : false,
            };

            var url = process.env.AHA_API_BASE_URL + '/token';

            var body = {
                client_id     : process.env.AHA_CONTINUITY_CLIENT_ID,
                client_secret : process.env.AHA_CONTINUITY_CLIENT_SECRET,
                grant_type    : 'client_credentials',
            };

            var response = await needle('post', url, body, options);
            if (response.statusCode === 200) {
                AhaCache.SetWebToken(response.body.access_token, response.body.expires_in);
                Logger.instance().log(
                    'Successfully connected to AHA API service!' +
                        AhaCache.GetWebToken() +
                        ' Expires On: ' +
                        AhaCache.GetTokenExpirationTime()
                );
                return true;
            } else {
                Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
                return false;
            }
        } catch (error) {
            Logger.instance().log('Error initializing AHA careplan API service.');
        }
    };

    public registerPatient = async (patientDetails: ParticipantDomainModel): Promise<string> => {
        try {
            const entity = {
                PatientUserId  : patientDetails.PatientUserId,
                Name           : patientDetails.Name,
                IsActive       : true,
                Gender         : patientDetails.Gender,
                Age            : patientDetails.Age,
                DOB            : null,
                HeightInInches : null,
                WeightInLbs    : null,
                MaritalStatus  : null,
                ZipCode        : null,
            };

            var meta = {};

            if (entity.Age) {
                meta['age'] = entity.Age;
            }
            if (entity.DOB) {
                meta['dob'] = entity.DOB;
            }
            if (entity.Gender) {
                meta['gender'] = entity.Gender;
            }
            if (entity.HeightInInches) {
                meta['heightInInches'] = entity.HeightInInches;
            }
            if (entity.MaritalStatus) {
                meta['maritalStatus'] = entity.MaritalStatus;
            }
            if (entity.WeightInLbs) {
                meta['weightInLbs'] = entity.WeightInLbs;
            }
            if (entity.ZipCode) {
                meta['zipCode'] = entity.ZipCode;
            }

            var body = {
                isActive : 1,
                meta     : meta,
                userId   : entity.PatientUserId,
            };

            if (entity.Name) {
                body['name'] = entity.Name;
            }

            var url = process.env.AHA_API_BASE_URL + '/participants';

            //Logger.instance().log(`body: ${JSON.stringify(body)}`);

            var response = await needle('post', url, body, this.getHeaderOptions());
            if (response.statusCode !== 200) {
                Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }
            Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);
            return response.body.data.participant.id;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public enrollPatientToCarePlan = async (model: EnrollmentDomainModel): Promise<string> => {
        try {
            var enrollmentData = {
                userId       : model.PatientUserId,
                careplanCode : model.PlanCode,
                startAt      : model.StartDate,
                endAt        : model.EndDate,
                meta         : {
                    gender : model.Gender,
                },
            };

            var url = process.env.AHA_API_BASE_URL + '/enrollments';

            var response = await needle('post', url, enrollmentData, this.getHeaderOptions());

            if (response.statusCode !== 200) {
                Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);

            return response.body.data.enrollment.id;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public fetchActivities = async (
        careplanCode: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date): Promise<CareplanActivity[]> => {
        try {
        
            var startDate = Helper.formatDate(fromDate);
            var endDate = Helper.formatDate(toDate);
    
            Logger.instance().log(`Start Date: ${(startDate)}`);
            Logger.instance().log(`End Date: ${(endDate)}`);
    
            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
            const url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities?fromDate=${startDate}&toDate=${endDate}&pageSize=500`;
            
            var response = await needle("get", url, this.getHeaderOptions());
    
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch tasks for given enrollment id!', response.statusCode, null);
                throw new ApiError(500, "Careplan service error: " + response.body.error.message);
            }
    
            // AHA response has incorrect spelling of activities: "activitites"
            Logger.instance().log(`response body for activities: ${JSON.stringify(response.body.data.activitites.length)}`);

            var activities = response.body.data.activitites;
            var activityEntities: CareplanActivity[] = [];

            activities.forEach(activity => {

                const title = activity.name ? activity.name : (activity.title ? activity.title : '');
                const category: UserTaskCategory = this.getUserTaskCategory(activity.type);
                const status = this.getActivityStatus(activity.status);
                const description = this.getActivityDescription(activity.text, activity.description);

                var entity: CareplanActivity = {
                    EnrollmentId     : enrollmentId,
                    Provider         : this.providerName(),
                    Type             : activity.type,
                    Category         : category,
                    ProviderActionId : activity.code,
                    Title            : title,
                    Description      : description,
                    Url              : activity.url ?? null,
                    Language         : 'English',
                    ScheduledAt      : activity.scheduledAt,
                    Sequence         : activity.sequence,
                    Frequency        : activity.frequency,
                    Status           : status,
                };
                activityEntities.push(entity);
            });

            return activityEntities;
    
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public getActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActionId: string,
        scheduledAt?:string): Promise<CareplanActivity> => {
        try {

            Logger.instance().log(`Fetching activity for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
    
            var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActionId}`;
            if (scheduledAt) {
                url += `?scheduledAt=${scheduledAt}`;
            }
            Logger.instance().log(`URL: ${JSON.stringify(url)}`);
    
            var response = await needle("get", url, this.getHeaderOptions());
    
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch details for given artifact id!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }
    
            Logger.instance().log(`response body for activity details: ${JSON.stringify(response.body.data.activity)}`);
    
            var activity = response.body.data.activity;
            const title = activity.name ? activity.name : (activity.title ? activity.title : '');
            const category: UserTaskCategory = this.getUserTaskCategory(activity.type);
            const status = this.getActivityStatus(activity.status);
            const description = this.getActivityDescription(activity.text, activity.description);
            
            const entity: CareplanActivity = {
                ProviderActionId : activity.code,
                EnrollmentId     : enrollmentId,
                Provider         : 'AHA',
                Type             : activity.type,
                Category         : category,
                Title            : title,
                Description      : description,
                Url              : activity.url ?? null,
                Language         : 'English',
                Status           : status,
                // Comments        : ,
                RawContent       : activity,
            };
    
            return entity;
    
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public updateActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActivityId: string,
        updates: any): Promise<CareplanActivity> => {
        try {

            Logger.instance().log(`Updating activity for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

            var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActivityId}`;

            Logger.instance().log(`URL: ${JSON.stringify(url)}`);

            var updateData = {
                completedAt : Helper.formatDate(updates.completedAt),
                comments    : updates.comments ?? "",
                status      : updates.status,
            };

            var response = await needle("patch", url, updateData, this.getHeaderOptions());

            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch details for given artifact id!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body for activity details: ${JSON.stringify(response.body.data.activity)}`);
            var activity = response.body.data.activity;

            var entity: CareplanActivity = {
                Provider         : this.providerName(),
                Type             : activity.type,
                ProviderActionId : activity.code,
                Title            : activity.title,
                ScheduledAt      : activity.scheduledAt,
                Sequence         : activity.sequence,
                Frequency        : activity.frequency,
                Status           : activity.status,
                CompletedAt      : activity.completedAt,
                Comments         : activity.comments,
            };

            return entity;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public updateBiometricsActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActionId: string,
        updates: any): Promise<CareplanActivity> => {
        try {

            Logger.instance().log(`Fetching activities for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

            var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActionId}`;

            Logger.instance().log(`URL: ${JSON.stringify(url)}`);

            var updateData = {
                completedAt : Helper.formatDate(updates.completedAt),
                comments    : updates.comments ?? "",
                status      : updates.status,
            };

            var response = await needle("patch", url, updateData, this.getHeaderOptions());

            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch details for given artifact id!', response.statusCode, null);
                throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
            }

            Logger.instance().log(`response body for activity details: ${JSON.stringify(response.body.data.activity)}`);
            var activity = response.body.data.activity;

            var entity: CareplanActivity = {
                Provider         : this.providerName(),
                Type             : activity.type,
                ProviderActionId : activity.code,
                Title            : activity.title,
                ScheduledAt      : activity.scheduledAt,
                Sequence         : activity.sequence,
                Frequency        : activity.frequency,
                Status           : activity.status,
                CompletedAt      : activity.completedAt,
                Comments         : activity.comments,
            };

            return entity;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public convertToAssessmentTemplate = async (activity: CareplanActivity): Promise<SAssessmentTemplate> => {

        var template: SAssessmentTemplate = new SAssessmentTemplate();
        template.Type = AssessmentType.Careplan;
        template.ProviderAssessmentCode = activity.ProviderActionId;
        template.Title = activity.Title;
        template.DisplayCode = Helper.generateAlphaDisplayCode('ASTMPL#');
        template.Provider = 'AHA';
        template.Version = '1.0';

        //Root node
        const rootNodeDisplayCode = Helper.generateAlphaDisplayCode('RNODE#');
        template.RootNodeDisplayCode = rootNodeDisplayCode;
        const rootNode = new SAssessmentListNode();
        rootNode.DisplayCode = rootNodeDisplayCode;
        template.Nodes.push(rootNode);

        const items = activity.RawContent.items;

        for (var item of activity.RawContent.items) {

            var str = JSON.stringify(item, null, 2);
            Logger.instance().log(str);

            if (item.type === 'choice' || item.type === 'boolean') { //This is question node
                const node = this.createQuestionNode(item, template, items);
                Logger.instance().log(`Node created: ${node.DisplayCode}`);
            }
        }

        return template;
    }

    public updateAssessment = async (assessment: SAssessment): Promise<boolean> => {
        throw new Error("Method not implemented.");
    }

    private createQuestionNode(item: any, template: SAssessmentTemplate, items: any): SAssessmentQuestionNode {

        var node = new SAssessmentQuestionNode();
        node.Description = item.description;
        node.ProviderGivenId = item.id;
        node.ProviderGivenCode = item.code;
        node.Sequence = item.sequence;
        node.Title = item.title;
        node.DisplayCode = Helper.generateAlphaDisplayCode('QNode#');

        //Set options
        this.addOptionsToQuestionNode(item, node);

        template.Nodes.push(node);

        //Add paths
        this.addPathsToNode(item, node, template, items);

        return node;
    }

    private addPathsToNode(item: any, node: SAssessmentQuestionNode, template: SAssessmentTemplate, items: any) {

        var pathIndex = 0;

        for (var act of item.actions) {

            Logger.instance().log(JSON.stringify(act));

            const actionType = act.action;
            pathIndex++;
            var path = new SAssessmentNodePath();
            path.DisplayCode = node.DisplayCode + ':Path#' + pathIndex.toString();
            this.constructConditionFromRules(act.Rules, path, node);

            if (actionType === 'TriggerQuestion') {
                const nextProviderQuestionId = act.questionId;
                var nextNodeDisplayCode = this.createNextTriggerQuestionNode(
                    template, items, nextProviderQuestionId);
                path.NextNodeDisplayCode = nextNodeDisplayCode;
            }
            else if (actionType === 'MessagePatient') {
                const message = act.message;
                var nextNodeDisplayCode = this.createNextMessageNode(template, message);
                path.NextNodeDisplayCode = nextNodeDisplayCode;
            }
            node.Paths.push(path);
        }
    }

    private createNextMessageNode(template: SAssessmentTemplate, message: string): string {
        const messageNode = new SAssessmentMessageNode();
        messageNode.Message = message;
        messageNode.ProviderGivenCode = null;
        messageNode.ProviderGivenId = null;
        messageNode.DisplayCode = Helper.generateAlphaDisplayCode('MNode#');
        template.Nodes.push(messageNode);
        return messageNode.DisplayCode;
    }

    private addOptionsToQuestionNode(item: any, node: SAssessmentQuestionNode) {
        for (var opt of item.options) {
            var option = new SAssessmentQueryOption();
            option.DisplayCode = node.DisplayCode + ':Option#' + opt.code;
            option.ProviderGivenCode = opt.code;
            option.Text = opt.display;
            option.Sequence = opt.sequence;
            node.Options.push(option);
        }
        return node;
    }

    private constructConditionFromRules(rules: any[], path: SAssessmentNodePath, node: SAssessmentQuestionNode) {

        if (rules.length === 0) {

            var rule = rules[0];
            var condition = new SAssessmentPathCondition();
            condition.IsCompositeCondition = false;
            condition.DisplayCode = path.DisplayCode + ':Condition';

            if (rule.operator === 'equals') {

                condition.OperatorType = ConditionOperatorType.EqualTo;

                condition.FirstOperandName = 'ReceivedAnswer';
                condition.FirstOperandValue = null;
                condition.FirstOperandDataType = ConditionOperandDataType.Integer;

                var optionSequence: number = this.getOptionSequenceForAnswer(node.Options, rule.value);
                condition.SecondOperandName = 'ExpectedAnswer';
                condition.SecondOperandValue = optionSequence;
                condition.SecondOperandDataType = ConditionOperandDataType.Integer;
            }
            else if (rule.operator === 'in') {

                condition.OperatorType = ConditionOperatorType.In;

                condition.FirstOperandName = 'ReceivedAnswer';
                condition.FirstOperandValue = null;
                condition.FirstOperandDataType = ConditionOperandDataType.Integer;

                var arr = this.getOptionSequenceArrayForAnswer(node.Options, rule.value);
                condition.SecondOperandName = 'ExpectedAnswer';
                condition.SecondOperandValue = arr;
                condition.SecondOperandDataType = ConditionOperandDataType.Array;
            }
            path.Condition = condition;
        }
    }

    private createNextTriggerQuestionNode(
        template: SAssessmentTemplate,
        items: any[],
        nextQuestionItemId: string): string {

        if (items.length === 0 || !nextQuestionItemId) {
            return null;
        }
        const questionObject = items.find(x => x.id === nextQuestionItemId);
        if (!questionObject) {
            return null;
        }
        if (questionObject.type !== 'boolean' && questionObject.type !== 'choice') {
            return null;
        }

        var itemId = questionObject.id;
        const existingNode = this.getNodeByProviderItemId(template.Nodes, itemId);
        if (existingNode != null) {
            return existingNode.DisplayCode;
        }

        const node = this.createQuestionNode(questionObject, template, items);
        return node.DisplayCode;
    }

    private getNodeByProviderItemId(nodes: SAssessmentNode[], providerItemId): SAssessmentNode {
        for (var node of nodes) {
            if (node.ProviderGivenId === providerItemId) {
                return node;
            }
        }
        return null;
    }

    //#region Privates

    private getHeaderOptions() {
        var headers = {
            'Content-Type' : 'application/json',
            accept         : 'application/json',
            Authorization  : 'Bearer ' + AhaCache.GetWebToken(),
        };

        var options = {
            headers : headers,
        };

        return options;
    }

    private getActivityStatus(status: string) {
        if (status === "PENDING") {
            return ProgressStatus.Pending;
        }
        else if (status === "COMPLETED") {
            return ProgressStatus.Completed;
        }
        else {
            return ProgressStatus.Unknown;
        }
    }

    private getUserTaskCategory(activityType: string, title?: string): UserTaskCategory {
        
        if (activityType === 'Questionnaire' || activityType === 'Assessment') {
            return UserTaskCategory.Assessment;
        }
        if (activityType === 'Video' ||
            activityType === 'Audio' ||
            activityType === 'Animation' ||
            activityType === 'Link' ||
            activityType === 'Infographic') {
            return UserTaskCategory.Educational;
        }
        if (activityType === 'Message') {
            return UserTaskCategory.Message;
        }
        if (activityType === 'Goal') {
            return UserTaskCategory.Goal;
        }
        if (activityType === 'Challenge') {
            return UserTaskCategory.Challenge;
        }
        if ((activityType === 'Professional' && title === 'Weekely review') ||
            (activityType === 'Professional' && title === 'Week televisit')) {
            return UserTaskCategory.Consultation;
        }
        return UserTaskCategory.Custom;
    }

    private getActivityDescription(text: string, description: string) {
        var desc = '';
        if (text && text.length > 0) {
            desc = text;
            desc += '\n';
        }
        if (description && description.length > 0) {
            desc = description;
            desc += '\n';
        }
        return desc;
    }

    getOptionSequenceForAnswer(options: SAssessmentQueryOption[], value: any): number {
        for (var option of options) {
            if (option.Text === value) {
                return option.Sequence;
            }
        }
        return -1;
    }

    getOptionSequenceArrayForAnswer(options: SAssessmentQueryOption[], valueArray: []): any[] {
        var selectionArray: any[]  = [];
        for (var option of options) {
            for (var val of valueArray) {
                if (option.Text === val) {
                    selectionArray.push(option.Sequence);
                }
            }
        }
        return selectionArray;
    }

    #endregion

}
