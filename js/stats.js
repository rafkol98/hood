firebase.auth().onAuthStateChanged(function (user){
    if(user){

    var database = firebase.database();
    var userId = user.uid;
    
    database.ref('profiles/'+userId+'/history/pool1').once('value').then(function(snapshot) {
    var chartTitles = [];
    var chartData = [];
    
    //add data to the chart.
    snapshot.forEach(function(child) {
    var timestamp = Number(child.key);
    console.log(timestamp);
    var peopleInvited = child.child("peopleInvited").val();
    console.log("peopleInvited"+peopleInvited);

    var date = new Date(timestamp).toDateString();
    
    console.log("time "+date);
    chartTitles.push(date);
    chartData.push(peopleInvited);
    });
    
    
    console.log(chartData);
    var ctx = document.getElementById('personal').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chartTitles,
            datasets: [{
                label: 'People',
                backgroundColor: ['rgb(249, 87, 0)'],
                borderColor: 'black',
                data: chartData
            }]
        },

        // Configuration options go here
        options: {
            title:{
                display:true,
                text:'PEOPLE YOU INVITED PER CONTEST',
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

database.ref('profiles/'+userId).once('value').then(function(snapshot) {

    if(snapshot.hasChild("bricksEarnedLast")){

        var chartTitles = [];
        var chartData = [];
        
        //add data to the chart.
        snapshot.child("bricksEarnedLast").forEach(function(child) {
        var timestamp = Number(child.key);
        console.log(timestamp);
        var bricksEarned = child.val();
        
    
        var date = new Date(timestamp).toDateString();
        
        console.log("time "+date);
        chartTitles.push(date);
        chartData.push(bricksEarned);
        });
        
        
        console.log(chartData);
        var ctx = document.getElementById('bricksPerContest').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
    
            // The data for our dataset
            data: {
                labels: chartTitles,
                datasets: [{
                    label: 'People',
                    backgroundColor: ['rgb(249, 87, 0)'],
                    borderColor: 'black',
                    data: chartData
                }]
            },
    
            // Configuration options go here
            options: {
                title:{
                    display:true,
                    text:'BRICKS YOU EARNED PER CONTEST',
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





    } 
  
});







}});



