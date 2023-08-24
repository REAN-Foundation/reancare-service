import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Negative One time reminder tests', function() {

    var agent = request.agent(infra._app);

    it('36 - Negative - Create One time reminder', function(done) {
        loadOneTimeReminderCreateModel();
        const createModel = getTestData("OneTimeReminderCreateModel");
        agent
            .post(`/api/v1/reminders/one-time/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93P0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(403, done);
    });

    it('37 - Negative - Get One time reminder by id', function(done) {
        agent
            .get(`/api/v1/reminders/${getTestData('OneTimeReminder')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(500, done);
    });

    it('38 - Negative - Delete One time reminder', function(done) {
       
        agent
            .delete(`/api/v1/reminders/${getTestData('OneTimeReminderId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadOneTimeReminderCreateModel = async (
) => {
    const model = {
        UserId           : getTestData("PatientUserId"),
        Name             : "Bring milk from shop",
        WhenDate         : "2024-07-30",
        WhenTime         : "13:34:12",
        HookUrl          : "https://api.weatherstack.com/current?access_key=93fdf8204559b90ec79466809edb7aad&query=Pune",
        NotificationType : "SMS"

    };
    setTestData(model, "OneTimeReminderCreateModel");
};
