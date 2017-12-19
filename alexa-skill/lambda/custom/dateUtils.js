'use strict'
const moment = require('moment')

exports.daysFromNow = function(d1) {
    return moment(d1).diff(moment(),'days')
}

exports.whenToStr = function(d1){
    if(moment(d1).isSame(moment(), 'day')){
        return 'today'
    }else if(moment(d1).isSame(moment().add(1, 'days'), 'day')){
        return 'tomorrow'
    }else{
        return 'in ' + moment(d1).diff(moment(),'days') + ' days'
    }
}