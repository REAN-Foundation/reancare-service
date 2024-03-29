import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('89 - tests', function() {

    var agent = request.agent(infra._app);
   
    it('89:01 -> Create tenants test', function(done) {
      loadTenantCreateModel();
        const createModel = getTestData("TenantCreateModel");
        agent
            .post(`/api/v1/tenants/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

    it('89:02 -> Create api client test', function (done) {
      loadApiClientCreateModel();
      const createModel = getTestData('ApiClientCreateModel');
      agent
          .post(`/api/v1/api-clients/`)
          .set('Content-Type', 'application/json')
          .set('x-api-key', `${process.env.TEST_API_KEY}`)
          .set('Authorization', `Bearer ${getTestData('AdminJwt')}`)
          .send(createModel)
          .expect((response) => {
              setTestData(response.body.Data.Client.id, 'ApiClientId');
              expect(response.body.Data.Client).to.have.property('id');
              expect(response.body.Data.Client).to.have.property('ClientName');
              setTestData(response.body.Data.Client.ClientCode, 'ClientCode');
              expect(response.body.Data.Client).to.have.property('Phone');
              expect(response.body.Data.Client).to.have.property('Email');

              expect(response.body.Data.Client.Phone).to.equal(getTestData('ApiClientCreateModel').Phone);
              expect(response.body.Data.Client.Email).to.equal(getTestData('ApiClientCreateModel').Email);
          })
          .expect(201, done);
  });

  it('89:03 -> Get patient stats', function(done) {
    agent
        .get(`/api/v1/patient-statistics/${getTestData("PatientUserId")}`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
        .expect(response => {
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');
        })
        .expect(200, done);
  });

  it('89:04 -> Create donation test', function (done) {
    loadDonationCreateModel();
    const createModel = getTestData('DonationCreateModel');
    agent
        .post(`/api/v1/api-clients/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData('PatientJwt')}`)
        .send(createModel)
        .expect((response) => {
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('failure');
        })
        .expect(401, done);
  });

  it('89:05 -> Create task', function(done) {
    loadTaskCreateModel();
    const createModel = getTestData("TaskCreateModel");
    agent
      .post(`/api/v1/user-tasks/`)
      .set('Content-Type', 'application/json')
      .set('x-api-key', `${process.env.TEST_API_KEY}`)
      .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
      .send(createModel)
      .expect(response => {
        expect(response.body).to.have.property('Status');
        expect(response.body.Status).to.equal('success');
      })
      .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadTenantCreateModel = async (
    ) => {
        const model = {
          Name: faker.person.fullName(),
          Description: faker.lorem.words(),
          Code: faker.lorem.word(),
          Phone: faker.phone.number('+91-##########'),
          Email: faker.internet.email(),
        };
        setTestData(model, 'TenantCreateModel');
};

export const loadApiClientCreateModel = async (
  ) => {
      const model = {
          ClientName: faker.person.fullName(),
          Password: `${process.env.TEST_CLIENT_PASSWORD}`,
          Phone : faker.phone.number('+91-##########'),
          Email: faker.internet.exampleEmail()    
      };
      setTestData(model, 'ApiClientCreateModel');
};

export const loadDonationCreateModel = async (
  ) => {
      const model = {
          ClientName: faker.person.fullName(),
          Password: `${process.env.TEST_CLIENT_PASSWORD}`,
          Phone : faker.phone.number('+91-##########'),
          Email: faker.internet.exampleEmail()    
      };
      setTestData(model, 'DonationCreateModel');
};

export const loadTaskCreateModel = async (
) => {
    const model = {
        UserId             : getTestData("PatientUserId"),
        Task               : faker.lorem.word(),
        Category           : "Custom",
        ActionType         : "Medication",
        ActionId           : faker.string.uuid(),
        ScheduledStartTime : startDate,
        ScheduledEndTime   : endDate,
        IsRecurrent        : false
    
    };
    setTestData(model, "TaskCreateModel");
};
