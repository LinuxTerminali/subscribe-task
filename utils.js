const csv = require('csvtojson')
const request = require('request')
const map_month = require('./map_month')

module.exports = {

    gainLoss: async function  (jsonArray,actual_month) {
        try {
            //const jsonArray = await csv().fromFile('sample-subscribers.csv')
            if(! (/^\d+$/.test(actual_month))){
                actual_month = map_month[actual_month]
            }
            var month = actual_month - 1
            var data = {}
            var comp = await module.exports.comparision(jsonArray)
            if (comp.hasOwnProperty(month)) {
                if (month === 0) {
                    data = {'gained': comp['0'], 'lost': 0}
                } else {
                    if (comp[month]['total'] - comp[month - 1]['total'] > 0) {
                        data = {'gained': comp[month]['total'] - comp[month - 1]['total'], 'lost': 0}
                    } else {
                        data = {'gained': 0, 'lost': comp[month - 1]['total'] - comp[month]['total']}
                    }
                }
            } else {
                console.log('Invalid Month')
                throw 'Either you have Entered a invalid month or csv does not contain data for that month'
            }
            return data
        } catch (e) {
            console.log(e)
            throw e
        }
    },
    subsDivision: async function(jsonArray, actual_month){
        try{
            if(! (/^\d+$/.test(actual_month))){
                actual_month = map_month[actual_month]
            }
            var month = actual_month - 1
            var total = await module.exports.getTotal(jsonArray, month)
            if (total.hasOwnProperty(month)) {
                var data = await {'Liberator': module.exports.getSubscriberType(total, 'Liberator').length, 'GameChanger': module.exports.getSubscriberType(total, 'GameChanger').length, 'Disruptor': module.exports.getSubscriberType(total, 'Disruptor').length}
                console.log(data)
                return data
            } else {
                console.log('Invalid Month')
                throw 'Either you have Entered a invalid month or csv does not contain data for that month'
            }
        }catch(e){
            throw e
        }

    },
    getSubscriberType : function (jsonArray, type) {
        var total = jsonArray.filter(function (marker) {
            return marker['Subscription Type'] === type
        })
        return total
    },
    getTotal: function  (jsonArray, month) {
        var total = jsonArray.filter(function (marker) {
            return new Date(marker['Subscription Start date']).getMonth() === month
        })
        return total
    },
    comparision: function  (jsonArray) {
        var data = {}
        jsonArray.filter(function (marker) {
            var markerDate = new Date(marker['Subscription Start date'])
            data[markerDate.getMonth()] = {'total': (data[markerDate.getMonth()] === undefined) ? 1 : data[markerDate.getMonth()]['total'] + 1}
        })
        return data
    }
}