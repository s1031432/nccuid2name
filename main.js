const request = require('request');
const iconv = require('iconv-lite');
const fs = require('fs');
const nccuapi = "https://moltke.nccu.edu.tw/contactsafe_SSO/showNam.contactsafe?from=app&no="

function queryName(sid) {
    return new Promise((resolve, reject) => {
        request(nccuapi+sid, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": {yourCookie}
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "encoding": null,
            "body": null,
            "method": "GET"
        }, (err, res, buffer) => {
            if(err)
                reject(err);
            html = iconv.decode(Buffer.from(buffer), 'big5');
            sname = html.split(".value='")[1].split("';")[0];
            resolve(sname);
        });
    });
}
function writeCsv(sid, sname){
    fs.appendFile('id2name.csv', sid+","+sname+"\n", function (err) {
        if (err)
            throw err;
        console.log(`-- ${sid}, ${sname}    Append operation complete.`);
    });
}
function getSid(obj){
    for(let i=0;i<obj.length;i++)
        while(String(obj[i]).length<3)
            obj[i] = '0' + String(obj[i]);
    return obj.join('');
}
async function main(){
    let year = 108, dep = 301;
    for(let count=1;count<=200;count++){
        sid = getSid([year, dep, count]);
        sname = await queryName(sid);
        if(sname.length)
            writeCsv(sid, sname);
    }
}
main();