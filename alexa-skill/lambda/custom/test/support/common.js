'use strict'

const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const mock = require('./mock')

exports.alexaShould = function(handler, memberId = 'DEFAULT', state = {}, attributes = {}, request = {}){

    const alexa = mock.alexa(memberId, state, attributes, request)
    
    return {
        reprompt: function(){
            it('should reprompt', () => {
                return testResponse(handler, alexa, /./, /./, /REPROMPT/)
            })
            return this
        },    
        keepSession: function(){
            it('should keep session', () => {
                return testResponse(handler, alexa, /:ask/, /./, /./)
            })
            return this
        },
        quitSession: function(){
            it('should keep session', () => {
                return testResponse(handler, alexa, /:say/, /./, /./)
            })
        },    
        askAnythingElse: function(){
            it('should ask "anything else"', () => {
                return testResponse(handler, alexa, /./, /ANYTHING_ELSE/, /ANYTHING_ELSE/)
            })
            return this
        },
        say: function(regex){
            it('should say ' + regex, () => {
                return testResponse(handler, alexa, /./, regex, /./)
            })
            return this
        },
        emit: function(intent){
            handler.call(alexa)
            it('should emit ' + intent, () => {
                expect(alexa.emit.calledWith(intent)).to.be.true
            })
        }
    }
}

const testResponse = (handler, alexa, cmd, speechOutput, repromptSpeech) => {
    const ret = handler.call(alexa)
    if(ret){
        return expect(ret).to.be.fulfilled.then(() => {
            expect(alexa.emit.calledWithMatch(cmd, speechOutput, repromptSpeech)).to.be.true
        })
    }else{
        expect(alexa.emit.calledWithMatch(cmd, speechOutput, repromptSpeech)).to.be.true
    }
}
