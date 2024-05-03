import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('93 - Hospital tests', function () {
    var agent = request.agent(infra._app);

    it('93:01 -> Create hospital', function (done) {
        loadHospitalCreateModel();
        const createModel = getTestData('hospitalCreateModel');
        agent
            .post(`/api/v1/hospitals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setHospitalId(response, 'hospitalId_1');
                expectHospitalProperties(response);

                expectHospitalPropertyValues(response);
            })
            .expect(201, done);
    });

    it('93:02 -> Get hospitals for health system', function (done) {
        agent
            .get(`/api/v1/hospitals/health-systems/${getTestData('hospitalSystemId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('93:03 -> Get hospital by id', function (done) {
        agent
            .get(`/api/v1/hospitals/${getTestData('hospitalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expectHospitalProperties(response);

                expectHospitalPropertyValues(response);
            })
            .expect(200, done);
    });

    it('93:04 -> Search records', function (done) {
        loadHospitalQueryString();
        agent
            .get(`/api/v1/hospitals/search${loadHospitalQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Hospitals).to.have.property('TotalCount');
                expect(response.body.Data.Hospitals).to.have.property('RetrievedCount');
                expect(response.body.Data.Hospitals).to.have.property('PageIndex');
                expect(response.body.Data.Hospitals).to.have.property('ItemsPerPage');
                expect(response.body.Data.Hospitals).to.have.property('Order');
                expect(response.body.Data.Hospitals.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Hospitals.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Hospitals.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('93:05 -> Update hospital', function (done) {
        loadHospitalUpdateModel();
        const updateModel = getTestData('hospitalUpdateModel');
        agent
            .put(`/api/v1/hospitals/${getTestData('hospitalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectHospitalProperties(response);

                expect(response.body.Data.Hospital.Name).to.equal(getTestData('hospitalUpdateModel').Name);
                expect(response.body.Data.Hospital.HealthSystemId).to.equal(
                    getTestData('hospitalUpdateModel').HealthSystemId
                );
            })
            .expect(200, done);
    });

    it('93:06 -> Delete hospital', function (done) {
        agent
            .delete(`/api/v1/hospitals/${getTestData('hospitalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create hospital again', function (done) {
        loadHospitalCreateModel();
        const createModel = getTestData('hospitalCreateModel');
        agent
            .post(`/api/v1/hospitals/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setHospitalId(response, 'hospitalId');
                expectHospitalProperties(response);

                expectHospitalPropertyValues(response);
            })
            .expect(201, done);
    });

    it('93:07 -> Negative - Create hospital', function (done) {
        loadNegativeHospitalCreateModel();
        const createModel = getTestData('negativeHospitalCreateModel');
        agent
            .post(`/api/v1/hospitals/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('93:08 -> Negative - Get hospital by id', function (done) {
        agent
            .get(`/api/v1/hospitals/${getTestData('hospitalId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('93:09 -> Negative - Update hospital', function (done) {
        loadHospitalUpdateModel();
        const updateModel = getTestData('hospitalUpdateModel');
        agent
            .put(`/api/v1/hospitals/${getTestData('hospitalId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setHospitalId(response, key) {
    setTestData(response.body.Data.Hospital.id, key);
}

function expectHospitalProperties(response) {
    expect(response.body.Data.Hospital).to.have.property('Name');
    expect(response.body.Data.Hospital).to.have.property('HealthSystemId');
    expect(response.body.Data.Hospital).to.have.property('Tags');
}

function expectHospitalPropertyValues(response) {
    expect(response.body.Data.Hospital.Name).to.equal(getTestData('hospitalCreateModel').Name);
    expect(response.body.Data.Hospital.HealthSystemId).to.equal(getTestData('hospitalCreateModel').HealthSystemId);
}

export const loadHospitalCreateModel = async () => {
    const model = {
        TenantId: getTestData('tenantId'),
        Name: faker.person.fullName(),
        HealthSystemId: getTestData('hospitalSystemId'),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'hospitalCreateModel');
};

export const loadHospitalUpdateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        HealthSystemId: getTestData('hospitalSystemId'),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'hospitalUpdateModel');
};

function loadHospitalQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeHospitalCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        HealthSystemId: getTestData('hospitalSystemId'),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'negativeHospitalCreateModel');
};
