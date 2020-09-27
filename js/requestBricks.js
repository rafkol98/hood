//Request 10 bricks.
$("#request10").click(function () {
    $(".loader2").show();
    const requestBricks = firebase.functions().httpsCallable('requestBricks');
    requestBricks({bricksReq: '10'}).then(result => {
        console.log(result.data);
        alert(result.data);
        window.location.href = "loggedIn.html";
    });

});

//Request 40 bricks.
$("#request40").click(function () {
    $(".loader2").show();
    const requestBricks = firebase.functions().httpsCallable('requestBricks');
    requestBricks({bricksReq: '40'}).then(result => {
        console.log(result.data);
        alert(result.data);
        window.location.href = "loggedIn.html";
    });

});

//Request 100 bricks.
$("#request100").click(function () {
    $(".loader2").show();
    const requestBricks = firebase.functions().httpsCallable('requestBricks');
    requestBricks({bricksReq: '100'}).then(result => {
        console.log(result.data);
        alert(result.data);
        window.location.href = "loggedIn.html";
    });

});
