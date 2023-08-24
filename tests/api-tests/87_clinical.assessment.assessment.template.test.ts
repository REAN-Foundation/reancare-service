import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Cholesterol Demographic Assessment template Copy tests', function() {

    var agent = request.agent(infra._app);

    it('399 - Create Cholesterol Demographic Assessment', function(done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateId_1');
                setTestData(response.body.Data.AssessmentTemplate.RootNodeId, 'AssessmentTemplateRootNodeIdId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('DisplayCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ServeListNodeChildrenAtOnce');

                setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateId_1');

                expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData("AssessmentTemplateCreateModel").Title);
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(getTestData("AssessmentTemplateCreateModel").Description);
                expect(response.body.Data.AssessmentTemplate.DisplayCode).to.equal(getTestData("AssessmentTemplateCreateModel").DisplayCode);
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData("AssessmentTemplateCreateModel").Type);
                expect(response.body.Data.AssessmentTemplate.Provider).to.equal(getTestData("AssessmentTemplateCreateModel").Provider);
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("AssessmentTemplateCreateModel").ProviderAssessmentCode);
                expect(response.body.Data.AssessmentTemplate.ServeListNodeChildrenAtOnce).to.equal(getTestData("AssessmentTemplateCreateModel").ServeListNodeChildrenAtOnce);
            })
            .expect(201, done);
    });

    it('400 - Add question node- 1', function(done) {
        loadNodeCreateModel();
        const createModel = getTestData("NodeCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateId_1')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("NodeCreateModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("NodeCreateModel").NodeType);
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData("NodeCreateModel").Title);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("NodeCreateModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("NodeCreateModel").QueryResponseType);
            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Title                       : "Cholesterol Demographic assessment template",
        Description                 : "Taking location data of the patient.",
        DisplayCode                 : "AssessmtTmpl#choldemo",
        Type                        : "Careplan",
        Provider                    : "REAN",
        ProviderAssessmentCode      : "1",
        ServeListNodeChildrenAtOnce : false
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadNodeCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData("AssessmentTemplateRootNodeIdId"),
        NodeType          : "Question",
        Title             : "Q 1/4. What is your race?",
        Description       : "Taking idea about race",
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : "white",
                Text              : "White",
                Sequence          : 1
            },
            {
                ProviderGivenCode : "black",
                Text              : "Black",
                Sequence          : 2
            },
            {
                ProviderGivenCode : "american Indian or Alaska Native",
                Text              : "American Indian or Alaska Native",
                Sequence          : 3
            },
            {
                ProviderGivenCode : "asian Indian",
                Text              : "Asian Indian",
                Sequence          : 4
            },
            {
                ProviderGivenCode : "chinese",
                Text              : "Chinese",
                Sequence          : 5
            },
            {
                ProviderGivenCode : "filipino",
                Text              : "Filipino",
                Sequence          : 6
            },
            {
                ProviderGivenCode : "japanese",
                Text              : "Japanese",
                Sequence          : 7
            },
            {
                ProviderGivenCode : "korean",
                Text              : "Korean",
                Sequence          : 8
            },
            {
                ProviderGivenCode : "vietnamese",
                Text              : "Vietnamese",
                Sequence          : 9
            },
            {
                ProviderGivenCode : "other Asian",
                Text              : "Other Asian",
                Sequence          : 10
            },
            {
                ProviderGivenCode : "hawaiian",
                Text              : "Hawaiian",
                Sequence          : 11
            },
            {
                ProviderGivenCode : "guamanian",
                Text              : "Guamanian",
                Sequence          : 12
            },
            {
                ProviderGivenCode : "samoan",
                Text              : "Samoan",
                Sequence          : 13
            },
            {
                ProviderGivenCode : "other Pacific Islander",
                Text              : "Other Pacific Islander",
                Sequence          : 14
            }
        ]
    };
    setTestData(model, "NodeCreateModel");
};
