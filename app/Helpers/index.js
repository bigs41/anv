'use strict'

const BaseHelpers = require('@adonisjs/ignitor/src/Helpers');

const path = require('path')
const pify = require('pify')
const _ = require('lodash');
const collect = require('collect.js');
const { ioc } = require('@adonisjs/fold')
const moment = use('moment');
const parseFormat = use('moment-parseformat')
const fecha = use('fecha');

class Helper extends BaseHelpers{
      encrypt(str,options={}){
        const Env = use('Env')
              ,APP_KEY = Env.get('APP_KEY', '8kwRDYGmYbdpZND3AQLurISX74G5N3sgAmcN1/F4150=')
              if(!this.empty(options.key)){
                APP_KEY = options.key
              }
    
        const LCrypt = use('lcrypt')
              ,lcrypt = new LCrypt(APP_KEY);
        return lcrypt.encode(str)
      }
      decrypt(str,options={}){
        const Env = use('Env')
              ,APP_KEY = Env.get('APP_KEY', '8kwRDYGmYbdpZND3AQLurISX74G5N3sgAmcN1/F4150=')
              if(!this.empty(options.key)){
                APP_KEY = options.key
              }
    
        const LCrypt = use('lcrypt')
              ,lcrypt = new LCrypt(APP_KEY);
        return lcrypt.decode(str).replace('s:6:"','').replace('";','')
      }
      get(items, key, defaultData){
        return !this.empty(_.get(items, key)) ? _.get(items, key, defaultData) : defaultData;
      }
      empty(mixed_var){
        if (!mixed_var || mixed_var == '0') {
            return true;
          }
          if (typeof mixed_var == 'object') {
            for (var k in mixed_var) {
              return false;
            }
            return true;
          }
          return false;
      }
      isNumeric(value){
        return _.isNumber(value) || (!_.isEmpty(value) && !_.isNaN(value));
      }
      getNumber(s){
        if (this.isNumeric(s)) {
          if (typeof s === 'string') {
            s = parseInt(s)
          }
        }
        return s;
      }
      getBoolean(value){
        switch (value) {
          case true:
          case "true":
          case 1:
          case "1":
          case "on":
          case "yes":
            return true;
          default:
            return false;
        }
      }
      numthai(v,to=null) {
        const Number = use('App/Services/Number')
        var num_ber = new Number(v)
        if(!this.empty(to)){
          var resp = collect(to.split("->")).map((r)=>{
            return _.camelCase(r)+'()';
          }).implode('.');
          resp = 'num_ber.'+resp;
          resp = eval(resp);
          return resp;
        }
        return num_ber;
      }
      range(start, stop, step) {
        if (typeof stop == 'undefined') {
              // one param defined
              stop = start;
              start = 0;
          }
          if (typeof step == 'undefined') {
              step = 1;
          }
          if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
              return [];
          }
          var result = [];
          for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
              result.push(i);
          }
          return result;
      }
      strLimit (str, length, chr){
        chr = chr || '…';
        return str.length >= length ? str.substr(0, length - chr.length) + chr : str;
      }
      strFirst(str, find){
        var regex = new RegExp(`^${find}`);
        if (!regex.test(str)) {
          str = `${find}${str}`
        }
        return str
      }
      strLast(str, find){
        var regex = new RegExp(`${find}$`);
        if (!regex.test(str)) {
          str = `${str}${find}`
        }
        return str
      }
      replaceLast(input, find, replaceWith){
        if (!input || !find || !replaceWith || !input.length || !find.length || !replaceWith.length) {
          // returns input on invalid arguments
          return input;
        }
      
        const lastIndex = input.lastIndexOf(find);
        if (lastIndex < 0) {
          return input;
        }
      
        return input.substr(0, lastIndex) + replaceWith + input.substr(lastIndex + find.length);
      }
      callBack ($path='',$func='',$req=[]) {
        const url = `${$path}.${$func}`
        const $instance = ioc.makeFunc(url)
        return $instance.method.apply($instance.instance,$req)
      }
      convertDate($date='',$format='YYYY-M-D h:mm:ss',$set={er:'AD',hl:'en'}){
        moment.locale($set.hl)
        var date = $date
        ,to = $format
        ,format = parseFormat(date)
        ,convert = fecha.parse(date, format)
        ,format2 = moment(convert).format(to)
        if ($set.er=='BD') {
          format2 = moment(convert).add(543,'y').format(to)
        }
        return format2;
      }
      async columnList ($table='',$setting={}) {
        var Config = use('Config')
            ,$seting = Config.get('database.connection')
            ,$config = Config.get('database.'+$seting)
            ,knex = use('knex')($config)
            ,resp =await knex($table).columnInfo()
            ,$get = 'full';
    
            if(typeof $setting == 'string'){
              $get = $setting;
            }else if(!_.isEmpty($setting.get)){
              $get = $setting.get;
            }
            if(typeof $get ==='string'){
                if($get=='full'){
                  return  resp;
                }else{
                  return collect(resp).map((v,k)=>{
                      let $response = {}
                      $response['key'] = k;
                      $response[$get] = v[$get]
                      return $response
                  }).values().all()
                }
            }else{
              return collect(resp).map((v,k)=>{
                let $response = {}
                $response['key'] = k;
                $get.forEach((key,ele)=> {
                  $response[key] = v[key]
                });
                return $response
            }).values().all()
            }
      }
      buildTree(data, options) {
        options = options || {};
        var ID_KEY = options.idKey || 'id';
        var PARENT_KEY = options.parentKey || 'parent';
        var CHILDREN_KEY = options.childrenKey || 'children';
      
        var tree = [],
            childrenOf = {};
        var item, id, parentId;
      
        for (var i = 0, length = data.length; i < length; i++) {
            item = data[i];
            id = item[ID_KEY];
            parentId = item[PARENT_KEY] || 0;
            // ทุกรายการอาจมีลูก
            childrenOf[id] = childrenOf[id] || [];
            // ริเริ่มเด็ก ๆ
            item[CHILDREN_KEY] = childrenOf[id];
            if (parentId != 0) {
                // init its parent's children object
                childrenOf[parentId] = childrenOf[parentId] || [];
                // push it into its parent's children object
                childrenOf[parentId].push(item);
            } else {
                tree.push(item);
            }
        };
      
        return tree;
      }
      json2table(json, classes) {
        var cols = Object.keys(json[0]);
        
        var headerRow = '';
        var bodyRows = '';
        
        classes = classes || '';
      
        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
      
        cols.map(function(col) {
          headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
        });
      
        json.map(function(row) {
          bodyRows += '<tr>';
      
          cols.map(function(colName) {
              if(typeof row[colName] == 'object'){
                  bodyRows += this.json2table(row[colName],classes);
              }else{
                  bodyRows += '<td>' + row[colName] + '</td>';
              }
          })
      
          bodyRows += '</tr>';
        });
      
        return '<table class="' +
               classes +
               '"><thead><tr>' +
               headerRow +
               '</tr></thead><tbody>' +
               bodyRows +
               '</tbody></table>';
      }
}

module.exports = Helper