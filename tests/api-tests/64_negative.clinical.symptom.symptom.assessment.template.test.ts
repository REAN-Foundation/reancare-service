import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Assessment template tests', function() {

    var agent = request.agent(infra._app);

    it('159 - Negative - Create assessment template', function(done) {
        loadTemplateCreateModel();
        const createModel = getTestData("TemplateCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93MY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('160 - Negative - Add symptoms types template', function(done) {
        loadSymptomTemplateCreateModel();
        const createModel = getTestData("SymptomTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/${getTestData("AssessmentTemplateId")}/add-symptom-types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('161 - Negative - Search assessment template records', function(done) {
        loadTemplateQueryString();
        agent
            .get(`/api/v1/clinical/symptom-assessment-templates/search${loadTemplateQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('162 - Negative - Remove symptoms types template', function(done) {
        loadRemoveSymptomTemplateCreateModel();
        const createModel = getTestData("RemoveSymptomTemplateCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/${getTestData("AssessmentTemplate")}/remove-symptom-types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(422, done);
    });

    it('163 - Negative - Delete assessment template', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptom-assessment-templates/${getTestData('AssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadTemplateCreateModel = async (
) => {
    const model = {
        Title       : "Stroke",
        Description : "This is an assessment to identify the onset of stroke.",
        Tags        : [
            "Stroke",
            "Paralysis"
        ]
  
    };
    setTestData(model, "TemplateCreateModel");
};

export const loadSymptomTemplateCreateModel = async (
) => {
    const model = {
          
    };
    setTestData(model, "SymptomTemplateCreateModel");
};

export const loadTemplateUpdateModel = async (
) => {
    const model = {
        Title       : "Heart pain",
        Description : "This is updated description of the template.",
        Tags        : [
            "One more tag"
        ]
    };
    setTestData(model, "TemplateUpdateModel");
};

function loadTemplateQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=Stroke';
    return queryString;
}

export const loadRemoveSymptomTemplateCreateModel = async (
) => {
    const model = {
        SymptomTypeIds : [
            getTestData("SymptomTypeId"),
                    
        ]
          
    };
    setTestData(model, "RemoveSymptomTemplateCreateModel");
};
