import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('46 - Emergency event tests', function() {

    var agent = request.agent(infra._app);

    it('46:01 -> Create emergency event', function(done) {
        loadEmergencyEventCreateModel();
        const createModel = getTestData("EmergencyEventCreateModel");
        agent
            .post(`/api/v1/clinical/emergency-events/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.EmergencyEvent.id, 'EmergencyEventId_1');
                expect(response.body.Data.EmergencyEvent).to.have.property('id');
                expect(response.body.Data.EmergencyEvent).to.have.property('EhrId');
                expect(response.body.Data.EmergencyEvent).to.have.property('Details');
                expect(response.body.Data.EmergencyEvent).to.have.property('EmergencyDate');

                setTestData(response.body.Data.EmergencyEvent.id, 'EmergencyEventId_1');

                expect(response.body.Data.EmergencyEvent.EhrId).to.equal(getTestData("EmergencyEventCreateModel").EhrId);
                expect(response.body.Data.EmergencyEvent.Details).to.equal(getTestData("EmergencyEventCreateModel").Details);

            })
            .expect(201, done);
    });

    it('46:02 -> Get emergency event by id', function(done) {

        agent
            .get(`/api/v1/clinical/emergency-events/${getTestData('EmergencyEventId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.EmergencyEvent).to.have.property('id');
                expect(response.body.Data.EmergencyEvent).to.have.property('EhrId');
                expect(response.body.Data.EmergencyEvent).to.have.property('Details');
                expect(response.body.Data.EmergencyEvent).to.have.property('EmergencyDate');

                expect(response.body.Data.EmergencyEvent.EhrId).to.equal(getTestData("EmergencyEventCreateModel").EhrId);
                expect(response.body.Data.EmergencyEvent.Details).to.equal(getTestData("EmergencyEventCreateModel").Details);

            })
            .expect(200, done);
    });

    it('46:03 -> Search emergency event records', function(done) {
        loadEmergencyEventQueryString();
        agent
            .get(`/api/v1/clinical/emergency-events/search${loadEmergencyEventQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.EmergencyEvents).to.have.property('TotalCount');
                expect(response.body.Data.EmergencyEvents).to.have.property('RetrievedCount');
                expect(response.body.Data.EmergencyEvents).to.have.property('PageIndex');
                expect(response.body.Data.EmergencyEvents).to.have.property('ItemsPerPage');
                expect(response.body.Data.EmergencyEvents).to.have.property('Order');
                expect(response.body.Data.EmergencyEvents.TotalCount).to.greaterThan(0);
                expect(response.body.Data.EmergencyEvents.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.EmergencyEvents.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('46:04 -> Update emergency event', function(done) {
        loadEmergencyEventUpdateModel();
        const updateModel = getTestData("EmergencyEventUpdateModel");
        agent
            .put(`/api/v1/clinical/emergency-events/${getTestData('EmergencyEventId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.EmergencyEvent).to.have.property('id');
                expect(response.body.Data.EmergencyEvent).to.have.property('EhrId');
                expect(response.body.Data.EmergencyEvent).to.have.property('Details');
                expect(response.body.Data.EmergencyEvent).to.have.property('EmergencyDate');

                expect(response.body.Data.EmergencyEvent.EhrId).to.equal(getTestData("EmergencyEventUpdateModel").EhrId);
                expect(response.body.Data.EmergencyEvent.Details).to.equal(getTestData("EmergencyEventUpdateModel").Details);

            })
            .expect(200, done);
    });

    it('46:05 -> Delete emergency event', function(done) {
        
        agent
            .delete(`/api/v1/clinical/emergency-events/${getTestData('EmergencyEventId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });
  
    it('Create emergency event again', function(done) {
        loadEmergencyEventCreateModel();
        const createModel = getTestData("EmergencyEventCreateModel");
        agent
            .post(`/api/v1/clinical/emergency-events/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.EmergencyEvent.id, 'EmergencyEventId');
                expect(response.body.Data.EmergencyEvent).to.have.property('id');
                expect(response.body.Data.EmergencyEvent).to.have.property('EhrId');
                expect(response.body.Data.EmergencyEvent).to.have.property('Details');
                expect(response.body.Data.EmergencyEvent).to.have.property('EmergencyDate');

                setTestData(response.body.Data.EmergencyEvent.id, 'EmergencyEventId');

                expect(response.body.Data.EmergencyEvent.EhrId).to.equal(getTestData("EmergencyEventCreateModel").EhrId);
                expect(response.body.Data.EmergencyEvent.Details).to.equal(getTestData("EmergencyEventCreateModel").Details);

            })
            .expect(201, done);
    });

    it('46:06 -> Negative - Create emergency event', function(done) {
        loadEmergencyEventCreateModel();
        const createModel = getTestData("EmergencyEventCreateModel");
        agent
            .post(`/api/v1/clinical/emergency-events/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('46:07 -> Negative - Search emergency event records', function(done) {
        loadEmergencyEventQueryString();
        agent
            .get(`/api/v1/clinical/emergency-events/search${loadEmergencyEventQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('46:08 -> Negative - Delete emergency event', function(done) {
        
        agent
            .delete(`/api/v1/clinical/emergency-events/${getTestData('EmergencyEventId_1')}`)
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

export const loadEmergencyEventCreateModel = async (
) => {
    const model = {
        EhrId         : faker.string.uuid(),
        PatientUserId : getTestData("PatientUserId"),
        Details       : faker.lorem.words(10),
        EmergencyDate : faker.date.anytime()
  
    };
    setTestData(model, "EmergencyEventCreateModel");
};

export const loadEmergencyEventUpdateModel = async (
) => {
    const model = {
        EhrId         : faker.string.uuid(),
        PatientUserId : getTestData("PatientUserId"),
        Details       : faker.lorem.words(10),
        EmergencyDate : faker.date.anytime()

    };
    setTestData(model, "EmergencyEventUpdateModel");
};

function loadEmergencyEventQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
