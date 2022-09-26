import fs from 'fs';
import path from "path";
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { Helper } from "../../../common/helper";
import { Logger } from '../../../common/logger';
import { TimeHelper } from '../../../common/time.helper';
import { ConfigurationManager } from "../../../config/configuration.manager";
import {
    AssessmentNodeType,
    CAssessmentListNode,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentPathCondition,
    CAssessmentQueryOption,
    CAssessmentQuestionNode,
    CAssessmentTemplate,
    ConditionCompositionType,
    ConditionOperand,
    ConditionOperandDataType,
    ConditionOperatorType
} from '../../../domain.types/clinical/assessment/assessment.types';
import { FileResourceDto } from '../../../domain.types/general/file.resource/file.resource.dto';
import { DateStringFormat } from '../../../domain.types/miscellaneous/time.types';
import { FileResourceService } from '../../general/file.resource.service';

///////////////////////////////////////////////////////////////////////

export class AssessmentTemplateFileConverter {

    //#region Publics

    public static storeAssessmentTemplate = async (templateObj: CAssessmentTemplate): Promise<FileResourceDto> => {
        const { dateFolder, filename, sourceFileLocation }
            = await AssessmentTemplateFileConverter.storeTemplateToFileLocally(templateObj);
        const storageKey = `resources/${dateFolder}/${filename}`;
        const fileResourceService = Loader.container.resolve(FileResourceService);
        return await fileResourceService.uploadLocal(sourceFileLocation, storageKey, false);
    };

