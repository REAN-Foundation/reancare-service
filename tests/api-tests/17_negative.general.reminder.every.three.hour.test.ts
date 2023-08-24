import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative Reminder schedule every 3 hours tests', function() {

    var agent = request.agent(infra._app);

    it('39 - Negative - Create reminder every 3 hours', function(done) {
        loadReminderCreateModel();
        const createModel = getTestData("ReminderCreateModel");
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

    it('40 - Negative - Search reminder every 3 hours records', function(done) {
        loadReminderQueryString();
        agent
            .get(`/api/v1/reminders/search${loadReminderQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('41 - Negative - Delete reminder every 3 hours', function(done) {
      
        agent
            .delete(`/api/v1/reminders/${getTestData('Reminder3Hour')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(500, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadReminderCreateModel = async (
) => {
    const model = {
        UserId                : getTestData("PatientUserId"),
        Name                  : "Drink Water",
        WhenTime              : "13:34:12",
        HookUrl               : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        RepeatAfterEvery      : 3,
        RepeatAfterEveryNUnit : "Hour",
        StartDate             : "2023-10-12T00:00:00.000Z",
        EndDate               : "2024-08-25T00:00:00.000Z",
        EndAfterNRepetitions  : 100,
        NotificationType      : "SMS"
  
    };
    setTestData(model, "ReminderCreateModel");
};

function loadReminderQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?createdDateFrom=2023-10-12';
    return queryString;
}
