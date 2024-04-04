import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('33 - Heart points records tests', function() {

    var agent = request.agent(infra._app);

    it('33:01 -> Create heart points', function(done) {
        loadHeartPointCreateModel();
        const createModel = getTestData("HeartPointCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.HeartPoints.id, 'HeartPointId_1');
                expect(response.body.Data.HeartPoints).to.have.property('id');
                expect(response.body.Data.HeartPoints).to.have.property('PatientUserId');
                expect(response.body.Data.HeartPoints).to.have.property('HeartPoints');
                expect(response.body.Data.HeartPoints).to.have.property('Unit');

                setTestData(response.body.Data.HeartPoints.id, 'HeartPointId_1');

                expect(response.body.Data.HeartPoints.PatientUserId).to.equal(getTestData("HeartPointCreateModel").PatientUserId);
                expect(response.body.Data.HeartPoints.HeartPoints).to.equal(getTestData("HeartPointCreateModel").HeartPoints);
                expect(response.body.Data.HeartPoints.Unit).to.equal(getTestData("HeartPointCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('33:02 -> Get heart points by id', function(done) {

        agent
            .get(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.HeartPoints).to.have.property('id');
                expect(response.body.Data.HeartPoints).to.have.property('PatientUserId');
                expect(response.body.Data.HeartPoints).to.have.property('HeartPoints');
                expect(response.body.Data.HeartPoints).to.have.property('Unit');

                expect(response.body.Data.HeartPoints.PatientUserId).to.equal(getTestData("HeartPointCreateModel").PatientUserId);
                expect(response.body.Data.HeartPoints.HeartPoints).to.equal(getTestData("HeartPointCreateModel").HeartPoints);
                expect(response.body.Data.HeartPoints.Unit).to.equal(getTestData("HeartPointCreateModel").Unit);
            })
            .expect(200, done);
    });

    it('33:03 -> Search heart points records', function(done) {
        loadHeartPointQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/heart-points/search${loadHeartPointQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

    it('33:04 -> Update heart points', function(done) {
        loadHeartPointUpdateModel();
        const updateModel = getTestData("HeartPointUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.HeartPoints).to.have.property('id');
                expect(response.body.Data.HeartPoints).to.have.property('PatientUserId');
                expect(response.body.Data.HeartPoints).to.have.property('HeartPoints');
                expect(response.body.Data.HeartPoints).to.have.property('Unit');

                expect(response.body.Data.HeartPoints.PatientUserId).to.equal(getTestData("HeartPointUpdateModel").PatientUserId);
                expect(response.body.Data.HeartPoints.HeartPoints).to.equal(getTestData("HeartPointUpdateModel").HeartPoints);
                expect(response.body.Data.HeartPoints.Unit).to.equal(getTestData("HeartPointUpdateModel").Unit);

            })
            .expect(200, done);
    });

    it('33:05 -> Delete heart points', function(done) {
       
        agent
            .delete(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create heart points again', function(done) {
        loadHeartPointCreateModel();
        const createModel = getTestData("HeartPointCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.HeartPoints.id, 'HeartPointId');
                expect(response.body.Data.HeartPoints).to.have.property('id');
                expect(response.body.Data.HeartPoints).to.have.property('PatientUserId');
                expect(response.body.Data.HeartPoints).to.have.property('HeartPoints');
                expect(response.body.Data.HeartPoints).to.have.property('Unit');

                setTestData(response.body.Data.HeartPoints.id, 'HeartPointId');

                expect(response.body.Data.HeartPoints.PatientUserId).to.equal(getTestData("HeartPointCreateModel").PatientUserId);
                expect(response.body.Data.HeartPoints.HeartPoints).to.equal(getTestData("HeartPointCreateModel").HeartPoints);
                expect(response.body.Data.HeartPoints.Unit).to.equal(getTestData("HeartPointCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('33:06 -> Negative - Create heart points', function(done) {
        loadHeartPointCreateModel();
        const createModel = getTestData("HeartPoint");
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('33:07 -> Negative - Get heart points by id', function(done) {

        agent
            .get(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPointId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('33:08 -> Negative - Update heart points', function(done) {
        loadHeartPointUpdateModel();
        const updateModel = getTestData("HeartPointUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/heart-points/${getTestData('HeartPointId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadHeartPointCreateModel = async (
) => {
    const model = {
        PersonId      : getTestData("PatientPersonId"),
        PatientUserId : getTestData("PatientUserId"),
        HeartPoints   : faker.number.int(10),
        Unit          : faker.string.symbol()
  
    };
    setTestData(model, "HeartPointCreateModel");
};

export const loadHeartPointUpdateModel = async (
) => {
    const model = {
        PersonId      : getTestData("PatientPersonId"),
        PatientUserId : getTestData("PatientUserId"),
        HeartPoints   : faker.number.int(10),
        Unit          : faker.string.symbol()
    
    };
    setTestData(model, "HeartPointUpdateModel");
};

function loadHeartPointQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
