import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Assessment tasks tests', function() {

    var agent = request.agent(infra._app);

    it('208 - Negative - Search careplan tasks', function(done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/user-tasks/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('209 - Negative - Get task by id', function(done) {

        agent
            .get(`/api/v1/user-tasks/${getTestData('Task')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('Negative Create assessment template', function(done) {
        loadAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('Negative Get assessment by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData('Assessment')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(400, done);
    });

    it('210 - Negative - Start assessment', function(done) {
        agent
            .post(`/api/v1/clinical/assessments/${getTestData('Assessment')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
              
            })
            .expect(400, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?actionType=Medication';
    return queryString;
}

export const loadAssessmentTemplateCreateModel = async (
) => {
    const model = {
              
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadAssessmentCreateModel = async (
) => {
    const model = {
        PatientUserId          : getTestData("PatientUserId"),
        Title                  : "Assessment",
        Type                   : "Careplan",
        AssessmentTemplateId   : getTestData("AssessmentTemplateId"),
        ScoringApplicable      : true,
        ProviderEnrollmentId   : "34",
        ProviderAssessmentCode : "AHA",
        Provider               : "rean",
        ScheduledDate          : "2023-09-23T00:00:00.000Z"
            
    };
    setTestData(model, "AssessmentCreateModel");
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
        Provider  : "AHA",
        PlanCode  : "Cholesterol",
        StartDate : "2023-09-12T00:00:00.000Z"
    };
    setTestData(model, "EnrollmentCreateModel");
};
