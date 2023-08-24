import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Body weight tests', function() {

    var agent = request.agent(infra._app);

    it('335 - Create body weight', function(done) {
        loadBodyWeightCreateModel();
        const createModel = getTestData("BodyWeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BodyWeight.id, 'BodyWeightId');
                expect(response.body.Data.BodyWeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyWeight).to.have.property('BodyWeight');
                expect(response.body.Data.BodyWeight).to.have.property('Unit');
                expect(response.body.Data.BodyWeight).to.have.property('RecordDate');
                expect(response.body.Data.BodyWeight).to.have.property('RecordedByUserId');
               
                setTestData(response.body.Data.BodyWeight.id, 'BodyWeightId');

                expect(response.body.Data.BodyWeight.PatientUserId).to.equal(getTestData("BodyWeightCreateModel").PatientUserId);
                expect(response.body.Data.BodyWeight.BodyWeight).to.equal(getTestData("BodyWeightCreateModel").BodyWeight);
                expect(response.body.Data.BodyWeight.Unit).to.equal(getTestData("BodyWeightCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('336 - Get body weight by id', function(done) {

        agent
            .get(`/api/v1/clinical/biometrics/body-weights/${getTestData('BodyWeightId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BodyWeight).to.have.property('id');
                expect(response.body.Data.BodyWeight).to.have.property('EhrId');
                expect(response.body.Data.BodyWeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyWeight).to.have.property('BodyWeight');
                expect(response.body.Data.BodyWeight).to.have.property('Unit');
                expect(response.body.Data.BodyWeight).to.have.property('RecordDate');
                expect(response.body.Data.BodyWeight).to.have.property('RecordedByUserId');
          
            })
            .expect(200, done);
    });

    it('337 - Search body weight records', function(done) {
        loadBodyWeightQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-weights/search${loadBodyWeightQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BodyWeightRecords).to.have.property('TotalCount');
                expect(response.body.Data.BodyWeightRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BodyWeightRecords).to.have.property('PageIndex');
                expect(response.body.Data.BodyWeightRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BodyWeightRecords).to.have.property('Order');
                expect(response.body.Data.BodyWeightRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BodyWeightRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BodyWeightRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('338 - Update body weight', function(done) {
        loadBodyWeightUpdateModel();
        const updateModel = getTestData("BodyWeightUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/body-weights/${getTestData('BodyWeightId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.BodyWeight).to.have.property('id');
                expect(response.body.Data.BodyWeight).to.have.property('EhrId');
                expect(response.body.Data.BodyWeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyWeight).to.have.property('BodyWeight');
                expect(response.body.Data.BodyWeight).to.have.property('Unit');
                expect(response.body.Data.BodyWeight).to.have.property('RecordDate');
                expect(response.body.Data.BodyWeight).to.have.property('RecordedByUserId');
               
                expect(response.body.Data.BodyWeight.BodyWeight).to.equal(getTestData("BodyWeightUpdateModel").BodyWeight);
                expect(response.body.Data.BodyWeight.Unit).to.equal(getTestData("BodyWeightUpdateModel").Unit);

            })
            .expect(200, done);
    });

    it('339 - Delete body weight', function(done) {
     
        agent
            .delete(`/api/v1/clinical/biometrics/body-weights/${getTestData('BodyWeightId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create body weight again', function(done) {
        loadBodyWeightCreateModel();
        const createModel = getTestData("BodyWeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-weights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BodyWeight.id, 'BodyWeightId');
                expect(response.body.Data.BodyWeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyWeight).to.have.property('BodyWeight');
                expect(response.body.Data.BodyWeight).to.have.property('Unit');
                expect(response.body.Data.BodyWeight).to.have.property('RecordDate');
                expect(response.body.Data.BodyWeight).to.have.property('RecordedByUserId');
             
                setTestData(response.body.Data.BodyWeight.id, 'BodyWeightId');

                expect(response.body.Data.BodyWeight.PatientUserId).to.equal(getTestData("BodyWeightCreateModel").PatientUserId);
                expect(response.body.Data.BodyWeight.BodyWeight).to.equal(getTestData("BodyWeightCreateModel").BodyWeight);
                expect(response.body.Data.BodyWeight.Unit).to.equal(getTestData("BodyWeightCreateModel").Unit);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadBodyWeightCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData('PatientUserId'),
        BodyWeight    : 88,
        Unit          : "kg"

    };
    setTestData(model, "BodyWeightCreateModel");
};

export const loadBodyWeightUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData('PatientUserId'),
        BodyWeight    : 180,
        Unit          : "kg"
    };
    setTestData(model, "BodyWeightUpdateModel");
};

function loadBodyWeightQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?MinValue=10&MaxValue=200';
    return queryString;
}
