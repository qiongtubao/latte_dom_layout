
(function(define) {'use strict'
define("latte_dom/c/commands/layout.js", ["require", "exports", "module", "window"],
function(require, exports, module, window) {

var Command = {};
var latte_lib = require("latte_lib");
var LatteObject = require("../../m/data");
(function() {
	var getWidth = function(dom) {
		return dom.attr("width") || dom.css("width");
	}
	var getHeight = function(dom) {
		return dom.attr("height") || dom.css("height");
	}
	this.before = function(data, dom, controller) {
		var layoutData = dom.attr("latte-layout");
		if(layoutData) {
			var layoutType = dom.attr("latte-layout-type");
			var change = function() {
				
				var layoutDatas = latte_lib.format.templateStringFormat(layoutData, data.toJSON()).split(" ");
				var all = 0;
				var allPercentage = 100;
				layoutDatas.forEach(function(o) {
					if(o.indexOf("over") != -1) {

					}else if(o.indexOf("%")!=-1) {
						allPercentage -= o.substring(0, o.indexOf("%"));
					}else{
						all += (+o || 0);
					}
				});


				var childrens = dom.node().children;
				if(childrens.length != layoutDatas.length) {
					throw new Error("length Error");
				}
				switch(layoutType) {
					case "horizontal":
				
						//dom.node().childrens.length == layoutDatas.length;
						
						
						layoutDatas.forEach(function(o,index) {
							var width;
							if(o.indexOf("over") != -1) {
								width = "calc("+o.replace("over", allPercentage+"% - "+all+"px")+")";
								console.log(width);
							}else{
								width = o;
							}
							childrens[index].style["height"] = "100%";
							childrens[index].style["float"] = "left";
							childrens[index].style["width"] = width;
						});
					break;
					default:
						layoutDatas.forEach(function(o, index) {
							var height;
							if(o.indexOf("over") != -1) {
								height = "calc("+o.replace("over", allPercentage+"% - "+all+"px")+")";
							}else{
								height = o;
							}
							childrens[index].style["height"] = height;
							childrens[index].style["width"] = "100%";

						});
					break;
				}
			}
			


			var keys = LatteObject.stringRegExp(layoutData);
			var json = {};

			keys.forEach(function(key) {
				json[key] = data.get(key) || "";
				controller.bind("data", key, change);
				
			});
			change();
			//view.node().className = view.node().className + " " +latte_lib.format.templateStringFormat(classStr, json);
				
		}
		
	}
}).call(Command);
module.exports = Command;
});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });