import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { faker } from '@faker-js/faker';
import { getTestData, setTestData } from '../init';
import { BloodGroupList, MaritalStatusList, Severity } from '../../../src/domain.types/miscellaneous/system.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('12 - Patient health profile tests', function () {
    var agent = request.agent(infra._app);

    it('12:01 -> Get health profile', function (done) {
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

    it('12:02 -> Update health profile', function (done) {
        loadHealthProfileUpdateModel();
        const updateModel = getTestData('healthProfileUpdateModel');
        agent
            .put(`/api/v1/patient-health-profiles/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data.HealthProfile).to.have.property('id');
                expect(response.body.Data.HealthProfile).to.have.property('BloodGroup');
                expect(response.body.Data.HealthProfile).to.have.property('MajorAilment');
                expect(response.body.Data.HealthProfile).to.have.property('OtherConditions');
                expect(response.body.Data.HealthProfile).to.have.property('IsDiabetic');
                expect(response.body.Data.HealthProfile).to.have.property('HasHeartAilment');
                expect(response.body.Data.HealthProfile).to.have.property('MaritalStatus');
                expect(response.body.Data.HealthProfile).to.have.property('Ethnicity');
                expect(response.body.Data.HealthProfile).to.have.property('Nationality');
                expect(response.body.Data.HealthProfile).to.have.property('Occupation');
                expect(response.body.Data.HealthProfile).to.have.property('SedentaryLifestyle');
                expect(response.body.Data.HealthProfile).to.have.property('IsSmoker');
                expect(response.body.Data.HealthProfile).to.have.property('IsDrinker');
                expect(response.body.Data.HealthProfile).to.have.property('DrinkingSeverity');
                expect(response.body.Data.HealthProfile).to.have.property('DrinkingSince');
                expect(response.body.Data.HealthProfile).to.have.property('SubstanceAbuse');
                expect(response.body.Data.HealthProfile).to.have.property('ProcedureHistory');

                expect(response.body.Data.HealthProfile.BloodGroup).to.equal(
                    getTestData('healthProfileUpdateModel').BloodGroup
                );
                expect(response.body.Data.HealthProfile.MajorAilment).to.equal(
                    getTestData('healthProfileUpdateModel').MajorAilment
                );
                expect(response.body.Data.HealthProfile.OtherConditions).to.equal(
                    getTestData('healthProfileUpdateModel').OtherConditions
                );
                expect(response.body.Data.HealthProfile.IsDiabetic).to.equal(
                    getTestData('healthProfileUpdateModel').IsDiabetic
                );
                expect(response.body.Data.HealthProfile.HasHeartAilment).to.equal(
                    getTestData('healthProfileUpdateModel').HasHeartAilment
                );
                expect(response.body.Data.HealthProfile.MaritalStatus).to.equal(
                    getTestData('healthProfileUpdateModel').MaritalStatus
                );
                expect(response.body.Data.HealthProfile.Ethnicity).to.equal(
                    getTestData('healthProfileUpdateModel').Ethnicity
                );
                expect(response.body.Data.HealthProfile.Nationality).to.equal(
                    getTestData('healthProfileUpdateModel').Nationality
                );
                expect(response.body.Data.HealthProfile.Occupation).to.equal(
                    getTestData('healthProfileUpdateModel').Occupation
                );
                expect(response.body.Data.HealthProfile.SedentaryLifestyle).to.equal(
                    getTestData('healthProfileUpdateModel').SedentaryLifestyle
                );
                expect(response.body.Data.HealthProfile.IsSmoker).to.equal(getTestData('healthProfileUpdateModel').IsSmoker);
                expect(response.body.Data.HealthProfile.IsDrinker).to.equal(
                    getTestData('healthProfileUpdateModel').IsDrinker
                );
                expect(response.body.Data.HealthProfile.DrinkingSeverity).to.equal(
                    getTestData('healthProfileUpdateModel').DrinkingSeverity
                );
                expect(response.body.Data.HealthProfile.SubstanceAbuse).to.equal(
                    getTestData('healthProfileUpdateModel').SubstanceAbuse
                );
                expect(response.body.Data.HealthProfile.ProcedureHistory).to.equal(
                    getTestData('healthProfileUpdateModel').ProcedureHistory
                );
            })
            .expect(200, done);
    });

    it('12:03 -> Negative - Update health profile', function (done) {
        loadHealthProfileUpdateModel();
        const updateModel = getTestData('healthProfileUpdateModel');
        agent
            .put(`/api/v1/patient-health-profiles/${getTestData('patientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });
});

///////////////////////////////////////////////////////////////////////////

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
