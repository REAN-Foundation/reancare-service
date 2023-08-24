import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Patient health profile tests', function() {

    var agent = request.agent(infra._app);

    it('61 - Get severity list', function(done) {
        agent
            .get(`/api/v1/types/severities/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('62 - Get blood groups', function(done) {
        agent
            .get(`/api/v1/types/blood-groups/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('63 - Get marital status', function(done) {
        agent
            .get(`/api/v1/types/marital-statuses/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('64 - Get health profile', function(done) {
        agent
            .get(`/api/v1/patient-health-profiles/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('65 - Update health profile', function(done) {
        loadHealthProfileUpdateModel();
        const updateModel = getTestData("HealthProfileUpdateModel");
        agent
            .put(`/api/v1/patient-health-profiles/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
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

                expect(response.body.Data.HealthProfile.BloodGroup).to.equal(getTestData("HealthProfileUpdateModel").BloodGroup);
                expect(response.body.Data.HealthProfile.MajorAilment).to.equal(getTestData("HealthProfileUpdateModel").MajorAilment);
                expect(response.body.Data.HealthProfile.OtherConditions).to.equal(getTestData("HealthProfileUpdateModel").OtherConditions);
                expect(response.body.Data.HealthProfile.IsDiabetic).to.equal(getTestData("HealthProfileUpdateModel").IsDiabetic);
                expect(response.body.Data.HealthProfile.HasHeartAilment).to.equal(getTestData("HealthProfileUpdateModel").HasHeartAilment);
                expect(response.body.Data.HealthProfile.MaritalStatus).to.equal(getTestData("HealthProfileUpdateModel").MaritalStatus);
                expect(response.body.Data.HealthProfile.Ethnicity).to.equal(getTestData("HealthProfileUpdateModel").Ethnicity);
                expect(response.body.Data.HealthProfile.Nationality).to.equal(getTestData("HealthProfileUpdateModel").Nationality);
                expect(response.body.Data.HealthProfile.Occupation).to.equal(getTestData("HealthProfileUpdateModel").Occupation);
                expect(response.body.Data.HealthProfile.SedentaryLifestyle).to.equal(getTestData("HealthProfileUpdateModel").SedentaryLifestyle);
                expect(response.body.Data.HealthProfile.IsSmoker).to.equal(getTestData("HealthProfileUpdateModel").IsSmoker);
                expect(response.body.Data.HealthProfile.IsDrinker).to.equal(getTestData("HealthProfileUpdateModel").IsDrinker);
                expect(response.body.Data.HealthProfile.DrinkingSeverity).to.equal(getTestData("HealthProfileUpdateModel").DrinkingSeverity);
                expect(response.body.Data.HealthProfile.DrinkingSince).to.equal(getTestData("HealthProfileUpdateModel").DrinkingSince);
                expect(response.body.Data.HealthProfile.SubstanceAbuse).to.equal(getTestData("HealthProfileUpdateModel").SubstanceAbuse);
                expect(response.body.Data.HealthProfile.ProcedureHistory).to.equal(getTestData("HealthProfileUpdateModel").ProcedureHistory);
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadHealthProfileUpdateModel = async (
) => {
    const model = {
        BloodGroup         : "O+",
        MajorAilment       : "Heart failure",
        OtherConditions    : "None",
        IsDiabetic         : false,
        HasHeartAilment    : true,
        MaritalStatus      : "Married",
        Ethnicity          : "South-Asian",
        Nationality        : "Indian",
        Occupation         : "Software engineer",
        SedentaryLifestyle : true,
        IsSmoker           : false,
        IsDrinker          : true,
        DrinkingSeverity   : "Medium",
        DrinkingSince      : "2010-01-01T00:00:00.000Z",
        SubstanceAbuse     : true,
        ProcedureHistory   : "Had a toncil operation"
    };
    setTestData(model, "HealthProfileUpdateModel");
};
