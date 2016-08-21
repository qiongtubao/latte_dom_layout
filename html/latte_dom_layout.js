
(function(define) {'use strict'
	define("latte_dom/c/commands/layout.css", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		module.exports='* {    -webkit-box-sizing: border-box;    -moz-box-sizing: border-box;    box-sizing: border-box;}@media (min-width: 768px) {	.layout-average1 {		width: 100%;	}	.layout-average2 {		width: 50%;	}	.layout-average3 {		width: 33.3333333%;	}	.layout-average4 {		width: 25%;	}	.layout-average5 {		width: 20%;	}	.layout-average6 {		width: 16.6666666%;	}	.layout-average7 {		width: 14.285714286%;	}	.layout-average8 {		width: 12.5%;	}	.layout-average9 {		width: 11.11111111%;	}	.layout-average10 {		width: 10%;	}	.layout-average1 ,.layout-average2 ,.layout-average3 ,.layout-average4 ,.layout-average5 ,	.layout-average6 ,.layout-average7 ,.layout-average8 ,.layout-average9 ,.layout-average10  {		float: left;	}	.layout-percent5 {		width: 5%;	}	.layout-percent10 {		width: 10%;	}	.layout-percent15 {		width: 15%;	}	.layout-percent20 {		width: 20%;	}	.layout-percent25 {		width: 25%;	}	.layout-percent30 {		width: 30%;	}	.layout-percent33 {		width: 33.3%;	}	.layout-percent35 {		width: 35%;	}	.layout-percent40 {		width: 40%;	}	.layout-percent45 {		width: 45%;	}	.layout-percent50 {		width: 50%;	}	.layout-percent55 {		width: 55%;	}	.layout-percent60 {		width: 60%;	}	.layout-percent65 {		width: 65%;	}	.layout-percent66 {		width: 66.66666666%;	}	.layout-percent70 {		width: 70%;	}	.layout-percent75 {		width: 75%;	}	.layout-percent80 {		width: 80%;	}	.layout-percent85 {		width: 85%;	}	.layout-percent90 {		width: 90%;	}	.layout-percent95 {		width: 95%;	}	.layout-percent100 {		width: 100%;		}	.layout-percent5 , .layout-percent10 , .layout-percent15, .layout-percent20 , .layout-percent25, .layout-percent30, .layout-percent33	, .layout-percent35, .layout-percent40, .layout-percent45, .layout-percent50, .layout-percent55, .layout-percent60	, .layout-percent65, .layout-percent66, .layout-percent70, .layout-percent75, .layout-percent80, .layout-percent85	, .layout-percent90, .layout-percent95, .layout-percent100 {		float: left;	}}'
 	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
define("latte_dom/c/commands/layout.js", ["require", "exports", "module", "window"],
function(require, exports, module, window) {

var Command = {};
var latte_lib = require("latte_lib");
var LatteObject = require("../../m/data");
(function() {
	var getMargin = function(str) {
		if(!str) {
			return null;
		}
		var margin = {};
		var attrs = str.split(" ");
		switch(attrs.length) {
			case 0:
				return null;
			break;
			case 1:
				margin.left = +attrs[0];
				margin.right = +attrs[0];
				margin.top = +attrs[0];
				margin.bottom = +attrs[0];
			break;
			case 2:
				margin.top = +attrs[0];
				margin.bottom = +attrs[0];
				margin.left = +attrs[1];
				margin.right = +attrs[1];
			break;
			case 4:
			default:
				margin.top = +attrs[0];
				margin.right = +attrs[1];
				margin.bottom = +attrs[2];
				margin.left = +attrs[3] || 0;
			break;
		}
		return margin;
	}

	var getData = function(str, data) {
		if(!str) {
			return;
		}
		var layoutDatas = latte_lib.format.templateStringFormat(str, data.toJSON()).split(" ");
		var all = 0;
		var allPercentage = 100;
		layoutDatas = layoutDatas.map(function(o) {
			if(o.indexOf("over") != -1) {

			}else if(o.indexOf("%")!=-1) {
				allPercentage -= o.substring(0, o.indexOf("%"));
			}else{
				all += (+o || 0);
				o += "px";
			}
			return o;
		});
		layoutDatas = layoutDatas.map(function(o) {
			if(o.indexOf("over") != -1) {
				o = "calc("+o.replace("over", allPercentage+"% - "+all+"px")+")";
			}	
			return o;			
		});
		return layoutDatas;
	}
	var getClasss = function(layoutData) {
		var layoutDatas = layoutData.split(" ");
		var classs = [];
		layoutDatas.forEach(function(o) {
			var o = o.trim();
			if(o[o.length - 1] != "%" && o.indexOf(".") != -1) {
				throw  new Error("latte-data Error");
			}
			classs.push("layout-percent"+o.substring(0, o.length - 1)); 

		});
		return classs;
	}
	this.before = function(data, dom, controller) {
		var type = dom.attr("latte-layout");
		if(type) {
				var margin = getMargin(dom.attr("latte-layout-margin"));
				if(margin) {
					
					dom.style("margin-left", -margin.left + "px");
					dom.style("margin-right", -margin.right + "px");

				}
				var layoutData = dom.attr("latte-layout-data");

				switch(type) {
					case "auto":
						//初始化
						var layoutClasss ;
						if(layoutData) {
							layoutClasss = getClasss(layoutData);	
						}
						var glassName = "layout-average" + dom.children.length;
						var childs = [];
						
						for(var i = 0, len = dom.children.length; i < len; i++) {
							var o = dom.children[0];
							var row = document.createElement("div");
							
							if(layoutClasss) {
								row.className = layoutClasss[i];
							}else{
								row.className = glassName;
							}
							if(margin) {
								row.style["padding-top"] = margin.top + "px";
								row.style["padding-bottom"] = margin.bottom + "px";
								row.style["padding-left"] = margin.left + "px";
								row.style["padding-right"] = margin.right + "px";
							}
							//转移dom
							dom.removeChild(o);
							row.appendChild(o);
							dom.appendChild(row);

						}
					break;
					case "x":
						
						var change = function() {
							var layoutDatas = getData(layoutData, data);
							//固定横向切割
							if(layoutDatas.length != dom.children.length ) {
								throw new Error("length Error");
							}
							for(var i = 0, len = dom.children.length; i < len; i++) {
								var row = dom.children[i];
								
								row.style["float"] = "left";
								if(layoutDatas[i].indexOf("%") != -1) {
									row.style["overflow-x"] = "auto";
									row.style["overflow-y"] = "auto";
								}
								row.style["width"] = layoutDatas[i];
								
							}
						}
						
						var keys = LatteObject.stringRegExp(layoutData);
						var json = {};

						keys.forEach(function(key) {
							json[key] = data.get(key) || "";
							controller.bind("data", key, change);
						});
						var layoutDatas = getData(layoutData, data);
						if(layoutDatas.length != dom.children.length ) {
							throw new Error("length Error");
						}
						for(var i = 0, len = dom.children.length; i < len; i++) {
							var o = dom.children[0];
							var row = document.createElement("div");
							row.style["float"] = "left";
							if(margin) {
								row.style["padding-top"] = margin.top + "px";
								row.style["padding-bottom"] = margin.bottom + "px";
								row.style["padding-left"] = margin.left + "px";
								row.style["padding-right"] = margin.right + "px";
							}
							if(layoutDatas[i].indexOf("%") != -1) {
								row.style["overflow-x"] = "auto";
								row.style["overflow-y"] = "auto";
							}
							row.style["width"] = layoutDatas[i];
							dom.removeChild(o);
							row.appendChild(o);
							dom.appendChild(row); 
						}
					break;
					case "y":
						var change = function() {
							var layoutDatas = getData(layoutData, data);
							//固定总向切割
							if(layoutDatas.length != dom.children.length) {
								throw new Error("length Error");
							}
							for(var i = 0, len = dom.children.length; i < len; i++) {
								var row = dom.children[i];
								
								if(layoutDatas[i].indexOf("%") != -1) {
									row.style["overflow-x"] = "auto";
									row.style["overflow-y"] = "auto";
								}
								row.style["height"] = layoutDatas[i];
								
							}
						}
						var keys = LatteObject.stringRegExp(layoutData);
						var json = {};

						keys.forEach(function(key) {
							json[key] = data.get(key) || "";
							controller.bind("data", key, change);
						});
						var layoutDatas = getData(layoutData, data);
						for(var i = 0, len = dom.children.length; i < len; i++) {
							var o = dom.children[0];
							var row = document.createElement("div");
							if(margin) {
								row.style["padding-top"] = margin.top + "px";
								row.style["padding-bottom"] = margin.bottom + "px";
								row.style["padding-left"] = margin.left + "px";
								row.style["padding-right"] = margin.right + "px";
							}
							if(layoutDatas[i].indexOf("%") != -1) {
								row.style["overflow-x"] = "auto";
								row.style["overflow-y"] = "auto";
							}
							row.style["height"] = layoutDatas[i];
							dom.removeChild(o);
							row.appendChild(o);
							dom.appendChild(row); 
						}
					break;
				}
			
			
		}
	}
}).call(Command);
require("latte_dom/utils/css.js").importCssString(require("./layout.css"), "latte_layout_basic_css");
module.exports = Command;
});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });