$(function(){
    firebase.auth().onAuthStateChanged(function (user){
        if(user){
        var database = firebase.database();
        var userId = user.uid;
       

        database.ref('/profiles/'+userId+'/participates/pool1').once('value').then(function(snapshot) {
            
            var peopleInvited = snapshot.child("peopleInvited").val();
            $("#peopleClicked").html(peopleInvited);

            if(peopleInvited == 1){
                $("#possibleBricks").html(">=7 <a href='www.google.com' style='font-size:30px; color:grey'>Learn More</a>");
            } else {
                var possibleBricks = peopleInvited *7;
                $("#possibleBricks").html(possibleBricks);
            }
            
            var minsAllowed = parseInt(snapshot.child("minsAllowed").val(), 10) 
            $("#minsAllowed").html(minsAllowed);
            
            var timestamp1st = snapshot.child("timestamp1st").val();
            if(timestamp1st == null){
                $("#dateFirst").html("Not yet &#128513;");
            } else {
                $("#dateFirst").html(convertLong(timestamp1st));
            }
            
            var timestampEntered = snapshot.child("timestampEntered").val();
            var time = convertLong(timestampEntered);
            console.log(time);
            $("#dateEntered").html(time);


            var currentHour = new Date().getHours();
            if(currentHour>=6 && currentHour< 10){
                $("#randomizerNext").html("10:00");
            } else if(currentHour>=10 && currentHour< 14) {
                $("#randomizerNext").html("14:00");
            }
            else if(currentHour>=14 && currentHour< 18){
                $("#randomizerNext").html("18:00");
            } else if(currentHour>=18 && currentHour< 22){
                $("#randomizerNext").html("22:00");
            } else if(currentHour>=2 && currentHour< 6){
                $("#randomizerNext").html("06:00");
            } else {
                $("#randomizerNext").html("02:00");
            }



           console.log(currentHour);
            
            if(snapshot.child("completedRequest").exists()){
                
            } else{
                $("#wasI").html("No");
            }





           


           
        });



        


}});
});

function convertLong(long) {
    var date = new Date(long).toString();
    console.log("date "+date)
    return date;

  }