import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('92 - Hospital system tests', function () {
    var agent = request.agent(infra._app);

    it('92:01 -> Create hospital system', function (done) {
        loadHospitalSystemCreateModel();
        const createModel = getTestData('HospitalSystemCreateModel');
        agent
            .post(`/api/v1/health-systems/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.HealthSystem.id, 'HospitalSystemId_1');
                expect(response.body.Data.HealthSystem).to.have.property('Name');
                expect(response.body.Data.HealthSystem).to.have.property('Tags');

                setTestData(response.body.Data.HealthSystem.id, 'HospitalSystemId_1');

                expect(response.body.Data.HealthSystem.Name).to.equal(getTestData('HospitalSystemCreateModel').Name);
            })
            .expect(201, done);
    });

    it('92:02 -> Get hospital system With Tags', function (done) {
        agent
            .get(`/api/v1/health-systems/by-tags`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('92:03 -> Get hospital system by id', function (done) {
        agent
            .get(`/api/v1/health-systems/${getTestData('HospitalSystemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.HealthSystem).to.have.property('Name');
                expect(response.body.Data.HealthSystem).to.have.property('Tags');

                expect(response.body.Data.HealthSystem.Name).to.equal(getTestData('HospitalSystemCreateModel').Name);
            })
            .expect(200, done);
    });

    it('92:04 -> Search records', function (done) {
        loadHospitalSystemQueryString();
        agent
            .get(`/api/v1/health-systems/search${loadHospitalSystemQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.HealthSystems).to.have.property('TotalCount');
                expect(response.body.Data.HealthSystems).to.have.property('RetrievedCount');
                expect(response.body.Data.HealthSystems).to.have.property('PageIndex');
                expect(response.body.Data.HealthSystems).to.have.property('ItemsPerPage');
                expect(response.body.Data.HealthSystems).to.have.property('Order');
                expect(response.body.Data.HealthSystems.TotalCount).to.greaterThan(0);
                expect(response.body.Data.HealthSystems.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.HealthSystems.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('92:05 -> Update hospital system', function (done) {
        loadHospitalSystemUpdateModel();
        const updateModel = getTestData('HospitalSystemUpdateModel');
        agent
            .put(`/api/v1/health-systems/${getTestData('HospitalSystemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.HealthSystem).to.have.property('Name');
                expect(response.body.Data.HealthSystem).to.have.property('Tags');

                expect(response.body.Data.HealthSystem.Name).to.equal(getTestData('HospitalSystemUpdateModel').Name);
            })
            .expect(200, done);
    });

    it('92:06 -> Delete hospital system', function (done) {
        agent
            .delete(`/api/v1/health-systems/${getTestData('HospitalSystemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create hospital system again', function (done) {
        loadHospitalSystemCreateModel();
        const createModel = getTestData('HospitalSystemCreateModel');
        agent
            .post(`/api/v1/health-systems/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.HealthSystem.id, 'HospitalSystemId');
                expect(response.body.Data.HealthSystem).to.have.property('Name');
                expect(response.body.Data.HealthSystem).to.have.property('Tags');

                setTestData(response.body.Data.HealthSystem.id, 'HospitalSystemId');

                expect(response.body.Data.HealthSystem.Name).to.equal(getTestData('HospitalSystemCreateModel').Name);
            })
            .expect(201, done);
    });

    it('92:07 -> Negative - Create hospital system', function (done) {
        loadNegativeHospitalSystemCreateModel();
        const createModel = getTestData('NegativeHospitalSystemCreateModel');
        agent
            .post(`/api/v1/health-systems/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('92:08 -> Negative - Get hospital system by id', function (done) {
        agent
            .get(`/api/v1/health-systems/${getTestData('HospitalSystemId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('DoctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('92:09 -> Negative - Update hospital system', function (done) {
        loadHospitalSystemUpdateModel();
        const updateModel = getTestData('HospitalSystemUpdateModel');
        agent
            .put(`/api/v1/health-systems/${getTestData('HospitalSystemId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadHospitalSystemCreateModel = async () => {
    const model = {
        TenantId: getTestData("TenantId"),
        Name: faker.person.fullName(),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'HospitalSystemCreateModel');
};

export const loadHospitalSystemUpdateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'HospitalSystemUpdateModel');
};

function loadHospitalSystemQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeHospitalSystemCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'NegativeHospitalSystemCreateModel');
};
