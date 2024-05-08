import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import {
    MedicationDurationUnits,
    MedicationTimeSchedules,
} from '../../../src/domain.types/clinical/medication/medication/medication.types';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('48 - Medication tests', function () {
    var agent = request.agent(infra._app);

    it('48:01 -> Get a list of drugs from database', function (done) {
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

    it('48:02 -> Get a list of drug-dose-units', function (done) {
        agent
            .get(`/api/v1/clinical/medications/dosage-units`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:03 -> Get a list of medication-routes', function (done) {
        agent
            .get(`/api/v1/clinical/medications/administration-routes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:04 -> Get a list of medication-duration-units', function (done) {
        agent
            .get(`/api/v1/clinical/medications/duration-units/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:05 -> Get a list of medication-frequency units', function (done) {
        agent
            .get(`/api/v1/clinical/medications/frequency-units/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:06 -> Get medication stock images', function (done) {
        agent
            .get(`/api/v1/clinical/medications/stock-images/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:07 -> Get medication stock image by id', function (done) {
        agent
            .get(`/api/v1/clinical/medications/stock-images/1`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:08 -> Add new medication by drug name', function (done) {
        loadMedicationCreateModel();
        const createModel = getTestData('medicationCreateModel');
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setMedicationId(response, 'medicationId_1');
                expectMedicationProperties(response);

                expectMedicationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('48:09 -> Add new medication by drug id', function (done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData('medicationDrugIdCreateModel');
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.Medication.id, 'medicationDrugId');
                expect(response.body.Data.Medication).to.have.property('id');
                expect(response.body.Data.Medication).to.have.property('PatientUserId');
                expect(response.body.Data.Medication).to.have.property('DrugId');
                expect(response.body.Data.Medication).to.have.property('Dose');
                expect(response.body.Data.Medication).to.have.property('DosageUnit');
                expect(response.body.Data.Medication).to.have.property('FrequencyUnit');
                expect(response.body.Data.Medication).to.have.property('Route');
                expect(response.body.Data.Medication).to.have.property('Duration');
                expect(response.body.Data.Medication).to.have.property('DurationUnit');
                expect(response.body.Data.Medication).to.have.property('StartDate');
                expect(response.body.Data.Medication).to.have.property('RefillNeeded');
                expect(response.body.Data.Medication).to.have.property('RefillCount');
                expect(response.body.Data.Medication).to.have.property('Instructions');

                expect(response.body.Data.Medication.PatientUserId).to.equal(
                    getTestData('medicationDrugIdCreateModel').PatientUserId
                );
                expect(response.body.Data.Medication.DrugId).to.equal(getTestData('medicationDrugIdCreateModel').DrugId);
                expect(response.body.Data.Medication.DosageUnit).to.equal(
                    getTestData('medicationDrugIdCreateModel').DosageUnit
                );
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(
                    getTestData('medicationDrugIdCreateModel').FrequencyUnit
                );
                expect(response.body.Data.Medication.Route).to.equal(getTestData('medicationDrugIdCreateModel').Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData('medicationDrugIdCreateModel').Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(
                    getTestData('medicationDrugIdCreateModel').DurationUnit
                );
                expect(response.body.Data.Medication.RefillCount).to.equal(
                    getTestData('medicationDrugIdCreateModel').RefillCount
                );
                expect(response.body.Data.Medication.Instructions).to.equal(
                    getTestData('medicationDrugIdCreateModel').Instructions
                );
            })
            .expect(201, done);
    });

    it('48:10 -> Search patient medication', function (done) {
        loadMedicationQueryString();
        agent
            .get(`/api/v1/clinical/medications/search${loadMedicationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Medications).to.have.property('TotalCount');
                expect(response.body.Data.Medications).to.have.property('RetrievedCount');
                expect(response.body.Data.Medications).to.have.property('PageIndex');
                expect(response.body.Data.Medications).to.have.property('ItemsPerPage');
                expect(response.body.Data.Medications).to.have.property('Order');
                expect(response.body.Data.Medications.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Medications.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Medications.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('48:11 -> Get current patient medications', function (done) {
        agent
            .get(`/api/v1/clinical/medications/current/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('48:12 -> Get medication by id', function (done) {
        agent
            .get(`/api/v1/clinical/medications/${getTestData('medicationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectMedicationProperties(response);

                expectMedicationPropertyValues(response);
            })
            .expect(200, done);
    });

    it('48:13 -> Update medication', function (done) {
        loadMedicationUpdateModel();
        const updateModel = getTestData('medicationUpdateModel');
        agent
            .put(`/api/v1/clinical/medications/${getTestData('medicationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectMedicationProperties(response);

                expect(response.body.Data.Medication.PatientUserId).to.equal(
                    getTestData('medicationUpdateModel').PatientUserId
                );
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData('medicationUpdateModel').DosageUnit);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(
                    getTestData('medicationUpdateModel').FrequencyUnit
                );
                expect(response.body.Data.Medication.Route).to.equal(getTestData('medicationUpdateModel').Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData('medicationUpdateModel').Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(
                    getTestData('medicationUpdateModel').DurationUnit
                );
                expect(response.body.Data.Medication.Instructions).to.equal(
                    getTestData('medicationUpdateModel').Instructions
                );
            })
            .expect(200, done);
    });

    it('48:14 -> Delete Medication', function (done) {
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('medicationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Add new medication by drug name again', function (done) {
        loadMedicationCreateModel();
        const createModel = getTestData('medicationCreateModel');
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setMedicationId(response, 'medicationId');
                expectMedicationProperties(response);

                expectMedicationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('48:15 -> Negative - Get a list of drugs from database', function (done) {
        loadDrugQueryString();
        agent
            .get(`/api/v1/clinical/drugs/search${loadDrugQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('48:16 -> Negative - Get a list of medication-duration-units', function (done) {
        agent
            .get(`/api/v1/clinical/medications/duration-units/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('48:17 -> Negative - Get a list of medication-frequency units', function (done) {
        agent
            .get(`/api/v1/clinical/medications/frequency-units/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('48:18 -> Negative - Get medication stock image by id', function (done) {
        agent
            .get(`/api/v1/clinical/medications/stock-images/1111`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('48:19 -> Negative - Add new medication by drug name', function (done) {
        loadMedicationCreateModel();
        const createModel = getTestData('medicationCreateModel');
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('48:20 -> Negative - Add new medication by drug id', function (done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData('medicationDrugIdCreateModel');
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('48:21 -> Negative - Get current patient medications', function (done) {
        agent
            .get(`/api/v1/clinical/medications/current/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('48:22 -> Negative - Get medication by id', function (done) {
        agent
            .get(`/api/v1/clinical/medications/${getTestData('medicationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('48:23 -> Negative - Delete Medication', function (done) {
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('medicationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setMedicationId(response, key) {
    setTestData(response.body.Data.Medication.id, key);
}

function expectMedicationProperties(response) {
    expect(response.body.Data.Medication).to.have.property('id');
    expect(response.body.Data.Medication).to.have.property('PatientUserId');
    expect(response.body.Data.Medication).to.have.property('DrugName');
    expect(response.body.Data.Medication).to.have.property('Dose');
    expect(response.body.Data.Medication).to.have.property('DosageUnit');
    expect(response.body.Data.Medication).to.have.property('Frequency');
    expect(response.body.Data.Medication).to.have.property('FrequencyUnit');
    expect(response.body.Data.Medication).to.have.property('Route');
    expect(response.body.Data.Medication).to.have.property('Duration');
    expect(response.body.Data.Medication).to.have.property('DurationUnit');
    expect(response.body.Data.Medication).to.have.property('StartDate');
    expect(response.body.Data.Medication).to.have.property('RefillNeeded');
    expect(response.body.Data.Medication).to.have.property('Instructions');
}

function expectMedicationPropertyValues(response) {
    expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData('medicationCreateModel').PatientUserId);
    expect(response.body.Data.Medication.DrugName).to.equal(getTestData('medicationCreateModel').DrugName);
    expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData('medicationCreateModel').DosageUnit);
    expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData('medicationCreateModel').FrequencyUnit);
    expect(response.body.Data.Medication.Route).to.equal(getTestData('medicationCreateModel').Route);
    expect(response.body.Data.Medication.Duration).to.equal(getTestData('medicationCreateModel').Duration);
    expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData('medicationCreateModel').DurationUnit);
    expect(response.body.Data.Medication.Instructions).to.equal(getTestData('medicationCreateModel').Instructions);
}

function loadDrugQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadMedicationCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        DrugName: faker.lorem.word(),
        Dose: faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit: 'Tablet',
        TimeSchedules: [getRandomEnumValue(MedicationTimeSchedules)],
        Frequency: faker.number.int({ min: 2, max: 4 }),
        FrequencyUnit: 'Daily',
        Route: 'Oral',
        Duration: faker.number.int({ min: 10, max: 20 }),
        DurationUnit: getRandomEnumValue(MedicationDurationUnits),
        StartDate: '2023-09-14',
        RefillNeeded: faker.datatype.boolean(),
        Instructions: faker.lorem.words(),
    };
    setTestData(model, 'medicationCreateModel');
};

export const loadMedicationDrugIdCreateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        DrugId: getTestData('drugId'),
        Dose: faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit: 'Tablet',
        TimeSchedules: [getRandomEnumValue(MedicationTimeSchedules)],
        FrequencyUnit: 'Daily',
        Route: 'Oral',
        Duration: faker.number.int({ min: 10, max: 20 }),
        DurationUnit: getRandomEnumValue(MedicationDurationUnits),
        StartDate: '2023-10-14',
        RefillNeeded: faker.datatype.boolean(),
        RefillCount: faker.number.int({ min: 2, max: 5 }),
        Instructions: faker.lorem.words(),
    };
    setTestData(model, 'medicationDrugIdCreateModel');
};

export const loadMedicationUpdateModel = async () => {
    const model = {
        PatientUserId: getTestData('patientUserId'),
        Dose: faker.number.int({ min: 1, max: 1.5 }),
        DosageUnit: 'Tablet',
        TimeSchedules: [getRandomEnumValue(MedicationTimeSchedules)],
        Frequency: faker.number.int({ min: 2, max: 4 }),
        FrequencyUnit: 'Daily',
        Route: 'Oral',
        Duration: faker.number.int({ min: 10, max: 20 }),
        DurationUnit: getRandomEnumValue(MedicationDurationUnits),
        StartDate: '2023-09-14',
        RefillNeeded: faker.datatype.boolean(),
        Instructions: faker.lorem.words(),
    };
    setTestData(model, 'medicationUpdateModel');
};

function loadMedicationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
