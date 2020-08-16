//Save wallet address of user to firebase realtime database.
$("#btn_saveWallet").click(function(){
    firebase.auth().onAuthStateChanged(function (user){
        if(user){
    var database = firebase.database();
    var userId = user.uid;
    var ref = database.ref('/profiles/').child(userId).child("wallet");

    var walletAddressValue = $("#enterWalletDetails").val();

    ref.set({
        walletId: walletAddressValue,
        },function(error) {
              if (error) {
                alert("Problem storing wallet's details." + error);
              } else{
                alert("Wallet saved successfully." + error);
                window.location.href = "loggedIn.html";
              }
            });
    }});
});