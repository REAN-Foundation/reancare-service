import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Assessment tests', function() {

    var agent = request.agent(infra._app);

    it('416 - Create assessment', function(done) {
        loadAssessmentCreateModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Assessment.id, 'NodeAssessmentId');
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScheduledAt');

                setTestData(response.body.Data.Assessment.id, 'NodeAssessmentId');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentCreateModel").PatientUserId);
                expect(response.body.Data.Assessment.Title).to.equal(getTestData("AssessmentCreateModel").Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentCreateModel").AssessmentTemplateId);
                expect(response.body.Data.Assessment.ScheduledDate).to.equal(getTestData("AssessmentCreateModel").ScheduledAt);
      
            })
            .expect(201, done);
    });

    it('417 - Get assessment by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData('NodeAssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScheduledAt');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentCreateModel").PatientUserId);
                expect(response.body.Data.Assessment.Title).to.equal(getTestData("AssessmentCreateModel").Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentCreateModel").AssessmentTemplateId);
                expect(response.body.Data.Assessment.ScheduledDate).to.equal(getTestData("AssessmentCreateModel").ScheduledAt);
        
            })
            .expect(200, done);
    });

    it('418 - Search assessment records', function(done) {
        loadAssessmentQueryString();
        agent
            .get(`/api/v1/clinical/assessments/search${loadAssessmentQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.AssessmentRecords).to.have.property('TotalCount');
                expect(response.body.Data.AssessmentRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.AssessmentRecords).to.have.property('PageIndex');
                expect(response.body.Data.AssessmentRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.AssessmentRecords).to.have.property('Order');
                expect(response.body.Data.AssessmentRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.AssessmentRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.AssessmentRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('419 - Update assessment', function(done) {
        loadAssessmentUpdateModel();
        const updateModel = getTestData("AssessmentUpdateModel");
        agent
            .put(`/api/v1/clinical/assessments/${getTestData('NodeAssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScheduledAt');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentUpdateModel").PatientUserId);
                expect(response.body.Data.Assessment.Title).to.equal(getTestData("AssessmentUpdateModel").Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentUpdateModel").AssessmentTemplateId);
                expect(response.body.Data.Assessment.ScheduledDate).to.equal(getTestData("AssessmentUpdateModel").ScheduledAt);

            })
            .expect(200, done);
    });

    it('420 - Delete assessment', function(done) {
   
        agent
            .delete(`/api/v1/clinical/assessments/${getTestData('NodeAssessmentId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create assessment again', function(done) {
        loadAssessmentCreateModel();
        const createModel = getTestData("AssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessments/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Assessment.id, 'NodeAssessmentId');
                expect(response.body.Data.Assessment).to.have.property('id');
                expect(response.body.Data.Assessment).to.have.property('PatientUserId');
                expect(response.body.Data.Assessment).to.have.property('Title');
                expect(response.body.Data.Assessment).to.have.property('AssessmentTemplateId');
                expect(response.body.Data.Assessment).to.have.property('ScheduledAt');

                setTestData(response.body.Data.Assessment.id, 'NodeAssessmentId');

                expect(response.body.Data.Assessment.PatientUserId).to.equal(getTestData("AssessmentCreateModel").PatientUserId);
                expect(response.body.Data.Assessment.Title).to.equal(getTestData("AssessmentCreateModel").Title);
                expect(response.body.Data.Assessment.AssessmentTemplateId).to.equal(getTestData("AssessmentCreateModel").AssessmentTemplateId);
                expect(response.body.Data.Assessment.ScheduledDate).to.equal(getTestData("AssessmentCreateModel").ScheduledAt);
    
            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadAssessmentCreateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Title                : "Assessment",
        AssessmentTemplateId : getTestData("NodeAssessmentTemplateId"),
        ScheduledDate        : "2023-09-23T00:00:00.000Z"
        
    };
    setTestData(model, "AssessmentCreateModel");
};

export const loadAssessmentUpdateModel = async (
) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Title                : "An updated assessment",
        AssessmentTemplateId : getTestData("NodeAssessmentTemplateId"),
        ScheduledDate        : "2023-10-23T00:00:00.000Z"
          
    };
    setTestData(model, "AssessmentUpdateModel");
};

function loadAssessmentQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=Assessment';
    return queryString;
}
