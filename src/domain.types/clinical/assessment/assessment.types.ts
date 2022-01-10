
import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";

//#region Enums

export enum AssessmentNodeType {
    Message  = 'Message',
    Question = 'Question',
    NodeList = 'Node list',
}

export const AssessmentNodeTypeList: AssessmentNodeType[] = [
    AssessmentNodeType.Message,
    AssessmentNodeType.Question, //This is decision node
    AssessmentNodeType.NodeList,
];

export enum QueryResponseType {
    Text                  = 'Text',
    FloatValue            = 'Float value',
    IntegerValue          = 'Integer value',
    SingleChoiceSelection = 'Single Choice Selection',
    MultiChoiceSelection  = 'Multi Choice Selection',
    Boolean               = 'Boolean',
    Ok                    = 'Ok',
    None                  = 'None',
}

export const QueryResponseTypeList: QueryResponseType[] = [
    QueryResponseType.Text,
    QueryResponseType.FloatValue,
    QueryResponseType.IntegerValue,
    QueryResponseType.SingleChoiceSelection,
    QueryResponseType.MultiChoiceSelection,
];

export enum AssessmentType {
    DailyUpdate = 'Daily update',
    Careplan    = 'Careplan',
    Symptom     = 'Symptoms',
    Survey      = 'Survey',
    Protocol    = 'Protocol',
    Custom      = 'Custom',
}

export const AssessmentTypeList: AssessmentType[] = [
    AssessmentType.Careplan,
    AssessmentType.Symptom,
    AssessmentType.Survey,
    AssessmentType.Protocol,
    AssessmentType.Custom
];

export enum ConditionOperatorType {
    EqualTo            = 'Equal to',
    NotEqualTo         = 'Not equal to',
    GreaterThan        = 'Greater than',
    GreaterThanEqualTo = 'Greater than or equal to',
    LessThan           = 'Less than',
    LessThanEqualTo    = 'Less than or equal to',
    In                 = 'In',
    Between            = 'Between',
    IsTrue             = 'Is true',
    IsFalse            = 'Is false',
    Exists             = 'Exists',
}

export const ConditionOperatorTypeList: ConditionOperatorType[] = [
    ConditionOperatorType.EqualTo,
    ConditionOperatorType.NotEqualTo,
    ConditionOperatorType.GreaterThan,
    ConditionOperatorType.GreaterThanEqualTo,
    ConditionOperatorType.LessThan,
    ConditionOperatorType.LessThanEqualTo,
    ConditionOperatorType.In,
    ConditionOperatorType.Between,
    ConditionOperatorType.IsTrue,
    ConditionOperatorType.IsFalse
];

export enum ConditionCompositionType {
    And = 'And',
    Or  = 'Or',
}

export const ConditionCompositionTypeList: ConditionCompositionType[] = [
    ConditionCompositionType.And,
    ConditionCompositionType.Or,
];

export enum ConditionOperandDataType {
    Float   = 'Float',
    Integer = 'Integer',
    Boolean = 'Boolean',
    Text    = 'Text',
    Array   = 'Array',
}

export const ConditionOperandDataTypeList: ConditionOperandDataType[] = [
    ConditionOperandDataType.Float,
    ConditionOperandDataType.Integer,
    ConditionOperandDataType.Boolean,
    ConditionOperandDataType.Text,
    ConditionOperandDataType.Array,
];

//#endregion

//#region Interfaces

export interface SAssessmentTemplate {
    TemplateId?            : uuid;
    DisplayCode?           : string;
    Version?               : string;
    Type                   : AssessmentType;
    Title                  : string;
    Description?           : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;
    FileResourceId?        : uuid; //assessment template storage file
    RootNode               : SAssessmentNode;
}

export interface SAssessment extends SAssessmentTemplate {
    AssessmentId?          : uuid;
    PatientUserId          : uuid;
    EnrollmentId?          : string;
    Status?                : ProgressStatus;
    StartedAt?             : Date;
    FinishedAt?            : Date;
    CurrentNode?           : SAssessmentNode;
}

export interface SAssessmentNode {
    id?                 : uuid;
    DisplayCode?        : string;
    TemplateId          : uuid;
    NodeType            : AssessmentNodeType;
    ParentNodeId?       : uuid;
    Title               : string;
    Description?        : string;
    Sequence?           : number;
    Score               : number;
}

export interface SAssessmentListNode extends SAssessmentNode {
    ChildrenNodes : SAssessmentNode[];
}

export interface SAssessmentQuestionNode extends SAssessmentNode {
    QueryResponseType: QueryResponseType;
    DefaultPathId    : uuid;
    Paths            : SAssessmentNodePath[];
    Options          : SAssessmentQueryOption[];
    UserResponse?    : SAssessmentQuestionResponse;
}

export interface SAssessmentMessageNode extends SAssessmentNode {
    Message     : string;
    Acknowledged: boolean;
}

export interface SAssessmentNodePath {
    id?         : uuid;
    DisplayCode : string;
    ParentNodeId: string;
    NextNodeId  : string;
    ConditionId : string;
    Condition   : SAssessmentPathCondition;
}

export interface SAssessmentQueryOption {
    id?        : uuid;
    DisplayCode: string;
    NodeId     : uuid;
    Text       : string;
    ImageUrl   : string;
    Sequence   : number;
}

export interface SAssessmentQuestionResponse {
    id?                  : uuid;
    NodeId?              : uuid;
    AssessmentId?        : uuid;
    ResponseType         : QueryResponseType;
    IntegerValue         : number;
    FloatValue           : number;
    TextValue            : string;
    SatisfiedConditionId?: uuid;
    ChosenPathId?        : uuid;
    CreatedAt            : Date;
}

export interface SAssessmentPathCondition {
    id?        : uuid;
    DisplayCode: string;
    NodeId     : uuid;
    PathId     : uuid;    //Chosen path if the condition satisfies

    //For composition type condition
    IsCompositeCondition: boolean;
    CompositionType     : ConditionCompositionType;
    ParentConditionId   : uuid;
    OperatorType        : ConditionOperatorType;

    FirstOperandName    : string;
    FirstOperandValue   : string;
    FirstOperandDataType: ConditionOperandDataType;

    SecondOperandName    : string;
    SecondOperandValue   : string;
    SecondOperandDataType: ConditionOperandDataType;

    ThirdOperandName    : string;
    ThirdOperandValue   : string;
    ThirdOperandDataType: ConditionOperandDataType;
}

//#endregion
