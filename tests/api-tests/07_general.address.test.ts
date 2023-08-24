import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Address tests', function() {

    var agent = request.agent(infra._app);

    it('43 - Create address', function(done) {
        loadAddressCreateModel();
        const createModel = getTestData("AddressCreateModel");
        agent
            .post(`/api/v1/addresses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Address.id, 'AddressId');
                expect(response.body.Data.Address).to.have.property('id');
                expect(response.body.Data.Address).to.have.property('Type');
                expect(response.body.Data.Address).to.have.property('AddressLine');
                expect(response.body.Data.Address).to.have.property('City');
                expect(response.body.Data.Address).to.have.property('District');
                expect(response.body.Data.Address).to.have.property('State');
                expect(response.body.Data.Address).to.have.property('Country');
                expect(response.body.Data.Address).to.have.property('PostalCode');
                expect(response.body.Data.Address).to.have.property('Longitude');
                expect(response.body.Data.Address).to.have.property('Lattitude');
                
                setTestData(response.body.Data.Address.id, 'AddressId');

                expect(response.body.Data.Address.Type).to.equal(getTestData("AddressCreateModel").Type);
                expect(response.body.Data.Address.AddressLine).to.equal(getTestData("AddressCreateModel").AddressLine);
                expect(response.body.Data.Address.City).to.equal(getTestData("AddressCreateModel").City);
                expect(response.body.Data.Address.District).to.equal(getTestData("AddressCreateModel").District);
                expect(response.body.Data.Address.State).to.equal(getTestData("AddressCreateModel").State);
                expect(response.body.Data.Address.Country).to.equal(getTestData("AddressCreateModel").Country);
                expect(response.body.Data.Address.PostalCode).to.equal(getTestData("AddressCreateModel").PostalCode);
                expect(response.body.Data.Address.Longitude).to.equal(getTestData("AddressCreateModel").Longitude);
                expect(response.body.Data.Address.Lattitude).to.equal(getTestData("AddressCreateModel").Lattitude);

            })
            .expect(201, done);
    });

    it('44 - Get address by id', function(done) {
        agent
            .get(`/api/v1/addresses/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Address).to.have.property('id');
                expect(response.body.Data.Address).to.have.property('Type');
                expect(response.body.Data.Address).to.have.property('AddressLine');
                expect(response.body.Data.Address).to.have.property('City');
                expect(response.body.Data.Address).to.have.property('District');
                expect(response.body.Data.Address).to.have.property('State');
                expect(response.body.Data.Address).to.have.property('Country');
                expect(response.body.Data.Address).to.have.property('PostalCode');
                expect(response.body.Data.Address).to.have.property('Longitude');
                expect(response.body.Data.Address).to.have.property('Lattitude');

                expect(response.body.Data.Address.Type).to.equal(getTestData("AddressCreateModel").Type);
                expect(response.body.Data.Address.AddressLine).to.equal(getTestData("AddressCreateModel").AddressLine);
                expect(response.body.Data.Address.City).to.equal(getTestData("AddressCreateModel").City);
                expect(response.body.Data.Address.District).to.equal(getTestData("AddressCreateModel").District);
                expect(response.body.Data.Address.State).to.equal(getTestData("AddressCreateModel").State);
                expect(response.body.Data.Address.Country).to.equal(getTestData("AddressCreateModel").Country);
                expect(response.body.Data.Address.PostalCode).to.equal(getTestData("AddressCreateModel").PostalCode);
                expect(response.body.Data.Address.Longitude).to.equal(getTestData("AddressCreateModel").Longitude);
                expect(response.body.Data.Address.Lattitude).to.equal(getTestData("AddressCreateModel").Lattitude);

            })
            .expect(200, done);
    });

    it('45 - Search address records', function(done) {
        loadAddressQueryString();
        agent
            .get(`/api/v1/addresses/search${loadAddressQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Addresses).to.have.property('TotalCount');
                expect(response.body.Data.Addresses).to.have.property('RetrievedCount');
                expect(response.body.Data.Addresses).to.have.property('PageIndex');
                expect(response.body.Data.Addresses).to.have.property('ItemsPerPage');
                expect(response.body.Data.Addresses).to.have.property('Order');
                expect(response.body.Data.Addresses.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Addresses.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Addresses.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('46 - Update address', function(done) {
        loadAddressUpdateModel();
        const updateModel = getTestData("AddressUpdateModel");
        agent
            .put(`/api/v1/addresses/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Address).to.have.property('id');
                expect(response.body.Data.Address).to.have.property('Type');
                expect(response.body.Data.Address).to.have.property('AddressLine');
                expect(response.body.Data.Address).to.have.property('City');
                expect(response.body.Data.Address).to.have.property('District');
                expect(response.body.Data.Address).to.have.property('State');
                expect(response.body.Data.Address).to.have.property('Country');
                expect(response.body.Data.Address).to.have.property('PostalCode');
                expect(response.body.Data.Address).to.have.property('Longitude');
                expect(response.body.Data.Address).to.have.property('Lattitude');

                expect(response.body.Data.Address.Type).to.equal(getTestData("AddressUpdateModel").Type);
                expect(response.body.Data.Address.AddressLine).to.equal(getTestData("AddressUpdateModel").AddressLine);
                expect(response.body.Data.Address.City).to.equal(getTestData("AddressUpdateModel").City);
                expect(response.body.Data.Address.District).to.equal(getTestData("AddressUpdateModel").District);
                expect(response.body.Data.Address.State).to.equal(getTestData("AddressUpdateModel").State);
                expect(response.body.Data.Address.Country).to.equal(getTestData("AddressUpdateModel").Country);
                expect(response.body.Data.Address.PostalCode).to.equal(getTestData("AddressUpdateModel").PostalCode);
                expect(response.body.Data.Address.Longitude).to.equal(getTestData("AddressUpdateModel").Longitude);
                expect(response.body.Data.Address.Lattitude).to.equal(getTestData("AddressUpdateModel").Lattitude);

            })
            .expect(200, done);
    });

    it('47 - Delete address', function(done) {
      
        agent
            .delete(`/api/v1/addresses/${getTestData('AddressId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create address again', function(done) {
        loadAddressCreateModel();
        const createModel = getTestData("AddressCreateModel");
        agent
            .post(`/api/v1/addresses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Address.id, 'AddressId');
                expect(response.body.Data.Address).to.have.property('id');
                expect(response.body.Data.Address).to.have.property('Type');
                expect(response.body.Data.Address).to.have.property('AddressLine');
                expect(response.body.Data.Address).to.have.property('City');
                expect(response.body.Data.Address).to.have.property('District');
                expect(response.body.Data.Address).to.have.property('State');
                expect(response.body.Data.Address).to.have.property('Country');
                expect(response.body.Data.Address).to.have.property('PostalCode');
                expect(response.body.Data.Address).to.have.property('Longitude');
                expect(response.body.Data.Address).to.have.property('Lattitude');
                
                setTestData(response.body.Data.Address.id, 'AddressId');

                expect(response.body.Data.Address.Type).to.equal(getTestData("AddressCreateModel").Type);
                expect(response.body.Data.Address.AddressLine).to.equal(getTestData("AddressCreateModel").AddressLine);
                expect(response.body.Data.Address.City).to.equal(getTestData("AddressCreateModel").City);
                expect(response.body.Data.Address.District).to.equal(getTestData("AddressCreateModel").District);
                expect(response.body.Data.Address.State).to.equal(getTestData("AddressCreateModel").State);
                expect(response.body.Data.Address.Country).to.equal(getTestData("AddressCreateModel").Country);
                expect(response.body.Data.Address.PostalCode).to.equal(getTestData("AddressCreateModel").PostalCode);
                expect(response.body.Data.Address.Longitude).to.equal(getTestData("AddressCreateModel").Longitude);
                expect(response.body.Data.Address.Lattitude).to.equal(getTestData("AddressCreateModel").Lattitude);

            })
            .expect(201, done);
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

function loadAddressQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?city=Pune';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
