$("#btn-EnterTicket").click(function(){
    console.log("clicked")
    firebase.auth().onAuthStateChanged(function (user){
    if(user){
   
    var database = firebase.database();
    var userId = user.uid;
    var refPool = database.ref('/Request_System/Pool1');
    var refCurrent = database.ref('/profiles/'+userId);

    refCurrent.once('value').then(function(snapshot) {

      console.log("alo"+userId);
  

        var currentTimestamp = new Date().getTime();
      
        //Write user under Request System.
        refPool.child(currentTimestamp).set(userId);
    
        //currentUser 
        refCurrent.child("participates").child("pool1").set({
          peopleInvited: 0,
          timestampEntered: currentTimestamp,
          },function(error) {
                if (error) {
                  alert("Problem storing email." + error);
                }
              });
        
        refCurrent.child("ticket").remove();
    
     
    
    });

  
    }});
});
