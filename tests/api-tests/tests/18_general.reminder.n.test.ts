import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { RepeatAfterEveryNUnit } from '../../../src/domain.types/general/reminder/reminder.domain.model';
import { endDate, getRandomEnumValue, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('18 - Reminder schedule every n tests', function() {

    var agent = request.agent(infra._app);

    it('18:01 -> Add reminder which repeats after every 10 days', function(done) {
        loadReminderTenDaysCreateModel();
        const createModel = getTestData("ReminderTenDaysCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderTenDayId');
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

                setTestData(response.body.Data.Reminder.id, 'ReminderTenDayId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderTenDaysCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderTenDaysCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderTenDaysCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderTenDaysCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderTenDaysCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderTenDaysCreateModel").EndAfterNRepetitions);
        
            })
            .expect(201, done);
    });

    it('18:02 -> Add reminder which repeats after every 3 months', function(done) {
        loadReminderThreeMonthsCreateModel();
        const createModel = getTestData("ReminderThreeMonthsCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderThreeMonthId');
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

                setTestData(response.body.Data.Reminder.id, 'ReminderThreeMonthId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderThreeMonthsCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderThreeMonthsCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderThreeMonthsCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderThreeMonthsCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderThreeMonthsCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderThreeMonthsCreateModel").EndAfterNRepetitions);
      
            })
            .expect(201, done);
    });

    it('18:03 -> Add reminder which repeats after every 2 quarters', function(done) {
        loadReminderTwoQuartersCreateModel();
        const createModel = getTestData("ReminderTwoQuartersCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderTwoQuarterId');
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

                setTestData(response.body.Data.Reminder.id, 'ReminderTwoQuarterId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderTwoQuartersCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderTwoQuartersCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderTwoQuartersCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderTwoQuartersCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderTwoQuartersCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderTwoQuartersCreateModel").EndAfterNRepetitions);
    
            })
            .expect(201, done);
    });

    it('18:04 -> Add reminder which repeats after every 2 years', function(done) {
        loadReminderTwoYearsCreateModel();
        const createModel = getTestData("ReminderTwoYearsCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Reminder.id, 'ReminderTwoYearId');
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

                setTestData(response.body.Data.Reminder.id, 'ReminderTwoYearId');

                expect(response.body.Data.Reminder.UserId).to.equal(getTestData("ReminderTwoYearsCreateModel").UserId);
                expect(response.body.Data.Reminder.Name).to.equal(getTestData("ReminderTwoYearsCreateModel").Name);
                expect(response.body.Data.Reminder.WhenTime).to.equal(getTestData("ReminderTwoYearsCreateModel").WhenTime);
                expect(response.body.Data.Reminder.HookUrl).to.equal(getTestData("ReminderTwoYearsCreateModel").HookUrl);
                expect(response.body.Data.Reminder.RepeatAfterEvery).to.equal(getTestData("ReminderTwoYearsCreateModel").RepeatAfterEvery);
                expect(response.body.Data.Reminder.EndAfterNRepetitions).to.equal(getTestData("ReminderTwoYearsCreateModel").EndAfterNRepetitions);
  
            })
            .expect(201, done);
    });

    it('18:05 -> Negative - Add reminder which repeats after every 10 days', function(done) {
        loadReminderTenDaysCreateModel();
        const createModel = getTestData("ReminderTenDaysCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("DoctorJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
        
            })
            .expect(403, done);
    });

    it('18:06 -> Negative - Add reminder which repeats after every 2 quarters', function(done) {
        loadReminderTwoQuartersCreateModel();
        const createModel = getTestData("ReminderTwoQuartersCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
    
            })
            .expect(401, done);
    });

    it('18:07 -> Negative - Add reminder which repeats after every 2 years', function(done) {
        loadReminderTwoYearsCreateModel();
        const createModel = getTestData("ReminderTwoYearsCreateModel");
        agent
            .post(`/api/v1/reminders/repeat-after-every-n/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
  
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderTenDaysCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : faker.person.fullName(),
        WhenTime              : "12:10:12",
        HookUrl               : faker.internet.url(),
        RepeatAfterEvery      : faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit : getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : faker.number.int({ max: 200 }),
        NotificationType      : "SMS"
  
    };
    setTestData(model, "ReminderTenDaysCreateModel");
};

export const loadReminderThreeMonthsCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : faker.person.fullName(),
        WhenTime              : "12:10:12",
        HookUrl               : faker.internet.url(),
        RepeatAfterEvery      : faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit : 'Hour',
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : faker.number.int({ max: 200 }),
        NotificationType      : "SMS"
    
    };
    setTestData(model, "ReminderThreeMonthsCreateModel");
};

export const loadReminderTwoQuartersCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : faker.person.fullName(),
        WhenTime              : "12:10:12" ,
        HookUrl               : faker.internet.url(),
        RepeatAfterEvery      : faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit : getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : faker.number.int({ max: 200 }),
        NotificationType      : "SMS"
      
    };
    setTestData(model, "ReminderTwoQuartersCreateModel");
};

export const loadReminderTwoYearsCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : faker.person.fullName(),
        WhenTime              : "12:10:12",
        HookUrl               : faker.internet.url(),
        RepeatAfterEvery      : faker.number.int({ min: 2, max: 5 }),
        RepeatAfterEveryNUnit : getRandomEnumValue(RepeatAfterEveryNUnit),
        StartDate             : startDate,
        EndDate               : endDate,
        EndAfterNRepetitions  : faker.number.int({ max: 200 }),
        NotificationType      : "SMS"
        
    };
    setTestData(model, "ReminderTwoYearsCreateModel");
};

