'use strict'

const { groupBy } = require("lodash");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')
Route.group(() => {

    Route.get('/users', ({request})=>{
        const _ = use('lodash')
        let data = [];
        let limit = parseInt(request.input('limit')) || 5;
        let tmp = request.all()
        for (let index = 0; index < limit; index++) {
            let $tmp = {num:index+1}
            $tmp = _.merge($tmp,tmp)
            data[index] = $tmp
        }
        return data
    })
    Route.get('/gen', async ({request})=>{
        const Database = use('Database')
        const _ = use('lodash')
        const shuffle = use('shuffle-seed')
        const moment = use('moment')
        const Env = use('Env')
        const Help = use('Help');

        try {
            let data = await Database
            .table('user')
            .select(['userId','prefix','name','lastname'])
            .whereRaw(`name REGEXP '[ก-ฮ]' and lastname REGEXP '[ก-ฮ]'`)//หาเฉพาะชื่อและนามสกุลภาษาไทย
            .limit(2)
            .orderByRaw('RAND()')
    
            let dataRes = {}
            dataRes.prefix = _.result(_.head(data),'prefix','')
            dataRes.name = (/^loadtest_/g).test(_.result(_.head(data),'name',''))?_.result(_.head(data),'lastname','') :_.result(_.head(data),'name','')
            dataRes.lastname = _.result(_.last(data),'lastname','')
            dataRes.id = _.map(data,'userId')
            dataRes.raw = _.map(data,'name')

            let idcard = []
            for (let index = 0; index < 13; index++) {
                idcard.push(_.head(shuffle.shuffle(_.range(9),Env.get('APP_KEY')+index+moment().unix())))
            }

            dataRes.num = Help.numthai(_.join(idcard,'')).toTh();
            console.log(Help.get(dataRes,'num','11111'));
            return dataRes
        } catch (error) {
            return error
        }

    });
    Route.get('/get/count', async ({request})=>{
        const Database = use('Database')
        const moment = use('moment')
        const _ = use('lodash')
        try {
            // return await Database.connection('sqlite').table('counter')
            let get = await Database.connection('mysql').raw(`
            SELECT 
            COUNT(*) as CounterToday,
            (SELECT NUM FROM daily WHERE DATE = '${moment().subtract(1, 'days').format('YYYY-MM-DD')}') as Yesterday,
            (SELECT SUM(NUM) AS CountMonth FROM daily WHERE DATE_FORMAT(DATE,'%Y-%m')  = '${moment().format('YYYY-MM')}') as ThisMonth,
            (SELECT SUM(NUM) AS CountMonth FROM daily WHERE DATE_FORMAT(DATE,'%Y-%m')  = '${moment().subtract(1, 'months').format('YYYY-MM')}') as lastMonth,
            (SELECT SUM(NUM) AS CountMonth FROM daily WHERE DATE_FORMAT(DATE,'%Y')  = '${moment().format('YYYY')}') as ThisYear,
            (SELECT SUM(NUM) AS CountMonth FROM daily WHERE DATE_FORMAT(DATE,'%Y')  = '${moment().subtract(1, 'years').format('YYYY')}') as lastYear
            from counter
            `)
            let counter = _.head(_.head(get))
            return counter;
        } catch (error) {
            return error
        }
    })
    Route.get('/count', async ({request})=>{
        const Database = use('Database')
        const moment = use('moment')
        const _ = use('lodash')
        try {
            var p3 = await new Promise( async (resolve, reject) => {
                await Database.transaction(async (trx) => {
                    let count = await trx.table('counter').groupBy('DATE')
                    let $now = moment().format('YYYY-MM-DD')
                    for (const dateArr of count) {
                        let $date = moment(dateArr.DATE).format('YYYY-MM-DD');
                        if($date != $now){
                            await trx.raw(" INSERT INTO daily (DATE,NUM) SELECT '"+$date+"',COUNT(*) AS intYesterday FROM  counter WHERE 1 AND DATE = '"+$date+"'")
                            await trx.raw(" DELETE FROM counter WHERE DATE = '"+$date+"'")
                        }
                    }
                    let $chk = await trx.table('counter').where('DATE',$now).where('IP',request.ip()).count('* as total')
                    $chk = _.result(_.head($chk),'total')
                    if($chk==0){
                        await trx.raw(" INSERT INTO counter (DATE,IP) VALUES ('"+$now+"','"+request.ip()+"') ")
                    }
                    resolve($chk)
                })
              }); 
            
            return p3
        } catch (error) {
            return error
        }
    });
}).prefix('/api/v1')
Route.any('*', 'NuxtController.render')