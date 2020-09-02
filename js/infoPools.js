firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    var database = firebase.database();
    var userId = user.uid;
    database.ref('Contests').once('value').then(function(snapshot) {
        //TIER1.
        var multiplier = snapshot.child("Pool1").child("multiplier").val();
        var maxSpenders = snapshot.child("Pool1").child("maxMouktijies").val();
        var durationCycle = snapshot.child("Pool1").child("durationCycleHours").val();
        var spendersPrecedence = snapshot.child("Pool1").child("minsAllowedMouktijies").val();
        
        $("#multiplier").html((Math.round(multiplier * 100) / 100).toFixed(2)+" (2 dp)");
        // $("#maxSpenders").html(parseInt(maxSpenders) + " People");
        $("#duration").html(durationCycle + " Hours");
        // $("#spendersPre").html(spendersPrecedence + " Mins");
    });
    }});