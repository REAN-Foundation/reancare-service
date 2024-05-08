import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('21 - Reminder schedule quarterly', function () {
    var agent = request.agent(infra._app);

    it('21:01 -> Add quarterly reminder on a given day', function (done) {
        loadReminderQuarterCreateModel();
        const createModel = getTestData('reminderQuarterCreateModel');
        agent
            .post(`/api/v1/reminders/repeat-every-quarter-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setReminderId(response, 'reminderQuarterId');
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(201, done);
    });

    it('21:02 -> Get quarterly reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderQuarterId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expectReminderProperties(response);

                expectReminderPropertyValues(response);
            })
            .expect(200, done);
    });

    it('21:03 -> Negative - Add quarterly reminder on a given day', function (done) {
        loadReminderQuarterCreateModel();
        const createModel = getTestData('reminderQuarterCreate');
        agent
            .post(`/api/v1/reminders/repeat-every-quarter-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

    it('21:04 -> Negative - Get quarterly reminder by id', function (done) {
        agent
            .get(`/api/v1/reminders/${getTestData('reminderQuarterId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
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
    expect(response.body.Data.Reminder).to.have.property('WhenTime');
    expect(response.body.Data.Reminder).to.have.property('HookUrl');
    expect(response.body.Data.Reminder).to.have.property('StartDate');
    expect(response.body.Data.Reminder).to.have.property('EndDate');
    expect(response.body.Data.Reminder).to.have.property('EndAfterNRepetitions');
}

function expectReminderPropertyValues(response) {
    expect(response.body.Data.Reminder.UserId).to.equal(getTestData('reminderQuarterCreateModel').UserId);
    expect(response.body.Data.Reminder.Name).to.equal(getTestData('reminderQuarterCreateModel').Name);
    expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData('reminderQuarterCreateModel').WhenTime);
    expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData('reminderQuarterCreateModel').HookUrl);
    expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(
        getTestData('reminderQuarterCreateModel').EndAfterNRepetitions
    );
}

export const loadReminderQuarterCreateModel = async () => {
    const model = {
        UserId: getTestData('patientUserId'),
        Name: faker.person.fullName(),
        WhenTime: '12:10:12',
        HookUrl: faker.internet.url(),
        StartDate: startDate,
        EndDate: endDate,
        EndAfterNRepetitions: faker.number.int({ max: 200 }),
        NotificationType: 'SMS',
    };
    setTestData(model, 'reminderQuarterCreateModel');
};
