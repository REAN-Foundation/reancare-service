import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Move minutes records tests', function() {

    var agent = request.agent(infra._app);

    it('163 - Create move minutes', function(done) {
        loadMoveMinuteCreateModel();
        const createModel = getTestData("MoveMinuteCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/move-minutes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.MoveMinutes.RecordDate).to.equal(getTestData("MoveMinuteCreateModel").RecordDate);

            })
            .expect(201, done);
    });

    it('164 - Get move minutes by id', function(done) {

        agent
            .get(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.MoveMinutes.RecordDate).to.equal(getTestData("MoveMinuteCreateModel").RecordDate);
            })
            .expect(200, done);
    });

    it('165 - Search move minutes records', function(done) {
        loadMoveMinuteQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/move-minutes/search${loadMoveMinuteQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('166 - Update move minutes', function(done) {
        loadMoveMinuteUpdateModel();
        const updateModel = getTestData("MoveMinuteUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.MoveMinutes.RecordDate).to.equal(getTestData("MoveMinuteUpdateModel").RecordDate);

            })
            .expect(200, done);
    });

    it('167 - Delete move minutes', function(done) {
       
        agent
            .delete(`/api/v1/wellness/daily-records/move-minutes/${getTestData('MoveMinuteId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.MoveMinutes.RecordDate).to.equal(getTestData("MoveMinuteCreateModel").RecordDate);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadMoveMinuteCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        MoveMinutes   : 50,
        Unit          : "mins",
        RecordDate    : "2021-09-15T00:00:00.000Z"
  
    };
    setTestData(model, "MoveMinuteCreateModel");
};

export const loadMoveMinuteUpdateModel = async (
) => {
    const model = {
        MoveMinutes : 85,
        Unit        : "mins",
        RecordDate  : "2021-09-14T00:00:00.000Z"
    };
    setTestData(model, "MoveMinuteUpdateModel");
};

function loadMoveMinuteQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?moveMinutes=50';
    return queryString;
}
