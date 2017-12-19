'use strict'

const Alexa = require('alexa-sdk')
const resourceStrings = require('./resourceStrings')
const basicHandlers = require('./handlers/basic')
const accountHandlers = require('./handlers/account').handlers
const orderHandlers = require('./handlers/order')
const redeemHandlers = require('./handlers/redeem')
const accrualHandlers = require('./handlers/accrual')
const api = require('./api')

const appId = 'amzn1.ask.skill.6ee93ab7-cbb5-4440-b83b-db1fe7700374'

exports.handler = function(event, context) {
    const alexa = Alexa.handler(event, context)
    alexa.appId = appId
    alexa.resources = resourceStrings
    alexa.registerHandlers(
        ...basicHandlers, 
        ...accountHandlers, 
        ...orderHandlers,
        ...redeemHandlers,
        ...accrualHandlers)
    setup(event).then(alexa.execute)
}

function setup(event) {
    console.log('>> setup - request', JSON.stringify(event.request))

    return new Promise(resolve => {
        if(event.session.new){
            api.authenticate(event.session.user.accessToken)
                .then(user=>{
                    event.session.attributes.user = user
                    return api.getMember(user.id)})
                .then(member=>{
                    event.session.attributes.member = member})
                .then(resolve)
                .catch(err=>{
                    console.log('error calling setup', err)
                    resolve()//lets handler deal with missing data
                })
        }else{
            resolve()        
        }
    })
}