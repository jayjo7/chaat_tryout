

$(document).ready(function(){
    $("#checkout-trigger, #checkout-trigger2, #checkout-trigger3").click(function(){
   $("#checkout-modal").fadeToggle('fast');
    });
  $("#PayNow").click(function(){
    
    $("#creditcarddetails").show('slow');
});
$("#PayLater").click(function(){
    
    $("#creditcarddetails").hide('slow');
});
});


    isInteger = function (x) {
        return (typeof x === 'number') && (x % 1 === 0);
    };