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
  initialize2();
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
  // findFreeRiders();
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

  function getCountF(uid, num, priceEntry){

  var currentTimestamp = new Date().getTime();
  var fiveMinsAgo = currentTimestamp - 300000;
  var count =0;

  var unit = 3.5;

  // const uid = context.auth.uid;


  const contestsRef = admin.database().ref('Contests/Pool'+num);
  contestsRef.child('moneyTotal').transaction(function(moneyTotal) {
        return (moneyTotal|| 0) + priceEntry});

  contestsRef.child('numberOfPeople').transaction(function(numberOfPeople) {
        return (numberOfPeople|| 0) + 1});




  //count how many people entered the last 10 mins.
  return admin.database().ref('Request_System/Pool'+num).once('value').then((datasnapshot) => {
  
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
    admin.database().ref('Contests/Pool'+num+'/multiplier').once('value').then(function(snapshot) {
      var multiplier = snapshot.val();
      console.log("multiplier"+multiplier);
      var timeOfDisplay = roundedY *  multiplier;
      console.log("no players entered," + retValue);
      console.log("y is : "+y+" time of display is : "+timeOfDisplay);  
      if(timeOfDisplay ==0 ){
        timeOfDisplay=1;
      }
    
    console.log(uid);
    const writeMins = admin.database().ref('/profiles/'+uid+'/participates/pool'+num+'/minsAllowed');
    return writeMins.set(timeOfDisplay);

      });

    
  }).then((retValue) => {


    admin.database().ref('Request_System/Pool'+num).limitToFirst(1).once('value').then(function(snapshot) {
          var uidOfDisplayer = snapshot.val(); 
          
          
          for(key in uidOfDisplayer){
            if(uidOfDisplayer.hasOwnProperty(key)) {
            var value = uidOfDisplayer[key];
            console.log(value);

          
            admin.database().ref('profiles/'+value+'/participates/pool'+num+'/peopleInvited').once('value').then(function(snapshot) {
              var peopleInvited = snapshot.val();
            
                if(peopleInvited == 1){
                  admin.database().ref('profiles/'+value+'/participates/pool'+num+'/timestamp1st').set(currentTimestamp);
                  console.log("success");
                } else{
                  console.log("more than 1");
                }
            
            });
          
          
          }
        }


    });
      

    admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {
      var moneyTotal = snapshot.child("moneyTotal").val();
      var priceEntry = snapshot.child("priceEntry");
      calculatePecentage(priceEntry, moneyTotal,num);
      });

  })

};


//Create graphs of movement in the pool.
exports.taskGraph = functions.runWith({memory:'2GB'}).pubsub
.schedule('*/3 * * * *').onRun(async context => {

  //Add a point to the graph for each pool.
  minsPool(1);
  minsPool(2);
  minsPool(3);

});

//Remove all the graph points everyday at midnight.
exports.removeGraphs = functions.runWith({memory:'2GB'}).pubsub
.schedule('0 0 * * *').onRun(async context => {
  admin.database().ref('Graphs/Pool1').remove();
  admin.database().ref('Graphs/Pool2').remove();
  admin.database().ref('Graphs/Pool3').remove();
  console.log("!IMPORTANT - graphs were removed");
});


//automate movement of request system.
exports.taskRunner = functions.runWith({memory:'2GB'}).pubsub
.schedule('* * * * *').onRun(async context => {

  //Call runner for each pool.
  runner(1);
  runner(2);
  runner(3);

});



// '0 */4 * * *'
exports.taskRandomizer = functions.runWith({memory:'2GB'}).pubsub
.schedule('0 */3 * * *').onRun(async context => {

  //Use the randomize function to randlomly select a player and put him second.
  randomize(1);
  randomize(2);
  randomize(3);


});


