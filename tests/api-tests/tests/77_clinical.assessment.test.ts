import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('77 - Assessment tests', function () {
    var agent = request.agent(infra._app);

    it('77:01 -> Create assessment', function (done) {
        loadAssessmentCreateModel();
        const createModel = getTestData('assessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setAssessmentId(response, 'nodeAssessmentId_1');
                expectAssessmentProperties(response);

                expect(response.body.Data.Assessment.PatientUserId).to.equal(
                    getTestData('assessmentCreateModel').PatientUserId
                );
                expect(response.body.Data.Assessment.Title).to.equal(getTestData('assessmentCreateModel').Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(
                    getTestData('assessmentCreateModel').AssessmentTemplateId
                );
            })
            .expect(201, done);
    });

    it('77:02 -> Get assessment by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectAssessmentProperties(response);

                expect(response.body.Data.Assessment.PatientUserId).to.equal(
                    getTestData('assessmentCreateModel').PatientUserId
                );
                expect(response.body.Data.Assessment.Title).to.equal(getTestData('assessmentCreateModel').Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(
                    getTestData('assessmentCreateModel').AssessmentTemplateId
                );
            })
            .expect(200, done);
    });

    it('77:03 -> Search assessment records', function (done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/assessments/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.AssessmentRecords).to.have.property('TotalCount');
                expect(response.body.Data.AssessmentRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.AssessmentRecords).to.have.property('PageIndex');
                expect(response.body.Data.AssessmentRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.AssessmentRecords).to.have.property('Order');
                expect(response.body.Data.AssessmentRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.AssessmentRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.AssessmentRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('77:04 -> Update assessment', function (done) {
        loadAssessmentUpdateModel();
        const updateModel = getTestData('assessmentUpdateModel');
        agent
            .put(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectAssessmentProperties(response);

                expect(response.body.Data.Assessment.PatientUserId).to.equal(
                    getTestData('assessmentUpdateModel').PatientUserId
                );
                expect(response.body.Data.Assessment.Title).to.equal(getTestData('assessmentUpdateModel').Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(
                    getTestData('assessmentUpdateModel').AssessmentTemplateId
                );
            })
            .expect(200, done);
    });

    it('77:05 -> Delete assessment', function (done) {
        agent
            .delete(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create assessment again', function (done) {
        loadAssessmentCreateModel();
        const createModel = getTestData('assessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setAssessmentId(response, 'nodeAssessmentId');
                expectAssessmentProperties(response);

                expect(response.body.Data.Assessment.PatientUserId).to.equal(
                    getTestData('assessmentCreateModel').PatientUserId
                );
                expect(response.body.Data.Assessment.Title).to.equal(getTestData('assessmentCreateModel').Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(
                    getTestData('assessmentCreateModel').AssessmentTemplateId
                );
            })
            .expect(201, done);
    });

    it('77:06 -> Negative - Create assessment', function (done) {
        loadNegativeAssessmentCreateModel();
        const createModel = getTestData('negativeAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('77:07 -> Negative - Get assessment by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentd')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('77:08 -> Negative - Update assessment', function (done) {
        loadAssessmentUpdateModel();
        const updateModel = getTestData('assessmentUpdateModel');
        agent
            .put(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('77:09 -> Negative - Delete assessment', function (done) {
        agent
            .delete(`/api/v1/clinical/assessments/${getTestData('nodeAssessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setAssessmentId(response, key) {
    setTestData(response.body.Data.Assessment.id, key);
}

function expectAssessmentProperties(response) {
    expect(response.body.Data.Assessment).to.have.property('id');
    expect(response.body.Data.Assessment).to.have.property('PatientUserId');
    expect(response.body.Data.Assessment).to.have.property('Title');
    expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
    expect(response.body.Data.Assessment).to.have.property('ScheduledAt');
}

export const loadAssessmentCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Title: faker.lorem.word(5),
        AssessmentTemplateId: getTestData('nodeAssessmentTemplateId'),
        ScheduledDate: faker.date.future(),
    };
    setTestData(model, 'assessmentCreateModel');
};

export const loadAssessmentUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Title: faker.lorem.word(5),
        AssessmentTemplateId: getTestData('nodeAssessmentTemplateId'),
        ScheduledDate: faker.date.future(),
    };
    setTestData(model, 'assessmentUpdateModel');
};

function loadAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeAssessmentCreateModel = async () => {
    const model = {
        ScheduledDate: faker.date.future(),
    };
    setTestData(model, 'negativeAssessmentCreateModel');
};
