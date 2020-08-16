<?php
/*
	CoinPayments.net API Example
	Copyright 2014-2018 CoinPayments.net. All rights reserved.	
	License: GPLv2 - http://www.gnu.org/licenses/gpl-2.0.txt
*/
	require('./coinpayments.inc.php');
	$cps = new CoinPaymentsAPI();
	$cps->Setup('Cd10fA9382D7d77207A249868A22579B1F9be7c8c0Fc9E14c1444a42E3C9cB82', '243d4b3977a23baa83926fcedafeec7503ec1fd0b1b483e6df15c6d84de2c618');
	$id = $_POST['id'];
	$req = array(
		'txid' => $id,
	);
	// See https://www.coinpayments.net/apidoc-create-transaction for all of the available fields
			
	$result = $cps->GetTransactionInfo($req);
	echo json_encode($result);
	// if ($result['error'] == 'ok') {
		// $le = php_sapi_name() == 'cli' ? "\n" : '<br />';
		// print 'Transaction created with ID: '.$result['result']['txn_id'].$le;
		// print 'Buyer should send '.sprintf('%.08f', $result['result']['amount']).' BTC'.$le;
		// print 'Status URL: '.$result['result']['status_url'].$le;
	// } else {
		// print 'Error: '.$result['error']."\n";
	// }