//Calculates percentage of cut.
function calculatePecentage(priceEntry,moneyTotal,num) {
  console.log("Pool"+num+" calculatePercentage() called.")
  //Get the moneytotal.
  
    console.log("Pool"+num+" moneyTotal "+moneyTotal+" priceEntry "+priceEntry);

    //Calculate percentage of cut.
    var percentage;
    //MAKE THE FIRST ONE FROM 4 TO 20
    if(moneyTotal >= 0 && moneyTotal < (priceEntry*4)){
      percentage = 30;
    } else if (moneyTotal >= (priceEntry*20) && moneyTotal < (priceEntry*50)) {
      percentage = 25;
    } else if (moneyTotal >= (priceEntry*50) && moneyTotal < (priceEntry*100)) {
      percentage = 20;
    } else if (moneyTotal >= (priceEntry*100) && moneyTotal < (priceEntry*170)) {
      percentage = 15;
    } else if (moneyTotal >= (priceEntry*170)) {
      percentage = 10;
    }

  console.log("Pool"+num+" pecentage cut "+percentage);

  //write percentage.
  admin.database().ref('Contests/Pool'+num+'/percentageCut').set(percentage);
  console.log("Pool"+num+" percentageCut was written.");

  var moneyProfit = moneyTotal * (percentage/100);

  admin.database().ref('Contests/Pool'+num+'/moneyProfit').set(moneyProfit);
  console.log("Pool"+num+" moneyProfit was written.");

  var moneySpread = moneyTotal - moneyProfit;

  admin.database().ref('Contests/Pool'+num+'/moneySpread').set(moneySpread);
  console.log("Pool"+num+" moneySpread was written.");

  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {
    //numberOfPeople is 'total minus head' in the excel.
    var numberOfPeople = snapshot.child('numberOfPeople').val();
    var priceEntry = snapshot.child('priceEntry').val();
    var biggestPercentagePossible = snapshot.child('biggestPercentagePossible').val();

    console.log("Pool"+num+" values used for brick formula "+numberOfPeople+"  "+priceEntry+"  "+biggestPercentagePossible);
    
    

    //One bricker bonus percentage.
    var oneBrickExtraPercentage = biggestPercentagePossible - percentage;
    admin.database().ref('Contests/Pool'+num+'/oneBrickExtraPercentage').set(oneBrickExtraPercentage);
    console.log("Pool"+num+" oneBrickExtraPercentage was written. value:"+oneBrickExtraPercentage);

    //Formula BrickWorth.
    if(moneySpread!=0){
    var brickWorth = (moneySpread/numberOfPeople) - ((oneBrickExtraPercentage/100)*priceEntry);
    console.log("Pool"+num+" brickWorth before write"+brickWorth);

    admin.database().ref('Contests/Pool'+num+'/brickWorth').set(brickWorth);
    console.log("Pool"+num+" brickWorth was written. value:"+brickWorth);
    } else{
      console.log("Pool"+num+" moneySpread was 0 so, we didnt write new brickWorth.");
    }

    //Calculate bonus for one brickers
    var sumBonusOneBrick = (oneBrickExtraPercentage/100) * moneyTotal;
    admin.database().ref('Contests/Pool'+num+'/sumBonusOneBrick').set(sumBonusOneBrick);
    console.log("Pool"+num+" sumBonusOneBrick was written. value:"+sumBonusOneBrick);

    //Calculate exactly how much bricks extra FOR EACH one bricker.
    var numberOneBrickers;

    admin.database().ref('Contests/Pool'+num+'/numberOneBrickers').once('value').then(function(snapshot) {
      numberOneBrickers = snapshot.val();
      console.log("Pool"+num+" numberOneBrickers "+numberOneBrickers);
      if(numberOneBrickers!=0){
        var bonusPerOneBricker = sumBonusOneBrick/numberOneBrickers;
        admin.database().ref('Contests/Pool'+num+'/bonusPerOneBricker').set(bonusPerOneBricker);
        console.log("Pool"+num+" bonusPerOneBricker was written. value:"+bonusPerOneBricker);  
      }
     
    });

  });
  
     
};



function initialize(num) {
  //INITIALISATION POOL1.
  admin.database().ref('Contests/Pool'+num+'/percentageCut').set(0);
  admin.database().ref('Contests/Pool'+num+'/moneyProfit').set(0);
  admin.database().ref('Contests/Pool'+num+'/moneySpread').set(0);
  admin.database().ref('Contests/Pool'+num+'/moneyTotal').set(0);
  admin.database().ref('Contests/Pool'+num+'/numberOfPeople').set(0);
  admin.database().ref('Contests/Pool'+num+'/numberOneBrickers').set(0);
  admin.database().ref('Contests/Pool'+num+'/oneBrickExtraPercentage').set(0);
  admin.database().ref('Contests/Pool'+num+'/sumBonusOneBrick').set(0);
  admin.database().ref('Contests/Pool'+num+'/biggestPercentagePossible').set(30);

  if(num == 1){
    admin.database().ref('Contests/Pool'+num+'/priceEntry').set(10);
    admin.database().ref('Contests/Pool'+num+'/brickWorth').set(7);
  } else if(num == 2){
    admin.database().ref('Contests/Pool'+num+'/priceEntry').set(40);
    admin.database().ref('Contests/Pool'+num+'/brickWorth').set(28);
  } else if(num == 3){
    admin.database().ref('Contests/Pool'+num+'/priceEntry').set(100);
    admin.database().ref('Contests/Pool'+num+'/brickWorth').set(70);
  }
  
  
  admin.database().ref('Contests/Pool'+num+'/bonusPerOneBricker').set(0);
  admin.database().ref('Contests/Pool'+num+'/completedRequest').set(0);
  //set numberMouktijies to 1 because ADMIN is also a mouktijis.
  admin.database().ref('Contests/Pool'+num+'/numberMouktijies').set(1);
  admin.database().ref('Contests/Pool'+num+'/started').set(false);
  admin.database().ref('Contests/Pool'+num+'/finished').set(false);
  admin.database().ref('Contests/Pool'+num+'/maxTimeDisplay').set(141);
  admin.database().ref('Contests/Pool'+num+'/minTimeDisplay').set(1);

  //TODO: make function that calculates this variables before the start of the pool.
  //VARIABLES.
  admin.database().ref('Contests/Pool'+num+'/durationCycleHours').set(0);
  admin.database().ref('Contests/Pool'+num+'/multiplier').set(0);
  admin.database().ref('Contests/Pool'+num+'/randomizerFreq').set(0);
  admin.database().ref('Contests/Pool'+num+'/minsAllowedMouktijies').set(0);
  admin.database().ref('Contests/Pool'+num+'/maxMouktijies').set(2);


  admin.database().ref('Logistics/Pool'+num+'/bricksAllocated').set(0);
  admin.database().ref('Graphs/Pool'+num+'').remove();

  console.log("IMPORTANT - pool"+num+" was initialized.");

  findTotalFloaters(num);

}


