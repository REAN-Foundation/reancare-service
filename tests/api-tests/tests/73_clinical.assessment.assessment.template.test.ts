import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { AssessmentNodeType, AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('73 - KCCQAssessmentTemplate tests', function() {

    var agent = request.agent(infra._app);

    it('73:01 -> Create KCCQ Assessment Template', function(done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            })
            .expect(201, done);
    });

    it('73:02 -> Add list node - Q1', function(done) {
        loadKCCQNodeListCreateModel();
        const createModel = getTestData("AssessmentNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            })
            .expect(201, done);
    });

    it('73:03 -> Create QuestionNodeList Q1.1 question', function(done) {
        loadFirstSubQuestionNodeListCreateModel();
        const createModel = getTestData("FirstSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('73:04 -> Create QuestionNodeList Q1.2 question', function(done) {
        loadSecondSubQuestionNodeListCreateModel();
        const createModel = getTestData("SecondSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('73:05 -> Create QuestionNodeList Q1.3 question', function(done) {
        loadThirdSubQuestionNodeListCreateModel();
        const createModel = getTestData("ThirdSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('73:06 -> Add question node to template- Q 2', function(done) {
        loadSingleQuestionNodeListCreateModel();
        const createModel = getTestData("SingleQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('73:07 -> Get assessment template by id', function(done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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
            })
            .expect(200, done);
    });

    it('73:08 -> Update AssessmentTemplate', function(done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData("AssessmentTemplateUpdateModel");
 
        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

    it('73:09 -> Negative - Create KCCQ Assessment Template', function(done) {
        agent
            .post(`/api/v1/clinical/assessment-templates`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('73:10 -> Negative - Add list node - Q1', function(done) {
        loadKCCQNodeListCreateModel();
        const createModel = getTestData("AssessmentNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('73:11 -> Negative - Create QuestionNodeList Q1.1 question', function(done) {
        loadFirstSubQuestionNodeListCreateModel();
        const createModel = getTestData("FirstSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(403, done);
    });

    it('73:12 -> Negative - Add question node to template- Q 2', function(done) {
        loadSingleQuestionNodeListCreateModel();
        const createModel = getTestData("SingleQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
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

export const loadKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Title                       : faker.lorem.word(5),
        Description                 : faker.lorem.word(15),
        Type                        : getRandomEnumValue(AssessmentType),
        Provider                    : faker.lorem.word(),
        ProviderAssessmentCode      : faker.lorem.word(),
        ServeListNodeChildrenAtOnce : faker.datatype.boolean()
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadKCCQNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId                : getTestData("AssessmentTemplateRootNodeId"),
        NodeType                    : 'Node list',
        Title                       : faker.lorem.word(15),
        ServeListNodeChildrenAtOnce : faker.datatype.boolean()
    };
    setTestData(model, "AssessmentNodeListCreateModel");
};

export const loadFirstSubQuestionNodeListCreateModel = async (
) => {
    const model = {
        ParentNodeId      : getTestData('AssessmentQuestionNodeId'),
        NodeType          : "Question",
        Title             : faker.lorem.word(15),
        Description       : faker.lorem.word(15),
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
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
        Title             : faker.lorem.word(15),
        Description       : faker.lorem.word(15),
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
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
        Title             : faker.lorem.word(15),
        Description       :  faker.lorem.word(15),
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
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
        Title             : faker.lorem.word(15),
        Description       : faker.lorem.word(15),
        QueryResponseType : "Single Choice Selection",
        Options           : [
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
            },
            {
                ProviderGivenCode : faker.lorem.word(5),
                Text              : faker.lorem.word(5),
                Sequence          : faker.number.int(10)
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

export const loadNegativeKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        Description                 : faker.lorem.word(15),
        Type                        : getRandomEnumValue(AssessmentType),
        Provider                    : faker.lorem.word(),
        ProviderAssessmentCode      : faker.lorem.word(),
        ServeListNodeChildrenAtOnce : faker.datatype.boolean() 
    };
    setTestData(model, "NegativeAssessmentTemplateCreateModel");
};
