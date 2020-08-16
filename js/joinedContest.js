
//TODO: MAKE SURE SENDER IS ALSO IN THE SAME POOL.
$("#joinSmall").click(function(){
    firebase.auth().onAuthStateChanged(function (user){

    if(user){
      
      var userId = user.uid
      var database = firebase.database();
      var ref = database.ref('/inviteCodes/');

          //Get current timestamp.
          var currentTimestamp = new Date().getTime();

          //hash user's uId.
          var hashedUId = hashUid(userId);
          //use that hashed uId to generate an invite code.
          var uniqueInviteCode = generateInvite(hashedUId);

          console.log("unique invite code"+uniqueInviteCode);

          //Store by who it was invited.
          var invitedById = localStorage.getItem("invitedByuId");
          console.log("malista, here is the uid of the person who has this code:"+invitedById);

          var database = firebase.database();
          //TODO: make the constestId to change dynamically
          var refProf = database.ref('/profiles/'+userId+'/participatesIn'+'/current5');
          refProf.set({
              invitedBy: invitedById,
              peopleInvited: 0,
              inviteCode: uniqueInviteCode,
              bricksEarned:0,
              timestampEntered: currentTimestamp,
              winner: false
              },function(error) {
                    if (error) {
                      alert("Problem storing data for user." + error);
                    } 
                    else{
                    //increment peopleInvited by 1.
                    var refSender =  database.ref('/profiles/'+invitedById+'/participatesIn'+'/current5').child('peopleInvited').transaction(function(peopleInvited) {
                    return (peopleInvited || 0) + 1});
                    
                    //set inviteCode of current user on the inviteCodes table.
                    ref.child(uniqueInviteCode).set({
                      userId
                    },function(error) {
                        if(error){
                          alert("Problem storing data for user unique code." + error);
                        } else{
                          window.location.href = "inContestDashboard.html"
                        }
                    })
                    
                    }
                  });
    }
  }
  );

});

$("#joinMedium").click(function(){
  firebase.auth().onAuthStateChanged(function (user){

  if(user){
    
    var userId = user.uid
    var database = firebase.database();
    var ref = database.ref('/inviteCodes/');

        //Get current timestamp.
        var currentTimestamp = new Date().getTime();

        //hash user's uId.
        var hashedUId = hashUid(userId);
        //use that hashed uId to generate an invite code.
        var uniqueInviteCode = generateInvite(hashedUId);

        console.log("unique invite code"+uniqueInviteCode);

        //Store by who it was invited.
        var invitedById = localStorage.getItem("invitedByuId");
        console.log("malista, here is the uid of the person who has this code:"+invitedById);

        var database = firebase.database();
        //TODO: make the constestId to change dynamically
        var refProf = database.ref('/profiles/'+userId+'/participatesIn'+'/current20');
        refProf.set({
            invitedBy: invitedById,
            peopleInvited: 0,
            inviteCode: uniqueInviteCode,
            bricksEarned:0,
            timestampEntered: currentTimestamp,
            winner: false
            },function(error) {
                  if (error) {
                    alert("Problem storing data for user." + error);
                  } 
                  
                  else{
                  //increment peopleInvited by 1.
                  var refSender =  database.ref('/profiles/'+invitedById+'/participatesIn'+'/current20').child('peopleInvited').transaction(function(peopleInvited) {
                  return (peopleInvited || 0) + 1});
                  
                  //set inviteCode of current user on the inviteCodes table.
                  ref.child(uniqueInviteCode).set({
                    userId
                  },function(error) {
                      if(error){
                        alert("Problem storing data for user unique code." + error);
                      } else{
                        window.location.href = "inContestDashboard.html"
                      }
                  })
                  
                  }
                });
  }
}
);

});


$("#joinBig").click(function(){
  firebase.auth().onAuthStateChanged(function (user){

  if(user){
    
    var userId = user.uid
    var database = firebase.database();
    var ref = database.ref('/inviteCodes/');

        //Get current timestamp.
        var currentTimestamp = new Date().getTime();

        //hash user's uId.
        var hashedUId = hashUid(userId);
        //use that hashed uId to generate an invite code.
        var uniqueInviteCode = generateInvite(hashedUId);

        console.log("unique invite code"+uniqueInviteCode);

        //Store by who it was invited.
        var invitedById = localStorage.getItem("invitedByuId");
        console.log("malista, here is the uid of the person who has this code:"+invitedById);

        var database = firebase.database();
        //TODO: make the constestId to change dynamically
        var refProf = database.ref('/profiles/'+userId+'/participatesIn'+'/current100');
        refProf.set({
            invitedBy: invitedById,
            peopleInvited: 0,
            inviteCode: uniqueInviteCode,
            bricksEarned:0,
            timestampEntered: currentTimestamp,
            winner: false
            },function(error) {
                  if (error) {
                    alert("Problem storing data for user." + error);
                  } 
                  
                  else{
                  //increment peopleInvited by 1.
                  var refSender =  database.ref('/profiles/'+invitedById+'/participatesIn'+'/current100').child('peopleInvited').transaction(function(peopleInvited) {
                  return (peopleInvited || 0) + 1});
                  
                  //set inviteCode of current user on the inviteCodes table.
                  ref.child(uniqueInviteCode).set({
                    userId
                  },function(error) {
                      if(error){
                        alert("Problem storing data for user unique code." + error);
                      } else{
                        window.location.href = "inContestDashboard.html"
                      }
                  })
                  
                  }
                });
  }
}
);

});

// This function is used to hash a user's uId.
function hashUid(uId){
  //Generate reference code using hashing.
      if (Array.prototype.reduce){
          return uId.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
      } 
      var hash = 0;
      if (uId.length === 0) return hash;
      for (var i = 0; i < uId.length; i++) {
          var character  = uId.charCodeAt(i)
          hash  = ((hash<<5)-hash)+character;
          hash = hash & hash; // Convert to 32bit integer
      }

      return hash;
}

//Use the hashed uId to generate an invite code.
function generateInvite(hashedUId){
  //Get current date.
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  console.log(today+"todays date");

  for(var x=0;x<today.length;x++){
      hashedUId= hashedUId+ (today.charCodeAt(x)*17+x);
  }

  return hashedUId;


}