import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('62 - Body weight tests', function () {
    var agent = request.agent(infra._app);

    it('62:01 -> Create body weight', function (done) {
        loadBodyWeightCreateModel();
        const createModel = getTestData('bodyWeightCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBodyWeightId(response, 'bodyWeightId_1');
                expectBodyWeightProperties(response);

                expectBodyWeightPropertyValues(response);
            })
            .expect(201, done);
    });

    it('62:02 -> Get body weight by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/body-weights/${getTestData('bodyWeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectBodyWeightProperties(response);

                expectBodyWeightPropertyValues(response);
            })
            .expect(200, done);
    });

    it('62:03 -> Search body weight records', function (done) {
        loadBodyWeightQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-weights/search${loadBodyWeightQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.BodyWeightRecords).to.have.property('TotalCount');
                expect(response.body.Data.BodyWeightRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BodyWeightRecords).to.have.property('PageIndex');
                expect(response.body.Data.BodyWeightRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BodyWeightRecords).to.have.property('Order');
                expect(response.body.Data.BodyWeightRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BodyWeightRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BodyWeightRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('62:04 -> Update body weight', function (done) {
        loadBodyWeightUpdateModel();
        const updateModel = getTestData('bodyWeightUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/body-weights/${getTestData('bodyWeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectBodyWeightProperties(response);

                expect(response.body.Data.BodyWeight.BodyWeight).to.equal(getTestData('bodyWeightUpdateModel').BodyWeight);
                expect(response.body.Data.BodyWeight.Unit).to.equal(getTestData('bodyWeightUpdateModel').Unit);
            })
            .expect(200, done);
    });

    it('62:05 -> Delete body weight', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/body-weights/${getTestData('bodyWeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create body weight again', function (done) {
        loadBodyWeightCreateModel();
        const createModel = getTestData('bodyWeightCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBodyWeightId(response, 'bodyWeightId');
                expectBodyWeightProperties(response);

                expectBodyWeightPropertyValues(response);
            })
            .expect(201, done);
    });

    it('62:06 -> Negative - Create body weight', function (done) {
        loadNegativeBodyWeightCreateModel();
        const createModel = getTestData('negativeBodyWeightCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
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

    it('62:07 -> Negative - Get body weight by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/body-weights/${getTestData('bodyWeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('62:08 -> Negative - Update body weight', function (done) {
        loadBodyWeightUpdateModel();
        const updateModel = getTestData('bodyWeightUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/body-weights/${getTestData('bodyWeightId')}`)
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

function setBodyWeightId(response, key) {
    setTestData(response.body.Data.BodyWeight.id, key);
}

function expectBodyWeightProperties(response) {
    expect(response.body.Data.BodyWeight).to.have.property('PatientUserId');
    expect(response.body.Data.BodyWeight).to.have.property('BodyWeight');
    expect(response.body.Data.BodyWeight).to.have.property('Unit');
    expect(response.body.Data.BodyWeight).to.have.property('RecordDate');
    expect(response.body.Data.BodyWeight).to.have.property('RecordedByUserId');
}

function expectBodyWeightPropertyValues(response) {
    expect(response.body.Data.BodyWeight.PatientUserId).to.equal(getTestData('bodyWeightCreateModel').PatientUserId);
    expect(response.body.Data.BodyWeight.BodyWeight).to.equal(getTestData('bodyWeightCreateModel').BodyWeight);
    expect(response.body.Data.BodyWeight.Unit).to.equal(getTestData('bodyWeightCreateModel').Unit);
}

export const loadBodyWeightCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        BodyWeight: faker.number.int(200),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'bodyWeightCreateModel');
};

export const loadBodyWeightUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        BodyWeight: faker.number.int(200),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'bodyWeightUpdateModel');
};

function loadBodyWeightQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBodyWeightCreateModel = async () => {
    const model = {
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'negativeBodyWeightCreateModel');
};
