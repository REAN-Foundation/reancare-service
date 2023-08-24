import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Symptom type tests', function() {

    var agent = request.agent(infra._app);

    it('156 - Negative - Create symptom type', function(done) {
        loadSymptomCreateModel();
        const createModel = getTestData("SymptomCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-types/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("DoctorrJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('157 - Negative - Get symptom type by id', function(done) {

        agent
            .get(`/api/v1/clinical/symptom-types/${getTestData('SymptomType')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('158 - Negative - Update symptom type', function(done) {
        loadSymptomUpdateModel();
        const updateModel = getTestData("SymptomUpdateModel");
        agent
            .put(`/api/v1/clinical/symptom-types/${getTestData('SymptomTypeId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadSymptomCreateModel = async (
) => {
    const model = {
  
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
