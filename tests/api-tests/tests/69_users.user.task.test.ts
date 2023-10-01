import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('69 - Assessment tasks tests', function() {

    var agent = request.agent(infra._app);

    it('69:01 -> Search careplan tasks', function(done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/user-tasks/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('69:02 -> Get task by id', function(done) {

        agent
            .get(`/api/v1/user-tasks/${getTestData('TaskId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("AssessmentTemplateCreateModel").ProviderAssessmentCode);
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
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
                expect(response.body.Data.Assessment.ProviderEnrollmentId).to.equal(getTestData("AssessmentCreateModel").ProviderEnrollmentId);
            })
            .expect(201, done);
    });

    it('Get assessment by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData('AssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScoringApplicable');
                expect(response.body.Data.Assessment).to.have.property('ProviderEnrollmentId');
                expect(response.body.Data.Assessment).to.have.property('ProviderAssessmentCode');

            })
            .expect(200, done);
    });

    it('69:03 -> Start assessment', function(done) {
        agent
            .post(`/api/v1/clinical/assessments/${getTestData('AssessmentId')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

    it('69:04 -> Negative - Search careplan tasks', function(done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/user-tasks/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('69:05 -> Negative - Get task by id', function(done) {

        agent
            .get(`/api/v1/user-tasks/${getTestData('TaskId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('69:06 -> Negative Get assessment by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData('AssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('69:07 -> Negative - Start assessment', function(done) {
        agent
            .post(`/api/v1/clinical/assessments/${getTestData('AssessmentId')}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
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
    const queryString = '';
    return queryString;
}

export const loadAssessmentTemplateCreateModel = async (    
) => {
    const model = {
        Type                        : getRandomEnumValue(AssessmentType),
        Title                       : faker.lorem.word(),
        Description                 : faker.lorem.words(),
        ScoringApplicable           : faker.datatype.boolean(),
        ProviderAssessmentCode      : faker.lorem.word(),
        ServeListNodeChildrenAtOnce : faker.datatype.boolean(),
        DisplayCode                 : faker.lorem.word(),
        TotalNumberOfQuestions      : faker.number.int(100)
              
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadAssessmentCreateModel = async (
) => {
    const model = {
        PatientUserId          : getTestData("PatientUserId"),
        Title                  : faker.lorem.word(),
        Type                   : getRandomEnumValue(AssessmentType),
        AssessmentTemplateId   : getTestData("AssessmentTemplateId"),
        ScoringApplicable      : faker.datatype.boolean(),
        ProviderEnrollmentId   : faker.string.uuid(),
        ProviderAssessmentCode : faker.lorem.word(),
        Provider               : faker.lorem.word(),
        ScheduledDate          : faker.date.future()
            
    };
    setTestData(model, "AssessmentCreateModel");
};

