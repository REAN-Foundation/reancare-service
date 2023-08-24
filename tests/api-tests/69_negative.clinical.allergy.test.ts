import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Allergy tests', function() {

    var agent = request.agent(infra._app);

    it('176 - Negative - Get allergen categories', function(done) {

        agent
            .get(`/api/v1/clinical/allergies/allergen-categories`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93Y0')
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                  
            })
            .expect(403, done);
    });

    it('177 - Negative - Create patient allergy', function(done) {
        loadAllergyCreateModel();
        const createModel = getTestData("AllergyCreateModel");
        agent
            .post(`/api/v1/clinical/allergies/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('178 - Negative - Get patient allergy by id', function(done) {

        agent
            .get(`/api/v1/clinical/allergies/${getTestData('Allergy')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(404, done);
    });

    it('179 - Negative - Update patient allergy', function(done) {
        loadAllergyUpdateModel();
        const updateModel = getTestData("AllergyUpdateModel");
        agent
            .put(`/api/v1/clinical/allergies/${getTestData('AllergyId')}`)
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

    it('180 - Negative - Delete patient allergy', function(done) {
        
        agent
            .delete(`/api/v1/clinical/allergies/${getTestData('AllergyId')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

// ///////////////////////////////////////////////////////////////////////////

export const loadAllergyCreateModel = async (
) => {
    const model = {
  
    };
    setTestData(model, "AllergyCreateModel");
};

export const loadAllergyUpdateModel = async (
) => {
    const model = {
        PatientUserId         : getTestData("PatientUserId"),
        Allergy               : "Nut allergy",
        AllergenCategory      : "Food",
        AllergenExposureRoute : "Airway",
        Severity              : "Critical",
        Reaction              : "Cough",
        OtherInformation      : "Due to dust",
        LastOccurrence        : "2023-05-23T00:00:00.000Z"
    };
    setTestData(model, "AllergyUpdateModel");
};

