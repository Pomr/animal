var Net = {}
Net.ip = "http://dsq-server.myworld6.com"  // 接口地址
Net.send = function(urlData,reqData,callback){
   // 拼接Url
    var  url = Net.ip + urlData;
    console.log("请求 的地址 ",url);
    console.log("发送的信息：",reqData)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
       if(xhr.readyState == 4){ // 接收完毕
        if(xhr.status >= 200 && xhr.status < 400){// 响应中的数字状态码：表示为有效响应，成功的请求
            var response = xhr.responseText; // 对文本请求的响应
            if(response){
                // console.log("开始解析response 文件");
                var responseJson = JSON.parse(response); // 解析完的json 文件再返回 回调函数
                // console.log("解析完毕，执行回调函数");
                callback(responseJson);
                // console.log(JSON.parse(responseJson))
            }else{
                console.log("返回数据不存在")
                callback(false);
            }
        }else{
           console.log("请求失败");
           callback(false);
       }
   }
}; 
xhr.open("POST",url,true); // param: 1,使用的HTTP方法， 2，请求的url, 3,异步吗？
// xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  //告诉服务器如何解析我的内容
//xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
xhr.send(JSON.stringify(reqData));
},

module.exports = Net;