//Automatically allocate bricks to users.
function allocateBricks(num){
  var brickWorth;
  console.log("Pool"+num+" 2 called");
  admin.database().ref('Contests/Pool'+num+'/brickWorth').once('value').then(function(snapshot) {
    brickWorth = snapshot.val();
    console.log("Pool"+num+" brickWorth value "+brickWorth);

    var brickShould;

    if(num == 1){
      brickShould = 7;
    } else if(num == 2){
      brickShould = 28;
    } else if(num == 3){
      brickShould = 70;
    }

  //Check that brickWorth is equal to 7, as it should be.
  // if(num == 1 ){
  if(brickWorth == brickShould ){
      console.log("Allocation going good, brickWorth was correct");
      admin.database().ref('Logistics/Pool'+num+'/bricksAllocated').set(0);
      console.log("Pool"+num+" bricksAllocated set to 0. time for new calculations.")

  admin.database().ref('profiles').once('value').then(function(snapshot) {
    snapshot.forEach((child) => {
     var userUid = child.key;
   
     //if child participates in pool1.
     if(child.child("participates").child("pool"+num).exists()){
       //get number of people the user invited.
        var peopleInvited = child.child("participates").child("pool"+num).child("peopleInvited").val();

        var bricksEarned = brickWorth * peopleInvited;
        console.log("Pool"+num+" bricksEarned for user "+ userUid+" are: "+bricksEarned);

        var moneySpread, bricksAllocate;
        //CHECK IF bricksAllocated+bricksEarned <= moneySpread FROM CONTESTS TABLE. ONLY DO THE TRANSACTION THEN!
        admin.database().ref('Contests/Pool'+num+'/moneySpread').once('value').then(function(snapshot) {
          moneySpread = snapshot.val();
          console.log("Pool"+num+" moneySpread value "+moneySpread);
        

        admin.database().ref('Logistics/Pool'+num+'/bricksAllocated').once('value').then(function(snapshot) {
          bricksAllocate = snapshot.val();
          console.log("Pool"+num+" bricksAllocated value "+bricksAllocate);
        

        const bricksEarnedRef = admin.database().ref('profiles/'+userUid);
        const bricksAllocatedRef = admin.database().ref('Logistics/Pool'+num);
        const bricksAllocatedTotalRef = admin.database().ref('Logistics/Bricks');

        console.log("Pool"+num+" peopleInvited "+ peopleInvited+"for" +userUid);


        var currentTimestamp = new Date().getTime();
        
        //if peopleInvited is not 1, then allocate bricks normally.
        if(peopleInvited!=1){
           
              if(bricksAllocate+bricksEarned <= moneySpread){

                //write how many bricks he earned in this contest
                bricksEarnedRef.child('bricksEarnedLast').child(currentTimestamp).set(bricksEarned);
                  console.log("Pool"+num+" bricksEarnedLast added.");

                bricksEarnedRef.child('currentBricks').transaction(function(currentBricks) {
                return (currentBricks|| 0) + bricksEarned});
                console.log("Pool"+num+" bricksEarned was added to current bricks.");
                
                bricksAllocatedRef.child('bricksAllocated').transaction(function(bricksAllocated) {
                return (bricksAllocated|| 0) + bricksEarned});
                console.log("Pool"+num+" bricksEarned was added to bricksAllocated.");

                bricksAllocatedTotalRef.child('bricksTotalAllocated').transaction(function(bricksTotalAllocated) {
                  return (bricksTotalAllocated|| 0) + bricksEarned});
                  console.log("Pool"+num+" bricksEarned was added to bricksAllocatedTotal in the Bricks section.");


              } else{
                console.log("Pool"+num+" IMPORTANT - The bricks were not allocated to user "+userUid+" beceause there would be a problem with balance.")
              }
            
        } 
        //Calculations for oneBrickers.
        else if(peopleInvited==1){
          var bonusPerOneBricker;
          admin.database().ref('Contests/Pool'+num+'/bonusPerOneBricker').once('value').then(function(snapshot) {
            bonusPerOneBricker = snapshot.val();
          
          console.log("Pool"+num+" bonusPerOneBricker "+bonusPerOneBricker);

          //Calculate bricksEarned by 1 brickers considering their bonus.
          var bricksEarnedPlusBonus = bricksEarned + bonusPerOneBricker;
          if(bricksAllocate+bricksEarnedPlusBonus <= moneySpread){

            //write how many bricks he earned in this contest
            bricksEarnedRef.child('bricksEarnedLast').child(currentTimestamp).set(bricksEarnedPlusBonus);
              console.log("Pool"+num+" bricksEarnedLast added.");

            bricksEarnedRef.child('currentBricks').transaction(function(currentBricks) {
            return (currentBricks|| 0) + bricksEarnedPlusBonus});
            console.log("Pool"+num+" bricksEarned was added to current bricks.");
            
            
            bricksAllocatedRef.child('bricksAllocated').transaction(function(bricksAllocated) {
            return (bricksAllocated|| 0) + bricksEarnedPlusBonus});
            console.log("Pool"+num+" bricksEarned was added to bricksAllocated.");

            bricksAllocatedTotalRef.child('bricksTotalAllocated').transaction(function(bricksTotalAllocated) {
              return (bricksTotalAllocated|| 0) + bricksEarnedPlusBonus});
              console.log("Pool"+num+" bricksEarned was added to bricksAllocatedTotal in the Bricks section.");

            
          } else{
            console.log("Pool"+num+" IMPORTANT - The bricks were not allocated to user "+userUid+" beceause there would be a problem with balance.")
          }
        });
        }
      });
      });
     }
   });
   console.log("FINISHED 2..");
   makeItHistory(num);
  

  });
    } else{
      console.log("Pool"+num+" brickWorth was not "+brickShould+". It was "+brickWorth);
    }
    
  });

}




