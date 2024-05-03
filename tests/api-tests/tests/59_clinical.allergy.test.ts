import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { AllergenCategories, AllergenExposureRoutes } from '../../../src/domain.types/clinical/allergy/allergy.types';
import { Severity } from '../../../src/domain.types/miscellaneous/system.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('59 - Allergy tests', function () {
    var agent = request.agent(infra._app);

    it('59:01 -> Get allergen categories', function (done) {
        agent
            .get(`/api/v1/clinical/allergies/allergen-categories`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('59:02 -> Get allergen exposure routes', function (done) {
        agent
            .get(`/api/v1/clinical/allergies/allergen-exposure-routes`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('59:03 -> Create patient allergy', function (done) {
        loadAllergyCreateModel();
        const createModel = getTestData('allergyCreateModel');
        agent
            .post(`/api/v1/clinical/allergies/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setAllergyId(response, 'allergyId_1');
                expectAllergyProperties(response);

                expectAllergyPropertyValues(response);
            })
            .expect(201, done);
    });

    it('59:04 -> Get patient allergy by id', function (done) {
        agent
            .get(`/api/v1/clinical/allergies/${getTestData('allergyId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectAllergyProperties(response);

                expectAllergyPropertyValues(response);
            })
            .expect(200, done);
    });

    it('59:05 -> Get patient allergies', function (done) {
        agent
            .get(`/api/v1/clinical/allergies/for-patient/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('59:06 -> Search patient allergy records', function (done) {
        loadAllergyQueryString();
        agent
            .get(`/api/v1/clinical/allergies/search${loadAllergyQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('59:07 -> Update patient allergy', function (done) {
        loadAllergyUpdateModel();
        const updateModel = getTestData('allergyUpdateModel');
        agent
            .put(`/api/v1/clinical/allergies/${getTestData('allergyId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectAllergyProperties(response);

                expect(response.body.Data.Allergy.PatientUserId).to.equal(getTestData('allergyUpdateModel').PatientUserId);
                expect(response.body.Data.Allergy.Allergy).to.equal(getTestData('allergyUpdateModel').Allergy);
                expect(response.body.Data.Allergy.AllergenCategory).to.equal(
                    getTestData('allergyUpdateModel').AllergenCategory
                );
                expect(response.body.Data.Allergy.AllergenExposureRoute).to.equal(
                    getTestData('allergyUpdateModel').AllergenExposureRoute
                );
                expect(response.body.Data.Allergy.Severity).to.equal(getTestData('allergyUpdateModel').Severity);
                expect(response.body.Data.Allergy.Reaction).to.equal(getTestData('allergyUpdateModel').Reaction);
                expect(response.body.Data.Allergy.OtherInformation).to.equal(
                    getTestData('allergyUpdateModel').OtherInformation
                );
            })
            .expect(200, done);
    });

    it('59:08 -> Delete patient allergy', function (done) {
        agent
            .delete(`/api/v1/clinical/allergies/${getTestData('allergyId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create patient allergy again', function (done) {
        loadAllergyCreateModel();
        const createModel = getTestData('allergyCreateModel');
        agent
            .post(`/api/v1/clinical/allergies/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setAllergyId(response, 'allergyId');
                expectAllergyProperties(response);

                expectAllergyPropertyValues(response);
            })
            .expect(201, done);
    });

    it('59:09 -> Negative - Get allergen categories', function (done) {
        agent
            .get(`/api/v1/clinical/allergies/allergen-categories`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('59:10 -> Negative - Create patient allergy', function (done) {
        loadNegativeAllergyCreateModel();
        const createModel = getTestData('negativeAllergyCreateModel');
        agent
            .post(`/api/v1/clinical/allergies/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('59:11 -> Negative - Get patient allergy by id', function (done) {
        agent
            .get(`/api/v1/clinical/allergies/${getTestData('allergyId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('59:12 -> Negative - Update patient allergy', function (done) {
        loadAllergyUpdateModel();
        const updateModel = getTestData('allergyUpdateModel');
        agent
            .put(`/api/v1/clinical/allergies/${getTestData('allergyId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('59:13 -> Negative - Delete patient allergy', function (done) {
        agent
            .delete(`/api/v1/clinical/allergies/${getTestData('allergyId')}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

// ///////////////////////////////////////////////////////////////////////////

function setAllergyId(response, key) {
    setTestData(response.body.Data.Allergy.id, key);
}

function expectAllergyProperties(response) {
    expect(response.body.Data.Allergy).to.have.property('id');
    expect(response.body.Data.Allergy).to.have.property('PatientUserId');
    expect(response.body.Data.Allergy).to.have.property('Allergy');
    expect(response.body.Data.Allergy).to.have.property('AllergenCategory');
    expect(response.body.Data.Allergy).to.have.property('AllergenExposureRoute');
    expect(response.body.Data.Allergy).to.have.property('Severity');
    expect(response.body.Data.Allergy).to.have.property('Reaction');
    expect(response.body.Data.Allergy).to.have.property('OtherInformation');
    expect(response.body.Data.Allergy).to.have.property('LastOccurrence');
}

function expectAllergyPropertyValues(response) {
    expect(response.body.Data.Allergy.PatientUserId).to.equal(getTestData('allergyCreateModel').PatientUserId);
    expect(response.body.Data.Allergy.Allergy).to.equal(getTestData('allergyCreateModel').Allergy);
    expect(response.body.Data.Allergy.AllergenCategory).to.equal(getTestData('allergyCreateModel').AllergenCategory);
    expect(response.body.Data.Allergy.AllergenExposureRoute).to.equal(
        getTestData('allergyCreateModel').AllergenExposureRoute
    );
    expect(response.body.Data.Allergy.Severity).to.equal(getTestData('allergyCreateModel').Severity);
    expect(response.body.Data.Allergy.Reaction).to.equal(getTestData('allergyCreateModel').Reaction);
    expect(response.body.Data.Allergy.OtherInformation).to.equal(getTestData('allergyCreateModel').OtherInformation);
}

export const loadAllergyCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Allergy: faker.lorem.words(),
        AllergenCategory: getRandomEnumValue(AllergenCategories),
        AllergenExposureRoute: getRandomEnumValue(AllergenExposureRoutes),
        Severity: getRandomEnumValue(Severity),
        Reaction: faker.lorem.words(),
        OtherInformation: faker.lorem.words(10),
        LastOccurrence: faker.date.past(),
    };
    setTestData(model, 'allergyCreateModel');
};

export const loadAllergyUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Allergy: faker.lorem.words(),
        AllergenCategory: getRandomEnumValue(AllergenCategories),
        AllergenExposureRoute: getRandomEnumValue(AllergenExposureRoutes),
        Severity: getRandomEnumValue(Severity),
        Reaction: faker.lorem.words(),
        OtherInformation: faker.lorem.words(10),
        LastOccurrence: faker.date.past(),
    };
    setTestData(model, 'allergyUpdateModel');
};

function loadAllergyQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeAllergyCreateModel = async () => {
    const model = {};
    setTestData(model, 'negativeAllergyCreateModel');
};
