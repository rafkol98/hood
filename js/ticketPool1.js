$("#btn-EnterTicket").click(function(){

  const test = firebase.functions().httpsCallable('enterTicket');
  test();

});
