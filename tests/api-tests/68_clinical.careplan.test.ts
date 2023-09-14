import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('68 - Patient tests', function() {

    var agent = request.agent(infra._app);
   
    it('68 - 01 - Create patient with phone & password', function(done) {
        const PatientPasswordPhoneModel = getTestData("PatientPasswordPhoneModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientPasswordPhoneModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('68 - 02 - Patient login with password', function(done) {

        const PatientLoginModel = getTestData("PatientLoginModel3");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt_1");
                setTestData(response.body.Data.User.UserId, "PatientUserId_1");

            })
            .expect(200, done);
    });

    it('68 - 03 - Update patient', function(done) {
        loadPatientUpdateModel();
        const updateModel = getTestData("PatientUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId')}`)
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

    it('68 - 04 - Get available care plans', function(done) {
        loadCareplanQueryString();
        agent
            .get(`/api/v1/care-plans${loadCareplanQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('68 - 05 - Get Careplan Eligibilty', function(done) {
        agent
            .get(`/api/v1/care-plans/eligibility/${getTestData('PatientUserId')}/providers/AHA/careplans/${getTestData('CAREPALNCODE')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Eligibility).to.have.property('Eligible');
                expect(response.body.Data.Eligibility.Eligible).to.equal(true);
              
            })
            .expect(200, done);
    });

    it('68 - 06 - Enroll to careplan', function(done) {
        loadEnrollmentCreateModel();
        const createModel = getTestData("EnrollmentCreateModel");
        agent
            .post(`/api/v1/care-plans/patients/${getTestData("PatientUserId")}/enroll`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Enrollment.id, "EnrollmentId");
                expect(response.body.Data.Enrollment).to.have.property('Provider');
                expect(response.body.Data.Enrollment).to.have.property('PlanCode');
                expect(response.body.Data.Enrollment).to.have.property('StartAt');

                setTestData(response.body.Data.Enrollment.id, "EnrollmentId");

                expect(response.body.Data.Enrollment.Provider).to.equal(getTestData("EnrollmentCreateModel").Provider);
                expect(response.body.Data.Enrollment.PlanCode).to.equal(getTestData("EnrollmentCreateModel").PlanCode);
            })
            .expect(201, done);
    });

    it('68 - 07 - Get all careplan enrollments for patient', function(done) {
        agent
            .get(`/api/v1/care-plans/patients/${getTestData('PatientUserId')}/enrollments`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('68 - 01 - Negative - Update patient', function(done) {
        loadPatientUpdateModel();
        const updateModel = getTestData("PatientUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
               
            })
            .expect(401, done);
    });

    it('68 - 02 - Negative - Get Careplan Eligibilty', function(done) {
        agent
            .get(`/api/v1/care-plans/eligibility/${getTestData('PatientUserId')}/providers/AHA/careplans/${getTestData('CARE')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(401, done);
    });

    it('68 - 03 - Negative - Enroll to careplan', function(done) {
        loadEnrollmentCreateModel();
        const createModel = getTestData("EnrollmentCreateModel");
        agent
            .post(`/api/v1/care-plans/patients/${getTestData("PatientUserId")}/enroll`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientUpdateModel = async (
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
    defaultTimeZone = faker.location.timeZone(),
    currentTimeZone = faker.location.timeZone()
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
    setTestData(model, "PatientUpdateModel");
};

function loadCareplanQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadEnrollmentCreateModel = async (
) => {
    const model = {
        Provider  : "AHA",
        PlanCode  : "Cholesterol",
        StartDate : "2024-08-17"
    };
    setTestData(model, "EnrollmentCreateModel");
};