//find free riders. give free ticket. bronze pool1, silver pool2, gold pool3
function findFreeRiders(num){
  console.log("1 called");



  return admin.database().ref('Contests/Pool'+num).once('value').then((datasnapshot) => {
    var moneyTotal = datasnapshot.child("moneyTotal").val();
    var priceEntry = snapshot.child("priceEntry");

    console.log("Pool"+num+" moneyTotal "+moneyTotal+" priceEntry "+priceEntry);

    return calculatePecentage(priceEntry,moneyTotal, num);
}).then(() => {

admin.database().ref('profiles').once('value').then(function(snapshot) {
    var count = 0;
  snapshot.forEach((child) => {
      var uid = child.key;
      var pool1 = child.child("participates").child("pool"+num);
      if(pool1.exists()){
        if((pool1.child("timestamp1st").exists() == false ) && (pool1.child("peopleInvited").val() == 0)){
          console.log("Pool"+num+" i fullfil the criteria to be given a free ticket, "+uid);

          if(child.child("ticket").exists()){
              var existingTicket = child.child("ticket").val();
              console.log("Pool"+num+" "+uid+", they already have a ticket of type: "+existingTicket);

              var exisNum;
              if(existingTicket === "bronze") {
                exisNum = 1;
              } else if(existingTicket === "silver") {
                exisNum = 2;
              } else if(existingTicket === "gold") { 
                exisNum = 3;
              }

              //if existing ticket is less or equal than the one he will receive here, replace his ticket.
              if(exisNum<num){
                writeFreeTicket(uid,num);
              } else {
                console.log("Pool"+num+" he had the same or better ticket, so we didnt replace it!");
              }


          } else{
            //write ticket according to pool participating.
           writeFreeTicket(uid,num);
            
            console.log("written.")
          }

       
          count++;
        }
      }
    });
    //ADD THE NUMBER OF SPENDERS - FREERIDERS OF THIS CYCLE TO THE FLOATERS TABLE.
    admin.database().ref('/Floaters/Pool'+num+'/numberOfSpendersPreviousCycle').set(count);
    console.log("Pool"+num+" FINISHED 1..");
    allocateBricks(num);
  });
});
}

//move current pool to history for user.
function makeItHistory(num){
  admin.database().ref('profiles').once('value').then(function(snapshot) {
    console.log("Pool"+num+" 3 called");
    var currentTimestamp = new Date().getTime();
    snapshot.forEach((child) => {
      var uid = child.key;
      var pool1 = child.child("participates").child("pool"+num);
      if(pool1.exists()){
        admin.database().ref('/profiles/'+uid+'/history/pool'+num+'/'+currentTimestamp).set(pool1.val());
        console.log("Pool"+num+" successfully made it history.")
        admin.database().ref('/profiles/'+uid+'/participates/pool'+num).remove();
        console.log("Pool"+num+" deleted pool"+num+"-participates succesfully.");
      }
    });
    console.log("Pool"+num+" FINISHED 3..");
    // initialize();
    moveToLogistics(num); 
   
});

}

//
function moveToLogistics(num){
  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {
    console.log("Pool"+num+" 4 called");
      var pool1 = snapshot.val();
      var currentTimestamp = new Date().getTime();
      admin.database().ref('Logistics/History/Pool'+num+'/'+currentTimestamp).set(pool1);
      console.log("Pool"+num+" moved it to logistics/history.");
      console.log("Pool"+num+" FINISHED 4..");
      clearRequestSystem(num);
  
  });

}

function clearRequestSystem(num){
  console.log("Pool"+num+" 5 called");
  var currentTimestamp = new Date().getTime();
  admin.database().ref('Request_System/Pool'+num).remove();
  admin.database().ref('Request_System/Pool'+num+'/'+currentTimestamp).set("ADMIN");
  admin.database().ref('profiles/ADMIN/participates/pool'+num+'/timestampEntered').set(currentTimestamp);
  admin.database().ref('profiles/ADMIN/participates/pool'+num+'/minsAllowed').set(10);
  admin.database().ref('profiles/ADMIN/participates/pool'+num+'/peopleInvited').set(0);
  
  



  console.log("Pool"+num+" succesfully cleared request system.");
  console.log("Pool"+num+" FINISHED 5..");
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
  return new Promise((resolve, reject) => {
  const num = data.num;

  const userId = context.auth.uid;
  var currentTimestamp = new Date().getTime();

  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {

    var mouktijiesStop = snapshot.child("mouktijiesStop").val();
    var started = snapshot.child("started").val();
    var finished = snapshot.child("finished").val();
    var priceEntry = snapshot.child("priceEntry").val();

    console.log("finished: "+finished +" , priceEntry: "+priceEntry);
if((currentTimestamp>=mouktijiesStop) && (started==true) && (finished==false)){

console.log("clicked")

//TODO:FIND UIDDISPLAYED.
admin.database().ref('Request_System/Pool'+num).limitToFirst(1).once('value').then(function(snapshot) {
var uidDisplayed = snapshot.val(); 

for(key in uidDisplayed){
  if(uidDisplayed.hasOwnProperty(key)) {
  var valueDisplayed = uidDisplayed[key];
  console.log(valueDisplayed);



console.log("uidDisplayed"+valueDisplayed);


var refPool = admin.database().ref('Request_System/Pool'+num);
var refDisplProf = admin.database().ref('profiles/'+valueDisplayed+"/participates/pool"+num);
var refCurrent = admin.database().ref('profiles/'+userId);

refCurrent.once('value').then(function(snapshot) {

  available_quantity = snapshot.val().currentBricks;
  console.log(available_quantity);

  //Check if user already participates in that contest.
  if(snapshot.child("participates").child("pool"+num).exists()){

    console.log(userId+" he already participates in pool"+num+" how did he get here??");
    resolve('YOU ALREADY PARTICIPATE IN THIS CYCLE');

  } else {
  //Check if he has the necessary bricks quantity.
  if( available_quantity >= priceEntry){
   
    //Write user under Request System.
    refPool.child(currentTimestamp).set(userId);
    
    //update displayer peopleInvited.
    refDisplProf.child('peopleInvited').transaction(function(peopleInvited) {
      return (peopleInvited || 0) + 1});

    //currentUser 
    refCurrent.child("participates").child("pool"+num).set({
      peopleInvited: 0,
      timestampEntered: currentTimestamp,
      },function(error) {
            if (error) {
              console.log("Problem storing email." + error);
            }
          });
    
     //-10 bricks.
     refCurrent.child('currentBricks').transaction(function(bricks) {
        return (bricks|| 0) - priceEntry}).then((retValue) => {
          getCountF(userId, num, priceEntry);
        });
    
        resolve('SUCCESS');
  } else{
    //MAYBE TERMINATE ACCOUNT, THEY TRIED TO HACK THE SYSTEM.
    console.log("Not enough bricks!");
    resolve('Not Enough Bricks');
  }
  }
  });

}}
});

} else{
  console.log("Either the contest did not start OR the mouktijies still have time.");
  resolve('YOU ARE NOT ALLOWED TO ENTER YET');
}
});

});

});





