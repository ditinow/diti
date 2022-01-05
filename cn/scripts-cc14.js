var epochBeginning=1560945600;

//setup apiNodeURL
if(localStorage.getItem("selectedNodeUrl") == undefined){
  var apiNodeURL = "http://13.52.217.197:19886/nxt";
  localStorage.setItem("selectedNodeUrl", "http://13.52.217.197:19886/");
  console.log(apiNodeURL);
}else{
  var apiNodeURL = localStorage.getItem("selectedNodeUrl")+"nxt";
  console.log(apiNodeURL);
};

// $("#apiUrlForm").submit(function(event){
//   event.preventDefault();
//   localStorage.clear();
//   var formData = $(this).serializeArray();
//   localStorage.setItem("apiUrl", formData[0].value);
// });

//export web table to excel ====================================================
$("#table2excel").click(function(){
  var secEpoch = Math.floor( Date.now() / 1000 );
  $("#issueNFTResultTbl").table2excel({
    exclude: ".noExl",
    name: "Worksheet Name",
    filename:"NFT_"+secEpoch,
    fileext: ".xls"
  });
});

$("#table2excelwSno").click(function(){
  var secEpoch = Math.floor( Date.now() / 1000 );
  $("#issueNFTwSNoResultTbl").table2excel({
    exclude: ".noExl",
    name: "Worksheet Name",
    filename:"NFT_"+secEpoch,
    fileext: ".xls"
  });
});

//export web table to excel ====================================================
$("#table2excel").click(function(){
  var secEpoch = Math.floor( Date.now() / 1000 );
  $("#issueNFTResultTbl").table2excel({
    exclude: ".noExl",
    name: "Worksheet Name",
    filename:"NFT_"+secEpoch,
    fileext: ".xls"
  });
});

$("#table2excelwSno").click(function(){
  var secEpoch = Math.floor( Date.now() / 1000 );
  $("#issueNFTwSNoResultTbl").table2excel({
    exclude: ".noExl",
    name: "Worksheet Name",
    filename:"NFT_"+secEpoch,
    fileext: ".xls"
  });
});
//##############################################################################
//#                                                                            #
//#                          for utilities.htm;                                #
//#                                                                            #
//##############################################################################
//New Ardor Wallet --------------------------------------------------------start
$("#newWalletForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var getAccountId = [
    {name:"requestType",value:"getAccountId"},
    {name:"secretPhrase",value:formData[0].value},
  ];
  console.log(apiNodeURL);

  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAccountId,
    success:function(response){
      var responseObj=JSON.parse(response);
      $("#newWalletResultTbl1").html(responseObj.accountRS);
      $("#newCC14Wallet").val(responseObj.accountRS);
      $("#newCC14WalletPubKey").val(responseObj.publicKey);
      $("#newWalletResultTbl2").html(responseObj.publicKey);
      $("#newWalletResultTbl3").html(formData[0].value);
      $("#newWalletJSON").append("<h6>getAccountId</h6><textarea class='form-control border border-info' rows='7'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      var accountRSConfig={
        width: 300,
        height: 300,
        text:responseObj.accountRS,
        PI:"#0C8918",
        quietZone: 25,
        logo:"../images/logo-cc14-qr.png",
        logoWidth:100,
        logoHeight:50,
        title:"accountRS",
        titleHeight:30,
        titleTop:10,
        correctLevel: QRCode.CorrectLevel.H
      };
      var passphraseConfig={
        width: 300,
        height: 300,
        text:formData[0].value,
        PI:"#177CB0",
        quietZone: 25,
        logo:"../images/logo-cc14-qr.png",
        logoWidth:100,
        logoHeight:50,
        title:"Passphrase",
        titleHeight:30,
        titleTop:10,
        correctLevel: QRCode.CorrectLevel.Q
      };
      var t=new QRCode(document.getElementById("newWalletQRCode"), accountRSConfig);
      var t=new QRCode(document.getElementById("newWalletQRCode"), passphraseConfig);
    }
  });
  $("#newWalletResponse").removeClass("d-none");
});

