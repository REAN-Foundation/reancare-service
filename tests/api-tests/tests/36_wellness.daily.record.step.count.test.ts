import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('36 - Step counts records tests', function () {
    var agent = request.agent(infra._app);

    it('36:01 -> Create step counts', function (done) {
        loadStepCountCreateModel();
        const createModel = getTestData('stepCountCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/step-counts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setStepCountId(response, 'stepCountId_1');
                expectStepCountProperties(response);

                expectStepCountPropertyValues(response);
            })
            .expect(201, done);
    });

    it('36:02 -> Get step counts by id', function (done) {
        agent
            .get(`/api/v1/wellness/daily-records/step-counts/${getTestData('stepCountId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectStepCountProperties(response);

                expectStepCountPropertyValues(response);
            })
            .expect(200, done);
    });

    it('36:03 -> Search step counts records', function (done) {
        loadStepCountQueryString();
        agent
            .get(`/api/v1/wellness/daily-records/step-counts/search${loadStepCountQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('36:04 -> Update step counts', function (done) {
        loadStepCountUpdateModel();
        const updateModel = getTestData('stepCountUpdateModel');
        agent
            .put(`/api/v1/wellness/daily-records/step-counts/${getTestData('stepCountId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectStepCountProperties(response);

                expect(response.body.Data.StepCount.StepCount).to.equal(getTestData('stepCountUpdateModel').StepCount);
            })
            .expect(200, done);
    });

    it('36:05 -> Delete step counts', function (done) {
        agent
            .delete(`/api/v1/wellness/daily-records/step-counts/${getTestData('stepCountId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create step counts again', function (done) {
        loadStepCountCreateModel();
        const createModel = getTestData('stepCountCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/step-counts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setStepCountId(response, 'stepCountId');
                expectStepCountProperties(response);

                expectStepCountPropertyValues(response);
            })
            .expect(201, done);
    });

    it('36:06 -> Negative - Create step counts', function (done) {
        loadStepCountCreateModel();
        const createModel = getTestData('StepCount');
        agent
            .post(`/api/v1/wellness/daily-records/step-counts/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('36:07 -> Negative - Get step counts by id', function (done) {
        agent
            .get(`/api/v1/wellness/daily-records/step-counts/${getTestData('stepCountId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('36:08 -> Negative - Update step counts', function (done) {
        loadStepCountUpdateModel();
        const updateModel = getTestData('stepCountUpdateModel');
        agent
            .put(`/api/v1/wellness/daily-records/step-counts/${getTestData('stepCountId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setStepCountId(response, key) {
    setTestData(response.body.Data.StepCount.id, key);
}

function expectStepCountProperties(response) {
    expect(response.body.Data.StepCount).to.have.property('id');
    expect(response.body.Data.StepCount).to.have.property('PatientUserId');
    expect(response.body.Data.StepCount).to.have.property('StepCount');
    expect(response.body.Data.StepCount).to.have.property('RecordDate');
    expect(response.body.Data.StepCount).to.have.property('Provider');
}

function expectStepCountPropertyValues(response) {
    expect(response.body.Data.StepCount.PatientUserId).to.equal(getTestData('stepCountCreateModel').PatientUserId);
    expect(response.body.Data.StepCount.StepCount).to.equal(getTestData('stepCountCreateModel').StepCount);
    expect(response.body.Data.StepCount.Provider).to.equal(getTestData('stepCountCreateModel').Provider);
}

export const loadStepCountCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        StepCount: faker.number.int(10000),
        RecordDate: faker.date.anytime(),
        Provider: faker.word.words(1),
    };
    setTestData(model, 'stepCountCreateModel');
};

export const loadStepCountUpdateModel = async () => {
    const model = {
        StepCount: faker.number.int(10000),
    };
    setTestData(model, 'stepCountUpdateModel');
};

function loadStepCountQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
