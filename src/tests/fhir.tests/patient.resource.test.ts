// //import { Loader } from "../../startup/loader";
// import { Helper } from '../../common/helper';
// import supertest = require('supertest');
// // var request = test('http://localhost:' + process.env.PORT);
// import Application from '../../app';
// ////////////////////////////////////////////////////////////////////

// beforeAll(async () => {
//     await Helper.sleep(500);
// });

// afterAll(async () => {
//     await Helper.sleep(10);
// });

// ////////////////////////////////////////////////////////////////////

// describe('Health-check', () => {

//     var appInstance = Application.instance();
//     var app = appInstance.app();
//     const request: supertest.SuperTest<supertest.Test> = supertest(app);

//     it('Service health-check', async () => {
//         const response = await request.get('/');
//         //const response = await request.get('/');
//         expect(response.body.message).toBeDefined();
//         expect(response.statusCode).toEqual(200);
//     });
// });

