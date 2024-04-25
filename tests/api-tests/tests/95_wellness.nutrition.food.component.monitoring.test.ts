import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';
import { FoodComponentMonitoringTypes } from '../../../src/domain.types/wellness/food.component.monitoring/food.component.monitoring.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('95 - Food component monitoring tests', function () {
    var agent = request.agent(infra._app);

    it('95:01 -> Create food component monitoring', function (done) {
        loadFoodComponentMonitoringCreateModel();
        const createModel = getTestData('FoodComponentMonitoringCreateModel');
        agent
            .post(`/api/v1/wellness/food-components-monitoring/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.FoodComponentMonitoring.id, 'FoodComponentMonitoringId_1');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('PatientUserId');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('MonitoredFoodComponent');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Amount');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Unit');

                setTestData(response.body.Data.FoodComponentMonitoring.id, 'FoodComponentMonitoringId_1');

                expect(response.body.Data.FoodComponentMonitoring.PatientUserId).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').PatientUserId
                );
                expect(response.body.Data.FoodComponentMonitoring.MonitoredFoodComponent).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').MonitoredFoodComponent
                );
                expect(response.body.Data.FoodComponentMonitoring.Amount).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').Amount
                );
                expect(response.body.Data.FoodComponentMonitoring.Unit).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').Unit
                );
            })
            .expect(201, done);
    });

    it('95:02 -> Get food component monitoring by id', function (done) {
        agent
            .get(`/api/v1/wellness/food-components-monitoring/${getTestData('FoodComponentMonitoringId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('PatientUserId');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('MonitoredFoodComponent');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Amount');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Unit');

                expect(response.body.Data.FoodComponentMonitoring.PatientUserId).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').PatientUserId
                );
                expect(response.body.Data.FoodComponentMonitoring.MonitoredFoodComponent).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').MonitoredFoodComponent
                );
                expect(response.body.Data.FoodComponentMonitoring.Amount).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').Amount
                );
                expect(response.body.Data.FoodComponentMonitoring.Unit).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').Unit
                );
            })
            .expect(200, done);
    });

    it('95:03 -> Search records', function (done) {
        loadFoodComponentMonitoringQueryString();
        agent
            .get(`/api/v1/wellness/food-components-monitoring/search${loadFoodComponentMonitoringQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('95:05 -> Update food component monitoring', function (done) {
        loadFoodComponentMonitoringUpdateModel();
        const updateModel = getTestData('FoodComponentMonitoringUpdateModel');
        agent
            .put(`/api/v1/wellness/food-components-monitoring/${getTestData('FoodComponentMonitoringId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('PatientUserId');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('MonitoredFoodComponent');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Amount');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Unit');

                expect(response.body.Data.FoodComponentMonitoring.PatientUserId).to.equal(
                    getTestData('FoodComponentMonitoringUpdateModel').PatientUserId
                );
                expect(response.body.Data.FoodComponentMonitoring.MonitoredFoodComponent).to.equal(
                    getTestData('FoodComponentMonitoringUpdateModel').MonitoredFoodComponent
                );
                expect(response.body.Data.FoodComponentMonitoring.Amount).to.equal(
                    getTestData('FoodComponentMonitoringUpdateModel').Amount
                );
                expect(response.body.Data.FoodComponentMonitoring.Unit).to.equal(
                    getTestData('FoodComponentMonitoringUpdateModel').Unit
                );
            })
            .expect(200, done);
    });

    it('95:06 -> Delete food component monitoring', function (done) {
        agent
            .delete(`/api/v1/wellness/food-components-monitoring/${getTestData('FoodComponentMonitoringId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create food component monitoring again', function (done) {
        loadFoodComponentMonitoringCreateModel();
        const createModel = getTestData('FoodComponentMonitoringCreateModel');
        agent
            .post(`/api/v1/wellness/food-components-monitoring/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.FoodComponentMonitoring.id, 'FoodComponentMonitoringId');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('PatientUserId');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('MonitoredFoodComponent');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Amount');
                expect(response.body.Data.FoodComponentMonitoring).to.have.property('Unit');

                setTestData(response.body.Data.FoodComponentMonitoring.id, 'FoodComponentMonitoringId');

                expect(response.body.Data.FoodComponentMonitoring.PatientUserId).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').PatientUserId
                );
                expect(response.body.Data.FoodComponentMonitoring.MonitoredFoodComponent).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').MonitoredFoodComponent
                );
                expect(response.body.Data.FoodComponentMonitoring.Amount).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').Amount
                );
                expect(response.body.Data.FoodComponentMonitoring.Unit).to.equal(
                    getTestData('FoodComponentMonitoringCreateModel').Unit
                );
            })
            .expect(201, done);
    });

    it('95:07 -> Negative - Create food component monitoring', function (done) {
        loadFoodComponentMonitoringCreateModel();
        const createModel = getTestData('FoodComponentMonitoringCreateModel');
        agent
            .post(`/api/v1/wellness/food-components-monitoring/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('95:08 -> Negative - Get food component monitoring by id', function (done) {
        agent
            .get(`/api/v1/wellness/food-components-monitoring/${getTestData('FoodComponentMonitoringId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('95:10 -> Negative - Update food component monitoring', function (done) {
        loadFoodComponentMonitoringUpdateModel();
        const updateModel = getTestData('FoodComponentMonitoringUpdateModel');
        agent
            .put(`/api/v1/wellness/food-components-monitoring/${getTestData('FoodComponentMonitoringId')}`)
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

export const loadFoodComponentMonitoringCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('PatientUserId_01'),
        MonitoredFoodComponent: getRandomEnumValue(FoodComponentMonitoringTypes),
        Amount: faker.number.float({ multipleOf: 0.25, min: 0, max:10 }),
        Unit: faker.lorem.word(),
    };
    setTestData(model, 'FoodComponentMonitoringCreateModel');
};

export const loadFoodComponentMonitoringUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('PatientUserId_01'),
        MonitoredFoodComponent: getRandomEnumValue(FoodComponentMonitoringTypes),
        Amount: faker.number.float({ multipleOf: 0.25, min: 0, max:10 }),
        Unit: faker.lorem.word(),
    };
    setTestData(model, 'FoodComponentMonitoringUpdateModel');
};

function loadFoodComponentMonitoringQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
