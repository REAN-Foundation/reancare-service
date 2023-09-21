import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('05 - Doctor tests', function() {

    var agent = request.agent(infra._app);

    it('05:01 -> Register doctor- with only a phone number', function(done) {
        loadDoctorPhoneCreateModel();
        const createModel = getTestData("DoctorPhoneCreateModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData("DoctorCreateModel").Phone);

            })
            .expect(201, done);
    });

    it('05:02 -> Create doctor with phone & password', function(done) {
        loadDoctorCreateWithPhoneModel()
        const createModel = getTestData("DoctorCreateWithPhoneModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('05:03 -> Register doctor- with same phone number - should fail', function(done) {
        loadDoctorFailCreateModel();
        const createModel = getTestData("DoctorFailCreateModel");
        agent
            .post(`/api/v1/doctors/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('05:04 -> Doctor login with password', function(done) {
        loadDoctorLoginModel();
        const createModel = getTestData("DoctorLoginModel");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "DoctorJwt");
                setTestData(response.body.Data.User.UserId, "DoctorUserId_1");

            })
            .expect(200, done);
    });

    it('05:05 -> Get doctor by id', function(done) {
        agent
            .get(`/api/v1/doctors/${getTestData('DoctorUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body.Data.Doctor.User.Person).to.have.property('id');
                expect(response.body.Data.Doctor.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Email');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData("DoctorCreateModel").FirstName);
                expect(response.body.Data.Doctor.User.Person.Phone).to.equal(getTestData("DoctorCreateModel").Phone);

            })
            .expect(200, done);
    });

    it('05:06 -> Search doctor records', function(done) {
        loadDoctorQueryString();
        agent
            .get(`/api/v1/doctors/search${loadDoctorQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('05:07 -> Update doctor', function(done) {
        loadDoctorUpdateModel();
        const updateModel = getTestData("DoctorUpdateModel");
        agent
            .put(`/api/v1/doctors/${getTestData('DoctorUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Doctor.User.Person).to.have.property('id');
                expect(response.body.Data.Doctor.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Email');
                expect(response.body.Data.Doctor.User.Person).to.have.property('Phone');

                expect(response.body.Data.Doctor.User.Person.FirstName).to.equal(getTestData("DoctorUpdateModel").FirstName);

            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

const firstDoctorPhoneNumber: string = faker.phone.number('+91-##########');

const secondDoctorPhoneNumber: string = faker.phone.number('+91-##########');

const doctorPassword : string = faker.internet.password()

export const loadDoctorPhoneCreateModel = async (
) => {
    const model = {
        Phone : faker.phone.number('+91-##########'),
              
    };
    setTestData(model, "DoctorPhoneCreateModel");
};

export const loadDoctorCreateModel = async (
) => {
    const model = {
        FirstName : faker.person.firstName(),
        Email     : faker.internet.exampleEmail(),
        Phone     : firstDoctorPhoneNumber,
    
    };
    setTestData(model, "DoctorCreateModel");
};

export const loadDoctorCreateWithPhoneModel = async (
    ) => {
        const model = {
            Phone: secondDoctorPhoneNumber,
            Password: doctorPassword,
        };
        setTestData(model, 'DoctorCreateWithPhoneModel');
};

export const loadDoctorLoginModel = async (
    ) => {
        const model = {
            Phone: secondDoctorPhoneNumber,
            Password: doctorPassword,
            LoginRoleId: getTestData("doctorRoleId")
        };
        setTestData(model, 'DoctorLoginModel');
};

export const loadDoctorFailCreateModel = async (
) => {
    const model = {
        FirstName : faker.person.firstName(),
        Email     : faker.internet.exampleEmail(),
        Phone     : firstDoctorPhoneNumber,
        
    };
    setTestData(model, "DoctorFailCreateModel");
};

export const loadDoctorUpdateModel = async (
) => {
    const model = {
        FirstName : faker.person.firstName(),
        Email     : faker.internet.exampleEmail()

    };
    setTestData(model, "DoctorUpdateModel");
};

function loadDoctorQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
