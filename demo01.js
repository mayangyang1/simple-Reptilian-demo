var http = require('http'); //node的核心模块
var url = 'http://www.vjshi.com/zhongguo.html';//爬虫爬取地址
var cheerio = require('cheerio'); //抓取页面模块
var fs = require('fs'); //node核心模块 文件模块
var Koa = require('koa'); 

const app = new Koa();

app.use(async (ctx) =>{
    ctx.body = 'hello world';
})
app.listen(3000, ()=> {
    console.log('Server is runing at port 3000');
})

function getVideoList(html) {
    var $ = cheerio.load(html);
    var videoList = $('.card-title').find('a');
    var videoArr = [];
    videoList.each((index, value) => {
        var obj = {};
        obj.url = $(value).attr('href');
        obj.title = $(value).text().replace(/\n/g, "").replace(/\s/g, "")
        videoArr.push(obj);
    })
    var data = JSON.stringify({ title: '爬虫数据', list: videoArr });
    return data

}

http.get(url, function(res){//发送get请求
    var html = '';
    res.on('data', function(data){
        html += data;
    })
    res.on('end', function(){
         var content = getVideoList(html);
        fs.writeFile('./index.json',content, function(err) {
            console.log(err)
        })
    })
}).on('error', function(){
    console.log('获取资源出错');
})
