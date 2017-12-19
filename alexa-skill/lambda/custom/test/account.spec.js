'use strict'

const fn = require('./../handlers/account').fn
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const {alexaShould} = require('./support/common')
const mock = require('./support/mock')

describe('Account Intents', () => {
    describe('GetBalance Intent', () => {

        alexaShould(fn.getBalance)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/1500/)//balance

        alexaShould(fn.getBalance, 'MEMBER_NEW')
            .say(/SAY_ZERO_BALANCE/)
        
        alexaShould(fn.getBalance, 'MEMBER_VIP')
            .say(/SAY_HIGH_BALANCE/)
    })    

    describe('ListLastTransactions Intent', () => {

        before(() => {
            mock.api.stub()
        })

        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.listLastTransactions)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/Walmart/)
    })

    describe('ListLastTransactions Intent - No transactions', () => {

        before(() => {
            mock.api.stub('MEMBER_NEW')
        })

        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.listLastTransactions, 'MEMBER_NEW')
            .say(/NO_RECENT_TRANSACTIONS_FOUND/)
    })

    describe('GetExpiringPoints - points exp in 7 days', () =>{

        before(() => {
            mock.api.stub()
        })

        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.getExpiringPoints)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/2000/)//balance
            .say(/EXPIRING_POINTS_FOUND_7_D/)
    })

    describe('GetExpiringPoints - no points exp', () =>{
        
        before(() => {
            mock.api.stub('MEMBER_NEW')
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.getExpiringPoints)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/NO_EXPIRING_POINTS_FOUND/)
    })

    describe('GetExpiringPoints - points exp in 180 days', () =>{
        
        before(() => {
            mock.api.stub('MEMBER_VIP')
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.getExpiringPoints)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/7000/)
            .say(/EXPIRING_POINTS_FOUND_180_D/)
    })
        
    describe('MoreDetails - state ACCOUNT_GOT_EXPIRING_POINTS', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.moreDetails_gep)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/Walmart/)
    })

    describe('MoreDetails - state ACCOUNT_GOT_EXPIRING_POINTS - no transactions', ()=>{
        
        before(() => {
            mock.api.stub('MEMBER_NEW')
        })
        
        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.moreDetails_gep, 'MEMBER_NEW')
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/THATS_ALL_I_KNOW/)
    })

    describe('GetRedeemOptionsForInfoPoints - state ACCOUNT_GOT_EXPIRING_POINTS', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.getRedeemOptions_gep, 'DEFAULT', {}, {sumExpPoints:1000})
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/REDEEM_OPTIONS_FOR_EXPIRING_POINTS/)
    })

    describe('GetRedeemOptionsForInfoPoints - state ACCOUNT_GOT_EXPIRING_POINTS', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.getRedeemOptions_gep,'DEFAULT', {}, {sumExpPoints:0})
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/REDEEM_OPTIONS_FOR_NO_EXPIRING_POINTS/)
    })

    describe('Unhandled - state ACCOUNT_GOT_EXPIRING_POINTS', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.unhandled_gep, 'DEFAULT', {}, {}, {intent: {name: 'IntentABC'}})
            .emit('IntentABC')
    })

    describe('MoreDetails - state ACCOUNT_GOT_BALANCE', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.moreDetails_gb)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/Walmart/)
    })

    describe('MoreDetails - state ACCOUNT_GOT_BALANCE - zero balance', ()=>{
        
        before(() => {
            mock.api.stub('MEMBER_NEW')
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.moreDetails_gb, 'MEMBER_NEW')
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/THATS_ALL_I_KNOW/)
    })

    describe('GetRedeemOptionsForInfoPoints - state ACCOUNT_GOT_BALANCE', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.getRedeemOptions_gb)
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/REDEEM_OPTIONS_FOR_BALANCE/)
    })

    describe('GetRedeemOptionsForInfoPoints - state ACCOUNT_GOT_BALANCE - zero balance', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })
        
        alexaShould(fn.getRedeemOptions_gb,'MEMBER_NEW')
            .reprompt()
            .keepSession()
            .askAnythingElse()
            .say(/REDEEM_OPTIONS_FOR_ZERO_BALANCE/)

    })

    describe('Unhandled - state ACCOUNT_GOT_BALANCE', ()=>{
        
        before(() => {
            mock.api.stub()
        })
        
        after(() => {
            mock.api.restore()
        })

        alexaShould(fn.unhandled_gb, 'DEFAULT', {}, {}, {intent: {name: 'IntentABC'}})
            .emit('IntentABC')
    })

})