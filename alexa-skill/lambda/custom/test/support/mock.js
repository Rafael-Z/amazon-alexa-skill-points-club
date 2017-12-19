const sinon = require('sinon')
const _api = require('../../api')

exports.alexa = (memberId = 'DEFAULT', state = {}, attributes = {}, request = {}) => ({
    handler: {
        state: state
    },
    attributes: {
        member: members[memberId].member
    },
    event:{
        session: {
            attributes:attributes
        },
        request: request
    },
    t: sinon.stub().callsFake(
        (...a)=>a.join('.').concat('.')),
    emit: sinon.stub().callsFake(
        (...a)=>{
            //console.log(a.join(','))
        })
})

exports.api = ({

    stub: (memberId = 'DEFAULT')=>{
        sinon.stub(_api,'authenticate').resolves(members[memberId].user)
        sinon.stub(_api,'postFacebook').resolves(123)
        sinon.stub(_api,'getMember').resolves(members[memberId].member)
        sinon.stub(_api,'listTransactions').resolves(members[memberId].transactions)
        sinon.stub(_api,'listOrders').resolves(members[memberId].orders)
        sinon.stub(_api,'listAccrualPartners').resolves(partners)
        const useVoucher = sinon.stub(_api,'useVoucher')
        useVoucher.withArgs(undefined, '12345').resolves({value:'12345', valid:true})
        useVoucher.resolves({value:0, valid:false})
        return this
    },
    
    restore: ()=>{
        _api.authenticate.restore()
        _api.postFacebook.restore()
        _api.getMember.restore()
        _api.listTransactions.restore()
        _api.listOrders.restore()
        _api.listAccrualPartners.restore()
        _api.useVoucher.restore()
        return this
    }
})

const members = {
    DEFAULT:{
        user: {
            id:116848329105570
        },
        member: {
            memberId:116848329105570,
            name:'Jim',
            fullName:'Jim Hopper',
            email:'jim_dhrqxky_hopper@tfbnw.net',
            address:{
                city:'Boston'
            },
            balance:15000
        },
        orders:[
            {
                status:'PROCESSING',
                estimatedDeliveryDate:'2017-12-30T20:21:50.944Z',
                product:'Mixer',
                partner:{
                    name:'Walmart'
                }
            }
        ],
        transactions:[
            {
                type:'ACCRUAL',
                points:2000,
                date:'2017-12-01T02:00:00.000Z',
                expDate:new Date(new Date().getTime()+5*24*60*60*1000),
                partner:{
                    name:'Walmart'
                }
            }
        ]
    },
    MEMBER_NEW: {
        user: {
            id:116848329105570
        },
        member: {
            memberId:116848329105570,
            name:'Jim',
            fullName:'Jim Hopper',
            email:'jim_dhrqxky_hopper@tfbnw.net',
            address:{
                city:'Boston'
            },
            balance:0
        },
        orders:[],
        transactions:[]
    },    
    MEMBER_VIP: {
        user: {
            id:116848329105570
        },
        member: {
            memberId:116848329105570,
            name:'Jim',
            fullName:'Jim Hopper',
            email:'jim_dhrqxky_hopper@tfbnw.net',
            address:{
                city:'Boston'
            },
            balance:100000
        },
        orders:[],
        transactions:[
            {
                type:'ACCRUAL',
                points:2000,
                date:'2017-12-01T02:00:00.000Z',
                expDate:new Date(new Date().getTime()+170*24*60*60*1000),
                partner:{
                    name:'Walmart'
                }
            },
            {
                type:'ACCRUAL',
                points:5000,
                date:'2017-12-01T02:00:00.000Z',
                expDate:new Date(new Date().getTime()+175*24*60*60*1000),
                partner:{
                    name:'Walmart'
                }
            }
        ]
    }    
}

const partners = [
    {name:'Jet Blue', accrual:true}, 
    {name:'Delta', accrual:true}, 
    {name:'Virgin', accrual:true}, 
    {name:'Amazon', accrual:true}, 
    {name:'Walmart', accrual:true}, 
    {name:'Verizon', accrual:true}
]