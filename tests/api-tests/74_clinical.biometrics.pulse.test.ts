import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Pulse tests', function() {

    var agent = request.agent(infra._app);

    it('345 - Create pulse', function(done) {
        loadPulseCreateModel();
        const createModel = getTestData("PulseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Pulse.id, 'PulseId');
                expect(response.body.Data.Pulse).to.have.property('PatientUserId');
                expect(response.body.Data.Pulse).to.have.property('Pulse');
                expect(response.body.Data.Pulse).to.have.property('Unit');
                expect(response.body.Data.Pulse).to.have.property('RecordDate');
                expect(response.body.Data.Pulse).to.have.property('RecordedByUserId');
               
                setTestData(response.body.Data.Pulse.id, 'PulseId');

                expect(response.body.Data.Pulse.PatientUserId).to.equal(getTestData("PulseCreateModel").PatientUserId);
                expect(response.body.Data.Pulse.Pulse).to.equal(getTestData("PulseCreateModel").Pulse);
                expect(response.body.Data.Pulse.Unit).to.equal(getTestData("PulseCreateModel").Unit);
                expect(response.body.Data.Pulse.RecordDate).to.equal(getTestData("PulseCreateModel").RecordDate);

            })
            .expect(201, done);
    });

    it('346 - Get pulse by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {

                expect(response.body.Data.Pulse).to.have.property('id');
                expect(response.body.Data.Pulse).to.have.property('EhrId');
                expect(response.body.Data.Pulse).to.have.property('PatientUserId');
                expect(response.body.Data.Pulse).to.have.property('TerraSummaryId');
                expect(response.body.Data.Pulse).to.have.property('Provider');
                expect(response.body.Data.Pulse).to.have.property('Pulse');
                expect(response.body.Data.Pulse).to.have.property('Unit');
                expect(response.body.Data.Pulse).to.have.property('RecordDate');
                expect(response.body.Data.Pulse).to.have.property('RecordedByUserId');
                
            })
            .expect(200, done);
    });

    it('347 - Search pulse records', function(done) {
        loadPulseQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/pulse/search${loadPulseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.PulseRecords).to.have.property('TotalCount');
                expect(response.body.Data.PulseRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.PulseRecords).to.have.property('PageIndex');
                expect(response.body.Data.PulseRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.PulseRecords).to.have.property('Order');
                expect(response.body.Data.PulseRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.PulseRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.PulseRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('348 - Update pulse', function(done) {
        loadPulseUpdateModel();
        const updateModel = getTestData("PulseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Pulse).to.have.property('id');
                expect(response.body.Data.Pulse).to.have.property('EhrId');
                expect(response.body.Data.Pulse).to.have.property('PatientUserId');
                expect(response.body.Data.Pulse).to.have.property('TerraSummaryId');
                expect(response.body.Data.Pulse).to.have.property('Provider');
                expect(response.body.Data.Pulse).to.have.property('Pulse');
                expect(response.body.Data.Pulse).to.have.property('Unit');
                expect(response.body.Data.Pulse).to.have.property('RecordDate');
                expect(response.body.Data.Pulse).to.have.property('RecordedByUserId');

                expect(response.body.Data.Pulse.Pulse).to.equal(getTestData("PulseUpdateModel").Pulse);
                expect(response.body.Data.Pulse.RecordDate).to.equal(getTestData("PulseUpdateModel").RecordDate);

            })
            .expect(200, done);
    });

    it('349 - Delete pulse', function(done) {
        
        agent
            .delete(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create pulse again', function(done) {
        loadPulseCreateModel();
        const createModel = getTestData("PulseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Pulse.id, 'PulseId');
                expect(response.body.Data.Pulse).to.have.property('PatientUserId');
                expect(response.body.Data.Pulse).to.have.property('Pulse');
                expect(response.body.Data.Pulse).to.have.property('Unit');
                expect(response.body.Data.Pulse).to.have.property('RecordDate');
                expect(response.body.Data.Pulse).to.have.property('RecordedByUserId');
             
                setTestData(response.body.Data.Pulse.id, 'PulseId');

                expect(response.body.Data.Pulse.PatientUserId).to.equal(getTestData("PulseCreateModel").PatientUserId);
                expect(response.body.Data.Pulse.Pulse).to.equal(getTestData("PulseCreateModel").Pulse);
                expect(response.body.Data.Pulse.Unit).to.equal(getTestData("PulseCreateModel").Unit);
                expect(response.body.Data.Pulse.RecordDate).to.equal(getTestData("PulseCreateModel").RecordDate);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPulseCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        Pulse         : 72,
        Unit          : "bpm",
        RecordDate    : "2021-09-12T00:00:00.000Z"
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

function loadPulseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?minValue=70&maxValue=76';
    return queryString;
}
