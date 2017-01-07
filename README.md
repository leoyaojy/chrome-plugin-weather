目录结构：
```
├── css
│   └── main.css
├── imgs
│   ├── icon-128.png
│   ├── icon-16.png
│   ├── icon-19.png
│   └── icon-38.png
├── js
│   ├── jquery.js
│   └── main.js
├── manifest.json
└── popup.html
```
效果图:

![](http://ww2.sinaimg.cn/large/005K0nVZgw1fbhym8jwlqj308d0e7mya.jpg)
#### manifest.json
---
入口文件，每个`Chrome`插件都必须包含一个`manifest.json`文件，其中必须包含`name`、`version`和`manifest_version`属性
```
{
    "manifest_version": 2,
    "version": "1.0",
    "name": "weather",
    "description": "a chrome extension for local weather",
    "icons": {
         "128": "imgs/icon-128.png",
         "16": "imgs/icon-16.png"
    },
    "browser_action": {
        "default_icon": {
            "19": "imgs/icon-19.png",
            "38": "imgs/icon-38.png"
        },
        "default_title": "weather",
        "default_popup": "popup.html"
    },
    "permissions":[
    	"http://*/*",
    	"https://*/*"
    ]
}
```
属性说明：
- `manifest_version`：此键指定此扩展使用的`manifest.json`的版本，目前必须是2
- `version`：插件版本号
- `name`：插件名称
- `description`：插件描述
- `icons`：插件图标，`Chrome`扩展程序页显示
- `browser_action`：指定插件在`Chrome`工具栏中的显示信息
	1. `default_icon`：图标
	1. `default_title`：标题
	1. `default_popup`：弹出页
- `permissions`：权限
注意:如果我们需要向服务器请求数据，就需要在`permissions`中添加请求数据的接口，否则会报跨域请求的限制。但是如果需要向多个接口请求数据，建议直接按我的方式书写匹配规则，这样不管多少接口都适用

#### popup.html
---
`popup`页面是当用户点击插件图标时，展示在图标下方的页面
```
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="UTF-8">
    <title>Weather</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <div class="container">
        <div id="today">
            <h1 id="city">北京</h1>
            <h3 id="updateTime">09:00发布</h3>
            <div id="pic">
                <img src="./imgs/0.svg" alt="" />
                <p>8℃</p>
                <p>晴</p>
            </div>
            <ul id="info"></ul>
        </div>
        <div id="future">
            <ul id="list"></ul>
        </div>
    </div>
    <script src="js/jquery.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```
这里我们使用了`jQuery`，方便对`dom`元素进行操作，注意我们不能直接在`html`里写`js`代码，只能通过外部引用的方式引入`js`文件，`css`也一样
#### main.js
---
`ajax`请求接口数据并渲染到`popup`页面中去，这里使用的是[心知天气](http://www.thinkpage.cn/)的`api`接口，但是发现使用它提供的免费数据`api`只能获取最多三天的天气预报数据，而且默认提供的图标不是我想要的风格，需调用多个接口才能实现基本功能。后来发现它也有提供[插件](http://www.thinkpage.cn/widget/intro)的服务，只需要简单的几行`js`代码就可以实现酷炫天气效果，在控制台`Network`分析面板提取了它的`api`接口，可获取近五天的天气情况，一个接口就可以很方便地实现所需要的功能，我这里代码使用了`ES6`模板字符串，减少了对字符串拼接的操作
```
var week = ['周日','周一','周二','周三','周四','周五','周六'],
api="http://widget.thinkpage.cn/api/weather?flavor=bubble&location=WX4FBXXFKE4F&geolocation=enabled&position=top-right&margin=0px%200px&language=zh-chs&unit=c&theme=chameleon&uid=U3816AF56B&hash=aa5b2d23df45bcc88f28908ecf64e0a5";

$.ajax({
	url:api,
	type:"GET",
	success:function(d){
		var w = d.weather,
		city = w.location.name,
		air = w.air.city,
		now = w.now,
		daily = w.daily,

		text = now.text,
		code = now.code,
		temperature = now.temperature,
		humidity = now.humidity,
		wind_direction = now.wind_direction,
		wind_scale = now.wind_scale,
		last_update = now.last_update,
		hour = new Date(last_update).getHours()>=10?new Date(last_update).getHours():"0"+new Date(last_update).getHours(),
		minutes = new Date(last_update).getMinutes()>=10?new Date(last_update).getMinutes():"0"+new Date(last_update).getMinutes(),

		aqi = air.aqi,
		quality = air.quality;
		$(daily).each(function(index, el) {
			var date = new Date(this.date),
			i = date.getDay(),
			month = date.getMonth()+1,
			today = date.getDate();
			var day = index === 0?"今天":(index===1?"明天":week[i]);
			$("#list").append(`
				<li>
					<div class="date">
						${day} ${month}/${today}
					</div>
					<div class="weather">
						<img src="./imgs/${this.code_day}.svg" alt="">
						<span>${this.text_day}/${this.text_night}</p>
					</div>
					<div class="tempRange">
						${this.low}/${this.high}℃
					</div>
				</li>
				`);
		});
		$("#city").text(city);
		$("#updateTime").text(hour+":"+minutes+"发布");
		$("#pic").find("img").attr("src","./imgs/"+code+".svg").end().find('p').first().text(temperature+"℃").next().text(text);
		$("#info").html(`
			<li>${wind_direction}风<p>${wind_scale}级</p></li>
			<li>空气${quality}<p>${aqi}</p></li>
			<li>相对湿度<p>${humidity}</p></li>
			`);
	}
});
```
