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

exports.startMouktijiesTimer = functions.https.onRequest((request,response) =>{
  mouktijiesStart();
}
);

exports.findRiders = functions.https.onRequest((request,response) =>{
  findFreeRiders();
  clearRequestSystem();
}
);


exports.terminatorX =functions.https.onRequest((data,context)=>{
  console.log("IMPORTANT - pool termination method was called!");
  //find freeRiders - losers of this pool, give them ticket for the next pool.
  findFreeRiders();  // //AllocateBricks to all the people who are allowed in this contest.
  // allocateBricks();
  // //Function that makes the current pool history and deletes it from participates for each user.
  // makeItHistory();
  // //moves the stats of current contest to logistics.
  // moveToLogistics();
  // //clearRequest system.
  // clearRequestSystem();
  
});


//Generate a random encrypted string.
exports.encrypt=functions.https.onCall((data,context)=>{
  return new Promise((resolve, reject) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 10; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  resolve(result);

});
});

// exports.getCount = functions.database.ref('Request_System/Pool1/{userID}')
// .onCreate((snapshot, context)=>{

  function getCountF(uid){

  var currentTimestamp = new Date().getTime();
  var fiveMinsAgo = currentTimestamp - 300000;
  var count =0;

  var unit = 3.5;

  // const uid = context.auth.uid;


  const contestsRef = admin.database().ref('Contests/Pool1');
  contestsRef.child('moneyTotal').transaction(function(moneyTotal) {
        return (moneyTotal|| 0) + 10});

  contestsRef.child('numberOfPeople').transaction(function(numberOfPeople) {
        return (numberOfPeople|| 0) + 1});




  //count how many people entered the last 10 mins.
  return admin.database().ref('Request_System/Pool1').once('value').then((datasnapshot) => {
  
    datasnapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key > fiveMinsAgo){
        count++;
      }
    });
    return count
}).then((retValue) => {
    var x= (retValue+1) * unit;
    var z1 = ((-0.1)*x);

    var y = (((32*x)*(Math.pow(3, z1)) + (217/x) + (Math.pow(x, -0.3)))/2)*1.1;
    var roundedY = Math.ceil(y)
    console.log("rounded Y"+roundedY);

    //read multiplier.
    admin.database().ref('Contests/Pool1/multiplier').once('value').then(function(snapshot) {
      var multiplier = snapshot.val();
      console.log("multiplier"+multiplier);
      var timeOfDisplay = roundedY *  multiplier;
      console.log("no players entered," + retValue);
      console.log("y is : "+y+" time of display is : "+timeOfDisplay);  
      if(timeOfDisplay ==0 ){
        timeOfDisplay=1;
      }
    
    console.log(uid);
    const writeMins = admin.database().ref('/profiles/'+uid+'/participates/pool1/minsAllowed');
    return writeMins.set(timeOfDisplay);

      });

    
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

};




//Create graphs of movement in the pool.
exports.taskGraph = functions.runWith({memory:'2GB'}).pubsub
.schedule('*/5 * * * *').onRun(async context => {
  minsEntered();

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
        var minsAllowed = Number(snapshot.child("minsAllowed").val());
        console.log("minsAllowed "+minsAllowed);
      
        //only execute if timestamp1st exists.
        if(snapshot.child("timestamp1st").exists() == true )
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

                admin.database().ref('Contests/Pool1').once('value').then(function(snapshot) {
                  var sumBonusOneBrick = snapshot.child("sumBonusOneBrick").val();
                  var numberOneBrickers = snapshot.child("numberOneBrickers").val();
                  var bonusPerOneBricker = sumBonusOneBrick/numberOneBrickers;
                  admin.database().ref('Contests/Pool1/bonusPerOneBricker').set(bonusPerOneBricker);
                  console.log("bonusPerOneBricker was written. value:"+bonusPerOneBricker);
                });
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

    // if(moneyTotal >= 0 && moneyTotal < 2000){
    //   percentage = 30;
    // } else if (moneyTotal >= 2000 && moneyTotal < 5000) {
    //   percentage = 25;
    // } else if (moneyTotal >= 5000 && moneyTotal < 10000) {
    //   percentage = 20;
    // } else if (moneyTotal >= 10000 && moneyTotal < 20000) {
    //   percentage = 15;
    // } else if (moneyTotal >= 20000 && moneyTotal < 100000) {
    //   percentage = 10;
    // }

    if(moneyTotal >= 0 && moneyTotal < 50){
      percentage = 30;
    } else if (moneyTotal >= 50 && moneyTotal < 70) {
      percentage = 25;
    } else if (moneyTotal >= 70 && moneyTotal < 100) {
      percentage = 20;
    } else if (moneyTotal >= 100 && moneyTotal < 120) {
      percentage = 15;
    } else if (moneyTotal >= 120 && moneyTotal < 140) {
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
    
    

    //One bricker bonus percentage.
    var oneBrickExtraPercentage = biggestPercentagePossible - percentage;
    admin.database().ref('Contests/Pool1/oneBrickExtraPercentage').set(oneBrickExtraPercentage);
    console.log("oneBrickExtraPercentage was written. value:"+oneBrickExtraPercentage);

    //Formula BrickWorth.
    var brickWorth = (moneySpread/numberOfPeople) - ((oneBrickExtraPercentage/100)*priceEntry);
    console.log("brickWorth before write"+brickWorth);

    admin.database().ref('Contests/Pool1/brickWorth').set(brickWorth);
    console.log("brickWorth was written. value:"+brickWorth);


    //Calculate bonus for one brickers
    var sumBonusOneBrick = (oneBrickExtraPercentage/100) * moneyTotal;
    admin.database().ref('Contests/Pool1/sumBonusOneBrick').set(sumBonusOneBrick);
    console.log("sumBonusOneBrick was written. value:"+sumBonusOneBrick);

    //Calculate exactly how much bricks extra FOR EACH one bricker.
    var numberOneBrickers;

    admin.database().ref('Contests/Pool1/numberOneBrickers').once('value').then(function(snapshot) {
      numberOneBrickers = snapshot.val();
      console.log("numberOneBrickers "+numberOneBrickers);

      var bonusPerOneBricker = sumBonusOneBrick/numberOneBrickers;
      admin.database().ref('Contests/Pool1/bonusPerOneBricker').set(bonusPerOneBricker);
      console.log("bonusPerOneBricker was written. value:"+bonusPerOneBricker);

    });

  });
  
     
};


function initialize() {
  //INITIALISATION POOL1.
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
  //set numberMouktijies to 1 because ADMIN is also a mouktijis.
  admin.database().ref('Contests/Pool1/numberMouktijies').set(1);
  admin.database().ref('Contests/Pool1/started').set(false);
  admin.database().ref('Contests/Pool1/maxTimeDisplay').set(141);
  admin.database().ref('Contests/Pool1/minTimeDisplay').set(1);

  //TODO: make function that calculates this variables before the start of the pool.
  //VARIABLES.
  admin.database().ref('Contests/Pool1/durationCycleHours').set(0);
  admin.database().ref('Contests/Pool1/multiplier').set(0);
  admin.database().ref('Contests/Pool1/randomizerFreq').set(0);
  admin.database().ref('Contests/Pool1/minsAllowedMouktijies').set(0);
  admin.database().ref('Contests/Pool1/maxMouktijies').set(50);

  admin.database().ref('Graphs/Pool1').remove();

  console.log("IMPORTANT - pool1 was initialized.");

  findTotalFloaters();
  
}

//Automatically allocate bricks to users.
function allocateBricks(){
  var brickWorth;
  console.log("2 called");
  admin.database().ref('Contests/Pool1/brickWorth').once('value').then(function(snapshot) {
    brickWorth = snapshot.val();
    console.log("brickWorth value "+brickWorth);

  //Check that brickWorth is equal to 7, as it should be.
  if(brickWorth == 7 ){
      console.log("Allocation going good, brickWorth was correct");
      admin.database().ref('Logistics/Pool1/bricksAllocated').set(0);
      console.log("bricksAllocated set to 0. time for new calculations.")

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

        console.log("peopleInvited "+ peopleInvited+"for" +userUid);


        var currentTimestamp = new Date().getTime();
        
        //if peopleInvited is not 1, then allocate bricks normally.
        if(peopleInvited!=1){
           
              if(bricksAllocate+bricksEarned <= moneySpread){

                //write how many bricks he earned in this contest
                bricksEarnedRef.child('bricksEarnedLast').child(currentTimestamp).set(bricksEarned);
                  console.log("bricksEarnedLast added.");

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

            //write how many bricks he earned in this contest
            bricksEarnedRef.child('bricksEarnedLast').child(currentTimestamp).set(bricksEarnedPlusBonus);
              console.log("bricksEarnedLast added.");

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
   console.log("FINISHED 2..");
   makeItHistory();
  

  });
    } else{
      console.log("brickWorth was not 7. It was "+brickWorth);
    }
    
  });

}
































//find free riders. give free ticket. bronze pool1, silver pool2, gold pool3
function findFreeRiders(){
  console.log("1 called");

admin.database().ref('profiles').once('value').then(function(snapshot) {
    var count = 0;
  snapshot.forEach((child) => {
      var uid = child.key;
      var pool1 = child.child("participates").child("pool1");
      if(pool1.exists()){
        if((pool1.child("timestamp1st").exists() == false ) && (pool1.child("peopleInvited").val() == 0)){
          console.log("i fullfil the criteria to be given a free ticket, "+uid);
          admin.database().ref('/profiles/'+uid+'/ticket').set("bronze");
          console.log("written.")
          count++;
        }
      }
    });
    //ADD THE NUMBER OF SPENDERS - FREERIDERS OF THIS CYCLE TO THE FLOATERS TABLE.
    admin.database().ref('/Floaters/Pool1/numberOfSpendersPreviousCycle').set(count);
    console.log("FINISHED 1..");
    allocateBricks();
  });
 
}

//move current pool to history for user.
function makeItHistory(){
  admin.database().ref('profiles').once('value').then(function(snapshot) {
    console.log("3 called");
    var currentTimestamp = new Date().getTime();
    snapshot.forEach((child) => {
      var uid = child.key;
      var pool1 = child.child("participates").child("pool1");
      if(pool1.exists()){
        admin.database().ref('/profiles/'+uid+'/history/pool1/'+currentTimestamp).set(pool1.val());
        console.log("successfully made it history.")
        admin.database().ref('/profiles/'+uid+'/participates/pool1').remove();
        console.log("deleted pool1-participates succesfully.");
      }
    });
    console.log("FINISHED 3..");
    // initialize();
    moveToLogistics(); 
   
});

}

//
function moveToLogistics(){
  admin.database().ref('Contests/Pool1').once('value').then(function(snapshot) {
    console.log("4 called");
      var pool1 = snapshot.val();
      var currentTimestamp = new Date().getTime();
      admin.database().ref('Logistics/History/Pool1/'+currentTimestamp).set(pool1);
      console.log("moved it to logistics/history.");
      console.log("FINISHED 4..");
      clearRequestSystem();
  
  });

}

function clearRequestSystem(){
  console.log("5 called");
  var currentTimestamp = new Date().getTime();
  admin.database().ref('Request_System/Pool1').remove();
  admin.database().ref('Request_System/Pool1/'+currentTimestamp).set("ADMIN");
  admin.database().ref('profiles/ADMIN/participates/pool1/timestampEntered').set(currentTimestamp);
  admin.database().ref('profiles/ADMIN/participates/pool1/minsAllowed').set(10);
  admin.database().ref('profiles/ADMIN/participates/pool1/peopleInvited').set(0);
  
  



  console.log("succesfully cleared request system.");
  console.log("FINISHED 5..");
     //Initialize current contest stats.
    

}

// exports.terminatePool = functions.runWith({memory:'2GB'}).pubsub
// .schedule('* * * * *').onRun(async context => {
//   console.log("IMPORTANT - pool termination method was called!");
//   //find freeRiders - losers of this pool, give them ticket for the next pool.
//   findFreeRiders();
//   //AllocateBricks to all the people who are allowed in this contest.
//   allocateBricks();
//   //Function that makes the current pool history and deletes it from participates for each user.
//   makeItHistory();
//   //moves the stats of current contest to logistics.
//   moveToLogistics();
//   //clearRequest system.
//   clearRequest();

// });






exports.enterPool1 =functions.https.onCall((data,context)=>{
  const userId = context.auth.uid;
  var currentTimestamp = new Date().getTime();

  admin.database().ref('Contests/Pool1').once('value').then(function(snapshot) {

    var mouktijiesStop = snapshot.child("mouktijiesStop").val();
    var started = snapshot.child("started").val();

if(currentTimestamp>=mouktijiesStop && started==true){

console.log("clicked")

//TODO:FIND UIDDISPLAYED.
admin.database().ref('Request_System/Pool1').limitToFirst(1).once('value').then(function(snapshot) {
var uidDisplayed = snapshot.val(); 

for(key in uidDisplayed){
  if(uidDisplayed.hasOwnProperty(key)) {
  var valueDisplayed = uidDisplayed[key];
  console.log(valueDisplayed);



console.log("uidDisplayed"+valueDisplayed);


var refPool = admin.database().ref('Request_System/Pool1');
var refDisplProf = admin.database().ref('profiles/'+valueDisplayed+"/participates/pool1");
var refCurrent = admin.database().ref('profiles/'+userId);

refCurrent.once('value').then(function(snapshot) {

  available_quantity = snapshot.val().currentBricks;
  console.log(available_quantity);

  if( available_quantity >=10){
   
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
              console.log("Problem storing email." + error);
            }
          });
    
     //-10 bricks.
     refCurrent.child('currentBricks').transaction(function(bricks) {
        return (bricks|| 0) - 10}).then((retValue) => {
          getCountF(userId);
        });
    
  } else{
    //MAYBE TERMINATE ACCOUNT, THEY TRIED TO HACK THE SYSTEM.
    console.log("Not enough bricks!")
  }

  });

}}
});

} else{
  console.log("Either the contest did not start OR the mouktijies still have time.")
}
});
});