exports.enterTicket =functions.https.onCall((data,context)=>{
  return new Promise((resolve, reject) => {
  const num = data.num;
  const userId = context.auth.uid;

  var refPool = admin.database().ref('/Request_System/Pool'+num);
  var refCurrent = admin.database().ref('/profiles/'+userId);

  

  //1. IF NUMBER MOUKTIJIES < 50 THEN => CONTINUE, ELSE STOP. xx.
  //2. IF USER HAS TICKET BRONZE. xx

  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {
    var numberMouktijies = snapshot.child("numberMouktijies").val();
    var maxMouktijies = snapshot.child("maxMouktijies").val();
    var mouktijiesStop = snapshot.child("mouktijiesStop").val();
    var finished = snapshot.child("finished").val();
    var currentTimestamp = new Date().getTime();
    console.log("numberMouktijies "+ numberMouktijies+" , maxMouktijies"+ maxMouktijies+", mouktijiesStop "+mouktijiesStop+", currentTimestamp "+currentTimestamp+", finished "+finished);

    //only execute if numberOfMouktijies is less than maxMouktijies and if the mouktijies time period didn't ran out.
    if((numberMouktijies < maxMouktijies || (currentTimestamp<mouktijiesStop)) && (finished==false)){

    refCurrent.once('value').then(function(snapshot) {
    var ticket = snapshot.child("ticket");

  //Check if user already participates in that contest.
    if(snapshot.child("participates").child("pool"+num).exists()){

      console.log(userId+" he already participates in pool"+num+" how did he get here??");
      resolve('YOU ALREADY PARTICIPATE IN THIS CYCLE');
  
    } else{

    if(ticket.exists()){

      var ticketShould;
      if(num==1){
        ticketShould="bronze";
      } else if(num==2){
        ticketShould="silver";
      } else if(num==3){
        ticketShould="gold";
      }


      if(ticket.val()==ticketShould){
      
      console.log("userId "+userId+" fullfils the criteria.");
      
        //Write user under Request System.
        refPool.child(currentTimestamp).set(userId);
        count10Mins(userId,num);

        //currentUser 
        refCurrent.child("participates").child("pool"+num).set({
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
        
        const contestsRef = admin.database().ref('Contests/Pool'+num);
        contestsRef.child('numberMouktijies').transaction(function(numberMouktijies) {
          return (numberMouktijies|| 0) + 1});

          resolve('SUCCESS!');
      
      } else{
        console.log(userId+" he has a ticket of another type.");
        resolve('YOU HAVE TICKET OF ANOTHER TIER!');
      }
      } else{
        console.log("IMPORTANT - "+userId+" does not have a ticket. HOW DID HE END UP HERE?")
        resolve('YOU DO NOT HAVE A TICKET!');
      }

    }
  });
} else {
  console.log("mouktijies limit reached, or time ran out, or contest was finished.");
  resolve('YOU ARE NOT ALLOWED TO ENTER YET');
}
});

});
});




//NEED TO DO A SEPERATE FUNCTION THAT CALCULATES MINUTES. USE IT SEPERATELY. DO NOT INCREMENT MONEY WHEN MOUKTIJIES ENTER.
//make the getCount function callable and use it when ...

function count10Mins(uid,num){
  var currentTimestamp = new Date().getTime();
  var fiveMinsAgo = currentTimestamp - 300000;
  var count = 0;

  admin.database().ref('Request_System/Pool'+num).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key > fiveMinsAgo){
        console.log("count10 pirama"+ childSnapshot.key);
        count++;
      }
      
    });
    console.log("count before call"+count);
    writeMins(count,uid,num);
  });
  
}



