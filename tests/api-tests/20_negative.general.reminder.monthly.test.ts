import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Reminder schedule monthly', function() {

    var agent = request.agent(infra._app);

    it('47 - Negative - Add monthly reminder on certain day', function(done) {
        loadReminderCertainMonthCreateModel();
        const createModel = getTestData("ReminderCertainMonthCreate");
        agent
            .post(`/api/v1/reminders/repeat-every-month-on/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
      
            })
            .expect(422, done);
    });

    it('48 - Negative - Get monthly reminder by id', function(done) {
    
        agent
            .get(`/api/v1/reminders/${getTestData('ReminderMonthId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderMonthCreateModel = async (
) => {
    const model = {
        UserId               : getTestData("PatientUserId"),
        Name                 : "Drink Water",
        WhenTime             : "13:34:12",
        HookUrl              : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        StartDate            : "2023-11-12T00:00:00.000Z",
        EndDate              : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions : 10,
        NotificationType     : "SMS"
  
    };
    setTestData(model, "ReminderMonthCreateModel");
};

export const loadReminderCertainMonthCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Month",
        StartDate             : "2023-11-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 5,
        RepeatList            : [
            "First-Wednesday",
            "Last-Friday",
            "Second-Saturday"
        ],
        NotificationType : "SMS"
    
    };
    setTestData(model, "ReminderCertainMonthCreateModel");
};
