//This file for intranet use only, never post on public web server.
//本文件仅限企业内部网使用。请勿上传至公共的WEB服务器。

var keyHex ="d0e84ed3edceb0c92db2621f64ae4f8d";
var ivHex  ="f5547c653a7022e9958d3c9de1fcc1af";

//For demonstration use only, real live production should never save passphrase in plain textStr
//仅限演示版。实际生产应由操作员输入密钥，而不是将它保存为文本。
var secretPhraseIssuance = "ci di wu yin 300 liang ge bi wang er bu ceng tou";
var secretPhraseActivation = "ci di wu yin 302 liang ge bi wang er bu ceng tou";

var walletsObj=[
  {
    accountRS:"CC14-5KKJ-TXML-FKM3-4SLZB",
    secretPhrase: "ci di wu yin 300 liang ge bi wang er bu ceng tou"
  },
  {
    accountRS:"CC14-UEM4-XQBX-HZWW-G2FNW",
    secretPhrase: "ci di wu yin 301 liang ge bi wang er bu ceng tou"
  },
  {
    accountRS:"CC14-F4Z6-3E9T-EXSK-HPYWH",
    secretPhrase: "ci di wu yin 302 liang ge bi wang er bu ceng tou"
  },
  {
    accountRS:"CC14-DUPL-QDTD-ZGDJ-7YJTW",
    secretPhrase: "ci di wu yin 303 liang ge bi wang er bu ceng tou"
  },
  {
    accountRS:"CC14-6LFR-HCTG-F2LR-87ZB4",
    secretPhrase: "ci di wu yin 304 liang ge bi wang er bu ceng tou"
  },
  {
    accountRS:"CC14-CWWS-4MHT-ZKHY-DGUYC",
    secretPhrase: "ci di wu yin 305 liang ge bi wang er bu ceng tou"
  }
];
