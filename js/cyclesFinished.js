
    console.log("called a")
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // Update the count down every 1 second
            var database = firebase.database();
            var userId = user.uid;
            database.ref('Contests').once('value').then(function (snapshot) {
                var finished = snapshot.child("Pool1").child("finished").val();

                var card10 = document.getElementById("card10");
    
                //if its finished, make card10 content invisible.
                if(!finished){
                   
                    card10.style.visibility = "visible";
    
                } else {

                    card10.innerHTML = "<h3 class='card-title'>SMALL TIER POOL</h3> <h5>THIS CONTEST FINISHED</h5> <p>The new contests starts in:</p> <h3 id='countdown' class='dashboard-numbers2' style='text-align: center;'>Loading...</h3> <button type='button' class='btn btn-new' id='stats1'>SEE STATS</button>";  
                    card10.style.visibility = "visible";
                }
    
    
    
    
            });
        }
    });