exports.enterTicket =functions.https.onCall((data,context)=>{
  const userId = context.auth.uid;

  var refPool = admin.database().ref('/Request_System/Pool1');
  var refCurrent = admin.database().ref('/profiles/'+userId);


  //1. IF NUMBER MOUKTIJIES < 50 THEN => CONTINUE, ELSE STOP. xx.
  //2. IF USER HAS TICKET BRONZE. xx

  admin.database().ref('Contests/Pool1').once('value').then(function(snapshot) {
    var numberMouktijies = snapshot.child("numberMouktijies").val();
    var maxMouktijies = snapshot.child("maxMouktijies").val();
    var mouktijiesStop = snapshot.child("mouktijiesStop").val();
    var currentTimestamp = new Date().getTime();
    console.log("numberMouktijies "+ numberMouktijies+" , maxMouktijies"+ maxMouktijies+", mouktijiesStop "+mouktijiesStop+", currentTimestamp "+currentTimestamp);

    //only execute if numberOfMouktijies is less than maxMouktijies and if the mouktijies time period didn't ran out.
    if(numberMouktijies < maxMouktijies && (currentTimestamp<mouktijiesStop)){

    refCurrent.once('value').then(function(snapshot) {
    var ticket = snapshot.child("ticket");
    if(ticket.exists()){
      if(ticket.val()=="bronze"){
      
      console.log("userId "+userId+" fullfils the criteria.");
      
        //Write user under Request System.
        refPool.child(currentTimestamp).set(userId);
        count10Mins(userId);

        //currentUser 
        refCurrent.child("participates").child("pool1").set({
          peopleInvited: 0,
          timestampEntered: currentTimestamp,
          },function(error) {
                if (error) {
                  console.log("Problem storing child." + error);
                }
              });
        // writeMins(count,userId);
        refCurrent.child("ticket").remove();
        console.log(userId+" was written to request system.");
        
        const contestsRef = admin.database().ref('Contests/Pool1');
        contestsRef.child('numberMouktijies').transaction(function(numberMouktijies) {
          return (numberMouktijies|| 0) + 1});

      
      } else{
        console.log(userId+" he has a ticket of another type.");
      }
      } else{
        console.log("IMPORTANT - "+userId+" does not have a ticket. HOW DID HE END UP HERE?")
      }
  });
} else {
  console.log("mouktijies limit reached, or time ran out.");
}
});
  
});


