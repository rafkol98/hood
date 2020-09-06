$("#btnAll").click(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            firebase.database().ref('/profiles/').child(userId).once('value').then(function (snapshot) {
                var currentBricks = snapshot.child("currentBricks").val();
                console.log("currentBricks "+currentBricks);
                $("#enterAmountOfBricks").val(currentBricks);
            });
        }
    });
});
