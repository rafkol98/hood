
//TODO: make sure can only enter one contest.

function showCard() {
    console.log("button enabled");
    //Get the person who invited the user.
    var invitedById = localStorage.getItem("invitedByuId");
    var database = firebase.database();
    var senderRef = database.ref('/profiles/'+invitedById+"/participatesIn");

    senderRef.on('value', gotData, errData);

    //TODO: make sure to increment peopleInvited on the person who owns the inviteCode that the user used.

    //Get data of the sender, check which contest he is in. Only enable that contest for the user.
    function gotData(data){
    if(data.hasChild('current5')){
        //show appropriate card.
        document.getElementById("joinSmall").disabled = false;
        document.getElementById("pool1").style.display = 'block'; 
    } else if(data.hasChild('current20')){
        //enable button.
        document.getElementById("joinMedium").disabled = false;
        document.getElementById("pool2").style.display = 'block'; 
    } else if(data.hasChild('current100')){
        //enable button.
        document.getElementById("joinBig").disabled = false;
        document.getElementById("pool3").style.display = 'block'; 
    }
}



    function errData(err) {
        console.log('Error!');
        console.log(err);
    }


    
}