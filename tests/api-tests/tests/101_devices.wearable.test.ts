import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('101 - Wearable tests', function () {
    var agent = request.agent(infra._app);

    it('101:01 -> Create wearable', function (done) {
        loadWearableCreateModel();
        const createModel = getTestData('wearableCreateModel');
        agent
            .post(`/api/v1/devices/wearables`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setWearableDeviceDetailId(response, 'wearableId_1');
                expectWearableDeviceDetailProperties(response);

                expectWearableDeviceDetailPropertyValues(response);
            })
            .expect(201, done);
    });

    // it('101:02 -> Get user wearable', function (done) {
    //     agent
    //         .get(`/api/v1/devices/wearables/patients/${getTestData("patientUserId")}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
    //         .expect((response) => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('101:03 -> Get wearable by id', function (done) {
        agent
            .get(`/api/v1/devices/wearables/${getTestData('wearableId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectWearableDeviceDetailProperties(response);

                expectWearableDeviceDetailPropertyValues(response);
            })
            .expect(200, done);
    });

    it('101:04 -> Search records', function (done) {
        loadWearableQueryString();
        agent
            .get(`/api/v1/devices/wearables/search${loadWearableQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.WearableDeviceDetailRecords).to.have.property('TotalCount');
                expect(response.body.Data.WearableDeviceDetailRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.WearableDeviceDetailRecords).to.have.property('PageIndex');
                expect(response.body.Data.WearableDeviceDetailRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.WearableDeviceDetailRecords).to.have.property('Order');
                expect(response.body.Data.WearableDeviceDetailRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.WearableDeviceDetailRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.WearableDeviceDetailRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('101:05 -> Update wearable', function (done) {
        loadWearableUpdateModel();
        const updateModel = getTestData('wearableUpdateModel');
        agent
            .put(`/api/v1/devices/wearables/${getTestData('wearableId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectWearableDeviceDetailProperties(response);

                expect(response.body.Data.WearableDeviceDetail.PatientUserId).to.equal(
                    getTestData('wearableUpdateModel').PatientUserId
                );
                expect(response.body.Data.WearableDeviceDetail.TerraUserId).to.equal(
                    getTestData('wearableUpdateModel').TerraUserId
                );
                expect(response.body.Data.WearableDeviceDetail.Provider).to.equal(
                    getTestData('wearableUpdateModel').Provider
                );
                expect(response.body.Data.WearableDeviceDetail.Scopes).to.equal(getTestData('wearableUpdateModel').Scopes);
            })
            .expect(200, done);
    });

    it('101:06 -> Delete wearable', function (done) {
        agent
            .delete(`/api/v1/devices/wearables/${getTestData('wearableId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create wearable again', function (done) {
        loadWearableCreateModel();
        const createModel = getTestData('wearableCreateModel');
        agent
            .post(`/api/v1/devices/wearables/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setWearableDeviceDetailId(response, 'wearableId');
                expectWearableDeviceDetailProperties(response);

                expectWearableDeviceDetailPropertyValues(response);
            })
            .expect(201, done);
    });

    it('101:07 -> Negative - Create wearable', function (done) {
        loadNegativeWearableCreateModel();
        const createModel = getTestData('negativeWearableCreateModel');
        agent
            .post(`/api/v1/devices/wearables/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('101:08 -> Negative - Get wearable by id', function (done) {
        agent
            .get(`/api/v1/devices/wearables/${getTestData('wearableId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('101:09 -> Negative - Update wearable', function (done) {
        loadWearableUpdateModel();
        const updateModel = getTestData('wearableUpdateModel');
        agent
            .put(`/api/v1/devices/wearables/${getTestData('wearableId')}`)
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

function setWearableDeviceDetailId(response, key) {
    setTestData(response.body.Data.WearableDeviceDetail.id, key);
}

function expectWearableDeviceDetailProperties(response) {
    expect(response.body.Data.WearableDeviceDetail).to.have.property('PatientUserId');
    expect(response.body.Data.WearableDeviceDetail).to.have.property('TerraUserId');
    expect(response.body.Data.WearableDeviceDetail).to.have.property('Provider');
    expect(response.body.Data.WearableDeviceDetail).to.have.property('Scopes');
    expect(response.body.Data.WearableDeviceDetail).to.have.property('AuthenticatedAt');
    expect(response.body.Data.WearableDeviceDetail).to.have.property('DeauthenticatedAt');
}

function expectWearableDeviceDetailPropertyValues(response) {
    expect(response.body.Data.WearableDeviceDetail.PatientUserId).to.equal(getTestData('wearableCreateModel').PatientUserId);
    expect(response.body.Data.WearableDeviceDetail.TerraUserId).to.equal(getTestData('wearableCreateModel').TerraUserId);
    expect(response.body.Data.WearableDeviceDetail.Provider).to.equal(getTestData('wearableCreateModel').Provider);
    expect(response.body.Data.WearableDeviceDetail.Scopes).to.equal(getTestData('wearableCreateModel').Scopes);
}

export const loadWearableCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        TerraUserId: faker.string.uuid(),
        Provider: faker.lorem.word(4),
        Scopes: faker.lorem.word(4),
        AuthenticatedAt: startDate,
        DeauthenticatedAt: endDate,
    };
    setTestData(model, 'wearableCreateModel');
};

export const loadWearableUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        TerraUserId: faker.string.uuid(),
        Provider: faker.lorem.word(4),
        Scopes: faker.lorem.word(4),
        AuthenticatedAt: startDate,
        DeauthenticatedAt: endDate,
    };
    setTestData(model, 'wearableUpdateModel');
};

function loadWearableQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeWearableCreateModel = async () => {
    const model = {
        TerraUserId: faker.string.uuid(),
        Provider: faker.lorem.word(4),
        Scopes: faker.lorem.word(4),
        AuthenticatedAt: startDate,
        DeauthenticatedAt: endDate,
    };
    setTestData(model, 'negativeWearableCreateModel');
};
