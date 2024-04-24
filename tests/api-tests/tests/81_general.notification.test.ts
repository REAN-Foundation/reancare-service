import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { NotificationChannel, NotificationTarget, NotificationType } from '../../../src/domain.types/general/notification/notification.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('81 - Notification tests', function() {

    var agent = request.agent(infra._app);

    it('81:01 -> Create Notification', function(done) {
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
                expect(response.body.Data.Notification).to.have.property('Target');
                expect(response.body.Data.Notification).to.have.property('Type');
                expect(response.body.Data.Notification).to.have.property('Channel');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Payload');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('CreatedByUserId');

                setTestData(response.body.Data.Notification.id, 'NotificationId_1');

                expect(response.body.Data.Notification.Target).to.equal(getTestData("NotificationCreateModel").Target);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);
                expect(response.body.Data.Notification.Channel).to.equal(getTestData("NotificationCreateModel").Channel);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Payload).to.equal(getTestData("NotificationCreateModel").Payload);
                expect(response.body.Data.Notification.CreatedByUserId).to.equal(getTestData("NotificationCreateModel").CreatedByUserId);
            })
            .expect(201, done);
    });

    it('81:02 -> Get Notification by id', function(done) {

        agent
            .get(`/api/v1/general/notifications/${getTestData('NotificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('Target');
                expect(response.body.Data.Notification).to.have.property('Type');
                expect(response.body.Data.Notification).to.have.property('Channel');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Payload');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('CreatedByUserId');

                expect(response.body.Data.Notification.Target).to.equal(getTestData("NotificationCreateModel").Target);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);
                expect(response.body.Data.Notification.Channel).to.equal(getTestData("NotificationCreateModel").Channel);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Payload).to.equal(getTestData("NotificationCreateModel").Payload);
                expect(response.body.Data.Notification.CreatedByUserId).to.equal(getTestData("NotificationCreateModel").CreatedByUserId);
            })
            .expect(200, done);
    });

    it('81:03 -> Search records', function(done) {
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

    it('81:04 -> Send Notification', function(done) {

        agent
            .post(`/api/v1/general/notifications/${getTestData('NotificationId_1')}/send`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('81:05 -> Mark As Read', function(done) {
        loadMarkUpdateModel();
        const updateModel = getTestData("MarkUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId_1')}/mark-as-read/${getTestData("PatientUserId")}`)
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

    it('81:06 -> Update Notification', function(done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData("NotificationUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Notification).to.have.property('Target');
                expect(response.body.Data.Notification).to.have.property('Type');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Payload');
                expect(response.body.Data.Notification).to.have.property('SentOn');

                expect(response.body.Data.Notification.Target).to.equal(getTestData("NotificationUpdateModel").Target);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationUpdateModel").Type);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationUpdateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationUpdateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationUpdateModel").ImageUrl);
                expect(response.body.Data.Notification.Payload).to.equal(getTestData("NotificationUpdateModel").Payload);

            })
            .expect(200, done);
    });

    it('81:07 -> Delete Notification', function(done) {

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
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Notification.id, 'NotificationId');
                expect(response.body.Data.Notification).to.have.property('Target');
                expect(response.body.Data.Notification).to.have.property('Type');
                expect(response.body.Data.Notification).to.have.property('Channel');
                expect(response.body.Data.Notification).to.have.property('Title');
                expect(response.body.Data.Notification).to.have.property('Body');
                expect(response.body.Data.Notification).to.have.property('ImageUrl');
                expect(response.body.Data.Notification).to.have.property('Payload');
                expect(response.body.Data.Notification).to.have.property('SentOn');
                expect(response.body.Data.Notification).to.have.property('CreatedByUserId');

                setTestData(response.body.Data.Notification.id, 'NotificationId');

                expect(response.body.Data.Notification.Target).to.equal(getTestData("NotificationCreateModel").Target);
                expect(response.body.Data.Notification.Type).to.equal(getTestData("NotificationCreateModel").Type);
                expect(response.body.Data.Notification.Channel).to.equal(getTestData("NotificationCreateModel").Channel);
                expect(response.body.Data.Notification.Title).to.equal(getTestData("NotificationCreateModel").Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData("NotificationCreateModel").Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData("NotificationCreateModel").ImageUrl);
                expect(response.body.Data.Notification.Payload).to.equal(getTestData("NotificationCreateModel").Payload);
                expect(response.body.Data.Notification.CreatedByUserId).to.equal(getTestData("NotificationCreateModel").CreatedByUserId);

            })
            .expect(201, done);
    });

    it('81:08 -> Negative - Create Notification', function(done) {
        loadNotificationCreateModel();
        const createModel = getTestData("NotificationCreateModel");
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('81:09 -> Negative - Get Notification by id', function(done) {

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

    it('81:10 -> Negative - Mark As Read', function(done) {
        loadMarkUpdateModel();
        const updateModel = getTestData("MarkUpdateModel");
        agent
            .put(`/api/v1/general/notifications/${getTestData('NotificationId')}/mark-as-read/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
                
            })
            .expect(401, done);
    });

    it('81:11 -> Negative - Update Notification', function(done) {
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
) => {
    const model = {
        Target          : getRandomEnumValue(NotificationTarget),
        Type            : getRandomEnumValue(NotificationType),
        Channel         : getRandomEnumValue(NotificationChannel),
        Title           : faker.lorem.word(15),
        Body            : faker.lorem.word(15),
        ImageUrl        : faker.image.url(),
        Payload         : faker.lorem.word(5),
        SentOn          : faker.date.past(),
        CreatedByUserId : getTestData("PatientUserId"),
        
    };
    setTestData(model, "NotificationCreateModel");
};

export const loadMarkUpdateModel = async (
) => {
    const model = {
        ReadOn : faker.date.past()
    };
    setTestData(model, "MarkUpdateModel");
};

export const loadNotificationUpdateModel = async (
) => {
    const model = {
        Target          : getRandomEnumValue(NotificationTarget),
        Type            : getRandomEnumValue(NotificationType),
        Title           : faker.lorem.word(15),
        Body            : faker.lorem.word(15),
        ImageUrl        : faker.image.url(),
        Payload         : faker.lorem.word(5),
        SentOn          : faker.date.past(),

    };
    setTestData(model, "NotificationUpdateModel");
};

function loadNotificationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
