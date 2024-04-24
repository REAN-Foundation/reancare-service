import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, pastDateString, startDate } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('102 - tests', function() {

    var agent = request.agent(infra._app);
   
    it('102:01 -> Create assessment template test', function(done) {
      loadCustomAssessmentCreateModel();
      const createModel = getTestData("CustomAssessmentCreateModel");
      agent
          .post(`/api/v1/clinical/assessment-templates`)
          .set('Content-Type', 'application/json')
          .set('x-api-key', `${process.env.TEST_API_KEY}`)
          .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
          .send(createModel)
          .expect(response => {
            setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateTestId_1');
            setTestData(response.body.Data.AssessmentTemplate.RootNodeId, 'AssessmentTemplateRootNodeId');
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');
                         
          })
          .expect(201, done);
  });

  it('Create assessment template test', function(done) {
    loadCustomAssessmentCreateModel();
    const createModel = getTestData("CustomAssessmentCreateModel");
    agent
        .post(`/api/v1/clinical/assessment-templates`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
        .send(createModel)
        .expect(response => {
          setTestData(response.body.Data.AssessmentTemplate.id, 'AssessmentTemplateTestId');
          setTestData(response.body.Data.AssessmentTemplate.RootNodeId, 'AssessmentTemplateRootNodeId');
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');
                       
        })
        .expect(201, done);
});

it('102:02 -> Create assessment', function(done) {
  loadAssessmentCreateModel();
  const createModel = getTestData("AssessmentCreateModel");
  agent
      .post(`/api/v1/clinical/assessments/`)
      .set('Content-Type', 'application/json')
      .set('x-api-key', `${process.env.TEST_API_KEY}`)
      .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
      .send(createModel)
      .expect(response => {
          setTestData(response.body.Data.Assessment.id, 'AssessmentTestId');
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');
      })
      .expect(201, done);
});

it('102:03 -> Create blood oxygen saturation test', function(done) {
  loadBloodOxygenSaturationCreateModel();
  const createModel = getTestData("BloodOxygenSaturationCreateModel");
  agent
      .post(`/api/v1/clinical/biometrics/blood-oxygen-saturations`)
      .set('Content-Type', 'application/json')
      .set('x-api-key', `${process.env.TEST_API_KEY}`)
      .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
      .send(createModel)
      .expect(response => {
          setTestData(response.body.Data.BloodOxygenSaturation.id, 'BloodOxygenSaturationId');
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');

      })
      .expect(201, done);
});

it('102:04 -> Create body weight', function(done) {
  loadBodyWeightCreateModel();
  const createModel = getTestData("BodyWeightCreateModel");
  agent
      .post(`/api/v1/clinical/biometrics/body-weights`)
      .set('Content-Type', 'application/json')
      .set('x-api-key', `${process.env.TEST_API_KEY}`)
      .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
      .send(createModel)
      .expect(response => {
          setTestData(response.body.Data.BodyWeight.id, 'BodyWeightId');
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');

      })
      .expect(201, done);
});

it('102:05 -> Create blood glucose', function(done) {
  loadBloodGlucoseCreateModel();
  const createModel = getTestData("BloodGlucoseCreateModel");
  agent
      .post(`/api/v1/clinical/biometrics/blood-glucose`)
      .set('Content-Type', 'application/json')
      .set('x-api-key', `${process.env.TEST_API_KEY}`)
      .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
      .send(createModel)
      .expect(response => {
          setTestData(response.body.Data.BloodGlucose.id, 'BloodGlucoseId');
          expect(response.body).to.have.property('Status');
          expect(response.body.Status).to.equal('success');

      })
      .expect(201, done);
  });

});

///////////////////////////////////////////////////////////////////////////

export const loadCustomAssessmentCreateModel = async (
  ) => {
      const model = {
          TenantId               : getTestData("TenantId"),
          Title                  : faker.lorem.word(5),
          Description            : faker.lorem.word(15),
          Type                   : getRandomEnumValue(AssessmentType),
          Provider               : faker.lorem.word(),
          ProviderAssessmentCode : faker.lorem.word()
      };
      setTestData(model, "CustomAssessmentCreateModel");
};

export const loadAssessmentCreateModel = async (
  ) => {
    const model = {
        PatientUserId        : getTestData("PatientUserId"),
        Title                : faker.lorem.word(5),
        AssessmentTemplateId : getTestData("AssessmentTemplateTestId"),
        ScheduledDate        : faker.date.future()        
      };
    setTestData(model, "AssessmentCreateModel");
};

export const loadBloodOxygenSaturationCreateModel = async (
  ) => {
      const model = {
        PatientUserId         : getTestData('PatientUserId'),
        BloodOxygenSaturation : faker.number.int({ min: 75, max:85 }),
        Unit                  : "%",
        RecordDate            : "2021-09-01",
        RecordedByUserId      : getTestData('PatientUserId')
    };
    setTestData(model, "BloodOxygenSaturationCreateModel");
};

export const loadBodyWeightCreateModel = async (
  ) => {
    const model = {
      PatientUserId : getTestData('PatientUserId'),
      BodyWeight    : faker.number.int(200),
      Unit          : faker.string.symbol()
    };
    setTestData(model, "BodyWeightCreateModel");
};
  

export const loadBloodGlucoseCreateModel = async (
  ) => {
      const model = {
        PatientUserId    : getTestData('PatientUserId'),
        Unit             : "mg|dL",
        BloodGlucose     : faker.number.int({ min:102, max: 105 }),
        RecordDate       : pastDateString,
        RecordedByUserId : getTestData('PatientUserId')
  
    };
    setTestData(model, "BloodGlucoseCreateModel");
};