import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Custom Assessment - Add nodes', function() {

    var agent = request.agent(infra._app);

    it('406 - Create an assessment template', function(done) {
        loadCustomAssessmentCreateModel();

        const createModel = getTestData("CustomAssessmentCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentTemplate.id, 'NodeAssessmentTemplateId');
                setTestData(response.body.Data.AssessmentTemplate.RootNodeId, 'AssessmentTemplateRootNodeId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
                
                setTestData(response.body.Data.AssessmentTemplate.id, 'NodeAssessmentTemplateId');
     
                expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData("CustomAssessmentCreateModel").Title);
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(getTestData("CustomAssessmentCreateModel").Description);
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData("CustomAssessmentCreateModel").Type);
                expect(response.body.Data.AssessmentTemplate. Provider).to.equal(getTestData("CustomAssessmentCreateModel").Provider);
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("CustomAssessmentCreateModel").ProviderAssessmentCode);
                           
            })
            .expect(201, done);
    });

    it('407 - Add question node - single choice', function(done) {
        loadCustomAssessmentSCQModel();

        const createModel = getTestData("CustomAssessmentSCQModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, "AssessmentNodeSCQId");
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeSCQId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentSCQModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentSCQModel").NodeType);
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData("CustomAssessmentSCQModel").Title);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("CustomAssessmentSCQModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("CustomAssessmentSCQModel").QueryResponseType);
                           
            })
            .expect(201, done);
    });

    it('408 - Add question node - multi-choice', function(done) {
        loadCustomAssessmentMCQModel();

        const createModel = getTestData("CustomAssessmentMCQModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeMCQId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');

                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeMCQId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentMCQModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentMCQModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentMCQModel").Title);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("CustomAssessmentMCQModel").QueryResponseType);
                           
            })
            .expect(201, done);
    });

    it('409 - Add list node', function(done) {
        loadCustomAssessmentNodeListModel();

        const createModel = getTestData("CustomAssessmentNodeListModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeListId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');

                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeListId');
                           
                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentNodeListModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentNodeListModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentNodeListModel").Title);
                           
            })
            .expect(201, done);
    });

    it('410 - Add question node - text', function(done) {
        loadCustomAssessmentNodeTextTypeModel();

        const createModel = getTestData("CustomAssessmentNodeTextTypeModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeTextTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
                
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeTextTypeId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentNodeTextTypeModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentNodeTextTypeModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentNodeTextTypeModel").Title);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("CustomAssessmentNodeTextTypeModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("CustomAssessmentNodeTextTypeModel").QueryResponseType);
                           
            })
            .expect(201, done);
    });

    it('411 - Add question node - date', function(done) {
        loadCustomAssessmentNodeDateTypeModel();

        const createModel = getTestData("CustomAssessmentNodeDateTypeModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeDateTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
             
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeDateTypeId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentNodeDateTypeModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentNodeDateTypeModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentNodeDateTypeModel").Title);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("CustomAssessmentNodeDateTypeModel").QueryResponseType);
                           
            })
            .expect(201, done);
    });

    it('412 - Add question node - boolean', function(done) {
        loadCustomAssessmentNodeBooleanTypeModel();

        const createModel = getTestData("CustomAssessmentNodeBooleanTypeModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeBooleanTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
               
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeBooleanTypeId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentNodeBooleanTypeModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentNodeBooleanTypeModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentNodeBooleanTypeModel").Title);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("CustomAssessmentNodeBooleanTypeModel").QueryResponseType);
                           
            })
            .expect(201, done);
    });

    it('413 - Add message node', function(done) {
        loadCustomAssessmentNodeMessageTypeModel();

        const createModel = getTestData("CustomAssessmentNodeMessageTypeModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData("NodeAssessmentTemplateId")}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeMessageTypeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Message');
              
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentNodeMessageTypeId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").Title);
                expect(response.body.Data.AssessmentNode.Message).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").Message);
                           
            })
            .expect(201, done);
    });

    it('414 - Get updated assessment template by id', function(done) {
    
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
   
                expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData("CustomAssessmentCreateModel").Title);
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(getTestData("CustomAssessmentCreateModel").Description);
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData("CustomAssessmentCreateModel").Type);
                expect(response.body.Data.AssessmentTemplate. Provider).to.equal(getTestData("CustomAssessmentCreateModel").Provider);
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("CustomAssessmentCreateModel").ProviderAssessmentCode);
            })
            .expect(200, done);
    });

    it('415 - Get node by id', function(done) {
 
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}/nodes/${getTestData('AssessmentNodeMessageTypeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Message');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").NodeType);
                expect(response.body.Data.AssessmentNode. Title).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").Title);
                expect(response.body.Data.AssessmentNode.Message).to.equal(getTestData("CustomAssessmentNodeMessageTypeModel").Message);
            })
            .expect(200, done);
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

