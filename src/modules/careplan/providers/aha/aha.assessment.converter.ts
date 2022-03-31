import {
    AssessmentType,
    ConditionOperandDataType,
    ConditionOperatorType,
    QueryResponseType,
    CAssessmentListNode,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentPathCondition,
    CAssessmentQueryOption,
    CAssessmentQuestionNode,
    CAssessmentTemplate,
} from '../../../../domain.types/clinical/assessment/assessment.types';
import { Helper } from "../../../../common/helper";
import { CareplanActivity } from "../../../../domain.types/clinical/careplan/activity/careplan.activity";

/////////////////////////////////////////////////////////////////////////////////////////

export class AhaAssessmentConverter {

    public convertToAssessmentTemplate = async (activity: CareplanActivity): Promise<CAssessmentTemplate> => {

        var template: CAssessmentTemplate = new CAssessmentTemplate();
        template.Type = AssessmentType.Careplan;
        template.ProviderAssessmentCode = activity.ProviderActionId;
        template.Title = activity.Title;
        template.DisplayCode = Helper.generateDisplayCode('AssessmtTmpl');
        template.Provider = 'AHA';
        template.Version = '1.0';

        //Root node
        const rootNodeDisplayCode = Helper.generateDisplayCode('RNode');
        template.RootNodeDisplayCode = rootNodeDisplayCode;
        const rootNode = new CAssessmentListNode();
        rootNode.DisplayCode = rootNodeDisplayCode;
        rootNode.Title = 'Assessment root node';
        rootNode.ProviderGivenCode = null;
        rootNode.ProviderGivenId = null;
        template.Nodes.push(rootNode);

        const items = activity.RawContent.items;

        for (var item of activity.RawContent.items) {

            if (item.type === 'choice' || item.type === 'boolean') { //This is question node
                const node = this.createOptionBasedQuestionNode(item, template, items);
                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);
            }
            else if (item.type === 'text') {
                const node = this.createQueryBasedQuestionNode(item, template);
                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);
            }
        }

        return template;
    };

    //#region Privates

    private createOptionBasedQuestionNode(
        item: any, template: CAssessmentTemplate, items: any): CAssessmentQuestionNode {
        
        //Option based question node has options associated and
        //may have multiple paths connected based on those options
        var node = new CAssessmentQuestionNode();
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
        item: any, template: CAssessmentTemplate): CAssessmentQuestionNode {
        //Query based question node has no paths and simple text answer is expected
        //and will not have further paths associated.
        var node = new CAssessmentQuestionNode();
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

    private addPathsToNode(item: any, node: CAssessmentQuestionNode, template: CAssessmentTemplate, items: any) {

        if (!item.actions) {
            return;
        }

        var pathIndex = 0;

        for (var act of item.actions) {

            const actionType = act.action;
            pathIndex++;
            var path = new CAssessmentNodePath();
            path.DisplayCode = node.DisplayCode + ':Path#' + pathIndex.toString();
            this.constructConditionFromRules(act.Rules, path, node);

            if (actionType === 'TriggerQuestion') {
                const nextProviderQuestionId = act.questionId;
                path.NextNodeDisplayCode = this.createNextTriggerQuestionNode(
                    template, items, nextProviderQuestionId);
            }
            else if (actionType === 'MessagePatient') {
                const message = act.message;
                path.NextNodeDisplayCode = this.createNextMessageNode(template, message);
            }
            node.Paths.push(path);
        }
    }

    private createNextMessageNode(template: CAssessmentTemplate, message: string): string {
        const messageNode = new CAssessmentMessageNode();
        messageNode.Message = message;
        messageNode.ProviderGivenCode = null;
        messageNode.ProviderGivenId = null;
        messageNode.DisplayCode = Helper.generateDisplayCode('MNode');
        template.Nodes.push(messageNode);
        return messageNode.DisplayCode;
    }

    private addOptionsToQuestionNode(item: any, node: CAssessmentQuestionNode) {
        for (var opt of item.options) {
            var option = new CAssessmentQueryOption();
            option.DisplayCode = node.DisplayCode + ':Option#' + opt.sequence.toString();
            option.ProviderGivenCode = opt.code;
            option.Text = opt.display;
            option.Sequence = opt.sequence;
            node.Options.push(option);
        }
        return node;
    }

    private constructConditionFromRules(rules: any[], path: CAssessmentNodePath, node: CAssessmentQuestionNode) {

        if (rules.length === 0) {

            var rule = rules[0];
            var condition = new CAssessmentPathCondition();
            condition.IsCompositeCondition = false;
            condition.DisplayCode = path.DisplayCode + ':Condition';

            if (rule.operator === 'equals') {

                condition.OperatorType = ConditionOperatorType.EqualTo;

                condition.FirstOperand.Name = 'ReceivedAnswer';
                condition.FirstOperand.Value = null;
                condition.FirstOperand.DataType = ConditionOperandDataType.Integer;

                var optionSequence: number = this.getOptionSequenceForAnswer(node.Options, rule.value);
                condition.SecondOperand.Name = 'ExpectedAnswer';
                condition.SecondOperand.Value = optionSequence;
                condition.SecondOperand.DataType = ConditionOperandDataType.Integer;
            }
            else if (rule.operator === 'in') {

                condition.OperatorType = ConditionOperatorType.In;

                condition.FirstOperand.Name = 'ReceivedAnswer';
                condition.FirstOperand.Value = null;
                condition.FirstOperand.DataType = ConditionOperandDataType.Integer;

                var arr = this.getOptionSequenceArrayForAnswer(node.Options, rule.value);
                condition.SecondOperand.Name = 'ExpectedAnswer';
                condition.SecondOperand.Value = arr;
                condition.SecondOperand.DataType = ConditionOperandDataType.Array;
            }
            path.Condition = condition;
        }
    }

    private createNextTriggerQuestionNode(
        template: CAssessmentTemplate,
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

    private getNodeByProviderItemId(nodes: CAssessmentNode[], providerItemId): CAssessmentNode {
        for (var node of nodes) {
            if (node.ProviderGivenId === providerItemId) {
                return node;
            }
        }
        return null;
    }

    private getOptionSequenceForAnswer(options: CAssessmentQueryOption[], value: any): number {
        for (var option of options) {
            if (option.Text === value) {
                return option.Sequence;
            }
        }
        return -1;
    }

    private getOptionSequenceArrayForAnswer(options: CAssessmentQueryOption[], valueArray: []): any[] {
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

    //#endregion

}
