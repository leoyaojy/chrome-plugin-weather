var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    api = "http://widget.thinkpage.cn/api/weather?flavor=bubble&location=WX4FBXXFKE4F&geolocation=enabled&position=top-right&margin=0px%200px&language=zh-chs&unit=c&theme=chameleon&uid=U3816AF56B&hash=aa5b2d23df45bcc88f28908ecf64e0a5";

$.ajax({
    url: api,
    type: "GET",
    success: function(d) {
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
            hour = new Date(last_update).getHours() >= 10 ? new Date(last_update).getHours() : "0" + new Date(last_update).getHours(),
            minutes = new Date(last_update).getMinutes() >= 10 ? new Date(last_update).getMinutes() : "0" + new Date(last_update).getMinutes(),

            aqi = air.aqi,
            quality = air.quality;
        $(daily).each(function(index, el) {
            var date = new Date(this.date),
                i = date.getDay(),
                month = date.getMonth() + 1,
                today = date.getDate();
            var day = index === 0 ? "今天" : (index === 1 ? "明天" : week[i]);
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
        $("#updateTime").text(hour + ":" + minutes + "发布");
        $("#pic").find("img").attr("src", "./imgs/" + code + ".svg").end().find('p').first().text(temperature + "℃").next().text(text);
        $("#info").html(`
			<li>${wind_direction}风<p>${wind_scale}级</p></li>
			<li>空气${quality}<p>${aqi}</p></li>
			<li>相对湿度<p>${humidity}</p></li>
			`);
    }
});
