import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Negative Run Kobo Form assessment', function() {

    var agent = request.agent(infra._app);

    it('243 - Negative - Start assessment', function(done) {

        agent
            .post(`/api/v1/clinical/assessments/${getTestData("NodeAssessment")}/start`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(400, done);
    });

    it('244 - Negative - Get next assessment question', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData("NodeAssessmentId")}/questions/next`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(404, done);
    });

    it('245 - Negative - Get assessment question by id', function(done) {

        agent
            .get(`/api/v1/clinical/assessments/${getTestData("NodeAssessmentId")}/questions/${getTestData("AssessmentNodeMCQ")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(400, done);
    });

    it('246 - Answer first question - single choice', function(done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData("CustomAssessmentSCQModel");
        agent
            .post(`/api/v1/clinical/assessments/${getTestData("NodeAssessmentId")}/questions/${getTestData("AssessmentNodeSCQId")}/answer`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('247 - Negative - Answer sixth question - Message', function(done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData("CustomAssessmentNodeMessageTypeModel");
        agent
            .post(`/api/v1/clinical/assessments/${getTestData("NodeAssessmentId")}/questions/${getTestData("AssessmentNodeMessageTypeId")}/answer`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PYo0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadCustomAssessmentCreateModel = async (
) => {
    const model = {
        Title                  : "A new assessment template",
        Description            : "Description of template",
        Type                   : "Careplan",
        Provider               : "REAN",
        ProviderAssessmentCode : "1"
    };
    setTestData(model, "CustomAssessmentCreateModel");
};

export const loadCustomAssessmentSCQModel = async (
) => {
    const model = {
        ResponseType : "Single Choice Selection",
        Answer       : 1
    };
    setTestData(model, "CustomAssessmentSCQModel");
};

export const loadCustomAssessmentMCQModel = async (
) => {
    const model = {
        ResponseType : "Multi Choice Selection",
        Answer       : [
            1,
            3,
            4
        ]
    };
    setTestData(model, "CustomAssessmentMCQModel");
};

export const loadCustomAssessmentNodeTextTypeModel = async (
) => {
    const model = {
        ResponseType : "Text",
        Answer       : 35
    };
    setTestData(model, "CustomAssessmentNodeTextTypeModel");
};

export const loadCustomAssessmentNodeDateTypeModel = async (
) => {
    const model = {
        ResponseType : "Date",
        Answer       : "1975-01-26"
    };
    setTestData(model, "CustomAssessmentNodeDateTypeModel");
};

export const loadCustomAssessmentNodeBooleanTypeModel = async (
) => {
    const model = {
        ResponseType : "Boolean",
        Answer       : false
    };
    setTestData(model, "CustomAssessmentNodeBooleanTypeModel");
};

export const loadCustomAssessmentNodeMessageTypeModel = async (
) => {
    const model = {
        ResponseType : "Ok",
        Answer       : "Ok"
    };
    setTestData(model, "CustomAssessmentNodeMessageTypeModel");
};

