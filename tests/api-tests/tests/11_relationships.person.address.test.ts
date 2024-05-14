import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('11 - Person address tests', function () {
    var agent = request.agent(infra._app);

    it('11:01 -> Add address to person', function (done) {
        loadPersonAddressCreateModel();
        const createModel = getTestData('personAddressCreateModel');
        agent
            .post(`/api/v1/persons/${getTestData('patientPersonId')}/add-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('11:02 -> Get address for person after addition', function (done) {
        agent
            .get(`/api/v1/persons/${getTestData('patientPersonId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('11:03 -> Removal an address from person', function (done) {
        loadPersonAddressRemoveModel();
        const removeModel = getTestData('personAddressRemoveModel');
        agent
            .post(`/api/v1/persons/${getTestData('patientPersonId')}/remove-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(removeModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('11:04 -> Get address for person after removal', function (done) {
        agent
            .get(`/api/v1/persons/${getTestData('patientPersonId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('11:05 -> Negative - Add address to person', function (done) {
        loadPersonAddressCreateModel();
        const createModel = getTestData('personAddressCreateModel');
        agent
            .post(`/api/v1/persons/${getTestData('patientPersonId')}/add-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('11:06 -> Negative - Get address for person after addition', function (done) {
        agent
            .get(`/api/v1/persons/${getTestData('patientPersonId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('11:07 -> Negative - Removal an address from person', function (done) {
        loadPersonAddressRemoveModel();
        const removeModel = getTestData('personAddressRemoveModel');
        agent
            .post(`/api/v1/persons/${getTestData('patientPersonId')}/remove-address/${getTestData('addressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(removeModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadPersonAddressCreateModel = async () => {
    const model = {
        PersonId: getTestData('patientUserId'),
    };
    setTestData(model, 'personAddressCreateModel');
};

export const loadPersonAddressRemoveModel = async () => {
    const model = {
        PersonId: getTestData('patientPersonId'),
    };
    setTestData(model, 'personAddressRemoveModel');
};
