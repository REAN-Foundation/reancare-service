import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Symptom tests', function() {

    var agent = request.agent(infra._app);

    it('302 - Create symptom', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptoms/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Symptom.IsPresent).to.equal(getTestData("SymptomCreateModel").IsPresent);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomCreateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomCreateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomCreateModel").Comments);

            })
            .expect(201, done);
    });

    it('303 - Get symptom by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptoms/${getTestData('SymptomId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Symptom.IsPresent).to.equal(getTestData("SymptomCreateModel").IsPresent);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomCreateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomCreateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomCreateModel").Comments);

            })
            .expect(200, done);
    });

    it('304 - Search symptom records', function(done) {
        loadSymptomQueryString();
        agent
            .get(`/api/v1/clinical/symptoms/search${loadSymptomQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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

    it('305 - Update symptom', function(done) {
        loadSymptomUpdateModel();
        const updateModel = getTestData("SymptomUpdateModel");
        agent
            .put(`/api/v1/clinical/symptoms/${getTestData('SymptomId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Symptom.IsPresent).to.equal(getTestData("SymptomUpdateModel").IsPresent);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomUpdateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomUpdateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomUpdateModel").Comments);
            })
            .expect(200, done);
    });

    it('306 - Delete symptom', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptoms/${getTestData('SymptomId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
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
                expect(response.body.Data.Symptom.IsPresent).to.equal(getTestData("SymptomCreateModel").IsPresent);
                expect(response.body.Data.Symptom.Severity).to.equal(getTestData("SymptomCreateModel").Severity);
                expect(response.body.Data.Symptom.Interpretation).to.equal(getTestData("SymptomCreateModel").Interpretation);
                expect(response.body.Data.Symptom.Comments).to.equal(getTestData("SymptomCreateModel").Comments);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadSymptomCreateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        AssessmentId   : getTestData("AssessmentId"),
        SymptomTypeId  : getTestData("SymptomTypeId"),
        IsPresent      : true,
        Severity       : '1',
        Status         : '1',
        Interpretation : '1',
        Comments       : "The chronic hypertension for the patient with critically high levels."
  
    };
    setTestData(model, "SymptomCreateModel");
};

export const loadSymptomUpdateModel = async (
) => {
    const model = {
        PatientUserId  : getTestData("PatientUserId"),
        AssessmentId   : getTestData("AssessmentId"),
        SymptomTypeId  : getTestData("SymptomTypeId"),
        IsPresent      : true,
        Severity       : '2',
        Status         : '2',
        Interpretation : '2',
        Comments       : "The chronic hypertension for the patient with critically high levels."
    };
    setTestData(model, "SymptomUpdateModel");
};

function loadSymptomQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?fromDate=2021-05-30';
    return queryString;
}
