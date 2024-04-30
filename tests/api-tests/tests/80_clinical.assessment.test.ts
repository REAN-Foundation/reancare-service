import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

//////////////////////////////////////////////////////////////////////////////////

describe('80 - CURD Model tests', function () {
    var agent = request.agent(infra._app);

    it('80:01 -> Get assessment template by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('80:02 -> Update assessment template by id', function (done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData('assessmentTemplateUpdateModel');

        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.AssessmentTemplate).to.have.property('Title');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Description');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Type');
                expect(response.body.Data.AssessmentTemplate).to.have.property('Provider');
                expect(response.body.Data.AssessmentTemplate).to.have.property('ProviderAssessmentCode');

                expect(response.body.Data.AssessmentTemplate.Title).to.equal(
                    getTestData('assessmentTemplateUpdateModel').Title
                );
                expect(response.body.Data.AssessmentTemplate.Description).to.equal(
                    getTestData('assessmentTemplateUpdateModel').Description
                );
                expect(response.body.Data.AssessmentTemplate.Type).to.equal(
                    getTestData('assessmentTemplateUpdateModel').Type
                );
                expect(response.body.Data.AssessmentTemplate.Provider).to.equal(
                    getTestData('assessmentTemplateUpdateModel').Provider
                );
                expect(response.body.Data.AssessmentTemplate.ProviderAssessmentCode).to.equal(
                    getTestData('assessmentTemplateUpdateModel').ProviderAssessmentCode
                );
            })
            .expect(200, done);
    });

    it('80:03 -> Search assessment templates', function (done) {
        loadAssessmentTemplateQueryString();
        agent
            .get(`/api/v1/clinical/assessment-templates/search${loadAssessmentTemplateQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('80:04 -> Delete assessment template by id', function (done) {
        agent
            .delete(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('80:05 -> Negative - Get assessment template by id', function (done) {
        agent
            .get(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplate')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('80:06 -> Negative - Update assessment template by id', function (done) {
        loadAssessmentTemplateUpdateModel();
        const updateModel = getTestData('assessmentTemplateUpdateModel');

        agent
            .put(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('80:07 -> Negative - Search assessment templates', function (done) {
        loadAssessmentTemplateQueryString();
        agent
            .get(`/api/v1/clinical/assessment-templates/search${loadAssessmentTemplateQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patienttJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('80:08 -> Negative - Delete assessment template by id', function (done) {
        agent
            .delete(`/api/v1/clinical/assessment-templates/${getTestData('nodeAssessmentTemplateId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////

export const loadAssessmentTemplateUpdateModel = async () => {
    const model = {
        Title: faker.lorem.word(15),
        Description: faker.lorem.word(15),
        Type: getRandomEnumValue(AssessmentType),
        Provider: faker.lorem.word(5),
        ProviderAssessmentCode: faker.lorem.word(5),
    };
    setTestData(model, 'assessmentTemplateUpdateModel');
};

function loadAssessmentTemplateQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
