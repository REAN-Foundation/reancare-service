import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('KCCQAssessmentTemplate tests', function() {

    var agent = request.agent(infra._app);

    it('391 - Create KCCQ Assessment Template', function(done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateScoreId');
                setTestData(response.body.Data.AssessmentTemplate.RootNodeId, 'AssessmentTemplateRootNodeId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ServeListNodeChildrenAtOnce');

                setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateScoreId');

                expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData("AssessmentTemplateCreateModel").Title);
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(getTestData("AssessmentTemplateCreateModel").Description);
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData("AssessmentTemplateCreateModel").Type);
                expect(response.body.Data.AssessmentTemplate.Provider).to.equal(getTestData("AssessmentTemplateCreateModel").Provider);
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("AssessmentTemplateCreateModel").ProviderAssessmentCode);
                expect(response.body.Data.AssessmentTemplate.ServeListNodeChildrenAtOnce).to.equal(getTestData("AssessmentTemplateCreateModel").ServeListNodeChildrenAtOnce);
            })
            .expect(201, done);
    });

    it('392 - Add list node - Q1', function(done) {
        loadKCCQNodeListCreateModel();
        const createModel = getTestData("AssessmentNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId');
                setTestData(response.body.Data.AssessmentNode.ParentNodeId, 'NodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('ServeListNodeChildrenAtOnce');

                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId');

                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("AssessmentNodeListCreateModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("AssessmentNodeListCreateModel").NodeType);
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData("AssessmentNodeListCreateModel").Title);
                expect(response.body.Data.AssessmentNode.ServeListNodeChildrenAtOnce).to.equal(getTestData("AssessmentNodeListCreateModel").ServeListNodeChildrenAtOnce);
            })
            .expect(201, done);
    });

    it('393 - Create QuestionNodeList Q1.1 question', function(done) {
        loadFirstSubQuestionNodeListCreateModel();
        const createModel = getTestData("FirstSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_1');
                setTestData(response.body.Data.AssessmentNode.ParentNodeId, 'NodeId_1');
                expect(response.body.Data.AssessmentNode).to.have.property('id');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('Title');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
              
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_1');
                
                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("FirstSubQuestionNodeListCreateModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.Title).to.equal(getTestData("FirstSubQuestionNodeListCreateModel").Title);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("FirstSubQuestionNodeListCreateModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("FirstSubQuestionNodeListCreateModel").QueryResponseType);
                
            })
            .expect(201, done);
    });

    it('394 - Create QuestionNodeList Q1.2 question', function(done) {
        loadSecondSubQuestionNodeListCreateModel();
        const createModel = getTestData("SecondSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_2');
                setTestData(response.body.Data.AssessmentNode.ParentNodeId, 'NodeId_2');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
                
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_2');
                
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("SecondSubQuestionNodeListCreateModel").NodeType);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("SecondSubQuestionNodeListCreateModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("SecondSubQuestionNodeListCreateModel").QueryResponseType);

            })
            .expect(201, done);
    });

    it('395 - Create QuestionNodeList Q1.3 question', function(done) {
        loadThirdSubQuestionNodeListCreateModel();
        const createModel = getTestData("ThirdSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_3');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
       
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_3');
              
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("ThirdSubQuestionNodeListCreateModel").NodeType);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("ThirdSubQuestionNodeListCreateModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("ThirdSubQuestionNodeListCreateModel").QueryResponseType);
                
            })
            .expect(201, done);
    });

    it('396 - Add question node to template- Q 2', function(done) {
        loadSingleQuestionNodeListCreateModel();
        const createModel = getTestData("SingleQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_4');
                expect(response.body.Data.AssessmentNode).to.have.property('ParentNodeId');
                expect(response.body.Data.AssessmentNode).to.have.property('NodeType');
                expect(response.body.Data.AssessmentNode).to.have.property('Description');
                expect(response.body.Data.AssessmentNode).to.have.property('QueryResponseType');
            
                setTestData(response.body.Data.AssessmentNode.id, 'AssessmentQuestionNodeId_4');
            
                expect(response.body.Data.AssessmentNode.ParentNodeId).to.equal(getTestData("SingleQuestionNodeListCreateModel").ParentNodeId);
                expect(response.body.Data.AssessmentNode.NodeType).to.equal(getTestData("SingleQuestionNodeListCreateModel").NodeType);
                expect(response.body.Data.AssessmentNode.Description).to.equal(getTestData("SingleQuestionNodeListCreateModel").Description);
                expect(response.body.Data.AssessmentNode.QueryResponseType).to.equal(getTestData("SingleQuestionNodeListCreateModel").QueryResponseType);
            })
            .expect(201, done);
    });

    it('397 - Get assessment template by id', function(done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('DisplayCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('RootNodeId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ScoringApplicable');
                expect(response.body.Data.AssessmentTemplate).to.have.property('FileResourceId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ServeListNodeChildrenAtOnce');
                expect(response.body.Data.AssessmentTemplate).to.have.property('TotalNumberOfQuestions');

                expect(response.body.Data.AssessmentTemplate.Title).to.equal(getTestData("AssessmentTemplateCreateModel").Title);
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(getTestData("AssessmentTemplateCreateModel").Description);
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(getTestData("AssessmentTemplateCreateModel").Type);
                expect(response.body.Data.AssessmentTemplate.Provider).to.equal(getTestData("AssessmentTemplateCreateModel").Provider);
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(getTestData("AssessmentTemplateCreateModel").ProviderAssessmentCode);
                expect(response.body.Data.AssessmentTemplate.ServeListNodeChildrenAtOnce).to.equal(getTestData("AssessmentTemplateCreateModel").ServeListNodeChildrenAtOnce);
            })
            .expect(200, done);
    });

    it('398 - Update AssessmentTemplate', function(done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData("AssessmentTemplateUpdateModel");
 
        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.AssessmentTemplate).to.have.property('id');
                expect(response.body.Data.AssessmentTemplate).to.have.property('DisplayCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');
                expect(response.body.Data.AssessmentTemplate).to.have.property('RootNodeId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('FileResourceId');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ServeListNodeChildrenAtOnce');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ScoringApplicable');
                expect(response.body.Data.AssessmentTemplate).to.have.property('TotalNumberOfQuestions');
              
                expect(response.body.Data.AssessmentTemplate.ScoringApplicable).to.equal(getTestData("AssessmentTemplateUpdateModel").ScoringApplicable);
               
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Title                       : "Quality of Life Questionnaire",
        Description                 : "Effect of heart failure on the life of a patient",
        Type                        : "Careplan",
        Provider                    : "AHA",
        ProviderAssessmentCode      : "1",
        ServeListNodeChildrenAtOnce : true
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadKCCQNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId                : getTestData("AssessmentTemplateRootNodeId"),
        NodeType                    : "Node list",
        Title                       : "Q 1/8. Effects of heart failure on daily activities.",
        ServeListNodeChildrenAtOnce : true
    };
    setTestData(model, "AssessmentNodeListCreateModel");
};

