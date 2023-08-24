import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Negative Custom Assessment - Add nodes', function() {

    var agent = request.agent(infra._app);

    it('232 - Negative - Create an assessment template', function(done) {
        loadCustomAssessmentCreateModel();

        const createModel = getTestData("CustomAssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(500, done);
    });

    it('233 - Negative - Add question node - single choice', function(done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData("CustomAssessmentSCQModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplate")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(500, done);
    });

    it('234 - Negative - Add list node', function(done) {
        loadCustomAssessmentNodeListModel();

        const createModel = getTestData("CustomAssessmentNodeListModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(401, done);
    });

    it('235 - Negative - Add question node - date', function(done) {
        loadCustomAssessmentNodeDateTypeModel();

        const createModel = getTestData("CustomAssessmentNodeDateTypeModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(401, done);
    });

    it('236 - Negative - Add message node', function(done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData("CustomAssessmentNodeMessageTypeModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC3PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                           
            })
            .expect(403, done);
    });

    it('237 - Negative - Get updated assessment template by id', function(done) {
    
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('238 - Negative - Get node by id', function(done) {
 
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}/nodes/${getTestData('AssessmentNodeMessageTypeId')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadCustomAssessmentCreateModel = async (
) => {
    const model = {
    
    };
    setTestData(model, "CustomAssessmentCreateModel");
};

export const loadCustomAssessmentSCQModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentTemplateRootNodeId'),
        NodeType          : "Question",
        Title             : "Seen your physician for an unscheduled visit?",
        Description       : "Unscheduled visit for some emergency checks",
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : "yes",
                Text              : "Yes",
                Sequence          : 1
            },
            {
                ProviderGivenCode : "no",
                Text              : "No",
                Sequence          : 2
            }
        ]
    };
    setTestData(model, "CustomAssessmentSCQModel");
};

export const loadCustomAssessmentMCQModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentTemplateRootNodeId'),
        NodeType          : "Question",
        Title             : "What are your preferred activity selections?",
        QueryResponseType : "Multi Choice Selection",
        Options           : [
            {
                Text     : "Walking",
                Sequence : 1
            },
            {
                Text     : "Sports",
                Sequence : 2
            },
            {
                Text     : "Hiking",
                Sequence : 3
            },
            {
                Text     : "Cycling",
                Sequence : 4
            },
            {
                Text     : "Yoga",
                Sequence : 5
            }
        ]
    };
    setTestData(model, "CustomAssessmentMCQModel");
};

export const loadCustomAssessmentNodeListModel = async (
) => {
    const model = {
        ParentNodeId : getTestData('AssessmentTemplateRootNodeId'),
        NodeType     : "Node list",
        Title        : "Daily check list"
    };
    setTestData(model, "CustomAssessmentNodeListModel");
};

export const loadCustomAssessmentNodeTextTypeModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentTemplateRootNodeId'),
        NodeType          : "Question",
        Title             : "Time per week spent in moderate physical activity?",
        Description       : "Minutes",
        QueryResponseType : "Text"
    };
    setTestData(model, "CustomAssessmentNodeTextTypeModel");
};

export const loadCustomAssessmentNodeDateTypeModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentTemplateRootNodeId'),
        NodeType          : "Question",
        Title             : "Your birth date",
        QueryResponseType : "Date"
    };
    setTestData(model, "CustomAssessmentNodeDateTypeModel");
};

export const loadCustomAssessmentNodeBooleanTypeModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentTemplateRootNodeId'),
        NodeType          : "Question",
        Title             : "Are you smoker?",
        QueryResponseType : "Boolean"
    };
    setTestData(model, "CustomAssessmentNodeBooleanTypeModel");
};

export const loadCustomAssessmentNodeMessageTypeModel = async (
) => {
    const model = {
        ParentNodeId : getTestData('AssessmentTemplateRootNodeId'),
        NodeType     : "Message",
        Title        : "Visit to doctor recommended",
        Message      : "Please see your doctor this weekend."
    };
    setTestData(model, "CustomAssessmentNodeMessageTypeModel");
};

