import request from 'supertest';
import { expect, assert } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../utils';
import { BloodGroupList, MaritalStatusList, Severity } from '../../../src/domain.types/miscellaneous/system.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('105 - tests', function () {
    var agent = request.agent(infra._app);

    it('105:01 -> Create knowledge nugget test', function (done) {
        loadKnowledgeNuggetCreateModel();
        const createModel = getTestData('knowledgeNuggetCreateModel');
        agent
            .post(`/api/v1/educational/knowledge-nuggets/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('105:02 -> Create heart points test', function (done) {
        loadHeartPointCreateModel();
        const createModel = getTestData('heartPointCreateModel');
        agent
            .post(`/api/v1/wellness/daily-records/heart-points/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('105:03 -> Get patient health profile test', function (done) {
        agent
            .get(`/api/v1/patient-health-profiles/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('105:04 -> Update health profile', function (done) {
        loadHealthProfileUpdateModel();
        const updateModel = getTestData('healthProfileUpdateModel');
        agent
            .put(`/api/v1/patient-health-profiles/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('105:05 -> Create address', function (done) {
        loadAddressCreateModel();
        const createModel = getTestData('addressCreateModel');
        agent
            .post(`/api/v1/addresses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadKnowledgeNuggetCreateModel = async () => {
    const model = {
        TopicName: faker.lorem.word(),
        BriefInformation: faker.word.words(),
        DetailedInformation: faker.word.words(),
        AdditionalResources: [faker.word.words()],
        Tags: [faker.word.words()],
    };
    setTestData(model, 'knowledgeNuggetCreateModel');
};

export const loadHeartPointCreateModel = async () => {
    const model = {
        PersonId: getTestData('patientPersonId'),
        PatientUserId: getTestData('patientUserId'),
        HeartPoints: faker.number.int(10),
        Unit: faker.string.symbol(),
    };
    setTestData(model, 'heartPointCreateModel');
};

export const loadHealthProfileUpdateModel = async () => {
    const model = {
        BloodGroup: getRandomEnumValue(BloodGroupList),
        MajorAilment: faker.lorem.word(5),
        OtherConditions: faker.lorem.word(5),
        IsDiabetic: faker.datatype.boolean(),
        HasHeartAilment: faker.datatype.boolean(),
        MaritalStatus: getRandomEnumValue(MaritalStatusList),
        Ethnicity: faker.lorem.slug(2),
        Nationality: faker.location.country(),
        Occupation: faker.lorem.words(2),
        SedentaryLifestyle: faker.datatype.boolean(),
        IsSmoker: faker.datatype.boolean(),
        IsDrinker: faker.datatype.boolean(),
        DrinkingSeverity: getRandomEnumValue(Severity),
        DrinkingSince: faker.date.past(),
        SubstanceAbuse: faker.datatype.boolean(),
        ProcedureHistory: faker.word.words(),
    };
    setTestData(model, 'healthProfileUpdateModel');
};

export const loadAddressCreateModel = async () => {
    const model = {
        Type: faker.lorem.word(),
        AddressLine: faker.location.streetAddress(),
        City: faker.location.city(),
        District: faker.lorem.word(),
        State: faker.lorem.word(),
        Country: faker.location.country(),
        PostalCode: faker.location.zipCode(),
        Longitude: faker.location.longitude(),
        Lattitude: faker.location.latitude(),
    };
    setTestData(model, 'addressCreateModel');
};
