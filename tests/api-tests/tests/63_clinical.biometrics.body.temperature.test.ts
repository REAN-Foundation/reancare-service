import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('63 - Body temperature tests', function() {

    var agent = request.agent(infra._app);

    it('63:01 -> Create body temperature', function(done) {
        loadBodyTemperatureCreateModel();
        const createModel = getTestData("BodyTemperatureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BodyTemperature.id, 'BodyTemperatureId_1');
                expect(response.body.Data.BodyTemperature).to.have.property('PatientUserId');
                expect(response.body.Data.BodyTemperature).to.have.property('BodyTemperature');
                expect(response.body.Data.BodyTemperature).to.have.property('Unit');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordDate');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordedByUserId');
               
                setTestData(response.body.Data.BodyTemperature.id, 'BodyTemperatureId_1');

                expect(response.body.Data.BodyTemperature.PatientUserId).to.equal(getTestData("BodyTemperatureCreateModel").PatientUserId);
                expect(response.body.Data.BodyTemperature.BodyTemperature).to.equal(getTestData("BodyTemperatureCreateModel").BodyTemperature);
                expect(response.body.Data.BodyTemperature.Unit).to.equal(getTestData("BodyTemperatureCreateModel").Unit);
            
            })
            .expect(201, done);
    });

    it('63:02 -> Get body temperature by id', function(done) {
      
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('BodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BodyTemperature).to.have.property('id');
                expect(response.body.Data.BodyTemperature).to.have.property('EhrId');
                expect(response.body.Data.BodyTemperature).to.have.property('PatientUserId');
                expect(response.body.Data.BodyTemperature).to.have.property('TerraSummaryId');
                expect(response.body.Data.BodyTemperature).to.have.property('Provider');
                expect(response.body.Data.BodyTemperature).to.have.property('BodyTemperature');
                expect(response.body.Data.BodyTemperature).to.have.property('Unit');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordDate');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordedByUserId');
                expect(response.body.Data.BodyTemperature.id).to.equal(getTestData("BodyTemperatureId_1"));
            
            })
            .expect(200, done);
    });

    it('63:03 -> Search body temperature records', function(done) {
        loadBodyTemperatureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/search${loadBodyTemperatureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('TotalCount');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('PageIndex');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BodyTemperatureRecords).to.have.property('Order');
                expect(response.body.Data.BodyTemperatureRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BodyTemperatureRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BodyTemperatureRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('63:04 -> Update body temperature', function(done) {
        loadBodyTemperatureUpdateModel();
        const updateModel = getTestData("BodyTemperatureUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('BodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {

                expect(response.body.Data.BodyTemperature).to.have.property('id');
                expect(response.body.Data.BodyTemperature).to.have.property('EhrId');
                expect(response.body.Data.BodyTemperature).to.have.property('PatientUserId');
                expect(response.body.Data.BodyTemperature).to.have.property('TerraSummaryId');
                expect(response.body.Data.BodyTemperature).to.have.property('Provider');
                expect(response.body.Data.BodyTemperature).to.have.property('BodyTemperature');
                expect(response.body.Data.BodyTemperature).to.have.property('Unit');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordDate');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordedByUserId');
          
                expect(response.body.Data.BodyTemperature.BodyTemperature).to.equal(getTestData("BodyTemperatureUpdateModel").BodyTemperature);
                expect(response.body.Data.BodyTemperature.Unit).to.equal(getTestData("BodyTemperatureUpdateModel").Unit);
            })
            .expect(200, done);
    });

    it('63:05 -> Delete body temperature', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('BodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create body temperature again', function(done) {
        loadBodyTemperatureCreateModel();
        const createModel = getTestData("BodyTemperatureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BodyTemperature.id, 'BodyTemperatureId');
                expect(response.body.Data.BodyTemperature).to.have.property('PatientUserId');
                expect(response.body.Data.BodyTemperature).to.have.property('BodyTemperature');
                expect(response.body.Data.BodyTemperature).to.have.property('Unit');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordDate');
                expect(response.body.Data.BodyTemperature).to.have.property('RecordedByUserId');
             
                setTestData(response.body.Data.BodyTemperature.id, 'BodyTemperatureId');

                expect(response.body.Data.BodyTemperature.PatientUserId).to.equal(getTestData("BodyTemperatureCreateModel").PatientUserId);
                expect(response.body.Data.BodyTemperature.BodyTemperature).to.equal(getTestData("BodyTemperatureCreateModel").BodyTemperature);
                expect(response.body.Data.BodyTemperature.Unit).to.equal(getTestData("BodyTemperatureCreateModel").Unit);
          
            })
            .expect(201, done);
    });

    it('63:06 -> Negative - Create body temperature', function(done) {
        loadNegativeBodyTemperatureCreateModel();
        const createModel = getTestData("NegativeBodyTemperatureCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-temperatures`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            
            })
            .expect(422, done);
    });

    it('63:07 -> Negative - Search body temperature records', function(done) {
        loadBodyTemperatureQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-temperatures/search${loadBodyTemperatureQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('63:08 -> Negative - Delete body temperature', function(done) {
       
        agent
            .delete(`/api/v1/clinical/biometrics/body-temperatures/${getTestData('BodyTemperatureId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadBodyTemperatureCreateModel = async (
) => {
    const model = {
        PatientUserId    : getTestData("PatientUserId"),
        BodyTemperature  : faker.number.int(100),
        Unit             : faker.string.symbol(),
        RecordDate       : faker.date.anytime(),
        RecordedByUserId : getTestData("PatientUserId")

    };
    setTestData(model, "BodyTemperatureCreateModel");
};

export const loadBodyTemperatureUpdateModel = async (
) => {
    const model = {
        BodyTemperature : faker.number.int(100),
        Unit            : faker.string.symbol(),
        RecordDate      : faker.date.anytime(),
    };
    setTestData(model, "BodyTemperatureUpdateModel");
};

function loadBodyTemperatureQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBodyTemperatureCreateModel = async (
) => {
    const model = {
        Unit       : faker.string.symbol(),
        RecordDate : faker.date.anytime(),
    };
    setTestData(model, "NegativeBodyTemperatureCreateModel");
};
