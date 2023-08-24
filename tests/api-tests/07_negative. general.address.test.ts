import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Address tests', function() {

    var agent = request.agent(infra._app);

    it('10 - Negative - Create address', function(done) {
        loadAddressCreateModel();
        const createModel = getTestData("AddressCreateModel");
        agent
            .post(`/api/v1/addresses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC9PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('11 - Negative - Get address by id', function(done) {
        agent
            .get(`/api/v1/addresses/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('12 - Negative - Update address', function(done) {
        loadAddressUpdateModel();
        const updateModel = getTestData("AddressUpdateModel");
        agent
            .put(`/api/v1/addresses/${getTestData('AddressId1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadAddressCreateModel = async (
) => {
    const model = {
        Type        : "Home",
        AddressLine : "89/88, Sembudoss St, Parrys",
        City        : "Pune",
        District    : "Greater Pune",
        State       : "Maharashtra",
        Country     : "India",
        PostalCode  : "411001",
        Longitude   : 36.7323,
        Lattitude   : 6.6119
    };
    setTestData(model, "AddressCreateModel");
};

export const loadAddressUpdateModel = async (
) => {
    const model = {
        Type        : "Official",
        AddressLine : "99/4, Hosur Mn Rd, Opp Bts Bus Stop, Bommana Halli",
        City        : "Mumbai",
        District    : "Greater Mumbai",
        State       : "Maharashtra",
        Country     : "India",
        PostalCode  : "412407",
        Longitude   : 23.45545,
        Lattitude   : 54.65466
    };
    setTestData(model, "AddressUpdateModel");
};

///////////////////////////////////////////////////////////////////////////
