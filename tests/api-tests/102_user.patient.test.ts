import  request  from 'supertest';
import { expect, assert } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Second user logs in tests', function() {
    var agent = request.agent(infra._app);

    it('462 - Create patient with phone & password', function(done) {
        loadPatientPasswordPhoneCreateModel();
        const createModel = getTestData("PatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.User.id, "PatientUserId_1");
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('463 - Second user logs in', function(done) {
        const PatientLoginModel = getTestData("PatientLoginModel4");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(PatientLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt_2");
                setTestData(response.body.Data.User.id, "PatientUserId_11");
            })
            .expect(200, done);
    });
   
    it('464 - Update user details', function(done) {
        loadUserDetailsUpdateModel();
        const updateModel = getTestData("UserDetailsUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId_1')}`)
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

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
        Phone    : "+91-7749901967",
        Password : "Test@123"
    };
    setTestData(model, "PatientPasswordPhoneCreateModel");
};

export const loadUserDetailsUpdateModel = async (
) => {
    const model = {
        Prefix          : "Mr.",
        FirstName       : "Amit",
        MiddleName      : "X",
        LastName        : "D",
        Email           : "amit@gmail.com",
        Gender          : "Male",
        BirthDate       : "1979-01-01",
        ImageResourceId : "20fd7e52-0d24-4599-bda5-3ed7be2dd383",
        Address         : {
            Type        : "Official",
            AddressLine : "99/4, Hosur Mn Rd, Opp Bts Bus Stop, Bommana Halli",
            City        : "Mumbai",
            Country     : "India"
        },
        DefaultTimeZone : "+05:30",
        CurrentTimeZone : "+05:30"
    };
    setTestData(model, "UserDetailsUpdateModel");
};
