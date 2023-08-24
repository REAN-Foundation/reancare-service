import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Knowledge nuggets tests', function() {

    var agent = request.agent(infra._app);

    it('178 - Create knowledge nugget', function(done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData("KnowledgeNuggetCreateModel");
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.KnowledgeNugget.id, 'KnowledgeNuggetId');
                expect(response.body.Data.KnowledgeNugget).to.have.property('id');
                expect(response.body.Data.KnowledgeNugget).to.have.property('TopicName');
                expect(response.body.Data.KnowledgeNugget).to.have.property('BriefInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('DetailedInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('AdditionalResources');
                expect(response.body.Data.KnowledgeNugget).to.have.property('Tags');

                setTestData(response.body.Data.KnowledgeNugget.id, 'KnowledgeNuggetId');

                expect(response.body.Data.KnowledgeNugget.TopicName).to.equal(getTestData("KnowledgeNuggetCreateModel").TopicName);
                expect(response.body.Data.KnowledgeNugget.BriefInformation).to.equal(getTestData("KnowledgeNuggetCreateModel").BriefInformation);
                expect(response.body.Data.KnowledgeNugget.DetailedInformation).to.equal(getTestData("KnowledgeNuggetCreateModel").DetailedInformation);

            })
            .expect(201, done);
    });

    it('179 - Get knowledge nugget by id', function(done) {

        agent
            .get(`/api/v1/educational/knowledge-nuggets/${getTestData('KnowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.KnowledgeNugget).to.have.property('id');
                expect(response.body.Data.KnowledgeNugget).to.have.property('TopicName');
                expect(response.body.Data.KnowledgeNugget).to.have.property('BriefInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('DetailedInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('AdditionalResources');
                expect(response.body.Data.KnowledgeNugget).to.have.property('Tags');

                expect(response.body.Data.KnowledgeNugget.TopicName).to.equal(getTestData("KnowledgeNuggetCreateModel").TopicName);
                expect(response.body.Data.KnowledgeNugget.BriefInformation).to.equal(getTestData("KnowledgeNuggetCreateModel").BriefInformation);
                expect(response.body.Data.KnowledgeNugget.DetailedInformation).to.equal(getTestData("KnowledgeNuggetCreateModel").DetailedInformation);

            })
            .expect(200, done);
    });

    it('180 - Get knowledge nugget by todays topic', function(done) {

        agent
            .get(`/api/v1/educational/knowledge-nuggets/today/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('181 - Search knowledge nugget records', function(done) {
        loadKnowledgeNuggetQueryString();
        agent
            .get(`/api/v1/educational/knowledge-nuggets/search${loadKnowledgeNuggetQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.KnowledgeNuggetRecords).to.have.property('TotalCount');
                expect(response.body.Data.KnowledgeNuggetRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.KnowledgeNuggetRecords).to.have.property('PageIndex');
                expect(response.body.Data.KnowledgeNuggetRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.KnowledgeNuggetRecords).to.have.property('Order');
                expect(response.body.Data.KnowledgeNuggetRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.KnowledgeNuggetRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.KnowledgeNuggetRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('182 - Update knowledge nugget', function(done) {
        loadKnowledgeNuggetUpdateModel();
        const updateModel = getTestData("KnowledgeNuggetUpdateModel");
        agent
            .put(`/api/v1/educational/knowledge-nuggets/${getTestData('KnowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.KnowledgeNugget).to.have.property('id');
                expect(response.body.Data.KnowledgeNugget).to.have.property('TopicName');
                expect(response.body.Data.KnowledgeNugget).to.have.property('BriefInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('DetailedInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('AdditionalResources');
                expect(response.body.Data.KnowledgeNugget).to.have.property('Tags');

                expect(response.body.Data.KnowledgeNugget.TopicName).to.equal(getTestData("KnowledgeNuggetUpdateModel").TopicName);

            })
            .expect(200, done);
    });

    it('183 - Delete knowledge nugget', function(done) {
       
        agent
            .delete(`/api/v1/educational/knowledge-nuggets/${getTestData('KnowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create knowledge nugget again', function(done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData("KnowledgeNuggetCreateModel");
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.KnowledgeNugget.id, 'KnowledgeNuggetId');
                expect(response.body.Data.KnowledgeNugget).to.have.property('id');
                expect(response.body.Data.KnowledgeNugget).to.have.property('TopicName');
                expect(response.body.Data.KnowledgeNugget).to.have.property('BriefInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('DetailedInformation');
                expect(response.body.Data.KnowledgeNugget).to.have.property('AdditionalResources');
                expect(response.body.Data.KnowledgeNugget).to.have.property('Tags');

                setTestData(response.body.Data.KnowledgeNugget.id, 'KnowledgeNuggetId');

                expect(response.body.Data.KnowledgeNugget.TopicName).to.equal(getTestData("KnowledgeNuggetCreateModel").TopicName);
                expect(response.body.Data.KnowledgeNugget.BriefInformation).to.equal(getTestData("KnowledgeNuggetCreateModel").BriefInformation);
                expect(response.body.Data.KnowledgeNugget.DetailedInformation).to.equal(getTestData("KnowledgeNuggetCreateModel").DetailedInformation);

            })
            .expect(201, done);
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

function loadKnowledgeNuggetQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?TopicName=Some topic';
    return queryString;
}
