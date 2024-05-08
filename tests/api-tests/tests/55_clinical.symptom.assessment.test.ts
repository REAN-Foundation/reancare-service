import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('55 - Symptom assessment tests', function () {
    var agent = request.agent(infra._app);

    it('55:01 -> Create assessment', function (done) {
        loadAssessmentCreateModel();
        const createModel = getTestData('assessmentCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setSymptomAssessmentId(response, 'assessmentId_1');
                expectSymptomAssessmentProperties(response);

                expectSymptomAssessmentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('55:02 -> Get assessment by id', function (done) {
        agent
            .get(`/api/v1/clinical/symptom-assessments/${getTestData('assessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectSymptomAssessmentProperties(response);

                expectSymptomAssessmentPropertyValues(response);
            })
            .expect(200, done);
    });

    it('55:03 -> Search assessment records', function (done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/symptom-assessments/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.SymptomAssessments).to.have.property('TotalCount');
                expect(response.body.Data.SymptomAssessments).to.have.property('RetrievedCount');
                expect(response.body.Data.SymptomAssessments).to.have.property('PageIndex');
                expect(response.body.Data.SymptomAssessments).to.have.property('ItemsPerPage');
                expect(response.body.Data.SymptomAssessments).to.have.property('Order');
                expect(response.body.Data.SymptomAssessments.TotalCount).to.greaterThan(0);
                expect(response.body.Data.SymptomAssessments.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.SymptomAssessments.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('55:04 -> Update assessment', function (done) {
        loadAssessmentUpdateModel();
        const updateModel = getTestData('assessmentUpdateModel');
        agent
            .put(`/api/v1/clinical/symptom-assessments/${getTestData('assessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectSymptomAssessmentProperties(response);

                expect(response.body.Data.SymptomAssessment.PatientUserId).to.equal(
                    getTestData('assessmentUpdateModel').PatientUserId
                );
                expect(response.body.Data.SymptomAssessment.AssessmentTemplateId).to.equal(
                    getTestData('assessmentUpdateModel').AssessmentTemplateId
                );
                expect(response.body.Data.SymptomAssessment.Title).to.equal(getTestData('assessmentUpdateModel').Title);
            })
            .expect(200, done);
    });

    it('55:05 -> Delete assessment', function (done) {
        agent
            .delete(`/api/v1/clinical/symptom-assessments/${getTestData('assessmentId_1')}`)
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
            .post(`/api/v1/clinical/symptom-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setSymptomAssessmentId(response, 'assessmentId');
                expectSymptomAssessmentProperties(response);

                expectSymptomAssessmentPropertyValues(response);
            })
            .expect(201, done);
    });

    it('55:06 -> Negative - Create assessment', function (done) {
        loadNAssessmentCreateModel();
        const createModel = getTestData('negativeAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('55:07 -> Negative - Get assessment by id', function (done) {
        agent
            .get(`/api/v1/clinical/symptom-assessments/${getTestData('assessmentId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('55:08 -> Negative - Update assessment', function (done) {
        loadAssessmentUpdateModel();
        const updateModel = getTestData('assessmentUpdateModel');
        agent
            .put(`/api/v1/clinical/symptom-assessments/${getTestData('assessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setSymptomAssessmentId(response, key) {
    setTestData(response.body.Data.SymptomAssessment.id, key);
}

function expectSymptomAssessmentProperties(response) {
    expect(response.body.Data.SymptomAssessment).to.have.property('id');
    expect(response.body.Data.SymptomAssessment).to.have.property('PatientUserId');
    expect(response.body.Data.SymptomAssessment).to.have.property('AssessmentTemplateId');
    expect(response.body.Data.SymptomAssessment).to.have.property('Title');
    expect(response.body.Data.SymptomAssessment).to.have.property('AssessmentDate');
}

function expectSymptomAssessmentPropertyValues(response) {
    expect(response.body.Data.SymptomAssessment.PatientUserId).to.equal(getTestData('assessmentCreateModel').PatientUserId);
    expect(response.body.Data.SymptomAssessment.AssessmentTemplateId).to.equal(
        getTestData('assessmentCreateModel').AssessmentTemplateId
    );
    expect(response.body.Data.SymptomAssessment.Title).to.equal(getTestData('assessmentCreateModel').Title);
}

export const loadAssessmentCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        AssessmentTemplateId: getTestData('assessmentTemplateId'),
        Title: faker.lorem.words(),
        AssessmentDate: faker.date.anytime(),
    };
    setTestData(model, 'assessmentCreateModel');
};

export const loadAssessmentUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        AssessmentTemplateId: getTestData('assessmentTemplateId'),
        Title: faker.lorem.words(),
        AssessmentDate: faker.date.anytime(),
    };
    setTestData(model, 'assessmentUpdateModel');
};

function loadAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNAssessmentCreateModel = async () => {
    const model = {};
    setTestData(model, 'negativeAssessmentCreateModel');
};
