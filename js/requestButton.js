// Request button.

//TODO:
// 0. check if currentBricks >= 10. XX
//THEN {
// 1. WRITE USER UNDER POOL1 WITH CURRENT TIMESTAMP AND UID. XX
// 2. DISPLAYED - PEOPLEINVITED ++ XX
// 3. currentUser -> Participates ->> timestampEntered : currentTimestamp, peopleInvited: 0 XX
// 4. CurrentBricks -10. XX
//}


    $("#btn-Request").click(function(){
    console.log("clicked")
    firebase.auth().onAuthStateChanged(function (user){
    if(user){
    var uidDisplayed= localStorage.getItem("uidReq");
    var database = firebase.database();
    var userId = user.uid;
    var refPool = database.ref('/Request_System/Pool1');
    var refDisplProf = database.ref('/profiles/'+uidDisplayed+"/participates/pool1");
    var refCurrent = database.ref('/profiles/'+userId);

    refCurrent.once('value').then(function(snapshot) {

      available_quantity = snapshot.val().currentBricks;
      console.log(available_quantity);
  
      if( available_quantity >=10){
        var currentTimestamp = new Date().getTime();
      
        //Write user under Request System.
        refPool.child(currentTimestamp).set(userId);
        
        //update displayer peopleInvited.
        refDisplProf.child('peopleInvited').transaction(function(peopleInvited) {
          return (peopleInvited || 0) + 1});
    
        //currentUser 
        refCurrent.child("participates").child("pool1").set({
          peopleInvited: 0,
          timestampEntered: currentTimestamp,
          },function(error) {
                if (error) {
                  alert("Problem storing email." + error);
                }
              });
        
         //-10 bricks.
         refCurrent.child('currentBricks').transaction(function(bricks) {
            return (bricks|| 0) - 10});
        
      } else{
        //MAYBE TERMINATE ACCOUNT, THEY TRIED TO HACK THE SYSTEM.
        alert("Not enough bricks!")
      }
    
    });


    
   
    
  
    }});
});


