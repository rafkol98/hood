const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


//http request function.
exports.toTheDojo = functions.https.onRequest((request,response) =>{
    response.redirect('https://www.thenetninja.co.uk')
}
);

exports.dashboard =functions.https.onCall((data,context)=>{
  // $("#peopleClicked").html("test");
  return 'hello ninjas.'
});

exports.initializeHood = functions.https.onRequest((request,response) =>{
  initialize();
}
);

exports.allocateBricksHood = functions.https.onRequest((request,response) =>{
  allocateBricks();
}
);


exports.getCount = functions.database.ref('Request_System/Pool1/{userID}')
.onCreate((snapshot, context)=>{

  var currentTimestamp = new Date().getTime();
  var tenMinsAgo = currentTimestamp - 600000;
  var count =0;

  var unit = 3.5;

  const uid = context.auth.uid;


  const contestsRef = admin.database().ref('Contests/Pool1');
  contestsRef.child('moneyTotal').transaction(function(moneyTotal) {
        return (moneyTotal|| 0) + 10});

  contestsRef.child('numberOfPeople').transaction(function(numberOfPeople) {
        return (numberOfPeople|| 0) + 1});




  //count how many people entered the last 10 mins.
  return snapshot.ref.parent.once('value').then((datasnapshot) => {
  
    datasnapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key > tenMinsAgo){
        count++;
      }
    });
    return count
}).then((retValue) => {
    var x= (retValue+1) * unit;
    var z1 = ((-0.1)*x);

    var y = ((32*x)*(Math.pow(3, z1)) + (217/x) + (Math.pow(x, -0.3)))/2;

    console.log("no players entered," + retValue);
    console.log(y);  
    
    console.log(uid);
    const writeMins = admin.database().ref('/profiles/'+uid+'/participates/pool1/minsAllowed');
    return writeMins.set(y);
  }).then((retValue) => {


    admin.database().ref('Request_System/Pool1').limitToFirst(1).once('value').then(function(snapshot) {
          var uidOfDisplayer = snapshot.val(); 
          
          
          for(key in uidOfDisplayer){
            if(uidOfDisplayer.hasOwnProperty(key)) {
            var value = uidOfDisplayer[key];
            console.log(value);

          
            admin.database().ref('profiles/'+value+'/participates/pool1/peopleInvited').once('value').then(function(snapshot) {
              var peopleInvited = snapshot.val();
            
                if(peopleInvited == 1){
                  admin.database().ref('profiles/'+value+'/participates/pool1/timestamp1st').set(currentTimestamp);
                  console.log("success");
                } else{
                  console.log("more than 1");
                }
            
            });
          
          
          
          
          
          
          
          
          
          }
        }








    });
      

    admin.database().ref('Contests/Pool1/moneyTotal').once('value').then(function(snapshot) {
      var moneyTotal = snapshot.val();
      calculatePecentage(moneyTotal);
      });

  })

    



  







//   var count = 0;
//   snapshot.forEach(function(childSnapshot) {
//     count++;
   
// });

// return count;

});





//automate movement of request system.
exports.taskRunner = functions.runWith({memory:'2GB'}).pubsub
.schedule('* * * * *').onRun(async context => {
  var currentTimestamp = new Date().getTime();


  admin.database().ref('Request_System/Pool1').limitToFirst(1).once('value').then(function(snapshot) {
    var uidOfDisplayer = snapshot.val(); 
    
    var keyX;
    snapshot.forEach((child) => {
       keyX = child.key;
      console.log("here"+keyX);
    });
    
    for(key in uidOfDisplayer){
      if(uidOfDisplayer.hasOwnProperty(key)) {
      var value = uidOfDisplayer[key];
      console.log(value);

    
      admin.database().ref('profiles/'+value+'/participates/pool1').once('value').then(function(snapshot) {
        var peopleInvited = snapshot.child("peopleInvited").val();
        var timestamp1st = snapshot.child("timestamp1st").val();
        console.log("timestamp "+timestamp1st);
        var minsAllowed = snapshot.child("minsAllowed").val();
        console.log("minsAllowed "+minsAllowed);
      
          if(peopleInvited >= 1){
            var expectedTimeRemove = timestamp1st + (minsAllowed * 60000);
            console.log("expected "+expectedTimeRemove);
            if(currentTimestamp >= expectedTimeRemove){
              //write that he completedRequest = true.
              admin.database().ref('profiles/'+value+'/participates/pool1').child("completedRequest").set(true);
              
              //Check if he is an one bricker, add him to the counter.
              if(peopleInvited==1){
                const oneBrickerPlusOne = admin.database().ref('Contests/Pool1');
                oneBrickerPlusOne.child('numberOneBrickers').transaction(function(numberOneBrickers) {
                      return (numberOneBrickers|| 0) + 1});
                      console.log("oneBricker counter incremented");
              }

              //remove him from the request system.
              admin.database().ref('Request_System/Pool1/'+keyX).remove();
              console.log(value+" deleted from request system.");

              const completedRequestPlusOne = admin.database().ref('Contests/Pool1');
              completedRequestPlusOne.child('completedRequest').transaction(function(completedRequest) {
                    return (completedRequest|| 0) + 1});
              console.log("Completed Request count was incremented by 1.");
            } else{
              console.log("still have time");
            }
          } else{
            console.log("less than 1");
          }
      
      });
 
    }
  }

});




});




