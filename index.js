

const express = require('express');
const app = express();
const utils = require('./utils')
const csv = require('csvtojson')
const request=require('request')
const url  = 'https://www.newslaundry.com/sample-data/sample-subscribers.csv'

app.get('/', async function(req,res){
    return res.send("Wrong side bro, try /subscribers or /division for actual work.")
})

app.get('/subscribers', async function(req, res){
    try{
        if(req.query.hasOwnProperty('month')){
            var csv_result = await csv().fromStream(request.get(req.query.url || url))
            .subscribe((json)=>{
                return new Promise((resolve,reject)=>{
                    resolve(json)
                })
            });
            var result = await utils.gainLoss(csv_result,req.query.month)
            return res.status(200).json({
                'status': 'success',
                'result':result
            })
        }else{
            return res.status(400).json({
                'status': 'fail',
                'err': 'month is missing'
            });
        }
    }catch(e){
        return res.status(400).json({
            'status': 'fail',
            'err': e
        });
    }

   
});

app.get('/division', async function(req, res){
    try{
        if(req.query.hasOwnProperty('month')){
            var csv_result = await csv().fromStream(request.get(req.query.url || url))
            .subscribe((json)=>{
                return new Promise((resolve,reject)=>{
                    resolve(json)
                })
            });
            var result = await utils.subsDivision(csv_result,req.query.month)
            return res.status(200).json({
                'status': 'success',
                'result':result
            })
        }else{
            return res.status(400).json({
                'status': 'fail',
                'err': 'month is missing'
            });
        }
    }catch(e){
        return res.status(400).json({
            'status': 'fail',
            'err': e
        });
    }

   
});

app.listen(3000);