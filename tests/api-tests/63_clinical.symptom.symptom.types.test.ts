import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Symptom type tests', function() {

    var agent = request.agent(infra._app);

    it('284 - Create symptom type', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.SymptomType.id, 'SymptomTypeId');
                expect(response.body.Data.SymptomType).to.have.property('id');
                expect(response.body.Data.SymptomType).to.have.property('Symptom');
                expect(response.body.Data.SymptomType).to.have.property('Description');
                expect(response.body.Data.SymptomType).to.have.property('Language');
                expect(response.body.Data.SymptomType).to.have.property('ImageResourceId');

                setTestData(response.body.Data.SymptomType.id, 'SymptomTypeId');

                expect(response.body.Data.SymptomType.Symptom).to.equal(getTestData("SymptomCreateModel").Symptom);
                expect(response.body.Data.SymptomType.Description).to.equal(getTestData("SymptomCreateModel").Description);
                expect(response.body.Data.SymptomType.Language).to.equal(getTestData("SymptomCreateModel").Language);
                expect(response.body.Data.SymptomType.ImageResourceId).to.equal(getTestData("SymptomCreateModel").ImageResourceId);

            })
            .expect(201, done);
    });

    it('285 - Get symptom type by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptom-types/${getTestData('SymptomTypeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.SymptomType).to.have.property('id');
                expect(response.body.Data.SymptomType).to.have.property('Symptom');
                expect(response.body.Data.SymptomType).to.have.property('Description');
                expect(response.body.Data.SymptomType).to.have.property('Language');
                expect(response.body.Data.SymptomType).to.have.property('ImageResourceId');

                expect(response.body.Data.SymptomType.Symptom).to.equal(getTestData("SymptomCreateModel").Symptom);
                expect(response.body.Data.SymptomType.Description).to.equal(getTestData("SymptomCreateModel").Description);
                expect(response.body.Data.SymptomType.Language).to.equal(getTestData("SymptomCreateModel").Language);
                expect(response.body.Data.SymptomType.ImageResourceId).to.equal(getTestData("SymptomCreateModel").ImageResourceId);

            })
            .expect(200, done);
    });

    it('286 - Search symptom type records', function(done) {
        loadSymptomQueryString();
        agent
            .get(`/api/v1/clinical/symptom-types/search${loadSymptomQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body.Data.SymptomTypes).to.have.property('TotalCount');
                expect(response.body.Data.SymptomTypes).to.have.property('RetrievedCount');
                expect(response.body.Data.SymptomTypes).to.have.property('PageIndex');
                expect(response.body.Data.SymptomTypes).to.have.property('ItemsPerPage');
                expect(response.body.Data.SymptomTypes).to.have.property('Order');
                expect(response.body.Data.SymptomTypes.TotalCount).to.greaterThan(0);
                expect(response.body.Data.SymptomTypes.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.SymptomTypes.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('287 - Update symptom type', function(done) {
        loadSymptomUpdateModel();
        const updateModel = getTestData("SymptomUpdateModel");
        agent
            .put(`/api/v1/clinical/symptom-types/${getTestData('SymptomTypeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.SymptomType).to.have.property('id');
                expect(response.body.Data.SymptomType).to.have.property('Symptom');
                expect(response.body.Data.SymptomType).to.have.property('Description');
                expect(response.body.Data.SymptomType).to.have.property('Language');
                expect(response.body.Data.SymptomType).to.have.property('ImageResourceId');

                expect(response.body.Data.SymptomType.Symptom).to.equal(getTestData("SymptomUpdateModel").Symptom);
                expect(response.body.Data.SymptomType.Description).to.equal(getTestData("SymptomUpdateModel").Description);

            })
            .expect(200, done);
    });

    it('288 - Delete symptom type', function(done) {
        
        agent
            .delete(`/api/v1/clinical/symptom-types/${getTestData('SymptomTypeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create symptom type again', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.SymptomType.id, 'SymptomTypeId');
                expect(response.body.Data.SymptomType).to.have.property('id');
                expect(response.body.Data.SymptomType).to.have.property('Symptom');
                expect(response.body.Data.SymptomType).to.have.property('Description');
                expect(response.body.Data.SymptomType).to.have.property('Language');
                expect(response.body.Data.SymptomType).to.have.property('ImageResourceId');

                setTestData(response.body.Data.SymptomType.id, 'SymptomTypeId');

                expect(response.body.Data.SymptomType.Symptom).to.equal(getTestData("SymptomCreateModel").Symptom);
                expect(response.body.Data.SymptomType.Description).to.equal(getTestData("SymptomCreateModel").Description);
                expect(response.body.Data.SymptomType.Language).to.equal(getTestData("SymptomCreateModel").Language);
                expect(response.body.Data.SymptomType.ImageResourceId).to.equal(getTestData("SymptomCreateModel").ImageResourceId);

            })
            .expect(201, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadSymptomCreateModel = async (
) => {
    const model = {
        Symptom     : "Headache",
        Description : "Severe to moderate headache",
        Tags        : [
            "Stroke",
            "Migrain"
        ],
        Language        : "en-US",
        ImageResourceId : "92313a9e-0eb0-46fa-ac24-c137f28c33d4"
  
    };
    setTestData(model, "SymptomCreateModel");
};

export const loadSymptomUpdateModel = async (
) => {
    const model = {
        Symptom     : "Heart ailure",
        Description : "Migrains or severe headache occasinally with mild dizziness",
        Tags        : [
            "Blurry vision",
            "Diabetes",
            "Cataract"
        ],

    };
    setTestData(model, "SymptomUpdateModel");
};

function loadSymptomQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?tag=Stroke';
    return queryString;
}
