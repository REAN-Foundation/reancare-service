import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Patient stats & report tests', function() {

    var agent = request.agent(infra._app);

    it('60 - Negative - Get patient stats', function(done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData("PatientUser")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

    it('61 - Negative - Get patient stats report', function(done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData("PatientUserId")}/report`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0VNC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadLineChartCreateModel = async (
) => {
    const model = {
        Data : [

        ],
        Options : {

        }

    };
    setTestData(model, "LineChartCreateModel");
};

///////////////////////////////////////////////////////////////////////////
