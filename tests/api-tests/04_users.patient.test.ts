import  request  from 'supertest';
import { expect, assert } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Patient tests', function() {

    var agent = request.agent(infra._app);

    it('16 - Get user roles', function(done) {
        agent
            .get(`/api/v1/types/person-roles`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('18 - Register patient- with only a phone number', function(done) {
        loadPatientPhoneCreateModel();
        const createModel = getTestData("PatientPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.id, 'PatientPhoneId');
                setTestData(response.body.Data.Patient.User.id, 'PatientUserPhoneId');
                setTestData(response.body.Data.Patient.User.Person.id, 'PatientPersonPhoneId');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Patient.id, 'PatientPhoneId');

                expect(response.body.Data.Patient.User.Person.Phone).to.equal(getTestData("PatientPhoneCreateModel").Phone);

            })
            .expect(201, done);
    });

    it('Create patient', function(done) {
        loadPatientCreateModel();
        const createModel = getTestData("PatientCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.id, 'PatientId');
                setTestData(response.body.Data.Patient.User.id, 'PatientUserId');
                setTestData(response.body.Data.Patient.User.Person.id, 'PatientPersonId');
                expect(response.body.Data.Patient.User.Person).to.have.property('id');
                expect(response.body.Data.Patient.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Patient.User.Person).to.have.property('Email');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Patient.id, 'PatientId');

                expect(response.body.Data.Patient.User.Person.FirstName).to.equal(getTestData("PatientCreateModel").FirstName);
                expect(response.body.Data.Patient.User.Person.Email).to.equal(getTestData("PatientCreateModel").Email);
                expect(response.body.Data.Patient.User.Person.Phone).to.equal(getTestData("PatientCreateModel").Phone);

            })
            .expect(201, done);
    });

    it('17 - Get user with phone and role', function(done) {
        agent
            .get(`/api/v1/users/by-phone/+91-7349901931/role/2`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('19 - Register patient- with same phone number - should fail', function(done) {
        loadPatientFailCreateModel();
        const createModel = getTestData("PatientFailCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(409, done);
    });

    it('20 - Create patient with phone & password', function(done) {
        loadPatientPasswordPhoneCreateModel();
        const createModel = getTestData("PatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.User.id, "PatientUserId");
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('21 - Patient login with password', function(done) {

        const PatientLoginModel = getTestData("PatientLoginModel");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(PatientLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt");
                setTestData(response.body.Data.User.UserId, "PatientUserId_1");

            })
            .expect(200, done);
    });

    it('22 - Get patient by id', function(done) {
        agent
            .get(`/api/v1/patients/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('23 - Search patient records', function(done) {
        loadPatientQueryString();
        agent
            .get(`/api/v1/patients/search${loadPatientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Patients).to.have.property('TotalCount');
                expect(response.body.Data.Patients).to.have.property('RetrievedCount');
                expect(response.body.Data.Patients).to.have.property('PageIndex');
                expect(response.body.Data.Patients).to.have.property('ItemsPerPage');
                expect(response.body.Data.Patients).to.have.property('Order');
                expect(response.body.Data.Patients.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Patients.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Patients.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('24 - Update patient', function(done) {
        loadPatientUpdateModel();
        const updateModel = getTestData("PatientUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Patient.User.Person).to.have.property('id');
                expect(response.body.Data.Patient.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Patient.User.Person).to.have.property('Email');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                expect(response.body.Data.Patient.User.Person.FirstName).to.equal(getTestData("PatientUpdateModel").FirstName);
                expect(response.body.Data.Patient.User.Person.Email).to.equal(getTestData("PatientUpdateModel").Email);

            })
            .expect(200, done);
    });

    it('25 - Update patient details - partial address', function(done) {
        loadAddressUpdateModel();
        const updateModel = getTestData("AddressUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientPhoneCreateModel = async (
) => {
    const model = {
        Phone : "+91-9849901931",
          
    };
    setTestData(model, "PatientPhoneCreateModel");
};

export const loadPatientCreateModel = async (
) => {
    const model = {
        FirstName : "Anand",
        Email     : "anand@gmail.com",
        Phone     : "+91-7349901931",
      
    };
    setTestData(model, "PatientCreateModel");
};

export const loadPatientFailCreateModel = async (
) => {
    const model = {
        FirstName : "Rahul",
        Email     : "rahul@gmail.com",
        Phone     : "+91-7349901931",
          
    };
    setTestData(model, "PatientFailCreateModel");
};

export const loadPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
        Phone    : "+91-7349901967",
        Password : "Test@123"
    
    };
    setTestData(model, "PatientPasswordPhoneCreateModel");
};

export const loadPatientUpdateModel = async (
) => {
    const model = {
        FirstName : "Amit",
        Email     : "amit@gmail.com"

    };
    setTestData(model, "PatientUpdateModel");
};

export const loadAddressUpdateModel = async (
) => {
    const model = {
        Prefix          : "Mr.",
        FirstName       : "John",
        MiddleName      : "X",
        LastName        : "Doe",
        Email           : "john.doe@gmail.com",
        Gender          : "Male",
        BirthDate       : "1979-01-01",
        ImageResourceId : "20fd7e52-0d24-4599-bda5-3ed7be2dd383",
        Addresses       : [
            {
                Type        : "Official",
                AddressLine : "99/4, Hosur Mn Rd, Opp Bts Bus Stop, Bommana Halli",
                City        : "Mumbai",
                District    : "Greater Mumbai",
                State       : "Maharashtra",
                Country     : "India",
                PostalCode  : "412407",
                Longitude   : 23.45545,
                Lattitude   : 54.65466
            }
        ]
    
    };
    setTestData(model, "AddressUpdateModel");
};

function loadPatientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?phone=+91-7349901931';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
