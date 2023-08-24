import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Drug tests', function() {

    var agent = request.agent(infra._app);

    it('129 - Negative - Create drug', function(done) {
        loadDrugCreateModel();
        const createModel = getTestData("DrugCreateModel");
        agent
            .post(`/api/v1/clinical/drugs/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC3PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('130 - Negative - Get drug by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/drugs/${getTestData('Drug')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('131 - Negative - Update drug', function(done) {
        loadDrugUpdateModel();
        const updateModel = getTestData("DrugUpdateModel");
        agent
            .put(`/api/v1/clinical/drugs/${getTestData('DrugId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadDrugCreateModel = async (
) => {
    const model = {
        GenericName          : "Paracetamol",
        Ingredients          : "levocetrizine",
        Strength             : "high",
        OtherCommercialNames : "LP",
        Manufacturer         : "abc lab",
        OtherInformation     : "aaaa"
    };
    setTestData(model, "DrugCreateModel");
};

export const loadDrugUpdateModel = async (
) => {
    const model = {
        DrugName             : "sinarest",
        GenericName          : "crocin",
        Ingredients          : "parac",
        Strength             : "high",
        OtherCommercialNames : "LP",
        Manufacturer         : "abc lab",
        OtherInformation     : "llll"
    };
    setTestData(model, "DrugUpdateModel");
};
