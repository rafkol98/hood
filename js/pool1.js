firebase.auth().onAuthStateChanged(function (user){
    if(user){

    var database = firebase.database();
    var userId = user.uid;
    var currentTimestamp = new Date().getTime();
    var tenMinsAgo = currentTimestamp - 600000;
    var count = 0;
  
    database.ref('Request_System/Pool1').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.key > tenMinsAgo){
          console.log("count10 pirama"+ childSnapshot.key);
          count++;
        }
        
      });
      console.log("count before call"+count);
      $("#noPeople10").html(count);
    });}});