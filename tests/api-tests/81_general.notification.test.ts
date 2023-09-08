import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('81 - Notification tests', function() {

    var agent = request.agent(infra._app);

    it('81 - 01 - Create Notification', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notification.id, 'NotificationId_1');
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                setTestData(response.body.Data.Notification.id, 'NotificationId_1');

                expect(response.body.Data.Notification.UserId).to.equal(getTestData("NotificationCreateModel").UserId);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);
            })
            .expect(201, done);
    });

    it('81 - 02 - Get Notification by id', function(done) {

        agent
            .get(`/api/v1/general/notifications/${getTestData('NotificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                expect(response.body.Data.Notification.UserId).to.equal(getTestData("NotificationCreateModel").UserId);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);
            })
            .expect(200, done);
    });

    it('81 - 03 - Search records', function(done) {
        loadNotificationQueryString();
        agent
            .get(`/api/v1/general/notifications/search${loadNotificationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('81 - 04 - Mark As Read', function(done) {
        loadMarkUpdateModel();
        const updateModel = getTestData("MarkUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId_1')}/mark-as-read`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('ReadOn');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');
            })
            .expect(200, done);
    });

    it('81 - 05 - Update Notification', function(done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData("NotificationUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationUpdateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationUpdateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationUpdateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationUpdateModel").Type);

            })
            .expect(200, done);
    });

    it('81 - 06 - Delete Notification', function(done) {

        agent
            .delete(`/api/v1/general/notifications/${getTestData('NotificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Notification again', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notification.id, 'NotificationId');
                expect(response.body.Data.Notification).to.have.property('UserId');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Type');

                setTestData(response.body.Data.Notification.id, 'NotificationId');

                expect(response.body.Data.Notification.UserId).to.equal(getTestData("NotificationCreateModel").UserId);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);

            })
            .expect(201, done);
    });

    it('81 - 01 - Negative - Create Notification', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('81 - 02 - Negative - Get Notification by id', function(done) {

        agent
            .get(`/api/v1/general/notifications/${getTestData('NotificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('81 - 03 - Negative - Mark As Read', function(done) {
        loadMarkUpdateModel();
        const updateModel = getTestData("MarkUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}/mark-as-read`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(403, done);
    });

    it('81 - 04 - Negative - Update Notification', function(done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData("NotificationUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)

            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
            
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadNotificationCreateModel = async (
    Title = faker.lorem.word(15),
    Body = faker.lorem.word(15),
    sentOn = faker.date.past(),
    imageUrl = faker.image.url(),
    Type = faker.lorem.word()
) => {
    const model = {
        UserId   : getTestData("PatientUserId"),
        Title    : Title,
        Body     : Body,
        SentOn   : sentOn,
        ImageUrl : imageUrl,
        Type     : Type
  
    };
    setTestData(model, "NotificationCreateModel");
};

export const loadMarkUpdateModel = async (
    readOn = faker.date.past(),
) => {
    const model = {
        ReadOn : readOn
    };
    setTestData(model, "MarkUpdateModel");
};

export const loadNotificationUpdateModel = async (
    Title = faker.lorem.word(15),
    Body = faker.lorem.word(15),
    sentOn = faker.date.past(),
    imageUrl = faker.image.url(),
    Type = faker.lorem.word()
) => {
    const model = {
        Title    : Title,
        Body     : Body,
        SentOn   : sentOn,
        ImageUrl : imageUrl,
        Type     : Type
    };
    setTestData(model, "NotificationUpdateModel");
};

function loadNotificationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
