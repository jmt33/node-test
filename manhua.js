var	fs = require('fs'),
	request = require('request'),
	http = require('http'),
	mysql = require('mysql'),
	$ = require('jquery').create(),
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'cartoon'
	});
var manhua = {
	url: 'http://book.2345.com/manhua/1021.html',
	baseUrl: 'http://mhimg.ali213.net',
	pageEnd: false,
	init: function()
	{
		connection.connect(function(err) { // The server is either down
			if (err) {
				console.log('error when connecting to db:', err);
			}
		});
		this.run();
	},
	run: function()
	{
		var _this = this;
		$.get(this.url, function(data) {
			$(data).find('.cartoon_chapter li').each(function() {
				var cUrl = $(this).find('a').attr('href');
				pName = $(this).text();
				// connection.query(
				// 'INSERT INTO sets (sid, name, url) VALUES (1, "'+pName+'", "'+cUrl+'")',
				// function(err, result) {
				// 	console.log(result);
				// });
				if (!_this.pageEnd) {
					_this.getCartoonUrl(cUrl, 0);
				} else {
					console.log('sadgadsg');
				}
			});
		});
	},
	getCartoonUrl: function(cUrl, num)
	{
		var _this = this;
		request(cUrl, function(error, response, page) {
			var evals = page.match(/eval\((.*)\)\s+;\s+/);
			var four = evals[1].match(/'(var.*)[|?]'\.split(.*)/);
			var values = evals[1].match(/\}\('(.*)',(.*),(.*),(.*),(.*),(.*)\)/);
			var hash = _this.matchPath(values[1], values[2], values[3], four[1], values[5]);
			request(_this.baseUrl + hash + num + '.jpg', function(error, response, page) {
				if (!error && response.statusCode !== 403 && response.statusCode !== 404) {
					num = num + 5;
					console.log(_this.baseUrl + hash + num + '.jpg');
					_this.pageEnd = false;
					_this.getCartoonUrl(cUrl, num + 1);
				} else {
					_this.pageEnd = true;
				}
			});
		});
		return true;
	},
	matchPath: function(one, two, three, four, five)
	{
		one = one.replace(/\\/g, '');
		eval(function(p, a, c, k, e, d) {
			e = function(c) {
				return c.toString(36);
			};
			if (!''.replace(/^/, String)) {
				while (c--) {
					d[c.toString(a)] = k[c] || c.toString(a);
				}
				k = [
					function(e) {
						return d[e];
					}
				];
				e = function() {
					return '\\w+';
				};
				c = 1;
			}
			while (c--) {
				if (k[c]) {
					p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
				}
			}
			return p;
		}(one, two * 1, three * 1, four.split('|'), five * 1, {}));
		return imgpath;
	}
};


manhua.init();