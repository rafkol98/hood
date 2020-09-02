$("#btn-EnterTicket").click(function(){

  const test = firebase.functions().httpsCallable('enterTicket');
  test();

});

$("#btn-EnterTicket2").click(function(){

  const test = firebase.functions().httpsCallable('enterTicket2');
  test();

});