//Request CC14 Token ------------------------------------------------------start
$("#requestCC14Form").submit(function(event){
  $("#requestCC14Response").removeClass("d-none");
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  var requestCC14 = [
    {name:"account",value: formData[0].value.trim()},
    {name:"publicKey",value: formData[1].value.trim()},
  ];
  $.ajax({
    type:"POST",
    url: "../requestCC14.php",
    data: requestCC14,
    success:function(response){
      var responseObj  = JSON.parse(response);
      console.log(responseObj);
      if(responseObj.request =="incorrectAccount"){
        $("#requestCC14Result").html("Request rejected: incorrect account");
      }else if(responseObj.request =="unconfirmedTX"){
        $("#requestCC14Result").html("Unconfirmed transactions found. Please wait 60 seconds then reload the page and retry.");
      }else if(responseObj.request =="exceed"){
        $("#requestCC14Result").html(formData[0].value.trim() + " received more than 2000 CC14 from CryptoC14.com. Please contact WeChat_ID: fengyun_houston for additional amount.");
      }else{
        $("#requestCC14Result").html("Request approved");
        $("#requestCC14JSON").html("<h6>sendMoney</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      };
    }
  });
  $("#requestTitlTokeneResponse").removeClass("d-none");
});

// Generate QR Code form---------------------------------------------------start
$("#genQRCodeForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var textStr  = formData[0].value;
  genQRCodeFn(textStr,"../images/logo-cc14-qr.png","dispQRCode","#0C8918");
});

//Account Balance ---------------------------------------------------------start
$("#getAccountBalancesForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var getAccountAssetsData = [
    {name:"requestType",     value:"getAccountAssets"},
    {name:"includeAssetInfo",value:"true"},
    {name:"account",         value: formData[0].value.trim()}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAccountAssetsData,
    success:function(response){
      var responseObj=JSON.parse(response);
      console.log(responseObj);
      var length = responseObj.accountAssets.length;
        for(i=0; i<length; i++){
          var name     = responseObj.accountAssets[i].name;
          var asset    = responseObj.accountAssets[i].asset;
          var decimals = responseObj.accountAssets[i].decimals;
          var decimals = responseObj.accountAssets[i].decimals;
          var quantity = responseObj.accountAssets[i].quantityQNT/Math.pow(10,decimals);
          var qty      = quantity.toFixed(decimals);
          var tableRow = "<tr><td>"+i+
                         "</td><td>"+asset+
                         "</td><td>"+qty+
                         "</td><td>"+decimals+
                         "</td><td>"+name+
                         "</td></tr>";
          $("#getAccountAssetsResultTbl tbody").append(tableRow);
        };
        $("#getAccountBalancesJSON").append("<h6>getAccountAssets</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  var getBalancesData = [
    {name:"requestType",value:"getBalance"},
    {name:"account",value: formData[0].value.trim()}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getBalancesData,
    success:function(response){
      var responseObj=JSON.parse(response);
        $("#getAccountBalancesResult").html("<b>CC14 token:</b> " + responseObj.balanceNQT/100000000);
        $("#getAccountBalancesJSON").append("<h6>getAccountBalances</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
  });
    $("#getAccountBalancesResponse").removeClass("d-none");
});

// Assets By Issuer -------------------------------------------------------start
$("#getAssetsByIssuerForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var getAssetsByIssuerData = [
    {name:"requestType",  value:"getAssetsByIssuer"},
    {name:"includeCounts",value:"true"},
    {name:"account",      value: formData[0].value.trim()}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetsByIssuerData,
    success:function(response){
      var responseObj=JSON.parse(response);
      var newArrayObj=responseObj.assets[0];
      var length = newArrayObj.length;
      for(i=0; i<length; i++){
        var name         = newArrayObj[i].name;
        var asset        = newArrayObj[i].asset;
        var decimals     = newArrayObj[i].decimals;
        var quantityIni  = newArrayObj[i].initialQuantityQNT/Math.pow(10,decimals);
        var qtyIni       = quantityIni.toFixed(decimals);
        var quantityNow  = newArrayObj[i].quantityQNT/Math.pow(10,decimals);
        var qtyNow       = quantityNow.toFixed(decimals);
        var description  = newArrayObj[i].description;
        var distribution = newArrayObj[i].numberOfAccounts;
        var transfers    = newArrayObj[i].numberOfTransfers;
        var index        = i+1;
        var tableRow     = "<tr><td>"+index+
                           "</td><td>"+asset+
                           "</td><td>"+qtyIni+
                           "</td><td>"+qtyNow+
                           "</td><td>"+decimals+
                           "</td><td>"+name+
                           "</td><td>"+description+
                           "</td><td>"+distribution+
                           "</td><td>"+transfers;
        $("#getAssetsByIssuerResultTbl tbody").append(tableRow);
      };
      $("#getAssetsByIssuerJSON").after("<h6>getAssetsByIssuer</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  $("#getAssetsByIssuerResponse").removeClass("d-none");
});

// sent message ================================================================
$("#sendMessageForm").submit(function(event){
  event.preventDefault();
  var formData= $(this).serializeArray();
  console.log(formData);
  var sendMessageData = [
    {name:"requestType", value:"sendMessage"},
    {name:"broadcast",   value:"false"},
    {name:"feeNQT",      value:"0"},
    {name:"deadline",    value:"60"},
    // {name:"messageToEncrypt",    value:"true"},
    // {name:"encryptedMessageIsPrunable",    value:"true"},
    {name:"message",     value: formData[0].value},
    {name:"recipient",   value: formData[1].value},
    {name:"secretPhrase",value: formData[2].value}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:sendMessageData,
    success:function(response){
      var responseObj=JSON.parse(response);
      console.log(responseObj);
      var sendTime = timestampToLocalFn(responseObj.transactionJSON.timestamp);
      var feeCC14=responseObj.transactionJSON.feeNQT/100000000;
      var senderRS = responseObj.transactionJSON.senderRS;
      var recipientRS = responseObj.transactionJSON.recipientRS;
      var message = responseObj.transactionJSON.attachment.message;
      var fullHash = responseObj.fullHash;
      $("#sendMessageTbl-senderRS").html(senderRS);
      $("#sendMessageTbl-recipientRS").html(recipientRS);
      $("#sendMessageTbl-message").html(message);
      $("#sendMessageTbl-fee").html(feeCC14+"&nbsp;CC14");
      $("#sendMessageTbl-sendTime").html(sendTime);
      $("#sendMessageTbl-fullHash").html(fullHash);
      $("#broadcastTransactionInput").val(responseObj.transactionBytes);
      $("#sendMessageJSON").after("<h6>sendMessage</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  $("#sentMessageResponse").removeClass("d-none");
});





//##############################################################################
//#                                                                            #
//#                             misc tools                                     #
//#                                                                            #
//##############################################################################
// timestamp to local time-------------------------------------------------start
function timestampToLocalFn(timestamp){
  var d =new Date();
  var offsetInSecond=60*d.getTimezoneOffset();
  var timestampToEpoch = timestamp + epochBeginning;
  var dateTime = new Date(timestampToEpoch * 1000);
  var daysPassed = Math.floor((d.getTime()-dateTime)/(1000*60*60*24));
  var year = dateTime.getFullYear();
  var month =leadingZero(1+ dateTime.getMonth(),2);
  var date = leadingZero(dateTime.getDate(),2);
  var hours = leadingZero(dateTime.getHours(),2);
  var minutes = leadingZero(dateTime.getMinutes(),2);
  var seconds = leadingZero(dateTime.getSeconds(),2);
  var displayDate = year+"-"+month+"-"+date;
  var displayTime = hours+ ":"+minutes+ ":"+seconds;
  var localDateTime = [displayDate,displayTime,daysPassed];
  return localDateTime;
};
function leadingZero(num,places){
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

// display date and time---------------------------------------------------start
function expDateDisplayFn(isoDateTime){
  var isoDT=new Date(isoDateTime);
  var d =new Date();
  var daysAway = Math.floor((isoDT-d.getTime())/(1000*60*60*24));
  var year = isoDT.getFullYear();
  var month =1+ isoDT.getMonth();
  var day = isoDT.getDate();
  var date = year+"-"+month+"-"+day;
  var time = "23:59:59";
  var displayLocalTime = [date, time, daysAway];
  return displayLocalTime;
};

//ISO DATE TIME to Epoch --------------------------------------------------start
function isoToEpochFn(isoDateTime){
  var isoDT=new Date(isoDateTime);
  var isoToEpoch=isoDT.getTime()/1000;
  return isoToEpoch;
};

//generate QR Code---------------------------------------------------------start
function genQRCodeFn(text,logo,displayLocation,color){
  var textStr = text.toString();
  var config = {
    text:textStr,
    PI:color,
    quietZone: 25,
    logo:logo,
    logoWidth:100,
    logoHeight:50,
    titleHeight:50,
    titleTop:20,
  };
  if(textStr.length<65){
    config.width=180;
    config.height=180;
    config.correctLevel=QRCode.CorrectLevel.H;
  }else if(textStr.length<129) {
    config.width=240;
    config.height=240;
    config.correctLevel=QRCode.CorrectLevel.Q;
  }else if(textStr.length<257) {
    config.width=300;
    config.height=300;
    config.correctLevel=QRCode.CorrectLevel.M;
  }else{
    config.width=360;
    config.height=360;
    config.correctLevel=QRCode.CorrectLevel.L;
  };
  var t=new QRCode(document.getElementById(displayLocation), config);
};

//generate randon string---------------------------------------------------start
function geneRandonStringFn(lengthOfStr) {
  const charactersSet ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*';
  const charactersSetLength = charactersSet.length;
  var result = '';
  for ( let i = 0; i < lengthOfStr; i++ ) {
      result += charactersSet.charAt(Math.floor(Math.random() * charactersSetLength));
  };
  return result;
};

//toggle password visibility ----------------------------------------------start
function togglePasswordFn(selector) {
  var x = document.getElementById(selector);
  var icon = "#"+selector+"Icon";
  if (x.type === "password") {
    x.type = "text";
    $(icon).html("&#128586");
  } else {
    x.type = "password";
    $(icon).html("&#128584");
  }
};

//click to reload page-----------------------------------------------------start
function reloadClearFn(){
  sessionStorage.clear();
  location.reload();
  return false;
};



//##############################################################################
//#                                                                            #
//#                               for utility.html                             #
//#                                                                            #
//##############################################################################
//Wallet information validation tool---------------------------------------start
$("#validateWalletInfoForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var walletInformationObj = JSON.parse(formData[0].value);
  var walletInfoStr=JSON.stringify(walletInformationObj.walletInfo);
  var validationCodeStr = walletInformationObj.validationCode
  var passphraseStr = formData[1].value;
  var decodeTokenData  = [
    {name:"requestType",      value:"decodeToken"},
    {name:"website",          value:walletInfoStr},
    {name:"token",            value:validationCodeStr},
  ];
  var generateTokenData  = [
    {name:"requestType",      value:"generateToken"},
    {name:"website",          value:walletInfoStr},
    {name:"secretPhrase",     value:passphraseStr},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:decodeTokenData,
    success:function(response){
      var responseObj = JSON.parse(response);
      var valid = responseObj.valid;
      var accountRS = responseObj.accountRS;
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      if (valid==true){
        var displayResult = "<b>Passed! </b><br>Valication code was generated by account <a href='../index.html'>" + accountRS +"</a> on " + localTime[0] + " at " + localTime[1] + ". ";
      }else {
        var displayResult = "<b>Failed! </b><br>Valication code was generated by account <a href='../index.html'>" + accountRS +"</a> on " + localTime[0] + " at " + localTime[1] + ". ";
      };
      $("#validateWalletInfoResponse").removeClass("d-none");
      $("#validateWalletInfoResult").html(displayResult);
      $("#validateWalletInfoJSON").html("<h6>decodeToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:generateTokenData,
    success:function(response){
      var responseObj = JSON.parse(response);
      var token = responseObj.token;
      var accountRS = responseObj.accountRS;
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      var displayResult = "A new validation code generated by account <a href='../index.html'>" + accountRS +"</a> on " + localTime[0] + " at " + localTime[1] + ". <br>New code: <br>" + token + "<br><br>";
      $("#validateWalletInfoNewTokenResult").html(displayResult);
      $("#validateWalletInfoNewTokenJSON").html("<h6>generateToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

//generate fielToken and prepare NFT --------------------------------------start
function genFileTokenFn(formData){
  var genFileTokenXhr = new XMLHttpRequest();
  var formDataMod = new FormData(formData);
  genFileTokenXhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var genFileTokenXhrObj=JSON.parse(genFileTokenXhr.responseText);
      var input = document.querySelector('#genFileTokenFormFile');
      if (input.files[0]){
        var file = input.files[0];
        var fileName = file.name;
        var lastModified=timestampToLocalFn(file.lastModified/1000-epochBeginning);
        var fileSize = returnFileSizeFn(file.size);
      };
      var secEpoch = Math.floor( Date.now() / 1000 );
      var txtFileName =fileName+'_'+secEpoch+'.txt';
      var fileToken = genFileTokenXhrObj.token;
      var accountRS = genFileTokenXhrObj.accountRS;
      var timestamp = genFileTokenXhrObj.timestamp;
      var secEpoch = epochBeginning + timestamp;
      var txtFileName =fileName+'_'+secEpoch+'.txt';
      var localTime = timestampToLocalFn(timestamp);
      var description = fileToken;
      var message = fileName+", "+fileSize+", "+lastModified[0]+" "+lastModified[1];
      var displayResult = "<p><b>交易: </b><br>FileToken was generated on "+localTime[0]+" , "+localTime[1]+", by Account " + accountRS+".</p>"+
                          "<p><b>文件: </b><br> File name: " + fileName+"<br>File size: "+fileSize+"<br>last modified on: "+lastModified[0]+" , "+lastModified[1]+".</p>"+
                          "<p><b>存证令牌: </b>" + fileToken+" </p>";
      $("#save2txt").attr("download",txtFileName);
      $("#genFileTokenDisplay").removeClass("d-none");
      $("#genFileTokenResult").html(displayResult);
      $("#decFileTokenFormToken").val(fileToken);
      $("#tokenizeFormDescription").val(description);
      $("#tokenizeFormMessage").val(message);
      $("#evidenceJSONBtn").removeClass("collapsed");
      $("#evidenceJSONPanel").addClass("show");
      $("#genFileTokenJSON").html("<h6>generateFileToken</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(genFileTokenXhrObj,undefined, 4)+"</textarea>");
      $("#save2txt").click(function(){
        this.href = "data:text/plain;charset=UTF-8,"  + encodeURIComponent(fileToken);
      });
    }
  };
  genFileTokenXhr.open("POST",apiNodeURL, true);
  genFileTokenXhr.send(formDataMod);
  return false;
};

//decode fielToken --------------------------------------------------------start
function decodeFileTokenFn(formData){
  var decFileTokenXhr = new XMLHttpRequest();
  var formDataMod = new FormData(formData);
  decFileTokenXhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var decFileTokenXhrObj=JSON.parse(decFileTokenXhr.responseText);
      var input = document.querySelector('#decFileTokenFormFile');
      var valid = decFileTokenXhrObj.valid;
      var accountRS = decFileTokenXhrObj.accountRS;
      var timestamp = decFileTokenXhrObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      var file = input.files[0];
      var fileName = file.name;
      var lastModified=timestampToLocalFn(file.lastModified/1000-epochBeginning);
      var fileSize = returnFileSizeFn(file.size);
      if (valid==true){
        var message = "<b>验证通过！ </b>";
      }else {
        var message = "<b>验证失败！ </b>";
      };
      $("#decFileTokenResponse").removeClass("d-none");
      $("#decFileTokenResult").html(message);
      $("#decFileTokenTbl-generator").html(accountRS);
      $("#decFileTokenTbl-time").html(localTime[0] + " " +localTime[1]);
      $("#decFileTokenTbl-file").html("file name: "+fileName + ", <br>file size: " + fileSize+" , <br>last modified:  " + lastModified[0] + " , " +lastModified[1]);
      $("#decFileTokenJSON").html("<h6>decodeFileToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(decFileTokenXhrObj,undefined, 4)+"</textarea>");
    }
  };
  decFileTokenXhr.open("POST",apiNodeURL, true);
  decFileTokenXhr.send(formDataMod);
  return false;
};

//tokenize fielToken into NFT ---------------------------------------------start
$("#tokenizeForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  // console.log(formData);
  var tokenizeData  = [
    {name:"requestType",      value:"issueAsset"},
    // {name:"chain",            value:"2"},
    {name:"name",             value:formData[0].value},
    {name:"description",      value:formData[1].value},
    {name:"quantityQNT",      value:"1"},
    {name:"decimals",         value:"0"},
    {name:"secretPhrase",     value:formData[4].value},
    {name:"feeNQT",           value:"0"},
    {name:"deadline",         value:"60"},
    // {name:"feeRateNQTPerFXT", value:"-1"},
    {name:"broadcast",        value:"false"},
    {name:"message",          value:'License type: '+formData[3].value +"<br>File detail:  " +formData[2].value}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:tokenizeData,
    success:function(response){
      var responseObj = JSON.parse(response);
      // console.log(responseObj);
      if (responseObj.errorCode == 6){
        alert("账户内余额不足，不能生成NFT！");
      }else {
        var feeCC14 = responseObj.transactionJSON.feeNQT/100000000;
        var transactionBytes = responseObj.transactionBytes;
        var senderRS = responseObj.transactionJSON.senderRS;
        var timestamp = responseObj.transactionJSON.timestamp;
        var localTime = timestampToLocalFn(timestamp);
        var fielToken = responseObj.transactionJSON.attachment.description;
        var message = responseObj.transactionJSON.attachment.message;
        var name = responseObj.transactionJSON.attachment.name;
        var fullHash = responseObj.transactionJSON.fullHash;
        var assetID = NRS.fullHashToId(fullHash);
        $("#tokenizeDisplay").removeClass("d-none");
        $("#tokenizeTblAccountRS").html(senderRS);
        $("#tokenizeTblTime").html(localTime[0] + "," + localTime[1]);
        $("#tokenizeTblAssetID").html(assetID);
        $("#tokenizeTblFee").html(feeCC14+" CC14");
        $("#tokenizeTblFullHash").html(fullHash);
        $("#tokenizeTblFielToken").html(fielToken);
        $("#tokenizeTblFile").html(message);
        $("#tokenizeBroadcastTransactionBytes").val(transactionBytes);
        $("#tokenizeJSON").html("<h6>issueAsset</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    }
  });
});

//generate message token --------------------------------------------------start
$("#genTokenForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:formData,
    success:function(response){
      var responseObj = JSON.parse(response);
      var token = responseObj.token;
      var accountRS = responseObj.accountRS;
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      var result = "<span>Zero cost message token created on " + localTime[0] + " , " + localTime[1] + " by account " + accountRS + " . Transaction fullHash： <br> "+token;
      $("#evidenceJSONBtn").removeClass("collapsed");
      $("#evidenceJSONPanel").addClass("show");
      $("#genTokenDisplay").removeClass("d-none");
      $("#genTokenResult").html(result);
      $("#decTokenFormWebsite").val(formData[1].value);
      $("#decTokenFormToken").val(token);
      $("#genTokenJSON").html("<h6>generateToken</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

//decode message token ----------------------------------------------------start
$("#decTokenForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:formData,
    success:function(response){
      var responseObj = JSON.parse(response);
      var valid = responseObj.valid;
      var accountRS = responseObj.accountRS;
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      if (valid==true){
        var displayResult = "<b>验证通过！ </b><br>存证哈希由钱包地址 " + accountRS +" 于 " + localTime[0] + " ， " + localTime[1] + " 生成。";
      }else {
        var displayResult = "<b>验证失败！ </b><br>存证哈希由钱包地址 " + accountRS +" 于 " + localTime[0] + " ， " + localTime[1] + " 生成。";
      };
      $("#decTokenDisplay").removeClass("d-none");
      $("#decTokenResult").html(displayResult);
      $("#decTokenJSON").html("<h6>decodeToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

// return File Size Fn ----------------------------------------------------start
function returnFileSizeFn(number) {
  if(number < 1024) {
    return number + ' bytes';
  } else if(number > 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + ' KB';
  } else if(number > 1048576) {
    return (number/1048576).toFixed(1) + ' MB';
  }
};




//##############################################################################
//#                                                                            #
//#                               for index.html                               #
//#                                                                            #
//##############################################################################
//all-in-on title token search tool ---------------------------------------start
$("#getAssetInfoAll").submit(function(event){
  event.preventDefault();
  var formData= $(this).serializeArray();
  var assetID = formData[0].value.trim();
  var getAssetData= [
    {name:"requestType",  value:"getAsset"},
    {name:"asset",        value:assetID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetData,
    success:function(response){
      var getAssetObj = JSON.parse(response);
      if (getAssetObj.errorDescription =="Unknown asset"){
        $("#advisoryA0").removeClass("d-none");
        $("#titleSearchTable").hide();
      }else{
        //display product information from ../data/myAssetBook
        assetInfoFn(getAssetObj.name);

        //display product additional information (properties)
        assetPropertyFn(getAssetObj.asset);

        //display token distribution
        assetAccountsFn(getAssetObj.asset,getAssetObj.decimals);

        //display issuer information with ../data/myAddressBook
        assetHistoryFn(getAssetObj.asset);

        //display token transfer records
        assetTransferFn(getAssetObj.asset);

        //check if the token is a NFT
        if(getAssetObj.initialQuantityQNT ==1 &&  getAssetObj.decimals == 0){
          //Q3: Is the title token available?
          if(getAssetObj.quantityQNT == 1){
            //get current owner information with ../data/myAddressBook
            currentOwnerInfoFn(getAssetObj.asset);
            $("#titleSearch-Q3-result").html('<strong style="color:green">是</strong>');
          }else{
            $("#advisoryA3").removeClass("d-none");
            $("#modalBlockContainer").addClass("d-none");
            $("#titleSearch-Q3-result").html('<strong style="color:red">否</strong>');
          };
        }else{
          $("#titleSearch-Q3").hide();
          $("#titleSearch-Q4").hide();
          $("#titleSearch-Q5").hide();
          $("#titleSearch-Q6").hide();
          $("#titleSearch-Q7").hide();
          $("#transferQty").removeClass("d-none");
          $("#modalBlockTransfer").removeClass("d-none");
        };

        //display product ID based on the content of getAssetObj.description
        if(getAssetObj.description=="NFTID"){
          $("#assetInforTbl-PID").html(getAssetObj.asset);
        }else{
          $("#assetInforTbl-PID").html(getAssetObj.description);
        };
        $("#assetInforTbl-assetID").html(getAssetObj.asset);
      };
      $("#panelAdvisory").addClass("show");
      $("#btnAdvisory").removeClass("collapsed");
      $("#btnAdvisory").attr("aria-expanded","true");
      $("#JSONresponse").append("<h6>getAsset</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(getAssetObj,undefined, 4)+"</textarea>");
    }
  });
  $("#searchResult").removeClass("d-none");
  $("#modalBlockSecureCode").val(assetID);
  $("#modalBlockSecureCode2").val(assetID);
  $("#modalBlockSecureCode3").val(assetID);
});

//display product information and update images----------------------------start
function assetInfoFn(name){
  //convert asset name into 8 to 14 barcode, and update inage slider
  var letters = /^[0-9a-vA-V]+$/;
  if (name.match(letters)){
    var barcode = parseInt(name, 32).toString(10);
    var image1  = "../images/products/"+barcode+"-1.jpg";
    var image2  = "../images/products/"+barcode+"-2.jpg";
    var image3  = "../images/products/"+barcode+"-3.jpg";
    $("#slideshow-1").attr("src", image1);
    $("#slideshow-2").attr("src", image2);
    $("#slideshow-3").attr("src", image3);

    //find barcode in ../data/myAssetBook and display
    var n = myAssetBookObj.map(function(e){return e.barcode;}).indexOf(barcode);
    if (n>=0){
      var brand       = myAssetBookObj[n].brand;
      var model       = myAssetBookObj[n].model;
      var description = myAssetBookObj[n].description;
      var unit        = myAssetBookObj[n].unit;
      var madeIn      = myAssetBookObj[n].madeIn;
      var productUrl  = myAssetBookObj[n].productUrl;
      var noFakeUrl   = myAssetBookObj[n].noFakeUrl;
      var coverage    = myAssetBookObj[n].coverage;
      $("#assetInforTbl-model").html("<a  href='"+productUrl+"'>"+brand+"&nbsp;"+model+"</a>");
      $("#assetInforTbl-barcode").html(barcode);
      $("#assetInforTbl-description").html(description);
      $("#assetInforTbl-unit").html(unit);
      $("#assetInforTbl-madeIn").html(madeIn);
      $("#assetInforTbl-goodFor").html(coverage);
    };
  };
};

//get asset property ------------------------------------------------------start
function assetPropertyFn(assetID){
  var getAssetPropertiesData= [
    {name:"requestType", value:"getAssetProperties"},
    {name:"asset",       value:assetID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetPropertiesData,
    success:function(response){
      var assetPropertyObj = JSON.parse(response);
      var i= assetPropertyObj.properties.length;
      var setter;
      if (i>=1){
        for(k=0; k<i; k++){
          var setterRS = assetPropertyObj.properties[k].setterRS;
          var property = assetPropertyObj.properties[k].property;
          var value    = assetPropertyObj.properties[k].value;
          var m = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(setterRS);
          if (m > 0){
            var setter = myAddressBookObj[m].walletInfo.entityName;
            var jobFunction = myAddressBookObj[m].walletInfo.walletAssignment;
          }else{
            var setter = "未知钱包，佚名标注者";
            var jobFunction = "未知职责。<a href='utilities.html'>通过CC14公链向对方发送消息</a>";
          };
          var index = k+1;
          var displayTbl='<table class="table word-break table-bordered table-sm fs-6 table-bordered caption-top">'+
                    '<caption>附加信息 ' + index +'/'+i+' </caption>'+
                    '<tr><td class="td-1">标注者</td><td class="td-2">' + setter +'</td></tr>'+
                    '<tr><td class="td-1">钱包地址</td><td class="td-2">' + setterRS +'</td></tr>'+
                    '<tr><td class="td-1">默认职责</td><td class="td-2">' + jobFunction +'</td></tr>'+
                    '<tr><td class="td-1">标注内容</td><td class="td-2">' + property + ' : ' + value +'</td></tr></table>';
          $("#assetInforTbl").after(displayTbl);
        };
      };
      $("#JSONresponse").append("<h6>getAssetProperties</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(assetPropertyObj,undefined, 4)+"</textarea>");
    }
  });
};

//get title token issuance information ------------------------------------start
function assetHistoryFn(assetID){
  var getAssetHistoryData= [
    {name:"requestType",      value:"getAssetHistory"},
    {name:"includeAssetInfo", value:"true"},
    {name:"asset",            value:assetID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetHistoryData,
    success:function(response){
      var assetHistoryObj = JSON.parse(response);
      var i              = assetHistoryObj.assetHistory.length -1;    //index of asset issuance
      var issuerRS       = assetHistoryObj.assetHistory[i].accountRS;
      var decimals       = assetHistoryObj.assetHistory[i].decimals;
      var quantityQNT    = assetHistoryObj.assetHistory[i].quantityQNT;
      var issuanceTimes  = timestampToLocalFn(assetHistoryObj.assetHistory[i].timestamp);
      var issuanceEpoch  = epochBeginning + assetHistoryObj.assetHistory[i].timestamp;
      var factor         = Math.pow(10, decimals);
      var issuedQuantity = quantityQNT/factor;
      var m = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(issuerRS);
      if (m>= 0){
        var entityName      = myAddressBookObj[m].walletInfo.entityName;
        var physicalAddress = myAddressBookObj[m].walletInfo.physicalAddress;
        var noFakeURL       = myAddressBookObj[m].walletInfo.noFakeURL;
        var jobFunction     = myAddressBookObj[m].walletInfo.walletAssignment;
        var validationCode  = myAddressBookObj[m].validationCode;
        var walletExpDate   = expDateDisplayFn(myAddressBookObj[m].walletInfo.expDate);
        var walletExpEpoch  = isoToEpochFn(myAddressBookObj[m].walletInfo.expDate);
        if(issuanceEpoch <walletExpEpoch){
          $("#titleSearch-Q2-result").html("<strong style='color:green'>是</strong>");
        }else{
          $("#titleSearch-Q2-result").html("<strong style='color:red'>否</strong>");
          $("#advisoryA2").removeClass("d-none");
          $("#modalBlockContainer").addClass("d-none");
        };
        $(".yourCompanyName").html(entityName);
        $("#issuerInfoTbl-r1d2").html(entityName);
        $("#issuerInfoTbl-r2d2").html(issuerRS);
        $("#issuerInfoTbl-r3d2").html(physicalAddress);
        $("#issuerInfoTbl-r4d2").html("<a href='"+noFakeURL+"' target='_blank'>Offcial website</a>");
        $("#issuerInfoTbl-r5d2").html(walletExpDate[0]+" "+walletExpDate[1]+" , expired in "+walletExpDate[2]+" days");
        $("#issuerInfoTbl-r6d2").html(validationCode);
        $("#assetInforTbl-issueDate").html(issuanceTimes[0] + ' '+issuanceTimes[1]+', '+ issuanceTimes[2]+' days');
        $("#assetInforTbl-qty").html(issuedQuantity.toFixed(decimals));
        $("#validateWalletInfoFormCode").html(JSON.stringify(myAddressBookObj[m], undefined, 4));
        $("#transactionZero-issuer").html(entityName);
        $("#transactionZero-issuerRS").html(issuerRS);
        $("#transactionZero-duty").html(jobFunction);
        $("#transactionZero-qty").html(issuedQuantity.toFixed(decimals));
        $("#transactionZero-date").html(issuanceTimes[0]+" "+ issuanceTimes[1]);
        $("#titleSearch-Q1-result").html("<strong style='color:green'>是</strong>");

      }else{
        $("#titleSearch-Q1-result").html("<strong style='color:red'>否</strong>");
        $("#titleSearch-Q2-result").html("<strong style='color:#d9d9d9'>不适用</strong>");
        $("#advisoryA1").removeClass("d-none");
        $("#modalBlockContainer").addClass("d-none");
      };
      $("#JSONresponse").append("<h6>getAssetHistory</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(assetHistoryObj,undefined, 4)+"</textarea>");
    }
  });
};

// asset accounts asset distribution --------------------------------------start
function assetAccountsFn(assetID, decimals){
  var factor = Math.pow(10, decimals);
  var getAssetAccountsData= [
    {name:"requestType", value:"getAssetAccounts"},
    {name:"asset",       value:assetID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetAccountsData,
    success:function(response){
      var assetAccountsObj = JSON.parse(response);
      var numberOfAccounts = assetAccountsObj.accountAssets.length;
      for (k=0; k<numberOfAccounts; k++){
        var accountRS   = assetAccountsObj.accountAssets[k].accountRS;
        var quantityQNT = assetAccountsObj.accountAssets[k].quantityQNT;
        var quantity    = quantityQNT/factor;
        var m = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(accountRS);
        if (m > 0){
          var entityName  = myAddressBookObj[m].walletInfo.entityName;
          var jobFunction = myAddressBookObj[m].walletInfo.walletAssignment;
        }else{
          var entityName  = "未知钱包。 验证钱包所有权，请卖家使用 <a href='evidence.html'>【生成短语令牌】</a> 工具生成令牌。 ";
          var jobFunction = "未知职责。<a href='utilities.html'>通过CC14公链向对方发送消息</a>";
        };
        var index       = k+1;
        displayTbl='<table class="table word-break table-bordered table-sm fs-6 table-bordered caption-top">'+
                  '<caption>当前拥有者 ' + index +'之'+numberOfAccounts+' </caption>'+
                  '<tr><td class="td-1">单位名称</td><td class="td-2">' + entityName +'</td></tr>'+
                  '<tr><td class="td-1">钱包地址</td><td class="td-2">' + accountRS +'</td></tr>'+
                  '<tr><td class="td-1">默认职责</td><td class="td-2">' + jobFunction +'</td></tr>'+
                  '<tr><td class="td-1">拥有数量</td><td class="td-2">' + quantity.toFixed(decimals) + '  (quantityQNT: '+quantityQNT+' , decimals: '+decimals+' )'+'</td></tr></table>';
        $("#assetInforTbl").after(displayTbl);
      };
      $("#JSONresponse").append("<h6>getAssetAccounts</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(assetAccountsObj,undefined, 4)+"</textarea>");
    }
  });
};

// asset transfers history-------------------------------------------------start
function assetTransferFn(assetID){
  var getAssetTransfersData= [
    {name:"requestType",value:"getAssetTransfers"},
    {name:"includeAssetInfo",value:"true"},
    {name:"asset",value:assetID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetTransfersData,
    success:function(response){
      var assetTransferObj = JSON.parse(response);
      var length= assetTransferObj.transfers.length;

      //adding number for Q4=activation, Q5=dumpster,Q6=services, Q7=sold+unknown
      var answersQ4 = 0;
      var answersQ5 = 0;
      var answersQ6 = 0;
      var answersQ7 = 0;
      for(var i=0; i<length; i++){
        var senderRS    = assetTransferObj.transfers[i].senderRS;
        var recipientRS = assetTransferObj.transfers[i].recipientRS;
        var quantityQNT = assetTransferObj.transfers[i].quantityQNT;
        var decimals    = assetTransferObj.transfers[i].decimals;
        var timestamp   = assetTransferObj.transfers[i].timestamp;
        var factor    = Math.pow(10, decimals);
        var qty       = quantityQNT/factor;
        var localTime = timestampToLocalFn(timestamp);
        //display sender information based on myAddressBook.js----------------
        var m = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(senderRS);
        if (m < 0){
          var senderName       = "未知钱包，佚名让与者)";
          var senderAssignment = "未知职责。<a href='utilities.html'>通过CC14公链向对方发送消息</a>";
        }else{
          var senderName       = myAddressBookObj[m].walletInfo.entityName;
          var senderAssignment = myAddressBookObj[m].walletInfo.walletAssignment;
        };

        //display recipient information based on myAddressBook.js-------------
        var n = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(recipientRS);
        if (n < 0){
          var recipientName       = "未知钱包，佚名让与方";
          var recipientAssignment = "未知职责。<a href='utilities.html'>通过CC14公链向对方发送消息</a>";
          answersQ7++;
        }else{
          var recipientName       = myAddressBookObj[n].walletInfo.entityName;
          var recipientAssignment = myAddressBookObj[n].walletInfo.walletAssignment;
        };
        if(recipientAssignment=="activation"){
          answersQ4++;
        }else if(recipientAssignment=="dumpster"){
          answersQ5++;
        }else if(recipientAssignment=="services"){
          answersQ6++;
        }else if(recipientAssignment=="return"){
          answersQ7++;
        };
        var index = length-i;
        displayTbl='<h5>交易序号 ' + index +' 之 '+length+' </h5>'+
                   'Qty. ' + qty.toFixed(decimals) + '  &#128197; ' + localTime[0] +' &#8986; '+ localTime[1]+ ' </h6>'+
                   '<table class="table word-break table-bordered table-sm fs-6 table-bordered caption-top">'+
                     '<tr><td class="td-3">让与方</td><td class="td-2">' +senderName +  '</td></tr>'+
                     '<tr><td class="td-3">钱包地址</td><td class="td-2">' + senderRS +'</td></tr>'+
                     '<tr><td class="td-3">默认职责</td><td class="td-2">' + senderAssignment +'</td></tr>'+
                   '</table>'+
                   '<table class="table word-break table-bordered table-sm fs-6 table-bordered caption-top">'+
                     '<tr><td class="td-3">接收方</td><td class="td-2">' + recipientName +'</td></tr>'+
                     '<tr><td class="td-3">钱包地址</td><td class="td-2">' + recipientRS +'</td></tr>'+
                     '<tr><td class="td-3">默认职责</td><td class="td-2">' + recipientAssignment +'</td></tr>'+
                   '</table>';
        $("#assetIssuerTbl").before(displayTbl);
      };
      if(answersQ4 > 0){
        $("#titleSearch-Q4-result").html("<strong style='color:green'>是</strong>");
        $("#assetInforTbl-activateDate").html(localTime[0] +" " + localTime[1] + ", "+localTime[2]+" days");
      }else{
        $("#titleSearch-Q4-result").html("<strong style='color:red'>否</strong>");
        $("#advisoryA4").removeClass("d-none");
        $("#modalBlockContainer").addClass("d-none");
      };
      if(answersQ5 > 0){
        $("#titleSearch-Q5-result").html("<strong style='color: red'>否</strong>");
        $("#advisoryA5").removeClass("d-none");
        $("#modalBlockContainer").addClass("d-none");
      }else{
        $("#titleSearch-Q5-result").html("<strong style='color: green'>是</strong>");
      };
      if(answersQ6 > 0){
        $("#titleSearch-Q6-result").html("<strong style='background-color:yellow'>是</strong>");
        $("#advisoryA6").removeClass("d-none");
        $("#modalBlockTransfer").addClass("d-none");
      }else{
        $("#titleSearch-Q6-result").html("<strong style='color:green'>否</strong>");
      };
      if(answersQ7 > 0){
        $("#titleSearch-Q7-result").html("<strong style='background-color:yellow'>是</strong>");
        $("#advisoryA7").removeClass("d-none");
        $("#modalBlockTransfer").removeClass("d-none");
      }else{
        $("#titleSearch-Q7-result").html("<strong style='color:green'>否</strong>");
      };
      $("#JSONresponse").append("<h6>getAssetTransfers</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(assetTransferObj,undefined, 4)+"</textarea>");
    }
  });
};

//getTransaction ===============================================================
$("#validateTitlTokenForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  $.ajax({
    type:"POST",
    url: "../validateTitleToken.php",
    data:formData,
    success:function(response){
      var responseObj  = JSON.parse(response);
      if (responseObj.validateTitleToken == "failed"){
        var message = "解密失败，谨防假冒。提供的验证码并非由<code>YOUR_COMPANY_NAME_HERE</code>生成, 无法解密。";
        alert("解密失败！");
      }else if (responseObj.validateTitleToken == "mismatch"){
        var message= "验证失败，谨防假冒。提供的防伪码 "+formData[0].value+" 与验证码解密结果 "+responseObj.decrypted+"不匹配。";
        alert("不匹配!");
      }else{
        var message= "验证码有效。提供的防伪码 "+formData[0].value+" 与验证码解密结果 "+responseObj.decrypted+"相匹配。";
      };
      $("#validateTitlTokeneResult").html(message);
      // $("#validateTitleTokeneResponse").removeClass("d-none");
    }
  });
  $("#validateTitleTokeneResponse").removeClass("d-none");
});

// Create QR Code ==============================================================
function qrCodeFn(text){
  var logosrc="../images/logo-cc14-qr.png";
  var textStr=text.replace(/[\n\r\t]/g,"");
  var length=textStr.length;
  var cLevel;
  var config = {
    width: 240,
    height: 240,
    text:textStr,
    PI:"#0C8918",
    quietZone: 25,
    logo:logosrc,
    logoWidth:100,
    logoHeight:50,
    titleHeight:50,
    titleTop:20,
    correctLevel: QRCode.CorrectLevel.H
    };
  if (length>=40 && length<=80){
      console.log("1");
      config.width=240;
      config.height=240;
      config.correctLevel=3;
    }else if (length> 80 && length<=120) {
      console.log("2");
      config.width=280;
      config.height=280;
      config.correctLevel=0;
    }else if(length >120){
      console.log("3");
      config.width=320;
      config.height=320;
      config.correctLevel=1;
    };
  document.getElementById("dispQRCode").innerHTML="";
  var t=new QRCode(document.getElementById("dispQRCode"), config);
};

// display token issuer information----------------------------------------start
function currentOwnerInfoFn(assetID){
  var getAssetAccountsData= [
    {name:"requestType", value:"getAssetAccounts"},
    {name:"asset",       value:assetID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetAccountsData,
    success:function(response){
      var assetAccountsObj = JSON.parse(response);
      var accountRS   = assetAccountsObj.accountAssets[0].accountRS;
      var m = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(accountRS);
      if (m > 0){
        var jobFunction = myAddressBookObj[m].walletInfo.walletAssignment;
        if(jobFunction == "activation"){
          $("#modalBlockRequest").removeClass("d-none");
        }else{
          $("#modalBlockTransfer").removeClass("d-none");
        };
      };
    }
  });
};

//##############################################################################
//#                                                                            #
//#                            for insurance.htm;                              #
//#                                                                            #
//##############################################################################
//create new wallet address------------------------------------------------start
$("#pin2newWalletForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var newSecret = geneRandonStringFn(16)+"P!N"+formData[0].value;
  localStorage.setItem("mySecretLS", newSecret);
  var getAccountIdData = [
    {name:"requestType",value:"getAccountId"},
    {name:"secretPhrase",value:newSecret},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAccountIdData,
    success:function(response){
      var responseObj  = JSON.parse(response);
      var accountRSLS = responseObj.accountRS;
      var pubKeyLS = responseObj.publicKey;
      localStorage.setItem("myWalletLS", accountRSLS);
      localStorage.setItem("myPubKeyLS", pubKeyLS);
      $("#consumerWallet").val(responseObj.accountRS);
      $("#consumerPubKey").val(responseObj.publicKey);
      $("#requestTitlTokeneResponse").removeClass("d-none");
      var newWalletDisp = "钱包地址: " + accountRSLS + "<br>钱包公钥: " + pubKeyLS + "<br>钱包密匙: " + newSecret;
      $("#requestTitlTokeneResult").html(newWalletDisp);
      genQRCodeFn(accountRSLS,"../images/logo-cc14-qr.png","newWalletQRCode","#0C8918");
      genQRCodeFn(newSecret,"../images/logo-cc14-qr.png","newWalletQRCode","#177CB0");
    }
  });
});

//Request Title Token -----------------------------------------------------start
$("#requestTitlTokenForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  $.ajax({
    type:"POST",
    url: "../requestTitleToken.php",
    data:formData,
    success:function(response){
      console.log(response);
      var responseObj  = JSON.parse(response);
      console.log(responseObj);
      if (responseObj.requestTitleToken == "failed"){
        var message = "解密失败，谨防假冒。提供的验证码并非由<code> YOUR_COMPANY_NAME_HERE </code>生成, 无法解密。权益令牌将不会被转让。";
        $("#requestTitlTokeneResult").html(message);
        alert("解密失败！");
      }else if (responseObj.requestTitleToken == "mismatch"){
        var message= "验证失败，谨防假冒。提供的防伪码 "+formData[3].value+" 与验证码解密结果 "+responseObj.decrypted+"不匹配，<code>YOUR COMPANY NAME </code>将不转让权益令牌。";
        $("#requestTitlTokeneResult").html(message);
        alert("不匹配！");
      }else{
        var fullHash     = responseObj.fullHash;
        var senderRS     = responseObj.transactionJSON.senderRS
        var timestamp    = responseObj.transactionJSON.timestamp;
        var recipientRS  = responseObj.transactionJSON.recipientRS;
        var asset        = responseObj.transactionJSON.attachment.asset;
        var transferTime = timestampToLocalFn(timestamp);
        var note = '<br><br><p><b>注：</b> 演示版中这个转让交易不会被广播至区块链中。'
        var requestDTResult = "<b style='color:green'>解密成功！</b><br> 权益令牌编号 "+asset+" , 将会转让至钱包地址 "+recipientRS+" 。本次交易的区块链标识："+fullHash+".";
        $("#requestTitlTokeneResult").html(requestDTResult+note);
        $("#requestTitlTokeneJSON").append("<h6>transferAsset</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      };
    }
  });
  $("#requestTitlTokeneResponse").removeClass("d-none");
});

//transfer asset ----------------------------------------------------------start
$("#transferAssetForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  var getAssetData = [
    {name:"requestType", value:"getAsset"},
    {name:"asset",       value: formData[1].value.trim()},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetData,
    success:function(response){
      var responseObj  = JSON.parse(response);
      console.log(responseObj);
      $("#transferAssetJSON").append("<h6>getAsset</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      var factor = Math.pow(10, responseObj.decimals);
      var quantityQNT = factor*formData[2].value;
      var transferAssetData = [
        {name:"requestType", value:"transferAsset"},
        {name:"broadcast",   value:"false"},
        {name:"feeNQT",      value:"0"},
        {name:"deadline",    value:"60"},
        {name:"recipient",   value: formData[0].value.trim()},
        {name:"asset",       value: formData[1].value.trim()},
        {name:"quantityQNT", value: quantityQNT},
        {name:"message",     value: formData[3].value},
        {name:"secretPhrase",value: formData[4].value},
      ];
      $.ajax({
        type:"POST",
        url: apiNodeURL,
        data:transferAssetData,
        success:function(response){
          var responseObj  = JSON.parse(response);
          console.log(responseObj);
          if(responseObj.errorDescription=='Incorrect "recipient"'){
            $("#transferAssetResult").html("未知买家钱包地址，请买家核对接收钱包地址。")
          }else if(responseObj.errorDescription=="Unknown account"){
            $("#transferAssetResult").html("未知卖家钱包地址，请核卖家核对钱包密钥。")
          }else{
            var senderRS         = responseObj.transactionJSON.senderRS;
            var recipientRS      = responseObj.transactionJSON.recipientRS;
            var fee              = responseObj.transactionJSON.feeNQT/100000000+" CC14";
            var fullHash         = responseObj.fullHash;
            var transactionBytes = responseObj.transactionBytes;
            $("#transferAssetTbl-fee").html(fee);
            $("#transferAssetTbl-senderRS").html(senderRS);
            $("#transferAssetTbl-recipientRS").html(recipientRS);
            $("#transferAssetTbl-fullHash").html(fullHash);
            $("#transferAssetTransactionBytes").html(transactionBytes);
            $("#transferAssetJSON").append("<h6>transferAsset</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
          };
        }
      });
    }
  });
  $("#transferAssetTbl-qty").html(formData[2].value);
  $("#transferAssetTbl-message").html(formData[3].value);
  $("#transferAssetResponse").removeClass("d-none");
});

//boardcase transfer title token-------------------------------------------start
$("#broadcastTransactionForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  var transactionBytes = formData[0].value;
  var location = "transferAsset";
  broadcastTransactionFn(transactionBytes,location);
});

// broadcastTransactionFn -------------------------------------------------start
function broadcastTransactionFn(transactionBytes, location){
  var dispLocationResult = "#"+location+"BroadcastTransactionResult";
  var dispLocationJSON   = "#"+location+"JSON";
  var broadcastTransactionData = [
    {name:"requestType",value:"broadcastTransaction"},
    {name:"transactionBytes",value: transactionBytes},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:broadcastTransactionData,
    success:function(response){
      var responseObj=JSON.parse(response);
      if(responseObj.errorCode == "4"){
        $(dispLocationResult).html("Broadcast failed. Please review your transactionBytes");
      }else{
        $(dispLocationResult).html("Broadcast succeed. fullHash:<br>"+responseObj.fullHash);
      };
      $(dispLocationJSON).after("<h6>broadcastTransaction</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
};

//generate QR code for title token issuance--------------------------------start
function issueNFTQRCodeFn(assetID,regCode,fullHash,location){
  var assetIDConfig = {
    width: 180,
    height: 180,
    text:assetID,
    PI:"#0C8918",
    quietZone: 25,
    logo:"../images/logo-nft-qr.png",
    logoWidth:60,
    logoHeight:60,
    logoBackgroundTransparent: true,
    title:"Title Token ID",
    subTitle:assetID,
    titleHeight:50,
    titleTop:20,
    subTitleTop: 40,
    correctLevel: QRCode.CorrectLevel.H
  };
  var fullHashConfig = {
    width: 180,
    height: 180,
    text:fullHash,
    PI:"#0C8918",
    quietZone: 25,
    logo:"../images/logo-nft-qr.png",
    logoWidth:40,
    logoHeight:40,
    logoBackgroundTransparent: true,
    title:"Title Token ID",
    subTitle:assetID,
    titleHeight:50,
    titleTop:20,
    subTitleTop: 40,
    correctLevel: QRCode.CorrectLevel.H
  };
  var regCodeConfig = {
    width: 180,
    height: 180,
    text:regCode,
    PI:"#177CB0",
    quietZone: 25,
    logo:"../images/logo-cc14-qr.png",
    logoWidth:60,
    logoHeight:30,
    logoBackgroundTransparent: false,
    title:"Verification  Code",
    subTitle:assetID,
    titleHeight:50,
    titleTop:20,
    subTitleTop: 40,
    correctLevel: QRCode.CorrectLevel.Q
  };
  var t=new QRCode(document.getElementById(location), assetIDConfig);
  var t=new QRCode(document.getElementById(location), fullHashConfig);
  var s=new QRCode(document.getElementById(location), regCodeConfig);
};

// title token issuance, PID = NFT ID -------------------------------------BK
$("#BKissueNFTForm").submit(function(event){
  event.preventDefault();
  sessionStorage.clear();
  var formData = $(this).serializeArray();
  var issueQty=parseInt(formData[4].value);
  if(issueQty >20 && (formData[3].value)==secretPhraseIssuance){
    $("#issueNFTBroadcastBtn").prop('disabled', true);
  };
  var barcode   = parseInt(formData[0].value);
  var assetName = barcode.toString(32);
  var issueAssetData = [
    {name:"requestType", value:"issueAsset"},
    {name:"name",        value:assetName},
    {name:"description", value:"NFTID"},
    {name:"quantityQNT", value:"1"},
    {name:"decimals",    value:"0"},
    {name:"secretPhrase",value:formData[3].value},
    {name:"feeNQT",      value:"0"},
    {name:"deadline",    value:"60"},
    {name:"broadcast",   value:"false"},
    {name:"message",     value:formData[2].value},
  ];
  var fullHashArray         = new Array(issueQty);
  var assetIDArray          = new Array(issueQty);
  var transactionBytesArray = new Array(issueQty);
  var i=0;
  issueNFTFn();
  function issueNFTFn(){
    if(i<issueQty){
      $.ajax({
        type:"POST",
        url: apiNodeURL,
        data:issueAssetData,
        success:function(response){
          var responseObj = JSON.parse(response);
          fullHashArray[i]         = responseObj.fullHash;
          transactionBytesArray[i] = responseObj.transactionBytes;
          assetIDArray[i]          = NRS.fullHashToId(fullHashArray[i]);
          var feeCC14     = responseObj.transactionJSON.feeNQT/100000000;
          var timestamp   = responseObj.transactionJSON.timestamp;
          var senderRS    = responseObj.transactionJSON.senderRS;
          var description = responseObj.transactionJSON.attachment.description;
          var message     = responseObj.transactionJSON.attachment.message;

          //generate verification code with prdefined keyHex and ivHex in ../data/doNotShare
          var key         = CryptoJS.enc.Hex.parse(keyHex);
          var iv          = CryptoJS.enc.Hex.parse(ivHex);
          var encryptedID = CryptoJS.AES.encrypt(assetIDArray[i], key, { iv: iv });
          var regCodeText = encryptedID.ciphertext.toString();

          var issueTime   = timestampToLocalFn(timestamp);
          var n = i+1;
          var issueNFTTbl = "<tr><td>"+n+
                            "</td><td>&#160;"+assetIDArray[i] +
                            "</td><td>&#160;"+assetIDArray[i]+
                            "</td><td>"+regCodeText+
                            "</td><td>"+fullHashArray[i]+
                            "</td><td>&#160;"+barcode+
                            "</td><td>"+assetName+
                            "</td><td>"+message+
                            "</td><td>"+senderRS+
                            "</td><td>"+issueTime[0]+" "+issueTime[1]+
                            "</td><td>"+feeCC14+
                            "</td></tr>";
          if(i==0){
            issueNFTQRCodeFn(assetIDArray[i],regCodeText,"issueNFTQRCode");
            $("#issueNFTResultTbl tbody").append(issueNFTTbl);
            $("#issueNFTJSON").after("<h6>issueAsset - NFT#"+n+"</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
            i++;
            issueNFTFn();
          }else if (assetIDArray[i] != assetIDArray[i-1]) {
            issueNFTQRCodeFn(assetIDArray[i],regCodeText,"issueNFTQRCode");
            $("#issueNFTResultTbl tbody").append(issueNFTTbl);
            $("#issueNFTJSON").after("<h6>issueAsset - NFT#"+n+"</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
            sessionStorage.setItem("issueNFTBroadcast", JSON.stringify(transactionBytesArray));
            i++;
            issueNFTFn();
          }else if (assetIDArray[i] == assetIDArray[i-1]) {
            setTimeout(function() {
              issueNFTFn();
            }, 1000);
          };
        }
      });
    };
  };
  $("#issueNFTResponse").removeClass("d-none");
});

// title token issuance, PID = NFT ID -------------------------------------start
$("#issueNFTForm").submit(function(event){
  event.preventDefault();
  sessionStorage.clear();
  var formData = $(this).serializeArray();
  var issueQty=parseInt(formData[4].value);
  var barcode   = parseInt(formData[0].value);
  var assetName = barcode.toString(32);

  for(i=0; i<issueQty;i++){
    var placeholder=99999-i;
    var issueAssetData = [
      {name:"requestType", value:"issueAsset"},
      {name:"name",        value:assetName},
      {name:"description", value:"NFTID"+placeholder},
      {name:"quantityQNT", value:"1"},
      {name:"decimals",    value:"0"},
      {name:"secretPhrase",value:formData[3].value},
      {name:"feeNQT",      value:"0"},
      {name:"deadline",    value:"60"},
      {name:"broadcast",   value:"true"},
      {name:"message",     value:formData[2].value},
    ];

    //remove below line for real production-------------------------------------
    if (secretPhraseIssuance.includes(formData[3].value)){
      var broadcastLimit = 2;
    }else{
      var broadcastLimit = issueQty;
    };
    console.log(broadcastLimit);
    if(i>=broadcastLimit){
      issueAssetData[8].value ="false";
    }else{
    };
    //remove above line for real production-------------------------------------

    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:issueAssetData,
      success:function(response){
        var responseObj = JSON.parse(response);
        var fullHash    = responseObj.fullHash;
        var assetID     = NRS.fullHashToId(fullHash);
        var feeCC14     = responseObj.transactionJSON.feeNQT/100000000;
        var timestamp   = responseObj.transactionJSON.timestamp;
        var senderRS    = responseObj.transactionJSON.senderRS;
        var description = responseObj.transactionJSON.attachment.description;
        var message     = responseObj.transactionJSON.attachment.message;
        var key         = CryptoJS.enc.Hex.parse(keyHex);
        var iv          = CryptoJS.enc.Hex.parse(ivHex);
        var encryptedID = CryptoJS.AES.encrypt(assetID, key, { iv: iv });
        var regCodeText = encryptedID.ciphertext.toString();
        var issueTime   = timestampToLocalFn(timestamp);
        var issueNFTTbl = "<tr><td>"+assetID+
                          "</td><td>"+assetID+
                          "</td><td>"+fullHash+
                          "</td><td>"+regCodeText+
                          "</td><td>"+barcode+
                          "</td><td>"+assetName+
                          "</td><td>"+message+
                          "</td><td>"+senderRS+
                          "</td><td>"+issueTime[0]+" "+issueTime[1]+
                          "</td><td>"+feeCC14+
                          "</td></tr>";
        issueNFTQRCodeFn(assetID,regCodeText,fullHash,"issueNFTQRCode");
        $("#issueNFTResultTbl tbody").append(issueNFTTbl);
        $("#issueNFTJSON").after("<h6>issueAsset - NFT#"+"</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    });
  };
  $("#issueNFTResponse").removeClass("d-none");
});

// title token issuance, with pre-defined serial number ----------------------BK
$("#BKissueNFTwSNoForm").submit(function(event){
  event.preventDefault();
  sessionStorage.clear();
  var formData = $(this).serializeArray();
  var fullHashArray         = new Array(serialNoQty);
  var assetIDArray          = new Array(serialNoQty);
  var transactionBytesArray = new Array(serialNoQty);
  var barcode               = parseInt(formData[0].value);
  var assetName             = barcode.toString(32);
  var serialNumbers         = JSON.parse(formData[1].value);
  var serialNoQty           = serialNumbers.length;
  var i=0;
  issueNFTwSNoFn();
  function issueNFTwSNoFn(){
    if(i<serialNoQty){
      var issueAssetData = [
        {name:"requestType", value:"issueAsset"},
        {name:"name",        value: assetName},
        {name:"description", value: serialNumbers[i]},
        {name:"quantityQNT", value:"1"},
        {name:"decimals",    value: "0"},
        {name:"secretPhrase",value:formData[3].value},
        {name:"feeNQT",      value:"0"},
        {name:"deadline",    value:"60"},
        {name:"broadcast",   value:"false"},
        {name:"message",     value:formData[2].value},
      ];
      $.ajax({
        type:"POST",
        url: apiNodeURL,
        data:issueAssetData,
        success:function(response){
          var responseObj = JSON.parse(response);
          fullHashArray[i]         = responseObj.fullHash;
          transactionBytesArray[i] = responseObj.transactionBytes;
          assetIDArray[i]          = NRS.fullHashToId(fullHashArray[i]);
          var feeCC14     = responseObj.transactionJSON.feeNQT/100000000;
          var timestamp   = responseObj.transactionJSON.timestamp;
          var senderRS    = responseObj.transactionJSON.senderRS;
          var description = responseObj.transactionJSON.attachment.description;
          var message     = responseObj.transactionJSON.attachment.message;
          //generate verification code with prdefined keyHex and ivHex in ../data/doNotShare
          var key         = CryptoJS.enc.Hex.parse(keyHex);
          var iv          = CryptoJS.enc.Hex.parse(ivHex);
          var encryptedID = CryptoJS.AES.encrypt(assetIDArray[i], key, { iv: iv });
          var regCodeText = encryptedID.ciphertext.toString();
          var issueTime   = timestampToLocalFn(timestamp);
          var n=i+1;
          var issueNFTTbl = "<tr><td>"+n+
                            "</td><td>&#160;"+assetIDArray[i] +
                            "</td><td>&#160;"+serialNumbers[i]+
                            "</td><td>"+regCodeText+
                            "</td><td>"+fullHashArray[i]+
                            "</td><td>&#160;"+barcode+
                            "</td><td>"+assetName+
                            "</td><td>"+message+
                            "</td><td>"+senderRS+
                            "</td><td>"+issueTime[0]+" "+issueTime[1]+
                            "</td><td>"+feeCC14+
                            "</td></tr>";
          if(i==0){
            issueNFTQRCodeFn(assetIDArray[i],regCodeText,"issueNFTwSNoQRCode");
            $("#issueNFTwSNoResultTbl tbody").append(issueNFTTbl);
            $("#issueNFTwSNoJSON").after("<h6>issueAsset - NFT#"+n+"</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
            i++;
            issueNFTwSNoFn();
          }else if (assetIDArray[i] != assetIDArray[i-1]) {
            issueNFTQRCodeFn(assetIDArray[i],regCodeText,"issueNFTwSNoQRCode");
            $("#issueNFTwSNoResultTbl tbody").append(issueNFTTbl);
            $("#issueNFTwSNoJSON").after("<h6>issueAsset - NFT#"+n+"</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
            sessionStorage.setItem("issueNFTwSNoBroadcast", JSON.stringify(transactionBytesArray));
            i++;
            issueNFTwSNoFn();
          }else if (assetIDArray[i] == assetIDArray[i-1]) {
            setTimeout(function() {
              issueNFTwSNoFn();
            }, 1000);
          };
        }
      });
    };
  };
  $("#issueNFTwSNoResponse").removeClass("d-none");
});

// title token issuance, with pre-defined serial number -------------------start
$("#issueNFTwSNoForm").submit(function(event){
  event.preventDefault();
  sessionStorage.clear();
  var formData = $(this).serializeArray();
  var fullHashArray         = new Array(serialNoQty);
  var assetIDArray          = new Array(serialNoQty);
  var transactionBytesArray = new Array(serialNoQty);
  var barcode               = parseInt(formData[0].value);
  var assetName             = barcode.toString(32);
  var serialNumbers         = JSON.parse(formData[1].value);
  var serialNoQty           = serialNumbers.length;
  for (i=0; i<serialNoQty;i++){
    var issueAssetData = [
      {name:"requestType", value:"issueAsset"},
      {name:"name",        value:assetName},
      {name:"description", value:serialNumbers[i]},
      {name:"quantityQNT", value:"1"},
      {name:"decimals",    value:"0"},
      {name:"secretPhrase",value:formData[3].value},
      {name:"feeNQT",      value:"0"},
      {name:"deadline",    value:"60"},
      {name:"broadcast",   value:"true"},
      {name:"message",     value:formData[2].value},
    ];

    //remove below line for real production-------------------------------------
    if (secretPhraseIssuance.includes(formData[3].value)){
      var broadcastLimit = 2;
    }else{
      var broadcastLimit = issueQty;
    };
    if(i>=broadcastLimit){
      issueAssetData[8].value ="false";
    }else{
    };
    //remove above line for real production-------------------------------------

    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:issueAssetData,
      success:function(response){
        var responseObj = JSON.parse(response);
        var fullHash    = responseObj.fullHash;
        var assetID     = NRS.fullHashToId(fullHash);
        var feeCC14     = responseObj.transactionJSON.feeNQT/100000000;
        var timestamp   = responseObj.transactionJSON.timestamp;
        var senderRS    = responseObj.transactionJSON.senderRS;
        var description = responseObj.transactionJSON.attachment.description;
        var message     = responseObj.transactionJSON.attachment.message;
        var key         = CryptoJS.enc.Hex.parse(keyHex);
        var iv          = CryptoJS.enc.Hex.parse(ivHex);
        var encryptedID = CryptoJS.AES.encrypt(assetID, key, { iv: iv });
        var regCodeText = encryptedID.ciphertext.toString();
        var issueTime   = timestampToLocalFn(timestamp);
        var n=i+1;
        var issueNFTTbl = "<tr><td>"+description +
                          "</td><td>"+assetID+
                          "</td><td>"+fullHash+
                          "</td><td>"+regCodeText+
                          "</td><td>"+barcode+
                          "</td><td>"+assetName+
                          "</td><td>"+message+
                          "</td><td>"+senderRS+
                          "</td><td>"+issueTime[0]+" "+issueTime[1]+
                          "</td><td>"+feeCC14+
                          "</td></tr>";
        issueNFTQRCodeFn(assetID,regCodeText,fullHash,"issueNFTwSNoQRCode");
        $("#issueNFTwSNoResultTbl tbody").append(issueNFTTbl);
        $("#issueNFTwSNoJSON").after("<h6>issueAsset - NFT#"+n+"</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    });
  };
  $("#issueNFTwSNoResponse").removeClass("d-none");
});

// broadcast title token issuance -----------------------------------------start
$("#issueNFTBroadcastForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  var arrayData = sessionStorage.getItem("issueNFTBroadcast");
  var array     = JSON.parse(arrayData);
  console.log(array);
  for (var i=0; i <array.length; i++){
    formData[1].value = array[i];
      console.log(formData);
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:formData,
      success:function(response)
      {
        var n=i+1;
        $("#issueNFTJSON").after("<h6>broadcastTransaction - NFT#"+n+"</h6>"+response);
      }
    });
  }
});

// broadcast title token with pre-defined serial number -------------------start
$("#issueNFTwSNoBroadcastForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  var arrayData = sessionStorage.getItem("issueNFTwSNoBroadcast");
  var array = JSON.parse(arrayData);
  console.log(array);
  for (var i=0; i <array.length; i++){
    formData[1].value = array[i];
      console.log(formData);
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:formData,
      success:function(response)
      {
        var n=i+1;
        $("#issueNFTwSNoJSON").after("<h6>broadcastTransaction - NFT#"+n+"</h6>"+response);
      }
    });
  }
});

//assetActivation search --------------------------------------------------start
$("#activationSearchForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var issuerIdx = walletsObj.map(function(e) {return e.accountRS; }).indexOf(formData[0].value);
  if (issuerIdx>=0){
    //get selected wallet passphrase from ../data/doNoShare.js
    $("#activationConfirmFormPassword").val(walletsObj[issuerIdx].secretPhrase);
  };
  $("#activationJSONDisplay").removeClass("d-none");
  $("#activationSearchTblDisplay").removeClass("d-none");

  //update the value of activationConfirmForm input name=message
  $("#activationConfirmFormMessage").val(formData[1].value);

  var getAccountAssetsData = [
    {name:"requestType",      value:"getAccountAssets"},
    {name:"account",          value:formData[0].value.trim()},
    {name:"includeAssetInfo", value:"true"},
  ];

  //list of all available assets for selected account
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAccountAssetsData,
    success:function(response){
      var responseObj=JSON.parse(response);
      $("#activationJSON").append("<h6>getAccountAssets</h6><textarea class='form-control border border-info' rows='8'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      sessionStorage.setItem('getAccountAssets', response);
    }
  });

  var getAccountAssetsObj=JSON.parse(sessionStorage.getItem('getAccountAssets'));
  var getAssetHistoryData = [
    {name:"requestType",      value:"getAssetHistory"},
    {name:"asset",            value:""},
    {name:"includeAssetInfo", value:"true"},
  ];
  for(var i=0; i< getAccountAssetsObj.accountAssets.length; i++){
    getAssetHistoryData[1].value=getAccountAssetsObj.accountAssets[i].asset;
    //for every avaialble asset, get insuance information
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:getAssetHistoryData,
      success:function(response){
        var responseObj=JSON.parse(response);
        var length      = responseObj.assetHistory.length;
        var name        = responseObj.assetHistory[length-1].name;
        var decimals    = responseObj.assetHistory[length-1].decimals;
        var timestamp   = responseObj.assetHistory[length-1].timestamp;
        var asset       = responseObj.assetHistory[length-1].asset;
        var issuer      = responseObj.assetHistory[length-1].accountRS;
        var quantityQNT = responseObj.assetHistory[length-1].quantityQNT;
        var factor      = Math.pow(10, decimals);
        var issuedQty   = quantityQNT/factor;
        var barcode     = parseInt(name, 32).toString(10);
        var issueTime   = timestampToLocalFn(timestamp);
        if (!walletIssuance.includes(issuer)){
          //hilight asset not issued by known issuance wallets
          var activationSearchTbl = "<tr><td>"+barcode+
            "</td><td>"+asset+
            "</td><td>"+issueTime[0]+" "+issueTime[2]+" days"+
            "</td><td class='alert3'>Burn "+issuer+
            "</td><td>"+issuedQty+
            "</td><td>"+decimals+
            "</td></tr>";
        }else {
          var activationSearchTbl = "<tr><td>"+barcode+
            "</td><td>"+asset+
            "</td><td>"+issueTime[2]+"Days "+issueTime[0]+
            "</td><td>"+issuer+
            "</td><td>"+issuedQty+
            "</td><td>"+decimals+
            "</td></tr>";
        };
        $("#activationJSON").append("<h6>getAssetHistory</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
        $("#activationSearchTbl tbody").append(activationSearchTbl);
      }
    });
  };
});

//activation Confirm ------------------------------------------------------start
$("#activationConfirmForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var activationSearchFiltered=[];
  $("#activationSearchTbl tbody tr").each(function(){
    activationSearchFiltered.push($(this).find("td").eq(1).text());
  });
  console.log(activationSearchFiltered);
  activationSearchFiltered.forEach(activateAssetFn);
  function activateAssetFn(item){
    var transferAsset = [
      {name:"requestType",      value:"transferAsset"},
      {name:"deadline",         value:"60"},
      {name:"recipient",        value:formData[0].value},
      {name:"asset",            value:item},
      {name:"quantityQNT",      value:"1"},
      {name:"secretPhrase",     value:formData[1].value},
      {name:"feeNQT",           value:"100000000"},
      {name:"message",          value:formData[2].value}
    ];
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:transferAsset,
      success:function(response){
        var responseObj  = JSON.parse(response);
        var fullHash     = responseObj.fullHash;
        var feeCC14      = responseObj.transactionJSON.feeNQT/100000000;
        var timestamp    = responseObj.transactionJSON.timestamp;
        var recipientRS  = responseObj.transactionJSON.recipientRS;
        var asset        = responseObj.transactionJSON.attachment.asset;
        var activateTime = timestampToLocalFn(timestamp);
        var activationConfirmTbl = "<tr><td>"+asset+
                                   "</td><td>"+recipientRS+
                                   "</td><td>"+feeCC14+
                                   "</td><td>"+activateTime[0]+ " " + activateTime[1]+
                                   "</td><td>"+fullHash+
                                   "</td></tr>";
        $("#activationConfirmTbl tbody").append(activationConfirmTbl);
        $("#activationJSON").append("<h6>transferAsset - "+ transferAsset[3].value+" </h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    });
  };
  $("#activationConfirmTblDisp").removeClass("d-none");
});

// dataTablesFn uses by activationSearchForm ------------------------------start
function dataTablesActivationFn() {
  $('#activationSearchTbl tfoot th').each( function () {
    var title = $(this).text();
    $(this).html( '<input type="text" placeholder=" '+title+'" />' );
    } );
  var table = $('#activationSearchTbl').DataTable({
    "iDisplayLength": 100,
    initComplete: function () {
      this.api().columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change clear', function () {
          if ( that.search() !== this.value ) {
            that
            .search( this.value )
            .draw();
          }
        } );
      } );
    }
  });
};

//assetActivation search --------------------------------------------------start
$("#burningSearchForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var issuerIdx = walletsObj.map(function(e) {return e.accountRS; }).indexOf(formData[0].value);
  if (issuerIdx>=0){
    //get selected wallet passphrase from ../data/doNoShare.js
    $("#burningConfirmFormPassword").val(walletsObj[issuerIdx].secretPhrase);
  };
  $("#burningJSONDisplay").removeClass("d-none");
  $("#burningSearchTblDisplay").removeClass("d-none");

  //update the value of activationConfirmForm input name=message
  $("#burningConfirmFormMessage").val(formData[1].value);

  var getAccountAssetsData = [
    {name:"requestType",      value:"getAccountAssets"},
    {name:"account",          value:formData[0].value.trim()},
    {name:"includeAssetInfo", value:"true"},
  ];

  //list of all available assets for selected account
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAccountAssetsData,
    success:function(response){
      var responseObj=JSON.parse(response);
      $("#burningJSON").append("<h6>getAccountAssets</h6><textarea class='form-control border border-info' rows='8'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      sessionStorage.setItem('getAccountAssets', response);
    }
  });

  var getAccountAssetsObj=JSON.parse(sessionStorage.getItem('getAccountAssets'));
  var getAssetHistoryData = [
    {name:"requestType",      value:"getAssetHistory"},
    {name:"asset",            value:""},
    {name:"includeAssetInfo", value:"true"},
  ];
  for(var i=0; i< getAccountAssetsObj.accountAssets.length; i++){
    getAssetHistoryData[1].value=getAccountAssetsObj.accountAssets[i].asset;
    //for every avaialble asset, get insuance information
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:getAssetHistoryData,
      success:function(response){
        var responseObj=JSON.parse(response);
        var length      = responseObj.assetHistory.length;
        var name        = responseObj.assetHistory[length-1].name;
        var decimals    = responseObj.assetHistory[length-1].decimals;
        var timestamp   = responseObj.assetHistory[length-1].timestamp;
        var asset       = responseObj.assetHistory[length-1].asset;
        var issuer      = responseObj.assetHistory[length-1].accountRS;
        var quantityQNT = responseObj.assetHistory[length-1].quantityQNT;
        var factor      = Math.pow(10, decimals);
        var issuedQty   = quantityQNT/factor;
        var barcode     = parseInt(name, 32).toString(10);
        var issueTime   = timestampToLocalFn(timestamp);
        if (!walletIssuance.includes(issuer)){
          //hilight asset not issued by known issuance wallets
          var burningSearchTbl = "<tr><td>"+barcode+
            "</td><td>"+asset+
            "</td><td>"+issueTime[0]+" "+issueTime[2]+" days"+
            "</td><td class='alert3'>Burn "+issuer+
            "</td><td>"+issuedQty+
            "</td><td>"+decimals+
            "</td></tr>";
        }else {
          var burningSearchTbl = "<tr><td>"+barcode+
            "</td><td>"+asset+
            "</td><td>"+issueTime[2]+"Days "+issueTime[0]+
            "</td><td>"+issuer+
            "</td><td>"+issuedQty+
            "</td><td>"+decimals+
            "</td></tr>";
        };
        $("#burningJSON").append("<h6>getAssetHistory</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
        $("#burningSearchTbl tbody").append(burningSearchTbl);
      }
    });
  };
});

//activation Confirm ===========================================================
$("#burningConfirmForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var burningSearchFiltered=[];
  $("#burningSearchTbl tbody tr").each(function(){
    burningSearchFiltered.push($(this).find("td").eq(1).text());
  });
  console.log(burningSearchFiltered);
  burningSearchFiltered.forEach(burningAssetFn);
  function burningAssetFn(item){
    var transferAsset = [
      {name:"requestType",      value:"transferAsset"},
      {name:"deadline",         value:"60"},
      {name:"recipient",        value:formData[0].value},
      {name:"asset",            value:item},
      {name:"quantityQNT",      value:"1"},
      {name:"secretPhrase",     value:formData[1].value},
      {name:"feeNQT",           value:"100000000"},
      {name:"message",          value:formData[2].value}
    ];
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:transferAsset,
      success:function(response){
        var responseObj  = JSON.parse(response);
        var fullHash     = responseObj.fullHash;
        var feeCC14      = responseObj.transactionJSON.feeNQT/100000000;
        var timestamp    = responseObj.transactionJSON.timestamp;
        var recipientRS  = responseObj.transactionJSON.recipientRS;
        var asset        = responseObj.transactionJSON.attachment.asset;
        var activateTime = timestampToLocalFn(timestamp);
        var activationConfirmTbl = "<tr><td>"+asset+
                                   "</td><td>"+recipientRS+
                                   "</td><td>"+feeCC14+
                                   "</td><td>"+activateTime[0]+ " " + activateTime[1]+
                                   "</td><td>"+fullHash+
                                   "</td></tr>";
        $("#burningConfirmTbl tbody").append(activationConfirmTbl);
        $("#burningJSON").append("<h6>transferAsset - "+ transferAsset[3].value+" </h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    });
  };
  $("#burningConfirmTblDisp").removeClass("d-none");
});

// dataTablesFn uses by activationSearchForm ------------------------------start
function dataTablesBurningFn() {
  $('#burningSearchTbl tfoot th').each( function () {
    var title = $(this).text();
    $(this).html( '<input type="text" placeholder=" '+title+'" />' );
    } );
  var table = $('#burningSearchTbl').DataTable({
    "iDisplayLength": 100,
    initComplete: function () {
      this.api().columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change clear', function () {
          if ( that.search() !== this.value ) {
            that
            .search( this.value )
            .draw();
          }
        } );
      } );
    }
  });
};

// set Asset Property ==========================================================
$("#setAssetPropertyForm").submit(function(event){
  event.preventDefault();
  $("#setAssetPropertyDisplay").removeClass("d-none");
  var formData = $(this).serializeArray();
  console.log(formData);
  var setAssetProperty  = [
    {name:"requestType",      value:"setAssetProperty"},
    {name:"asset",            value:formData[0].value.trim()},
    {name:"property",         value:formData[1].value},
    {name:"value",            value:formData[2].value},
    {name:"secretPhrase",     value:formData[4].value},
    {name:"feeNQT",           value:"0"},
    {name:"deadline",         value:"60"},
    {name:"broadcast",        value:"false"},
    {name:"message",          value:formData[3].value}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:setAssetProperty,
    success:function(response){
      var responseObj = JSON.parse(response);
      console.log(responseObj);
      if(responseObj.errorDescription == "Unknown account"){
        var result = "Unknown account. Please verify the passpharse and retry.";
      }else if(responseObj.errorDescription == "Unknown asset"){
        var result = "Unknown token ID, please retry.";
      }else{
        var feeCC14          = responseObj.transactionJSON.feeNQT/100000000;
        var setterRS         = responseObj.transactionJSON.senderRS;
        var timestamp        = responseObj.transactionJSON.timestamp;
        var transactionBytes = responseObj.transactionBytes;
        var property         = responseObj.transactionJSON.attachment.property;
        var propertyValue    = responseObj.transactionJSON.attachment.value;
        var assetID          = responseObj.transactionJSON.attachment.asset;
        var setTime          = timestampToLocalFn(timestamp);
        var result = "<table class='table table-sm text-nowrap fs-6 table-bordered border-info caption-top'>"+
          "<tr><td>setterRS</td><td>"+setterRS+"</td></tr>"+
          "<tr><td>setTime</td><td>"+setTime[0]+" "+setTime[1]+"</td></tr>"+
          "<tr><td>assetID</td><td>"+assetID+"</td></tr>"+
          "<tr><td>property</td><td>"+property+"</td></tr>"+
          "<tr><td>value</td><td>"+propertyValue+"</td></tr>"+
          "<tr><td>fullHash</td><td>"+responseObj.fullHash+"</td></tr>"+
          "<tr><td>fee</td><td>"+feeCC14+" CC14 </td></tr></table>";
        $("#setAssetPropertyTransactionBytes").val(transactionBytes);
      };
      $("#setAssetPropertyResult").html(result);
      $("#setAssetPropertyJSON").after("<h6>setAssetProperty</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

//boardcase transfer title token-------------------------------------------start
$("#setAssetPropertyBroadcastTransactionForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  var transactionBytes = formData[0].value;
  var location = "setAssetProperty";
  // broadcastTransactionFn(transactionBytes,location);
});

//reproduct verification code from token ID -------------------------------start
$("#reproduceRegCodeForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var secureCode=formData[0].value;
  var key         = CryptoJS.enc.Hex.parse(keyHex);
  var iv          = CryptoJS.enc.Hex.parse(ivHex);
  var encryptedID = CryptoJS.AES.encrypt(secureCode, key, { iv: iv });
  var regCodeText = encryptedID.ciphertext.toString();
  $("#dispReproduceRegCode").html(regCodeText);
  issueNFTQRCodeFn(secureCode,regCodeText,"reproduceRegCodeQRCode");
});

//AES key and IV generator ------------------------------------------------start
$("#aesKeyIvForm").submit(function(event){
  event.preventDefault();
  var keyHash = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16));
  var ivHash  = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16));
  $("#aesKeyIvResponse").html("<b>key (hex):</b> "+keyHash+"<br><b>iv (hex) :</b> "+ivHash+"<br>");
  genQRCodeFn(keyHash,"../images/logo-cc14-qr.png","dispKeyIvQRCode","green");
  genQRCodeFn(ivHash,"../images/logo-cc14-qr.png","dispKeyIvQRCode","#00A1DB");
});

// issue traceable Asset =======================================================
$("#issueAssetForm").submit(function(event){
  event.preventDefault();
  var formData    = $(this).serializeArray();
  var factor      = Math.pow(10,formData[1].value);
  var quantityQNT = factor*formData[0].value;
  var barcode     = parseInt((formData[2].value));
  var name        = barcode.toString(32);
  var issueAsset  = [
    {name:"requestType",      value:"issueAsset"},
    // {name:"chain",            value:"2"},
    {name:"name",             value:name},
    {name:"description",      value:formData[3].value},
    {name:"quantityQNT",      value:quantityQNT},
    {name:"decimals",         value:formData[1].value},
    {name:"secretPhrase",     value:formData[5].value},
    {name:"feeNQT",           value:"0"},
    {name:"deadline",         value:"60"},
    // {name:"feeRateNQTPerFXT", value:"-1"},
    {name:"broadcast",        value:"false"},
    {name:"message",          value:formData[4].value}
  ];
  console.log(formData[5].value);
  // remove this line for production version====================================
  if((formData[5].value)=="ci di wu yin 301 liang ge bi wang er bu ceng tou"){
    $("#issueAssetBroadcastBtn").prop('disabled', true);

  };
  // remove this line for production version====================================
  $.ajax({
    type:"POST",
    url: url,
    data:issueAsset,
    success:function(response){
      var responseObj      = JSON.parse(response);
      var feeCC14          = responseObj.transactionJSON.feeNQT/100000000;
      var issuerRS         = responseObj.transactionJSON.senderRS;
      var timestamp        = responseObj.transactionJSON.timestamp;
      var transactionBytes = responseObj.transactionBytes;
      var descriptionStr   = responseObj.transactionJSON.attachment.description;
      var message          = responseObj.transactionJSON.attachment.message;
      var fullHash         = responseObj.fullHash;
      var quantityQNT      = responseObj.transactionJSON.attachment.quantityQNT;
      var factor           = Math.pow(10, responseObj.transactionJSON.attachment.decimals);
      var quantity         = quantityQNT/factor;
      var assetID          = NRS.fullHashToId(fullHash);
      var issueTime        = timestampToLocalFn(timestamp);
      var descriptionObj   = JSON.parse(descriptionStr);
      var unit             = descriptionObj.unit;
      var lotNo            = descriptionObj.lotNo;
      var issueAssetResult = "<table class='table table-sm text-nowrap fs-6 table-bordered border-info caption-top'>"+
        "<tr><td>issuer</td><td>"+issuerRS+"</td></tr>"+
        "<tr><td>issueTime</td><td>"+issueTime[0]+" "+issueTime[1]+"</td></tr>"+
        "<tr><td>name</td><td>"+name+"</td></tr>"+
        "<tr><td>quantity</td><td>"+quantity.toFixed(responseObj.transactionJSON.attachment.decimals)+" "+unit+"</td></tr>"+
        "<tr><td>assetID</td><td>"+assetID+"</td></tr>"+
        "<tr><td>decimals</td><td>"+responseObj.transactionJSON.attachment.decimals+"</td></tr>"+
        "<tr><td>lot No</td><td>"+lotNo+"</td></tr>"+
        "<tr><td>fullHash</td><td>"+responseObj.fullHash+"</td></tr>"+
        "<tr><td>fee</td><td>"+feeCC14+" CC14 </td></tr>"+
        "<tr><td>message</td><td>"+responseObj.transactionJSON.attachment.message+"</td></tr></table> ";
      $("#issueAssetResult").html(issueAssetResult);
      $("#issueAssetTransactionBytes").val(transactionBytes);
      $("#issueAssetJSON").after("<h6>issueAsset</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      var config = {
        width: 160,
        height: 160,
        text:assetID,
        PI:"#0C8918",
        quietZone: 25,
        logo:"../images/logo-cc14-qr.png",
        logoWidth:80,
        logoHeight:40,
        title:"Secure Code",
        subTitle:assetID,
        titleHeight:50,
        titleTop:20,
        subTitleTop: 40,
        correctLevel: QRCode.CorrectLevel.H
        };
        var t=new QRCode(document.getElementById("issueAssetQRCode"), config);
      }
    });
  $("#issueAssetDisplay").removeClass("d-none");
});

// issue anti counterfeit product -----------------------------------------start
function encryptAESFn(string, key, ivstr) {
     let ckey = CryptoJS.enc.Utf8.parse(key);
     let encrypted = CryptoJS.AES.encrypt(string, ckey, {
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7,
         iv:CryptoJS.enc.Utf8.parse(ivstr)
     });
     return encrypted.ciphertext.toString();
};
