/**
 * Created by chenxijian on 15/3/23.
 */

var c1 = null;
$(document).ready(function(){

  c1 = cloneObj(clock);

  c1.createNewClock(document.querySelector(".wrap"),{width:200,height:200,percent:50,border_width:10});

});