export const loadFirstSubQuestionNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentQuestionNodeId'),
        NodeType          : "Question",
        Title             : "1.1 How frequently do you take showering or bathing?",
        Description       : "Unscheduled daily checks",
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : "extremely limited",
                Text              : "Extremely limited",
                Sequence          : 1
            },
            {
                ProviderGivenCode : "quite a bit limited",
                Text              : "Quite a bit limited",
                Sequence          : 2
            },
            {
                ProviderGivenCode : "moderately limited",
                Text              : "Moderately limited",
                Sequence          : 3
            },
            {
                ProviderGivenCode : "slightly limited",
                Text              : "Slightly limited",
                Sequence          : 4
            },
            {
                ProviderGivenCode : "not at all limited",
                Text              : "Not at all limited",
                Sequence          : 5
            },
            {
                ProviderGivenCode : "limited for other reasons or did not do the activity",
                Text              : "Limited for other reasons or did not do the activity",
                Sequence          : 6
            }
        ]
    };
    setTestData(model, "FirstSubQuestionNodeListCreateModel");
};

export const loadSecondSubQuestionNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentQuestionNodeId'),
        NodeType          : "Question",
        Title             : "1.2 How frequently do you walk 1 block on level ground?",
        Description       : "Unscheduled daily checks",
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : "extremely limited",
                Text              : "Extremely limited",
                Sequence          : 1
            },
            {
                ProviderGivenCode : "quite a bit limited",
                Text              : "Quite a bit limited",
                Sequence          : 2
            },
            {
                ProviderGivenCode : "moderately limited",
                Text              : "Moderately limited",
                Sequence          : 3
            },
            {
                ProviderGivenCode : "slightly limited",
                Text              : "Slightly limited",
                Sequence          : 4
            },
            {
                ProviderGivenCode : "not at all limited",
                Text              : "Not at all limited",
                Sequence          : 5
            },
            {
                ProviderGivenCode : "limited for other reasons or did not do the activity",
                Text              : "Limited for other reasons or did not do the activity",
                Sequence          : 6
            }
        ]
    };
    setTestData(model, "SecondSubQuestionNodeListCreateModel");
};

export const loadThirdSubQuestionNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentQuestionNodeId'),
        NodeType          : "Question",
        Title             : "1.3 How frequently are you hurrying or jogging (as if to catch a bus)?",
        Description       : "Unscheduled daily checks",
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : "extremely limited",
                Text              : "Extremely limited",
                Sequence          : 1
            },
            {
                ProviderGivenCode : "quite a bit limited",
                Text              : "Quite a bit limited",
                Sequence          : 2
            },
            {
                ProviderGivenCode : "moderately limited",
                Text              : "Moderately limited",
                Sequence          : 3
            },
            {
                ProviderGivenCode : "slightly limited",
                Text              : "Slightly limited",
                Sequence          : 4
            },
            {
                ProviderGivenCode : "not at all limited",
                Text              : "Not at all limited",
                Sequence          : 5
            },
            {
                ProviderGivenCode : "limited for other reasons or did not do the activity",
                Text              : "Limited for other reasons or did not do the activity",
                Sequence          : 6
            }
        ]
    };
    setTestData(model, "ThirdSubQuestionNodeListCreateModel");
};

export const loadSingleQuestionNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentTemplateRootNodeId'),
        NodeType          : "Question",
        Title             : "Q 2/8. Over the past 2 weeks, how many times did you have swelling in your feet, ankles or legs when you woke up in the morning?",
        Description       : "Checks over past 2 weeks",
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : "every morning",
                Text              : "Every morning",
                Sequence          : 1
            },
            {
                ProviderGivenCode : "3 or more times per week but not every day",
                Text              : "3 or more times per week but not every day",
                Sequence          : 2
            },
            {
                ProviderGivenCode : "1-2 times per week",
                Text              : "1-2 times per week",
                Sequence          : 3
            },
            {
                ProviderGivenCode : "less than once a week",
                Text              : "Less than once a week",
                Sequence          : 4
            },
            {
                ProviderGivenCode : "never over the past 2 weeks",
                Text              : "Never over the past 2 weeks",
                Sequence          : 5
            }
        ]

    };
    setTestData(model, "SingleQuestionNodeListCreateModel");
};

export const loadAssessmentTemplateUpdateModel = async (
) => {
    const model = {
        ScoringApplicable : true
    };
    setTestData(model, "AssessmentTemplateUpdateModel");
};
