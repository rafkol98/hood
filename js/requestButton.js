// Request button.

// TODO:
// 0. check if currentBricks >= 10. XX
// THEN {
// 1. WRITE USER UNDER POOL1 WITH CURRENT TIMESTAMP AND UID. XX
// 2. DISPLAYED - PEOPLEINVITED ++ XX
// 3. currentUser -> Participates ->> timestampEntered : currentTimestamp, peopleInvited: 0 XX
// 4. CurrentBricks -10. XX
// }
$("#btn-Request").click(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            var database = firebase.database();
            var userId = user.uid;

            var refCurrent = database.ref('/profiles/' + userId);

            refCurrent.once('value').then(function (snapshot) {

                available_quantity = snapshot.val().currentBricks;
                console.log(available_quantity);
                //if user has more than 10 bricks, call function.
                if (available_quantity >= 10) {
                    const enter = firebase.functions().httpsCallable('enterPool1');
                    enter();
                } else{
                    alert("Not enough bricks!");
                }
            });
        }
    });
});


$("#btn-Request2").click(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            var database = firebase.database();
            var userId = user.uid;

            var refCurrent = database.ref('/profiles/' + userId);

            refCurrent.once('value').then(function (snapshot) {

                available_quantity = snapshot.val().currentBricks;
                console.log(available_quantity);
                //if user has more than 40 bricks, call function.
                if (available_quantity >= 40) {
                    const enter = firebase.functions().httpsCallable('enterPool2');
                    enter();
                } else{
                    alert("Not enough bricks!");
                }
            });
        }
    });
});