'use strict'

const nodeFetch = require('node-fetch')

const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const gql = require('graphql-tag')

const token = process.argv[2]
console.log('token', token)
const client = new ApolloClient({
    link: new HttpLink({ 
        uri: 'https://api.graph.cool/simple/v1/cjb9skxon2fi60174ot40otwt',
        fetch: nodeFetch,
        headers:{
            Authorization: `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache()
})

const createPartner = (name, accrual = true, redeem = true) =>{
    return client.mutate({
        mutation: gql`
            mutation{
                createPartner(
                    name: "${name}"
                    accrual: ${accrual}
                    redeem: ${redeem}
                ){
                    id
                }
            }
          `})
        .then(res => {
            console.log('partner',res.data.createPartner.id)
            return res.data.createPartner.id
        })
        .catch(
            error => console.error(error))
}

const createVoucher = (code, value) =>{
    return client.mutate({
        mutation: gql`
            mutation{
                createVoucher(
                    code: ${code}
                    value: ${value}
                ){
                    id
                }
            }
            `})
        .then(res => {
            console.log('voucher',res.data.createVoucher.id)
            return res.data.createVoucher.id
        })
        .catch(
            error => console.error(error))
}

const createMember = (memberId, name, fullname, email, balance, city) =>{
    return client.mutate({
        mutation: gql`
            mutation{
                createMember(

                    memberId: "${memberId}"
                    name: "${name}"
                    fullname: "${fullname}"
                    email: "${email}"
                    balance: ${balance}
                    address: {
                        city: "${city}"
                    }
                ){
                    id
                }
            }
          `})
        .then(res => {
            console.log('member',res.data.createMember.id)
            return res.data.createMember.id
        })
        .catch(
            error => console.error(error))
}

const createTransaction = (memberId, type, points, date, expDate, partnerId) =>{
    return client.mutate({
        mutation: gql`
            mutation{
                createTransaction(
                    memberId:"${memberId}"
                    type:${type},
                    points:${points},
                    date:"${date}",
                    expDate:"${expDate}",
                    partnerId:"${partnerId}"
                ){
                    id
                }
            }
            `})
        .then(res => {
            console.log('transaction',res.data.createTransaction.id)
            return res.data.createTransaction.id
        })
        .catch(
            error => console.error(error))
}

const createOrder = (memberId, status, estimatedDeliveryDate, product, partnerId) =>{
    return client.mutate({
        mutation: gql`
            mutation{
                createOrder(
                    memberId:"${memberId}",
                    status:${status},
                    estimatedDeliveryDate:"${estimatedDeliveryDate}",
                    product:"${product}",
                    partnerId:"${partnerId}"
                ){
                    id
                }
            }
            `})
        .then(res => {
            console.log('order',res.data.createOrder.id)
            return res.data.createOrder.id
        })
        .catch(
            error => console.error(error))
}

const createFlight = (origin, destination, departureTime, price) =>{
    return client.mutate({
        mutation: gql`
            mutation{
                createFlight(
                    origin: "${origin}"
                    destination: "${destination}"
                    departureTime: "${departureTime}"
                    price: ${price}
                ){
                    id
                }
            }
            `})
        .then(res => {
            console.log('flight',res.data.createFlight.id)
            return res.data.createFlight.id
        })
        .catch(
            error => console.error(error))
}

const cities = [
    'DETROIT',
    'MIAMI',
    'BOSTON',
    'NEW YORK',
    'CHICAGO',
    'SEATTLE'
]

Promise.all([
    createPartner('Jet Blue', true, true).then(id =>{
        return id
    }),
    createPartner('Delta', true, true).then(id =>{
        return id
    }),
    createPartner('Virgin', true, true).then(id =>{
        return id
    }),
    createPartner('Amazon', true, true).then(id =>{
        return id
    }),
    createPartner('Walmart', true, true).then(id =>{
        return id
    }),
    createPartner('Verizon', true, true).then(id =>{
        return id
    }),
    createPartner('Gap', true, true).then(id =>{
        return id
    }),
    createPartner('Best Buy', true, true).then(id =>{
        return id
    })
]).then(partnerIds => {
    return Promise.all([
        createMember('109150403209514', 'Dustin', 'Dustin Henderson', 'dustin_sxznxxi_henderson@tfbnw.net', 0, 'Detroit'),
        
        createMember('115070242617217', 'Will', 'Will Byers', 'will_jlmbefu_byers@tfbnw.net', 95000, 'Miami').then(id =>{
            createTransaction(id, 'ACCRUAL', 1000, '2017-12-01T02:00:00.000Z', '2018-02-01T02:00:00.000Z', partnerIds[4])
            createOrder(id, 'PROCESSING', '2017-12-30T20:21:50.944Z', 'Fujifilm Camera', partnerIds[7])
        }),
        
        createMember('116848329105570', 'Jim', 'Jim Hopper', 'jim_dhrqxky_hopper@tfbnw.net', 145000, 'Boston').then(id =>{
            createTransaction(id, 'ACCRUAL', 1000, '2017-12-01T02:00:00.000Z', '2018-02-01T02:00:00.000Z', partnerIds[4])
            createTransaction(id, 'REDEEM', 30000, '2017-11-20T02:00:00.000Z', '2017-11-20T02:00:00.000Z', partnerIds[3])
            createTransaction(id, 'ACCRUAL', 500, '2017-11-19T02:00:00.000Z', '2017-12-30T02:00:00.000Z', partnerIds[5])
            createOrder(id, 'PROCESSING', '2017-12-30T20:21:50.944Z', 'Mixer', partnerIds[4])
            createOrder(id, 'DELIVERING', '2017-12-29T20:21:50.944Z', 'Coffe Machine', partnerIds[7])
            createOrder(id, 'CLOSED', '2017-11-01T20:21:50.944Z', 'Shirt', partnerIds[6])
        })])
})

createVoucher(12345, 1000)
createVoucher(23456, 2000)
createVoucher(34567, 3000)
createVoucher(45678, 4000)
createVoucher(56789, 5000)
createVoucher(67890, 6000)

cities.forEach(origin=>{
    cities.forEach(destination=>{
        if(origin !== destination){
            ['08:45', '10:15', '21:30'].forEach(departureTime =>{
                createFlight(origin, destination, departureTime, Math.trunc(Math.random()*100)*1000)
            })
        }
    })
})


