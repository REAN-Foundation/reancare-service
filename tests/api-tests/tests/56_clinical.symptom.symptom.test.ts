import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { Severity } from '../../../src/domain.types/miscellaneous/system.types';
import { ClinicalInterpretation, ClinicalValidationStatus } from '../../../src/domain.types/miscellaneous/clinical.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('56 - Symptom tests', function() {

    var agent = request.agent(infra._app);

    it('56:01 -> Create symptom', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Symptom.id, 'SymptomId_1');
                expect(response.body.Data.Symptom).to.have.property('id');
                expect(response.body.Data.Symptom).to.have.property('PatientUserId');
                expect(response.body.Data.Symptom).to.have.property('AssessmentId');
                expect(response.body.Data.Symptom).to.have.property('SymptomTypeId');
                expect(response.body.Data.Symptom).to.have.property('IsPresent');
                expect(response.body.Data.Symptom).to.have.property('Severity');
                expect(response.body.Data.Symptom).to.have.property('Interpretation');
                expect(response.body.Data.Symptom).to.have.property('Comments');

                setTestData(response.body.Data.Symptom.id, 'SymptomId_1');

                expect(response.body.Data.Symptom.PatientUserId).to.equal(getTestData("SymptomCreateModel").PatientUserId);
                expect(response.body.Data.Symptom.AssessmentId).to.equal(getTestData("SymptomCreateModel").AssessmentId);
                expect(response.body.Data.Symptom.SymptomTypeId).to.equal(getTestData("SymptomCreateModel").SymptomTypeId);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomCreateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomCreateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomCreateModel").Comments);

            })
            .expect(201, done);
    });

    it('56:02 -> Get symptom by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptoms/${getTestData('SymptomId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Symptom).to.have.property('id');
                expect(response.body.Data.Symptom).to.have.property('PatientUserId');
                expect(response.body.Data.Symptom).to.have.property('AssessmentId');
                expect(response.body.Data.Symptom).to.have.property('SymptomTypeId');
                expect(response.body.Data.Symptom).to.have.property('IsPresent');
                expect(response.body.Data.Symptom).to.have.property('Severity');
                expect(response.body.Data.Symptom).to.have.property('Interpretation');
                expect(response.body.Data.Symptom).to.have.property('Comments');

                expect(response.body.Data.Symptom.PatientUserId).to.equal(getTestData("SymptomCreateModel").PatientUserId);
                expect(response.body.Data.Symptom.AssessmentId).to.equal(getTestData("SymptomCreateModel").AssessmentId);
                expect(response.body.Data.Symptom.SymptomTypeId).to.equal(getTestData("SymptomCreateModel").SymptomTypeId);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomCreateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomCreateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomCreateModel").Comments);

            })
            .expect(200, done);
    });

    it('56:03 -> Search symptom records', function(done) {
        loadSymptomQueryString();
        agent
            .get(`/api/v1/clinical/symptoms/search${loadSymptomQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Symptoms).to.have.property('TotalCount');
                expect(response.body.Data.Symptoms).to.have.property('RetrievedCount');
                expect(response.body.Data.Symptoms).to.have.property('PageIndex');
                expect(response.body.Data.Symptoms).to.have.property('ItemsPerPage');
                expect(response.body.Data.Symptoms).to.have.property('Order');
                expect(response.body.Data.Symptoms.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Symptoms.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Symptoms.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('56:04 -> Update symptom', function(done) {
        loadSymptomUpdateModel();
        const updateModel = getTestData("SymptomUpdateModel");
        agent
            .put(`/api/v1/clinical/symptoms/${getTestData('SymptomId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Symptom).to.have.property('id');
                expect(response.body.Data.Symptom).to.have.property('PatientUserId');
                expect(response.body.Data.Symptom).to.have.property('AssessmentId');
                expect(response.body.Data.Symptom).to.have.property('SymptomTypeId');
                expect(response.body.Data.Symptom).to.have.property('IsPresent');
                expect(response.body.Data.Symptom).to.have.property('Severity');
                expect(response.body.Data.Symptom).to.have.property('Interpretation');
                expect(response.body.Data.Symptom).to.have.property('Comments');

                expect(response.body.Data.Symptom.PatientUserId).to.equal(getTestData("SymptomUpdateModel").PatientUserId);
                expect(response.body.Data.Symptom.AssessmentId).to.equal(getTestData("SymptomUpdateModel").AssessmentId);
                expect(response.body.Data.Symptom.SymptomTypeId).to.equal(getTestData("SymptomUpdateModel").SymptomTypeId);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomUpdateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomUpdateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomUpdateModel").Comments);
            })
            .expect(200, done);
    });

    it('56:05 -> Delete symptom', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptoms/${getTestData('SymptomId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create symptom again', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Symptom.id, 'SymptomId');
                expect(response.body.Data.Symptom).to.have.property('id');
                expect(response.body.Data.Symptom).to.have.property('PatientUserId');
                expect(response.body.Data.Symptom).to.have.property('AssessmentId');
                expect(response.body.Data.Symptom).to.have.property('SymptomTypeId');
                expect(response.body.Data.Symptom).to.have.property('IsPresent');
                expect(response.body.Data.Symptom).to.have.property('Severity');
                expect(response.body.Data.Symptom).to.have.property('Interpretation');
                expect(response.body.Data.Symptom).to.have.property('Comments');

                setTestData(response.body.Data.Symptom.id, 'SymptomId');

                expect(response.body.Data.Symptom.PatientUserId).to.equal(getTestData("SymptomCreateModel").PatientUserId);
                expect(response.body.Data.Symptom.AssessmentId).to.equal(getTestData("SymptomCreateModel").AssessmentId);
                expect(response.body.Data.Symptom.SymptomTypeId).to.equal(getTestData("SymptomCreateModel").SymptomTypeId);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomCreateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomCreateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomCreateModel").Comments);

            })
            .expect(201, done);
    });

    it('56:06 -> Negative - Create symptom', function(done) {
        loadNegativeSymptomCreateModel();
        const createModel = getTestData("NegativeSymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('56:07 -> Negative - Search symptom records', function(done) {
        loadSymptomQueryString();
        agent
            .get(`/api/v1/clinical/symptoms/search${loadSymptomQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('56:08 -> Negative - Delete symptom', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptoms/${getTestData('SymptomId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadSymptomCreateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        AssessmentId   : getTestData("AssessmentId"),
        SymptomTypeId  : getTestData("SymptomTypeId"),
        IsPresent      : faker.datatype.boolean(),
        Severity       : 'Low',
        Interpretation : 'Normal',
        Comments       : faker.lorem.words(10)
  
    };
    setTestData(model, "SymptomCreateModel");
};

export const loadSymptomUpdateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        AssessmentId   : getTestData("AssessmentId"),
        SymptomTypeId  : getTestData("SymptomTypeId"),
        IsPresent      : faker.datatype.boolean(),
        Severity       : 'Low',
        Interpretation : 'Normal',
        Comments       : faker.lorem.words(10)
    };
    setTestData(model, "SymptomUpdateModel");
};

function loadSymptomQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeSymptomCreateModel = async (
) => {
    const model = {
        IsPresent      : faker.datatype.boolean(),
        Severity       : getRandomEnumValue(Severity),
        Status         : getRandomEnumValue(ClinicalValidationStatus),
        Interpretation : getRandomEnumValue(ClinicalInterpretation),
        Comments       : faker.lorem.words(10)
      
    };
    setTestData(model, "NegativeSymptomCreateModel");
};

