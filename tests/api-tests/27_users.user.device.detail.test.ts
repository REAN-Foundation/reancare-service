import  request  from 'supertest';
import { expect } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('27 - User device detail tests', function() {

    var agent = request.agent(infra._app);

    it('27 - 01 - Create user device detail', function(done) {
        loadUserDeviceDetailCreateModel();
        const createModel = getTestData("UserDeviceDetailCreateModel");
        agent
            .post(`/api/v1/user-device-details/`)
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(createModel)
            .expect(response => {
                setTestData(response.body.Data.UserDeviceDetails.id, 'UserDeviceDetailId');
                expect(response.body.Data).to.have.property('UserDeviceDetails');
                expect(response.body.Data.UserDeviceDetails).to.equal(true);

            })
            .expect(201, done);
    });

    it('27 - 01 - Negative - Create user device detail', function(done) {
        loadNegativeUserDeviceDetailCreateModel();
        const createModel = getTestData("NegativeUserDeviceDetailCreate");
        agent
            .post(`/api/v1/user-device-details/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');

            })
            .expect(401, done);
    });

});

///////////////////////////////////////////////////////////////////////////

export const loadUserDeviceDetailCreateModel = async (
    Token = faker.lorem.word(),
    deviceName = faker.commerce.productName(),
    oSType = faker.lorem.word(),
    oSVersion = faker.number.float({ min: 10, max: 20, precision: 0.1 }),
    appName = faker.person.fullName(),
    appVersion = faker.number.float({ precision: 0.1 }),
) => {
    const model = {
        Token      : Token,
        UserId     : getTestData("PatientUserId"),
        DeviceName : deviceName,
        OSType     : oSType,
        OSVersion  : oSVersion,
        AppName    : appName,
        AppVersion : appVersion
  
    };
    setTestData(model, "UserDeviceDetailCreateModel");
};

export const loadNegativeUserDeviceDetailCreateModel = async (
    Token = faker.lorem.word(),
    deviceName = faker.commerce.productName(),
    oSType = faker.lorem.word(),
    oSVersion = faker.number.float({ min: 10, max: 20, precision: 0.1 }),
    appName = faker.person.fullName(),
    appVersion = faker.number.float({ precision: 0.1 }),
) => {
    const model = {
        Token      : Token,
        DeviceName : deviceName,
        OSType     : oSType,
        OSVersion  : oSVersion,
        AppName    : appName,
        AppVersion : appVersion
  
    };
    setTestData(model, "NegativeUserDeviceDetailCreate");
};
