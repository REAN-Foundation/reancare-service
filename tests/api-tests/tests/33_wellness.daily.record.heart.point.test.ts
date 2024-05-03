import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('33 - Heart points records tests', function () {
    var agent = request.agent(infra._app);

    it('33:01 -> Create heart points', function (done) {
        loadHeartPointCreateModel();
        const createModel = getTestData('heartPointCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setHeartPointId(response, 'heartPointId_1');
                expectHeartPointProperties(response);

                expectHeartPointsPropertyValues(response);
            })
            .expect(201, done);
    });

    it('33:02 -> Get heart points by id', function (done) {
        agent
            .get(`/api/v1/wellness/daily-records/heart-points/${getTestData('heartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectHeartPointProperties(response);

                expectHeartPointsPropertyValues(response);
            })
            .expect(200, done);
    });

    it('33:03 -> Search heart points records', function (done) {
        loadHeartPointQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/heart-points/search${loadHeartPointQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.HeartPointsRecords).to.have.property('TotalCount');
                expect(response.body.Data.HeartPointsRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.HeartPointsRecords).to.have.property('PageIndex');
                expect(response.body.Data.HeartPointsRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.HeartPointsRecords).to.have.property('Order');
                expect(response.body.Data.HeartPointsRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.HeartPointsRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.HeartPointsRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('33:04 -> Update heart points', function (done) {
        loadHeartPointUpdateModel();
        const updateModel = getTestData('heartPointUpdateModel');
        agent
            .put(`/api/v1/wellness/daily-records/heart-points/${getTestData('heartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectHeartPointProperties(response);

                expect(response.body.Data.HeartPoints.PatientUserId).to.equal(
                    getTestData('heartPointUpdateModel').PatientUserId
                );
                expect(response.body.Data.HeartPoints.HeartPoints).to.equal(
                    getTestData('heartPointUpdateModel').HeartPoints
                );
                expect(response.body.Data.HeartPoints.Unit).to.equal(getTestData('heartPointUpdateModel').Unit);
            })
            .expect(200, done);
    });

    it('33:05 -> Delete heart points', function (done) {
        agent
            .delete(`/api/v1/wellness/daily-records/heart-points/${getTestData('heartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create heart points again', function (done) {
        loadHeartPointCreateModel();
        const createModel = getTestData('heartPointCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setHeartPointId(response, 'heartPointId');
                expectHeartPointProperties(response);

                expectHeartPointsPropertyValues(response);
            })
            .expect(201, done);
    });

    it('33:06 -> Negative - Create heart points', function (done) {
        loadHeartPointCreateModel();
        const createModel = getTestData('HeartPoint');
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('33:07 -> Negative - Get heart points by id', function (done) {
        agent
            .get(`/api/v1/wellness/daily-records/heart-points/${getTestData('heartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('33:08 -> Negative - Update heart points', function (done) {
        loadHeartPointUpdateModel();
        const updateModel = getTestData('heartPointUpdateModel');
        agent
            .put(`/api/v1/wellness/daily-records/heart-points/${getTestData('heartPointId')}`)
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

function setHeartPointId(response, key) {
    setTestData(response.body.Data.HeartPoints.id, key);
}

function expectHeartPointProperties(response) {
    expect(response.body.Data.HeartPoints).to.have.property('id');
    expect(response.body.Data.HeartPoints).to.have.property('PatientUserId');
    expect(response.body.Data.HeartPoints).to.have.property('HeartPoints');
    expect(response.body.Data.HeartPoints).to.have.property('Unit');
}

function expectHeartPointsPropertyValues(response) {
    expect(response.body.Data.HeartPoints.PatientUserId).to.equal(getTestData('heartPointCreateModel').PatientUserId);
    expect(response.body.Data.HeartPoints.HeartPoints).to.equal(getTestData('heartPointCreateModel').HeartPoints);
    expect(response.body.Data.HeartPoints.Unit).to.equal(getTestData('heartPointCreateModel').Unit);
}

export const loadHeartPointCreateModel = async () => {
    const model = {
        PersonId: getTestData('patientPersonId'),
        PatientUserId: getTestData('patientUserId'),
        HeartPoints: faker.number.int(10),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'heartPointCreateModel');
};

export const loadHeartPointUpdateModel = async () => {
    const model = {
        PersonId: getTestData('patientPersonId'),
        PatientUserId: getTestData('patientUserId'),
        HeartPoints: faker.number.int(10),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'heartPointUpdateModel');
};

function loadHeartPointQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
