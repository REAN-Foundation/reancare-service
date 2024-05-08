import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('76 - Custom Assessment - Add nodes', function () {
    var agent = request.agent(infra._app);

    it('76:01 -> Create an assessment template', function (done) {
        loadCustomAssessmentCreateModel();

        const createModel = getTestData('customAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentTemplate.id, 'nodeAssessmentTemplateId');
                setTestData(response.body.Data.AssessmentTemplate.RootNodeId, 'assessmentTemplateRootNodeId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');

                expect(response.body.Data.AssessmentTemplate.Title).to.equal(
                    getTestData('customAssessmentCreateModel').Title
                );
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(
                    getTestData('customAssessmentCreateModel').Description
                );
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData('customAssessmentCreateModel').Type);
                expect(response.body.Data.AssessmentTemplate.Provider).to.equal(
                    getTestData('customAssessmentCreateModel').Provider
                );
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(
                    getTestData('customAssessmentCreateModel').ProviderAssessmentCode
                );
            })
            .expect(201, done);
    });

    it('76:02 -> Add question node - single choice', function (done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData('customAssessmentSCQModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeSCQId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentSCQModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentSCQModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData('customAssessmentSCQModel').Title);
                expect(response.body.Data.AssessmentNode.Description).to.equal(
                    getTestData('customAssessmentSCQModel').Description
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('customAssessmentSCQModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('76:03 -> Add question node - multi-choice', function (done) {
        loadCustomAssessmentMCQModel();

        const createModel = getTestData('customAssessmentMCQModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeMCQId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentMCQModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentMCQModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData('customAssessmentMCQModel').Title);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('customAssessmentMCQModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('76:04 -> Add list node', function (done) {
        loadCustomAssessmentNodeListModel();

        const createModel = getTestData('customAssessmentNodeListModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeListId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentNodeListModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentNodeListModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData('customAssessmentNodeListModel').Title);
            })
            .expect(201, done);
    });

    it('76:05 -> Add question node - text', function (done) {
        loadCustomAssessmentNodeTextTypeModel();

        const createModel = getTestData('customAssessmentNodeTextTypeModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeTextTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentNodeTextTypeModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentNodeTextTypeModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(
                    getTestData('customAssessmentNodeTextTypeModel').Title
                );
                expect(response.body.Data.AssessmentNode.Description).to.equal(
                    getTestData('customAssessmentNodeTextTypeModel').Description
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('customAssessmentNodeTextTypeModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('76:06 -> Add question node - date', function (done) {
        loadCustomAssessmentNodeDateTypeModel();

        const createModel = getTestData('customAssessmentNodeDateTypeModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeDateTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentNodeDateTypeModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentNodeDateTypeModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(
                    getTestData('customAssessmentNodeDateTypeModel').Title
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('customAssessmentNodeDateTypeModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('76:07 -> Add question node - boolean', function (done) {
        loadCustomAssessmentNodeBooleanTypeModel();

        const createModel = getTestData('customAssessmentNodeBooleanTypeModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeBooleanTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentNodeBooleanTypeModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentNodeBooleanTypeModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(
                    getTestData('customAssessmentNodeBooleanTypeModel').Title
                );
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(
                    getTestData('customAssessmentNodeBooleanTypeModel').QueryResponseType
                );
            })
            .expect(201, done);
    });

    it('76:08 -> Add message node', function (done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData('customAssessmentNodeMessageTypeModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.AssessmentNode.id, 'assessmentNodeMessageTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Message');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').Title
                );
                expect(response.body.Data.AssessmentNode.Message).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').Message
                );
            })
            .expect(201, done);
    });

    it('76:09 -> Get updated assessment template by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');

                expect(response.body.Data.AssessmentTemplate.Title).to.equal(
                    getTestData('customAssessmentCreateModel').Title
                );
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(
                    getTestData('customAssessmentCreateModel').Description
                );
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData('customAssessmentCreateModel').Type);
                expect(response.body.Data.AssessmentTemplate.Provider).to.equal(
                    getTestData('customAssessmentCreateModel').Provider
                );
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(
                    getTestData('customAssessmentCreateModel').ProviderAssessmentCode
                );
            })
            .expect(200, done);
    });

    it('76:10 -> Get node by id', function (done) {
        agent
            .get(
                `/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes/${getTestData(
                    'assessmentNodeMessageTypeId'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Message');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').ParentNodeId
                );
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').NodeType
                );
                expect(response.body.Data.AssessmentNode.Title).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').Title
                );
                expect(response.body.Data.AssessmentNode.Message).to.equal(
                    getTestData('customAssessmentNodeMessageTypeModel').Message
                );
            })
            .expect(200, done);
    });

    it('76:11 -> Negative - Create an assessment template', function (done) {
        loadNegativeCustomAssessmentCreateModel();

        const createModel = getTestData('negativeCustomAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('76:12 -> Negative - Add question node - single choice', function (done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData('customAssessmentSCQModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('76:13 -> Negative - Add list node', function (done) {
        loadCustomAssessmentNodeListModel();

        const createModel = getTestData('customAssessmentNodeListModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('76:14 -> Negative - Add question node - date', function (done) {
        loadCustomAssessmentNodeDateTypeModel();

        const createModel = getTestData('customAssessmentNodeDateTypeModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('76:15 -> Negative - Add message node', function (done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData('customAssessmentNodeMessageTypeModel');
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('76:16 -> Negative - Get updated assessment template by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('76:17 -> Negative - Get node by id', function (done) {
        agent
            .get(
                `/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}/nodes/${getTestData(
                    'assessmentNodeMessageTypeId'
                )}`
            )
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////

export const loadCustomAssessmentCreateModel = async () => {
    const model = {
        TenantId: getTestData('tenantId'),
        Title: faker.lorem.word(5),
        Description: faker.lorem.word(15),
        Type: getRandomEnumValue(AssessmentType),
        Provider: faker.lorem.word(),
        ProviderAssessmentCode: faker.lorem.word(),
    };
    setTestData(model, 'customAssessmentCreateModel');
};

export const loadCustomAssessmentSCQModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        QueryResponseType: 'Single Choice Selection',
        Options: [
            {
                ProviderGivenCode: 'yes',
                Text: 'Yes',
                Sequence: 1,
            },
            {
                ProviderGivenCode: 'no',
                Text: 'No',
                Sequence: 2,
            },
        ],
    };
    setTestData(model, 'customAssessmentSCQModel');
};

export const loadCustomAssessmentMCQModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        QueryResponseType: 'Multi Choice Selection',
        Options: [
            {
                Text: 'Walking',
                Sequence: 1,
            },
            {
                Text: 'Sports',
                Sequence: 2,
            },
            {
                Text: 'Hiking',
                Sequence: 3,
            },
            {
                Text: 'Cycling',
                Sequence: 4,
            },
            {
                Text: 'Yoga',
                Sequence: 5,
            },
        ],
    };
    setTestData(model, 'customAssessmentMCQModel');
};

export const loadCustomAssessmentNodeListModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Node list',
        Title: faker.lorem.word(15),
    };
    setTestData(model, 'customAssessmentNodeListModel');
};

export const loadCustomAssessmentNodeTextTypeModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        QueryResponseType: 'Text',
    };
    setTestData(model, 'customAssessmentNodeTextTypeModel');
};

export const loadCustomAssessmentNodeDateTypeModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        QueryResponseType: 'Date',
    };
    setTestData(model, 'customAssessmentNodeDateTypeModel');
};

export const loadCustomAssessmentNodeBooleanTypeModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Question',
        Title: faker.lorem.word(15),
        QueryResponseType: 'Boolean',
    };
    setTestData(model, 'customAssessmentNodeBooleanTypeModel');
};

export const loadCustomAssessmentNodeMessageTypeModel = async () => {
    const model = {
        ParentNodeId: getTestData('assessmentTemplateRootNodeId'),
        NodeType: 'Message',
        Title: faker.lorem.word(15),
        Message: 'Please see your doctor this weekend.',
    };
    setTestData(model, 'customAssessmentNodeMessageTypeModel');
};

export const loadNegativeCustomAssessmentCreateModel = async () => {
    const model = {
        Provider: faker.lorem.word(),
        ProviderAssessmentCode: faker.lorem.word(5),
    };
    setTestData(model, 'negativeCustomAssessmentCreateModel');
};
