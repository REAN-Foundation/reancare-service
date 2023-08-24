import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Knowledge nuggets tests', function() {

    var agent = request.agent(infra._app);

    it('97 - Negative - Create knowledge nugget', function(done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData("KnowledgeNugget");
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('98 - Negative - Get knowledge nugget by id', function(done) {

        agent
            .get(`/api/v1/educational/knowledge-nuggets/${getTestData('KnowledgeNugget')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('99 - Negative - Update knowledge nugget', function(done) {
        loadKnowledgeNuggetUpdateModel();
        const updateModel = getTestData("KnowledgeNuggetUpdateModel");
        agent
            .put(`/api/v1/educational/knowledge-nuggets/${getTestData('KnowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('100 - Negative - Delete knowledge nugget', function(done) {
       
        agent
            .delete(`/api/v1/educational/knowledge-nuggets/${getTestData('KnowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadKnowledgeNuggetCreateModel = async (
) => {
    const model = {
        TopicName           : "Some topic",
        BriefInformation    : "Brief information for topic",
        DetailedInformation : "Detailed information for the topic",
        AdditionalResources : [
            "Knowledge"
        ],
        Tags : [
            "BP"
        ]
  
    };
    setTestData(model, "KnowledgeNuggetCreateModel");
};

export const loadKnowledgeNuggetUpdateModel = async (
) => {
    const model = {
        TopicName : "Hypertension"
    };
    setTestData(model, "KnowledgeNuggetUpdateModel");
};
