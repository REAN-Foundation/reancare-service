import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('63 - Body temperature tests', function () {
    var agent = request.agent(infra._app);

    it('63:01 -> Create body temperature', function (done) {
        loadBodyTemperatureCreateModel();
        const createModel = getTestData('bodyTemperatureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBodyTemperatureId(response, 'bodyTemperatureId_1');
                expectBodyTemperatureProperties(response);

                expectBodyTemperaturePropertyValues(response);
            })
            .expect(201, done);
    });

    it('63:02 -> Get body temperature by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('bodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectBodyTemperatureProperties(response);

                expectBodyTemperaturePropertyValues(response);
            })
            .expect(200, done);
    });

    it('63:03 -> Search body temperature records', function (done) {
        loadBodyTemperatureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/search${loadBodyTemperatureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('TotalCount');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('PageIndex');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('Order');
                expect(response.body.Data.BodyTemperatureRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BodyTemperatureRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BodyTemperatureRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('63:04 -> Update body temperature', function (done) {
        loadBodyTemperatureUpdateModel();
        const updateModel = getTestData('bodyTemperatureUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('bodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectBodyTemperatureProperties(response);

                expect(response.body.Data.BodyTemperature.BodyTemperature).to.equal(
                    getTestData('bodyTemperatureUpdateModel').BodyTemperature
                );
                expect(response.body.Data.BodyTemperature.Unit).to.equal(getTestData('bodyTemperatureUpdateModel').Unit);
            })
            .expect(200, done);
    });

    it('63:05 -> Delete body temperature', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('bodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create body temperature again', function (done) {
        loadBodyTemperatureCreateModel();
        const createModel = getTestData('bodyTemperatureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setBodyTemperatureId(response, 'bodyTemperatureId');
                expectBodyTemperatureProperties(response);

                expectBodyTemperaturePropertyValues(response);
            })
            .expect(201, done);
    });

    it('63:06 -> Negative - Create body temperature', function (done) {
        loadNegativeBodyTemperatureCreateModel();
        const createModel = getTestData('negativeBodyTemperatureCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
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

    it('63:07 -> Negative - Search body temperature records', function (done) {
        loadBodyTemperatureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/search${loadBodyTemperatureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('63:08 -> Negative - Delete body temperature', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('bodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setBodyTemperatureId(response, key) {
    setTestData(response.body.Data.BodyTemperature.id, key);
}

function expectBodyTemperatureProperties(response) {
    expect(response.body.Data.BodyTemperature).to.have.property('PatientUserId');
    expect(response.body.Data.BodyTemperature).to.have.property('BodyTemperature');
    expect(response.body.Data.BodyTemperature).to.have.property('Unit');
    expect(response.body.Data.BodyTemperature).to.have.property('RecordDate');
    expect(response.body.Data.BodyTemperature).to.have.property('RecordedByUserId');
}

function expectBodyTemperaturePropertyValues(response) {
    expect(response.body.Data.BodyTemperature.PatientUserId).to.equal(
        getTestData('bodyTemperatureCreateModel').PatientUserId
    );
    expect(response.body.Data.BodyTemperature.BodyTemperature).to.equal(
        getTestData('bodyTemperatureCreateModel').BodyTemperature
    );
    expect(response.body.Data.BodyTemperature.Unit).to.equal(getTestData('bodyTemperatureCreateModel').Unit);
}

export const loadBodyTemperatureCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        BodyTemperature: faker.number.int(100),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
        RecordedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'bodyTemperatureCreateModel');
};

export const loadBodyTemperatureUpdateModel = async () => {
    const model = {
        BodyTemperature: faker.number.int(100),
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'bodyTemperatureUpdateModel');
};

function loadBodyTemperatureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBodyTemperatureCreateModel = async () => {
    const model = {
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'negativeBodyTemperatureCreateModel');
};
