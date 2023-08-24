import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Negative KCCQAssessmentTemplate tests', function() {

    var agent = request.agent(infra._app);

    it('221 - Negative - Create KCCQ Assessment Template', function(done) {
        loadKCCQAssessmentTemplateCreateModel();
        const createModel = getTestData("AssessmentTemplateCreateModel");
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

    it('222 - Negative - Add list node - Q1', function(done) {
        loadKCCQNodeListCreateModel();
        const createModel = getTestData("AssessmentNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('223 - Negative - Create QuestionNodeList Q1.1 question', function(done) {
        loadFirstSubQuestionNodeListCreateModel();
        const createModel = getTestData("FirstSubQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(403, done);
    });

    it('224 - Negative - Add question node to template- Q 2', function(done) {
        loadSingleQuestionNodeListCreateModel();
        const createModel = getTestData("SingleQuestionNodeListCreateModel");
        agent
            .post(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScoreId')}/nodes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('225 - Negative - Get assessment template by id', function(done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScore')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("Patientwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('226 - Negative - Update AssessmentTemplate', function(done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData("AssessmentTemplateUpdateModel");
 
        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('AssessmentTemplateScore')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
               
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////

export const loadKCCQAssessmentTemplateCreateModel = async (
) => {
    const model = {
        
    };
    setTestData(model, "AssessmentTemplateCreateModel");
};

export const loadKCCQNodeListCreateModel = async (
) => {
    const model = {

    };
    setTestData(model, "AssessmentNodeListCreateModel");
};

export const loadFirstSubQuestionNodeListCreateModel = async (
) => {
    const model = {
       
    };
    setTestData(model, "FirstSubQuestionNodeListCreateModel");
};

export const loadSecondSubQuestionNodeListCreateModel = async (
) => {
    const model = {
        Options : [
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
        Options : [
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
