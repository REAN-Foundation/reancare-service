import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('61 - Body height tests', function() {

    var agent = request.agent(infra._app);

    it('61:01 -> Create body height', function(done) {
        loadBodyHeightCreateModel();
        const createModel = getTestData("BodyHeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-heights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BodyHeight.id, 'BodyHeightId_1');
                expect(response.body.Data.BodyHeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyHeight).to.have.property('BodyHeight');
                expect(response.body.Data.BodyHeight).to.have.property('Unit');
                expect(response.body.Data.BodyHeight).to.have.property('RecordDate');
               
                setTestData(response.body.Data.BodyHeight.id, 'BodyHeightId_1');

                expect(response.body.Data.BodyHeight.PatientUserId).to.equal(getTestData("BodyHeightCreateModel").PatientUserId);
                expect(response.body.Data.BodyHeight.BodyHeight).to.equal(getTestData("BodyHeightCreateModel").BodyHeight);
                expect(response.body.Data.BodyHeight.Unit).to.equal(getTestData("BodyHeightCreateModel").Unit);

            })
            .expect(201, done);
    });

    it('61:02 -> Get body height by id', function(done) {
     
        agent
            .get(`/api/v1/clinical/biometrics/body-heights/${getTestData('BodyHeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BodyHeight).to.have.property('id');
                expect(response.body.Data.BodyHeight).to.have.property('EhrId');
                expect(response.body.Data.BodyHeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyHeight).to.have.property('BodyHeight');
                expect(response.body.Data.BodyHeight).to.have.property('Unit');
                expect(response.body.Data.BodyHeight).to.have.property('RecordDate');

                expect(response.body.Data.BodyHeight.id).to.equal(getTestData("BodyHeightId_1"));
                
            })
            .expect(200, done);
    });

    it('61:03 -> Search body height records', function(done) {
        loadBodyHeightQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-heights/search${loadBodyHeightQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.BodyHeightRecords).to.have.property('TotalCount');
                expect(response.body.Data.BodyHeightRecords).to.have.property('RetrievedCount');
                expect(response.body.Data.BodyHeightRecords).to.have.property('PageIndex');
                expect(response.body.Data.BodyHeightRecords).to.have.property('ItemsPerPage');
                expect(response.body.Data.BodyHeightRecords).to.have.property('Order');
                expect(response.body.Data.BodyHeightRecords.TotalCount).to.greaterThan(0);
                expect(response.body.Data.BodyHeightRecords.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.BodyHeightRecords.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('61:04 -> Update body height', function(done) {
        loadBodyHeightUpdateModel();
        const updateModel = getTestData("BodyHeightUpdateModel");
        agent
            .put(`/api/v1/clinical/biometrics/body-heights/${getTestData('BodyHeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.BodyHeight).to.have.property('id');
                expect(response.body.Data.BodyHeight).to.have.property('EhrId');
                expect(response.body.Data.BodyHeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyHeight).to.have.property('BodyHeight');
                expect(response.body.Data.BodyHeight).to.have.property('Unit');
                expect(response.body.Data.BodyHeight).to.have.property('RecordDate');

                expect(response.body.Data.BodyHeight.PatientUserId).to.equal(getTestData("BodyHeightUpdateModel").PatientUserId);
                expect(response.body.Data.BodyHeight.BodyHeight).to.equal(getTestData("BodyHeightUpdateModel").BodyHeight);
                expect(response.body.Data.BodyHeight.Unit).to.equal(getTestData("BodyHeightUpdateModel").Unit);

            })
            .expect(200, done);
    });

    it('61:05 -> Delete body height', function(done) {
        
        agent
            .delete(`/api/v1/clinical/biometrics/body-heights/${getTestData('BodyHeightId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create body height again', function(done) {
        loadBodyHeightCreateModel();
        const createModel = getTestData("BodyHeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-heights`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.BodyHeight.id, 'BodyHeightId');
                expect(response.body.Data.BodyHeight).to.have.property('PatientUserId');
                expect(response.body.Data.BodyHeight).to.have.property('BodyHeight');
                expect(response.body.Data.BodyHeight).to.have.property('Unit');
                expect(response.body.Data.BodyHeight).to.have.property('RecordDate');
             
                setTestData(response.body.Data.BodyHeight.id, 'BodyHeightId');

                expect(response.body.Data.BodyHeight.PatientUserId).to.equal(getTestData("BodyHeightCreateModel").PatientUserId);
                expect(response.body.Data.BodyHeight.BodyHeight).to.equal(getTestData("BodyHeightCreateModel").BodyHeight);
                expect(response.body.Data.BodyHeight.Unit).to.equal(getTestData("BodyHeightCreateModel").Unit);
   
            })
            .expect(201, done);
    });

    it('61:06 -> Negative - Create body height', function(done) {
        loadNegativeBodyHeightCreateModel();
        const createModel = getTestData("NegativeBodyHeightCreateModel");
        agent
            .post(`/api/v1/clinical/biometrics/body-heights`)
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

    it('61:07 -> Negative - Search body height records', function(done) {
        loadBodyHeightQueryString();
        agent
            .get(`/api/v1/clinical/biometrics/body-heights/search${loadBodyHeightQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

    it('61:08 -> Negative - Delete body height', function(done) {
        
        agent
            .delete(`/api/v1/clinical/biometrics/body-heights/${getTestData('BodyHeightId_1')}`)
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

export const loadBodyHeightCreateModel = async (
) => {
    const model = {
        PatientUserId : getTestData('PatientUserId'),
        BodyHeight    : faker.number.int(200),
        Unit          : faker.string.symbol()

    };
    setTestData(model, "BodyHeightCreateModel");
};

export const loadBodyHeightUpdateModel = async (
) => {
    const model = {
        PatientUserId : getTestData('PatientUserId'),
        BodyHeight    : faker.number.int(200),
        Unit          : faker.string.symbol()
    };
    setTestData(model, "BodyHeightUpdateModel");
};

function loadBodyHeightQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeBodyHeightCreateModel = async (
) => {
    const model = {
        BodyHeight : faker.number.int(200),
        Unit       : faker.string.symbol()
    };
    setTestData(model, "NegativeBodyHeightCreateModel");
};
