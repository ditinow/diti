<?php
$key   = hex2bin("d0e84ed3edceb0c92db2621f64ae4f8d");
$iv    = hex2bin("f5547c653a7022e9958d3c9de1fcc1af");

$mes        = hex2bin($_POST["regCode"]);
$asset      = $_POST["asset"];

$res = openssl_decrypt($mes, 'AES-128-CBC', $key, OPENSSL_RAW_DATA,$iv);
if($res==""){
  echo '{"validateTitleToken":"failed"}';
}else if($res != $asset){
  echo '{"validateTitleToken":"mismatch","decrypted":"'.$res.'"}';
}else if($res == $asset){
  echo '{"validateTitleToken":"matched","decrypted":"'.$res.'"}';
};
?>
