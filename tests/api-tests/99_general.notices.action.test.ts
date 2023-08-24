import  request  from 'supertest';
import { expect } from 'chai';
import Application from '../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('Notice Action tests', function() {

    var agent = request.agent(infra._app);

    it('447 - Take action over notice', function(done) {
        loadNoticeActionCreateModel();
        const createModel = getTestData("NoticeActionCreateModel");
        agent
            .post(`/api/v1/general/notices/${getTestData("NoticeId")}/users/${getTestData("PatientUserId")}/take-action`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.NoticeAction.id, 'NoticeActionId');
                expect(response.body.Data.NoticeAction).to.have.property('NoticeId');
                expect(response.body.Data.NoticeAction).to.have.property('Action');

                setTestData(response.body.Data.NoticeAction.id, 'NoticeActionId');

                expect(response.body.Data.NoticeAction.NoticeId).to.equal(getTestData("NoticeActionCreateModel").NoticeId);
                expect(response.body.Data.NoticeAction.Action).to.equal(getTestData("NoticeActionCreateModel").Action);
            
            })
            .expect(201, done);
    });

    it('448 - Get notice action for the user', function(done) {

        agent
            .get(`/api/v1/general/notices/${getTestData("NoticeId")}/users/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
                
            })
            .expect(200, done);
    });

    it('449 - Get notice action for the user', function(done) {

        agent
            .get(`/api/v1/general/notices/users/${getTestData("PatientUserId")}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', 'T26BP24-MRGMRYE-JB90S0V-NC93PY0')
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
              
            })
            .expect(200, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadNoticeActionCreateModel = async (
) => {
    const model = {
        NoticeId : getTestData("NoticeId"),
        Contents : [
            {
                Title      : "Attachment",
                ResourceId : "23"
            }
        ],
        Action : "Apply for job"
    };
    setTestData(model, "NoticeActionCreateModel");
};
