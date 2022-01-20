import {
    AssessmentType,
    //ConditionCompositionType,
    ConditionOperandDataType,
    ConditionOperatorType,
    QueryResponseType,
    //SAssessment,
    SAssessmentListNode,
    SAssessmentMessageNode,
    SAssessmentNode,
    SAssessmentNodePath,
    SAssessmentPathCondition,
    SAssessmentQueryOption,
    SAssessmentQuestionNode,
    SAssessmentTemplate,
} from '../../../../domain.types/clinical/assessment/assessment.types';
//import { Logger } from '../../../../common/logger';
import { Helper } from "../../../../common/helper";
import { CareplanActivity } from "../../../../domain.types/clinical/careplan/activity/careplan.activity";

/////////////////////////////////////////////////////////////////////////////////////////

export class AhaCareplanServiceHelper {

    public convertToAssessmentTemplate = async (activity: CareplanActivity): Promise<SAssessmentTemplate> => {

        var template: SAssessmentTemplate = new SAssessmentTemplate();
        template.Type = AssessmentType.Careplan;
        template.ProviderAssessmentCode = activity.ProviderActionId;
        template.Title = activity.Title;
        template.DisplayCode = Helper.generateDisplayCode('AssessmtTmpl');
        template.Provider = 'AHA';
        template.Version = '1.0';

        //Root node
        const rootNodeDisplayCode = Helper.generateDisplayCode('RNode');
        template.RootNodeDisplayCode = rootNodeDisplayCode;
        const rootNode = new SAssessmentListNode();
        rootNode.DisplayCode = rootNodeDisplayCode;
        rootNode.Title = 'Assessment root node';
        rootNode.ProviderGivenCode = null;
        rootNode.ProviderGivenId = null;
        template.Nodes.push(rootNode);

        const items = activity.RawContent.items;

        for (var item of activity.RawContent.items) {

            //var str = JSON.stringify(item, null, 2);
            //Logger.instance().log(str);

            if (item.type === 'choice' || item.type === 'boolean') { //This is question node
                const node = this.createOptionBasedQuestionNode(item, template, items);
                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);
            } else if (item.type === 'text') {
                const node = this.createQueryBasedQuestionNode(item, template);
                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);
            }
        }

        return template;
    }

    private createOptionBasedQuestionNode(
        item: any, template: SAssessmentTemplate, items: any): SAssessmentQuestionNode {
        //Option based question node has options associated and
        //may have multiple paths connected based on those options
        var node = new SAssessmentQuestionNode();
        node.Description = item.description;
        node.ProviderGivenId = item.id;
        node.ProviderGivenCode = item.code;
        node.Sequence = item.sequence;
        node.Title = item.title;
        node.QueryResponseType = this.getQueryResponseType(item);
        node.DisplayCode = Helper.generateDisplayCode('QNode');

        this.addOptionsToQuestionNode(item, node);
        template.Nodes.push(node);
        this.addPathsToNode(item, node, template, items);

        return node;
    }

    private createQueryBasedQuestionNode(
        item: any, template: SAssessmentTemplate): SAssessmentQuestionNode {
        //Query based question node has no paths and simple text answer is expected
        //and will not have further paths associated.
        var node = new SAssessmentQuestionNode();
        node.Description = item.description;
        node.ProviderGivenId = item.id;
        node.ProviderGivenCode = item.code;
        node.Sequence = item.sequence;
        node.Title = item.title;
        node.QueryResponseType = this.getQueryResponseType(item);
        node.DisplayCode = Helper.generateDisplayCode('QNode');
        template.Nodes.push(node);
        return node;
    }

    private addPathsToNode(item: any, node: SAssessmentQuestionNode, template: SAssessmentTemplate, items: any) {

        if (!item.actions) {
            return;
        }

        var pathIndex = 0;

        for (var act of item.actions) {

            //Logger.instance().log(JSON.stringify(act));

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
        messageNode.DisplayCode = Helper.generateDisplayCode('MNode');
        template.Nodes.push(messageNode);
        return messageNode.DisplayCode;
    }

    private addOptionsToQuestionNode(item: any, node: SAssessmentQuestionNode) {
        for (var opt of item.options) {
            var option = new SAssessmentQueryOption();
            option.DisplayCode = node.DisplayCode + ':Option#' + opt.sequence.toString();
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

        const node = this.createOptionBasedQuestionNode(questionObject, template, items);
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

    private getOptionSequenceForAnswer(options: SAssessmentQueryOption[], value: any): number {
        for (var option of options) {
            if (option.Text === value) {
                return option.Sequence;
            }
        }
        return -1;
    }

    private getOptionSequenceArrayForAnswer(options: SAssessmentQueryOption[], valueArray: []): any[] {
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

    private getQueryResponseType(item: any) : QueryResponseType {
        if (item.type === 'choice') {
            if (item.settings && item.settings.multiple === true) {
                return QueryResponseType.MultiChoiceSelection;
            }
            return QueryResponseType.SingleChoiceSelection;
        }
        if (item.type === 'boolean') {
            return QueryResponseType.SingleChoiceSelection;
        }
        if (item.type === 'text') {
            return QueryResponseType.Text;
        }
        return QueryResponseType.Ok;
    }

}
