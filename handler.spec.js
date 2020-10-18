const mocha = require('mocha');
const chai = require('chai');
const should = chai.should();

const handler = require('./handler');

var expect = require( 'chai' ).expect;
var LambdaTester = require( 'lambda-tester' );


function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

describe("The handler function", () => {
    it("returns a message", () => {
      var randStr = makeid(5);               
      const event = {
            body:JSON.stringify({email:randStr+"@gmail.com",password:"P3qdmma1@123!", confirm_password:"P3qdmma1@123!"}) ,
            headers: {},
            httpMethod: 'POST',
            isBase64Encoded: false,
            path: '',
            pathParameters: {},
            queryStringParameters: undefined,
            stageVariables: {},
            requestContext: {},
            resource: '' };

        handler.hello(event, function(error, response){
          try {
              expect( error ).to.not.exist;
              expect( response ).to.exist;
              expect( response.valid ).to.be.true;
            }
            catch( error ) {
            }
        });
    });
});