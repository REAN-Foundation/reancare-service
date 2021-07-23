import { Loader } from "../startup/loader";
import * as request from "supertest";
import { Helper } from '../common/helper';
var supertest = require("supertest");
var request = supertest('http://localhost:' + process.env.PORT);
import Application from '../app';
////////////////////////////////////////////////////////////////////

beforeAll(async (done) => {

    await Helper.sleep(500);
    done();
});

afterAll(async (done) => {
    await Helper.sleep(10);
    done();
});

////////////////////////////////////////////////////////////////////

describe('Health-check', () => {

    var appInstance = Application.instance();
    var app = appInstance.app();

    it('Service health-check', async (done) => {
        //const result = await supertest(app).get('/');
        const response = await request.get('/');
        expect(response.body.message).toBeDefined();
        expect(response.statusCode).toEqual(200);
        done();
    });
});

