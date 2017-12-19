'use strict'

const du = require('../dateUtils')
const api = require('../api')

const handlers = {
    
    'CheckRecentOrderStatus': function () {
        const member = this.attributes.member
        api.listOrders(member.memberId)
            .then(orders=>{
                const openOrders = orders
                    .filter(x=>x.status !== 'CLOSED')
                    .sort((a,b)=>a.estimatedDeliveryDate-b.estimatedDeliveryDate)
                
                let speechOutput = ''
                if(openOrders.length === 0){
                    speechOutput = this.t('NO_ORDER_FOUND')
                }else{
                    speechOutput = this.t('ORDER_FOUND', openOrders.length, (openOrders.length>1?'s':''))
                    openOrders.forEach(order=>{
                        if(order.status === 'DELIVERING'){
                            let estimatedDeliveryDate = du.whenToStr(order.estimatedDeliveryDate)
                            speechOutput += this.t('ORDER_BEING_DELIVERED', order.product, estimatedDeliveryDate)
                        }else if(order.status === 'PROCESSING'){
                            speechOutput += this.t('ORDER_BEING_PROCESSED', order.product, du.daysFromNow(order.estimatedDeliveryDate))
                        }
                    })
                }
                speechOutput += this.t('ANYTHING_ELSE')
                const repromptSpeech = this.t('REPROMPT') + this.t('ANYTHING_ELSE')
                this.emit(':ask', speechOutput, repromptSpeech)})
    }
}

module.exports = [handlers]