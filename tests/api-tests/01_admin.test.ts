import  request  from 'supertest';
import { expect, assert } from 'chai';
import  Application  from '../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from './init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('01 - Admin tests', function() {
  
    var agent = request.agent(infra._app);

    it('01 - 01 - Admin login', function (done) {

        const AdminLoginModel = getTestData("AdminLoginModel");
        AdminLoginModel.UserName = process.env.TEST_ADMIN_USERNAME;
        AdminLoginModel.Password = process.env.TEST_ADMIN_PASSWORD;
        agent
            .post('/api/v1/users/login-with-password')
            .set('Content-Type', 'application/json')
            .set('x-api-key', `${process.env.TEST_API_KEY}`)
            .send(AdminLoginModel)
            .expect(response => {
                assert.exists(response.body.Data.AccessToken, 'Access token is returned.');
                assert.exists(response.body.Data.User, 'Login user details exist.');
                expect(response.body.Data.User).to.have.property('id');
                setTestData(response.body.Data.AccessToken, "AdminJwt");
                setTestData(response.body.Data.User.UserId, "AdminUserId");
            })
            .expect(200, done);

    });
  
});

/////////////////////////////////////////////////////////////////////////////////////////
