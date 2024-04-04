import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('35 - Move minutes records tests', function() {

    var agent = request.agent(infra._app);

    it('35:01 -> Create move minutes', function(done) {
        loadMoveMinuteCreateModel();
        const createModel = getTestData("MoveMinuteCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/move-minutes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.MoveMinutes.id, 'MoveMinuteId_1');
                expect(response.body.Data.MoveMinutes).to.have.property('id');
                expect(response.body.Data.MoveMinutes).to.have.property('PatientUserId');
                expect(response.body.Data.MoveMinutes).to.have.property('MoveMinutes');
                expect(response.body.Data.MoveMinutes).to.have.property('Unit');
                expect(response.body.Data.MoveMinutes).to.have.property('RecordDate');

                setTestData(response.body.Data.MoveMinutes.id, 'MoveMinuteId_1');

                expect(response.body.Data.MoveMinutes.PatientUserId).to.equal(getTestData("MoveMinuteCreateModel").PatientUserId);
                expect(response.body.Data.MoveMinutes.MoveMinutes).to.equal(getTestData("MoveMinuteCreateModel").MoveMinutes);
                expect(response.body.Data.MoveMinutes.Unit).to.equal(getTestData("MoveMinuteCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('35:02 -> Get move minutes by id', function(done) {

        agent
            .get(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.MoveMinutes).to.have.property('id');
                expect(response.body.Data.MoveMinutes).to.have.property('PatientUserId');
                expect(response.body.Data.MoveMinutes).to.have.property('MoveMinutes');
                expect(response.body.Data.MoveMinutes).to.have.property('Unit');
                expect(response.body.Data.MoveMinutes).to.have.property('RecordDate');

                expect(response.body.Data.MoveMinutes.PatientUserId).to.equal(getTestData("MoveMinuteCreateModel").PatientUserId);
                expect(response.body.Data.MoveMinutes.MoveMinutes).to.equal(getTestData("MoveMinuteCreateModel").MoveMinutes);
                expect(response.body.Data.MoveMinutes.Unit).to.equal(getTestData("MoveMinuteCreateModel").Unit);
            })
            .expect(200, done);
    });

    it('35:03 -> Search move minutes records', function(done) {
        loadMoveMinuteQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/move-minutes/search${loadMoveMinuteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.MoveMinutesRecords).to.have.property('TotalCount');
                expect(response.body.Data.MoveMinutesRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.MoveMinutesRecords).to.have.property('PageIndex');
                expect(response.body.Data.MoveMinutesRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.MoveMinutesRecords).to.have.property('Order');
                expect(response.body.Data.MoveMinutesRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.MoveMinutesRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.MoveMinutesRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('35:04 -> Update move minutes', function(done) {
        loadMoveMinuteUpdateModel();
        const updateModel = getTestData("MoveMinuteUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.MoveMinutes).to.have.property('id');
                expect(response.body.Data.MoveMinutes).to.have.property('PatientUserId');
                expect(response.body.Data.MoveMinutes).to.have.property('MoveMinutes');
                expect(response.body.Data.MoveMinutes).to.have.property('Unit');
                expect(response.body.Data.MoveMinutes).to.have.property('RecordDate');

                expect(response.body.Data.MoveMinutes.MoveMinutes).to.equal(getTestData("MoveMinuteUpdateModel").MoveMinutes);
                expect(response.body.Data.MoveMinutes.Unit).to.equal(getTestData("MoveMinuteUpdateModel").Unit);

            })
            .expect(200, done);
    });

    it('35:05 -> Delete move minutes', function(done) {
       
        agent
            .delete(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create move minutes again', function(done) {
        loadMoveMinuteCreateModel();
        const createModel = getTestData("MoveMinuteCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/move-minutes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.MoveMinutes.id, 'MoveMinuteId');
                expect(response.body.Data.MoveMinutes).to.have.property('id');
                expect(response.body.Data.MoveMinutes).to.have.property('PatientUserId');
                expect(response.body.Data.MoveMinutes).to.have.property('MoveMinutes');
                expect(response.body.Data.MoveMinutes).to.have.property('Unit');
                expect(response.body.Data.MoveMinutes).to.have.property('RecordDate');

                setTestData(response.body.Data.MoveMinutes.id, 'MoveMinuteId');

                expect(response.body.Data.MoveMinutes.PatientUserId).to.equal(getTestData("MoveMinuteCreateModel").PatientUserId);
                expect(response.body.Data.MoveMinutes.MoveMinutes).to.equal(getTestData("MoveMinuteCreateModel").MoveMinutes);
                expect(response.body.Data.MoveMinutes.Unit).to.equal(getTestData("MoveMinuteCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('35:06 -> Negative - Create move minutes', function(done) {
        loadMoveMinuteCreateModel();
        const createModel = getTestData("MoveMinute");
        agent
            .post(`/api/v1/wellness/daily-records/move-minutes/`)
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

    it('35:07 -> Negative - Search move minutes records', function(done) {
        loadMoveMinuteQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/move-minutes/search${loadMoveMinuteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('35:08 -> Negative - Delete move minutes', function(done) {
       
        agent
            .delete(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId_1')}`)
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

export const loadMoveMinuteCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        MoveMinutes   : faker.number.int(100),
        Unit          : faker.string.symbol(),
        RecordDate    : faker.date.anytime()
  
    };
    setTestData(model, "MoveMinuteCreateModel");
};

export const loadMoveMinuteUpdateModel = async (
) => {
    const model = {
        MoveMinutes : faker.number.int(100),
        Unit        : faker.string.symbol(),
        RecordDate  : faker.date.anytime()
    };
    setTestData(model, "MoveMinuteUpdateModel");
};

function loadMoveMinuteQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
