import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('104 - tests', function () {
    var agent = request.agent(infra._app);

    it('104:01 -> Create assessment template', function (done) {
        loadTemplateCreateModel();
        const createModel = getTestData('templateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.SymptomAssessmentTemplate.id, 'assessmentTemplateId_1');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('104:02 -> Create symptom assessment test', function (done) {
        loadSymptomAssessmentCreateModel();
        const createModel = getTestData('symptomAssessmentCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('104:03 -> Create patient with phone & password', function (done) {
        loadPatientCreateWithPhoneThirdModel();
        const createModel = getTestData('patientCreateWithPhoneThirdModel');
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('104:04 -> Patient login with password', function (done) {
        loadPatientLoginThirdModel();
        const createModel = getTestData('patientLoginThirdModel');
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, 'patientJwt_1');
                setTestData(response.body.Data.User.UserId, 'patientUserTestId_Test');
            })
            .expect(200, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadTemplateCreateModel = async () => {
    const model = {
        Title: faker.lorem.word(),
        Description: faker.lorem.words(10),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'templateCreateModel');
};

export const loadSymptomAssessmentCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        AssessmentTemplateId: getTestData('assessmentTemplateId_1'),
        Title: faker.lorem.words(),
        AssessmentDate: faker.date.anytime(),
    };
    setTestData(model, 'symptomAssessmentCreateModel');
};

const patientPhoneNumber: string = faker.phone.number('+104-##########');

const patientPassword: string = faker.internet.password();

export const loadPatientCreateWithPhoneThirdModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
        TenantId: getTestData('tenantId'),
    };
    setTestData(model, 'patientCreateWithPhoneThirdModel');
};

export const loadPatientLoginThirdModel = async () => {
    const model = {
        Phone: patientPhoneNumber,
        Password: patientPassword,
        LoginRoleId: getTestData('patientRoleId'),
    };
    setTestData(model, 'patientLoginThirdModel');
};
