import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Medication tests', function() {

    var agent = request.agent(infra._app);

    it('237 - Get a list of drugs from database', function(done) {
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

    it('238 - Get a list of drug-dose-units', function(done) {
        agent
            .get(`/api/v1/clinical/medications/dosage-units`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('239 - Get a list of medication-routes', function(done) {
        agent
            .get(`/api/v1/clinical/medications/administration-routes/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('240 - Get a list of medication-duration-units', function(done) {
        agent
            .get(`/api/v1/clinical/medications/duration-units/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('241 - Get a list of medication-frequency units', function(done) {
        agent
            .get(`/api/v1/clinical/medications/frequency-units/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('242 - Get medication stock images', function(done) {
        agent
            .get(`/api/v1/clinical/medications/stock-images/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('243 - Get medication stock image by id', function(done) {
        agent
            .get(`/api/v1/clinical/medications/stock-images/1`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('244 - Download medication stock image by id', function(done) {
    //     agent
    //         .get(`/api/v1/clinical/medications/stock-images/1/download`)
    //         .set('Content-Type', 'application/json')
    //         .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .expect(response => {
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
    //         })
    //         .expect(200, done);
    // });

    it('245 - Add new medication by drug name', function(done) {
        loadMedicationCreateModel();
        const createModel = getTestData("MedicationCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Medication.id, 'MedicationId');
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

                setTestData(response.body.Data.Medication.id, 'MedicationId');

                expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData("MedicationCreateModel").PatientUserId);
                expect(response.body.Data.Medication.DrugName).to.equal(getTestData("MedicationCreateModel").DrugName);
                expect(response.body.Data.Medication.Dose).to.equal(getTestData("MedicationCreateModel").Dose);
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData("MedicationCreateModel").DosageUnit);
                expect(response.body.Data.Medication.Frequency).to.equal(getTestData("MedicationCreateModel").Frequency);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData("MedicationCreateModel").FrequencyUnit);
                expect(response.body.Data.Medication.Route).to.equal(getTestData("MedicationCreateModel").Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData("MedicationCreateModel").Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData("MedicationCreateModel").DurationUnit);
                expect(response.body.Data.Medication.RefillNeeded).to.equal(getTestData("MedicationCreateModel").RefillNeeded);
                expect(response.body.Data.Medication.Instructions).to.equal(getTestData("MedicationCreateModel").Instructions);

            })
            .expect(201, done);
    });

    it('246 - Add new medication by drug id', function(done) {
        loadMedicationDrugIdCreateModel();
        const createModel = getTestData("MedicationDrugIdCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Medication.id, 'MedicationDrugId');
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

                setTestData(response.body.Data.Medication.id, 'MedicationDrugId');

                expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData("MedicationDrugIdCreateModel").PatientUserId);
                expect(response.body.Data.Medication.DrugId).to.equal(getTestData("MedicationDrugIdCreateModel").DrugId);
                expect(response.body.Data.Medication.Dose).to.equal(getTestData("MedicationDrugIdCreateModel").Dose);
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData("MedicationDrugIdCreateModel").DosageUnit);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData("MedicationDrugIdCreateModel").FrequencyUnit);
                expect(response.body.Data.Medication.Route).to.equal(getTestData("MedicationDrugIdCreateModel").Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData("MedicationDrugIdCreateModel").Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData("MedicationDrugIdCreateModel").DurationUnit);
                expect(response.body.Data.Medication.RefillNeeded).to.equal(getTestData("MedicationDrugIdCreateModel").RefillNeeded);
                expect(response.body.Data.Medication.RefillCount).to.equal(getTestData("MedicationDrugIdCreateModel").RefillCount);
                expect(response.body.Data.Medication.Instructions).to.equal(getTestData("MedicationDrugIdCreateModel").Instructions);

            })
            .expect(201, done);
    });

    it('247 - Search patient medication', function(done) {
        loadMedicationQueryString();
        agent
            .get(`/api/v1/clinical/medications/search${loadMedicationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

    it('248 - Get current patient medications', function(done) {
        agent
            .get(`/api/v1/clinical/medications/current/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('249 - Get medication by id', function(done) {
    
        agent
            .get(`/api/v1/clinical/medications/${getTestData('MedicationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
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

                expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData("MedicationCreateModel").PatientUserId);
                expect(response.body.Data.Medication.DrugName).to.equal(getTestData("MedicationCreateModel").DrugName);
                expect(response.body.Data.Medication.Dose).to.equal(getTestData("MedicationCreateModel").Dose);
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData("MedicationCreateModel").DosageUnit);
                expect(response.body.Data.Medication.Frequency).to.equal(getTestData("MedicationCreateModel").Frequency);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData("MedicationCreateModel").FrequencyUnit);
                expect(response.body.Data.Medication.Route).to.equal(getTestData("MedicationCreateModel").Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData("MedicationCreateModel").Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData("MedicationCreateModel").DurationUnit);
                expect(response.body.Data.Medication.RefillNeeded).to.equal(getTestData("MedicationCreateModel").RefillNeeded);
                expect(response.body.Data.Medication.Instructions).to.equal(getTestData("MedicationCreateModel").Instructions);

            })
            .expect(200, done);
    });

    it('250 - Update medication', function(done) {
        loadMedicationUpdateModel();
        const updateModel = getTestData("MedicationUpdateModel");
        agent
            .put(`/api/v1/clinical/medications/${getTestData('MedicationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
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

                expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData("MedicationUpdateModel").PatientUserId);
                expect(response.body.Data.Medication.Dose).to.equal(getTestData("MedicationUpdateModel").Dose);
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData("MedicationUpdateModel").DosageUnit);
                expect(response.body.Data.Medication.Frequency).to.equal(getTestData("MedicationUpdateModel").Frequency);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData("MedicationUpdateModel").FrequencyUnit);
                expect(response.body.Data.Medication.Route).to.equal(getTestData("MedicationUpdateModel").Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData("MedicationUpdateModel").Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData("MedicationUpdateModel").DurationUnit);
                expect(response.body.Data.Medication.RefillNeeded).to.equal(getTestData("MedicationUpdateModel").RefillNeeded);
                expect(response.body.Data.Medication.Instructions).to.equal(getTestData("MedicationUpdateModel").Instructions);

            })
            .expect(200, done);
    });

    it('251 - Delete Medication', function(done) {
       
        agent
            .delete(`/api/v1/clinical/medications/${getTestData('MedicationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Add new medication by drug name again', function(done) {
        loadMedicationCreateModel();
        const createModel = getTestData("MedicationCreateModel");
        agent
            .post(`/api/v1/clinical/medications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Medication.id, 'MedicationId');
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

                setTestData(response.body.Data.Medication.id, 'MedicationId');

                expect(response.body.Data.Medication.PatientUserId).to.equal(getTestData("MedicationCreateModel").PatientUserId);
                expect(response.body.Data.Medication.DrugName).to.equal(getTestData("MedicationCreateModel").DrugName);
                expect(response.body.Data.Medication.Dose).to.equal(getTestData("MedicationCreateModel").Dose);
                expect(response.body.Data.Medication.DosageUnit).to.equal(getTestData("MedicationCreateModel").DosageUnit);
                expect(response.body.Data.Medication.Frequency).to.equal(getTestData("MedicationCreateModel").Frequency);
                expect(response.body.Data.Medication.FrequencyUnit).to.equal(getTestData("MedicationCreateModel").FrequencyUnit);
                expect(response.body.Data.Medication.Route).to.equal(getTestData("MedicationCreateModel").Route);
                expect(response.body.Data.Medication.Duration).to.equal(getTestData("MedicationCreateModel").Duration);
                expect(response.body.Data.Medication.DurationUnit).to.equal(getTestData("MedicationCreateModel").DurationUnit);
                expect(response.body.Data.Medication.RefillNeeded).to.equal(getTestData("MedicationCreateModel").RefillNeeded);
                expect(response.body.Data.Medication.Instructions).to.equal(getTestData("MedicationCreateModel").Instructions);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadDrugQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?name=cres';
    return queryString;
}

export const loadMedicationCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugName      : "Generic Tamiflu",
        Dose          : 1,
        DosageUnit    : "Tablet",
        TimeSchedules : [
            "Morning",
            "Afternoon",
            "Evening",
            "Night"
        ],
        Frequency     : 4,
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : 20,
        DurationUnit  : "Days",
        StartDate     : "2023-09-14",
        RefillNeeded  : false,
        Instructions  : "If there is reaction or allergy, please contact immediately.",
    };
    setTestData(model, "MedicationCreateModel");
};

export const loadMedicationDrugIdCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        DrugId        : getTestData("DrugId"),
        Dose          : 1.5,
        DosageUnit    : "Tablet",
        TimeSchedules : [
            "Morning",
            "Afternoon"
        ],
        FrequencyUnit : "Daily",
        Route         : "Oral",
        Duration      : 2,
        DurationUnit  : "Days",
        StartDate     : "2023-10-14",
        RefillNeeded  : true,
        RefillCount   : 2,
        Instructions  : "If there is reaction or allergy, please contact immediately."
    };
    setTestData(model, "MedicationDrugIdCreateModel");
};

export const loadMedicationUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData("PatientUserId"),
        // DrugName      : "Paracetamol",
        Dose          : 2,
        DosageUnit    : "liquid",
        TimeSchedules : [
            "Morning",
            "Afternoon",
            "Evening",
            "Night"
        ],
        Frequency     : 4,
        FrequencyUnit : "weekly",
        Route         : "Oral",
        Duration      : 10,
        DurationUnit  : "weeks",
        StartDate     : "2023-09-14",
        RefillNeeded  : false,
        Instructions  : "If there is reaction or allergy, please contact immediately.",
    };
    setTestData(model, "MedicationUpdateModel");
};

function loadMedicationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?drugName=Generic Tamiflu';
    return queryString;
}
