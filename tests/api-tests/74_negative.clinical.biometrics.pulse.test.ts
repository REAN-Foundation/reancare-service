import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Pulse tests', function() {

    var agent = request.agent(infra._app);

    it('193 - Negative - Create pulse', function(done) {
        loadPulseCreateModel();
        const createModel = getTestData("PulseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
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

    it('194 - Negative - Get pulse by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/biometrics/pulse/${getTestData('Pulse')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('195 - Negative - Update pulse', function(done) {
        loadPulseUpdateModel();
        const updateModel = getTestData("PulseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPulseCreateModel = async (
) => {
    const model = {
      
    };
    setTestData(model, "PulseCreateModel");
};

export const loadPulseUpdateModel = async (
) => {
    const model = {
        Pulse      : 74,
        RecordDate : "2021-09-12T00:00:00.000Z"
    };
    setTestData(model, "PulseUpdateModel");
};
