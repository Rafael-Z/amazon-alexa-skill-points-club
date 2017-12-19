'use strict'

const Alexa = require('alexa-sdk')
const api = require('../api')
const STATES = require('../states')
const moment = require('moment')

const handlers = []

handlers.push({
    
    'GetRedeemOptions': function () {
        this.emit(':ask', this.t('REDEEM_OPTIONS'))
    },
    
    'GetRedeemOptionsForInfoPoints': function () {
        this.emit('RedeemProduct')
    },
    
    'GetRedeemOffers': function(){
        this.emit(':ask', this.t('SPECIAL_OFFERS_FOUND') + this.t('ANYTHING_ELSE'))
    },
    
    'RedeemProduct': function () {
        const member = this.attributes.member
        const points = this.event.request.intent.slots && this.event.request.intent.slots.points.value
        if(points && points > 0){
            this.emit(':ask', this.t('REDEEM_OPTIONS_FOR_DEFINED_POINTS', points) + this.t('ANYTHING_ELSE'))
        }else if(member.balance > 0){
            this.emit(':ask', this.t('REDEEM_OPTIONS_FOR_BALANCE_ALT', member.balance) + this.t('ANYTHING_ELSE'))
        }else{
            this.emit(':ask', this.t('SPECIAL_OFFERS_FOUND') + this.t('ANYTHING_ELSE'))
        }
    },
    
    'RedeemFlightTicket': function () {
        this.handler.state = STATES.REDEEM_FLIGHT_TICKET
        this.emitWithState('RedeemFlightTicket')
    }

})

const speakDirective = (event, speechOutput)=>{
    const requestId = event.request.requestId
    const token = event.context.System.apiAccessToken
    const endpoint = event.context.System.apiEndpoint
    const ds = new Alexa.services.DirectiveService()
    
    const directive = new Alexa.directives.VoicePlayerSpeakDirective(requestId, speechOutput)
    return ds.enqueue(directive, endpoint, token)
        .catch((err) => {
            console.log('speakDirective error',err)
        })
}    

