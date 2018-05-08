const request = require('request');
const fs = require('fs');
const mongoose = require('mongoose');
const _ = require('underscore');
const url = '';

const dbHost = 'mongodb://localhost:27017/brokers';
mongoose.connect(dbHost);

const officeSchema = new mongoose.Schema({

  }, {
    versionKey: false,
    strict: false
  });

const brokerSchema = new mongoose.Schema({

  }, {
    versionKey: false,
    strict: false
  });

// create mongoose model
const Office = mongoose.model('Office', officeSchema);
const Broker = mongoose.model('Broker', brokerSchema);

let __VIEWSTATE, __VIEWSTATEGENERATOR, __PREVIOUSPAGE, __EVENTVALIDATION;

let opts1 = {
  method: 'GET',
  url: `${url}`
};

let setGlobals = function(body){
  __VIEWSTATE = body.split('id="__VIEWSTATE"')[1].split('value=')[1].split('/>')[0].replace(/"/g, '').trim();
  __VIEWSTATEGENERATOR = body.split('id="__VIEWSTATEGENERATOR"')[1].split('value=')[1].split('/>')[0].replace(/"/g, '').trim();
  __PREVIOUSPAGE = body.split('id="__PREVIOUSPAGE"')[1].split('value=')[1].split('/>')[0].replace(/"/g, '').trim();
  __EVENTVALIDATION = body.split('id="__EVENTVALIDATION"')[1].split('value=')[1].split('/>')[0].replace(/"/g, '').trim();
}

let extractOffices = function(body){
  let rows = body.split('<tbody>')[1].split('</tbody>')[0].split('<tr role="row">');
  _.each(rows, (row) => {
    let tds = row.replace(/\r\n/g, '').split('</tr>')[0].split('</td>');
    let id, name, phone, fax
    // console.log(tds)
    for(let i = 0; i < tds.length; i++){
      let td;
      if(_.contains([0, 1, 3, 4], i)){
        td = tds[i]
        td = td.split('>')[1] && td.split('>')[1].trim();
        // console.log(td)
      }
      if(i == 0)
        id = td
      if(i == 1)
        name = td
      if(i == 3)
        phone = td
      if(i == 4)
        fax = td
    }
    console.log(id, name, phone, fax);
    if(id){
      Office.create({
        Id: id,
        Name: name,
        Phone: phone,
        Fax: fax
      });
    }

  });
}

let doPostBack = function(__VIEWSTATE, __VIEWSTATEGENERATOR, __PREVIOUSPAGE, __EVENTVALIDATION){
  return new Promise ((resolve, reject) => {

    let opts2 = { method: 'POST',
    url: `${url}`,
    headers:
     { 'postman-token': '57ffb0f6-6a17-13cf-ed05-595b36b10745',
       'cache-control': 'no-cache',
       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData:
     { 'ctl00$ScriptManager': 'ctl00$ctl41$g_abd3365c_023a_4039_b1e7_7a206132c5e4$pnlUpdateBroker|ctl00$ctl41$g_abd3365c_023a_4039_b1e7_7a206132c5e4$dpPager$ctl03$ctl00',
       _maintainWorkspaceScrollPosition: '0',
       __SCROLLPOSITIONX: '0',
       __SCROLLPOSITIONY: '0',
       'ctl00$ctl41$g_abd3365c_023a_4039_b1e7_7a206132c5e4$ddlSearchBy': 'REN',
       'ctl00$ctl41$g_abd3365c_023a_4039_b1e7_7a206132c5e4$txtValue': '',
       'ctl00$g_3cbed4d4_ed38_4738_9878_2ae770f07a98$hdnPollID': '1',
       'ctl00$g_e5363758_1487_4a07_a46d_6afa56c1cf91$txtEmail': '',
       __EVENTTARGET: 'ctl00$ctl41$g_abd3365c_023a_4039_b1e7_7a206132c5e4$dpPager$ctl03$ctl00',
       __EVENTARGUMENT: '',
       __LASTFOCUS: '',
       __VIEWSTATE: __VIEWSTATE,
       __VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
       __PREVIOUSPAGE: __PREVIOUSPAGE,
       __EVENTVALIDATION: __EVENTVALIDATION} };

    request(opts2, function (error, response, body) {
      resolve({body: body});
    });

  })
}

let callAPi = async function(){
  let res1 = await new Promise ((resolve, reject) => {
    request(opts1, function(error, response, body){
      resolve({body: body});
    })
  })
  let body = res1.body

  extractOffices(body);
  setGlobals(body);


  (function myLoop (i) {
     setTimeout(async function () {
        let res2 = await doPostBack(__VIEWSTATE, __VIEWSTATEGENERATOR, __PREVIOUSPAGE, __EVENTVALIDATION);
        let body = res2.body;
        extractOffices(body);
        setGlobals(body);
        console.log(i);
        // console.log(body);
        if (--i) myLoop(i);
     }, 30000)
  })(160);

}

callAPi();




// console.log(body.split('"NextPageLink" href=')[1].split('>Next')[0].replace(/&#39;/g, "'"));
// if(body.indexOf('"NextPageLink" href=') > -1){
//   NextPageLink = body.split('"NextPageLink" href=')[1].split('>Next')[0];
// }
// console.log(NextPageLink)
// for(){
//
//   if(lastIndex && NextPageLink){
//     callAPi();
//   }
// }

// console.log(res1.body.split('<tbody>')[1].split('<tr role="row">')[1].split('</td>')[0].replace('<td>', '').trim())
// Broker.create({
//   name: 'sdsf',
//   age: 98
// });

// Office.create({
//   name: 'dsfs',
//   age: 98
// });

// fs.appendFile('public/1.html', res1.body, (err) => {
// if(err)
//   console.log('Error happened while saving log');
// });
