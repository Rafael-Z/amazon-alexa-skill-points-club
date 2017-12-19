'use strict'

const Alexa = require('alexa-sdk')
const du = require('../dateUtils')
const api = require('../api')
const {HIGH_BALANCE_THRESHOLD, NUM_LAST_TRANSACTIONS, NUM_EXPIRING_ACCRUALS} = require('../config')
const STATES = require('../states')
const moment = require('moment')

const fn = {

    getBalance: function(){
        this.handler.state = STATES.ACCOUNT_GOT_BALANCE
        const member = this.attributes.member
    
        let speechOutput = ''
        if(member.balance >= HIGH_BALANCE_THRESHOLD){
            speechOutput = this.t('SAY_HIGH_BALANCE', member.balance) + this.t('ANYTHING_ELSE')
        }else if(member.balance === 0){
            speechOutput = this.t('SAY_ZERO_BALANCE', member.balance) + this.t('ANYTHING_ELSE')
        }else{
            speechOutput = this.t('SAY_BALANCE', member.balance) + this.t('ANYTHING_ELSE')
        }
        const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
    
        this.emit(':ask', speechOutput, repromptSpeech)
    },
    
    listLastTransactions: function(){
        const member = this.attributes.member
        
        return api.listTransactions(member.memberId)
            .then(transactions=>{
                const lastTransactions = (
                    transactions && 
                    transactions.sort((a,b) => b.date - a.date).slice(0, NUM_LAST_TRANSACTIONS)) || []
                
                let speechOutput = ''
                if(lastTransactions.length === 0){
                    speechOutput = this.t('NO_RECENT_TRANSACTIONS_FOUND') + this.t('ANYTHING_ELSE')
                }else{
                    speechOutput = this.t(
                        (lastTransactions.length===1?'ONE_RECENT_TRANSACTION_FOUND':'RECENT_TRANSACTIONS_FOUND'), 
                        lastTransactions.length)
                    lastTransactions.forEach(transaction=>{
                        speechOutput += this.t(
                            'DETAIL_TRANSACTION', 
                            transaction.type, 
                            transaction.points,
                            moment(transaction.date).format('MMDD'),
                            transaction.partner.name)
                    })
                    speechOutput += this.t('ANYTHING_ELSE')
                }
                const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
                this.emit(':ask', speechOutput, repromptSpeech)
            })
            .catch(reason=>{
                console.log('>> Error ListLastTransactions', reason)
                this.emit(':ask', this.t('ERROR') + this.t('ANYTHING_ELSE'), this.t('REPROMPT') + this.t('ANYTHING_ELSE'))
            })
    },
    
    getExpiringPoints: function(){
        this.handler.state = STATES.ACCOUNT_GOT_EXPIRING_POINTS
    
        const member = this.attributes.member
        
        return api.listTransactions(member.memberId)
            .then(transactions=>{
                const expiringAccruals = (
                    transactions && 
                    transactions.filter(t => t.type === 'ACCRUAL' && t.expDate)) || []
                
                let speechOutput = ''
    
                const closest = Math.min.apply(Math, expiringAccruals.map(o => du.daysFromNow(o.expDate)))
    
                if(closest <= 1){
                    const sum = expiringAccruals.filter(a => du.daysFromNow(a.expDate) <= 1).reduce((a,b) => a+b.points, 0)
                    this.event.session.attributes.sumExpPoints = sum
                    speechOutput = this.t('EXPIRING_POINTS_FOUND_1_D', sum)
                }else if(closest <= 7){
                    const sum = expiringAccruals.filter(a => du.daysFromNow(a.expDate) <= 7).reduce((a,b) => a+b.points, 0)
                    this.event.session.attributes.sumExpPoints = sum
                    speechOutput = this.t('EXPIRING_POINTS_FOUND_7_D', sum)
                }else if(closest <= 30){
                    const sum = expiringAccruals.filter(a => du.daysFromNow(a.expDate) <= 30).reduce((a,b) => a+b.points, 0)
                    this.event.session.attributes.sumExpPoints = sum
                    speechOutput = this.t('EXPIRING_POINTS_FOUND_30_D', sum)
                }else if(closest <= 180){
                    const sum = expiringAccruals.filter(a => du.daysFromNow(a.expDate) <= 180).reduce((a,b) => a+b.points, 0)
                    this.event.session.attributes.sumExpPoints = sum
                    speechOutput = this.t('EXPIRING_POINTS_FOUND_180_D', sum)
                }else{
                    speechOutput =  this.t('NO_EXPIRING_POINTS_FOUND')
                }
    
                speechOutput = speechOutput + this.t('ANYTHING_ELSE')
                const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
                this.emit(':ask', speechOutput, repromptSpeech)
            })
    },

    /*
     * STATE: ACCOUNT_GOT_EXPIRING_POINTS
     */
    moreDetails_gep: function(){
        const member = this.attributes.member
        this.handler.state = ''
        
        return api.listTransactions(member.memberId).then(transactions=>{
            const expiringAccruals = (
                transactions && 
                transactions.filter(t => t.type === 'ACCRUAL' && t.expDate).slice(0, NUM_EXPIRING_ACCRUALS)) || []
                
            let speechOutput = ''
            if(expiringAccruals && expiringAccruals.length > 0){
                speechOutput = this.t('DETAIL_EXPIRING_POINTS')
                expiringAccruals.forEach(accrual => {
                    speechOutput = speechOutput + 
                        this.t('EXPIRING_ACCRUAL', 
                            accrual.points,
                            accrual.partner.name,
                            moment(accrual.expDate).format('YYYYMMDD'))
                })
                speechOutput = speechOutput + this.t('ANYTHING_ELSE')
            }else{
                speechOutput = speechOutput + this.t('THATS_ALL_I_KNOW') + this.t('ANYTHING_ELSE')
            }
            const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
            this.emit(':ask', speechOutput, repromptSpeech)
        })
    },

    getRedeemOptions_gep: function(){
        this.handler.state = ''
        const member = this.attributes.member
        const sum = this.event.session.attributes.sumExpPoints
        let speechOutput = ''
        if(sum && sum > 0){
            speechOutput = this.t('REDEEM_OPTIONS_FOR_EXPIRING_POINTS', sum) + this.t('ANYTHING_ELSE')
        }else{
            speechOutput = this.t('REDEEM_OPTIONS_FOR_NO_EXPIRING_POINTS', member.balance) + this.t('ANYTHING_ELSE')
        }
        const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
        this.emit(':ask', speechOutput, repromptSpeech)
    },

    unhandled_gep: function () {
        //fallback to default handler
        this.emit(this.event.request.intent.name)
    },

    /*
     * STATE: ACCOUNT_GOT_BALANCE
     */
    moreDetails_gb: function(){
        const member = this.attributes.member
        this.handler.state = ''
        
        return api.listTransactions(member.memberId).then(transactions=>{
            const lastTransactions = (
                transactions && 
                transactions.slice(0, NUM_LAST_TRANSACTIONS)) || []
                
            let speechOutput = ''
            if(lastTransactions && lastTransactions.length > 0){
                speechOutput = this.t('DETAIL_BALANCE')
                lastTransactions.forEach(transaction => {
                    speechOutput += this.t(
                        'DETAIL_TRANSACTION', 
                        transaction.type, 
                        transaction.points,
                        moment(transaction.date).format('MMDD'),
                        transaction.partner.name)
                })
                speechOutput = speechOutput + this.t('ANYTHING_ELSE')
            }else{
                speechOutput = speechOutput + this.t('THATS_ALL_I_KNOW') + this.t('ANYTHING_ELSE')
            }
            const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
            this.emit(':ask', speechOutput, repromptSpeech)
        })
    },

    getRedeemOptions_gb: function () {
        this.handler.state = ''
        const member = this.attributes.member
        let speechOutput = ''

        if(member.balance && member.balance > 0){
            speechOutput = this.t('REDEEM_OPTIONS_FOR_BALANCE', member.balance) + this.t('ANYTHING_ELSE')
        }else{
            speechOutput = this.t('REDEEM_OPTIONS_FOR_ZERO_BALANCE', member.balance) + this.t('ANYTHING_ELSE')
        }
        const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
        this.emit(':ask', speechOutput, repromptSpeech)
    },

    unhandled_gb: function () {
        this.handler.state = ''
        //fallback to default handler
        this.emit(this.event.request.intent.name)
    }    
}

const handlers = [
    {
        'GetBalance': fn.getBalance,
        'ListLastTransactions': fn.listLastTransactions,
        'GetExpiringPoints': fn.getExpiringPoints},
    Alexa.CreateStateHandler(
        STATES.ACCOUNT_GOT_EXPIRING_POINTS, {
            'MoreDetails': fn.moreDetails_gep,
            'GetRedeemOptionsForInfoPoints': fn.getRedeemOptions_gep,
            'Unhandled': fn.unhandled_gep}),
    Alexa.CreateStateHandler(
        STATES.ACCOUNT_GOT_BALANCE, {
            'MoreDetails': fn.moreDetails_gb,
            'GetRedeemOptionsForInfoPoints': fn.getRedeemOptions_gb,
            'Unhandled': fn.unhandled_gb})
]

module.exports = {handlers, fn}