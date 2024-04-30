import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import {
    NotificationChannel,
    NotificationTarget,
    NotificationType,
} from '../../../src/domain.types/general/notification/notification.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('81 - Notification tests', function () {
    var agent = request.agent(infra._app);

    it('81:01 -> Create Notification', function (done) {
        loadNotificationCreateModel();
        const createModel = getTestData('notificationCreateModel');
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('adminJwt')}`)
            .send(createModel)
            .expect((response) => {
                setNotificationId(response, 'notificationId_1');
                expectNotificationProperties(response);

                expectNotificationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('81:02 -> Get Notification by id', function (done) {
        agent
            .get(`/api/v1/general/notifications/${getTestData('notificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectNotificationProperties(response);

                expectNotificationPropertyValues(response);
            })
            .expect(200, done);
    });

    it('81:03 -> Search records', function (done) {
        loadNotificationQueryString();
        agent
            .get(`/api/v1/general/notifications/search${loadNotificationQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('81:04 -> Send Notification', function (done) {
        agent
            .post(`/api/v1/general/notifications/${getTestData('notificationId_1')}/send`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('81:05 -> Mark As Read', function (done) {
        loadMarkUpdateModel();
        const updateModel = getTestData('markUpdateModel');
        agent
            .put(
                `/api/v1/general/notifications/${getTestData('notificationId_1')}/mark-as-read/${getTestData(
                    'patientUserId'
                )}`
            )
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
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

    it('81:06 -> Update Notification', function (done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData('notificationUpdateModel');
        agent
            .put(`/api/v1/general/notifications/${getTestData('notificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expectNotificationProperties(response);

                expect(response.body.Data.Notification.Target).to.equal(getTestData('notificationUpdateModel').Target);
                expect(response.body.Data.Notification.Type).to.equal(getTestData('notificationUpdateModel').Type);
                expect(response.body.Data.Notification.Title).to.equal(getTestData('notificationUpdateModel').Title);
                expect(response.body.Data.Notification.Body).to.equal(getTestData('notificationUpdateModel').Body);
                expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData('notificationUpdateModel').ImageUrl);
                expect(response.body.Data.Notification.Payload).to.equal(getTestData('notificationUpdateModel').Payload);
            })
            .expect(200, done);
    });

    it('81:07 -> Delete Notification', function (done) {
        agent
            .delete(`/api/v1/general/notifications/${getTestData('notificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create Notification again', function (done) {
        loadNotificationCreateModel();
        const createModel = getTestData('notificationCreateModel');
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setNotificationId(response, 'notificationId');
                expectNotificationProperties(response);

                expectNotificationPropertyValues(response);
            })
            .expect(201, done);
    });

    it('81:08 -> Negative - Create Notification', function (done) {
        loadNotificationCreateModel();
        const createModel = getTestData('notificationCreateModel');
        agent
            .post(`/api/v1/general/notifications/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('81:09 -> Negative - Get Notification by id', function (done) {
        agent
            .get(`/api/v1/general/notifications/${getTestData('notificationId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('81:10 -> Negative - Mark As Read', function (done) {
        loadMarkUpdateModel();
        const updateModel = getTestData('markUpdateModel');
        agent
            .put(
                `/api/v1/general/notifications/${getTestData('notificationId')}/mark-as-read/${getTestData('PatientUserId')}`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(updateModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('81:11 -> Negative - Update Notification', function (done) {
        loadNotificationUpdateModel();
        const updateModel = getTestData('notificationUpdateModel');
        agent
            .put(`/api/v1/general/notifications/${getTestData('notificationId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(updateModel)

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setNotificationId(response, key) {
    setTestData(response.body.Data.Notification.id, key);
}

function expectNotificationProperties(response) {
    expect(response.body.Data.Notification).to.have.property('Target');
    expect(response.body.Data.Notification).to.have.property('Type');
    expect(response.body.Data.Notification).to.have.property('Channel');
    expect(response.body.Data.Notification).to.have.property('Title');
    expect(response.body.Data.Notification).to.have.property('Body');
    expect(response.body.Data.Notification).to.have.property('ImageUrl');
    expect(response.body.Data.Notification).to.have.property('Payload');
    expect(response.body.Data.Notification).to.have.property('SentOn');
    expect(response.body.Data.Notification).to.have.property('CreatedByUserId');
}

function expectNotificationPropertyValues(response) {
    expect(response.body.Data.Notification.Target).to.equal(getTestData('notificationCreateModel').Target);
    expect(response.body.Data.Notification.Type).to.equal(getTestData('notificationCreateModel').Type);
    expect(response.body.Data.Notification.Channel).to.equal(getTestData('notificationCreateModel').Channel);
    expect(response.body.Data.Notification.Title).to.equal(getTestData('notificationCreateModel').Title);
    expect(response.body.Data.Notification.Body).to.equal(getTestData('notificationCreateModel').Body);
    expect(response.body.Data.Notification.ImageUrl).to.equal(getTestData('notificationCreateModel').ImageUrl);
    expect(response.body.Data.Notification.Payload).to.equal(getTestData('notificationCreateModel').Payload);
    expect(response.body.Data.Notification.CreatedByUserId).to.equal(getTestData('notificationCreateModel').CreatedByUserId);
}

export const loadNotificationCreateModel = async () => {
    const model = {
        Target: getRandomEnumValue(NotificationTarget),
        Type: getRandomEnumValue(NotificationType),
        Channel: getRandomEnumValue(NotificationChannel),
        Title: faker.lorem.word(15),
        Body: faker.lorem.word(15),
        ImageUrl: faker.image.url(),
        Payload: faker.lorem.word(5),
        SentOn: faker.date.past(),
        CreatedByUserId: getTestData('patientUserId'),
    };
    setTestData(model, 'notificationCreateModel');
};

export const loadMarkUpdateModel = async () => {
    const model = {
        ReadOn: faker.date.past(),
    };
    setTestData(model, 'markUpdateModel');
};

export const loadNotificationUpdateModel = async () => {
    const model = {
        Target: getRandomEnumValue(NotificationTarget),
        Type: getRandomEnumValue(NotificationType),
        Title: faker.lorem.word(15),
        Body: faker.lorem.word(15),
        ImageUrl: faker.image.url(),
        Payload: faker.lorem.word(5),
        SentOn: faker.date.past(),
    };
    setTestData(model, 'notificationUpdateModel');
};

function loadNotificationQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
