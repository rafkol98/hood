firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    var database = firebase.database();
    var userId = user.uid;
    database.ref('Contests').once('value').then(function(snapshot) {
 
        for(var i=1; i<=3;i++){
            var multiplier = snapshot.child("Pool"+i).child("multiplier").val();
            var maxSpenders = snapshot.child("Pool"+i).child("maxMouktijies").val();
            var durationCycle = snapshot.child("Pool"+i).child("durationCycleHours").val();
            var spendersPrecedence = snapshot.child("Pool"+i).child("minsAllowedMouktijies").val();
            

            $("#multiplier"+i).html((Math.round(multiplier * 100) / 100).toFixed(2)+" (2 dp)");
            // $("#maxSpenders"+i).html(parseInt(maxSpenders) + " People");
            $("#duration"+i).html(durationCycle + " Hours");
            // $("#spendersPre"+i).html(spendersPrecedence + " Mins");
            
        }
        
    });
    }});