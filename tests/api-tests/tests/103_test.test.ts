import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, pastDateString, startDate } from '../utils';
import { BloodGroupList, MaritalStatusList, Severity } from '../../../src/domain.types/miscellaneous/system.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('103 - tests', function() {

    var agent = request.agent(infra._app);
   
    it('103:01 -> Create knowledge nugget test', function(done) {
      loadKnowledgeNuggetCreateModel();
      const createModel = getTestData("KnowledgeNuggetCreateModel");
      agent
          .post(`/api/v1/educational/knowledge-nuggets/`)
          .set('Content-Type', 'application/json')
          .set('x-api-key', `${process.env.TEST_API_KEY}`)
          .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
          .send(createModel)
          .expect(response => {
              setTestData(response.body.Data.KnowledgeNugget.id, 'KnowledgeNuggetId_1');
              expect(response.body).to.have.property('Status');
              expect(response.body.Status).to.equal('success'); 

          })
          .expect(201, done);
  });

  it('103:02 -> Create heart points test', function(done) {
    loadHeartPointCreateModel();
    const createModel = getTestData("HeartPointCreateModel");
    agent
        .post(`/api/v1/wellness/daily-records/heart-points/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
        .send(createModel)
        .expect(response => {
            setTestData(response.body.Data.HeartPoints.id, 'HeartPointId_1');
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success'); 

        })
        .expect(201, done);
  });

  it('103:03 -> Get patient health profile test', function(done) {
    agent
        .get(`/api/v1/patient-health-profiles/${getTestData('PatientUserId')}`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
        .expect(response => {
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');
        })
        .expect(200, done);
  });

  it('103:04 -> Update health profile', function(done) {
    loadHealthProfileUpdateModel();
    const updateModel = getTestData("HealthProfileUpdateModel");
    agent
        .put(`/api/v1/patient-health-profiles/${getTestData('PatientUserId')}`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
        .send(updateModel)
        .expect(response => {
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');
        })
        .expect(200, done);
  });

  it('103:05 -> Create address', function(done) {
  loadAddressCreateModel();
  const createModel = getTestData("AddressCreateModel");
  agent
      .post(`/api/v1/addresses/`)
      .set('Content-Type', 'application/json')
      .set('x-api-key', `${process.env.TEST_API_KEY}`)
      .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
      .send(createModel)
      .expect(response => {
          setTestData(response.body.Data.Address.id, 'AddressId_1');
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');

      })
      .expect(201, done);
  });

});

///////////////////////////////////////////////////////////////////////////

export const loadKnowledgeNuggetCreateModel = async (
  ) => {
      const model = {
          TopicName           : faker.lorem.word(),
          BriefInformation    : faker.word.words(),
          DetailedInformation : faker.word.words(),
          AdditionalResources : [
              faker.word.words()
          ],
          Tags : [
              faker.word.words()
          ]
    
      };
      setTestData(model, "KnowledgeNuggetCreateModel");
};

export const loadHeartPointCreateModel = async (
  ) => {
      const model = {
          PersonId      : getTestData("PatientPersonId"),
          PatientUserId : getTestData("PatientUserId"),
          HeartPoints   : faker.number.int(10),
          Unit          : faker.string.symbol()
    
      };
      setTestData(model, "HeartPointCreateModel");
};

export const loadHealthProfileUpdateModel = async (
  ) => {
      const model = {
          BloodGroup         : getRandomEnumValue(BloodGroupList),
          MajorAilment       : faker.lorem.word(5),
          OtherConditions    : faker.lorem.word(5),
          IsDiabetic         : faker.datatype.boolean(),
          HasHeartAilment    : faker.datatype.boolean(),
          MaritalStatus      : getRandomEnumValue(MaritalStatusList),
          Ethnicity          : faker.lorem.slug(2),
          Nationality        : faker.location.country(),
          Occupation         : faker.lorem.words(2),
          SedentaryLifestyle : faker.datatype.boolean(),
          IsSmoker           : faker.datatype.boolean(),
          IsDrinker          : faker.datatype.boolean(),
          DrinkingSeverity   : getRandomEnumValue(Severity),
          DrinkingSince      : faker.date.past(),
          SubstanceAbuse     : faker.datatype.boolean(),
          ProcedureHistory   : faker.word.words()
      };
      setTestData(model, "HealthProfileUpdateModel");
};

export const loadAddressCreateModel = async (
  ) => {
      const model = {
          Type        : faker.lorem.word(),
          AddressLine : faker.location.streetAddress(),
          City        : faker.location.city(),
          District    : faker.lorem.word(),
          State       : faker.lorem.word(),
          Country     : faker.location.country(),
          PostalCode  : faker.location.zipCode(),
          Longitude   : faker.location.longitude(),
          Lattitude   : faker.location.latitude()
      
      };
      setTestData(model, "AddressCreateModel");
};