'use strict'
const api = require('../api')

const handlers = {
    
    'AccrualTips': function(){
        this.emit(':ask', this.t('ACCRUAL_TIPS') + this.t('ANYTHING_ELSE')) 
    },

    'IsAccrualPartner': function(){

        const slot = this.event.request.intent.slots.partner
        const resolution = slot && slot.resolutions &&
            slot.resolutions.resolutionsPerAuthority &&
            slot.resolutions.resolutionsPerAuthority.length > 0 &&
            slot.resolutions.resolutionsPerAuthority[0].values.length > 0 &&
            slot.resolutions.resolutionsPerAuthority[0].values[0].value.name

        if(resolution){
            api.listAccrualPartners()
                .then(partners=>{
                    const accrualPartnertner = partners
                        .find(p=>p.name.toUpperCase() === resolution.toUpperCase())
                    if(accrualPartnertner){
                        this.emit(':ask', this.t('ACCRUAL_PARTNER_FOUND', accrualPartnertner.name) + this.t('ANYTHING_ELSE')) 
                    }else{
                        this.emit(':ask', this.t('ACCRUAL_PARTNER_NOT_KNOWN') + this.t('ANYTHING_ELSE')) 
                    }})
        }else{
            this.emit(':ask', this.t('ACCRUAL_PARTNER_NOT_KNOWN') + this.t('ANYTHING_ELSE')) 
        }
    },

    'useVoucher': function () {

        const member = this.attributes.member
        const slots = this.event.request.intent.slots

        if(slots.voucher.confirmationStatus !== 'CONFIRMED') {
            if (slots.voucher.value && slots.voucher.confirmationStatus !== 'DENIED') {
                const speech = this.t('VOUCHER_CONFIRMATION', 
                    slots.voucher.value)
                this.emit(':confirmSlot', 'voucher', speech, speech)
            } else {
                const speech = this.t('VOUCHER_ELICIT')
                this.emit(':elicitSlot', 'voucher', speech, speech)
            }
        } else {

            api.useVoucher(member.id, slots.voucher.value).then(transaction=>{
                console.log('transaction',transaction)
                if(transaction.valid){
                    this.emit(':ask', this.t('USE_VOUCHER_CONFIRMATION', transaction.value) + this.t('ANYTHING_ELSE'))
                }else{
                    this.emit(':ask', this.t('VOUCHER_INVALID') + this.t('ANYTHING_ELSE'))
                }
            })
        }
    }    
}

module.exports = [handlers]