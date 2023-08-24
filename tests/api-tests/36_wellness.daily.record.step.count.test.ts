import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Step counts records tests', function() {

    var agent = request.agent(infra._app);

    it('168 - Create step counts', function(done) {
        loadStepCountCreateModel();
        const createModel = getTestData("StepCountCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/step-counts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.StepCount.id, 'StepCountId');
                expect(response.body.Data.StepCount).to.have.property('id');
                expect(response.body.Data.StepCount).to.have.property('PatientUserId');
                expect(response.body.Data.StepCount).to.have.property('StepCount');
                expect(response.body.Data.StepCount).to.have.property('RecordDate');

                setTestData(response.body.Data.StepCount.id, 'StepCountId');

                expect(response.body.Data.StepCount.PatientUserId).to.equal(getTestData("StepCountCreateModel").PatientUserId);
                expect(response.body.Data.StepCount.StepCount).to.equal(getTestData("StepCountCreateModel").StepCount);
                expect(response.body.Data.StepCount.RecordDate).to.equal(getTestData("StepCountCreateModel").RecordDate);

            })
            .expect(201, done);
    });

    it('169 - Get step counts by id', function(done) {
    
        agent
            .get(`/api/v1/wellness/daily-records/step-counts/${getTestData('StepCountId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.StepCount).to.have.property('id');
                expect(response.body.Data.StepCount).to.have.property('PatientUserId');
                expect(response.body.Data.StepCount).to.have.property('StepCount');
                expect(response.body.Data.StepCount).to.have.property('RecordDate');

                expect(response.body.Data.StepCount.PatientUserId).to.equal(getTestData("StepCountCreateModel").PatientUserId);
                expect(response.body.Data.StepCount.StepCount).to.equal(getTestData("StepCountCreateModel").StepCount);
                expect(response.body.Data.StepCount.RecordDate).to.equal(getTestData("StepCountCreateModel").RecordDate);
            })
            .expect(200, done);
    });

    it('170 - Search step counts records', function(done) {
        loadStepCountQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/step-counts/search${loadStepCountQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.StepCountRecords).to.have.property('TotalCount');
                expect(response.body.Data.StepCountRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.StepCountRecords).to.have.property('PageIndex');
                expect(response.body.Data.StepCountRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.StepCountRecords).to.have.property('Order');
                expect(response.body.Data.StepCountRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.StepCountRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.StepCountRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('171 - Update step counts', function(done) {
        loadStepCountUpdateModel();
        const updateModel = getTestData("StepCountUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/step-counts/${getTestData('StepCountId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.StepCount).to.have.property('id');
                expect(response.body.Data.StepCount).to.have.property('PatientUserId');
                expect(response.body.Data.StepCount).to.have.property('StepCount');
                expect(response.body.Data.StepCount).to.have.property('RecordDate');

                expect(response.body.Data.StepCount.StepCount).to.equal(getTestData("StepCountUpdateModel").StepCount);

            })
            .expect(200, done);
    });

    it('172 - Delete step counts', function(done) {

        agent
            .delete(`/api/v1/wellness/daily-records/step-counts/${getTestData('StepCountId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create step counts again', function(done) {
        loadStepCountCreateModel();
        const createModel = getTestData("StepCountCreateModel");
        agent
            .post(`/api/v1/wellness/daily-records/step-counts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.StepCount.id, 'StepCountId');
                expect(response.body.Data.StepCount).to.have.property('id');
                expect(response.body.Data.StepCount).to.have.property('PatientUserId');
                expect(response.body.Data.StepCount).to.have.property('StepCount');
                expect(response.body.Data.StepCount).to.have.property('RecordDate');

                setTestData(response.body.Data.StepCount.id, 'StepCountId');

                expect(response.body.Data.StepCount.PatientUserId).to.equal(getTestData("StepCountCreateModel").PatientUserId);
                expect(response.body.Data.StepCount.StepCount).to.equal(getTestData("StepCountCreateModel").StepCount);
                expect(response.body.Data.StepCount.RecordDate).to.equal(getTestData("StepCountCreateModel").RecordDate);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadStepCountCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        StepCount     : 1590,
        RecordDate    : "2021-09-15T00:00:00.000Z"
  
    };
    setTestData(model, "StepCountCreateModel");
};

export const loadStepCountUpdateModel = async (
) => {
    const model = {
        StepCount : 10000,
    };
    setTestData(model, "StepCountUpdateModel");
};

function loadStepCountQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?stepCount=1590';
    return queryString;
}
