import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { RepeatAfterEveryNUnit } from '../../../src/domain.types/general/reminder/reminder.domain.model';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('17 - Reminder schedule every 3 hours tests', function () {
    var agent = request.agent(infra._app);

    it('17:01 -> Create reminder every 3 hours', function (done) {
        loadReminderCreateModel();
        const createModel = getTestData('reminderCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminder3HourId_1');
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('17:02 -> Get reminder every 3 hours by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminder3HourId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(200, done);
    });

    it('17:03 -> Search reminder every 3 hours records', function (done) {
        loadReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadReminderQueryString()}`)
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

    it('17:04 -> Delete reminder every 3 hours', function (done) {
        agent
            .delete(`/api/v1/reminders/${getTestData('reminder3HourId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('Create reminder every 3 hours again', function (done) {
        loadReminderCreateModel();
        const createModel = getTestData('reminderCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminder3HourId');
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('17:05 -> Negative - Create reminder every 3 hours', function (done) {
        loadReminderCreateModel();
        const createModel = getTestData('reminderCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('17:06 -> Negative - Search reminder every 3 hours records', function (done) {
        loadReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadReminderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('17:07 -> Negative - Delete reminder every 3 hours', function (done) {
        agent
            .delete(`/api/v1/reminders/${getTestData('reminder3HourId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
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
    expect(response.body.Data.Reminder).to.have.property('WhenTime');
    expect(response.body.Data.Reminder).to.have.property('HookUrl');
    expect(response.body.Data.Reminder).to.have.property('RepeatAfterEvery');
    expect(response.body.Data.Reminder).to.have.property('RepeatAfterEveryNUnit');
    expect(response.body.Data.Reminder).to.have.property('StartDate');
    expect(response.body.Data.Reminder).to.have.property('EndDate');
    expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');
}

function expectReminderPropertyValues(response) {
    expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderCreateModel').UserId);
    expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderCreateModel').Name);
    expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderCreateModel').WhenTime);
    expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderCreateModel').HookUrl);
    expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData('reminderCreateModel').RepeatAfterEvery);
    expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
        getTestData('reminderCreateModel').EndAfterNRepetitions
    );
}

export const loadReminderCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        RepeatAfterEvery: faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit: getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int(200),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderCreateModel');
};

function loadReminderQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}
