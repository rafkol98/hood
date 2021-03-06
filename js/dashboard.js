$(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var database = firebase.database();
            var userId = user.uid;


            database.ref('/profiles/' + userId + '/participates').once('value').then(function (snapshot) { // enableButtons(snapshot);
                var num,
                    category,
                    possiblePlusBonus;

                if (snapshot.hasChild("pool1")) {
                    num = 1;
                    category = "BRONZE";
                    $("#bronzeBtn").css("display", "block");
                    possiblePlusBonus = 7;
                }

                if (snapshot.hasChild("pool2")) {
                    num = 2;
                    category = "SILVER";
                    $("#silverBtn").css("display", "block");
                    possiblePlusBonus = 28;
                }

                if (snapshot.hasChild("pool3")) {
                    num = 3;
                    category = "GOLD";
                    $("#goldBtn").css("display", "block");
                    possiblePlusBonus = 70;
                }

                console.log(num + " " + category);


                var minsAllowed = parseInt(snapshot.child("pool" + num).child("minsAllowed").val(), 10)
                if (minsAllowed != null) {
                    $("#minsAllowed").html(minsAllowed);
                } else {
                    $("#minsAllowed").html("...")
                }

                var timestamp1st = snapshot.child("pool" + num).child("timestamp1st").val();
                if (timestamp1st == null) {
                    $("#dateFirst").html("Not yet &#128513;");
                } else {
                    $("#dateFirst").html(convertLong(timestamp1st));
                }

                var timestampEntered = snapshot.child("pool" + num).child("timestampEntered").val();
                var time = convertLong(timestampEntered);
                console.log(time);
                $("#dateEntered").html(time);

                randomizerNext();


                if (snapshot.child("completedRequest").exists()) {} else {
                    $("#wasI").html("No");
                }

                $("#tierShowing").html(category);


                database.ref('/Contests/Pool' + num).once('value').then(function (snapshot) {

                    var dateStarted = snapshot.child("mouktijiesStart").val();
                    var dateEnded = snapshot.child("timestampEndCycle").val();
                    
                    $("#dateStarted").html(convertLong(dateStarted));
                    $("#dateEnded").html(convertLong(dateEnded));


                });


                $(".loader2").fadeOut("slow");
            });


        }
    });
});


function changeCategory(num) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var database = firebase.database();
            var userId = user.uid;


            database.ref('/profiles/' + userId + '/participates').once('value').then(function (snapshot) {

                var category;
                if (num == 1) {
                    category = "BRONZE";
                    $("#bronzeBtn").css("display", "block");
                } else if (num == 2) {
                    category = "SILVER";
                    $("#silverBtn").css("display", "block");
                } else if (num == 3) {
                    category = "GOLD";
                    $("#goldBtn").css("display", "block");
                }


                var minsAllowed = parseInt(snapshot.child("pool" + num).child("minsAllowed").val(), 10)
                if (minsAllowed != null) {
                    $("#minsAllowed").html(minsAllowed);
                } else {
                    $("#minsAllowed").html("...")
                }


                var timestampEntered = snapshot.child("pool" + num).child("timestampEntered").val();
                var time = convertLong(timestampEntered);
                console.log(time);
                $("#dateEntered").html(time);

                randomizerNext();

                database.ref('/Contests/Pool' + num).once('value').then(function (snapshot) {

                    var dateStarted = snapshot.child("mouktijiesStart").val();
                    var dateEnded = snapshot.child("timestampEndCycle").val();
                    
                    $("#dateStarted").html(convertLong(dateStarted));
                    $("#dateEnded").html(convertLong(dateEnded));


                });

              

                $("#tierShowing").html(category);
            });


        }
    });

}

function convertLong(long) {
    var date = new Date(long).toString();
    console.log("date " + date)
    return date;

}

function randomizerNext() {
    var currentHour = new Date().getHours();

    if (currentHour >= 1 && currentHour < 4) {
        $("#randomizerNext").html("04:00");
    } else if (currentHour >= 4 && currentHour < 7) {
        $("#randomizerNext").html("07:00");
    } else if (currentHour >= 7 && currentHour < 10) {
        $("#randomizerNext").html("10:00");
    } else if (currentHour >= 10 && currentHour < 13) {
        $("#randomizerNext").html("13:00");
    } else if (currentHour >= 13 && currentHour < 16) {
        $("#randomizerNext").html("16:00");
    } else if (currentHour >= 16 && currentHour < 19) {
        $("#randomizerNext").html("19:00");
    } else if (currentHour >= 19 && currentHour < 22) {
        $("#randomizerNext").html("22:00");
    } else {
        $("#randomizerNext").html("01:00");
    }
}

// function enableButtons(snapshot){
//     database.ref('/profiles/' + userId + '/participates').once('value').then(function (snapshot) {

//     });
// }
