import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('98 - Medical condition tests', function () {
    var agent = request.agent(infra._app);

    it('98:01 -> Create medical condition', function (done) {
        loadMedicalConditionCreateModel();
        const createModel = getTestData('medicalConditionCreateModel');
        agent
            .post(`/api/v1/static-types/medical-condition/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setMedicalConditionId(response, 'medicalConditionId_1');
                expectMedicalConditionProperties(response);

                expectMedicalConditionPropertyValues(response);
            })
            .expect(201, done);
    });

    it('98:02 -> Get medical condition by id', function (done) {
        agent
            .get(`/api/v1/static-types/medical-condition/${getTestData('medicalConditionId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectMedicalConditionProperties(response);

                expectMedicalConditionPropertyValues(response);
            })
            .expect(200, done);
    });

    it('98:03 -> Search records', function (done) {
        loadMedicalConditionQueryString();
        agent
            .get(`/api/v1/static-types/medical-condition/search${loadMedicalConditionQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.MedicalConditionRecords).to.have.property('TotalCount');
                expect(response.body.Data.MedicalConditionRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.MedicalConditionRecords).to.have.property('PageIndex');
                expect(response.body.Data.MedicalConditionRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.MedicalConditionRecords).to.have.property('Order');
                expect(response.body.Data.MedicalConditionRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.MedicalConditionRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.MedicalConditionRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('98:04 -> Update medical condition', function (done) {
        loadMedicalConditionUpdateModel();
        const updateModel = getTestData('medicalConditionUpdateModel');
        agent
            .put(`/api/v1/static-types/medical-condition/${getTestData('medicalConditionId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectMedicalConditionProperties(response);

                expect(response.body.Data.MedicalCondition.Condition).to.equal(
                    getTestData('medicalConditionUpdateModel').Condition
                );
                expect(response.body.Data.MedicalCondition.Description).to.equal(
                    getTestData('medicalConditionUpdateModel').Description
                );
                expect(response.body.Data.MedicalCondition.Language).to.equal(
                    getTestData('medicalConditionUpdateModel').Language
                );
            })
            .expect(200, done);
    });

    it('98:05 -> Delete medical condition', function (done) {
        agent
            .delete(`/api/v1/static-types/medical-condition/${getTestData('medicalConditionId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create medical condition again', function (done) {
        loadMedicalConditionCreateModel();
        const createModel = getTestData('medicalConditionCreateModel');
        agent
            .post(`/api/v1/static-types/medical-condition/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setMedicalConditionId(response, 'medicalConditionId');
                expectMedicalConditionProperties(response);

                expectMedicalConditionPropertyValues(response);
            })
            .expect(201, done);
    });

    it('98:06 -> Negative - Create medical condition', function (done) {
        loadNegativeMedicalConditionCreateModel();
        const createModel = getTestData('negativeMedicalConditionCreateModel');
        agent
            .post(`/api/v1/static-types/medical-condition/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('98:07 -> Negative - Get medical condition by id', function (done) {
        agent
            .get(`/api/v1/static-types/medical-condition/${getTestData('medicalConditionId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('98:08 -> Negative - Update medical condition', function (done) {
        loadMedicalConditionUpdateModel();
        const updateModel = getTestData('medicalConditionUpdateModel');
        agent
            .put(`/api/v1/static-types/medical-condition/${getTestData('medicalConditionId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setMedicalConditionId(response, key) {
    setTestData(response.body.Data.MedicalCondition.id, key);
}

function expectMedicalConditionProperties(response) {
    expect(response.body.Data.MedicalCondition).to.have.property('Condition');
    expect(response.body.Data.MedicalCondition).to.have.property('Description');
    expect(response.body.Data.MedicalCondition).to.have.property('Language');
}

function expectMedicalConditionPropertyValues(response) {
    expect(response.body.Data.MedicalCondition.Condition).to.equal(getTestData('medicalConditionCreateModel').Condition);
    expect(response.body.Data.MedicalCondition.Description).to.equal(getTestData('medicalConditionCreateModel').Description);
    expect(response.body.Data.MedicalCondition.Language).to.equal(getTestData('medicalConditionCreateModel').Language);
}

export const loadMedicalConditionCreateModel = async () => {
    const model = {
        Condition: faker.lorem.word(),
        TenantId: getTestData('tenantId'),
        Description: faker.lorem.words(),
        Language: faker.lorem.word(2),
    };
    setTestData(model, 'medicalConditionCreateModel');
};

export const loadMedicalConditionUpdateModel = async () => {
    const model = {
        Condition: faker.lorem.word(),
        Description: faker.lorem.words(),
        Language: faker.lorem.word(2),
    };
    setTestData(model, 'medicalConditionUpdateModel');
};

function loadMedicalConditionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeMedicalConditionCreateModel = async () => {
    const model = {
        Condition: faker.lorem.word(),
        Description: faker.lorem.words(),
        Language: faker.lorem.word(2),
    };
    setTestData(model, 'negativeMedicalConditionCreateModel');
};
