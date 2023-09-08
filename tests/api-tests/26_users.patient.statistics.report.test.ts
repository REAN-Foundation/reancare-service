import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('26 - Patient stats & report tests', function() {

    var agent = request.agent(infra._app);

    it('26 - 01 - Get patient stats', function(done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('26 - 02 - Get patient stats report', function(done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData("PatientUserId")}/report`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    // it('26 - 03 - Create line chart', function(done) {
    //     loadLineChartCreateModel();
    //     const createModel = getTestData("LineChartCreateModel");
    //     agent
    //         .post(`/api/v1/charts/line-chart/`)
    //         .set('Content-Type', 'application/json')
    //        .set('x-api-key', `${process.env.TEST_API_KEY}`)
    //         .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
    //         .send(createModel)
    //         .expect(response => {
    //             setTestData(response.body.Data.id, 'LineChartId');
    //             expect(response.body).to.have.property('Status');
    //             expect(response.body.Status).to.equal('success');
                
    //         })
    //         .expect(201, done);
    // });

    it('26 - 01 - Negative - Get patient stats', function(done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('26 - 02 - Negative - Get patient stats report', function(done) {
        agent
            .get(`/api/v1/patient-statistics/${getTestData("PatientUserId")}/report`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
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
