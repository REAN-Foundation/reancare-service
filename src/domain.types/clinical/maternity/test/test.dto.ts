import { JSONMappingParameters } from "aws-sdk/clients/kinesisanalyticsv2";

export interface TestDto {
    id?          : string;
    PregnancyId  : string;
    TestName     : string;
    Type         : string;
    Impression?  : string;
    Parameters?  : JSON;
    DateOfTest   : Date;
}
