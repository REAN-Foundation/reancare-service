import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Drug tests', function() {

    var agent = request.agent(infra._app);

    it('232 - Create drug', function(done) {
        loadDrugCreateModel();
        const createModel = getTestData("DrugCreateModel");
        agent
            .post(`/api/v1/clinical/drugs/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Drug.id, 'DrugId');
                expect(response.body.Data.Drug).to.have.property('id');
                expect(response.body.Data.Drug).to.have.property('DrugName');
                expect(response.body.Data.Drug).to.have.property('GenericName');
                expect(response.body.Data.Drug).to.have.property('Ingredients');
                expect(response.body.Data.Drug).to.have.property('Strength');
                expect(response.body.Data.Drug).to.have.property('OtherCommercialNames');
                expect(response.body.Data.Drug).to.have.property('Manufacturer');
                expect(response.body.Data.Drug).to.have.property('OtherInformation');

                setTestData(response.body.Data.Drug.id, 'DrugId');

                expect(response.body.Data.Drug.DrugName).to.equal(getTestData("DrugCreateModel").DrugName);
                expect(response.body.Data.Drug.GenericName).to.equal(getTestData("DrugCreateModel").GenericName);
                expect(response.body.Data.Drug.Ingredients).to.equal(getTestData("DrugCreateModel").Ingredients);
                expect(response.body.Data.Drug.Strength).to.equal(getTestData("DrugCreateModel").Strength);
                expect(response.body.Data.Drug.OtherCommercialNames).to.equal(getTestData("DrugCreateModel").OtherCommercialNames);
                expect(response.body.Data.Drug.Manufacturer).to.equal(getTestData("DrugCreateModel").Manufacturer);
                expect(response.body.Data.Drug.OtherInformation).to.equal(getTestData("DrugCreateModel").OtherInformation);

            })
            .expect(201, done);
    });

    it('233 - Get drug by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/drugs/${getTestData('DrugId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Drug).to.have.property('id');
                expect(response.body.Data.Drug).to.have.property('DrugName');
                expect(response.body.Data.Drug).to.have.property('GenericName');
                expect(response.body.Data.Drug).to.have.property('Ingredients');
                expect(response.body.Data.Drug).to.have.property('Strength');
                expect(response.body.Data.Drug).to.have.property('OtherCommercialNames');
                expect(response.body.Data.Drug).to.have.property('Manufacturer');
                expect(response.body.Data.Drug).to.have.property('OtherInformation');

                expect(response.body.Data.Drug.DrugName).to.equal(getTestData("DrugCreateModel").DrugName);
                expect(response.body.Data.Drug.GenericName).to.equal(getTestData("DrugCreateModel").GenericName);
                expect(response.body.Data.Drug.Ingredients).to.equal(getTestData("DrugCreateModel").Ingredients);
                expect(response.body.Data.Drug.Strength).to.equal(getTestData("DrugCreateModel").Strength);
                expect(response.body.Data.Drug.OtherCommercialNames).to.equal(getTestData("DrugCreateModel").OtherCommercialNames);
                expect(response.body.Data.Drug.Manufacturer).to.equal(getTestData("DrugCreateModel").Manufacturer);
                expect(response.body.Data.Drug.OtherInformation).to.equal(getTestData("DrugCreateModel").OtherInformation);

            })
            .expect(200, done);
    });

    it('234 - Search drug records', function(done) {
        loadDrugQueryString();
        agent
            .get(`/api/v1/clinical/drugs/search${loadDrugQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Drugs).to.have.property('TotalCount');
                expect(response.body.Data.Drugs).to.have.property('RetrievedCount');
                expect(response.body.Data.Drugs).to.have.property('PageIndex');
                expect(response.body.Data.Drugs).to.have.property('ItemsPerPage');
                expect(response.body.Data.Drugs).to.have.property('Order');
                expect(response.body.Data.Drugs.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Drugs.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Drugs.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('235 - Update drug', function(done) {
        loadDrugUpdateModel();
        const updateModel = getTestData("DrugUpdateModel");
        agent
            .put(`/api/v1/clinical/drugs/${getTestData('DrugId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Drug).to.have.property('id');
                expect(response.body.Data.Drug).to.have.property('DrugName');
                expect(response.body.Data.Drug).to.have.property('GenericName');
                expect(response.body.Data.Drug).to.have.property('Ingredients');
                expect(response.body.Data.Drug).to.have.property('Strength');
                expect(response.body.Data.Drug).to.have.property('OtherCommercialNames');
                expect(response.body.Data.Drug).to.have.property('Manufacturer');
                expect(response.body.Data.Drug).to.have.property('OtherInformation');

                expect(response.body.Data.Drug.DrugName).to.equal(getTestData("DrugUpdateModel").DrugName);
                expect(response.body.Data.Drug.GenericName).to.equal(getTestData("DrugUpdateModel").GenericName);
                expect(response.body.Data.Drug.Ingredients).to.equal(getTestData("DrugUpdateModel").Ingredients);
                expect(response.body.Data.Drug.Strength).to.equal(getTestData("DrugUpdateModel").Strength);
                expect(response.body.Data.Drug.OtherCommercialNames).to.equal(getTestData("DrugUpdateModel").OtherCommercialNames);
                expect(response.body.Data.Drug.Manufacturer).to.equal(getTestData("DrugUpdateModel").Manufacturer);
                expect(response.body.Data.Drug.OtherInformation).to.equal(getTestData("DrugUpdateModel").OtherInformation);

            })
            .expect(200, done);
    });

    it('236 - Delete drug', function(done) {
    
        agent
            .delete(`/api/v1/clinical/drugs/${getTestData('DrugId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create drug again', function(done) {
        loadDrugCreateModel();
        const createModel = getTestData("DrugCreateModel");
        agent
            .post(`/api/v1/clinical/drugs/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Drug.id, 'DrugId');
                expect(response.body.Data.Drug).to.have.property('id');
                expect(response.body.Data.Drug).to.have.property('DrugName');
                expect(response.body.Data.Drug).to.have.property('GenericName');
                expect(response.body.Data.Drug).to.have.property('Ingredients');
                expect(response.body.Data.Drug).to.have.property('Strength');
                expect(response.body.Data.Drug).to.have.property('OtherCommercialNames');
                expect(response.body.Data.Drug).to.have.property('Manufacturer');
                expect(response.body.Data.Drug).to.have.property('OtherInformation');

                setTestData(response.body.Data.Drug.id, 'DrugId');

                expect(response.body.Data.Drug.DrugName).to.equal(getTestData("DrugCreateModel").DrugName);
                expect(response.body.Data.Drug.GenericName).to.equal(getTestData("DrugCreateModel").GenericName);
                expect(response.body.Data.Drug.Ingredients).to.equal(getTestData("DrugCreateModel").Ingredients);
                expect(response.body.Data.Drug.Strength).to.equal(getTestData("DrugCreateModel").Strength);
                expect(response.body.Data.Drug.OtherCommercialNames).to.equal(getTestData("DrugCreateModel").OtherCommercialNames);
                expect(response.body.Data.Drug.Manufacturer).to.equal(getTestData("DrugCreateModel").Manufacturer);
                expect(response.body.Data.Drug.OtherInformation).to.equal(getTestData("DrugCreateModel").OtherInformation);

            })
            .expect(201, done);
    });
  
});

///////////////////////////////////////////////////////////////////////////

export const loadDrugCreateModel = async (
) => {
    const model = {
        DrugName             : "aciloc",
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

function loadDrugQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?name=aciloc';
    return queryString;
}
