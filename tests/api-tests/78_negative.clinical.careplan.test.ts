import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient tests', function() {

    var agent = request.agent(infra._app);
   
    it('204 - Negative - Create patient with phone & password', function(done) {
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
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('205 - Negative - Update patient', function(done) {
        loadPatientUpdateModel();
        const updateModel = getTestData("PatientUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUser')}`)
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

    it('206 - Negative - Get Careplan Eligibilty', function(done) {
        agent
            .get(`/api/v1/care-plans/eligibility/${getTestData('PatientUser')}/providers/AHA/careplans/${getTestData('CARE')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(400, done);
    });

    it('207 - Negative - Enroll to careplan', function(done) {
        loadEnrollmentCreateModel();
        const createModel = getTestData("EnrollmentCreateModel");
        agent
            .post(`/api/v1/care-plans/patients/${getTestData("PatientUserId")}/enroll`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
      
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

export const loadEnrollmentCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "EnrollmentCreateModel");
};
