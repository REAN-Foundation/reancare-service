import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient health profile tests', function() {

    var agent = request.agent(infra._app);

    it('24 - Negative - Get severity list', function(done) {
        agent
            .get(`/api/v1/types/severities/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('25 - Negative - Get blood groups', function(done) {
        agent
            .get(`/api/v1/types/blood-groups/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('26 - Negative - Update health profile', function(done) {
        loadHealthProfileUpdateModel();
        const updateModel = getTestData("HealthProfileUpdateModel");
        agent
            .put(`/api/v1/patient-health-profiles/${getTestData('PatientUserId1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
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
