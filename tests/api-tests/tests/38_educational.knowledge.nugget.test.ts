import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('38 - Knowledge nuggets tests', function () {
    var agent = request.agent(infra._app);

    it('38:01 -> Create knowledge nugget', function (done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData('knowledgeNuggetCreateModel');
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setKnowledgeNuggetId(response, 'knowledgeNuggetId_1');
                expectKnowledgeNuggetProperties(response);

                expectKnowledgeNuggetPropertyValues(response);
            })
            .expect(201, done);
    });

    it('38:02 -> Get knowledge nugget by id', function (done) {
        agent
            .get(`/api/v1/educational/knowledge-nuggets/${getTestData('knowledgeNuggetId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectKnowledgeNuggetProperties(response);

                expectKnowledgeNuggetPropertyValues(response);
            })
            .expect(200, done);
    });

    // it('38:03 -> Get knowledge nugget by todays topic', function(done) {

    //     agent
    //         .get(`/api/v1/educational/knowledge-nuggets/today/${getTestData('patientUserId')}`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("adminJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('38:04 -> Search knowledge nugget records', function (done) {
        loadKnowledgeNuggetQueryString();
        agent
            .get(`/api/v1/educational/knowledge-nuggets/search${loadKnowledgeNuggetQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('38:05 -> Update knowledge nugget', function (done) {
        loadKnowledgeNuggetUpdateModel();
        const updateModel = getTestData('knowledgeNuggetUpdateModel');
        agent
            .put(`/api/v1/educational/knowledge-nuggets/${getTestData('knowledgeNuggetId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectKnowledgeNuggetProperties(response);

                expect(response.body.Data.KnowledgeNugget.TopicName).to.equal(
                    getTestData('knowledgeNuggetUpdateModel').TopicName
                );
            })
            .expect(200, done);
    });

    it('38:06 -> Delete knowledge nugget', function (done) {
        agent
            .delete(`/api/v1/educational/knowledge-nuggets/${getTestData('knowledgeNuggetId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create knowledge nugget again', function (done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData('knowledgeNuggetCreateModel');
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setKnowledgeNuggetId(response, 'knowledgeNuggetId');
                expectKnowledgeNuggetProperties(response);

                expectKnowledgeNuggetPropertyValues(response);
            })
            .expect(201, done);
    });

    it('38:07 -> Negative - Create knowledge nugget', function (done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData('knowledgeNugget');
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('38:08 -> Negative - Get knowledge nugget by id', function (done) {
        agent
            .get(`/api/v1/educational/knowledge-nuggets/${getTestData('knowledgeNuggetId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('38:09 -> Negative - Update knowledge nugget', function (done) {
        loadKnowledgeNuggetUpdateModel();
        const updateModel = getTestData('knowledgeNuggetUpdateModel');
        agent
            .put(`/api/v1/educational/knowledge-nuggets/${getTestData('knowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('38:10 -> Negative - Delete knowledge nugget', function (done) {
        agent
            .delete(`/api/v1/educational/knowledge-nuggets/${getTestData('knowledgeNuggetId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setKnowledgeNuggetId(response, key) {
    setTestData(response.body.Data.KnowledgeNugget.id, key);
}

function expectKnowledgeNuggetProperties(response) {
    expect(response.body.Data.KnowledgeNugget).to.have.property('id');
    expect(response.body.Data.KnowledgeNugget).to.have.property('TopicName');
    expect(response.body.Data.KnowledgeNugget).to.have.property('BriefInformation');
    expect(response.body.Data.KnowledgeNugget).to.have.property('DetailedInformation');
    expect(response.body.Data.KnowledgeNugget).to.have.property('AdditionalResources');
    expect(response.body.Data.KnowledgeNugget).to.have.property('Tags');
}

function expectKnowledgeNuggetPropertyValues(response) {
    expect(response.body.Data.KnowledgeNugget.TopicName).to.equal(getTestData('knowledgeNuggetCreateModel').TopicName);
    expect(response.body.Data.KnowledgeNugget.BriefInformation).to.equal(
        getTestData('knowledgeNuggetCreateModel').BriefInformation
    );
    expect(response.body.Data.KnowledgeNugget.DetailedInformation).to.equal(
        getTestData('knowledgeNuggetCreateModel').DetailedInformation
    );
}

export const loadKnowledgeNuggetCreateModel = async () => {
    const model = {
        TopicName: faker.lorem.word(),
        BriefInformation: faker.word.words(),
        DetailedInformation: faker.word.words(),
        AdditionalResources: [faker.word.words()],
        Tags: [faker.word.words()],
    };
    setTestData(model, 'knowledgeNuggetCreateModel');
};

export const loadKnowledgeNuggetUpdateModel = async () => {
    const model = {
        TopicName: faker.lorem.word(),
    };
    setTestData(model, 'knowledgeNuggetUpdateModel');
};

function loadKnowledgeNuggetQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
