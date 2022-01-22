/* eslint-disable lines-between-class-members */

import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { BiometricsType } from "../biometrics/biometrics.types";

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

export interface AssessmentBiometrics {
    BiometricValue: number;
    BiometricsType: BiometricsType;
    Unit          : string;
    ProviderCode  : string;
}

export enum QueryResponseType {
    Text                  = 'Text',
    Float                 = 'Float',
    Integer               = 'Integer',
    Boolean               = 'Boolean',
    Object                = 'Object',
    FloatArray            = 'Float Array',
    IntegerArray          = 'Integer Array',
    BooleanArray          = 'Boolean Array',
    ObjectArray           = 'Object Array',
    Biometrics            = 'Biometrics',
    SingleChoiceSelection = 'Single Choice Selection',
    MultiChoiceSelection  = 'Multi Choice Selection',
    File                  = 'File',
    Date                  = 'Date',
    DateTime              = 'DateTime',
    Rating                = 'Rating',
    Location              = 'Location',
    Ok                    = 'Ok', //Acknowledgement
    None                  = 'None', //Not expecting response
}

export const QueryResponseTypeList: QueryResponseType[] = [
    QueryResponseType.Text,
    QueryResponseType.Float,
    QueryResponseType.Integer,
    QueryResponseType.Object,
    QueryResponseType.SingleChoiceSelection,
    QueryResponseType.MultiChoiceSelection,
    QueryResponseType.FloatArray,
    QueryResponseType.IntegerArray,
    QueryResponseType.BooleanArray,
    QueryResponseType.ObjectArray,
    QueryResponseType.Biometrics,
    QueryResponseType.Boolean,
    QueryResponseType.Ok,
    QueryResponseType.None,
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
    ConditionOperatorType.IsFalse,
    ConditionOperatorType.Exists,
];

export enum ConditionCompositionType {
    And = 'And',
    Or  = 'Or',
    XOr = 'XOr',
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

export class SAssessmentTemplate {

    TemplateId?            : uuid;
    DisplayCode?           : string;
    Version?               : string;
    Type                   : AssessmentType;
    Title                  : string;
    Description?           : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;
    FileResourceId?        : uuid; //Assessment template storage file
    RootNodeDisplayCode?   : string;
    Nodes                  : SAssessmentNode[];

    constructor() {
        this.Nodes = [];
    }

    getNodeByDisplayCode(displayCode:string): SAssessmentNode {
        return this.Nodes.find(x => x.DisplayCode === displayCode);
    }

}

export class SAssessment extends SAssessmentTemplate {

    AssessmentId?          : uuid;
    PatientUserId          : uuid;
    EnrollmentId?          : string;
    Status?                : ProgressStatus;
    StartedAt?             : Date;
    FinishedAt?            : Date;
    CurrentNode?           : SAssessmentNode;

}

export class SAssessmentNode {

    id?                 : uuid;
    DisplayCode?        : string;
    ProviderGivenId?    : string;
    ProviderGivenCode?  : string;
    TemplateId          : uuid;
    NodeType            : AssessmentNodeType;
    ParentNodeId?       : uuid;
    Title               : string;
    Description?        : string;
    Sequence?           : number;
    Score               : number;

}

export class SAssessmentListNode extends SAssessmentNode {

    ChildrenNodeDisplayCodes: string[];
    ChildrenNodeIds         : uuid[];
    Children?               : SAssessmentNode[];

    constructor() {
        super();
        this.NodeType = AssessmentNodeType.NodeList;
        this.ChildrenNodeDisplayCodes = [];
        this.ChildrenNodeIds = [];
        this.Children = [];
    }

}

export class SAssessmentQuestionNode extends SAssessmentNode {

    QueryResponseType: QueryResponseType;
    DefaultPathId    : uuid;
    Paths?           : SAssessmentNodePath[];
    Options?         : SAssessmentQueryOption[];
    UserResponse?    : SAssessmentQueryResponse;

    constructor() {
        super();
        this.NodeType = AssessmentNodeType.Question;
        this.QueryResponseType = QueryResponseType.SingleChoiceSelection;
        this.Paths = [];
        this.Options = [];
    }

}

export class SAssessmentMessageNode extends SAssessmentNode {

    Message     : string;
    Acknowledged: boolean;

    constructor() {
        super();
        this.NodeType = AssessmentNodeType.Message;
    }

}

export class SAssessmentNodePath {

    id?                : uuid;
    DisplayCode        : string;
    ParentNodeId       : string;
    NextNodeId         : string;
    NextNodeDisplayCode: string;
    ConditionId        : string;
    Condition          : SAssessmentPathCondition;

}

export class SAssessmentQueryOption {

    id?               : uuid;
    DisplayCode       : string;
    ProviderGivenCode?: string;
    NodeId            : uuid;
    Text              : string;
    ImageUrl          : string;
    Sequence          : number;

}

export class SAssessmentQueryResponse {

    id?                  : uuid;
    NodeId?              : uuid;
    AssessmentId?        : uuid;
    ResponseType         : QueryResponseType;
    IntegerValue?        : number;
    FloatValue?          : number;
    TextValue?           : string;
    BooleanValue?        : boolean;
    ArrayValue?          : number[];
    ObjectValue?         : any;
    SatisfiedConditionId?: uuid;
    ChosenPathId?        : uuid;
    CreatedAt            : Date;

    constructor() {
        this.ResponseType = QueryResponseType.None;
        this.IntegerValue = -1;
        this.FloatValue = -1.0;
        this.BooleanValue = false;
        this.ArrayValue = [];
        this.ObjectValue = null;
    }

}

export class SAssessmentPathCondition {

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
    FirstOperandValue   : string | number | boolean | any[] | null;
    FirstOperandDataType: ConditionOperandDataType;

    SecondOperandName    : string;
    SecondOperandValue   : string | number | boolean | any[] | null;
    SecondOperandDataType: ConditionOperandDataType;

    ThirdOperandName    : string;
    ThirdOperandValue   : string | number | boolean | any[] | null;
    ThirdOperandDataType: ConditionOperandDataType;

    Children: SAssessmentPathCondition[];

    constructor() {
        this.Children = [];
    }

}

//#endregion
