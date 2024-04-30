import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('53 - Symptom type tests', function () {
    var agent = request.agent(infra._app);

    it('53:01 -> Create symptom type', function (done) {
        loadSymptomCreateModel();
        const createModel = getTestData('symptomCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setSymptomTypeId(response, 'symptomTypeId_1');
                expectSymptomTypeProperties(response);

                expectSymptomTypePropertyValues(response);
            })
            .expect(201, done);
    });

    it('53:02 -> Get symptom type by id', function (done) {
        agent
            .get(`/api/v1/clinical/symptom-types/${getTestData('symptomTypeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectSymptomTypeProperties(response);

                expectSymptomTypePropertyValues(response);
            })
            .expect(200, done);
    });

    it('53:03 -> Search symptom type records', function (done) {
        loadSymptomQueryString();
        agent
            .get(`/api/v1/clinical/symptom-types/search${loadSymptomQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.SymptomTypes).to.have.property('TotalCount');
                expect(response.body.Data.SymptomTypes).to.have.property('RetrievedCount');
                expect(response.body.Data.SymptomTypes).to.have.property('PageIndex');
                expect(response.body.Data.SymptomTypes).to.have.property('ItemsPerPage');
                expect(response.body.Data.SymptomTypes).to.have.property('Order');
                expect(response.body.Data.SymptomTypes.TotalCount).to.greaterThan(0);
                expect(response.body.Data.SymptomTypes.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.SymptomTypes.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('53:04 -> Update symptom type', function (done) {
        loadSymptomUpdateModel();
        const updateModel = getTestData('symptomUpdateModel');
        agent
            .put(`/api/v1/clinical/symptom-types/${getTestData('symptomTypeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectSymptomTypeProperties(response);

                expect(response.body.Data.SymptomType.Symptom).to.equal(getTestData('symptomUpdateModel').Symptom);
                expect(response.body.Data.SymptomType.Description).to.equal(getTestData('symptomUpdateModel').Description);
            })
            .expect(200, done);
    });

    it('53:05 -> Delete symptom type', function (done) {
        agent
            .delete(`/api/v1/clinical/symptom-types/${getTestData('symptomTypeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create symptom type again', function (done) {
        loadSymptomCreateModel();
        const createModel = getTestData('symptomCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setSymptomTypeId(response, 'symptomTypeId');
                expectSymptomTypeProperties(response);

                expectSymptomTypePropertyValues(response);
            })
            .expect(201, done);
    });

    it('53:06 -> Negative - Create symptom type', function (done) {
        loadSymptomCreateModel();
        const createModel = getTestData('symptomCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('53:07 -> Negative - Get symptom type by id', function (done) {
        agent
            .get(`/api/v1/clinical/symptom-types/${getTestData('symptomTypeId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('53:08 -> Negative - Update symptom type', function (done) {
        loadSymptomUpdateModel();
        const updateModel = getTestData('symptomUpdateModel');
        agent
            .put(`/api/v1/clinical/symptom-types/${getTestData('symptomTypeId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setSymptomTypeId(response, key) {
    setTestData(response.body.Data.SymptomType.id, key);
}

function expectSymptomTypeProperties(response) {
    expect(response.body.Data.SymptomType).to.have.property('id');
    expect(response.body.Data.SymptomType).to.have.property('Symptom');
    expect(response.body.Data.SymptomType).to.have.property('Description');
    expect(response.body.Data.SymptomType).to.have.property('Language');
    expect(response.body.Data.SymptomType).to.have.property('ImageResourceId');
}

function expectSymptomTypePropertyValues(response) {
    expect(response.body.Data.SymptomType.Symptom).to.equal(getTestData('symptomCreateModel').Symptom);
    expect(response.body.Data.SymptomType.Description).to.equal(getTestData('symptomCreateModel').Description);
    expect(response.body.Data.SymptomType.Language).to.equal(getTestData('symptomCreateModel').Language);
    expect(response.body.Data.SymptomType.ImageResourceId).to.equal(getTestData('symptomCreateModel').ImageResourceId);
}

export const loadSymptomCreateModel = async () => {
    const model = {
        Symptom: faker.lorem.word(),
        Description: faker.lorem.words(),
        Tags: ['Stroke', 'Migrain'],
        Language: 'en-US',
        ImageResourceId: faker.string.uuid(),
    };
    setTestData(model, 'symptomCreateModel');
};

export const loadSymptomUpdateModel = async () => {
    const model = {
        Symptom: faker.lorem.word(),
        Description: faker.lorem.words(),
        Tags: ['Stroke', 'Migrain'],
    };
    setTestData(model, 'symptomUpdateModel');
};

function loadSymptomQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
