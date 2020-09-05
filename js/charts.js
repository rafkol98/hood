function chartCall(num){


firebase.auth().onAuthStateChanged(function (user){
    if(user){

    var database = firebase.database();
    var userId = user.uid;
    database.ref('Logistics/History/Pool'+num).limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
    var bricksSpread = child.child("moneySpread").val();
    var durationOfCycle = child.child("durationCycleHours").val();

    $("#bricksSpread").html(bricksSpread + " Bricks");
    $("#durationCycle").html(durationOfCycle + " Hours");

    var numberMouktijies = child.child("numberMouktijies").val();
    var numberPeoplePayed = child.child("numberOfPeople").val();


    var percentageSpreadedNormally = 70;
    var percentageCut = child.child("percentageCut").val();
    var oneBrickExtraPercentage = child.child("oneBrickExtraPercentage").val();


    var totalPlayers= numberMouktijies+numberPeoplePayed;
    var completedRequest = child.child("completedRequest").val();
    var numberOneBrickers = child.child("numberOneBrickers").val();
    var moreThan1 = completedRequest - numberOneBrickers;

    if(moreThan1<0){
        moreThan1=0;
    }


    var gainedTicket = totalPlayers - (moreThan1+numberOneBrickers);
         
    
    console.log("alo d"+numberMouktijies);

    var ctx = document.getElementById('entrance').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            labels: ['No. of users who payed to join', 'No. of users who joined with a ticket'],
            datasets: [{
                label: 'People',
                backgroundColor: ['rgb(249, 87, 0)','#FC8A17'],
                borderColor: 'black',
                data: [numberPeoplePayed,numberMouktijies]
            }]
        },

        // Configuration options go here
        options: {
            title:{
                display:true,
                text:'Entrance - Payed vs Ticket',
                fontColor: 'white',
                fontSize:30

            },
            legend:{
                display:true,
                position:'bottom',
                
            },
        }
    });


    var percCut = document.getElementById('percCut').getContext('2d');
    var chart = new Chart(percCut, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['Percentage spreaded normally','Percentage bonus for one brickers' ,'Percentage cut profit'],
            datasets: [{
                label: '%',
                backgroundColor: ['rgb(249, 87, 0)','#FC8A17','#fad6a5'],
                borderColor: 'black',
                data: [percentageSpreadedNormally,oneBrickExtraPercentage, percentageCut]
            }]
        },

        // Configuration options go here
        options: {
            title:{
                display:true,
                text:'Percentage Spread',
                fontColor: 'white',
                fontSize:30

            },
            legend:{
                display:false,
                // position:'bottom',
                // labels:{
                //     fontColor:'#fff'
                // }
            },
        }
    });


    var numbers = document.getElementById('numbers').getContext('2d');
    var chart = new Chart(numbers, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['Earners more than 1 deposit','Earners with 1 deposit' ,'Spenders'],
            datasets: [{
                label: 'Number of people',
                backgroundColor: ['rgb(249, 87, 0)','#FC8A17','#fad6a5'],
                borderColor: 'black',
                data: [moreThan1,numberOneBrickers, gainedTicket]
            }]
        },

        // Configuration options go here
        options: {
            title:{
                display:true,
                text:'Earners and Spenders',
                fontColor: 'white',
                fontSize:30

            },
            legend:{
                display:false,
                // position:'bottom',
                // labels:{
                //     fontColor:'#fff'
                // }
            },
        }
    });

    });
});


database.ref('Logistics/History/Pool'+num).once('value').then(function(snapshot) {

    var chartTitles = [];
    var chartData = [];
    
    snapshot.forEach(function(child) {
        var timestamp = Number(child.key);
        var date = new Date(timestamp).toDateString();

        var numberMouktijies = child.child("numberMouktijies").val();
        var numberPeoplePayed = child.child("numberOfPeople").val();
        var totalPlayers= numberMouktijies+numberPeoplePayed;

        //add the total players and date to arrays.
        chartTitles.push(date);
        chartData.push(totalPlayers);
    });


    var comparePlayers = document.getElementById('comparePlayers').getContext('2d');
    var chart = new Chart(comparePlayers, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartTitles,
            datasets: [{
                label: 'Compare People',
                backgroundColor: ['rgb(249, 87, 0)'],
                borderColor: 'black',
                data: chartData
            }]
        },

        // Configuration options go here
        options: {
            title:{
                display:true,
                text:'Number of users per Cycle',
                fontColor: 'white',
                fontSize:20

            },
            legend:{
                display:false,
                position:'bottom',
                labels:{
                    fontColor:'#fff'
                }
            },
        }
    });

});




}});



}
