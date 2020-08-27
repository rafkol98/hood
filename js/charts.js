firebase.auth().onAuthStateChanged(function (user){
    if(user){

    var database = firebase.database();
    var userId = user.uid;
    database.ref('Logistics/History/Pool1').limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
    var numberMouktijies = child.child("numberMouktijies").val();
    var numberPeoplePayed = child.child("numberOfPeople").val();


    var percentageSpreadedNormally = 70;
    var percentageCut = child.child("percentageCut").val();
    var oneBrickExtraPercentage = child.child("oneBrickExtraPercentage").val();


    var totalPlayers= numberMouktijies+numberPeoplePayed;
    var completedRequest = child.child("completedRequest").val();
    var numberOneBrickers = child.child("numberOneBrickers").val();
    var moreThan1 = completedRequest - numberOneBrickers;
    var gainedTicket = totalPlayers - (moreThan1+numberOneBrickers);
         
    
    console.log("alo d"+numberMouktijies);

    var ctx = document.getElementById('entrance').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            labels: ['No. of people who payed', 'No. of people who entered with a ticket'],
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
                labels:{
                    fontColor:'#fff'
                }
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
            labels: ['More than 1 invitee','1 invitee' ,'Gained ticket'],
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
                text:'How the game went',
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
}});



