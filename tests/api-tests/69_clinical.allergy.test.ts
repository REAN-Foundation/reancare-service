import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Allergy tests', function() {

    var agent = request.agent(infra._app);

    it('317 - Get allergen categories', function(done) {

        agent
            .get(`/api/v1/clinical/allergies/allergen-categories`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
                  
            })
            .expect(200, done);
    });

    it('318 - Get allergen exposure routes', function(done) {

        agent
            .get(`/api/v1/clinical/allergies/allergen-exposure-routes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
                
            })
            .expect(200, done);
    });

    it('319 - Create patient allergy', function(done) {
        loadAllergyCreateModel();
        const createModel = getTestData("AllergyCreateModel");
        agent
            .post(`/api/v1/clinical/allergies/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Allergy.id, 'AllergyId');
                expect(response.body.Data.Allergy).to.have.property('id');
                expect(response.body.Data.Allergy).to.have.property('PatientUserId');
                expect(response.body.Data.Allergy).to.have.property('Allergy');
                expect(response.body.Data.Allergy).to.have.property('AllergenCategory');
                expect(response.body.Data.Allergy).to.have.property('AllergenExposureRoute');
                expect(response.body.Data.Allergy).to.have.property('Severity');
                expect(response.body.Data.Allergy).to.have.property('Reaction');
                expect(response.body.Data.Allergy).to.have.property('OtherInformation');
                expect(response.body.Data.Allergy).to.have.property('LastOccurrence');

                setTestData(response.body.Data.Allergy.id, 'AllergyId');

                expect(response.body.Data.Allergy.PatientUserId).to.equal(getTestData("AllergyCreateModel").PatientUserId);
                expect(response.body.Data.Allergy.Allergy).to.equal(getTestData("AllergyCreateModel").Allergy);
                expect(response.body.Data.Allergy.AllergenCategory).to.equal(getTestData("AllergyCreateModel").AllergenCategory);
                expect(response.body.Data.Allergy.AllergenExposureRoute).to.equal(getTestData("AllergyCreateModel").AllergenExposureRoute);
                expect(response.body.Data.Allergy.Severity).to.equal(getTestData("AllergyCreateModel").Severity);
                expect(response.body.Data.Allergy.Reaction).to.equal(getTestData("AllergyCreateModel").Reaction);
                expect(response.body.Data.Allergy.OtherInformation).to.equal(getTestData("AllergyCreateModel").OtherInformation);
                expect(response.body.Data.Allergy.LastOccurrence).to.equal(getTestData("AllergyCreateModel").LastOccurrence);

            })
            .expect(201, done);
    });

    it('320 - Get patient allergy by id', function(done) {

        agent
            .get(`/api/v1/clinical/allergies/${getTestData('AllergyId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Allergy).to.have.property('id');
                expect(response.body.Data.Allergy).to.have.property('PatientUserId');
                expect(response.body.Data.Allergy).to.have.property('Allergy');
                expect(response.body.Data.Allergy).to.have.property('AllergenCategory');
                expect(response.body.Data.Allergy).to.have.property('AllergenExposureRoute');
                expect(response.body.Data.Allergy).to.have.property('Severity');
                expect(response.body.Data.Allergy).to.have.property('Reaction');
                expect(response.body.Data.Allergy).to.have.property('OtherInformation');
                expect(response.body.Data.Allergy).to.have.property('LastOccurrence');

                expect(response.body.Data.Allergy.PatientUserId).to.equal(getTestData("AllergyCreateModel").PatientUserId);
                expect(response.body.Data.Allergy.Allergy).to.equal(getTestData("AllergyCreateModel").Allergy);
                expect(response.body.Data.Allergy.AllergenCategory).to.equal(getTestData("AllergyCreateModel").AllergenCategory);
                expect(response.body.Data.Allergy.AllergenExposureRoute).to.equal(getTestData("AllergyCreateModel").AllergenExposureRoute);
                expect(response.body.Data.Allergy.Severity).to.equal(getTestData("AllergyCreateModel").Severity);
                expect(response.body.Data.Allergy.Reaction).to.equal(getTestData("AllergyCreateModel").Reaction);
                expect(response.body.Data.Allergy.OtherInformation).to.equal(getTestData("AllergyCreateModel").OtherInformation);
                expect(response.body.Data.Allergy.LastOccurrence).to.equal(getTestData("AllergyCreateModel").LastOccurrence);

            })
            .expect(200, done);
    });

    it('321 - Get patient allergies', function(done) {

        agent
            .get(`/api/v1/clinical/allergies/for-patient/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(200, done);
    });

    it('322 - Search patient allergy records', function(done) {
        loadAllergyQueryString();
        agent
            .get(`/api/v1/clinical/allergies/search${loadAllergyQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Allergies).to.have.property('TotalCount');
                expect(response.body.Data.Allergies).to.have.property('RetrievedCount');
                expect(response.body.Data.Allergies).to.have.property('PageIndex');
                expect(response.body.Data.Allergies).to.have.property('ItemsPerPage');
                expect(response.body.Data.Allergies).to.have.property('Order');
                expect(response.body.Data.Allergies.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Allergies.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Allergies.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('323 - Update patient allergy', function(done) {
        loadAllergyUpdateModel();
        const updateModel = getTestData("AllergyUpdateModel");
        agent
            .put(`/api/v1/clinical/allergies/${getTestData('AllergyId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Allergy).to.have.property('id');
                expect(response.body.Data.Allergy).to.have.property('PatientUserId');
                expect(response.body.Data.Allergy).to.have.property('Allergy');
                expect(response.body.Data.Allergy).to.have.property('AllergenCategory');
                expect(response.body.Data.Allergy).to.have.property('AllergenExposureRoute');
                expect(response.body.Data.Allergy).to.have.property('Severity');
                expect(response.body.Data.Allergy).to.have.property('Reaction');
                expect(response.body.Data.Allergy).to.have.property('OtherInformation');
                expect(response.body.Data.Allergy).to.have.property('LastOccurrence');

                expect(response.body.Data.Allergy.PatientUserId).to.equal(getTestData("AllergyUpdateModel").PatientUserId);
                expect(response.body.Data.Allergy.Allergy).to.equal(getTestData("AllergyUpdateModel").Allergy);
                expect(response.body.Data.Allergy.AllergenCategory).to.equal(getTestData("AllergyUpdateModel").AllergenCategory);
                expect(response.body.Data.Allergy.AllergenExposureRoute).to.equal(getTestData("AllergyUpdateModel").AllergenExposureRoute);
                expect(response.body.Data.Allergy.Severity).to.equal(getTestData("AllergyUpdateModel").Severity);
                expect(response.body.Data.Allergy.Reaction).to.equal(getTestData("AllergyUpdateModel").Reaction);
                expect(response.body.Data.Allergy.OtherInformation).to.equal(getTestData("AllergyUpdateModel").OtherInformation);
                expect(response.body.Data.Allergy.LastOccurrence).to.equal(getTestData("AllergyUpdateModel").LastOccurrence);
            })
            .expect(200, done);
    });

    it('324 - Delete patient allergy', function(done) {
        
        agent
            .delete(`/api/v1/clinical/allergies/${getTestData('AllergyId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create patient allergy again', function(done) {
        loadAllergyCreateModel();
        const createModel = getTestData("AllergyCreateModel");
        agent
            .post(`/api/v1/clinical/allergies/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Allergy.id, 'AllergyId');
                expect(response.body.Data.Allergy).to.have.property('id');
                expect(response.body.Data.Allergy).to.have.property('PatientUserId');
                expect(response.body.Data.Allergy).to.have.property('Allergy');
                expect(response.body.Data.Allergy).to.have.property('AllergenCategory');
                expect(response.body.Data.Allergy).to.have.property('AllergenExposureRoute');
                expect(response.body.Data.Allergy).to.have.property('Severity');
                expect(response.body.Data.Allergy).to.have.property('Reaction');
                expect(response.body.Data.Allergy).to.have.property('OtherInformation');
                expect(response.body.Data.Allergy).to.have.property('LastOccurrence');

                setTestData(response.body.Data.Allergy.id, 'AllergyId');

                expect(response.body.Data.Allergy.PatientUserId).to.equal(getTestData("AllergyCreateModel").PatientUserId);
                expect(response.body.Data.Allergy.Allergy).to.equal(getTestData("AllergyCreateModel").Allergy);
                expect(response.body.Data.Allergy.AllergenCategory).to.equal(getTestData("AllergyCreateModel").AllergenCategory);
                expect(response.body.Data.Allergy.AllergenExposureRoute).to.equal(getTestData("AllergyCreateModel").AllergenExposureRoute);
                expect(response.body.Data.Allergy.Severity).to.equal(getTestData("AllergyCreateModel").Severity);
                expect(response.body.Data.Allergy.Reaction).to.equal(getTestData("AllergyCreateModel").Reaction);
                expect(response.body.Data.Allergy.OtherInformation).to.equal(getTestData("AllergyCreateModel").OtherInformation);
                expect(response.body.Data.Allergy.LastOccurrence).to.equal(getTestData("AllergyCreateModel").LastOccurrence);

            })
            .expect(201, done);
    });

});

// ///////////////////////////////////////////////////////////////////////////

export const loadAllergyCreateModel = async (
) => {
    const model = {
        PatientUserId         : getTestData("PatientUserId"),
        Allergy               : "Dust",
        AllergenCategory      : "Environmental",
        AllergenExposureRoute : "Contact",
        Severity              : "Medium",
        Reaction              : "Cough",
        OtherInformation      : "Due to dust",
        LastOccurrence        : "2023-06-23T00:00:00.000Z"
  
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

function loadAllergyQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?allergy=Dust';
    return queryString;
}
