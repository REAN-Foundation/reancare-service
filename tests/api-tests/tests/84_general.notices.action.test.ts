import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('84 - Notice Action tests', function () {
    var agent = request.agent(infra._app);

    it('84:01 -> Take action over notice', function (done) {
        loadNoticeActionCreateModel();
        const createModel = getTestData('noticeActionCreateModel');
        agent
            .post(`/api/v1/general/notices/${getTestData('noticeId')}/users/${getTestData('patientUserId')}/take-action`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.NoticeAction.id, 'noticeActionId');
                expect(response.body.Data.NoticeAction).to.have.property('NoticeId');
                expect(response.body.Data.NoticeAction).to.have.property('Action');

                expect(response.body.Data.NoticeAction.NoticeId).to.equal(getTestData('noticeActionCreateModel').NoticeId);
            })
            .expect(201, done);
    });

    it('84:02 -> Get notice action for the user', function (done) {
        agent
            .get(`/api/v1/general/notices/${getTestData('n')}/users/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('84:03 -> Get all user action', function (done) {
        agent
            .get(`/api/v1/general/notices/users/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('patientJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('84:04 -> Negative - Take action over notice', function (done) {
        loadNegativeNoticeActionCreateModel();
        const createModel = getTestData('negativeNoticeActionCreateModel');
        agent
            .post(`/api/v1/general/notices/${getTestData('n')}/users/${getTestData('patientUserId')}/take-action`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('84:05 -> Negative - Get notice action for the user', function (done) {
        agent
            .get(`/api/v1/general/notices/${getTestData('noticeId_1')}/users/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });

    it('84:06 -> Negative - Get all user action', function (done) {
        agent
            .get(`/api/v1/general/notices/users/${getTestData('patientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${getTestData('doctorJwt')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////

export const loadNoticeActionCreateModel = async () => {
    const model = {
        NoticeId: getTestData('noticeId'),
        Contents: [
            {
                Title: faker.lorem.word(3),
                ResourceId: faker.string.uuid(),
            },
        ],
        Action: faker.lorem.words(),
    };
    setTestData(model, 'noticeActionCreateModel');
};

export const loadNegativeNoticeActionCreateModel = async () => {
    const model = {
        Action: faker.lorem.words(),
    };
    setTestData(model, 'negativeNoticeActionCreateModel');
};
