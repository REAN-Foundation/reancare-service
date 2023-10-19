import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';
import { GenderList } from '../../../src/domain.types/miscellaneous/system.types';
import { getRandomEnumValue } from '../utils';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('87 - Second user logs in tests', function() {
    var agent = request.agent(infra._app);

    it('87:01 -> Create patient with phone & password', function(done) {
        loadPatientCreateWithPhoneFourthModel();
        const createModel = getTestData("PatientCreateWithPhoneFourthModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.User.id, "PatientUserId_1");
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('87:02 -> Second user logs in', function(done) {
        loadPatientLoginFourthModel();
        const PatientLoginModel = getTestData("PatientLoginFourthModel");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt_2");
                setTestData(response.body.Data.User.id, "PatientUserId_11");
            })
            .expect(200, done);
    });
   
    it('87:03 -> Update user details', function(done) {
        loadUserDetailsUpdateModel();
        const updateModel = getTestData("UserDetailsUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('87:04 -> Negative - Create patient with phone & password', function(done) {
        loadNPatientPasswordPhoneCreateModel();
        const createModel = getTestData("NPatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(409, done);
    });

    it('87:05 -> Negative - Second user logs in', function(done) {
        const PatientLoginModel = getTestData("PatientLoginModel4");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .send(PatientLoginModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
   
    it('87:06 -> Negative - Update user details', function(done) {
        loadNUserDetailsUpdateModel();
        const updateModel = getTestData("NUserDetailsUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId_1')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatienttJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(403, done);
    });

});

///////////////////////////////////////////////////////////////////////////

const patientPhoneNumber: string = faker.phone.number('+91-##########');

const patientPassword : string = faker.internet.password()

export const loadPatientCreateWithPhoneFourthModel = async (
    ) => {
        const model = {
            Phone: patientPhoneNumber,
            Password: patientPassword,
            LoginRoleId: getTestData("patientRoleId"),
        };
        setTestData(model, 'PatientCreateWithPhoneFourthModel');
};

export const loadPatientLoginFourthModel = async (
    ) => {
        const model = {
            Phone: patientPhoneNumber,
            Password: patientPassword,
            LoginRoleId: getTestData("patientRoleId"),
        };
        setTestData(model, 'PatientLoginFourthModel');
};

export const loadUserDetailsUpdateModel = async (
) => {
    const model = {
        Prefix          : faker.person.prefix(),
        FirstName       : faker.person.firstName(),
        MiddleName      : faker.person.middleName(),
        LastName        : faker.person.lastName(),
        Email           : faker.internet.email(),
        Gender          : getRandomEnumValue(GenderList),
        BirthDate       : faker.date.birthdate(),
        ImageResourceId : faker.string.uuid(),
        Address         : {
            Type        : faker.lorem.word(),
            AddressLine : faker.location.streetAddress(),
            City        : faker.location.city(),
            Country     : faker.location.country()
        },
        DefaultTimeZone : "+05:30",
        CurrentTimeZone : "+05:30"
    };
    setTestData(model, "UserDetailsUpdateModel");
};

export const loadNPatientPasswordPhoneCreateModel = async (
) => {
    const model = {
            
    };
    setTestData(model, "NPatientPasswordPhoneCreateModel");
};

export const loadNUserDetailsUpdateModel = async (
) => {
    const model = {
           
    };
    setTestData(model, "NUserDetailsUpdateModel");
};