// '0 */4 * * *'
exports.taskRandomizer = functions.runWith({memory:'2GB'}).pubsub
.schedule('0 */4 * * *').onRun(async context => {
   admin.database().ref('Request_System/Pool1').limitToFirst(1).once('value').then(function(snapshot) {
   
    
    var timestampDisplayer;
    snapshot.forEach((child) => {
       timestampDisplayer = child.key;
      console.log("here"+timestampDisplayer);
    });

  

  admin.database().ref('Request_System/Pool1').once('value').then(function(snapshot) {
    var numberOfChildren = snapshot.numChildren();
    

    if(numberOfChildren >2){
      //Get a randomNumber from all the children.
      var randomNum = Math.floor(Math.random() * numberOfChildren) + 1;
      if(randomNum==1){
        randomNum = randomNum+2;
      } 
      if(randomNum==2){
        randomNum = randomNum+1;
      }
      
      console.log("numberOfChildren "+numberOfChildren);
      console.log("randomNum "+randomNum);
      
      var count = 0;
      snapshot.forEach((child) => {
        count++;
        //if count is the random number.
        if(count==randomNum){
          //get uid of random selected.
          var uidRandomer = child.val();
          var keyRandomer = child.key;
          console.log("key randomer"+keyRandomer);
  
          console.log("uidRandomer "+uidRandomer);
          //new timestamp is timestamp of displayer+1.
          var newTimestamp = Number(timestampDisplayer)+1;
          console.log("newTimestamp"+newTimestamp);
  
       
  
          while(keyRandomer == newTimestamp){
            newTimestamp++;
            console.log("while used :P")
          }
  
          //set newtimestamp under user's profiles node.
          // const timestampRandom = admin.database().ref('/profiles/'+uidRandomer+'/participates/pool1/timestampRandom');
          // timestampRandom.set(newTimestamp);
  
          //set newTimestamp with the uid of Randomer in the request system.
          
          
          

          
          admin.database().ref('Request_System/Pool1/'+newTimestamp).once("value", snapshot => {
            if (snapshot.exists()){
                var uidExchange = snapshot.val();
                //remove user.
                admin.database().ref('Request_System/Pool1/'+newTimestamp).remove();

                //generate a new timestamp.
                var randomPlus = Math.floor(Math.random() * 100);
                console.log("random plus "+randomPlus);
                var exchTimestamp = Number(newTimestamp)+randomPlus;
                console.log("exchTimestamp "+exchTimestamp);

                //add again user under his new timestamp.
                const exchangeRequest = admin.database().ref('Request_System/Pool1/'+exchTimestamp);
                exchangeRequest.set(uidExchange);
                console.log("child was exchanged..");

                //remove randomer from his old location.
                admin.database().ref('Request_System/Pool1/'+keyRandomer).remove();
                console.log("randomer removed from inside.");

                //add the to his new location- under newTimestamp.
                const updateRequest = admin.database().ref('Request_System/Pool1/'+newTimestamp);
                updateRequest.set(uidRandomer);
                console.log("added.");
  



            } else{
              admin.database().ref('Request_System/Pool1/'+keyRandomer).remove();
              console.log("child removed.");

              const updateRequest = admin.database().ref('Request_System/Pool1/'+newTimestamp);
              updateRequest.set(uidRandomer);
              console.log("added.");
  
            }
         });


          
          
        }
     });



    } else{
      console.log("only 2 or less children in request system.")
    }


  });



  });



});