//NEED TO DO A SEPERATE FUNCTION THAT CALCULATES MINUTES. USE IT SEPERATELY. DO NOT INCREMENT MONEY WHEN MOUKTIJIES ENTER.
//make the getCount function callable and use it when ...

function count10Mins(uid){
  var currentTimestamp = new Date().getTime();
  var fiveMinsAgo = currentTimestamp - 300000;
  var count = 0;

  admin.database().ref('Request_System/Pool1').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key > fiveMinsAgo){
        console.log("count10 pirama"+ childSnapshot.key);
        count++;
      }
      
    });
    console.log("count before call"+count);
    writeMins(count,uid);
  });

    

  // snapshot.ref.parent.once('value').then((datasnapshot) => {
  
  //   datasnapshot.forEach(function(childSnapshot) {
  //     if(childSnapshot.key > fiveMinsAgo){
  //       count++;
  //     }
  //   });
  //   return count

  // admin.database().ref('Request_System/Pool1').once('value').then(function(snapshot) {
  // snapshot.forEach(function(childSnapshot) {
  //   if(childSnapshot.key > fiveMinsAgo){
  //     count++;
  //     }
  //   });
  // });
  // console.log(count);
  // return count;
  
}



function writeMins(retValue, uid){
  var unit = 3.5;
  var x= (retValue+1) * unit;
  var z1 = ((-0.1)*x);

  var y = ((32*x)*(Math.pow(3, z1)) + (217/x) + (Math.pow(x, -0.3)))/2;

  var roundedY = Math.ceil(y)
  console.log("rounded Y"+roundedY);

    //read multiplier.
    admin.database().ref('Contests/Pool1/multiplier').once('value').then(function(snapshot) {
      var multiplier = snapshot.val();
      console.log("multiplier"+multiplier);
      var timeOfDisplay = roundedY *  multiplier;
      console.log("no players entered," + retValue);
      console.log("y is : "+y+" time of display is : "+timeOfDisplay);  
      if(timeOfDisplay ==0 ){
        timeOfDisplay=1;
      }
    
    console.log(uid);
    const writeMins = admin.database().ref('/profiles/'+uid+'/participates/pool1/minsAllowed');
    return writeMins.set(timeOfDisplay);

      });

}


