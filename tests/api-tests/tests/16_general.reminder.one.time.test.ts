import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { futureDateString } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('16 - One time reminder tests', function () {
    var agent = request.agent(infra._app);

    it('16:01 -> Create One time reminder', function (done) {
        loadOneTimeReminderCreateModel();
        const createModel = getTestData('oneTimeReminderCreateModel');
        agent
            .post(`/api/v1/reminders/one-time/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'oneTimeReminderId_1');
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('16:02 -> Get One time reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('oneTimeReminderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(200, done);
    });

    it('16:03 -> Search One time reminder records', function (done) {
        loadOneTimeReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadOneTimeReminderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body.Data.Reminders).to.have.property('TotalCount');
                expect(response.body.Data.Reminders).to.have.property('RetrievedCount');
                expect(response.body.Data.Reminders).to.have.property('PageIndex');
                expect(response.body.Data.Reminders).to.have.property('ItemsPerPage');
                expect(response.body.Data.Reminders).to.have.property('Order');
                expect(response.body.Data.Reminders.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Reminders.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Reminders.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('16:04 -> Delete One time reminder', function (done) {
        agent
            .delete(`/api/v1/reminders/${getTestData('oneTimeReminderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create One time reminder again', function (done) {
        loadOneTimeReminderCreateModel();
        const createModel = getTestData('oneTimeReminderCreateModel');
        agent
            .post(`/api/v1/reminders/one-time/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'oneTimeReminderId');
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('16:05 -> Negative - Create One time reminder', function (done) {
        loadNegativeOneTimeReminderCreateModel();
        const createModel = getTestData('negativeOneTimeReminderCreateModel');
        agent
            .post(`/api/v1/reminders/one-time/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('16:06 -> Negative - Get One time reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('oneTimeReminderId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('16:07 -> Negative - Delete One time reminder', function (done) {
        agent
            .delete(`/api/v1/reminders/${getTestData('oneTimeReminderId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setReminderId(response, key) {
    setTestData(response.body.Data.Reminder.id, key);
}

function expectReminderProperties(response) {
    expect(response.body.Data.Reminder).to.have.property('id');
    expect(response.body.Data.Reminder).to.have.property('UserId');
    expect(response.body.Data.Reminder).to.have.property('Name');
    expect(response.body.Data.Reminder).to.have.property('WhenDate');
    expect(response.body.Data.Reminder).to.have.property('WhenTime');
    expect(response.body.Data.Reminder).to.have.property('HookUrl');
}

function expectReminderPropertyValues(response) {
    expect(response.body.Data.Reminder.UserId).to.equal(getTestData('oneTimeReminderCreateModel').UserId);
    expect(response.body.Data.Reminder.Name).to.equal(getTestData('oneTimeReminderCreateModel').Name);
    expect(response.body.Data.Reminder.WhenDate).to.equal(getTestData('oneTimeReminderCreateModel').WhenDate);
    expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('oneTimeReminderCreateModel').WhenTime);
    expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('oneTimeReminderCreateModel').HookUrl);
}

export const loadOneTimeReminderCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenDate: futureDateString,
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        NotificationType: 'SMS',
    };
    setTestData(model, 'oneTimeReminderCreateModel');
};

function loadOneTimeReminderQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeOneTimeReminderCreateModel = async () => {
    const model = {
        Name: faker.person.fullName(),
        WhenDate: futureDateString,
        WhenTime: faker.date.anytime(),
        HookUrl: faker.internet.url(),
        NotificationType: 'SMS',
    };
    setTestData(model, 'negativeOneTimeReminderCreateModel');
};