//Calculates percentage of cut.
function calculatePecentage(moneyTotal) {
  console.log("calculatePercentage() called.")
  //Get the moneytotal.
  
    console.log("moneyTotal "+moneyTotal);

    //Calculate percentage of cut.
    var percentage;

    if(moneyTotal >= 0 && moneyTotal < 2000){
      percentage = 30;
    } else if (moneyTotal >= 2000 && moneyTotal < 5000) {
      percentage = 25;
    } else if (moneyTotal >= 5000 && moneyTotal < 10000) {
      percentage = 20;
    } else if (moneyTotal >= 10000 && moneyTotal < 20000) {
      percentage = 15;
    } else if (moneyTotal >= 20000 && moneyTotal < 100000) {
      percentage = 10;
    }

  console.log("pecentage cut "+percentage);

  //write percentage.
  admin.database().ref('Contests/Pool1/percentageCut').set(percentage);
  console.log("percentageCut was written.");

  var moneyProfit = moneyTotal * (percentage/100);

  admin.database().ref('Contests/Pool1/moneyProfit').set(moneyProfit);
  console.log("moneyProfit was written.");

  var moneySpread = moneyTotal - moneyProfit;

  admin.database().ref('Contests/Pool1/moneySpread').set(moneySpread);
  console.log("moneySpread was written.");

  admin.database().ref('Contests/Pool1').once('value').then(function(snapshot) {
    //numberOfPeople is 'total minus head' in the excel.
    var numberOfPeople = snapshot.child('numberOfPeople').val();
    var priceEntry = snapshot.child('priceEntry').val();
    var biggestPercentagePossible = snapshot.child('biggestPercentagePossible').val();

    console.log("values used for brick formula "+numberOfPeople+"  "+priceEntry+"  "+biggestPercentagePossible);
    
    //Formula.
    var brickWorth = (moneySpread/numberOfPeople) - ((biggestPercentagePossible-percentage)*priceEntry);
    console.log("brickWorth before write"+brickWorth);

    admin.database().ref('Contests/Pool1/brickWorth').set(brickWorth);
    console.log("brickWorth was written. value:"+brickWorth);


    //One bricker bonus percentage.
    var oneBrickExtraPercentage = biggestPercentagePossible - percentage;
    admin.database().ref('Contests/Pool1/oneBrickExtraPercentage').set(oneBrickExtraPercentage);
    console.log("oneBrickExtraPercentage was written. value:"+oneBrickExtraPercentage);

    //Calculate bonus for one brickers
    var sumBonusOneBrick = (oneBrickExtraPercentage/100) * moneyTotal;
    admin.database().ref('Contests/Pool1/sumBonusOneBrick').set(sumBonusOneBrick);
    console.log("sumBonusOneBrick was written. value:"+sumBonusOneBrick);

    //Calculate exactly how much bricks extra FOR EACH one bricker.
    var numberOneBrickers;

    admin.database().ref('Contests/Pool1/numberOneBrickers').once('value').then(function(snapshot) {
      numberOneBrickers = snapshot.val();
    });

    console.log("numberOneBrickers "+numberOneBrickers);


    var bonusPerOneBricker = sumBonusOneBrick/numberOneBrickers;
    admin.database().ref('Contests/Pool1/bonusPerOneBricker').set(bonusPerOneBricker);
    console.log("bonusPerOneBricker was written. value:"+bonusPerOneBricker);



  });
  
     
};


function initialize() {
  admin.database().ref('Contests/Pool1/percentageCut').set(0);
  admin.database().ref('Contests/Pool1/moneyProfit').set(0);
  admin.database().ref('Contests/Pool1/moneySpread').set(0);
  admin.database().ref('Contests/Pool1/moneyTotal').set(0);
  admin.database().ref('Contests/Pool1/numberOfPeople').set(0);
  admin.database().ref('Contests/Pool1/numberOneBrickers').set(0);
  admin.database().ref('Contests/Pool1/oneBrickExtraPercentage').set(0);
  admin.database().ref('Contests/Pool1/sumBonusOneBrick').set(0);
  admin.database().ref('Contests/Pool1/biggestPercentagePossible').set(30);
  admin.database().ref('Contests/Pool1/priceEntry').set(10);
  admin.database().ref('Contests/Pool1/brickWorth').set(0);
  admin.database().ref('Contests/Pool1/bonusPerOneBricker').set(0);
  admin.database().ref('Contests/Pool1/completedRequest').set(0);
  console.log("IMPORTANT - pool1 was initialized.")
  
}