//Allow mouktijies one hour and then start putting other people in the game.
function mouktijiesStart(){
  var currentTimestamp = new Date().getTime();
  admin.database().ref('Contests/Pool1/mouktijiesStart').set(currentTimestamp);
  console.log("mouktijiesStart was written. "+currentTimestamp);

  //allow them one hour.
  var mouktijiesTimeStop = currentTimestamp + (10 * 60000);
  admin.database().ref('Contests/Pool1/mouktijiesStop').set(mouktijiesTimeStop);
  console.log("mouktijiesStop was written. "+mouktijiesTimeStop);
}


//joinContest.
exports.joinContest =functions.https.onCall((data,context)=>{
  return new Promise((resolve, reject) => {
  const userId = context.auth.uid;
  var currentTimestamp = new Date().getTime();

  admin.database().ref('Contests/Pool1').once('value').then(function(snapshot) {
    var numberMouktijies = snapshot.child("numberMouktijies").val();
    var maxMouktijies = snapshot.child("maxMouktijies").val();
    var mouktijiesStop = snapshot.child("mouktijiesStop").val();
    var started = snapshot.child("started").val();

    if(started){

    admin.database().ref('/profiles/'+userId).once('value').then(function(data) {
    if(data.hasChild("participates")){
      console.log("eshi, lets go to the dashboard");
      resolve('inContestDashboard.html');} 
    else if(data.hasChild("ticket")){
        if(currentTimestamp<mouktijiesStop && numberMouktijies<maxMouktijies){
          if(data.child("ticket").val()=="bronze"){
            console.log("all criteria fullfilled, mouktijis can enter "+userId);
            resolve('ticketPool1.html');}

        } else{
          console.log("mouktijies limit reached, or time ran out.");
          resolve('joinContest.html');
        }
      
      } else if(currentTimestamp < mouktijiesStop && (data.hasChild("ticket")==false)){
        console.log("mouktijies still going, but we dont have a ticket we have to wait");
        resolve('waiting.html');
      }
    else{
      console.log("en eshi, lets go to joinContest")
      resolve('joinContest.html');}
  });

  } else{
    console.log("competition did not start yet");
    resolve('notYet.html');
  }
  });

  });
});


