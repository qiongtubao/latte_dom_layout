var latte_lib = latte.require("latte_lib");
  var latte_dom = latte.require("latte_dom");
  var pieData = latte_lib.object.create({

  })
  var data = {
      x: 20,
      click: function() {
        this.set("x", this.get("x")+10);
      }
  };
  var demo = latte_dom.define("demo", data);