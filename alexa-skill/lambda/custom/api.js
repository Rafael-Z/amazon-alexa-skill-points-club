'use strict'

const nodeFetch = require('node-fetch')
const FB = require('fb')

const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const gql = require('graphql-tag')

const client = new ApolloClient({
    link: new HttpLink({ 
        uri: 'https://api.graph.cool/simple/v1/cjb9skxon2fi60174ot40otwt',
        fetch: nodeFetch
    }),
    cache: new InMemoryCache()
})

exports.authenticate = function(accessToken){
    console.log('calling authenticate')

    return new Promise((resolve, reject) => {
        if (accessToken) {
            FB.setAccessToken(accessToken)
    
            FB.api('me/?fields=name,first_name,id,email', 'get', fbUser => {
                if(!fbUser || fbUser.error) {
                    console.log(!fbUser ? 'error occurred' : fbUser.error)
                    reject()
                }
                console.log('>> Fb user:', JSON.stringify(fbUser))
                resolve(fbUser)
            })
        }else{
            reject()
        }
    })
}

exports.postFacebook = function(accessToken, text){
    console.log('calling postFacebook')
    
    return new Promise((resolve, reject) => {
        FB.setAccessToken(accessToken)
    
        FB.api('me/feed', 'post', { message: text, privacy: {value: 'SELF'}}, (res) => {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error)
                reject()
            }else{
                console.log('>> Facebook post id:', res.id)
                resolve(res.id)
            }
        })    
    })    
}

exports.getMember = function(memberId){
    console.log('>> call getMember:', memberId)
    return client.query({
        query: gql`
            {
            allMembers(filter:{memberId:"${memberId}"}){
                memberId
                name
                fullname
                email
                balance
                address{
                    city
                }
            }
        }
        `,})
        .then(res => {
            console.log('>> return getMember:', JSON.stringify(res))
            if(res.data.allMembers && res.data.allMembers.length ===1){
                return res.data.allMembers[0]
            }else{
                return
            }
        })
        .catch(
            error => console.error(error))
}

exports.listTransactions = function(memberId){
    console.log('>> call listTransactions', memberId)
    return client.query({
        query: gql`
            {
            allTransactions(filter:{member:{memberId:"${memberId}"}}){
                date
                expDate
        		partner{
                    name
                }
        		points
        		type
            }
        }
        `,})
        .then(res => {
            console.log('>> return listTransactions:', JSON.stringify(res))
            return res.data.allTransactions.slice()
        })
        .catch(
            error => console.error(error))
}

exports.listOrders = function(memberId){
    console.log('>> call listOrders', memberId)
    return client.query({
        query: gql`
            {
            allOrders(filter:{member:{memberId:"${memberId}"}}){
                status
                estimatedDeliveryDate
                product
            }
        }
        `,})
        .then(res => {
            console.log('>> return listOrders:', JSON.stringify(res))
            return res.data.allOrders.slice()
        })
        .catch(
            error => console.error(error))
}

exports.listAccrualPartners = function(){
    console.log('>> call listAccrualPartners')
    return client.query({
        query: gql`
            {
            allPartners(filter: {accrual: true}) {
                id
                name
            }
        }
        `,})
        .then(res => {
            console.log('>> return listAccrualPartners:', JSON.stringify(res))
            return res.data.allPartners.slice()
        })
        .catch(
            error => console.error(error))
}

exports.useVoucher = function(memberId, voucherCode){
    console.log('>> call useVoucher', memberId, voucherCode)
    return client.query({
        query: gql`
            {
            allVouchers(filter: {code: ${voucherCode}}) {
                id
                value
            }
        }
        `,})
        .then(res => {
            console.log('>> return useVoucher:', JSON.stringify(res))
            const voucher = res.data.allVouchers.length === 1 && res.data.allVouchers[0]
            if(voucher){
                return {value:voucher.value, valid:true}
            }else{
                return {value:0, valid:false}
            }
        })
        .catch(
            error => console.error(error))
}

exports.listAvaliableFlights = function(origin, destination, date, returningDate){
    console.log('>> call listAvaliableFlights', origin, destination, date, returningDate)

    origin = origin.toUpperCase()
    destination = destination.toUpperCase()
    
    return client.query({
        query: gql`
            {
            allFlights(filter: {origin: "${origin}", destination: "${destination}"}) {
                origin
                destination
                departureTime
                price
            }
        }
        `,})
        .then(res => {
            console.log('>> return listAvaliableFlights:', JSON.stringify(res))
            return res.data.allFlights.slice()
        })
        .catch(
            error => console.error(error))
}
