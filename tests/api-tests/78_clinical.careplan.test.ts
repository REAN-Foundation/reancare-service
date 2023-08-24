import  request  from 'supertest';
import { expect, assert } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Patient tests', function() {

    var agent = request.agent(infra._app);
   
    it('362 - Create patient with phone & password', function(done) {
        loadPatientPasswordPhoneCreateModel();
        const createModel = getTestData("PatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
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

    it('363 - Patient login with password', function(done) {

        const PatientLoginModel = getTestData("PatientLoginModel3");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('364 - Update patient', function(done) {
        loadPatientUpdateModel();
        const updateModel = getTestData("PatientUpdateModel");
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

    it('365 - Get available care plans', function(done) {
        loadCareplanQueryString();
        agent
            .get(`/api/v1/care-plans${loadCareplanQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('366 - Get Careplan Eligibilty', function(done) {
        agent
            .get(`/api/v1/care-plans/eligibility/${getTestData('PatientUserId')}/providers/AHA/careplans/${getTestData('CAREPALNCODE')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Eligibility).to.have.property('Eligible');
                expect(response.body.Data.Eligibility.Eligible).to.equal(true);
              
            })
            .expect(200, done);
    });

    it('367 - Enroll to careplan', function(done) {
        loadEnrollmentCreateModel();
        const createModel = getTestData("EnrollmentCreateModel");
        agent
            .post(`/api/v1/care-plans/patients/${getTestData("PatientUserId")}/enroll`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Enrollment.StartAt).to.equal(getTestData("EnrollmentCreateModel").StartDate);
            })
            .expect(201, done);
    });

    it('368 - Get all careplan enrollments for patient', function(done) {
        agent
            .get(`/api/v1/care-plans/patients/${getTestData('PatientUserId')}/enrollments`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
        Phone    : "+91-7349901957",
        Password : "Test@123"
      
    };
    setTestData(model, "PatientPasswordPhoneCreateModel");
};

export const loadPatientUpdateModel = async (
) => {
    const model = {
        Prefix          : "Mr.",
        FirstName       : "Anand",
        MiddleName      : "X",
        LastName        : "xyz",
        Email           : "anand@gmail.com",
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
    setTestData(model, "PatientUpdateModel");
};

function loadCareplanQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?provider=AHA';
    return queryString;
}

export const loadEnrollmentCreateModel = async (
) => {
    const model = {
        Provider  : "AHA",
        PlanCode  : "Cholesterol",
        StartDate : "2023-09-12T00:00:00.000Z"
    };
    setTestData(model, "EnrollmentCreateModel");
};
