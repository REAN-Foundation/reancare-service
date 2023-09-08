import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('04 - Patient tests', function() {

    var agent = request.agent(infra._app);

    it('04 - 01 - Get user roles', function(done) {
        agent
            .get(`/api/v1/types/person-roles`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04 - 02 - Register patient- with only a phone number', function(done) {
        loadPatientPhoneCreateModel();
        const createModel = getTestData("PatientPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.id, 'PatientPhoneId');
                setTestData(response.body.Data.Patient.User.id, 'PatientUserPhoneId');
                setTestData(response.body.Data.Patient.User.Person.id, 'PatientPersonPhoneId');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Patient.id, 'PatientPhoneId');

                expect(response.body.Data.Patient.User.Person.Phone).to.equal(getTestData("PatientPhoneCreateModel").Phone);

            })
            .expect(201, done);
    });

    it('Create patient', function(done) {
        loadPatientCreateModel();
        const createModel = getTestData("PatientCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.id, 'PatientId');
                setTestData(response.body.Data.Patient.User.id, 'PatientUserId');
                setTestData(response.body.Data.Patient.User.Person.id, 'PatientPersonId');
                expect(response.body.Data.Patient.User.Person).to.have.property('id');
                expect(response.body.Data.Patient.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Patient.User.Person).to.have.property('Email');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                setTestData(response.body.Data.Patient.id, 'PatientId');

                expect(response.body.Data.Patient.User.Person.FirstName).to.equal(getTestData("PatientCreateModel").FirstName);

            })
            .expect(201, done);
    });

    it('04 - 03 - Get user with phone and role', function(done) {
        agent
            .get(`/api/v1/users/by-phone/${getTestData("PatientCreateModel")}/role/2`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04 - 04 - Register patient- with same phone number - should fail', function(done) {
        loadPatientFailCreateModel();
        const createModel = getTestData("PatientFailCreateModel");
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

    it('04 - 05 - Create patient with phone & password', function(done) {
        const PatientPasswordPhoneCreateModel = getTestData("PatientPasswordPhoneCreateModel");
        agent
            .post(`/api/v1/patients/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientPasswordPhoneCreateModel)
            .expect(response => {
                setTestData(response.body.Data.Patient.User.id, "PatientUserId");
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');

            })
            .expect(201, done);
    });

    it('04 - 06 - Patient login with password', function(done) {

        const PatientLoginModel = getTestData("PatientLoginModel");
        agent
            .post(`/api/v1/users/login-with-password/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(PatientLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "PatientJwt");
                setTestData(response.body.Data.User.UserId, "PatientUserId_1");

            })
            .expect(200, done);
    });

    it('04 - 07 - Get patient by id', function(done) {
        agent
            .get(`/api/v1/patients/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04 - 08 - Search patient records', function(done) {
        loadPatientQueryString();
        agent
            .get(`/api/v1/patients/search${loadPatientQueryString()}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("AdminJwt")}`)
            .expect(response => {
                expect(response.body.Data.Patients).to.have.property('TotalCount');
                expect(response.body.Data.Patients).to.have.property('RetrievedCount');
                expect(response.body.Data.Patients).to.have.property('PageIndex');
                expect(response.body.Data.Patients).to.have.property('ItemsPerPage');
                expect(response.body.Data.Patients).to.have.property('Order');
                expect(response.body.Data.Patients.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Patients.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Patients.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('04 - 09 - Update patient', function(done) {
        loadPatientUpdateModel();
        const updateModel = getTestData("PatientUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId')}`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .set('Authorization', `Bearer ${getTestData("PatientJwt")}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data.Patient.User.Person).to.have.property('id');
                expect(response.body.Data.Patient.User.Person).to.have.property('FirstName');
                expect(response.body.Data.Patient.User.Person).to.have.property('Email');
                expect(response.body.Data.Patient.User.Person).to.have.property('Phone');

                expect(response.body.Data.Patient.User.Person.FirstName).to.equal(getTestData("PatientUpdateModel").FirstName);

            })
            .expect(200, done);
    });

    it('04 - 10 - Update patient details - partial address', function(done) {
        loadAddressUpdateModel();
        const updateModel = getTestData("AddressUpdateModel");
        agent
            .put(`/api/v1/patients/${getTestData('PatientUserId')}`)
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

});

///////////////////////////////////////////////////////////////////////////

export const loadPatientPhoneCreateModel = async (
    Phone = faker.phone.number('+91-##########'),
) => {
    const model = {
        Phone : Phone,
          
    };
    setTestData(model, "PatientPhoneCreateModel");
};

export const loadPatientCreateModel = async (
    firstName = faker.person.firstName(),
    Email = faker.internet.exampleEmail(),
) => {
    const model = {
        FirstName : firstName,
        Email     : Email,
        Phone     : getTestData("PatientCreateModel"),
    };
    setTestData(model, "PatientCreateModel");
};

export const loadPatientFailCreateModel = async (
    firstName = faker.person.firstName(),
    Email = faker.internet.exampleEmail(),
) => {
    const model = {
        FirstName : firstName,
        Email     : Email,
        Phone     : getTestData("PatientCreateModel"),
          
    };
    setTestData(model, "PatientFailCreateModel");
};

export const loadPatientUpdateModel = async (
    firstName = faker.person.firstName(),
    Email = faker.internet.exampleEmail(),
) => {
    const model = {
        FirstName : firstName,
        Email     : Email

    };
    setTestData(model, "PatientUpdateModel");
};

export const loadAddressUpdateModel = async (
    Prefix = faker.person.prefix(),
    firstName = faker.person.firstName(),
    middleName = faker.person.middleName(),
    lastName = faker.person.lastName(),
    Email = faker.internet.exampleEmail(),
    Gender = faker.person.gender(),
    birthDate = faker.setDefaultRefDate(new Date('1991-01-01')),
    imageResourceId = faker.string.uuid(),
    Type = faker.lorem.word(),
    addressLine = faker.location.streetAddress(),
    City = faker.location.city(),
    District = faker.lorem.word(),
    State = faker.location.state(),
    Country = faker.location.country(),
    postalCode = faker.location.zipCode(),
    Longitude = faker.location.longitude(),
    Lattitude = faker.location.latitude()
) => {
    const model = {
        Prefix          : Prefix,
        FirstName       : firstName,
        MiddleName      : middleName,
        LastName        : lastName,
        Email           : Email,
        Gender          : Gender,
        BirthDate       : birthDate,
        ImageResourceId : imageResourceId,
        Addresses       : [
            {
                Type        : Type,
                AddressLine : addressLine,
                City        : City,
                District    : District,
                State       : State,
                Country     : Country,
                PostalCode  : postalCode,
                Longitude   : Longitude,
                Lattitude   : Lattitude
            }
        ]
    
    };
    setTestData(model, "AddressUpdateModel");
};

function loadPatientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

///////////////////////////////////////////////////////////////////////////
