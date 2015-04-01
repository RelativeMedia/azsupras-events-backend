$('.datepicker').datetimepicker();

$('body').on('click', '#deleteEventPricingItem', function(event){
  event.preventDefault();
  var $this = $(this);
  console.log($this);
  $this.closest('tr').slideUp('fast').remove();
});


function validatePrice(amount){
  var amountRegExp = new RegExp('^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$');
  return amountRegExp.test( amount );
}
window.prices = [];
$('#addEventPricing').click(function(event){
  event.preventDefault();
  var $this   = $(this);
  var $amount = $('#priceAmount');
  var $name   = $('#priceName');
  var $table  = $('#createEventPricingTable');
  if( validatePrice($amount.val()) ){
    var price = { name: $name.val(), amount: $amount.val() };
    prices.push(price);
    $table.children('tbody').append('<tr><td>' + $name.val() + '</td><td>$' + $amount.val() + '</td><td><a href="#" id="deleteEventPricingItem" class="btn btn-danger">X</a></td></tr>');
  }else{
    $this.closest('.form-group').addClass('has-error');
  }

});


$('#newEvent').submit(function(event){
  event.preventDefault();
  $('#pricing').val( JSON.stringify(prices) );
  this.submit();
});
