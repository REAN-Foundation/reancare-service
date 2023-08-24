import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Assessment tasks tests', function() {

    var agent = request.agent(infra._app);

    it('369 - Search careplan tasks', function(done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/user-tasks/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('370 - Get task by id', function(done) {

        agent
            .get(`/api/v1/user-tasks/${getTestData('TaskId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('Create assessment template', function(done) {
        loadAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ScoringApplicable');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ServeListNodeChildrenAtOnce');
                expect(response.body.Data.AssessmentTemplate).to.have.property('DisplayCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('TotalNumberOfQuestions');

                setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateId');

                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData("AssessmentTemplateCreateModel").Type);
                expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData("AssessmentTemplateCreateModel").Title);
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(getTestData("AssessmentTemplateCreateModel").Description);
                expect(response.body.Data.AssessmentTemplate.ScoringApplicable).to.equal(getTestData("AssessmentTemplateCreateModel").ScoringApplicable);
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("AssessmentTemplateCreateModel").ProviderAssessmentCode);
                expect(response.body.Data.AssessmentTemplate.ServeListNodeChildrenAtOnce).to.equal(getTestData("AssessmentTemplateCreateModel").ServeListNodeChildrenAtOnce);
                expect(response.body.Data.AssessmentTemplate.DisplayCode).to.equal(getTestData("AssessmentTemplateCreateModel").DisplayCode);
                expect(response.body.Data.AssessmentTemplate.TotalNumberOfQuestions).to.equal(getTestData("AssessmentTemplateCreateModel").TotalNumberOfQuestions);
            })
            .expect(201, done);
    });

    it('Create assessment', function(done) {
        loadAssessmentCreateModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Assessment.id, 'AssessmentId');
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScoringApplicable');
                expect(response.body.Data.Assessment).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.Assessment).to.have.property('ProviderAssessmentCode');

                setTestData(response.body.Data.Assessment.id, 'AssessmentId');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentCreateModel").PatientUserId);
                expect(response.body.Data.Assessment.Title).to.equal(getTestData("AssessmentCreateModel").Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentCreateModel").AssessmentTemplateId);
                expect(response.body.Data.Assessment.ScoringApplicable).to.equal(getTestData("AssessmentCreateModel").ScoringApplicable);
                expect(response.body.Data.Assessment.ProviderEnrollmentId).to.equal(getTestData("AssessmentCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.Assessment.ProviderAssessmentCode).to.equal(getTestData("AssessmentCreateModel").ProviderAssessmentCode);
      
            })
            .expect(201, done);
    });

    it('Get assessment by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData('AssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScoringApplicable');
                expect(response.body.Data.Assessment).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.Assessment).to.have.property('ProviderAssessmentCode');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentCreateModel").PatientUserId);
                expect(response.body.Data.Assessment.Title).to.equal(getTestData("AssessmentCreateModel").Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentCreateModel").AssessmentTemplateId);
                expect(response.body.Data.Assessment.ScoringApplicable).to.equal(getTestData("AssessmentCreateModel").ScoringApplicable);
                expect(response.body.Data.Assessment.ProviderEnrollmentId).to.equal(getTestData("AssessmentCreateModel").ProviderEnrollmentId);
                expect(response.body.Data.Assessment.ProviderAssessmentCode).to.equal(getTestData("AssessmentCreateModel").ProviderAssessmentCode);

            })
            .expect(200, done);
    });

    it('371 - Start assessment', function(done) {
        agent
            .post(`/api/v1/clinical/assessments/${getTestData('AssessmentId')}/start`)
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

function loadAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?actionType=Medication';
    return queryString;
}

export const loadAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Type                        : "Survey",
        Title                       : "Assessment",
        Description                 : "Careplan",
        ScoringApplicable           : true,
        ProviderAssessmentCode      : "AHA",
        ServeListNodeChildrenAtOnce : true,
        DisplayCode                 : "rean",
        TotalNumberOfQuestions      : 30
              
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
