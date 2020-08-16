  // Login user.
  $("#btn-login").click(function(){

    var email = $("#email").val();
    var password = $("#password").val();

    if(email != "" && password !=""){

        var result = firebase.auth().signInWithEmailAndPassword(email,password);
        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            
            console.log(errorCode);
            console.log(errorMessage);
            window.alert("Message :" + errorMessage);
        }
        );

    }else{
        window.alert("Please write both your email and password to login");
    }
  });