import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('Negative CURD Model tests', function() {

    var agent = request.agent(infra._app);
  
    it('249 - Negative - Get assessment template by id', function(done) {
 
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplate')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('250 - Negative - Update assessment template by id', function(done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData("AssessmentTemplateUpdateModel");
     
        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('251 - Negative - Search assessment templates', function(done) {
        loadAssessmentTemplateQueryString();
        agent
            .get(`/api/v1/clinical/assessment-templates/search${loadAssessmentTemplateQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                                                          
            })
            .expect(403, done);
    });

    it('252 - Negative - Delete assessment template by id', function(done) {
   
        agent
            .delete(`/api/v1/clinical/assessment-templates/${getTestData('NodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93wPY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////

export const loadAssessmentTemplateUpdateModel = async (
) => {
    const model = {
        Title                  : "An updated assessment template",
        Description            : "Updated description",
        Type                   : "Protocol",
        Provider               : "NICE",
        ProviderAssessmentCode : "2000"
    };
    setTestData(model, "AssessmentTemplateUpdateModel");
};

function loadAssessmentTemplateQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?title=A new assessment template';
    return queryString;
}

export const loadNodeUpdateModel = async (
) => {
    const model = {
        Title       : "Please visit your doctor",
        Sequence    : 15,
        Description : "Please make time to consult your doctor."
    };
    setTestData(model, "NodeUpdateModel");
};
