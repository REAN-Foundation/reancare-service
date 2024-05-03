import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('78 - Run Kobo Form assessment', function () {
    var agent = request.agent(infra._app);

    it('78:01 -> Start assessment', function (done) {
        agent
            .post(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:02 -> Get next assessment question', function (done) {
        agent
            .get(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/next`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:03 -> Get assessment question by id', function (done) {
        agent
            .get(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeMCQId'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:04 -> Answer first question - single choice', function (done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData('customAssessmentSCQModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeSCQId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:05 -> Answer second question - multi choice', function (done) {
        loadCustomAssessmentMCQModel();

        const createModel = getTestData('customAssessmentMCQModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeMCQId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:06 -> Answer third question - Text value', function (done) {
        loadCustomAssessmentNodeTextTypeModel();

        const createModel = getTestData('customAssessmentNodeTextTypeModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeTextTypeId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:07 -> Answer fourth question - Date', function (done) {
        loadCustomAssessmentNodeDateTypeModel();

        const createModel = getTestData('customAssessmentNodeDateTypeModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeDateTypeId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:08 -> Answer fifth question - Boolean', function (done) {
        loadCustomAssessmentNodeBooleanTypeModel();

        const createModel = getTestData('customAssessmentNodeBooleanTypeModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeBooleanTypeId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:09 -> Answer sixth question - Message', function (done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData('customAssessmentNodeMessageTypeModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeMessageTypeId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('78:10 -> Negative - Start assessment', function (done) {
        agent
            .post(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/start`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('78:11 -> Negative - Get next assessment question', function (done) {
        agent
            .get(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/next`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('78:12 -> Negative - Get assessment question by id', function (done) {
        agent
            .get(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeMCQ'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

    it('78:13 -> Negative - Answer first question - single choice', function (done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData('customAssessmentSCQModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeSCQId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('78:14 -> Negative - Answer sixth question - Message', function (done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData('customAssessmentNodeMessageTypeModel');
        agent
            .post(
                `/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}/questions/${getTestData(
                    'assessmentNodeMessageTypeId'
                )}/answer`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
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
        Title: faker.lorem.word(5),
        Description: faker.lorem.word(15),
        Type: getRandomEnumValue(AssessmentType),
        Provider: faker.lorem.word(),
        ProviderAssessmentCode: faker.lorem.word(),
    };
    setTestData(model, 'CustomAssessmentCreateModel');
};

export const loadCustomAssessmentSCQModel = async () => {
    const model = {
        ResponseType: 'Single Choice Selection',
        Answer: 1,
    };
    setTestData(model, 'customAssessmentSCQModel');
};

export const loadCustomAssessmentMCQModel = async () => {
    const model = {
        ResponseType: 'Multi Choice Selection',
        Answer: [1, 3, 4],
    };
    setTestData(model, 'customAssessmentMCQModel');
};

export const loadCustomAssessmentNodeTextTypeModel = async () => {
    const model = {
        ResponseType: 'Text',
        Answer: 35,
    };
    setTestData(model, 'customAssessmentNodeTextTypeModel');
};

export const loadCustomAssessmentNodeDateTypeModel = async () => {
    const model = {
        ResponseType: 'Date',
        Answer: '1975-01-26',
    };
    setTestData(model, 'customAssessmentNodeDateTypeModel');
};

export const loadCustomAssessmentNodeBooleanTypeModel = async () => {
    const model = {
        ResponseType: 'Boolean',
        Answer: false,
    };
    setTestData(model, 'customAssessmentNodeBooleanTypeModel');
};

export const loadCustomAssessmentNodeMessageTypeModel = async () => {
    const model = {
        ResponseType: 'Ok',
        Answer: 'Ok',
    };
    setTestData(model, 'customAssessmentNodeMessageTypeModel');
};
