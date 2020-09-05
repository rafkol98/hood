$(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var database = firebase.database();
            var userId = user.uid;

            

            database.ref('/profiles/' + userId + '/participates').once('value').then(function (snapshot) {

                // enableButtons(snapshot);
                var num, category;

                if(snapshot.hasChild("pool1")){
                    num = 1;
                    category = "BRONZE";
                    $("#bronzeBtn").css("display", "block");
                } 
        
                if (snapshot.hasChild("pool2")){
                    num = 2;
                    category = "SILVER";
                    $("#silverBtn").css("display", "block");
                } 
                
                if (snapshot.hasChild("pool3")){
                    num = 3;
                    category = "GOLD";
                    $("#goldBtn").css("display", "block");
                }

                console.log(num+" "+category);
                var peopleInvited = snapshot.child("pool"+num).child("peopleInvited").val();
                $("#peopleClicked").html(peopleInvited);

                if (peopleInvited == 1) {
                    $("#possibleBricks").html(">=7 <a href='www.google.com' style='font-size:30px; color:grey'>Learn More</a>");
                } else {
                    var possibleBricks = peopleInvited * 7;
                    $("#possibleBricks").html(possibleBricks);
                }

                var minsAllowed = parseInt(snapshot.child("pool"+num).child("minsAllowed").val(), 10)
                $("#minsAllowed").html(minsAllowed);

                var timestamp1st = snapshot.child("pool"+num).child("timestamp1st").val();
                if (timestamp1st == null) {
                    $("#dateFirst").html("Not yet &#128513;");
                } else {
                    $("#dateFirst").html(convertLong(timestamp1st));
                }

                var timestampEntered = snapshot.child("pool"+num).child("timestampEntered").val();
                var time = convertLong(timestampEntered);
                console.log(time);
                $("#dateEntered").html(time);

                randomizerNext();


                if (snapshot.child("completedRequest").exists()) {} else {
                    $("#wasI").html("No");
                }

                $("#tierShowing").html(category);
            });


        }
    });
});


function changeCategory(num){

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var database = firebase.database();
            var userId = user.uid;


            database.ref('/profiles/' + userId + '/participates').once('value').then(function (snapshot) {

                var category;
                if(num==1){
                    category = "BRONZE";
                    $("#bronzeBtn").css("display", "block");
                } else if (num==2){
                    category = "SILVER";
                    $("#silverBtn").css("display", "block");
                } else if (num==3){
                    category = "GOLD";
                    $("#goldBtn").css("display", "block");
                }

                var peopleInvited = snapshot.child("pool"+num).child("peopleInvited").val();
                $("#peopleClicked").html(peopleInvited);

                if (peopleInvited == 1) {
                    $("#possibleBricks").html(">=7 <a href='www.google.com' style='font-size:30px; color:grey'>Learn More</a>");
                } else {
                    var possibleBricks = peopleInvited * 7;
                    $("#possibleBricks").html(possibleBricks);
                }

                var minsAllowed = parseInt(snapshot.child("pool"+num).child("minsAllowed").val(), 10)
                $("#minsAllowed").html(minsAllowed);

                var timestamp1st = snapshot.child("pool"+num).child("timestamp1st").val();
                if (timestamp1st == null) {
                    $("#dateFirst").html("Not yet &#128513;");
                } else {
                    $("#dateFirst").html(convertLong(timestamp1st));
                }

                var timestampEntered = snapshot.child("pool"+num).child("timestampEntered").val();
                var time = convertLong(timestampEntered);
                console.log(time);
                $("#dateEntered").html(time);

                randomizerNext();


                if (snapshot.child("completedRequest").exists()) {} else {
                    $("#wasI").html("No");
                }

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

function randomizerNext(){
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