'use strict';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const configs = require('./configs');

function register(userPool, email, password, attribute_list) {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attribute_list, null, (err, result) => {
      console.log('inside');
      if (err) {
        console.log(err.message);
        reject(err);
        return {
           statusCode: 500,
            body: JSON.stringify(
              {
                message: 'Error! '+ err.message,
                input: event,
              },
              null,
              2
            ),
        };
      }
      var cognitoUser = result.user;
      resolve(cognitoUser)
    });
  });
}

module.exports.hello = async (event) => {
    console.log(event.body);

    var requestBody = JSON.parse(event.body);

    var email = requestBody.email;
    var password = requestBody.password;
    var confirm_password = requestBody.confirm_password;

    if((email == null)||(password == null)||(confirm_password == null)){
      return {
         statusCode: 500,
          body: JSON.stringify(
            {
              message: 'Error! Invalid Request Parameters.',
              input: event,
            },
            null,
            2
          ),
      };
    }
    // define pool data
    var poolData = {
      UserPoolId : configs.USERPOOL_ID,
      ClientId : configs.CLIENT_ID
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attribute_list = [];

    // define fields needed
    var dataEmail = {
        Name : 'email',
        Value : email
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    attribute_list.push(attributeEmail);

    if (password === confirm_password){

        console.log("here")

        var result = await register(userPool, email.replace(/[@.]/g, '|'), password, attribute_list);

        console.log(result)

        console.log("here2")

    } else {

      return {
         statusCode: 500,
          body: JSON.stringify(
            {
              message: 'Error! Passwords do not match.',
              input: event,
            },
            null,
            2
          ),
      };
    }

     return {
       statusCode: 200,
        body: JSON.stringify(
          {
            message: 'User created successfully!',
            input: event,
          },
          null,
          2
        ),
      };
};
