/**
 * Created by chenxijian on 15/3/24.
 */

//////////////////////////////////////needed functions///////////////////////////
function cloneObj(obj) {
  var clone = {};

  for (var i in obj) {
    if (obj[i] && typeof obj[i] == 'object') {
      clone[i] = cloneObj(obj[i]);
    } else {
      clone[i] = obj[i];
    }
  }
  return clone;
}

function round(a,b,del){
  return (Math.abs(a-b)<del);
}


function closure(sour,func){
  var source = {};
  for(var p in sour){
    source[p] = sour[p];
  }
  return function(){func(source)};
}

/*select ::after and ::before*/
/*document.stylesheets*/
function ruleSelector(selector) {

  var collections = Array.prototype.concat.apply([], Array.prototype.map.call(document.styleSheets, function(x) {
      return Array.prototype.slice.call(x.cssRules);
    }));

  return collections.filter(function(x){
    return x.selectorText == selector;
  });
}
//////////////////////////////////////////over///////////////////////////////////

/////////////////////////////////////////animation clock process bar//////////////
///////////////////////////////////////////functions on////////////////////////////
//functions :
//createNewClock ---->
//   create a new clock attach to your selected target
//   params include : width  height  step_curve border_width font_size color and percent
//changeXXX ---->
//   change the selected property
//   XXX include : width  height  step_curve border_width font_size color and percent step tar
//getPercent ---->
//   get the percent on the clock
///////////////////////////////////////////functions off//////////////////////////
var clock = {

  /*the increase step of the process*/
  step : 0.2,

  width : 300,

  height : 300,

  clock_change : false,

  unit : null,

  stepCurve : null,

  border : 5,

  step_curve_fixed : function(stepPercent){
    return 30;
  },

  step_curve_square : function(stepPercent){
    return Math.pow((stepPercent - 0.4),2) * 30 + 5;
  },

  clockPercent : function(tar,percent){

    var bar = tar.querySelector(".clock-unit-bar");
    var pipe_left = tar.querySelector(".clock-unit-pipe-left");
    var pipe_right = tar.querySelector(".clock-unit-pipe-right");
    var text = tar.querySelector(".clock-unit-percent");

    text.innerHTML = parseInt(percent) + "%";

    var p = 0;
    if(percent <= 50){
      bar.style.clip = "rect(0px," + this.width + "px," + this.height + "px," + (this.width/2+1) + "px)";
      p = (parseFloat(percent)/50) * 180;
      pipe_right.style.transform = "rotate(" + p + "deg)";
      pipe_right.style.webkitTransform = "rotate(" + p + "deg)";
      pipe_left.style.transform = "rotate(" + p + "deg)";
      pipe_left.style.webkitTransform = "rotate(" + p + "deg)";
    }
    else{
      bar.style.clip = "rect(0px," + this.width + "px," + this.height + "px, 0px)";
      p = parseFloat(percent) / 100 * 360;
      pipe_left.style.transform = "rotate(" + p + "deg)";
      pipe_left.style.webkitTransform = "rotate(" + p + "deg)";
    }

  },

  clockStepUp : function(/*tar,percent,nowPercent,delta*/sour){

    var now = sour.nowPercent;

    if(sour.delta > 0){

      if(round(sour.nowPercent,sour.percent,0.2)){
        sour.thisclass.clockPercent(sour.tar,sour.percent);
        sour.thisclass.clock_change = false;
        return;
      }

      now += sour.thisclass.step;

    }
    else{

      if(round(sour.nowPercent,sour.percent,0.2)){
        sour.thisclass.clockPercent(sour.tar,sour.percent);
        sour.thisclass.clock_change = false;
        return;
      }

      now -= sour.thisclass.step;

    }

    var del = sour.percent - sour.nowPercent;
    del /= sour.delta;
    del = 1 - del;

    sour.thisclass.clockPercent(sour.tar,now);

    var source = {};
    for(var pro in sour){
      source[pro] = sour[pro];
    }
    source.nowPercent = now;
    var thisclass = sour.thisclass;
    source.thisclass = thisclass;
    setTimeout(closure(source,thisclass.clockStepUp),thisclass.stepCurve(del));

  },

  changeClock : function(tar,percent){

    if(this.clock_change)
      return;

    this.clock_change = true;

    var nowPercent = this.getPercent();

    var sour = {};
    sour.tar = tar;
    sour.percent = parseInt(percent);
    sour.nowPercent = nowPercent;
    sour.delta = parseInt(percent) - nowPercent;
    var thisclass = this;
    sour.thisclass = thisclass;
    setTimeout(closure(sour,thisclass.clockStepUp),thisclass.stepCurve(0));

  },

  changeTarget : function(tar){

    this.unit = tar;

  },

  changeStep : function(step){

    var s = step || this.step;

    this.step = s;
  },

  changeStepCurve : function(func){

    var f = func || this.step_curve_square;

    this.stepCurve = f;

  },

  changeSize : function(size){

    if(this.clock_change || !this.unit)
      return;

    this.width = (size.width) || 255;
    this.height = (size.height) || 255;

    this.unit.style.width = this.width + "px";
    this.unit.style.height = this.height + "px";
    this.unit.style.position = "relative";

    var pipe_bar = this.unit.querySelector(".clock-unit-bar");
    var pipe_r = this.unit.querySelector(".clock-unit-pipe-right");
    var pipe_l = this.unit.querySelector(".clock-unit-pipe-left");

    pipe_bar.style.clip = "rect(0px," + this.width + "px," + this.height + "px," + (this.width/2+1) + "px)";
    pipe_r.style.clip = "rect(0px," + (parseInt(this.width/2)+1) + "px," + this.height + "px,0px)";
    pipe_l.style.clip = "rect(0px," + (parseInt(this.width/2)+1) + "px," + this.height + "px,0px)";

    this.changeBorderWidth(this.getBorderWidth());

  },

  changeBorderWidth : function(Border){

    if(this.clock_change || !this.unit)
      return;

    var border_width = (Border) || this.border;

    this.border = border_width;

    var pipe_r = this.unit.querySelector(".clock-unit-pipe-right");
    var pipe_l = this.unit.querySelector(".clock-unit-pipe-left");
    pipe_r.style.borderWidth = border_width + "px";
    pipe_l.style.borderWidth = border_width + "px";

    pipe_l.style.width = (this.width - 2 * this.border) + "px";
    pipe_r.style.width = (this.width - 2 * this.border) + "px";
    pipe_l.style.height = (this.height - 2 * this.border) + "px";
    pipe_r.style.height = (this.height - 2 * this.border) + "px";

    var afterSize = ruleSelector(".clock-unit::after").slice(-1);
    var thisClass = this;
    afterSize.forEach(function(unit){
      unit.style.width = (thisClass.width - thisClass.border * 2) + "px";
      unit.style.height = (thisClass.height - thisClass.border * 2) + "px";
      unit.style.left = thisClass.border + "px";
      unit.style.top = thisClass.border + "px";
    });
  },

  changeFontSize : function(FontSzie){

    if(this.clock_change || !this.unit)
      return;

    var font_size = (FontSzie) || 50;

    var unit_percent = this.unit.querySelector(".clock-unit-percent");
    unit_percent.style.fontSize = font_size + "px";
    unit_percent.style.top = (this.height - font_size * Math.sqrt(2))/2 + "px";

  },

  changeColor : function(color){

    if(color && color != ""){
      this.unit.querySelector(".clock-unit-pipe-left").style.borderColor = color;
      this.unit.querySelector(".clock-unit-pipe-right").style.borderColor = color;
    }

  },

  changePercent : function(percent){

    if(this.clock_change || !this.unit)
      return;

    var per = (percent) || 0;

    this.changeClock(this.unit,per);

  },

  getPercent : function(){

    return parseInt(this.unit.querySelector(".clock-unit-percent").innerHTML);

  },

  getBorderWidth : function(){

    return parseInt(this.unit.querySelector(".clock-unit-pipe").style.borderWidth);

  },

  adjustClock : function(params){

    if(this.clock_change || !this.unit)
      return;

    this.changeStepCurve(params.curve);

    this.changeSize(params);

    this.changeBorderWidth(params.border_width);

    this.changeFontSize(params.font_size);

    this.changeColor(params.color);

    this.changePercent(params.percent);

  },

  createNewClock : function(tar,params){

    var clock = document.createElement("div");
    clock.innerHTML = '<div class="clock-unit"><span class="clock-unit-percent">0%</span>'
    + '<span class="clock-unit-bar">'
    + '<span class="clock-unit-pipe clock-unit-pipe-right"></span>'
    + ' <span class="clock-unit-pipe clock-unit-pipe-left"></span> '
    + '</span></div>';

    this.unit = clock;

    var par = params || {};

    par.color = par.color || "cadetblue";

    this.adjustClock(par);

    tar.appendChild(clock);

    return this.unit;

  }

};


///////////////////////////////////////end/////////////////////////////////////////////////////////