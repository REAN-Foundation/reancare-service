import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('87 - Second user logs in tests', function() {
    var agent = request.agent(infra._app);

    it('87 - 01 - Create patient with phone & password', function(done) {
        const PatientPasswordPhoneModelAgain = getTestData("PatientPasswordPhoneModelAgain");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientPasswordPhoneModelAgain)
            .expect(response => {
                setTestData(response.body.Data.Patient.User.id, "PatientUserId_1");
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('87 - 02 - Second user logs in', function(done) {
        const PatientLoginModel = getTestData("PatientLoginModel4");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
   
    it('87 - 03 - Update user details', function(done) {
        loadUserDetailsUpdateModel();
        const updateModel = getTestData("UserDetailsUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('87 - 01 - Negative - Create patient with phone & password', function(done) {
        loadNPatientPasswordPhoneCreateModel();
        const createModel = getTestData("NPatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('87 - 02 - Negative - Second user logs in', function(done) {
        const PatientLoginModel = getTestData("PatientLoginModel4");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .send(PatientLoginModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
   
    it('87 - 03 - Negative - Update user details', function(done) {
        loadNUserDetailsUpdateModel();
        const updateModel = getTestData("NUserDetailsUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadUserDetailsUpdateModel = async (
    Prefix = faker.person.prefix(),
    firstName = faker.person.firstName(),
    middleName = faker.person.middleName(),
    lastName = faker.person.lastName(),
    Email = faker.internet.email(),
    Gender = faker.person.gender(),
    birthDate = faker.date.birthdate(),
    imageResourceId = faker.string.uuid(),
    Type = faker.lorem.word(),
    addressLine = faker.location.streetAddress(),
    City = faker.location.city(),
    Country = faker.location.country(),
    // defaultTimeZone = faker.location.timeZone(),
    // currentTimeZone = faker.location.timeZone()
) => {
    const model = {
        Prefix          : Prefix,
        FirstName       : firstName,
        MiddleName      : middleName,
        LastName        : lastName,
        Email           : Email,
        Gender          : Gender,
        BirthDate       : birthDate,
        ImageResourceId : imageResourceId,
        Address         : {
            Type        : Type,
            AddressLine : addressLine,
            City        : City,
            Country     : Country
        },
        DefaultTimeZone : "+05:30",
        CurrentTimeZone : "+05:30"
    };
    setTestData(model, "UserDetailsUpdateModel");
};

export const loadNPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
            
    };
    setTestData(model, "NPatientPasswordPhoneCreateModel");
};

export const loadNUserDetailsUpdateModel = async (
) => {
    const model = {
           
    };
    setTestData(model, "NUserDetailsUpdateModel");
};
