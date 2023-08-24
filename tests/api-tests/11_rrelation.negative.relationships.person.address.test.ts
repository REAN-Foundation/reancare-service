import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Person address tests', function() {

    var agent = request.agent(infra._app);

    it('21 - Negative - Add address to person', function(done) {
        loadPersonAddressCreateModel();
        const createModel = getTestData("PersonAddressCreateModel");
        agent
            .post(`/api/v1/persons/${getTestData('PatientPersonId')}/add-address/${getTestData('AddressId1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('22 - Negative - Get address for person after addition', function(done) {
        agent
            .get(`/api/v1/persons/${getTestData('PatientPersonId')}/addresses`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC3PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });
    
    it('23 - Negative - Removal an address from person', function(done) {
        loadPersonAddressRemoveModel();
        const removeModel = getTestData("PersonAddressRemoveModel");
        agent
            .post(`/api/v1/persons/${getTestData('PatientPersonId')}/remove-address/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(removeModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPersonAddressCreateModel = async (
) => {
    const model = {
        PersonId : getTestData("PatientUserId")
    
    };
    setTestData(model, "PersonAddressCreateModel");
};

export const loadPersonAddressRemoveModel = async (
) => {
    const model = {
        PersonId : getTestData("PatientPersonId")
      
    };
    setTestData(model, "PersonAddressRemoveModel");
};
