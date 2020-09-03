    console.log("called a")
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // Update the count down every 1 second
            var database = firebase.database();
            var userId = user.uid;
            database.ref('Contests').once('value').then(function (snapshot) {
                for(var i=1;i<=3;i++){

                    var finished = snapshot.child("Pool"+i).child("finished").val();

                    var card10 = document.getElementById("card"+i);
        
                    //POOL1.
                    //if its finished, make card10 content invisible.
                    if(!finished){
                       
                        card10.style.visibility = "visible";
        
                    } else {
    
                        var category;
                        if(i==1){
                            category="BRONZE";
                        } else if (i==2){
                            category="SILVER";
                        } else if (i==3){
                            category="GOLD";
                        } 

                        card10.innerHTML = "<h3 class='card-title'>"+category+" TIER POOL</h3> <h5>THIS CONTEST FINISHED</h5> <p>The new contests starts in:</p> <h3 id='countdown"+i+"' class='dashboard-numbers2' style='text-align: center;'>Loading...</h3> <button type='button' class='btn btn-new' id='stats1'>SEE STATS</button>";  
                        card10.style.visibility = "visible";
    
                        $("#stats1").click(function () {
                            console.log("clicked");
                              window.location.href = "lastPool1Stats.html";
                          });
                          
                    }

                }
               
    
    
    
    
            });
        }


        
    });



