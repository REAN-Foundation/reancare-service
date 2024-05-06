import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('47 - Drug tests', function () {
    var agent = request.agent(infra._app);

    it('47:01 -> Create drug', function (done) {
        loadDrugCreateModel();
        const createModel = getTestData('drugCreateModel');
        agent
            .post(`/api/v1/clinical/drugs/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setDrugId(response, 'drugId_1');
                expectDrugProperties(response);

                expectDrugPropertyValues(response);
            })
            .expect(201, done);
    });

    it('47:02 -> Get drug by id', function (done) {
        agent
            .get(`/api/v1/clinical/drugs/${getTestData('drugId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectDrugProperties(response);

                expectDrugPropertyValues(response);
            })
            .expect(200, done);
    });

    it('47:03 -> Search drug records', function (done) {
        loadDrugQueryString();
        agent
            .get(`/api/v1/clinical/drugs/search${loadDrugQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
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

    it('47:04 -> Update drug', function (done) {
        loadDrugUpdateModel();
        const updateModel = getTestData('drugUpdateModel');
        agent
            .put(`/api/v1/clinical/drugs/${getTestData('drugId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectDrugProperties(response);

                expect(response.body.Data.Drug.DrugName).to.equal(getTestData('drugUpdateModel').DrugName);
                expect(response.body.Data.Drug.GenericName).to.equal(getTestData('drugUpdateModel').GenericName);
                expect(response.body.Data.Drug.Ingredients).to.equal(getTestData('drugUpdateModel').Ingredients);
                expect(response.body.Data.Drug.Strength).to.equal(getTestData('drugUpdateModel').Strength);
                expect(response.body.Data.Drug.OtherCommercialNames).to.equal(
                    getTestData('drugUpdateModel').OtherCommercialNames
                );
                expect(response.body.Data.Drug.Manufacturer).to.equal(getTestData('drugUpdateModel').Manufacturer);
                expect(response.body.Data.Drug.OtherInformation).to.equal(getTestData('drugUpdateModel').OtherInformation);
            })
            .expect(200, done);
    });

    it('47:05 -> Delete drug', function (done) {
        agent
            .delete(`/api/v1/clinical/drugs/${getTestData('drugId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create drug again', function (done) {
        loadDrugCreateModel();
        const createModel = getTestData('drugCreateModel');
        agent
            .post(`/api/v1/clinical/drugs/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setDrugId(response, 'drugId');
                expectDrugProperties(response);

                expectDrugPropertyValues(response);
            })
            .expect(201, done);
    });

    it('47:06 -> Negative - Create drug', function (done) {
        loadDrugCreateModel();
        const createModel = getTestData('drugCreateModel');
        agent
            .post(`/api/v1/clinical/drugs/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('47:07 -> Negative - Get drug by id', function (done) {
        agent
            .get(`/api/v1/clinical/drugs/${getTestData('drugId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('47:08 -> Negative - Update drug', function (done) {
        loadDrugUpdateModel();
        const updateModel = getTestData('drugUpdateModel');
        agent
            .put(`/api/v1/clinical/drugs/${getTestData('drugId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setDrugId(response, key) {
    setTestData(response.body.Data.Drug.id, key);
}

function expectDrugProperties(response) {
    expect(response.body.Data.Drug).to.have.property('id');
    expect(response.body.Data.Drug).to.have.property('DrugName');
    expect(response.body.Data.Drug).to.have.property('GenericName');
    expect(response.body.Data.Drug).to.have.property('Ingredients');
    expect(response.body.Data.Drug).to.have.property('Strength');
    expect(response.body.Data.Drug).to.have.property('OtherCommercialNames');
    expect(response.body.Data.Drug).to.have.property('Manufacturer');
    expect(response.body.Data.Drug).to.have.property('OtherInformation');
}

function expectDrugPropertyValues(response) {
    expect(response.body.Data.Drug.DrugName).to.equal(getTestData('drugCreateModel').DrugName);
    expect(response.body.Data.Drug.GenericName).to.equal(getTestData('drugCreateModel').GenericName);
    expect(response.body.Data.Drug.Ingredients).to.equal(getTestData('drugCreateModel').Ingredients);
    expect(response.body.Data.Drug.Strength).to.equal(getTestData('drugCreateModel').Strength);
    expect(response.body.Data.Drug.OtherCommercialNames).to.equal(getTestData('drugCreateModel').OtherCommercialNames);
    expect(response.body.Data.Drug.Manufacturer).to.equal(getTestData('drugCreateModel').Manufacturer);
    expect(response.body.Data.Drug.OtherInformation).to.equal(getTestData('drugCreateModel').OtherInformation);
}

export const loadDrugCreateModel = async () => {
    const model = {
        DrugName: faker.lorem.word(),
        GenericName: faker.lorem.word(),
        Ingredients: faker.lorem.word(),
        Strength: faker.lorem.word(),
        OtherCommercialNames: faker.lorem.words(),
        Manufacturer: faker.lorem.words(),
        OtherInformation: faker.lorem.words(10),
    };
    setTestData(model, 'drugCreateModel');
};

export const loadDrugUpdateModel = async () => {
    const model = {
        DrugName: faker.lorem.word(),
        GenericName: faker.lorem.word(),
        Ingredients: faker.lorem.word(),
        Strength: faker.lorem.word(),
        OtherCommercialNames: faker.lorem.words(),
        Manufacturer: faker.lorem.words(),
        OtherInformation: faker.lorem.words(5),
    };
    setTestData(model, 'drugUpdateModel');
};

function loadDrugQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
