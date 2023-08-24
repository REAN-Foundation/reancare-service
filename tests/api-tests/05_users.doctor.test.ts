import  request  from 'supertest';
import { expect, assert } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Doctor tests', function() {

    var agent = request.agent(infra._app);

    it('31 - Register doctor- with only a phone number', function(done) {
        loadDoctorPhoneCreateModel();
        const createModel = getTestData("DoctorPhoneCreateModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Doctor.id, 'DoctorPhoneId');
                setTestData(response.body.Data.Doctor.User.id, 'DoctorUserPhoneId');
                setTestData(response.body.Data.Doctor.User.Person.id, 'DoctorPersonPhoneId');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Doctor.id, 'DoctorPhoneId');

                expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData("DoctorPhoneCreateModel").Phone);

            })
            .expect(201, done);
    });

    it('Create Doctor', function(done) {
        loadDoctorCreateModel();
        const createModel = getTestData("DoctorCreateModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Doctor.id, 'DoctorId');
                setTestData(response.body.Data.Doctor.User.id, 'DoctorUserId');
                setTestData(response.body.Data.Doctor.User.Person.id, 'DoctorPersonId');
                expect(response.body.Data.Doctor.User.Person).to.have.property('id');
                expect(response.body.Data.Doctor.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Email');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Doctor.User.Person.id, 'DoctorId');

                expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData("DoctorCreateModel").FirstName);
                expect(response.body.Data.Doctor.User.Person.Email).to.equal(getTestData("DoctorCreateModel").Email);
                expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData("DoctorCreateModel").Phone);

            })
            .expect(201, done);
    });

    it('32 - Create doctor with phone & password', function(done) {
        loadDoctorPasswordPhoneCreateModel();
        const createModel = getTestData("DoctorPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('33 - Register doctor- with same phone number - should fail', function(done) {
        loadDoctorFailCreateModel();
        const createModel = getTestData("DoctorFailCreateModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('34 - Doctor login with password', function(done) {

        const DoctorLoginModel = getTestData("DoctorLoginModel");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(DoctorLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "DoctorJwt");
                setTestData(response.body.Data.User.UserId, "DoctorUserId_1");

            })
            .expect(200, done);
    });

    it('35 - Get doctor by id', function(done) {
        agent
            .get(`/api/v1/doctors/${getTestData('DoctorUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body.Data.Doctor.User.Person).to.have.property('id');
                expect(response.body.Data.Doctor.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Email');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData("DoctorCreateModel").FirstName);
                expect(response.body.Data.Doctor.User.Person.Email).to.equal(getTestData("DoctorCreateModel").Email);
                expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData("DoctorCreateModel").Phone);

            })
            .expect(200, done);
    });

    it('36 - Search doctor records', function(done) {
        loadDoctorQueryString();
        agent
            .get(`/api/v1/doctors/search${loadDoctorQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Doctors).to.have.property('TotalCount');
                expect(response.body.Data.Doctors).to.have.property('RetrievedCount');
                expect(response.body.Data.Doctors).to.have.property('PageIndex');
                expect(response.body.Data.Doctors).to.have.property('ItemsPerPage');
                expect(response.body.Data.Doctors).to.have.property('Order');
                expect(response.body.Data.Doctors.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Doctors.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Doctors.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('37 - Update doctor', function(done) {
        loadDoctorUpdateModel();
        const updateModel = getTestData("DoctorUpdateModel");
        agent
            .put(`/api/v1/doctors/${getTestData('DoctorUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Doctor.User.Person).to.have.property('id');
                expect(response.body.Data.Doctor.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Email');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData("DoctorUpdateModel").FirstName);
                expect(response.body.Data.Doctor.User.Person.Email).to.equal(getTestData("DoctorUpdateModel").Email);

            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadDoctorPhoneCreateModel = async (
) => {
    const model = {
        Phone : "+91-9249901931",
              
    };
    setTestData(model, "DoctorPhoneCreateModel");
};

export const loadDoctorCreateModel = async (
) => {
    const model = {
        FirstName : "Anand",
        Email     : "anand@gmail.com",
        Phone     : "+91-9876543220",
    
    };
    setTestData(model, "DoctorCreateModel");
};

export const loadDoctorFailCreateModel = async (
) => {
    const model = {
        FirstName : "Rahul",
        Email     : "rahul@gmail.com",
        Phone     : "+91-9876543220",
        
    };
    setTestData(model, "DoctorFailCreateModel");
};

export const loadDoctorPasswordPhoneCreateModel = async (
) => {
    const model = {
        Phone    : "+91-9876543219",
        Password : "Test@123"
        
    };
    setTestData(model, "DoctorPasswordPhoneCreateModel");
};

export const loadDoctorUpdateModel = async (
) => {
    const model = {
        FirstName : "Amit",
        Email     : "amit@gmail.com"

    };
    setTestData(model, "DoctorUpdateModel");
};

function loadDoctorQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?phone=+91-9876543220';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
