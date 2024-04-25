import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { pastDateString } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('64 - Pulse tests', function() {

    var agent = request.agent(infra._app);

    it('64:01 -> Create pulse', function(done) {
        loadPulseCreateModel();
        const createModel = getTestData("PulseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Pulse.id, 'PulseId_1');
                expect(response.body.Data.Pulse).to.have.property('PatientUserId');
                expect(response.body.Data.Pulse).to.have.property('Pulse');
                expect(response.body.Data.Pulse).to.have.property('Unit');
                expect(response.body.Data.Pulse).to.have.property('RecordDate');
                expect(response.body.Data.Pulse).to.have.property('RecordedByUserId');
               
                setTestData(response.body.Data.Pulse.id, 'PulseId_1');

                expect(response.body.Data.Pulse.PatientUserId).to.equal(getTestData("PulseCreateModel").PatientUserId);
                expect(response.body.Data.Pulse.Pulse).to.equal(getTestData("PulseCreateModel").Pulse);
                expect(response.body.Data.Pulse.Unit).to.equal(getTestData("PulseCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('64:02 -> Get pulse by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('64:03 -> Search pulse records', function(done) {
        loadPulseQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/pulse/search${loadPulseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('64:04 -> Update pulse', function(done) {
        loadPulseUpdateModel();
        const updateModel = getTestData("PulseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

            })
            .expect(200, done);
    });

    it('64:05 -> Delete pulse', function(done) {
        
        agent
            .delete(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

            })
            .expect(201, done);
    });

    it('64:06 -> Negative - Create pulse', function(done) {
        loadNegativePulseCreateModel();
        const createModel = getTestData("NegativePulseCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
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

    it('64:07 -> Negative - Get pulse by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(404, done);
    });

    it('64:08 -> Negative - Update pulse', function(done) {
        loadPulseUpdateModel();
        const updateModel = getTestData("PulseUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/pulse/${getTestData('PulseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
        PatientUserId : getTestData("PatientUserId"),
        Pulse         : faker.number.int({ min: 70, max:75 }),
        Unit          : "bpm",
        RecordDate    : pastDateString
    };
    setTestData(model, "PulseCreateModel");
};

export const loadPulseUpdateModel = async (
) => {
    const model = {
        Pulse      : faker.number.int({ min: 70, max:75 }),
        RecordDate : pastDateString
    };
    setTestData(model, "PulseUpdateModel");
};

function loadPulseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativePulseCreateModel = async (
) => {
    const model = {
        Unit       : faker.string.symbol(),
        RecordDate : faker.date.anytime() 
    };
    setTestData(model, "NegativePulseCreateModel");
};
