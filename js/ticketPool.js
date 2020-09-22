$("#btn-EnterTicket").click(function () {
    $(".loader2").show();
    const test = firebase.functions().httpsCallable('enterTicket');
    test({num: '1'}).then(result => {
        console.log(result.data);
        alert(result.data);
        window.location.href = "loggedIn.html";
    });

});

$("#btn-EnterTicket2").click(function () {
    $(".loader2").show();
    const test = firebase.functions().httpsCallable('enterTicket');
    test({num: '2'}).then(result => {
        console.log(result.data);
        alert(result.data);
        window.location.href = "loggedIn.html";
    });

});

$("#btn-EnterTicket3").click(function () {
    $(".loader2").show();
    const test = firebase.functions().httpsCallable('enterTicket');
    test({num: '3'}).then(result => {
        console.log(result.data);
        alert(result.data);
        window.location.href = "loggedIn.html";
    });

});
