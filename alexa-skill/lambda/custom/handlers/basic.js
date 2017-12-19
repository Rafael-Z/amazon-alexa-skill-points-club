'use strict'

const handlers = {
    
    'LaunchRequest': function () {
        const member = this.attributes.member
        if(member && member.name){
            const speechOutput = this.t('WELCOME_POINTS_CLUB', member.name)
            const repromptSpeech = this.t('REPROMPT')
            this.emit(':ask', speechOutput, repromptSpeech)
        }else{
            const speechOutput = this.t('USER_NOT_FOUND')
            this.emit(':tell', speechOutput)
        }
    },
    
    'MoreDetails': function(){
        this.emit(':ask', this.t('THATS_ALL_I_KNOW') + this.t('ANYTHING_ELSE'), this.t('REPROMPT'))
    },

    'Unhandled': function () {
        this.emit(':ask', this.t('UNHANDLED') + this.t('ANYTHING_ELSE')) 
    },
    
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t('HELP')) 
    },
    
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('GOOD_BYE'))
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('GOOD_BYE'))
    }
}

module.exports = [handlers]