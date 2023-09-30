import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('74 - Cholesterol Demographic Assessment template Copy tests', function() {

    var agent = request.agent(infra._app);

    it('74:01 -> Create Cholesterol Demographic Assessment', function(done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            })
            .expect(201, done);
    });

    it('74:02 -> Add question node- 1', function(done) {
        loadNodeCreateModel();
        const createModel = getTestData("NodeCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateId_1')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('74:03 -> Negative - Create Cholesterol Demographic Assessment', function(done) {
        loadNegativeKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("NegativeAssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('74:04 -> Negative - Add question node- 1', function(done) {
        loadNodeCreateModel();
        const createModel = getTestData("NodeCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateId_1')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Title                       : faker.lorem.word(5),
        Description                 : faker.lorem.word(15),
        DisplayCode                 : faker.lorem.word(),
        Type                        : getRandomEnumValue(AssessmentType),
        Provider                    : faker.lorem.word(),
        ProviderAssessmentCode      : faker.lorem.word(),
        ServeListNodeChildrenAtOnce : faker.datatype.boolean()
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadNodeCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData("AssessmentTemplateRootNodeIdId"),
        NodeType          : "Question",
        Title             : faker.lorem.word(15),
        Description       : faker.lorem.word(15),
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            }
        ]
    };
    setTestData(model, "NodeCreateModel");
};

export const loadNegativeKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Provider: faker.lorem.word(),
    };
    setTestData(model, "NegativeAssessmentTemplateCreateModel");
};