function startIt(){
  admin.database().ref('Contests/Pool1/started').set(true);
  admin.database().ref('Floaters/Pool1/totalFloaters').once('value').then(function(snapshot) {
    var totalFloaters = snapshot.val();
    console.log("totalFloaters "+ totalFloaters);

    var multiplier = ((-0.000015) * totalFloaters) + 1.9;
    admin.database().ref('Contests/Pool1/multiplier').set(multiplier);
  });
}


exports.started = functions.database.ref('Contests/Pool1/started')
.onUpdate((change, context)=>{
  mouktijiesStart();
});

exports.startPool = functions.https.onRequest((data,context)=>{
  startIt();
});



function minsEntered(){
  var currentTimestamp = new Date().getTime();
  var fiveMinsAgo = currentTimestamp - 300000;
  var count = 0;

  //count how many players 10 last minutes. 
  admin.database().ref('Request_System/Pool1').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key > fiveMinsAgo){
        console.log("count10 pirama"+ childSnapshot.key);
        count++;
      }
      
    });

    //Write how many entered the last 10 minutes in the graph.
    admin.database().ref('Graphs/Pool1/'+currentTimestamp).set(count);
    console.log("count value for realtime graph was updated. "+count+" , for time: "+currentTimestamp);
    
  });

}

//find the total number of floaters.
function findTotalFloaters(){
  //find people that have more bricks than the current entry price.
  admin.database().ref('profiles').once('value').then(function(snapshot) {
    var count = 0;
  snapshot.forEach((child) => {
      //TODO: change this later to be dynamic.
      var priceEntry = 10;
      var currentBricks = child.child("currentBricks").val();
      if(currentBricks>=priceEntry){
          count++;
      }
    });
    console.log("count moreThanEntryPice "+ count);
    //ADD THE NUMBER OF SPENDERS - FREERIDERS OF THIS CYCLE TO THE FLOATERS TABLE.
    return admin.database().ref('/Floaters/Pool1/peopleMoreThanEntryPrice').set(count).then(()=>{
      admin.database().ref('Floaters').once('value').then(function(snapshot) {
        //POOL1.
        var numberOfSpendersPreviousCycle = snapshot.child("Pool1").child("numberOfSpendersPreviousCycle").val();
        var peopleMoreThanEntryPrice = snapshot.child("Pool1").child("peopleMoreThanEntryPrice").val();

        //write totalFloaters.
        var totalFloaters = numberOfSpendersPreviousCycle + peopleMoreThanEntryPrice; 
        admin.database().ref('/Floaters/Pool1/totalFloaters').set(totalFloaters);

    });
    });
  });

}


