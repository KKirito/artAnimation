/**
 * Created by chenxijian on 15/3/23.
 */


$(document).ready(function(){

  var c1 = cloneObj(clock);

  c1.createNewClock(document.querySelector(".wrap"),{width:200,height:200,percent:50});

});
