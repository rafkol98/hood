console.log("called a")
firebase.auth().onAuthStateChanged(function (user) {
    if (user) { // Update the count down every 1 second
        var database = firebase.database();
        var userId = user.uid;
        database.ref('Contests').once('value').then(function (snapshot) {
            for (var i = 1; i <= 3; i++) {

                var finished = snapshot.child("Pool" + i).child("finished").val();

                var card10 = document.getElementById("card" + i);


                // POOL1.
                // if its finished, make card10 content invisible.
                if (!finished) {

                    card10.style.visibility = "visible";
                    $(".loader2").fadeOut("slow");


                } else {
                    var category;
                    if (i == 1) {
                        category = "BRONZE";
                    } else if (i == 2) {
                        category = "SILVER";
                    } else if (i == 3) {
                        category = "GOLD";
                    }

                    card10.innerHTML = "<h3 class='card-title'>" + category + "</h3> <h5>THIS CYCLE FINISHED</h5> <p>The new cycle begins in:</p> <h3 id='countdown" + i + "' class='dashboard-numbers2' style='text-align: center;'>...</h3> <button type='button' class='btn btn-new' id='stats" + i + "'>SEE STATS</button>";
                    card10.style.visibility = "visible";
                    setTime(i);
                    $(".loader2").fadeOut("slow");


                    $("#stats1").click(function () {

                        window.location.href = "lastPool1Stats.html";

                    });


                    $("#stats2").click(function () {

                        window.location.href = "lastPool2Stats.html";

                    });

                    $("#stats3").click(function () {

                        window.location.href = "lastPool3Stats.html";

                    });


                }

            }


        });
    }


});


function setTime(i) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // Update the count down every 1 second
            var database = firebase.database();
            var userId = user.uid;


            // check if element exists.
            var myEle = document.getElementById("countdown" + i);
            if (myEle != null) {

                database.ref('Contests/Pool' + i).once('value').then(function (snapshot) {
                    var dateNewContest = snapshot.child("dateNewContest").val();


                    var end = new Date(dateNewContest);
                    console.log("end " + end);
                    var _second = 1000;
                    var _minute = _second * 60;
                    var _hour = _minute * 60;
                    var _day = _hour * 24;
                    var timer;

                    // show remaining time until the contest starts again.
                    function showRemaining() {
                        var now = new Date();
                        var distance = end - now;
                        if (distance < 0) {

                            clearInterval(timer);
                            document.getElementById('countdown' + i).innerHTML = '...';

                            return;
                        }
                        var days = Math.floor(distance / _day);
                        var hours = Math.floor((distance % _day) / _hour);
                        var minutes = Math.floor((distance % _hour) / _minute);
                        var seconds = Math.floor((distance % _minute) / _second);

                        // console.log("i = "+i+" alo "+ days+" "+hours+" "+minutes+" "+seconds);


                        document.getElementById('countdown' + i).innerHTML = days + 'days ';
                        document.getElementById('countdown' + i).innerHTML += hours + 'hrs ';
                        document.getElementById('countdown' + i).innerHTML += minutes + 'mins ';
                        document.getElementById('countdown' + i).innerHTML += seconds + 'secs';
                    }

                    timer = setInterval(showRemaining, 1000);

                });

            } else {
                console.log("false " + i);
            }


        }

        // }
    });
}