handlers.push(Alexa.CreateStateHandler(STATES.REDEEM_FLIGHT_TICKET, {

    'RedeemFlightTicket': function () {
        this.handler.state = STATES.REDEEM_FLIGHT_TICKET

        const member = this.attributes.member
        const intent = this.event.request.intent
        const slots = intent.slots

        if (!slots.origin){
            this.emit(':delegate')
        }else if(slots.origin.confirmationStatus !== 'CONFIRMED') {
            if (slots.origin.confirmationStatus !== 'DENIED') {
                let speech = ''
                if((!slots.origin.value || slots.origin.value === '') && (member.address.city && member.address.city !== '')){
                    slots.origin.value = member.address.city
                    speech = this.t('FLIGHT_ORIGIN_HOME_TOWN_CONFIRMATION', slots.origin.value)
                }else{
                    speech = this.t('FLIGHT_ORIGIN_CONFIRMATION', slots.origin.value)
                }
                this.emit(':confirmSlot', 'origin', speech, speech, intent)
            } else {
                const speech = this.t('FLIGHT_ORIGIN_ELICIT')
                this.emit(':elicitSlot', 'origin', speech, speech)
            }
        } else if (slots.destination.confirmationStatus !== 'CONFIRMED') {
            if(!slots.destination.value || slots.destination.value === ''){
                const speech = this.t('FLIGHT_DESTINATION_ASK')
                this.emit(':elicitSlot', 'destination', speech, speech)
            }else if (slots.destination.confirmationStatus !== 'DENIED') {
                if(slots.destination.value === slots.origin.value){
                    const speech = this.t('FLIGHT_DESTINATION_SAME_CITY_ELICIT')
                    this.emit(':elicitSlot', 'destination', speech, speech)
                }else{
                    const speech = this.t('FLIGHT_DESTINATION_CONFIRMATION', slots.destination.value)
                    this.emit(':confirmSlot', 'destination', speech, speech)
                }
            } else {
                const speech = this.t('FLIGHT_DESTINATION_ELICIT')
                this.emit(':elicitSlot', 'destination', speech, speech)
            }
        } else if (slots.date.confirmationStatus !== 'CONFIRMED') {
            if(!slots.date.value || slots.date.value === ''){
                const speech = this.t('FLIGHT_DATE_ASK')
                this.emit(':elicitSlot', 'date', speech, speech)
            }else if (slots.date.confirmationStatus !== 'DENIED') {
                if(moment().startOf('day').diff(moment(slots.date.value).startOf('day')) > 1){
                    let speech = this.t('FLIGHT_PAST') + this.t('FLIGHT_DATE_ELICIT')
                    this.emit(':elicitSlot', 'date', speech, speech)
                }else{
                    const speech = this.t('FLIGHT_DATE_CONFIRMATION', slots.date.value)
                    this.emit(':confirmSlot', 'date', speech, speech)
                }
            } else {
                let speech = this.t('FLIGHT_DATE_ELICIT')
                this.emit(':elicitSlot', 'date', speech, speech)
            }
        } else if(slots.returnTicket.confirmationStatus !== 'CONFIRMED' && 
                slots.returnTicket.confirmationStatus !== 'DENIED'){
            let speech = this.t('FLIGHT_RETURN_TICKET_CONFIRMATION')
            this.emit(':confirmSlot', 'returnTicket', speech, speech)
        } else if(slots.returnTicket.confirmationStatus === 'CONFIRMED' && 
                slots.returningDate.confirmationStatus !== 'CONFIRMED') {
            if(!slots.returningDate.value || slots.returningDate.value === ''){
                let speech = this.t('FLIGHT_RETURN_TICKET_ASK', slots.origin.value)
                this.emit(':elicitSlot', 'returningDate', speech, speech)
            }else if (slots.returningDate.confirmationStatus !== 'DENIED') {
                if(moment(slots.date.value).startOf('day').diff(moment(slots.returningDate.value).startOf('day')) >= 1){
                    let speech = this.t('FLIGHT_RETURN_PAST') + this.t('FLIGHT_DATE_ELICIT')
                    this.emit(':elicitSlot', 'returningDate', speech, speech)
                }else{
                    let speech = this.t('FLIGHT_RETURN_DATE_CONFIRMATION', slots.returningDate.value)
                    this.emit(':confirmSlot', 'returningDate', speech, speech)
                }
            } else {
                let speech = this.t('FLIGHT_RETURN_DATE_ELICIT')
                this.emit(':elicitSlot', 'returningDate', speech, speech)
            }
        } else if(intent.confirmationStatus !== 'DENIED' && intent.confirmationStatus !== 'CONFIRMED'){

            const origin = slots.origin.value
            const destination = slots.destination.value
            const date = slots.date.value
            const returningDate = slots.returningDate.value
    
            speakDirective(this.event, this.t('FLIGHT_SEARCHING'))
                .then(()=>api.listAvaliableFlights(
                    origin,
                    destination, 
                    date,
                    returningDate))
                .then(flights => {

                    const numOptions = flights.length

                    if(numOptions === 0){
                        this.emit(':ask', this.t('FLIGHT_NOT_FOUND', origin, destination) + this.t('ANYTHING_ELSE'))
                    }else{
                        const bestPrice = Math.min.apply(Math, flights.map(o => o.price))
                        const bestPriceFlight = flights.find(o => o.price == bestPrice)

                        let speech = ''
                        let text = ''

                        const accessToken = this.event.session.user.accessToken
                        if (accessToken) {//conected to Facebook
                            if(slots.returnTicket.confirmationStatus === 'CONFIRMED'){//Return ticket option
                                speech = this.t('FLIGHT_FOUND_WITH_RETURN_FB',
                                    numOptions,
                                    origin,
                                    destination, 
                                    moment(date).format('YYYYMMDD'),
                                    moment(returningDate).format('YYYYMMDD'),
                                    bestPriceFlight.price,
                                    bestPriceFlight.departureTime)
                                text = this.t('FLIGHT_FOUND_WITH_RETURN_TEXT',
                                    origin,
                                    destination, 
                                    moment(date).format('MM/DD/YYYY'),
                                    bestPriceFlight.departureTime,
                                    moment(returningDate).format('MM/DD/YYYY'),
                                    bestPriceFlight.price)
                            }else{//no return ticket
                                speech = this.t('FLIGHT_FOUND_FB', 
                                    numOptions,
                                    origin,
                                    destination, 
                                    moment(date).format('YYYYMMDD'),
                                    bestPriceFlight.price,
                                    bestPriceFlight.departureTime)
                                text = this.t('FLIGHT_FOUND_TEXT',
                                    origin,
                                    destination, 
                                    moment(date).format('YYYY/MM/DD'),
                                    bestPriceFlight.departureTime,
                                    bestPriceFlight.price)
                            }
                            api.postFacebook(accessToken, text)
                                .then(()=>{
                                    this.emit(':confirmIntent', speech)})
                        }else{//not conected to Facebook
                            if(slots.returnTicket.confirmationStatus === 'CONFIRMED'){//Return ticket option
                                speech = this.t('FLIGHT_FOUND_WITH_RETURN',
                                    numOptions,
                                    origin,
                                    destination, 
                                    moment(date).format('YYYYMMDD'),
                                    moment(returningDate).format('YYYYMMDD'),
                                    bestPriceFlight.price,
                                    bestPriceFlight.departureTime)
                            }else{//no return ticket
                                speech = this.t('FLIGHT_FOUND', 
                                    numOptions,
                                    origin,
                                    destination, 
                                    moment(date).format('YYYYMMDD'),
                                    bestPriceFlight.price,
                                    bestPriceFlight.departureTime)
                            }
        
                            this.emit(':confirmIntent', speech)
                        }
                    }
                })
        } else if (intent.confirmationStatus === 'CONFIRMED') {
            //TODO API REGISTER LEAD
            this.emit(':ask', this.t('FLIGHT_CONFIRMATION') + this.t('ANYTHING_ELSE'))
        } else if (intent.confirmationStatus === 'DENIED') {
            this.emit(':ask', this.t('FLIGHT_DENIED') + this.t('ANYTHING_ELSE'))
        }
    },

    'AMAZON.CancelIntent': function () {
        this.handler.state = ''
        this.emit(':ask',  this.t('ANYTHING_ELSE'))
    },

    'Unhandled': function () {
        this.handler.state = ''
        //fallback to default handler
        this.emit(this.event.request.intent.name)
    }    

}))

module.exports = handlers
