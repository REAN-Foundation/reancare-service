import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('54 - Symtom assessment template tests', function () {
    var agent = request.agent(infra._app);

    it('54:01 -> Create assessment template', function (done) {
        loadTemplateCreateModel();
        const createModel = getTestData('templateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setSymptomAssessmentTemplateId(response, 'assessmentTemplateId_1');
                expectSymptomAssessmentTemplateProperties(response);

                expectSymptomAssessmentTemplatePropertyValues(response);
            })
            .expect(201, done);
    });

    it('54:02 -> Add symptoms types template', function (done) {
        loadSymptomTemplateCreateModel();
        const createModel = getTestData('symptomTemplateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}/add-symptom-types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.SymptomAssessmentTemplate.id, 'assessmentSymptomTemplateId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('54:03 -> Get assessment template by id', function (done) {
        agent
            .get(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectSymptomAssessmentTemplateProperties(response);

                expectSymptomAssessmentTemplatePropertyValues(response);
            })
            .expect(200, done);
    });

    it('54:04 -> Search assessment template records', function (done) {
        loadTemplateQueryString();
        agent
            .get(`/api/v1/clinical/symptom-assessment-templates/search${loadTemplateQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body.Data.SymptomAssessmentTemplates).to.have.property('TotalCount');
                expect(response.body.Data.SymptomAssessmentTemplates).to.have.property('RetrievedCount');
                expect(response.body.Data.SymptomAssessmentTemplates).to.have.property('PageIndex');
                expect(response.body.Data.SymptomAssessmentTemplates).to.have.property('ItemsPerPage');
                expect(response.body.Data.SymptomAssessmentTemplates).to.have.property('Order');
                expect(response.body.Data.SymptomAssessmentTemplates.TotalCount).to.greaterThan(0);
                expect(response.body.Data.SymptomAssessmentTemplates.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.SymptomAssessmentTemplates.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('54:05 -> Update assessment template', function (done) {
        loadTemplateUpdateModel();
        const updateModel = getTestData('templateUpdateModel');
        agent
            .put(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectSymptomAssessmentTemplateProperties(response);

                expect(response.body.Data.SymptomAssessmentTemplate.Title).to.equal(
                    getTestData('templateUpdateModel').Title
                );
                expect(response.body.Data.SymptomAssessmentTemplate.Description).to.equal(
                    getTestData('templateUpdateModel').Description
                );
            })
            .expect(200, done);
    });

    it('54:06 -> Remove symptoms types template', function (done) {
        loadRemoveSymptomTemplateCreateModel();
        const createModel = getTestData('removeSymptomTemplateCreateModel');
        agent
            .post(
                `/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}/remove-symptom-types`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('54:07 -> Get assessment template by id after removing symptom types', function (done) {
        agent
            .get(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('54:08 -> Delete assessment template', function (done) {
        agent
            .delete(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create assessment template again', function (done) {
        loadTemplateCreateModel();
        const createModel = getTestData('templateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setSymptomAssessmentTemplateId(response, 'assessmentTemplateId');
                expectSymptomAssessmentTemplateProperties(response);

                expectSymptomAssessmentTemplatePropertyValues(response);
            })
            .expect(201, done);
    });

    it('Add symptoms types template again', function (done) {
        loadSymptomTemplateCreateModel();
        const createModel = getTestData('symptomTemplateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId')}/add-symptom-types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.SymptomAssessmentTemplate.id, 'assessmentSymptomTemplateId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('54:09 -> Negative - Create assessment template', function (done) {
        loadTemplateCreateModel();
        const createModel = getTestData('templateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('54:10 -> Negative - Add symptoms types template', function (done) {
        loadNegativeSymptomTemplateCreateModel();
        const createModel = getTestData('negativeSymptomTemplateCreateModel');
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId')}/add-symptom-types`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('54:11 -> Negative - Search assessment template records', function (done) {
        loadTemplateQueryString();
        agent
            .get(`/api/v1/clinical/symptom-assessment-templates/search${loadTemplateQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('54:12 -> Negative - Remove symptoms types template', function (done) {
        loadRemoveSymptomTemplateCreateModel();
        const createModel = getTestData('removeSymptomTemplateCreateModel');
        agent
            .post(
                `/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}/remove-symptom-types`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('54:13 -> Negative - Delete assessment template', function (done) {
        agent
            .delete(`/api/v1/clinical/symptom-assessment-templates/${getTestData('assessmentTemplateId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setSymptomAssessmentTemplateId(response, key) {
    setTestData(response.body.Data.SymptomAssessmentTemplate.id, key);
}

function expectSymptomAssessmentTemplateProperties(response) {
    expect(response.body.Data.SymptomAssessmentTemplate).to.have.property('id');
    expect(response.body.Data.SymptomAssessmentTemplate).to.have.property('Title');
    expect(response.body.Data.SymptomAssessmentTemplate).to.have.property('Description');
}

function expectSymptomAssessmentTemplatePropertyValues(response) {
    expect(response.body.Data.SymptomAssessmentTemplate.Title).to.equal(getTestData('templateCreateModel').Title);
    expect(response.body.Data.SymptomAssessmentTemplate.Description).to.equal(
        getTestData('templateCreateModel').Description
    );
}

export const loadTemplateCreateModel = async () => {
    const model = {
        Title: faker.lorem.word(),
        Description: faker.lorem.words(10),
        Tags: [faker.lorem.words(), faker.lorem.words()],
    };
    setTestData(model, 'templateCreateModel');
};

export const loadSymptomTemplateCreateModel = async () => {
    const model = {
        SymptomTypeIds: [getTestData('symptomTypeId')],
    };
    setTestData(model, 'symptomTemplateCreateModel');
};

export const loadTemplateUpdateModel = async () => {
    const model = {
        Title: faker.lorem.word(),
        Description: faker.lorem.words(10),
        Tags: [faker.lorem.words()],
    };
    setTestData(model, 'templateUpdateModel');
};

function loadTemplateQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadRemoveSymptomTemplateCreateModel = async () => {
    const model = {
        SymptomTypeIds: [getTestData('symptomTypeId')],
    };
    setTestData(model, 'removeSymptomTemplateCreateModel');
};

export const loadNegativeSymptomTemplateCreateModel = async () => {
    const model = {};
    setTestData(model, 'negativeSymptomTemplateCreateModel');
};
