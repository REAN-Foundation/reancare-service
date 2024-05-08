import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { pastDateString } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('64 - Pulse tests', function () {
    var agent = request.agent(infra._app);

    it('64:01 -> Create pulse', function (done) {
        loadPulseCreateModel();
        const createModel = getTestData('pulseCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setPulseId(response, 'pulseId_1');
                expectPulseProperties(response);

                expectPulsePropertyValues(response);
            })
            .expect(201, done);
    });

    it('64:02 -> Get pulse by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/pulse/${getTestData('pulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectPulseProperties(response);

                expectPulsePropertyValues(response);
            })
            .expect(200, done);
    });

    it('64:03 -> Search pulse records', function (done) {
        loadPulseQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/pulse/search${loadPulseQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('64:04 -> Update pulse', function (done) {
        loadPulseUpdateModel();
        const updateModel = getTestData('pulseUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/pulse/${getTestData('pulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectPulseProperties(response);

                expect(response.body.Data.Pulse.Pulse).to.equal(getTestData('pulseUpdateModel').Pulse);
            })
            .expect(200, done);
    });

    it('64:05 -> Delete pulse', function (done) {
        agent
            .delete(`/api/v1/clinical/biometrics/pulse/${getTestData('pulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create pulse again', function (done) {
        loadPulseCreateModel();
        const createModel = getTestData('pulseCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setPulseId(response, 'pulseId');
                expectPulseProperties(response);

                expectPulsePropertyValues(response);
            })
            .expect(201, done);
    });

    it('64:06 -> Negative - Create pulse', function (done) {
        loadNegativePulseCreateModel();
        const createModel = getTestData('negativePulseCreateModel');
        agent
            .post(`/api/v1/clinical/biometrics/pulse`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('64:07 -> Negative - Get pulse by id', function (done) {
        agent
            .get(`/api/v1/clinical/biometrics/pulse/${getTestData('pulseId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('64:08 -> Negative - Update pulse', function (done) {
        loadPulseUpdateModel();
        const updateModel = getTestData('pulseUpdateModel');
        agent
            .put(`/api/v1/clinical/biometrics/pulse/${getTestData('pulseId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setPulseId(response, key) {
    setTestData(response.body.Data.Pulse.id, key);
}

function expectPulseProperties(response) {
    expect(response.body.Data.Pulse).to.have.property('PatientUserId');
    expect(response.body.Data.Pulse).to.have.property('Pulse');
    expect(response.body.Data.Pulse).to.have.property('Unit');
    expect(response.body.Data.Pulse).to.have.property('RecordDate');
    expect(response.body.Data.Pulse).to.have.property('RecordedByUserId');
}

function expectPulsePropertyValues(response) {
    expect(response.body.Data.Pulse.PatientUserId).to.equal(getTestData('pulseCreateModel').PatientUserId);
    expect(response.body.Data.Pulse.Pulse).to.equal(getTestData('pulseCreateModel').Pulse);
    expect(response.body.Data.Pulse.Unit).to.equal(getTestData('pulseCreateModel').Unit);
}

export const loadPulseCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Pulse: faker.number.int({ min: 70, max: 75 }),
        Unit: 'bpm',
        RecordDate: pastDateString,
    };
    setTestData(model, 'pulseCreateModel');
};

export const loadPulseUpdateModel = async () => {
    const model = {
        Pulse: faker.number.int({ min: 70, max: 75 }),
        RecordDate: pastDateString,
    };
    setTestData(model, 'pulseUpdateModel');
};

function loadPulseQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativePulseCreateModel = async () => {
    const model = {
        Unit: faker.string.symbol(),
        RecordDate: faker.date.anytime(),
    };
    setTestData(model, 'negativePulseCreateModel');
};