//Automatically allocate bricks to users.
function allocateBricks(){
  var brickWorth;

  admin.database().ref('Contests/Pool1/brickWorth').once('value').then(function(snapshot) {
    brickWorth = snapshot.val();
    console.log("brickWorth value "+brickWorth);

  //Check that brickWorth is equal to 7, as it should be.
  if(brickWorth == 7 ){
      console.log("Allocation going good, brickWorth was correct");


  admin.database().ref('profiles').once('value').then(function(snapshot) {
    snapshot.forEach((child) => {
     var userUid = child.key;
   
     //if child participates in pool1.
     if(child.child("participates").child("pool1").exists()){
       //get number of people the user invited.
        var peopleInvited = child.child("participates").child("pool1").child("peopleInvited").val();

        var bricksEarned = brickWorth * peopleInvited;
        console.log("bricksEarned for user "+ userUid+" are: "+bricksEarned);

        var moneySpread, bricksAllocate;
        //CHECK IF bricksAllocated+bricksEarned <= moneySpread FROM CONTESTS TABLE. ONLY DO THE TRANSACTION THEN!
        admin.database().ref('Contests/Pool1/moneySpread').once('value').then(function(snapshot) {
          moneySpread = snapshot.val();
          console.log("moneySpread value "+moneySpread);
        

        admin.database().ref('Logistics/Pool1/bricksAllocated').once('value').then(function(snapshot) {
          bricksAllocate = snapshot.val();
          console.log("bricksAllocated value "+bricksAllocate);
        

        const bricksEarnedRef = admin.database().ref('profiles/'+userUid);
        const bricksAllocatedRef = admin.database().ref('Logistics/Pool1');
        
        //if peopleInvited is not 1, then allocate bricks normally.
        if(peopleInvited!=1){
           
              if(bricksAllocate+bricksEarned <= moneySpread){
                
                bricksEarnedRef.child('currentBricks').transaction(function(currentBricks) {
                return (currentBricks|| 0) + bricksEarned});
                console.log("bricksEarned was added to current bricks.");
                
                
                bricksAllocatedRef.child('bricksAllocated').transaction(function(bricksAllocated) {
                return (bricksAllocated|| 0) + bricksEarned});
                console.log("bricksEarned was added to bricksAllocated.");

              } else{
                console.log("IMPORTANT - The bricks were not allocated to user "+userUid+" beceause there would be a problem with balance.")
              }
            
        } 
        //Calculations for oneBrickers.
        else if(peopleInvited==1){
          var bonusPerOneBricker;
          admin.database().ref('Contests/Pool1/bonusPerOneBricker').once('value').then(function(snapshot) {
            bonusPerOneBricker = snapshot.val();
          
          console.log("bonusPerOneBricker "+bonusPerOneBricker);

          //Calculate bricksEarned by 1 brickers considering their bonus.
          var bricksEarnedPlusBonus = bricksEarned + bonusPerOneBricker;
          if(bricksAllocate+bricksEarnedPlusBonus <= moneySpread){

            bricksEarnedRef.child('currentBricks').transaction(function(currentBricks) {
            return (currentBricks|| 0) + bricksEarnedPlusBonus});
            console.log("bricksEarned was added to current bricks.");
            
            
            bricksAllocatedRef.child('bricksAllocated').transaction(function(bricksAllocated) {
            return (bricksAllocated|| 0) + bricksEarnedPlusBonus});
            console.log("bricksEarned was added to bricksAllocated.");
            
          } else{
            console.log("IMPORTANT - The bricks were not allocated to user "+userUid+" beceause there would be a problem with balance.")
          }
        });
        }
      });
      });
     }
   });


  });
    } else{
      console.log("brickWorth was not 7. It was "+brickWorth);
    }

  });
}