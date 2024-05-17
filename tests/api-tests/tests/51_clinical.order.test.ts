import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { OrderStates, OrderTypes } from '../../../src/domain.types/clinical/order/order.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('51 - Order tests', function () {
    var agent = request.agent(infra._app);

    it('51:01 -> Create order', function (done) {
        loadOrderCreateModel();
        const createModel = getTestData('orderCreateModel');
        agent
            .post(`/api/v1/clinical/orders/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setOrderId(response, 'orderId_1');
                expectOrderProperties(response);

                expectOrderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('51:02 -> Get order by id', function (done) {
        agent
            .get(`/api/v1/clinical/orders/${getTestData('orderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectOrderProperties(response);

                expectOrderPropertyValues(response);
            })
            .expect(200, done);
    });

    it('51:03 -> Search order records', function (done) {
        loadOrderQueryString();
        agent
            .get(`/api/v1/clinical/orders/search${loadOrderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.OrderRecords).to.have.property('TotalCount');
                expect(response.body.Data.OrderRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.OrderRecords).to.have.property('PageIndex');
                expect(response.body.Data.OrderRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.OrderRecords).to.have.property('Order');
                expect(response.body.Data.OrderRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.OrderRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.OrderRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('51:04 -> Update order', function (done) {
        loadOrderUpdateModel();
        const updateModel = getTestData('orderUpdateModel');
        agent
            .put(`/api/v1/clinical/orders/${getTestData('orderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectOrderProperties(response);

                expect(response.body.Data.Order.PatientUserId).to.equal(getTestData('orderUpdateModel').PatientUserId);
                expect(response.body.Data.Order.DisplayId).to.equal(getTestData('orderUpdateModel').DisplayId);
                expect(response.body.Data.Order.MedicalPractitionerUserId).to.equal(
                    getTestData('orderUpdateModel').MedicalPractitionerUserId
                );
                expect(response.body.Data.Order.AdditionalInformation).to.equal(
                    getTestData('orderUpdateModel').AdditionalInformation
                );
            })
            .expect(200, done);
    });

    it('51:05 -> Delete order', function (done) {
        agent
            .delete(`/api/v1/clinical/orders/${getTestData('orderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create order again', function (done) {
        loadOrderCreateModel();
        const createModel = getTestData('orderCreateModel');
        agent
            .post(`/api/v1/clinical/orders/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setOrderId(response, 'orderId');
                expectOrderProperties(response);

                expectOrderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('51:06 -> Negative - Create order', function (done) {
        loadOrderCreateModel();
        const createModel = getTestData('orderCreateModel');
        agent
            .post(`/api/v1/clinical/orders/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('51:07 -> Negative - Get order by id', function (done) {
        agent
            .get(`/api/v1/clinical/orders/${getTestData('orderId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('51:08 -> Negative - Update order', function (done) {
        loadOrderUpdateModel();
        const updateModel = getTestData('orderUpdateModel');
        agent
            .put(`/api/v1/clinical/orders/${getTestData('orderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setOrderId(response, key) {
    setTestData(response.body.Data.Order.id, key);
}

function expectOrderProperties(response) {
    expect(response.body.Data.Order).to.have.property('id');
    expect(response.body.Data.Order).to.have.property('PatientUserId');
    expect(response.body.Data.Order).to.have.property('DisplayId');
    expect(response.body.Data.Order).to.have.property('MedicalPractitionerUserId');
    expect(response.body.Data.Order).to.have.property('OrderDate');
    expect(response.body.Data.Order).to.have.property('AdditionalInformation');
}

function expectOrderPropertyValues(response) {
    expect(response.body.Data.Order.PatientUserId).to.equal(getTestData('orderCreateModel').PatientUserId);
    expect(response.body.Data.Order.DisplayId).to.equal(getTestData('orderCreateModel').DisplayId);
    expect(response.body.Data.Order.MedicalPractitionerUserId).to.equal(
        getTestData('orderCreateModel').MedicalPractitionerUserId
    );
    expect(response.body.Data.Order.AdditionalInformation).to.equal(getTestData('orderCreateModel').AdditionalInformation);
}

export const loadOrderCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Type: getRandomEnumValue(OrderTypes),
        DisplayId: faker.string.uuid(),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        CurrentState: getRandomEnumValue(OrderStates),
        OrderDate: faker.date.anytime(),
        AdditionalInformation: faker.lorem.words(),
    };
    setTestData(model, 'orderCreateModel');
};

export const loadOrderUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Type: getRandomEnumValue(OrderTypes),
        DisplayId: faker.string.uuid(),
        MedicalPractitionerUserId: getTestData('doctorUserId'),
        CurrentState: getRandomEnumValue(OrderStates),
        OrderDate: faker.date.anytime(),
        AdditionalInformation: faker.lorem.words(),
    };
    setTestData(model, 'orderUpdateModel');
};

function loadOrderQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