function writeMins(retValue, uid, num){
  var unit = 3.5;
  var x= (retValue+1) * unit;
  var z1 = ((-0.1)*x);

  var y = ((32*x)*(Math.pow(3, z1)) + (217/x) + (Math.pow(x, -0.3)))/2;

  var roundedY = Math.ceil(y)
  console.log("rounded Y"+roundedY);

    //read multiplier.
    admin.database().ref('Contests/Pool'+num+'/multiplier').once('value').then(function(snapshot) {
      var multiplier = snapshot.val();
      console.log("multiplier"+multiplier);
      var timeOfDisplay = roundedY *  multiplier;
      console.log("no players entered," + retValue);
      console.log("y is : "+y+" time of display is : "+timeOfDisplay);  
      if(timeOfDisplay ==0 ){
        timeOfDisplay=1;
      }
    
    console.log(uid);
    const writeMins = admin.database().ref('/profiles/'+uid+'/participates/pool'+num+'/minsAllowed');
    return writeMins.set(timeOfDisplay);

      });

}


//Allow mouktijies one hour and then start putting other people in the game.
function mouktijiesStart(num){

  admin.database().ref('Floaters/Pool'+num+'/numberOfSpendersPreviousCycle').once('value').then(function(snapshot) {
  
  var numberOfSpendersPreviousCycle = snapshot.val();
  

  var currentTimestamp = new Date().getTime();
  admin.database().ref('Contests/Pool'+num+'/mouktijiesStart').set(currentTimestamp);
  console.log("mouktijiesStart was written. "+currentTimestamp);

  var minsAllowedMouktijies = (0.001 * numberOfSpendersPreviousCycle) + 10;
  var roundedMins = Math.ceil(minsAllowedMouktijies);
  console.log("roundedMins allowed mouktijies "+ roundedMins);
  

  admin.database().ref('Contests/Pool'+num+'/minsAllowedMouktijies').set(roundedMins);

  //allow them x minutes.
  var mouktijiesTimeStop = currentTimestamp + (roundedMins * 60000);
  admin.database().ref('Contests/Pool'+num+'/mouktijiesStop').set(mouktijiesTimeStop);
  console.log("mouktijiesStop was written. "+mouktijiesTimeStop);
  });
}


//joinContest.
exports.joinContest =functions.https.onCall((data,context)=>{
  return new Promise((resolve, reject) => {
  const num = data.num;
  const userId = context.auth.uid;
  var currentTimestamp = new Date().getTime();

  console.log("num "+num);

  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {
    var numberMouktijies = snapshot.child("numberMouktijies").val();
    var maxMouktijies = snapshot.child("maxMouktijies").val();
    var mouktijiesStop = snapshot.child("mouktijiesStop").val();
    var started = snapshot.child("started").val();
    var finished = snapshot.child("finished").val();

    if(started){

      //check if contest was finished.
      if(finished){
        console.log("contest has finished!");
        resolve('joinContestClosed.html');
      } else{
        
    admin.database().ref('/profiles/'+userId).once('value').then(function(data) {
    if(data.hasChild("participates") && data.child("participates").hasChild("pool"+num)){
      console.log("eshi, lets go to the dashboard");
      resolve('inContestDashboard.html');} 
    else if(data.hasChild("ticket")){
        //find what ticket the user should have.
          var ticketShould;
          if(num==1){
            ticketShould="bronze";
          } else if(num==2){
            ticketShould="silver";
          } else if(num==3){
            ticketShould="gold";
          }
          
        if(currentTimestamp<mouktijiesStop && numberMouktijies<maxMouktijies){

          console.log("tickeShould " + ticketShould);
          if(data.child("ticket").val()==ticketShould){
            console.log("all criteria fullfilled, mouktijis can enter "+userId);
            resolve('ticketPool'+num+'.html');} 
            
            else{
              console.log("time and limit are ok, but he has a different kind of ticket "+userId);
              resolve('waiting.html');
            }

        } else if(currentTimestamp>=mouktijiesStop && numberMouktijies<maxMouktijies){
          if(data.child("ticket").val()==ticketShould){
            console.log("all criteria fullfilled, mouktijis can enter "+userId+" the limit of free mouktijies was not reached before, so he can enter without precedence.");
            resolve('ticketPool'+num+'.html');}

            else{
              console.log("time exceeded, limit is ok, but he has a different kind of ticket "+userId+" ticketShould: "+ticketShould);
              resolve('pool'+num+'.html');
            }


        } else{
          console.log("mouktijies limit reached and time ran out.");
          resolve('pool'+num+'.html');
        }
      
      } else if(currentTimestamp < mouktijiesStop && (data.hasChild("ticket")==false)){
        console.log("mouktijies still going, but we dont have a ticket we have to wait");
        resolve('waiting.html');
      }
    else{
      console.log("en eshi, lets go to joinContest")
      resolve('pool'+num+'.html');}
  });
    }
  } else{
    console.log("competition did not start yet");
    resolve('notYet.html');
  }
  });

  });
});




