<?php
$url = "http://40.124.110.187:19886/nxt";
$mySecretPhrase = "ci di wu yin 302 liang ge bi wang er bu ceng tou";
$key   = hex2bin("d0e84ed3edceb0c92db2621f64ae4f8d");
$iv    = hex2bin("f5547c653a7022e9958d3c9de1fcc1af");

// $mes        = hex2bin($_POST["regCode"]);
$mes   = base64_decode($_POST["regCode"]);
$asset      = $_POST["asset"];
$recipient  = $_POST["recipient"];
$publicKey  = $_POST["publicKey"];

$res = openssl_decrypt($mes, 'AES-128-CBC', $key, OPENSSL_RAW_DATA,$iv);
if($res==""){
  echo '{"requestTitleToken":"failed"}';
}else if($res != $asset){
  echo '{"requestTitleToken":"mismatch","decrypted":"'.$res.'"}';
}else if($res == $asset){
  $postRequest = array(
      'requestType'   => 'transferAsset',
      'recipient'     => $recipient,
      'publicKey'     => $publicKey,
      'asset'         => $asset,
      'quantityQNT'   => '1',
      'secretPhrase'  => $mySecretPhrase,
      'feeNQT'        => '0',
      'deadline'      => '60',
      'broadcast'     => 'false',
  );
  $cURLConnection = curl_init($url);
  curl_setopt($cURLConnection, CURLOPT_POSTFIELDS, $postRequest);
  curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
  $apiResponse = curl_exec($cURLConnection);
  curl_close($cURLConnection);
  echo $apiResponse;
};
?>
