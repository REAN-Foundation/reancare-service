import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('37 - Sleep record tests', function() {

    var agent = request.agent(infra._app);

    it('37:01 -> Create sleep', function(done) {
        loadSleepCreateModel();
        const createModel = getTestData("SleepCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/sleep/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.SleepRecord.id, 'SleepId_1');
                expect(response.body.Data.SleepRecord).to.have.property('id');
                expect(response.body.Data.SleepRecord).to.have.property('PatientUserId');
                expect(response.body.Data.SleepRecord).to.have.property('SleepDuration');
                expect(response.body.Data.SleepRecord).to.have.property('Unit');
                expect(response.body.Data.SleepRecord).to.have.property('RecordDate');

                setTestData(response.body.Data.SleepRecord.id, 'SleepId_1');

                expect(response.body.Data.SleepRecord.PatientUserId).to.equal(getTestData("SleepCreateModel").PatientUserId);
                expect(response.body.Data.SleepRecord.SleepDuration).to.equal(getTestData("SleepCreateModel").SleepDuration);
                expect(response.body.Data.SleepRecord.Unit).to.equal(getTestData("SleepCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('37:02 -> Get sleep by id', function(done) {

        agent
            .get(`/api/v1/wellness/daily-records/sleep/${getTestData('SleepId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.SleepRecord).to.have.property('id');
                expect(response.body.Data.SleepRecord).to.have.property('PatientUserId');
                expect(response.body.Data.SleepRecord).to.have.property('SleepDuration');
                expect(response.body.Data.SleepRecord).to.have.property('Unit');
                expect(response.body.Data.SleepRecord).to.have.property('RecordDate');

                expect(response.body.Data.SleepRecord.PatientUserId).to.equal(getTestData("SleepCreateModel").PatientUserId);
                expect(response.body.Data.SleepRecord.SleepDuration).to.equal(getTestData("SleepCreateModel").SleepDuration);
                expect(response.body.Data.SleepRecord.Unit).to.equal(getTestData("SleepCreateModel").Unit);

            })
            .expect(200, done);
    });

    it('37:03 -> Search sleep records', function(done) {
        loadSleepQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/sleep/search${loadSleepQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.SleepRecords).to.have.property('TotalCount');
                expect(response.body.Data.SleepRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.SleepRecords).to.have.property('PageIndex');
                expect(response.body.Data.SleepRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.SleepRecords).to.have.property('Order');
                expect(response.body.Data.SleepRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.SleepRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.SleepRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('37:04 -> Update sleep', function(done) {
        loadSleepUpdateModel();
        const updateModel = getTestData("SleepUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/sleep/${getTestData('SleepId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.SleepRecord).to.have.property('id');
                expect(response.body.Data.SleepRecord).to.have.property('PatientUserId');
                expect(response.body.Data.SleepRecord).to.have.property('SleepDuration');
                expect(response.body.Data.SleepRecord).to.have.property('Unit');
                expect(response.body.Data.SleepRecord).to.have.property('RecordDate');

                expect(response.body.Data.SleepRecord.SleepDuration).to.equal(getTestData("SleepUpdateModel").SleepDuration);
                expect(response.body.Data.SleepRecord.Unit).to.equal(getTestData("SleepUpdateModel").Unit);

            })
            .expect(200, done);
    });

    it('37:05 -> Delete sleep', function(done) {
      
        agent
            .delete(`/api/v1/wellness/daily-records/sleep/${getTestData('SleepId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create sleep again', function(done) {
        loadSleepCreateModel();
        const createModel = getTestData("SleepCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/sleep/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.SleepRecord.id, 'SleepId');
                expect(response.body.Data.SleepRecord).to.have.property('id');
                expect(response.body.Data.SleepRecord).to.have.property('PatientUserId');
                expect(response.body.Data.SleepRecord).to.have.property('SleepDuration');
                expect(response.body.Data.SleepRecord).to.have.property('Unit');
                expect(response.body.Data.SleepRecord).to.have.property('RecordDate');

                setTestData(response.body.Data.SleepRecord.id, 'SleepId');

                expect(response.body.Data.SleepRecord.PatientUserId).to.equal(getTestData("SleepCreateModel").PatientUserId);
                expect(response.body.Data.SleepRecord.SleepDuration).to.equal(getTestData("SleepCreateModel").SleepDuration);
                expect(response.body.Data.SleepRecord.Unit).to.equal(getTestData("SleepCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('37:06 -> Negative - Create sleep', function(done) {
        loadSleepCreateModel();
        const createModel = getTestData("Sleep");
        agent
            .post(`/api/v1/wellness/daily-records/sleep/`)
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

    it('37:07 -> Negative - Search sleep records', function(done) {
        loadSleepQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/sleep/search${loadSleepQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('37:08 -> Negative - Delete sleep', function(done) {
      
        agent
            .delete(`/api/v1/wellness/daily-records/sleep/${getTestData('SleepId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadSleepCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        SleepDuration : faker.number.int(24),
        Unit          : faker.string.symbol(),
        RecordDate    : faker.date.anytime()
  
    };
    setTestData(model, "SleepCreateModel");
};

export const loadSleepUpdateModel = async (
) => {
    const model = {
        SleepDuration : faker.number.int(24),
        Unit          : faker.string.symbol(),
    };
    setTestData(model, "SleepUpdateModel");
};

function loadSleepQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