function startIt(num){
  //Set started to true.
  admin.database().ref('Contests/Pool'+num+'/started').set(true);
  //Calculate multiplier value.
  admin.database().ref('Floaters/Pool'+num).once('value').then(function(snapshot) {
    var totalFloaters = snapshot.child('totalFloaters').val();
    console.log("totalFloaters "+ totalFloaters);

    //Write multiplier value.
    var multiplier = ((-0.000015) * totalFloaters) + 1.9;
    admin.database().ref('Contests/Pool'+num+'/multiplier').set(multiplier);

    //find maxMouktijies.
    var numberOfSpendersPreviousCycle = snapshot.child('numberOfSpendersPreviousCycle').val();
    var maxMouktijies = (0.02 * numberOfSpendersPreviousCycle) + 50
    console.log("numberOfSpendersPreviousCycle read: "+numberOfSpendersPreviousCycle+" ,maxMouktijies: "+maxMouktijies);
    //write maxMouktijies.
    admin.database().ref('Contests/Pool'+num+'/maxMouktijies').set(maxMouktijies);
  });

}


exports.started = functions.database.ref('Contests/Pool1/started')
.onUpdate((change, context)=>{
  mouktijiesStart(1);
});

exports.started2 = functions.database.ref('Contests/Pool2/started')
.onUpdate((change, context)=>{
  mouktijiesStart(2);
});

exports.started3 = functions.database.ref('Contests/Pool3/started')
.onUpdate((change, context)=>{
  mouktijiesStart(3);
});



exports.startPool = functions.https.onRequest((data,context)=>{
  // startIt();
});


//find the total number of floaters.
function findTotalFloaters(num){
  //find people that have more bricks than the current entry price.
  admin.database().ref('profiles').once('value').then(function(snapshot) {
    var count = 0;
  snapshot.forEach((child) => {
      //TODO: change this later to be dynamic.
      var priceEntry;

      if(num == 1){
        priceEntry=10;
      } else if(num == 2){
        priceEntry=40;
      } else if(num == 3){
        priceEntry=100;
      }



      var currentBricks = child.child("currentBricks").val();
      if(currentBricks>=priceEntry){
          count++;
      }
    });
    console.log("count moreThanEntryPice "+ count);
    //ADD THE NUMBER OF SPENDERS - FREERIDERS OF THIS CYCLE TO THE FLOATERS TABLE.
    return admin.database().ref('/Floaters/Pool'+num+'/peopleMoreThanEntryPrice').set(count).then(()=>{
      admin.database().ref('Floaters').once('value').then(function(snapshot) {
        //POOL'+num+'.
        var numberOfSpendersPreviousCycle = snapshot.child("Pool"+num).child("numberOfSpendersPreviousCycle").val();
        var peopleMoreThanEntryPrice = snapshot.child("Pool"+num).child("peopleMoreThanEntryPrice").val();

        //write totalFloaters.
        var totalFloaters = numberOfSpendersPreviousCycle + peopleMoreThanEntryPrice; 
        admin.database().ref('/Floaters/Pool'+num+'/totalFloaters').set(totalFloaters);
        console.log("totalFloaters written "+ totalFloaters);

        //calculate duration of Cycle in Hours.
        var durationCycleHours = (0.001 * totalFloaters)+ 144;
        var roundedCycleHours = Math.ceil(durationCycleHours)
        console.log("rounded cycle hours "+ roundedCycleHours)
        admin.database().ref('Contests/Pool'+num+'/durationCycleHours').set(roundedCycleHours);

        //write when the cycle will end.
        var durationInMilli = (roundedCycleHours * 60) * 60000;
        var currentTimestamp = new Date().getTime();
        var timestampEndCycle = currentTimestamp + durationInMilli;
        admin.database().ref('Contests/Pool'+num+'/timestampEndCycle').set(timestampEndCycle).then(()=>{
          startIt(num);
        });

    });
    });
  });

}