    public static convertToJson = (templateObj: CAssessmentTemplate):any => {
        try {

            var tmpl = {
                DisplayCode            : templateObj.DisplayCode,
                Version                : templateObj.Version,
                Type                   : templateObj.Type,
                Title                  : templateObj.Title,
                Description            : templateObj.Description,
                Provider               : templateObj.Provider,
                ProviderAssessmentCode : templateObj.ProviderAssessmentCode,
                RootNodeDisplayCode    : templateObj.RootNodeDisplayCode,
                Nodes                  : []

            };

            for (var nodeObj of templateObj.Nodes) {
                const node = AssessmentTemplateFileConverter.nodeToJson(nodeObj);
                tmpl.Nodes.push(node);
            }

            return tmpl;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public static convertFromJson = (templateObj: any): CAssessmentTemplate => {
        try {

            var tmpl: CAssessmentTemplate = new CAssessmentTemplate();
            tmpl.DisplayCode            = templateObj.DisplayCode;
            tmpl.Version                = templateObj.Version;
            tmpl.Type                   = templateObj.Type;
            tmpl.Title                  = templateObj.Title;
            tmpl.Description            = templateObj.Description;
            tmpl.Provider               = templateObj.Provider;
            tmpl.ProviderAssessmentCode = templateObj.ProviderAssessmentCode;
            tmpl.RootNodeDisplayCode    = templateObj.RootNodeDisplayCode;
            tmpl.Nodes                  = [];

            for (var nodeObj of templateObj.Nodes) {
                const node = AssessmentTemplateFileConverter.nodeFromJson(tmpl.Nodes, nodeObj);
                tmpl.Nodes.push(node);
            }

            return tmpl;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public static storeTemplateToFileLocally = async (templateObj: CAssessmentTemplate) => {
        const title = templateObj.Title;
        const filename = Helper.strToFilename(title, 'json', '-');
        const tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        const timestamp = TimeHelper.timestamp(new Date());
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const sourceFolder = path.join(tempDownloadFolder, dateFolder, timestamp);
        const sourceFileLocation = path.join(sourceFolder, filename);

        await fs.promises.mkdir(sourceFolder, { recursive: true });

        const jsonObj = AssessmentTemplateFileConverter.convertToJson(templateObj);
        const jsonStr = JSON.stringify(jsonObj, null, 2);
        fs.writeFileSync(sourceFileLocation, jsonStr);
        await Helper.sleep(500);

        return { dateFolder, filename, sourceFileLocation };
    };

    //#endregion

    //#region Privates

    private static nodeToJson(nodeObj: CAssessmentNode) {

        var node = {
            DisplayCode       : nodeObj.DisplayCode,
            NodeType          : nodeObj.NodeType,
            ProviderGivenId   : nodeObj.ProviderGivenId,
            ProviderGivenCode : nodeObj.ProviderGivenCode,
            Title             : nodeObj.Title,
            Description       : nodeObj.Description,
            Sequence          : nodeObj.Sequence,
            Score             : nodeObj.Score,
        };

        if (nodeObj.NodeType === AssessmentNodeType.NodeList) {
            var listNode: CAssessmentListNode = nodeObj as CAssessmentListNode;
            node['ChildrenNodeDisplayCodes'] = listNode.ChildrenNodeDisplayCodes;
        }
        else if (nodeObj.NodeType === AssessmentNodeType.Message) {
            const messageNode = nodeObj as CAssessmentMessageNode;
            node['Message'] = messageNode.Message;
        }
        else {
            //thisNode.NodeType === AssessmentNodeType.Question
            const questionNode = nodeObj as CAssessmentQuestionNode;
            node['QueryResponseType'] = questionNode.QueryResponseType;

            //Add options
            if (questionNode.Options && questionNode.Options.length > 0) {
                const optionObjects: CAssessmentQueryOption[] = questionNode.Options;
                var options = [];
                for (var optionObj of optionObjects) {
                    const option = {
                        DisplayCode       : optionObj.DisplayCode,
                        ProviderGivenCode : optionObj.ProviderGivenCode,
                        Text              : optionObj.Text,
                        ImageUrl          : optionObj.ImageUrl,
                        Sequence          : optionObj.Sequence,
                    };
                    options.push(option);
                }
                node['Options'] = options;
            }

            //Add paths

            if (questionNode.Paths && questionNode.Paths.length > 0) {
                const pathObjects: CAssessmentNodePath[] = questionNode.Paths;
                var paths = [];
                for (var pathObj of pathObjects) {
                    const nodePath = {
                        DisplayCode           : pathObj.DisplayCode,
                        ParentNodeDisplayCode : nodeObj.DisplayCode,
                        NextNodeDisplayCode   : pathObj.NextNodeDisplayCode,
                        IsExitPath            : pathObj.IsExitPath,
                        Condition             : AssessmentTemplateFileConverter.conditionToJson(pathObj.Condition)
                    };
                    paths.push(nodePath);
                }
                node['Paths'] = paths;
            }
        }

        return node;
    }

    private static conditionToJson(conditionObj: CAssessmentPathCondition): any {

        var condition = {
            DisplayCode          : conditionObj.DisplayCode,
            IsCompositeCondition : conditionObj.IsCompositeCondition,
        };

        if (conditionObj.IsCompositeCondition) {
            condition['CompositionType'] = conditionObj.CompositionType;
            var children = [];
            for (var childObj of conditionObj.Children) {
                var child = AssessmentTemplateFileConverter.conditionToJson(childObj);
                children.push(child);
            }
            condition['Children'] = children;
        }
        else if (conditionObj.OperatorType === ConditionOperatorType.None) {
            condition['FirstOperand'] = null;
            condition['SecondOperand'] = null;
            condition['ThirdOperand'] = null;
        }
        else {
            condition['OperatorType'] = conditionObj.OperatorType;
            if (conditionObj.FirstOperand) {
                var firstOperand = {
                    DataType : conditionObj.FirstOperand.DataType,
                    Name     : conditionObj.FirstOperand.Name,
                    Value    : conditionObj.FirstOperand.Value
                };
                condition['FirstOperand'] = firstOperand;
            }
            if (conditionObj.SecondOperand) {
                var secondOperand = {
                    DataType : conditionObj.SecondOperand.DataType,
                    Name     : conditionObj.SecondOperand.Name,
                    Value    : conditionObj.SecondOperand.Value
                };
                condition['SecondOperand'] = secondOperand;
            }
            if (conditionObj.ThirdOperand) {
                var thirdOperand = {
                    DataType : conditionObj.ThirdOperand.DataType,
                    Name     : conditionObj.ThirdOperand.Name,
                    Value    : conditionObj.ThirdOperand.Value
                };
                condition['ThirdOperand'] = thirdOperand;
            }
        }
        return condition;
    }

    private static nodeFromJson(nodes: any[], nodeObj: any): CAssessmentNode {

        if (nodeObj.NodeType === AssessmentNodeType.NodeList) {

            var listNode: CAssessmentListNode = new CAssessmentListNode();

            listNode.DisplayCode                 = nodeObj.DisplayCode;
            listNode.NodeType                    = nodeObj.NodeType;
            listNode.ProviderGivenId             = nodeObj.ProviderGivenId;
            listNode.ProviderGivenCode           = nodeObj.ProviderGivenCode;
            listNode.Title                       = nodeObj.Title;
            listNode.Description                 = nodeObj.Description;
            listNode.Sequence                    = nodeObj.Sequence;
            listNode.Score                       = nodeObj.Score;
            listNode.ChildrenNodeDisplayCodes    = nodeObj.ChildrenNodeDisplayCodes;
            listNode.ServeListNodeChildrenAtOnce = nodeObj.ServeListNodeChildrenAtOnce;

            return listNode;
        }
        else if (nodeObj.NodeType === AssessmentNodeType.Message) {

            var messageNode: CAssessmentMessageNode = new CAssessmentMessageNode();
            messageNode.Message = nodeObj.Message;

            return messageNode;
        }
        else {

            var questionNode: CAssessmentQuestionNode = new CAssessmentQuestionNode();
            questionNode.QueryResponseType = nodeObj.QueryResponseType;

            //Add options

            if (nodeObj.Options && nodeObj.Options.length > 0) {
                var options: CAssessmentQueryOption[] = [];
                for (var optionObj of nodeObj.Options) {
                    var option = new CAssessmentQueryOption();
                    option.DisplayCode       = optionObj.DisplayCode;
                    option.ProviderGivenCode = optionObj.ProviderGivenCode;
                    option.Text              = optionObj.Text;
                    option.ImageUrl          = optionObj.ImageUrl;
                    option.Sequence          = optionObj.Sequence;
                    options.push(option);
                }
                questionNode.Options = options;
            }

            //Add paths

            if (nodeObj.Paths && nodeObj.Paths.length > 0) {
                var paths: CAssessmentNodePath[] = [];
                for (var pathObj of nodeObj.Paths) {
                    var nodePath = new CAssessmentNodePath();
                    nodePath.DisplayCode = pathObj.DisplayCode;
                    nodePath.ParentNodeDisplayCode = nodeObj.DisplayCode;
                    nodePath.NextNodeDisplayCode = pathObj.NextNodeDisplayCode;
                    nodePath.IsExitPath = pathObj.IsExitPath;
                    nodePath.Condition = AssessmentTemplateFileConverter.conditionFromJson(pathObj.Condition);
                    paths.push(nodePath);
                }
                questionNode.Paths = paths;
            }
            return questionNode;
        }
    }

    private static conditionFromJson(conditionObj: any) : CAssessmentPathCondition {

        var condition: CAssessmentPathCondition = new CAssessmentPathCondition();

        condition.DisplayCode          = conditionObj.DisplayCode;
        condition.IsCompositeCondition = conditionObj.IsCompositeCondition;

        if (conditionObj.IsCompositeCondition) {
            condition.CompositionType = conditionObj.CompositionType as ConditionCompositionType;
            var children: CAssessmentPathCondition[] = [];
            for (var childObj of conditionObj.Children) {
                var child = AssessmentTemplateFileConverter.conditionFromJson(childObj);
                children.push(child);
            }
            condition.Children = children;
        }
        else {
            condition.OperatorType = conditionObj.OperatorType as ConditionOperatorType;
            if (conditionObj.FirstOperand) {
                condition.FirstOperand = new ConditionOperand(
                    conditionObj.FirstOperand.DataType as ConditionOperandDataType,
                    conditionObj.FirstOperand.Name,
                    conditionObj.FirstOperand.Value);
            }
            if (conditionObj.SecondOperand) {
                condition.SecondOperand = new ConditionOperand(
                    conditionObj.SecondOperand.DataType as ConditionOperandDataType,
                    conditionObj.SecondOperand.Name,
                    conditionObj.SecondOperand.Value);
            }
            if (conditionObj.ThirdOperand) {
                condition.ThirdOperand = new ConditionOperand(
                    conditionObj.ThirdOperand.DataType as ConditionOperandDataType,
                    conditionObj.ThirdOperand.Name,
                    conditionObj.ThirdOperand.Value);
            }
        }
        return condition;
    }

    //#endregion

}

