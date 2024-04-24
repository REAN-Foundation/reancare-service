import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { AssessmentType } from '../../../src/domain.types/clinical/assessment/assessment.types';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { endDate, getRandomEnumValue, pastDateString, startDate } from '../utils';
import { Severity } from '../../../src/domain.types/miscellaneous/system.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('103 - tests', function() {

    var agent = request.agent(infra._app);

    it('103:01 -> Create assessment template', function(done) {
        loadTemplateCreateModel();
        const createModel = getTestData("TemplateCreateModel");
        agent
            .post(`/api/v1/clinical/symptom-assessment-templates/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.SymptomAssessmentTemplate.id, 'AssessmentTemplateId_1');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });
   
    it('103:02 -> Create symptom assessment test', function(done) {
      loadSymptomAssessmentCreateModel();
      const createModel = getTestData("SymptomAssessmentCreateModel");
      agent
          .post(`/api/v1/clinical/symptom-assessments/`)
          .set('Content-Type', 'application/json')
          .set('x-api-key', `${process.env.TEST_API_KEY}`)
          .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
          .send(createModel)
          .expect(response => {
              setTestData(response.body.Data.SymptomAssessment.id, 'AssessmentId_1');
              expect(response.body).to.have.property('Status');
              expect(response.body.Status).to.equal('success');         
          })
          .expect(201, done);
  });

  it('Create patient with phone & password', function(done) {
    loadPatientCreateWithPhoneThirdModel();
    const createModel = getTestData("PatientCreateWithPhoneThirdModel");
    agent
        .post(`/api/v1/patients/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .send(createModel)
        .expect(response => {
            expect(response.body).to.have.property('Status');
            expect(response.body.Status).to.equal('success');

        })
        .expect(201, done);
  });

  it('Patient login with password', function(done) {
    loadPatientLoginThirdModel();
    const createModel = getTestData("PatientLoginThirdModel");
    agent
        .post(`/api/v1/users/login-with-password/`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', `${process.env.TEST_API_KEY}`)
        .send(createModel)
        .expect(response => {
            assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
            assert.exists(response.body.Data.User, 'Login user details exist.');
            expect(response.body.Data.User).to.have.property('id');
            setTestData(response.body.Data.AccessToken, "PatientJwt_1");
            setTestData(response.body.Data.User.UserId, "PatientUserTestId_Test");

        })
        .expect(200, done);
  });

});

///////////////////////////////////////////////////////////////////////////

export const loadTemplateCreateModel = async (
    ) => {
        const model = {
            Title       : faker.lorem.word(),
            Description : faker.lorem.words(10),
            Tags        : [
                faker.lorem.words(),
                faker.lorem.words()
            ]
      
        };
        setTestData(model, "TemplateCreateModel");
    };

export const loadSymptomAssessmentCreateModel = async (
  ) => {
      const model = {
          PatientUserId        : getTestData("PatientUserId"),
          AssessmentTemplateId : getTestData("AssessmentTemplateId_1"),
          Title                : faker.lorem.words(),
          AssessmentDate       : faker.date.anytime()
        
      };
      setTestData(model, "SymptomAssessmentCreateModel");
};

// export const loadTemplateCreateModel = async (
//   ) => {
//       const model = {
//           Title       : faker.lorem.word(),
//           Description : faker.lorem.words(10),
//           Tags        : [
//               faker.lorem.words(),
//               faker.lorem.words()
//           ]
    
//       };
//       setTestData(model, "TemplateCreateModel");
// };

export const loadEnrollmentCreateModel = async (
  ) => {
      const model = {
          Provider  : "AHA",
          PlanCode  : "HFMotivator",
          StartDate : "2024-08-17"
      };
      setTestData(model, "EnrollmentCreateModel");
};

const patientPhoneNumber: string = faker.phone.number('+103-##########');

const patientPassword : string = faker.internet.password()

export const loadPatientCreateWithPhoneThirdModel = async (
    ) => {
        const model = {
            Phone: patientPhoneNumber,
            Password: patientPassword,
            LoginRoleId: getTestData("patientRoleId"),
            TenantId: getTestData("TenantId")
        };
        setTestData(model, 'PatientCreateWithPhoneThirdModel');
};

export const loadPatientLoginThirdModel = async (
    ) => {
        const model = {
            Phone: patientPhoneNumber,
            Password: patientPassword,
            LoginRoleId: getTestData("patientRoleId"),
        };
        setTestData(model, 'PatientLoginThirdModel');
};

export const loadComplaintCreateModel = async (
  ) => {
      const model = {
          PatientUserId             : getTestData("PatientUserId_Test"),
          MedicalPractitionerUserId : getTestData("DoctorUserId_Test"),
          VisitId                   : faker.string.uuid(),
          EhrId                     : faker.string.uuid(),
          Complaint                 : faker.lorem.words(),
          Severity                  : getRandomEnumValue(Severity),
          RecordDate                : faker.date.anytime()
      };
      setTestData(model, "ComplaintCreateModel");
};

export const loadStartConversationModel = async (
  ) => {
      const model = {
          InitiatingUserId : getTestData("PatientUserId"),
          OtherUserId      : getTestData("PatientUserTestId")
      };
      setTestData(model, "StartConversationModel");
  };
  