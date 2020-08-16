var Coinpayments = require(['coinpayments'], function (coinpayments) {
    //foo is now loaded.
    return coinpayments;
});

const options = {
    key: 'bfc4b716046a5317951e9ef8eb1137a8131b6db6c6735dcb25167caa71274e52',    //Will be replaced by your public api key
    secret: 'a25973dfb9c67C6bd0A082496015b96276cECee88DA2fC9ABa2d552eb776339f', //Will be replaced by your private api key
    amount: 0.5,        //Sending 0.5 USD for testing purpose, will be replaced by project.price
    currency1: 'USD',
    currency2: 'LTCT',  //Using Litecoin Testnet for testing, will be replaced by currency
    // buyer_email: project.meta.user.email
  }
const client = new Coinpayments(options);
console.log(client.getBasicInfo());
// const options = {
//     key: 'bfc4b716046a5317951e9ef8eb1137a8131b6db6c6735dcb25167caa71274e52',    //Will be replaced by your public api key
//     secret: 'a25973dfb9c67C6bd0A082496015b96276cECee88DA2fC9ABa2d552eb776339f', //Will be replaced by your private api key
//     amount: 0.5,        //Sending 0.5 USD for testing purpose, will be replaced by project.price
//     currency1: 'USD',
//     currency2: 'LTCT',  //Using Litecoin Testnet for testing, will be replaced by currency
//     buyer_email: project.meta.user.email
//   }
//   const client = new Coinpayments(options);
//   client.createTransaction(options).then(function(resp){
//     setData(resp);
//     console.log(resp);
//     console.log(project);
//     setStatusCode(0);
//     setStatusMessage('Pending');
//     options.txid = resp.txn_id;
//     const interval = setInterval(() => {
//       client.getTx(options).then(function(resp){
//         console.log(resp);
//         if(resp.status == 1){
          
//           console.log("Payment Received Successfully!! Will Complete it shortly!");
//           console.log(resp);
//           resp.buyer_email = project.meta.user.email;
//           props.history.push({
//             pathname: '/pay-approved',
//             state: {currency: currency, response: resp}
//           });
//           clearInterval(interval);            
//         } else if (resp.status == -1) {

//         } else if (resp.status == 100){
//           console.log("Payment Completed!!");
//           console.log(resp);
//           // clearInterval(interval);
//         }
//       }).catch();
//     }, 2000);
//     // setTimeout(() => { 
//     //   clearInterval(interval);
//       // props.history.push({
//       //   pathname: '/pay-approved',
//       //   state: {currency: currency, options: options}
//       // });
//     // }, 60000);
//   }).catch();