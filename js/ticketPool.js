$("#btn-EnterTicket").click(function(){

  const test = firebase.functions().httpsCallable('enterTicket');
  test({num: '1'});

});

$("#btn-EnterTicket2").click(function(){

  const test = firebase.functions().httpsCallable('enterTicket');
  test({num: '2'});

});

$("#btn-EnterTicket3").click(function(){

  const test = firebase.functions().httpsCallable('enterTicket');
  test({num: '3'});

});