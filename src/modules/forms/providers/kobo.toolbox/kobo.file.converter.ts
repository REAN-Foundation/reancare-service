/* eslint-disable @typescript-eslint/no-unused-vars */
import xlsx from 'node-xlsx';
import { Logger } from '../../../../common/logger';
import { Helper } from '../../../../common/helper';
import {
    AssessmentType,
    CAssessmentListNode,
    CAssessmentQuestionNode,
    CAssessmentTemplate,
    QueryResponseType,
    CAssessmentQueryOption,
    CAssessmentMessageNode
} from "../../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from '../../../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

interface KoboOption {
    Sequence : number,
    Name     : string,
    Value    : any
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboFileConverter {

    public readKoboXlsAsTemplate = async (userId: uuid, providerFormId: string, downloadedFilepath: string)
        : Promise<CAssessmentTemplate> => {

        const workSheetsFromBuffer = xlsx.parse(downloadedFilepath);
       
        const surveyData = workSheetsFromBuffer.find(x => x.name === 'survey').data;
        let choices = null;
        if (workSheetsFromBuffer.find(x => x.name === 'choices')) {
            const choicesData = workSheetsFromBuffer.find(x => x.name === 'choices').data;
            choices = this.getChoices(choicesData);
        }
        const settingsData = workSheetsFromBuffer.find(x => x.name === 'settings').data;

        var headerIndices = this.getHeaderIndices(surveyData);

        const formTitle = settingsData[1][0];
        const versDate = settingsData[1][1];
        const tokens = versDate.split(' ');
        const versionNumber = tokens[0];
        const dtStr = tokens[1];
        const dateUpdatedStr = dtStr.replace('(', '').replace(')', '');
        const updatedAt = new Date(dateUpdatedStr);

        var template: CAssessmentTemplate = new CAssessmentTemplate();
        template.Type = AssessmentType.Survey;
        template.ProviderAssessmentCode = providerFormId;
        template.Title = formTitle;
        template.DisplayCode = Helper.generateDisplayCode('AssessmtTmpl');
        template.Provider = 'KoboToolbox';
        template.Version = versionNumber.toString();
        template.UpdatedAt = updatedAt;
        template.CreatedBy = userId;

        //Root node
        const rootNodeDisplayCode = Helper.generateDisplayCode('RNode');
        template.RootNodeDisplayCode = rootNodeDisplayCode;
        const rootNode = new CAssessmentListNode();
        rootNode.DisplayCode = rootNodeDisplayCode;
        rootNode.Title = 'Assessment root node';
        rootNode.ProviderGivenCode = null;
        rootNode.ProviderGivenId = null;
        template.Nodes.push(rootNode);

        this.addQuestions(template, headerIndices, surveyData, choices);

        return template;
    };

    private addQuestions = (template: CAssessmentTemplate, headerIndices, survey: any[], choices) => {

        var numRows = survey.length;
        const questionRowStart = 3;
        const questionRowEnd = numRows - 1;

        const rootNode = template.Nodes
            .find(x => x.DisplayCode === template.RootNodeDisplayCode) as CAssessmentListNode;

        var count = 0;
        for (var i = questionRowStart; i < questionRowEnd; i++) {

            var row = survey[i];

            var type        = row[headerIndices['type']];
            var name        = row[headerIndices['name']];
            var label       = row[headerIndices['label']];
            var hint        = row[headerIndices['hint']];
            var required    = row[headerIndices['required']] === 'true' ? true : false;
            var relevant    = row[headerIndices['relevant']];
            var calculation = row[headerIndices['calculation']];
            
            if (type.startsWith('text') ||
                type.startsWith('date') ||
                type.startsWith('decimal') ||
                type.startsWith('integer') ||
                type.startsWith('geopoint') ||
                type.startsWith('dateTime') ||
                type.startsWith('audio') ||
                type.startsWith('video') ||
                type.startsWith('barcode') ||
                type.startsWith('file') ||
                type.startsWith('image')) {

                const node = this.createQueryBasedQuestionNode(
                    template, count, type, name, label, hint, required, relevant);

                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);

                Logger.instance().log(`node - ${JSON.stringify(node, null, 2)}`);
            }
            else if (type.startsWith('select_one') ||
                     type.startsWith('select_multiple')) {

                const choicesKey = type.split(' ')[1];
                const optionChoices = choices[choicesKey];

                const node = this.createOptionBasedQuestionNode(
                    template, optionChoices, count, type, name, label, hint, required, relevant);

                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);

                Logger.instance().log(`node - ${JSON.stringify(node, null, 2)}`);
            }
            else if (type.startsWith('acknowledge')) {
                const node = this.createMessageNode(template, count, type, name, label, hint, required);
                rootNode.ChildrenNodeDisplayCodes.push(node.DisplayCode);
                Logger.instance().log(`node - ${JSON.stringify(node, null, 2)}`);

            }
            else {
                Logger.instance().log(`KoboToolbox field of type ${type} is not supported!`);
            }
            count++;
        }
    };

    private getHeaderIndices(surveyData: unknown[]) {
        const tmpheaders: string[] = surveyData[0] as string[];
        var headerIndices = {};
        headerIndices['type'] = tmpheaders.findIndex(x => x === 'type');
        headerIndices['name'] = tmpheaders.findIndex(x => x === 'name');
        headerIndices['label'] = tmpheaders.findIndex(x => x === 'label');
        headerIndices['hint'] = tmpheaders.findIndex(x => x === 'hint');
        headerIndices['required'] = tmpheaders.findIndex(x => x === 'required');
        headerIndices['relevant'] = tmpheaders.findIndex(x => x === 'relevant');
        headerIndices['calculation'] = tmpheaders.findIndex(x => x === 'calculation');
        return headerIndices;
    }

    private getChoices(choiceData: unknown[]) {

        const numRows = choiceData.length;
        var choices = {};

        for (var i = 1; i < numRows; i++) {

            const row = choiceData[i];
            const listName: string = row[0];
            const name: string = row[1];
            const value = row[2]; //label

            // eslint-disable-next-line no-prototype-builtins
            if (!choices.hasOwnProperty(listName)) {
                choices[listName] = [];
            }
            const opt: KoboOption = {
                Sequence : choices[listName].length + 1,
                Name     : name,
                Value    : value
            };
            choices[listName].push(opt);
        }
        return choices;
    }

    private createQueryBasedQuestionNode(
        template: CAssessmentTemplate,
        index: number,
        type: string,
        name: string,
        label: string,
        hint: string,
        required: boolean,
        relevant: string): CAssessmentQuestionNode {
        //Query based question node has no paths and simple text answer is expected
        //and will not have further paths associated.
        var node = new CAssessmentQuestionNode();
        node.Required = required;
        node.Description = hint ?? null;
        node.ProviderGivenId = name;
        node.ProviderGivenCode = name;
        node.Sequence = index + 1;
        node.Title = label;
        node.QueryResponseType = this.getQueryResponseType(type);
        node.DisplayCode = Helper.generateDisplayCode('QNode');
        template.Nodes.push(node);
        return node;
    }

    private createOptionBasedQuestionNode(
        template: CAssessmentTemplate,
        choices: any,
        index: number,
        type: string,
        name: string,
        label: string,
        hint: string,
        required: boolean,
        relevant: string): CAssessmentQuestionNode {

        const queryResponseType = this.getQueryResponseType(type);
        var node = new CAssessmentQuestionNode();
        node.Required = required;
        node.Description = hint ?? null;
        node.ProviderGivenId = name;
        node.ProviderGivenCode = name;
        node.Sequence = index + 1;
        node.Title = label;
        node.QueryResponseType = queryResponseType;
        node.DisplayCode = Helper.generateDisplayCode('QNode');

        this.addOptionsToQuestionNode(choices, node);

        template.Nodes.push(node);
        return node;
    }

    private addOptionsToQuestionNode(choices, node: CAssessmentQuestionNode) {
        for (var o of choices) {
            const opt = o as KoboOption;
            var option = new CAssessmentQueryOption();
            option.DisplayCode = node.DisplayCode + ':Option#' + opt.Sequence.toString();
            option.ProviderGivenCode = opt.Name;
            option.Text = opt.Value;
            option.Sequence = opt.Sequence;
            node.Options.push(option);
        }
        return node;
    }

    private createMessageNode(
        template: CAssessmentTemplate,
        index: number,
        type: string,
        name: string,
        label: string,
        hint: string,
        required: boolean): CAssessmentMessageNode {
        const node = new CAssessmentMessageNode();
        node.Title = label;
        node.Message = label;
        node.Description = hint ?? null;
        node.Required = required;
        node.ProviderGivenCode = name;
        node.ProviderGivenId = name;
        node.Sequence = index + 1;
        node.DisplayCode = Helper.generateDisplayCode('MNode');
        template.Nodes.push(node);
        return node;
    }

    private getQueryResponseType(type: string) : QueryResponseType {
        if (type.startsWith('text')) {
            return QueryResponseType.Text;
        }
        else if (type.startsWith('date') || type.startsWith('dateTime')) {
            return QueryResponseType.Date;
        }
        else if (type.startsWith('select_one')) {
            return QueryResponseType.SingleChoiceSelection;
        }
        else if (type.startsWith('select_multiple')) {
            return QueryResponseType.MultiChoiceSelection;
        }
        else if (type.startsWith('decimal')) {
            return QueryResponseType.Float;
        }
        else if (type.startsWith('integer')) {
            return QueryResponseType.Integer;
        }
        else if (
            type.startsWith('audio') ||
            type.startsWith('video') ||
            type.startsWith('barcode') ||
            type.startsWith('file') ||
            type.startsWith('image')) {
            return QueryResponseType.File;
        }
        else if (type.startsWith('geopoint')) {
            return QueryResponseType.Location;
        }
        else if (type.startsWith('acknowledge')) {
            return QueryResponseType.Ok;
        }
        return QueryResponseType.None;
    }

}
