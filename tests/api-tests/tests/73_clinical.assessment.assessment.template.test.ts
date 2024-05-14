import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { AssessmentNodeType, AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('73 - KCCQAssessmentTemplate tests', function () {
    var agent = request.agent(infra._app);

    it('73:01 -> Create KCCQ Assessment Template', function (done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData('assessmentTemplateCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setAssessmentTemplateId(response, 'assessmentTemplateScoreId');
                setAssessmentTemplateRootNodeId(response, 'assessmentTemplateRootNodeId');
                expectAssessmentTemplateProperties(response);

                expectAssessmentTemplatePropertyValues(response);
            })
            .expect(201, done);
    });

    it('73:02 -> Add list node - Q1', function (done) {
        loadKCCQNodeListCreateModel();
        const createModel = getTestData('assessmentNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentQuestionNodeId');
                setTestData(response.body.Data.AssessmentNode.ParentNodeId, 'nodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('ServeListNodeChildrenAtOnce');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('assessmentNodeListCreateModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('assessmentNodeListCreateModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData('assessmentNodeListCreateModel').Title);
            })
            .expect(201, done);
    });

    it('73:03 -> Create QuestionNodeList Q1.1 question', function (done) {
        loadFirstSubQuestionNodeListCreateModel();
        const createModel = getTestData('firstSubQuestionNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentQuestionNodeId_1');
                setTestData(response.body.Data.AssessmentNode.ParentNodeId, 'NodeId_1');
                expect(response.body.Data.AssessmentNode).to.have.property('id');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('firstSubQuestionNodeListCreateModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(
                    getTestData('firstSubQuestionNodeListCreateModel').Title
                );
                expect(response.body.Data.AssessmentNode.Description).to.equal(
                    getTestData('firstSubQuestionNodeListCreateModel').Description
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('firstSubQuestionNodeListCreateModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('73:04 -> Create QuestionNodeList Q1.2 question', function (done) {
        loadSecondSubQuestionNodeListCreateModel();
        const createModel = getTestData('secondSubQuestionNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentQuestionNodeId_2');
                setTestData(response.body.Data.AssessmentNode.ParentNodeId, 'NodeId_2');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('secondSubQuestionNodeListCreateModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Description).to.equal(
                    getTestData('secondSubQuestionNodeListCreateModel').Description
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('secondSubQuestionNodeListCreateModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('73:05 -> Create QuestionNodeList Q1.3 question', function (done) {
        loadThirdSubQuestionNodeListCreateModel();
        const createModel = getTestData('thirdSubQuestionNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentQuestionNodeId_3');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('thirdSubQuestionNodeListCreateModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Description).to.equal(
                    getTestData('thirdSubQuestionNodeListCreateModel').Description
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('thirdSubQuestionNodeListCreateModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('73:06 -> Add question node to template- Q 2', function (done) {
        loadSingleQuestionNodeListCreateModel();
        const createModel = getTestData('singleQuestionNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentQuestionNodeId_4');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('singleQuestionNodeListCreateModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('singleQuestionNodeListCreateModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Description).to.equal(
                    getTestData('singleQuestionNodeListCreateModel').Description
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('singleQuestionNodeListCreateModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('73:07 -> Get assessment template by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectAssessmentTemplateProperties(response);

                expectAssessmentTemplatePropertyValues(response);
            })
            .expect(200, done);
    });

    it('73:08 -> Update AssessmentTemplate', function (done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData('assessmentTemplateUpdateModel');

        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectAssessmentTemplateProperties(response);

                expectAssessmentTemplatePropertyValues(response);
            })
            .expect(200, done);
    });

    it('73:09 -> Negative - Create KCCQ Assessment Template', function (done) {
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('73:10 -> Negative - Add list node - Q1', function (done) {
        loadKCCQNodeListCreateModel();
        const createModel = getTestData('assessmentNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('73:11 -> Negative - Create QuestionNodeList Q1.1 question', function (done) {
        loadFirstSubQuestionNodeListCreateModel();
        const createModel = getTestData('firstSubQuestionNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('73:12 -> Negative - Add question node to template- Q 2', function (done) {
        loadSingleQuestionNodeListCreateModel();
        const createModel = getTestData('singleQuestionNodeListCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('assessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////

function setAssessmentTemplateId(response, key) {
    setTestData(response.body.Data.AssessmentTemplate.id, key);
}

function setAssessmentTemplateRootNodeId(response, key) {
    setTestData(response.body.Data.AssessmentTemplate.RootNodeId, key);
}

function expectAssessmentTemplateProperties(response) {
    expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
    expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
    expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
    expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
    expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
    expect(response.body.Data.AssessmentTemplate).to.have.property('ServeListNodeChildrenAtOnce');
}

function expectAssessmentTemplatePropertyValues(response) {
    expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData('assessmentTemplateCreateModel').Title);
    expect(response.body.Data.AssessmentTemplate.Description).to.equal(
        getTestData('assessmentTemplateCreateModel').Description
    );
    expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData('assessmentTemplateCreateModel').Type);
    expect(response.body.Data.AssessmentTemplate.Provider).to.equal(getTestData('assessmentTemplateCreateModel').Provider);
    expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(
        getTestData('assessmentTemplateCreateModel').ProviderAssessmentCode
    );
}

export const loadKCCQAssessmentTemplateCreateModel = async () => {
    const model = {
        TenantId: getTestData('tenantId'),
        Title: faker.lorem.word(5),
        Description: faker.lorem.word(15),
        Type: getRandomEnumValue(AssessmentType),
        Provider: faker.lorem.word(),
        ProviderAssessmentCode: faker.lorem.word(),
        ServeListNodeChildrenAtOnce: faker.datatype.boolean(),
    };
    setTestData(model, 'assessmentTemplateCreateModel');
};

export const loadKCCQNodeListCreateModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Node list',
        Title: faker.lorem.word(15),
        ServeListNodeChildrenAtOnce: faker.datatype.boolean(),
    };
    setTestData(model, 'assessmentNodeListCreateModel');
};

export const loadFirstSubQuestionNodeListCreateModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentQuestionNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        QueryResponseType: 'Single Choice Selection',
        Options: [
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
        ],
    };
    setTestData(model, 'firstSubQuestionNodeListCreateModel');
};

export const loadSecondSubQuestionNodeListCreateModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentQuestionNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        QueryResponseType: 'Single Choice Selection',
        Options: [
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
        ],
    };
    setTestData(model, 'secondSubQuestionNodeListCreateModel');
};

export const loadThirdSubQuestionNodeListCreateModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentQuestionNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        QueryResponseType: 'Single Choice Selection',
        Options: [
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
        ],
    };
    setTestData(model, 'thirdSubQuestionNodeListCreateModel');
};

export const loadSingleQuestionNodeListCreateModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        QueryResponseType: 'Single Choice Selection',
        Options: [
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
            {
                ProviderGivenCode: faker.lorem.word(5),
                Text: faker.lorem.word(5),
                Sequence: faker.number.int(10),
            },
        ],
    };
    setTestData(model, 'singleQuestionNodeListCreateModel');
};

export const loadAssessmentTemplateUpdateModel = async () => {
    const model = {
        ScoringApplicable: true,
    };
    setTestData(model, 'assessmentTemplateUpdateModel');
};

export const loadNegativeKCCQAssessmentTemplateCreateModel = async () => {
    const model = {
        Description: faker.lorem.word(15),
        Type: getRandomEnumValue(AssessmentType),
        Provider: faker.lorem.word(),
        ProviderAssessmentCode: faker.lorem.word(),
        ServeListNodeChildrenAtOnce: faker.datatype.boolean(),
    };
    setTestData(model, 'negativeAssessmentTemplateCreateModel');
};