function randomize(num){

  admin.database().ref('Request_System/Pool'+num).limitToFirst(1).once('value').then(function(snapshot) {
   console.log("num is: "+num);
    
    var timestampDisplayer;
    snapshot.forEach((child) => {
       timestampDisplayer = child.key;
      console.log("here"+timestampDisplayer);
    });

  

  admin.database().ref('Request_System/Pool'+num).once('value').then(function(snapshot) {
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
  

          admin.database().ref('Request_System/Pool'+num+'/'+newTimestamp).once("value", snapshot => {
            if (snapshot.exists()){
                var uidExchange = snapshot.val();
                //remove user.
                admin.database().ref('Request_System/Pool'+num+'/'+newTimestamp).remove();

                //generate a new timestamp.
                var randomPlus = Math.floor(Math.random() * 100);
                console.log("random plus "+randomPlus);
                var exchTimestamp = Number(newTimestamp)+randomPlus;
                console.log("exchTimestamp "+exchTimestamp);

                //add again user under his new timestamp.
                const exchangeRequest = admin.database().ref('Request_System/Pool'+num+'/'+exchTimestamp);
                exchangeRequest.set(uidExchange);
                console.log("child was exchanged..");

                //remove randomer from his old location.
                admin.database().ref('Request_System/Pool'+num+'/'+keyRandomer).remove();
                console.log("randomer removed from inside.");

                //add the to his new location- under newTimestamp.
                const updateRequest = admin.database().ref('Request_System/Pool'+num+'/'+newTimestamp);
                updateRequest.set(uidRandomer);
                console.log("added.");
  



            } else{
              admin.database().ref('Request_System/Pool'+num+'/'+keyRandomer).remove();
              console.log("child removed.");

              const updateRequest = admin.database().ref('Request_System/Pool'+num+'/'+newTimestamp);
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

}


function runner(num){
  console.log("num is: "+num);
  var currentTimestamp = new Date().getTime();

  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshotX) {
    var timestampEndCycle = snapshotX.child("timestampEndCycle").val();
    var durationCycleHours = snapshotX.child("durationCycleHours").val();
    var durationInMilli = (durationCycleHours * 60) * 60000;
    var finished = snapshotX.child("finished").val();
    
  
    console.log("timestampEndCycle "+ timestampEndCycle +" durationCycleHours "+ durationCycleHours+ " durationInMilli "+durationInMilli);
  
    if((currentTimestamp < timestampEndCycle)){
   
    admin.database().ref('Request_System/Pool'+num).limitToFirst(1).once('value').then(function(snapshot) {
  
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
  
      
        admin.database().ref('profiles/'+value+'/participates/pool'+num).once('value').then(function(snapshot) {
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
                admin.database().ref('profiles/'+value+'/participates/pool'+num).child("completedRequest").set(true);
                
                //Check if he is an one bricker, add him to the counter.
                if(peopleInvited==1){
                  const oneBrickerPlusOne = admin.database().ref('Contests/Pool'+num);
                  oneBrickerPlusOne.child('numberOneBrickers').transaction(function(numberOneBrickers) {
                        return (numberOneBrickers|| 0) + 1});
                        console.log("oneBricker counter incremented");
  
                  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {
                    var sumBonusOneBrick = snapshot.child("sumBonusOneBrick").val();
                    var numberOneBrickers = snapshot.child("numberOneBrickers").val();
                    var bonusPerOneBricker = sumBonusOneBrick/numberOneBrickers;
                    admin.database().ref('Contests/Pool'+num+'/bonusPerOneBricker').set(bonusPerOneBricker);
                    console.log("bonusPerOneBricker was written. value:"+bonusPerOneBricker);
                  });
                }
  
                //remove him from the request system.
                admin.database().ref('Request_System/Pool'+num+'/'+keyX).remove();
                console.log(value+" deleted from request system.");
  
                const completedRequestPlusOne = admin.database().ref('Contests/Pool'+num);
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
    } 
    
      //MOST IMPORTANT SECTION. THIS AUTOMATICALLY TERMINATES A CONTEST AND STARTS A NEW ONE AFTER X HOURS. THIS MAKES THE
      //WHOLE SYSTEM AUTOMATIC.
    else{
      console.log("We are in the else.");
      //TERMINATE CONTEST BY MAKING FINISHED TRUE.
      if(finished == false){
      //make started false which will basically terminate the contest. No other users will be allowed to get in the contest.
      // admin.database().ref('Contests/Pool'+num+'/started').set(false);
      admin.database().ref('Contests/Pool'+num+'/finished').set(true);
      
      const oneBrickerPlusOne = admin.database().ref('Contests/Pool'+num);
      admin.database().ref('Request_System/Pool'+num).limitToFirst(1).once('value').then(function(snapshot) {
        var uidOfDisplayer = snapshot.val(); 
        
        
        for(key in uidOfDisplayer){
          if(uidOfDisplayer.hasOwnProperty(key)) {
          var value = uidOfDisplayer[key];
          console.log(value);
  
        
          admin.database().ref('profiles/'+value+'/participates/pool'+num+'/peopleInvited').once('value').then(function(snapshot) {
            var peopleInvited = snapshot.val();
  
  
            if(peopleInvited == 1){
              oneBrickerPlusOne.child('numberOneBrickers').transaction(function(numberOneBrickers) {
                return (numberOneBrickers|| 0) + 1});
                console.log("oneBricker counter incremented");
            }
               
  
            });
          }
        
          findFreeRiders(num);
        
        }
        
        
        });
  
      console.log("THE CONTEST WILL AUTOMATICALLY TERMINATE.")
      }
      //IF THE CONTEST IS ALREADY FINISHED, DO CHECKS TO SEE IF ITS TIME TO START THE NEW CONTEST.
      else{
        var dateNewContest = timestampEndCycle + durationInMilli;
      console.log("IMPORTANT! - dateNewContest "+ dateNewContest);
      admin.database().ref('Contests/Pool'+num+'/dateNewContest').set(dateNewContest);
      
      if(currentTimestamp >= dateNewContest){
        console.log("VERY IMPORTANT!! - NEW CONTEST IS ABOUT TO START.");
        initialize(num);
      }
      } 
     
    }
  
  });
  
}

//Used for the GRAPHS.
function minsPool(num){
  var currentTimestamp = new Date().getTime();
  var fiveMinsAgo = currentTimestamp - 300000;
  var count = 0;

  admin.database().ref('Contests/Pool'+num).once('value').then(function(snapshot) {

  var finished = snapshot.child("finished").val();
  console.log("finished value "+ finished);

  if(!finished){
  //count how many players entered last 5 minutes. 
  admin.database().ref('Request_System/Pool'+num).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key > fiveMinsAgo){
        console.log("count5 pirama"+ childSnapshot.key);
        count++;
      }
      
    });

    //Write how many entered the last 10 minutes in the graph.
    admin.database().ref('Graphs/Pool'+num+'/'+currentTimestamp).set(count);
    console.log("count value for realtime graph was updated. "+count+" , for time: "+currentTimestamp);
    
  });
  } else {
    console.log("Contest has finished.")
  }

});

}


function writeFreeTicket(uid, num){
  if(num == 1){
    admin.database().ref('/profiles/'+uid+'/ticket').set("bronze");
    console.log("written bronze");
  } else if (num == 2){
    admin.database().ref('/profiles/'+uid+'/ticket').set("silver");
    console.log("written silver");
  } else if (num == 3){
    admin.database().ref('/profiles/'+uid+'/ticket').set("gold");
    console.log("written gold");
  }


}