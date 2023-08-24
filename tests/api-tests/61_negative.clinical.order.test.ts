import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Order tests', function() {

    var agent = request.agent(infra._app);

    it('150 - Negative - Create order', function(done) {
        loadOrderCreateModel();
        const createModel = getTestData("OrderCreateModel");
        agent
            .post(`/api/v1/clinical/orders/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('151 - Negative - Get order by id', function(done) {

        agent
            .get(`/api/v1/clinical/orders/${getTestData('OrderId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('152 - Negative - Update order', function(done) {
        loadOrderUpdateModel();
        const updateModel = getTestData("OrderUpdateModel");
        agent
            .put(`/api/v1/clinical/orders/${getTestData('Order')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadOrderCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "OrderCreateModel");
};

export const loadOrderUpdateModel = async (
) => {
    const model = {
        PatientUserId             : getTestData("PatientUserId"),
        Type                      : "Drug order",
        DisplayId                 : "1234",
        MedicalPractitionerUserId : getTestData("DoctorUserId"),
        CurrentState              : "Initiated",
        OrderDate                 : "2021-09-23T00:00:00.000Z",
        AdditionalInformation     : "Some additional information"
    };
    setTestData(model, "OrderUpdateModel");
};
