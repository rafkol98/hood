$(function(){
       
    firebase.auth().onAuthStateChanged(function (user){
      if(user){
        var userId = user.uid;
        firebase.database().ref('/profiles/').child(userId).once('value').then(function(snapshot) {
          // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
          available_quantity = snapshot.val().currentBricks;
          console.log(available_quantity);
          $("#noOfBricks").html(available_quantity);
          
        });
      }
    });
  });