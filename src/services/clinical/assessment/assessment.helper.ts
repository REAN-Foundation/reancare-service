import { Roles } from '../../../domain.types/role/role.types';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentQueryDto } from '../../../domain.types/clinical/assessment/assessment.query.dto';
import {
    AssessmentNodeType, QueryResponseType,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentQuestionNode } from '../../../domain.types/clinical/assessment/assessment.types';

//////////////////////////////////////////////////////////////////////////////////////////////

export class AssessmentHelperService {

    public static questionNodeAsQueryDto(node: CAssessmentNode, assessment: AssessmentDto) {
        const questionNode = node as CAssessmentQuestionNode;
        const query: AssessmentQueryDto = {
            id                   : questionNode.id,
            DisplayCode          : questionNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : questionNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : questionNode.Sequence,
            NodeType             : questionNode.NodeType as AssessmentNodeType,
            Title                : questionNode.Title,
            Description          : questionNode.Description,
            ExpectedResponseType : questionNode.QueryResponseType as QueryResponseType,
            Options              : questionNode.Options,
            ProviderGivenCode    : questionNode.ProviderGivenCode,
            CorrectAnswer        : questionNode.CorrectAnswer,
        };
        return query;
    }

    public static messageNodeAsQueryDto(node: CAssessmentNode, assessment: AssessmentDto) {
        const messageNode = node as CAssessmentMessageNode;
        const query: AssessmentQueryDto = {
            id                   : messageNode.id,
            DisplayCode          : messageNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : messageNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : messageNode.Sequence,
            NodeType             : messageNode.NodeType as AssessmentNodeType,
            Title                : messageNode.Title,
            Description          : messageNode.Description,
            ExpectedResponseType : QueryResponseType.Ok,
            Options              : [],
            ProviderGivenCode    : messageNode.ProviderGivenCode,
        };
        return query;
    }

    public static extractFieldIdentifierData(assessment: AssessmentDto): Record<string, string> | null {

        const userResponses = assessment.UserResponses || [];
        const extractedData: Record<string, string> = {};

        for (const response of userResponses) {
            const fieldIdentifier = response.Node?.FieldIdentifier;
            let value: string | number | null = null;

            if (response.ResponseType === QueryResponseType.Text ||
                response.ResponseType === QueryResponseType.Integer ||
                response.ResponseType === QueryResponseType.Float) {
                value = response.TextValue ?? response.IntegerValue ?? response.FloatValue ?? null;
            }

            if (fieldIdentifier && value !== null && value !== undefined) {
                const key = fieldIdentifier.split(":").pop();
                extractedData[key] = value as string;
            }
        }

        return extractedData;
    }

    public static extractUserRole(rawData: Record<string, any>): Roles {
        if (!rawData || !('UserRegistration' in rawData) || !('UserRole' in rawData['UserRegistration'])) {
            return Roles.Patient;
        }
    
        const role = rawData['UserRegistration']['UserRole'];
    
        const validRoles = Object.values(Roles);
        if (validRoles.includes(role)) {
            if (role === Roles.SystemAdmin ||
                role === Roles.SystemUser ||
                role === Roles.TenantAdmin ||
                role === Roles.TenantUser) {
                return Roles.Patient;
            }
            return role;
        }
        
        return Roles.Patient;
    }

    public static extractBiometricData(rawData: Record<string, any>): Record<string, any> {
        if (!rawData || !('BiometricAlert' in rawData)) {
            return null;
        }
        return rawData['BiometricAlert'];
    }

}
