Travis badge:

[![Build Status](https://travis-ci.org/slistrom/bth-js-back.svg?branch=main)](https://travis-ci.org/slistrom/bth-js-back)

Scrutinizer badges:

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/slistrom/bth-js-back/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/slistrom/bth-js-back/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/slistrom/bth-js-back/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/slistrom/bth-js-back/?branch=main)

## Description 

Backend server for the project in the course jsramverk at BTH. It is a backend API for a very simple trading platform. Where users can register accounts and then buy and sell stocks with real-time simulated prices.    

### Technical choices

This API backend is built using the node Express web framework. I have chosen Express for this implementation primarily because that is the framework I know best and feel I have most knowledge around. The implementation is also using the npm packages bcryptjs, cors, dotenv, jsonwebtoken, morgan, socket.io and sqlite3.

bcryptjs is used to make sure passwords that users insert are save in an encrypted format in the database to keep them as safe as possible from potential password thefts.

cors is used to enable clients from other domains to access this API (Cross-Origin Resource Sharing). 

dotenv is used to have an easy way of storing environment variables for the solution both locally during development and in production.

jsonwebtoken is used to enable a session token between the client and the API to ensure that only authenticated users can send questions (requests) to the API.

morgan is used to get a better and more informative logging while the backend is running in production.

socket.io is used for sending real-time messages from the server to the client, see more info below.

sqlite3 is used as a lightweight database for this backend to store information about users and their stock portfolios.

### Real-time microservice

In this implementation I am using the npm package socket.io to enable real-time messaging between this server and clients. I find real-time messaging very fascinating and it enables so many really cool services (in my opinion) to users where the interactivity between both the system and separate users becomes almost instant. I opted to put all the socket code for the backend in the main app.js file, where I both check for client connections and disconnections. I also put my simulated stock information in the main app.js file, this was not optimal but as it was not much code I found this an acceptable approach given the time constraints this project had to be done in. The simulated stock prices are using a math simple formula to randomize the price over time and every five seconds the updated stockprices are send out (emitted) to all clients listening. 

I find that the socket technology works really well and as mentioned I really like what is possible to build with this kind oftechnology (service). I did not have much problem with the server implementation of my socket code, other that I had a minor problem with my simulated stock prices when I created my continious integration testing.   

### Continious integration testing

In my continious integration (CI) testing I am primarily using eslint, mocha, istanbul (nyc) and chai locally. These different tools give me a very good possibility to run local tests on my code to ensure both the quality, code coverage of tests and functionality of my code. I have primarily written tests that verify that the API endpoints return the correct information. There are a few tests that also simulate a user first registering an account, then login to the trading platform and buying and sell stocks.

For remote tools testing my repository on Github I chose Travis and Scrutinizer. I use Travis to ensure that the code I upload on github always builds correctly and that my testcases give relevant replies. I use Scrutinizer to check my code coverage and also to get an idea about the code quality and any hints to make the code even better.

Even though it does take a lot of time and effort (in my opinion) to get a CI chain setup like this once it is done it is very helpful and feels like a good extra check to ensure that new functionality I implement does not break anything already working. Like most testing though, the tests are only as good as they are written. It is much easier to get high code coverage with test than actually having test that ensure that the intended functionality is intact when making updates.    
