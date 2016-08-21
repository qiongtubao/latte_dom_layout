
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