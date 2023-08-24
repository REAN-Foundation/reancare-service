import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Step counts records tests', function() {

    var agent = request.agent(infra._app);

    it('91 - Negative - Create step counts', function(done) {
        loadStepCountCreateModel();
        const createModel = getTestData("StepCount");
        agent
            .post(`/api/v1/wellness/daily-records/step-counts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('92 - Negative - Get step counts by id', function(done) {
    
        agent
            .get(`/api/v1/wellness/daily-records/step-counts/${getTestData('StepCount')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('93 - Negative - Update step counts', function(done) {
        loadStepCountUpdateModel();
        const updateModel = getTestData("StepCountUpdateModel");
        agent
            .put(`/api/v1/wellness/daily-records/step-counts/${getTestData('StepCountId')}`)
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
