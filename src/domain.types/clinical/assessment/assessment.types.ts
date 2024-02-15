/* eslint-disable lines-between-class-members */

import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { BiometricsType } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { BloodGlucoseDto } from "../biometrics/blood.glucose/blood.glucose.dto";
import { BloodOxygenSaturationDto } from "../biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodPressureDto } from "../biometrics/blood.pressure/blood.pressure.dto";
import { BodyHeightDto } from "../biometrics/body.height/body.height.dto";
import { BodyTemperatureDto } from "../biometrics/body.temperature/body.temperature.dto";
import { BodyWeightDto } from "../biometrics/body.weight/body.weight.dto";
import { PulseDto } from "../biometrics/pulse/pulse.dto";
import { Helper } from "../../../common/helper";

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
    Float                 = 'Float',
    Integer               = 'Integer',
    Boolean               = 'Boolean',
    Object                = 'Object',
    TextArray             = 'Text Array',
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
    Range                 = 'Range',
    Ok                    = 'Ok', //Acknowledgement
    None                  = 'None', //Not expecting response
}

export const QueryResponseTypeList: QueryResponseType[] = [
    QueryResponseType.Text,
    QueryResponseType.Float,
    QueryResponseType.Integer,
    QueryResponseType.Boolean,
    QueryResponseType.Object,
    QueryResponseType.TextArray,
    QueryResponseType.FloatArray,
    QueryResponseType.IntegerArray,
    QueryResponseType.BooleanArray,
    QueryResponseType.ObjectArray,
    QueryResponseType.Biometrics,
    QueryResponseType.SingleChoiceSelection,
    QueryResponseType.MultiChoiceSelection,
    QueryResponseType.File,
    QueryResponseType.Date,
    QueryResponseType.DateTime,
    QueryResponseType.Rating,
    QueryResponseType.Location,
    QueryResponseType.Range,
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
    AssessmentType.DailyUpdate,
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
    None               = 'None',
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
    ConditionOperatorType.None,
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

export class CAssessmentTemplate {

    TemplateId?                  : uuid;
    DisplayCode?                 : string;
    Version?                     : string;
    Type                         : AssessmentType;
    Title                        : string;
    Description?                 : string;
    ServeListNodeChildrenAtOnce? : boolean;
    ProviderAssessmentCode?      : string;
    Provider?                    : string;
    FileResourceId?              : uuid; //Assessment template storage file
    RootNodeDisplayCode?         : string;
    Nodes                        : CAssessmentNode[];
    CreatedAt?                   : Date;
    UpdatedAt?                   : Date;
    CreatedBy?                   : uuid;

    constructor() {
        this.Nodes = [];
    }

    public static getNodeByDisplayCode(nodes: CAssessmentNode[], displayCode:string): CAssessmentNode {
        return nodes.find(x => x.DisplayCode === displayCode);
    }

}

export class CAssessment extends CAssessmentTemplate {

    AssessmentId?          : uuid;
    PatientUserId          : uuid;
    EnrollmentId?          : string;
    Status?                : ProgressStatus;
    StartedAt?             : Date;
    FinishedAt?            : Date;
    CurrentNode?           : CAssessmentNode;

}

export class CAssessmentNode {

    id?                     : uuid;
    DisplayCode?            : string;
    Required                : boolean;
    ProviderGivenId?        : string;
    ProviderGivenCode?      : string;
    TemplateId              : uuid;
    NodeType                : AssessmentNodeType;
    ParentNodeId?           : uuid;
    ParentNodeDisplayCode?  : uuid;
    Title                   : string;
    Description?            : string;
    Hint?                   : string;
    RawData?                   : string;
    Sequence?               : number;
    Score                   : number;
    ChildrenNodeDisplayCodes? : string[];
    ServeListNodeChildrenAtOnce?: boolean;

}

export class CAssessmentListNode extends CAssessmentNode {

    ChildrenNodeDisplayCodes: string[];
    ChildrenNodeIds         : uuid[];
    Children?               : CAssessmentNode[];
    ServeListNodeChildrenAtOnce?: boolean;

    constructor() {
        super();
        this.NodeType = AssessmentNodeType.NodeList;
        this.ChildrenNodeDisplayCodes = [];
        this.ChildrenNodeIds = [];
        this.Children = [];
        this.ServeListNodeChildrenAtOnce = false;
    }

}

export class CAssessmentQuestionNode extends CAssessmentNode {

    QueryResponseType: QueryResponseType;
    DefaultPathId?   : uuid;
    Paths?           : CAssessmentNodePath[];
    Options?         : CAssessmentQueryOption[];
    UserResponse?    : CAssessmentQueryResponse;
    SkipCondition?   : CAssessmentPathCondition;
    ScoringCondition?: CScoringCondition;
    CorrectAnswer?   : string | any;

    constructor() {
        super();
        this.NodeType = AssessmentNodeType.Question;
        this.Required = true;
        this.QueryResponseType = QueryResponseType.SingleChoiceSelection;
        this.Paths = [];
        this.Options = [];
    }

}

export class CAssessmentMessageNode extends CAssessmentNode {

    Message     : string;
    Acknowledged: boolean;

    constructor() {
        super();
        this.NodeType = AssessmentNodeType.Message;
        this.Acknowledged = false;
        this.Message = '';
    }

}

export class CAssessmentNodePath {

    id?                : uuid;
    DisplayCode        : string;
    ParentNodeId       : string;
    ParentNodeDisplayCode?       : string;
    NextNodeId         : string;
    NextNodeDisplayCode: string;
    ConditionId        : string;
    Condition          : CAssessmentPathCondition;
    IsExitPath         : boolean;

    constructor() {
        this.IsExitPath = false;
    }

}

export class CAssessmentQueryOption {

    id?               : uuid;
    DisplayCode       : string;
    ProviderGivenCode?: string;
    NodeId?           : uuid;
    Text              : string;
    ImageUrl?         : string;
    Sequence          : number;

}

export class CAssessmentQueryResponse {

    id?                  : uuid;
    NodeId?              : uuid;
    Node?                : CAssessmentMessageNode | CAssessmentQuestionNode | CAssessmentListNode;
    AssessmentId?        : uuid;
    ResponseType         : QueryResponseType;
    Sequence             : number;
    IntegerValue?        : number;
    FloatValue?          : number;
    TextValue?           : string;
    BooleanValue?        : boolean;
    DateValue?           : Date;
    Url?                 : string;
    ResourceId?          : uuid;
    ArrayValue?          : number[];
    ObjectValue?         : any;
    Additional?          : string;
    SatisfiedConditionId?: uuid;
    ChosenPathId?        : uuid;
    CreatedAt?           : Date;

    constructor() {
        this.ResponseType = QueryResponseType.None;
        this.IntegerValue = -1;
        this.FloatValue = -1.0;
        this.BooleanValue = false;
        this.ArrayValue = [];
        this.ObjectValue = null;
        this.DateValue = null;
        this.Url = null;
        this.ResourceId = null;
    }

}

export class ConditionOperand {

    DataType?: ConditionOperandDataType;
    Name ?   : string | null;
    Value?   : string | number | boolean | any[] | null;

    constructor(
        dataType: ConditionOperandDataType,
        name: string | null,
        value: string | number | boolean | any[] | null) {
        this.DataType = dataType;
        this.Name = name;
        this.Value = value;

        if (Helper.isStr(this.Value) && this.DataType !== ConditionOperandDataType.Text) {
            if (this.DataType === ConditionOperandDataType.Integer) {
                this.Value = parseInt(this.Value as string);
            }
            if (this.DataType === ConditionOperandDataType.Float) {
                this.Value = parseFloat(this.Value as string);
            }
            if (this.DataType === ConditionOperandDataType.Boolean) {
                this.Value = parseInt(this.Value as string);
                if (this.Value === 0) {
                    this.Value = false;
                }
                else {
                    this.Value = true;
                }
            }
            if (this.DataType === ConditionOperandDataType.Array) {
                this.Value = JSON.parse(this.Value as string);
            }
        }
    }

}

export class CAssessmentPathCondition {

    id?        : uuid;
    DisplayCode: string;
    NodeId     : uuid;
    PathId     : uuid;    //Chosen path if the condition satisfies

    //For composition type condition
    IsCompositeCondition?: boolean;
    CompositionType ?    : ConditionCompositionType;
    ParentConditionId?   : uuid;
    OperatorType ?       : ConditionOperatorType;

    FirstOperand?: ConditionOperand;
    SecondOperand?: ConditionOperand;
    ThirdOperand?: ConditionOperand;

    Children: CAssessmentPathCondition[];

    constructor() {
        this.Children = [];
    }

}

export interface BaseQueryAnswer {
    AssessmentId    : uuid;
    NodeId?         : uuid;
    QuestionSequence: number;
    NodeDisplayCode?: string;
    Title?          : string;
    ResponseType    : QueryResponseType;
}

export interface SingleChoiceQueryAnswer extends BaseQueryAnswer {
    ChosenSequence         : number;
    ChosenOption?          : CAssessmentQueryOption;
}

export interface MultipleChoiceQueryAnswer extends BaseQueryAnswer {
    ChosenSequences         : number[];
    ChosenOptions?          : CAssessmentQueryOption[];
}

export interface MessageAnswer extends BaseQueryAnswer {
    Achnowledged : boolean;
}

export interface TextQueryAnswer extends BaseQueryAnswer {
    Text : string;
}
export interface DateQueryAnswer extends BaseQueryAnswer {
    Date : Date;
}

export interface IntegerQueryAnswer extends BaseQueryAnswer {
    Field? : string;
    Value  : number;
}

export interface BooleanQueryAnswer extends BaseQueryAnswer {
    Field? : string;
    Value  : boolean;
}

export interface FloatQueryAnswer extends BaseQueryAnswer {
    Field? : string;
    Value  : number;
}

export interface FileQueryAnswer extends BaseQueryAnswer {
    Field?     : string;
    Filepath?  : string;
    Url?       : string;
    ResourceId?: uuid;
}

export interface AssessmentBiometrics {
    BiometricsType: BiometricsType;
    ProviderCode  : string;
    Value         :
        | BloodGlucoseDto
        | BloodOxygenSaturationDto
        | BloodPressureDto
        | BodyWeightDto
        | BodyHeightDto
        | BodyTemperatureDto
        | PulseDto;
}

export interface BiometricQueryAnswer extends BaseQueryAnswer {
    Values  : AssessmentBiometrics[];
}

export class CScoringCondition {

    id?             : uuid;
    DisplayCode?    : string;
    TemplateId      : uuid;
    NodeId          : uuid;
    ResolutionScore?: number;

    //For composition type condition
    IsCompositeCondition?: boolean;
    CompositionType?    : ConditionCompositionType;
    ParentConditionId?  : string;
    OperatorType?       : ConditionOperatorType;

    FirstOperand? : ConditionOperand;
    SecondOperand?: ConditionOperand;
    ThirdOperand? : ConditionOperand;

    Children?: CScoringCondition[];

    constructor() {
        this.Children = [];
    }

}

//#endregion
