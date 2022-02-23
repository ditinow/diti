//constant----------------------------------------------------------------------
var epochBeginningCC14         = 1560945600;
var epochBeginningNXT          = 1385294400;
var epochBeginningNXT          = 1385294400;
var epochBeginningArdorMainnet = 1514764800;
var epochBeginningArdorTestnet = 1514296800;

//##############################################################################
//#                                                                            #
//#                               select blockchain                            #
//#                                                                            #
//##############################################################################
//setup apiNodeURL -------------------------------------------------------------
if(localStorage.getItem("nodeUrlLS") == undefined){
  localStorage.setItem("nodeUrlLS", "http://cryptoc14.com:19886/");
  var apiNodeURL = "http://cryptoc14.com:19886/nxt";
  console.log(apiNodeURL);
}else{
  var apiNodeURL = localStorage.getItem("nodeUrlLS")+"nxt";
  $("#nodeAddress").val(localStorage.getItem("nodeUrlLS")).change();
  console.log(apiNodeURL);
};
if(localStorage.getItem("epochBeginningLS") == undefined){
  localStorage.setItem("epochBeginningLS", epochBeginningCC14);
  var epochBeginning = Number(epochBeginningCC14);
  console.log(new Date(epochBeginning*1000));
}else{
  var epochBeginning = Number(localStorage.getItem("epochBeginningLS"));
  console.log(new Date(epochBeginning*1000));
};

//user update blockchain node address ------------------------------------------
$("#selectNodeUrlForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var getStateData= [
    {name:"requestType",  value:"getState"},
    {name:"includeCounts",value:true},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getStateData,
    success:function(response){
      var getStateObj = JSON.parse(response);
      if(getStateObj.application=="NRS"){
        var epochBeginning = epochBeginningNXT;
      }else if(getStateObj.application=="Ardor"){
        if(getStateObj.isTestnet==false){
          var epochBeginning = epochBeginningArdorMainnet;
        }else{
          var epochBeginning = epochBeginningArdorTestnet;
        }
      };
      if(getStateObj.blockchainState =="UP_TO_DATE"){
        localStorage.setItem("nodeUrlLS", formData[0].value);
        $("#nodeAddress").val(formData[0].value).change();
        var apiNodeURL = formData[0].value+"nxt";
        alert("您已链接到 " + getStateObj.application + " 区块链节点 \n" + "Your are connecting to " + getStateObj.application + " blockchain node at \n" +formData[0].value);
      }else if (getStateObj.blockchainState =="DOWNLOADING") {
        alert("您链接的区块链节点在分叉上，请另外选择一个节点。\n You are connecting to a fork, please select another node.");
      };
      console.log("Blockchain " + getStateObj.application);
      console.log("Node " + apiNodeURL);
      console.log(new Date(epochBeginning*1000));
    }
  });
});


//##############################################################################
//#                                                                            #
//#                               global function                              #
//#                                                                            #
//##############################################################################
// for broadcating transactionBytes
function broadcastFn(formID){
  var formData    = $("#"+formID).serializeArray();
  var selector    = formID.substring(0,formID.length-9);
  // console.log(formData);
  var apiCallData = [
    {name:"requestType",     value:"broadcastTransaction"},
    {name:"transactionBytes",value: formData[0].value},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:apiCallData,
    success:function(response){
      var responseObj=JSON.parse(response);
      if("errorDescription" in responseObj){
        // console.log("#"+selector+"BroadcastFailed");
        $("#"+selector+"BroadcastFailed").removeClass("d-none");
      }else{
        $("#"+selector+"BroadcastPassed").removeClass("d-none");
        $("#"+selector+"BroadcastFullHash").html(responseObj.fullHash);
      };
      $("#"+selector+"BroadcastJSON").after("<h6>broadcastTransaction</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
};

//generate QR Code---------------------------------------------------------start
function genQRCodeFn(text,logo,displayLocation,color){
  var textStr = text.toString();
  var config = {
    text:textStr,
    PI:color,
    quietZone: 25,
    logo:logo,
    logoWidth:80,
    logoHeight:40,
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

//reset input field ------------------------------------------------------------
function resetInputFn(selector){
  document.getElementById(selector).value = "";
};

//display JSON response
function displayTransactionFn(transaction){
  if(transaction.length == 64){
    var apiCallData = [
      {name:"requestType", value:"getTransaction"},
      {name:"fullHash", value:transaction},
    ];
  }else{
    var apiCallData = [
      {name:"requestType", value:"getTransaction"},
      {name:"transaction", value:transaction},
    ];
  };
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:apiCallData,
    success:function(response){
      var responseObj = JSON.parse(response);
      $("#transactionModalTitle").val(transaction);
      $("#transactionModalJSON").html("<textarea class='form-control' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  transactionModal.show();
};

//display JSON response
function displayTokenFn(token){
  if(token.length == 64){
    var tokenID = NRS.fullHashToId(token);
  }else{
    var tokenID = token;
  };
  $("#textareaTokenTitle").val(tokenID);

  var getAsset = [
    {name:"requestType", value: "getAsset"},
    {name:"asset",       value: tokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAsset,
    success:function(response){
      var responseObj = JSON.parse(response);
      $("#tokenModalJSONgetAsset").html("<h6>getAsset</h6><textarea class='form-control' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });

  var getAssetHistory = [
    {name:"requestType", value:"getAssetHistory"},
    {name:"asset",       value:tokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetHistory,
    success:function(response){
      var responseObj = JSON.parse(response);
      $("#tokenModalJSONgetAssetHistory").html("<h6>getAssetHistory</h6><textarea class='form-control' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });

  var getAssetAccounts = [
    {name:"requestType", value:"getAssetAccounts"},
    {name:"asset",       value:tokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetAccounts,
    success:function(response){
      var responseObj = JSON.parse(response);
      $("#tokenModalJSONgetAssetAccounts").html("<h6>getAssetAccounts</h6><textarea class='form-control' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });

  var getAssetProperties = [
    {name:"requestType", value:"getAssetProperties"},
    {name:"asset",       value:tokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetProperties,
    success:function(response){
      var responseObj = JSON.parse(response);
      $("#tokenModalJSONgetAssetProperties").html("<h6>getAssetProperties</h6><textarea class='form-control' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });

  var getAssetTransfers = [
    {name:"requestType", value:"getAssetTransfers"},
    {name:"asset",       value:tokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAssetTransfers,
    success:function(response){
      var responseObj = JSON.parse(response);
      $("#tokenModalJSONgetAssetTransfers").html("<h6>getAssetTransfers</h6><textarea class='form-control' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  tokenModal.show();
};


//##############################################################################
//#                                                                            #
//#                        for tokenManagement.html;                           #
//#                                                                            #
//##############################################################################
//AES key and IV generator ------------------------------------------------start
$("#aesKeyIvForm").submit(function(event){
  event.preventDefault();
  var keyHash = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16));
  var ivHash  = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(16));
  $("#aesKeyIvResponse").html("<b><span style='color:green'>key</span>:</b> "+keyHash+"<br><b><span style='color:#00A1DB'>iv </span> :</b> "+ivHash+"<br>");
  genQRCodeFn(keyHash,"../images/logo-cc14-qr.png","aesKeyIvResponse","green");
  genQRCodeFn(ivHash,"../images/logo-cc14-qr.png","aesKeyIvResponse","#00A1DB");
});

//reproduct verification code from token ID -------------------------------start
$("#reproduceRedemptionCodeForm").submit(function(event){
  event.preventDefault();
  var formData       = $(this).serializeArray();
  var tokenID        = formData[0].value;
  var key            = CryptoJS.enc.Hex.parse(formData[1].value);
  var iv             = CryptoJS.enc.Hex.parse(formData[2].value);
  var redemptionCode = CryptoJS.AES.encrypt(tokenID, key, { iv: iv }).toString();
  $("#reproduceRegCodeResponse").removeClass("d-none");
  $("#dispReproduceRegCode").html(redemptionCode);
  genQRCodeFn(redemptionCode,"../images/logo-cc14-qr.png","dispReproduceRegCodeQRCode","#00A1DB");
});

//issue NFT function ----------------------------------------------------start
function issueNFTFn(array){
  var selector   = array[0].value;
  var index      = array[1].value;
  if(array[2].value.length<= 10){
    var tokenName  = array[2].value;
  }else{
    var barcode    = parseInt(array[2].value);
    var tokenName  = barcode.toString(32);
  };
  var barcode    = parseInt(array[2].value);
  var tokenName  = barcode.toString(32);
  var serialNo   = array[3].value;
  var apiCallData = [
    {name:"requestType", value:"issueAsset"},
    {name:"name",        value: tokenName},
    {name:"description", value: array[3].value},
    {name:"quantityQNT", value: "1"},
    {name:"decimals",    value: "0"},
    {name:"secretPhrase",value: array[4].value},
    {name:"feeNQT",      value: "0"},
    {name:"deadline",    value:"60"},
    {name:"broadcast",   value: "true"},
    {name:"message",     value: array[5].value},
  ];
  //remove below lines for real production------------------------------------
  var issuerPublicKey = NRS.getPublicKey(converters.stringToHexString(array[4].value)) ;
  var issuerWalletRS  = NRS.getAccountIdFromPublicKey(issuerPublicKey, true);
  var findIssuer = walletsList.map(function(e) {return e.accountRS; }).indexOf(issuerWalletRS);
  if (findIssuer >= 0 && index > 2){
    apiCallData[8].value ="false";
  };
  //remove above lines for real production------------------------------------

  var dispSelectorJSON          = "#"+selector+"JSON";
  var dispSelectorResult        = "#"+selector+"Result";
  var dispSelectorResultError   = "#"+selector+"ResultError";
  var dispSelectorResultNoFunds = "#"+selector+"ResultNoFunds";
  var dispSelectorResultTable   = "#"+selector+"ResultTbl tbody";
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:apiCallData,
    success:function(response){
      var responseObj = JSON.parse(response);
      $(dispSelectorJSON).after("<h6>issueAsset - NFT</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      if(responseObj.errorDescription == "Unknown account"){
        $(dispSelectorResultError).removeClass("d-none");
      }else if(responseObj.errorDescription == "Not enough funds"){
        $(dispSelectorResultNoFunds).removeClass("d-none");
      }else{
        var fullHash    = responseObj.fullHash;
        var tokenID     = NRS.fullHashToId(responseObj.fullHash);
        var key         = CryptoJS.enc.Hex.parse(array[6].value);
        var iv          = CryptoJS.enc.Hex.parse(array[7].value);
        var encryptedID = CryptoJS.AES.encrypt(tokenID, key, { iv: iv });
        var issueTime   = timestampToLocalFn(responseObj.transactionJSON.timestamp);
        if(serialNo.substring(0,5)=="NFTID"){
          serialNo=tokenID;
        };
        var issueNFTTbl = "<tr><td>"+serialNo+
                          "</td><td><button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTokenFn(&quot;"+tokenID+"&quot;)'>"+tokenID+"</button>"+
                          "</td><td><button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>"+
                          "</td><td>"+encryptedID.toString()+
                          "</td><td>"+encryptedID.toString()+
                          "</td><td>"+barcode+
                          "</td><td>"+tokenName+
                          "</td><td>"+responseObj.transactionJSON.attachment.message+
                          "</td><td>"+responseObj.transactionJSON.senderRS+
                          "</td><td>"+issueTime[0]+" "+issueTime[1]+
                          "</td><td>"+responseObj.transactionJSON.feeNQT/100000000+
                          "</td></tr>";
        issueNFTQRCodeFn(tokenID,encryptedID.toString(),fullHash,"issueNFTQRCode");
        $(dispSelectorResult).removeClass("d-none");
        $(dispSelectorResultTable).append(issueNFTTbl);
      };
    }
  });
};

$("#issueNFTForm").submit(function(event){
  event.preventDefault();
  var formData  = $(this).serializeArray();
  if(formData[1].value.length < 1 && formData[2].value.length < 1) {
    alert("授权数量或产品编号必须填写一项 \n One of the Qty or Serial No. fields must be filled in");
  }else{
    $("#issueNFTResponse").removeClass("d-none");
    if(formData[2].value.length < 1){
      var issueQty = parseInt(formData[1].value);
      var pidNFTID = true;
    }else {
      var serialNoStr  = formData[2].value;
      var serialNoList = serialNoStr.split(",").map(function (value) {return value.trim();});
      var issueQty  = serialNoList.length;
      var pidNFTID = false;
    };
    for(i=0; i<issueQty;i++){
      if(pidNFTID==true){
        var placeholder = 99999-i;
        var serialNo = "NFTID"+placeholder;
      }else{
        var serialNo = serialNoList[i];
      };
      var index = i+1;
      var issueAssetFnData = [
        {name:"selector",    value: "issueNFT"},
        {name:"index",       value: index},
        {name:"barcode",     value: formData[0].value},
        {name:"serialNo",    value: serialNo},
        {name:"secretPhrase",value: formData[4].value},
        {name:"message",     value: formData[3].value},
        {name:"keyHash",     value: formData[5].value},
        {name:"ivHash",      value: formData[6].value},

      ];
      issueNFTFn(issueAssetFnData);
    };
  };
});

//assetActivation search --------------------------------------------------start
$("#activationSearchForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
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
      var getAssetHistoryData = [
        {name:"requestType",      value:"getAssetHistory"},
        {name:"asset",            value:""},
        {name:"includeAssetInfo", value:"true"},
      ];
      for(var i=0; i< responseObj.accountAssets.length; i++){
        getAssetHistoryData[1].value=responseObj.accountAssets[i].asset;
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
            var findIssuer = walletsList.map(function(e) {return e.accountRS; }).indexOf(issuer);
            if(findIssuer >=0 && walletsList[findIssuer].walletAssignment == "issuance"){
              var activationSearchTbl = "<tr><td>"+barcode+
                "</td><td><button type='button' class='btn btn-outline-dark border-0' onclick='displayTokenFn(&quot;"+asset+"&quot;)'>"+asset+"</button>"+
                "</td><td>"+issueTime[2]+"Days "+issueTime[0]+
                "</td><td>"+issuer+
                "</td><td>"+issuedQty+
                "</td><td>"+decimals+
                "</td></tr>";
            }else{
              var activationSearchTbl = "<tr><td>"+barcode+
                "</td><td>"+asset+
                "</td><td>"+issueTime[0]+" "+issueTime[2]+" days"+
                "</td><td class='alert3'>Unknown Issuer "+issuer+
                "</td><td>"+issuedQty+
                "</td><td>"+decimals+
                "</td></tr>";
            } ;
            $("#activationJSON").append("<h6>getAssetHistory</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
            $("#activationSearchTbl tbody").append(activationSearchTbl);
          }
        });
      };
    }
  });
});

//activation Confirm ------------------------------------------------------start
$("#activationConfirmForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var activationSearchFiltered=[];
  $("#activationSearchTbl tbody tr").each(function(){
    activationSearchFiltered.push($(this).find("td").eq(1).text());
  });
  // console.log(activationSearchFiltered);
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
        var activationConfirmTbl = "<tr><td><button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTokenFn(&quot;"+asset+"&quot;)'>"+asset+"</button>"+
                                   "</td><td>"+recipientRS+
                                   "</td><td>"+feeCC14+
                                   "</td><td>"+activateTime[0]+ " " + activateTime[1]+
                                   "</td><td><button type='button' class='btn btn-outline-dark border-0 btn-sm' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>"+
                                   "</td></tr>";
        $("#activationConfirmTbl tbody").append(activationConfirmTbl);
        $("#activationJSON").append("<h6>transferAsset - "+ transferAsset[3].value+" </h6><textarea class='form-control border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    });
  };
  $("#activationConfirmTblDisp").removeClass("d-none");
});

// dataTablesFn uses by activationSearchForm found in tokenManagement.html------
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
      var getAssetHistoryData = [
        {name:"requestType",      value:"getAssetHistory"},
        {name:"asset",            value:""},
        {name:"includeAssetInfo", value:"true"},
      ];
      for(var i=0; i< responseObj.accountAssets.length; i++){
        getAssetHistoryData[1].value=responseObj.accountAssets[i].asset;
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
            var findIssuer = walletsList.map(function(e) {return e.accountRS; }).indexOf(issuer);
            if(findIssuer >=0 && walletsList[findIssuer].walletAssignment == "issuance"){
              var burningSearchTbl = "<tr><td>"+barcode+
                "</td><td><button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTokenFn(&quot;"+asset+"&quot;)'>"+asset+"</button>"+
                "</td><td>"+issueTime[2]+"Days "+issueTime[0]+
                "</td><td>"+issuer+
                "</td><td>"+issuedQty+
                "</td><td>"+decimals+
                "</td></tr>";
            }else{
              var burningSearchTbl = "<tr><td>"+barcode+
                "</td><td>"+asset+
                "</td><td>"+issueTime[0]+" "+issueTime[2]+" days"+
                "</td><td class='alert3'>Unknown Issuer "+issuer+
                "</td><td>"+issuedQty+
                "</td><td>"+decimals+
                "</td></tr>";
            } ;
            $("#burningJSON").append("<h6>getAssetHistory</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
            $("#burningSearchTbl tbody").append(burningSearchTbl);
          }
        });
      };
    }
  });
});

//activation Confirm ===========================================================
$("#burningConfirmForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
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
        console.log(responseObj);
        var fullHash     = responseObj.fullHash;
        var feeCC14      = responseObj.transactionJSON.feeNQT/100000000;
        var timestamp    = responseObj.transactionJSON.timestamp;
        var recipientRS  = responseObj.transactionJSON.recipientRS;
        var asset        = responseObj.transactionJSON.attachment.asset;
        var dumpedTime   = timestampToLocalFn(timestamp);
        var dumpedConfirmTbl = "<tr><td><button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTokenFn(&quot;"+asset+"&quot;)'>"+asset+"</button>"+
                               "</td><td>"+recipientRS+
                               "</td><td>"+feeCC14+
                               "</td><td>"+dumpedTime[0]+ " " + dumpedTime[1]+
                               "</td><td><button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>"+
                               "</td></tr>";
        $("#burningConfirmTbl tbody").append(dumpedConfirmTbl);
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
  $("#setAssetPropertyResponse").removeClass("d-none");
  var formData = $(this).serializeArray();
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
      if(responseObj.errorDescription == "Unknown account"){
        $("#setAssetPropertyResultUnknownAccount").removeClass("d-none");
      }else if(responseObj.errorDescription == "Unknown asset"){
        $("#setAssetPropertyResultUnknownAsset").removeClass("d-none");
      }else{
        var setTime = timestampToLocalFn(responseObj.transactionJSON.timestamp);
        $("#setAssetPropertyResultAssetID").html(responseObj.transactionJSON.attachment.asset);
        $("#setAssetPropertyResultSetterRS").html(responseObj.transactionJSON.senderRS);
        $("#setAssetPropertyResultSetTime").html(setTime[0] + " ; " + setTime[1]);
        $("#setAssetPropertyResultProperty").html(responseObj.transactionJSON.attachment.property);
        $("#setAssetPropertyResultValue").html(responseObj.transactionJSON.attachment.value);
        $("#setAssetPropertyResultFullHash").html("<button type='button' class='btn btn-outline-dark border-0' onclick='displayTransactionFn(&quot;"+responseObj.fullHash+"&quot;)'>"+responseObj.fullHash+"</button>" );
        $("#setAssetPropertyResultFee").html(responseObj.transactionJSON.feeNQT/100000000);
        $("#setAssetPropertyTransactionBytes").val(responseObj.transactionBytes);
      };
      $("#setAssetPropertyJSON").after("<h6>setAssetProperty</h6><textarea class='form-control border border-info' rows='17'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

//issue NFT function ----------------------------------------------------start
function issueAssetFn(array){
  var selector                  = array[6].value;
  var selectorJSON              = "#"+selector+"JSON";
  var selectorResult            = "#"+selector+"Result";
  var selectorResultError       = "#"+selector+"ResultError";
  var selectorResultNoFunds     = "#"+selector+"ResultNoFunds";
  var selectorResultFee         = "#"+selector+"ResultFee";
  var selectorResultAccountRS   = "#"+selector+"ResultAccountRS";
  var selectorResultName        = "#"+selector+"ResultName";
  var selectorResultTokenID     = "#"+selector+"ResultTokenID";
  var selectorResultQty         = "#"+selector+"ResultQty";
  var selectorResultDec         = "#"+selector+"ResultDec";
  var selectorResultDescription = "#"+selector+"ResultDescription";
  var selectorResultMessage     = "#"+selector+"ResultMessage";
  var selectorResultFullHash    = "#"+selector+"ResultFullHash";
  var selectorTransactionBytes  = "#"+selector+"TransactionBytes";
  var selectorQRCode            = selector+"QRCode";
  var selectorValidatTokenID    = "#"+selector+"ValidatTokenID";
  var quantityQNT = Math.pow(10,array[1].value)*array[0].value;
  if(!Number.isInteger(quantityQNT)){
    alert("授权数量精确值位数必须小于或等于小数点位数！\n Number of digits after decimal point of the issuing quantity must less than or equal to decimals.");
  }else{
    var apiCallData = [
      {name:"requestType", value:"issueAsset"},
      {name:"name",        value: array[2].value},
      {name:"description", value: array[3].value},
      {name:"quantityQNT", value: quantityQNT},
      {name:"decimals",    value: array[1].value},
      {name:"secretPhrase",value: array[5].value},
      {name:"feeNQT",      value: "0"},
      {name:"deadline",    value: "60"},
      {name:"broadcast",   value: "false"},
      {name:"message",     value: array[4].value}
    ];

    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:apiCallData,
      success:function(response){
        var responseObj = JSON.parse(response);
        $(selectorJSON).after("<h6>issueAsset</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
        if(responseObj.errorDescription == "Unknown account"){
          $(selectorResultError ).removeClass("d-none");
        }else if(responseObj.errorDescription == "Not enough funds"){
          $(selectorResultNoFunds).removeClass("d-none");
        }else{
          var fullHash    = responseObj.fullHash;
          var tokenID     = NRS.fullHashToId(responseObj.fullHash);
          $(selectorResultFee).html(responseObj.transactionJSON.feeNQT/100000000);
          $(selectorResultAccountRS).html(responseObj.transactionJSON.senderRS);
          $(selectorResultName).html(responseObj.transactionJSON.attachment.name);
          $(selectorResultTokenID).html("<button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTokenFn(&quot;"+tokenID+"&quot;)'>"+tokenID+"</button>");
          $(selectorResultQty).html(array[0].value);
          $(selectorResultQty).html(array[1].value);
          $(selectorResultDescription).val(responseObj.transactionJSON.attachment.description);
          $(selectorResultMessage).html(responseObj.transactionJSON.attachment.message);
          $(selectorResultFullHash).html("<button type='button' class='btn btn-outline-dark border-0' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>");
          $(selectorTransactionBytes).val(responseObj.transactionBytes);
          $(selectorValidatTokenID).val(tokenID);
          $(selectorResult).removeClass("d-none");
        };
      }
    });
  };
};

$("#issueAssetForm").submit(function(event){
  event.preventDefault();
  var formData  = $(this).serializeArray();

  //remove below lines for real production------------------------------------
  var issuerPublicKey = NRS.getPublicKey(converters.stringToHexString(formData[5].value)) ;
  var issuerWalletRS  = NRS.getAccountIdFromPublicKey(issuerPublicKey, true);
  var findIssuer = walletsList.map(function(e) {return e.accountRS; }).indexOf(issuerWalletRS);
  if (findIssuer >= 0){
    $("#issueAssetBroadcastBtn").prop("disabled",true);
  };
  //remove above lines for real production------------------------------------

  if(formData[2].value.match(/^[0-9a-zA-Z]+$/)){
    if(isJSONFn(formData[3].value)){
      var descriptionObj = JSON.parse(formData[3].value);
      var descriptionStr = JSON.stringify(descriptionObj);
      $("#issueAssetResponse").removeClass("d-none");
      var issueAssetFnData = [
        {name:"quantityQNT", value: formData[0].value},
        {name:"decimals",    value: formData[1].value},
        {name:"name",        value: formData[2].value},
        {name:"description", value: descriptionStr},
        {name:"message",     value: formData[4].value},
        {name:"secretPhrase",value: formData[5].value},
        {name:"selector",    value: "issueAsset"},
      ];
      issueAssetFn(issueAssetFnData);
    }else{
      alert("产品描述不符合JSON标准，请核对！\n Invalid JSON, please verify Description.")
    };
  }else {
    $("#issueAssetName").val(formData[2].value + " <- 命名错误，仅接受3到10个英文字母或数字");
  };
});

function isJSONFn(str){
  try {
        JSON.parse(str);
    } catch (e) {
        return false;
    };
    return true;
};

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
    PI:"#FFA500",
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
    logoWidth:80,
    logoHeight:40,
    logoBackgroundTransparent: true,
    title:"Redemption  Code",
    subTitle:assetID,
    titleHeight:50,
    titleTop:20,
    subTitleTop: 40,
    correctLevel: QRCode.CorrectLevel.H
  };
  var t=new QRCode(document.getElementById(location), assetIDConfig);
  var t=new QRCode(document.getElementById(location), fullHashConfig);
  var s=new QRCode(document.getElementById(location), regCodeConfig);
};

// broadcastTransactionFn -------------------------------------------------start
function broadcastTransactionFn(location){
  event.preventDefault();
  console.log(location);
  var transactionBytes   = $("#"+location+"TransactionBytes").val();
  var dispLocationResult = "#"+location+"BroadcastResult";
  var dispLocationResultUnknown = "#"+location+"ResultUnknown";
  var dispLocationResultNoFunds = "#"+location+"ResultNoFunds";
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
      if(responseObj.errorDescription == "Unknown account"){
        $(dispLocationResultUnknown).removeClass("d-none");
      }else if(responseObj.errorDescription == "Not enough funds"){
        $(dispLocationResultNoFunds).removeClass("d-none");
      }else{
        $(dispLocationResult).removeClass("d-none");
      };
      $(dispLocationJSON).after("<h6>broadcastTransaction</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
};


//##############################################################################
//#                                                                            #
//#                               for utility.html                             #
//#                                                                            #
//##############################################################################
//New Ardor Wallet --------------------------------------------------------start
function newRandomSecretFn(selector){
  PassPhraseGenerator.generatePassPhrase();
  var newRandomSecret = PassPhraseGenerator.passPhrase;
  $("#"+selector).val(newRandomSecret);
};
function newRandomSecret2Fn(selector){
  PassPhraseGenerator2.generatePassPhrase();
  var newRandomSecret = PassPhraseGenerator2.passPhrase;
  $("#"+selector).val(newRandomSecret);
};
$("#newWalletForm").submit(function(event){
  $("#newWalletQRCode").empty();
  event.preventDefault();
  var formData = $(this).serializeArray();
  var publicKey = NRS.getPublicKey(converters.stringToHexString(formData[0].value)) ;
  var walletRS  = NRS.getAccountIdFromPublicKey(publicKey, true);
  $("#requestCC14Wallet").val(walletRS);
  $("#requestCC14WalletPubKey").val(publicKey);
  $("#newWalletResultWallet").val(walletRS);
  $("#newWalletResultPubKey").val(publicKey);
  $("#newWalletResultPassphrase").val(formData[0].value);
  genQRCodeFn(walletRS, "../images/logo-cc14-qr.png", "newWalletQRCode", "#0C8918");
  genQRCodeFn(publicKey, "../images/logo-cc14-qr.png", "newWalletQRCode", "#ffa500");
  genQRCodeFn(formData[0].value, "../images/logo-cc14-qr.png", "newWalletQRCode", "#177CB0");
  $("#newWalletResponse").removeClass("d-none");
});

//Request CC14 Token ------------------------------------------------------start
$("#requestCC14Form").submit(function(event){
  $("#requestCC14Response").removeClass("d-none");
  event.preventDefault();
  var formData = $(this).serializeArray();
  console.log(formData);
  localStorage.setItem("chatWalletRS",formData[0].value.trim());
  localStorage.setItem("chatWalletPK",formData[1].value.trim());
  localStorage.setItem("chatWalletPW",formData[2].value());
  var requestCC14 = [
    {name:"account",value: formData[0].value.trim()},
    {name:"publicKey",value: formData[1].value.trim()},
  ];
  $.ajax({
    type:"POST",
    url: "../requestUtilityToken.php",
    data: requestCC14,
    success:function(response){
      var responseObj  = JSON.parse(response);
      console.log(responseObj);
      if(responseObj.request =="incorrectAccount"){
        $("#requestCC14incorrect").removeClass("d-none");
      }else if(responseObj.request =="unconfirmedTX"){
        $("#requestCC14unconfirmedTX").removeClass("d-none");
      }else if(responseObj.request =="exceed"){
        $("#requestCC14exceed").removeClass("d-none");
      }else{
        $("#requestCC14approved").removeClass("d-none");
        $("#requestCC14JSON").html("<h6>sendMoney</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      };
    }
  });
});

$("#qrCodeForm").submit(function(event){
  event.preventDefault();
  $("#dispQRCode").empty();
  var formData = $(this).serializeArray();
  genQRCodeFn(formData[0].value, "../images/logo-cc14-qr.png", "dispQRCode", "#0C8918");
});

//Account Balance ---------------------------------------------------------start
$("#getAccountBalancesForm").submit(function(event){
  event.preventDefault();
  $("#getAccountAssetsResultTbl tbody").empty();
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
      var length = responseObj.accountAssets.length;
        for(i=0; i<length; i++){
          var decimals = responseObj.accountAssets[i].decimals;
          var quantity = responseObj.accountAssets[i].quantityQNT/Math.pow(10,decimals);
          var qty      = quantity.toFixed(decimals);
          var index = i+1;
          var tokenID  =responseObj.accountAssets[i].asset;
          var tableRow = "<tr><td>"+index+
                         "</td><td><button type='button' class='btn btn-outline-dark border-0' onclick='displayTokenFn(&quot;"+tokenID+"&quot;)'>"+tokenID+"</button>"+
                         "</td><td>"+qty+
                         "</td><td>"+decimals+
                         "</td><td>"+responseObj.accountAssets[i].name+
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
        $("#getAccountBalancesResult").html(responseObj.balanceNQT/100000000);
        $("#getAccountBalancesJSON").append("<h6>getAccountBalances</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
  });
    $("#getAccountBalancesResponse").removeClass("d-none");
});

// Assets By Issuer -------------------------------------------------------start
$("#getAssetsByIssuerForm").submit(function(event){
  event.preventDefault();
  $("#getAssetsByIssuerResultTbl tbody").empty();
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
        var decimals     = newArrayObj[i].decimals;
        var quantityIni  = newArrayObj[i].initialQuantityQNT/Math.pow(10,decimals);
        var qtyIni       = quantityIni.toFixed(decimals);
        var quantityNow  = newArrayObj[i].quantityQNT/Math.pow(10,decimals);
        var qtyNow       = quantityNow.toFixed(decimals);
        var transactionID= newArrayObj[i].asset;
        var index        = i+1;
        var tableRow     = "<tr><td>"+index+
                           // "</td><td>"+newArrayObj[i].asset+
                           "</td><td><button type='button' class='btn btn-outline-dark border-0' onclick='displayTokenFn(&quot;"+transactionID+"&quot;)'>"+transactionID+"</button>"+
                           "</td><td>"+qtyIni+
                           "</td><td>"+qtyNow+
                           "</td><td>"+decimals+
                           "</td><td>"+newArrayObj[i].name+
                           "</td><td>"+newArrayObj[i].description+
                           "</td><td>"+newArrayObj[i].numberOfAccounts+
                           "</td><td>"+newArrayObj[i].numberOfTransfers;
        $("#getAssetsByIssuerResultTbl tbody").append(tableRow);
      };
      $("#getAssetsByIssuerJSON").after("<h6>getAssetsByIssuer</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  $("#getAssetsByIssuerResponse").removeClass("d-none");
});

// sent message prepare=========================================================
$("#sendMessageForm").submit(function(event){
  event.preventDefault();
  var formData= $(this).serializeArray();
  var encryptTo = [
    {name:"requestType",            value:"encryptTo"},
    {name:"messageToEncryptIsText", value: "true"},
    {name:"messageToEncrypt",       value: formData[0].value},
    {name:"recipient",              value: formData[1].value},
    {name:"secretPhrase",           value: formData[2].value}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data: encryptTo,
    success:function(response){
      var responseObj=JSON.parse(response);
      $("#sendMessageResultRecipientRS").html(formData[1].value);
      $("#sendMessageResultData").val(responseObj.data);
      $("#sendMessageResultNonce").val(responseObj.nonce);
      var sendMessageData = [
        {name:"requestType",                value: "sendMessage"},
        {name:"broadcast",                  value: "true"},
        {name:"feeNQT",                     value: "0"},
        {name:"deadline",                   value: "60"},
        {name:"encryptedMessageData",       value: responseObj.data},
        {name:"encryptedMessageNonce",      value: responseObj.nonce},
        {name:"encryptedMessageIsPrunable", value: "true"},
        {name:"recipient",                  value: formData[1].value},
        {name:"secretPhrase",               value: formData[2].value}
      ];
      $.ajax({
        type:"POST",
        url: apiNodeURL,
        data:sendMessageData,
        success:function(response){
          var responseObj=JSON.parse(response);
          $("#sendMessageJSON").after("<h6>sendMessage</h6><textarea class='form-control border border-info' rows='12'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
          if(responseObj.errorDescription == "Unknown account"){
            $("#sendMessageResultUnknown").removeClass("d-none");
          }else if(responseObj.errorDescription == "Not enough funds"){
            var publicKey = NRS.getPublicKey(converters.stringToHexString(formData[2].value)) ;
            var walletRS  = NRS.getAccountIdFromPublicKey(publicKey, true);
            $("#sendMessageResultNoFunds").removeClass("d-none");
            $("#sendMessageResultSenderRS").html(walletRS);
          }else{
            var transactionHash = responseObj.transactionJSON.fullHash;
            $("#sendMessageResult").removeClass("d-none");
            $("#sendMessageResultSenderRS").html(responseObj.transactionJSON.senderRS);
            $("#sendMessageResultFullhash").html("<button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTransactionFn(&quot;"+transactionHash+"&quot;)'>"+transactionHash+"</button>");
            $("#sendMessageResultFee").html(responseObj.transactionJSON.feeNQT/100000000 + " CC14 token");
          };
        }
      });

    }
  });
  $("#sentMessageResponse").removeClass("d-none");
});

// list incoming message =======================================================
$("#readMessageForm").submit(function(event){
  event.preventDefault();
  $("#readMessageTable tbody").empty();
  $("#readMessageResponse").removeClass("d-none");
  var formData= $(this).serializeArray();
  console.log(formData);
  $("#sendMessageTbl-recipientRS").html(formData[1].value);
  if(formData[2].value >90){
    var timestamp = 0;
    var retrieve  = "true";
  }else{
    var timestamp = Math.floor(Date.now()/1000) - epochBeginning - 24*60*60*formData[2].value;
    var retrieve  = "false";
  };
  var getBlockchainTransactions = [
    {name:"requestType", value: "getBlockchainTransactions"},
    {name:"type",        value: "1"},
    {name:"subtype",     value: "0"},
    {name:"account",     value: formData[0].value},
    {name:"timestamp",   value: timestamp},
    {name:"retrieve",    value: retrieve}
  ];
  console.log(getBlockchainTransactions);
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data: getBlockchainTransactions,
    success:function(response){
      var responseObj=JSON.parse(response);
      for (i=0; i<responseObj.transactions.length; i++){
        var senderRS = responseObj.transactions[i].senderRS;
        var transactionID = responseObj.transactions[i].transaction;
        if(formData[1].value == ""){
          var senderRS              = responseObj.transactions[i].senderRS;
          var recipientRS           = responseObj.transactions[i].recipientRS;
          var transactionID         = responseObj.transactions[i].transaction;
          var fullHash              = responseObj.transactions[i].fullHash;
          console.log(fullHash);
          var sendTime              = timestampToLocalFn(responseObj.transactions[i].timestamp);
          if("message" in responseObj.transactions[i].attachment){
            var incomingMessage = "<tr><td >"+responseObj.transactions[i].attachment.message+"</td><td><button type='button' class='btn btn-outline-secondary btn-sm' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>Transaction</button></td><td>"+sendTime[0]+"<br>"+sendTime[1]+"</td><td>"+senderRS+"</td><td>"+recipientRS+"</td></tr>";
          }else{
            var encryptedMessageData  = responseObj.transactions[i].attachment.encryptedMessage.data;
            var encryptedMessageNonce = responseObj.transactions[i].attachment.encryptedMessage.nonce;
            var incomingMessage = "<tr><td>(data) "+encryptedMessageData+"<br>(nonce) "+encryptedMessageNonce+"</td><td><button type='button' class='btn btn-outline-secondary btn-sm' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>Transaction</button></td><td>"+sendTime[0]+"<br>"+sendTime[1]+"</td><td>"+senderRS+"</td><td>"+recipientRS+"</td></tr>";
          };
          $("#readMessageTable tbody").append(incomingMessage);
        }else{
          var decryptMessageData = [
            {name:"sender",      value: responseObj.transactions[i].senderRS},
            {name:"recipient",   value: responseObj.transactions[i].recipientRS},
            {name:"timestamp",   value: responseObj.transactions[i].timestamp},
            {name:"requestType", value: "readMessage"},
            {name:"transaction", value: responseObj.transactions[i].fullHash},
            {name:"secretPhrase",value: formData[1].value},
          ];
            decryptMessageFn(decryptMessageData);
            $("#readMessageJSON").after("<h6>getBlockchainTransactions (type:1, subtype:0)</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
        };
      };
    }
  });
});

//decrypt messageToEncrypt -----------------------------------------------------
function decryptMessageFn(array){
  var apiCallData = array.slice(3);
  apiCallData[1].value = NRS.fullHashToId(array[4].value);
  console.log(apiCallData);
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data: apiCallData,
    success:function(response){
      var responseObj=JSON.parse(response);
      var sendTime = timestampToLocalFn(array[2].value);
      if("message" in responseObj){
        var incomingMessage = "<tr><td >"+responseObj.message+"</td><td><button type='button' class='btn btn-outline-secondary btn-sm' onclick='displayTransactionFn(&quot;"+apiCallData[1].value+"&quot;)'>Transaction</button></td><td>"+sendTime[0]+"<br>"+sendTime[1]+"</td><td>"+array[0].value+"</td><td>"+array[1].value+"</td></tr>";
      }else{
        var incomingMessage = "<tr><td >"+responseObj.decryptedMessage+"</td><td><button type='button' class='btn btn-outline-secondary btn-sm' onclick='displayTransactionFn(&quot;"+apiCallData[1].value+"&quot;)'>Transaction</button></td><td>"+sendTime[0]+"<br>"+sendTime[1]+"</td><td>"+array[0].value+"</td><td>"+array[1].value+"</td></tr>";
      };
      $("#readMessageTable tbody").append(incomingMessage);
      $("#readMessageJSON").after("<h6>readMessage</h6><textarea class='form-control border border-info' rows='5'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
};


//##############################################################################
//#                                                                            #
//#                           for cryptoEvidence.html                          #
//#                                                                            #
//##############################################################################

//tokenize fielToken into NFT ---------------------------------------------start
$("#tokenizeForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var apiCallData  = [
    {name:"requestType",      value:"issueAsset"},
    {name:"name",             value:formData[0].value},
    {name:"description",      value:formData[1].value},
    {name:"quantityQNT",      value:"1"},
    {name:"decimals",         value:"0"},
    {name:"secretPhrase",     value:formData[4].value},
    {name:"feeNQT",           value:"0"},
    {name:"deadline",         value:"60"},
    {name:"broadcast",        value:"false"},
    {name:"message",          value:'License type: '+formData[3].value +"<br>File detail:  " +formData[2].value}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data: apiCallData,
    success:function(response){
      var responseObj = JSON.parse(response);
      if ("errorDescription" in responseObj){
        $("#tokenizeSummary").removeClass("d-none");
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
        $("#tokenizeTblAccountRS").html(senderRS);
        $("#tokenizeTblTime").html(localTime[0] + "," + localTime[1]);
        $("#tokenizeTblAssetID").html(assetID);
        $("#tokenizeTblFee").html(feeCC14);
        $("#tokenizeTblFullHash").html("<button type='button' class='btn btn-outline-secondary btn-sm' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>");
        $("#tokenizeTblFielToken").html(fielToken);
        $("#tokenizeTblFile").html(message);
        $("#tokenizeBroadcastTransactionBytes").val(transactionBytes);
      }
      $("#tokenizeDisplay").removeClass("d-none");
      $("#tokenizeJSON").html("<h6>issueAsset</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

//decode fielToken --------------------------------------------------------start
function decodeFileTokenFn(formData){
  var decFileTokenXhr = new XMLHttpRequest();
  var formDataMod = new FormData(formData);
  decFileTokenXhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var decFileTokenXhrObj=JSON.parse(decFileTokenXhr.responseText);
      var input = document.querySelector('#decFileTokenFormFile');
      var timestamp = decFileTokenXhrObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      var file = input.files[0];
      var fileName = file.name;
      var lastModified=timestampToLocalFn(file.lastModified/1000-epochBeginning);
      var fileSize = returnFileSizeFn(file.size);
      var fileDetail = fileName+", "+fileSize+", "+lastModified[0]+" "+lastModified[1];
      if (decFileTokenXhrObj.valid == true){
        $("#decFileTokenPassed").removeClass("d-none");
      }else {
        $("#decFileTokenFailed").removeClass("d-none");
      };
      $("#decFileTokenResponse").removeClass("d-none");
      $("#decFileTokenTbl-generator").html(decFileTokenXhrObj.accountRS);
      $("#decFileTokenTbl-time").html(localTime[0] + " ; " +localTime[1]);
      $("#decFileTokenTbl-file").html(fileDetail);
      $("#decFileTokenJSON").html("<h6>decodeFileToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(decFileTokenXhrObj,undefined, 4)+"</textarea>");
    }
  };
  decFileTokenXhr.open("POST",apiNodeURL, true);
  decFileTokenXhr.send(formDataMod);
  return false;
};

//generate fielToken and prepare NFT --------------------------------------start
function genFileTokenFn(formData){
  var genFileTokenXhr = new XMLHttpRequest();
  var formDataMod = new FormData(formData);
  // console.log(formDataMod);
  genFileTokenXhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var genFileTokenXhrObj=JSON.parse(genFileTokenXhr.responseText);
      var input = document.querySelector('#genFileTokenFormFile');
      // console.log(input);
      if (input.files[0]){
        var file = input.files[0];
        // console.log(file);
        var fileName = file.name;
        var lastModified=timestampToLocalFn(file.lastModified/1000-epochBeginning);
        var fileSize = returnFileSizeFn(file.size);
      };
      var secEpoch = Math.floor( Date.now() / 1000 );
      var txtFileName =fileName+'_'+secEpoch+'.txt';
      var timestamp = genFileTokenXhrObj.timestamp;
      var secEpoch = epochBeginning + timestamp;
      var txtFileName =fileName+'_'+secEpoch+'.txt';
      var localTime = timestampToLocalFn(timestamp);
      var fileDetail = fileName+", "+fileSize+", "+lastModified[0]+" "+lastModified[1];
      $("#genFileTokenDisplay").removeClass("d-none");
      $("#genFileTokenTime").html(localTime[0] + " ; " + localTime[1]);
      $("#genFileTokenAccountRS").html(genFileTokenXhrObj.accountRS);
      $("#genFileTokenFile").html(fileDetail);
      $("#genFileTokenHash").html(genFileTokenXhrObj.token);
      $("#save2txt").attr("download",txtFileName);
      $("#decFileTokenFormToken").val(genFileTokenXhrObj.token);
      $("#tokenizeFormDescription").val(genFileTokenXhrObj.token);
      $("#tokenizeFormMessage").val(fileDetail);
      $("#genFileTokenJSON").html("<h6>generateFileToken</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(genFileTokenXhrObj,undefined, 4)+"</textarea>");
      $("#save2txt").click(function(){
        this.href = "data:text/plain;charset=UTF-8,"  + encodeURIComponent(genFileTokenXhrObj.token);
      });
    }
  };
  genFileTokenXhr.open("POST",apiNodeURL, true);
  genFileTokenXhr.send(formDataMod);
  return false;
};

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
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      $("#genTokenTime").html(localTime[0] + " ; " + localTime[1]);
      $("#genTokenAccountRS").html(responseObj.accountRS);
      $("#genTokenToken").html(responseObj.token);
      $("#evidenceJSONBtn").removeClass("collapsed");
      $("#evidenceJSONPanel").addClass("show");
      $("#genTokenDisplay").removeClass("d-none");
      $("#decTokenFormWebsite").val(formData[1].value);
      $("#decTokenFormToken").val(responseObj.token);
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
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      if (responseObj.valid == true){
        $("#decTokenPassed").removeClass("d-none");
      }else {
        $("#decTokenFailed").removeClass("d-none");
      };
      $("#decTokenDisplay").removeClass("d-none");
      $("#decTokenTime").html(localTime[0] + " ; " + localTime[1]);
      $("#decTokenAccountRS").html(responseObj.accountRS);
      $("#decTokenJSON").html("<h6>decodeToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
});

//Wallet information validation tool---------------------------------------start
$("#validateWalletInfoForm").submit(function(event){
  event.preventDefault();
  var formData = $(this).serializeArray();
  var walletInformationObj = JSON.parse(formData[0].value);
  var walletInfoStr=JSON.stringify(walletInformationObj.walletInfo);
  var validationCodeStr = walletInformationObj.validationCode;
  var decodeTokenData  = [
    {name:"requestType",      value:"decodeToken"},
    {name:"website",          value:walletInfoStr},
    {name:"token",            value:validationCodeStr},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:decodeTokenData,
    success:function(response){
      var responseObj = JSON.parse(response);
      var timestamp = responseObj.timestamp;
      var localTime = timestampToLocalFn(timestamp);
      var validatorGoogleSearchUrl = "https://www.google.com/search?q=" + responseObj.accountRS;
      if (responseObj.valid == true){
        $("#validateWalletInfoPassed").removeClass("d-none");
      }else {
        $("#validateWalletInfoFailed").removeClass("d-none");
      };
      $("#validateWalletInfoResponse").removeClass("d-none");
      $("#validationCodeTime").html(localTime[0] + " ; " + localTime[1]);
      $("#validationCodeAccountRS").html(responseObj.accountRS);
      $("#validatorGoogleSearchUrl").attr("href", validatorGoogleSearchUrl);
      $("#validateWalletInfoJSON").html("<h6>decodeToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
    }
  });
  var passphraseStr = formData[1].value;
  if(passphraseStr.length > 1){
    var generateTokenData  = [
      {name:"requestType",      value:"generateToken"},
      {name:"website",          value:walletInfoStr},
      {name:"secretPhrase",     value:passphraseStr},
    ];
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
        $("#newValidationTime").html( localTime[0] + " ; " + localTime[1] );
        $("#newValidationAccountRS").html(responseObj.accountRS);
        $("#newValidationToken").val(responseObj.token);
        $("#validateWalletInfoNewTokenJSON").html("<h6>generateToken</h6><textarea class='form-control border border-info' rows='6'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
      }
    });
  }
});

//tokenize fiel into NFT ---------------------------------------------start
$("#fileNFTForm").submit(function(event){
  event.preventDefault();
  $("#fileNFTResponse").removeClass("d-none");
  var formData     = $(this).serializeArray();
  // console.log(formData);
  var input        = document.querySelector('#fileNFTFormFile');
  var file         = input.files[0];
  var fileName     = file.name;
  var fileSize     = file.size;
  var reader    = new FileReader();
  reader.onload = function (f) {
    var file    = this.result;
    var fileWordArray    = CryptoJS.lib.WordArray.create(file);
    var fileHash         = CryptoJS.SHA1(fileWordArray);
    var fileHashStr      = fileHash.toString();
    var description      = '{"name":"'+fileName+'","size":"'+fileSize+'","lic":"'+formData[1].value+'","algo":"SHA1","hash":"'+fileHashStr+'"}';
    // console.log(description);
    if(formData[0].value.match(/^[0-9a-zA-Z]+$/)){
      var issueAssetFnData = [
        {name:"quantityQNT", value: "1"},
        {name:"decimals",    value: "0"},
        {name:"name",        value: formData[0].value},
        {name:"description", value: description},
        {name:"message",     value: formData[2].value},
        {name:"secretPhrase",value: formData[3].value},
        {name:"selector",    value: "fileNFT"},
      ];
      issueAssetFn(issueAssetFnData);
    }else {
      $("#fileNFTName").val(formData[0].value + " <- 命名错误，仅接受3到10个英文字母或数字");
    };
  };
  reader.readAsArrayBuffer(file);
});

//validate fiel into NFT ---------------------------------------------start
$("#fileNFTValidateForm").submit(function(event){
  event.preventDefault();
  $("#fileNFTValidateResponse").removeClass("d-none");
  var formData     = $(this).serializeArray();
  var input        = document.querySelector('#fileNFTValidateFormFile');
  var file         = input.files[0];
  var fileName     = file.name;
  var fileSize     = file.size;
  var reader    = new FileReader();
  reader.onload = function (f) {
    var file    = this.result;
    var fileWordArray    = CryptoJS.lib.WordArray.create(file);
    var fileHash         = CryptoJS.SHA1(fileWordArray);
    var fileHashStr      = fileHash.toString();
    $("#fileToValidateFileName").html(fileName);
    $("#fileToValidateFileSize").html(fileSize+"B ("+returnFileSizeFn(fileSize)+")");
    $("#fileToValidateFileHash").html(fileHashStr);
    var apiCallData = [
      {name:"requestType", value: "getTransaction"},
      {name:"transaction", value: formData[0].value},
    ];
    // console.log(apiCallData);
    $.ajax({
      type:"POST",
      url: apiNodeURL,
      data:apiCallData,
      success:function(response){
        var responseObj = JSON.parse(response);
        // console.log(responseObj);
        $("#fileNFTValidateJSON").append("<h6>getTransaction</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
        if(responseObj.errorDescription == "Unknown transaction"){
          $("#fileNFTValidateUnknown").removeClass("d-none");
        }else {
          var fullHash = responseObj.fullHash;
          var descriptionObj = JSON.parse(responseObj.attachment.description);
          var tokenID = responseObj.transaction;
          var license  = descriptionObj.lic;
          if(fileHashStr == descriptionObj.hash){
            $("#fileNFTValidatePassed").removeClass("d-none");
          }else {
            $("#fileNFTValidateFailed").removeClass("d-none");
          };
          $("#fileNFTValidateResultAccountRS").html(responseObj.senderRS);
          $("#fileNFTValidateResultName").html(responseObj.attachment.name);
          $("#fileNFTValidateResultTokenID").html("<button type='button' class='btn btn-outline-dark border-0' onclick='displayTokenFn(&quot;"+tokenID+"&quot;)'>"+tokenID+"</button>");
          $("#fileNFTValidateResultFileName").html(descriptionObj.name);
          $("#fileNFTValidateResultFileSize").html(descriptionObj.size +" B ("+returnFileSizeFn(descriptionObj.size)+")");
          $("#licenseList").val(license).change();
          $("#fileNFTValidateResultAlgo").html(descriptionObj.algo);
          $("#fileNFTValidateResultFileHash").html(descriptionObj.hash);
          $("#fileNFTValidateResultFullHash").html("<button type='button' class='btn btn-outline-dark border-0' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>");
        };
      }
    });
  };
  reader.readAsArrayBuffer(file);
});


//##############################################################################
//#                                                                            #
//#                              for search.html                               #
//#                                                                            #
//##############################################################################
//all-in-on title token search tool ---------------------------------------start
$("#getAssetInfoAll").submit(function(event){
  event.preventDefault();
  var formData= $(this).serializeArray();
  var idInputed = formData[0].value.trim();
  // console.log(idInputed);
  if(idInputed.length > 22){
    var assetID=NRS.fullHashToId(idInputed);
    console.log(assetID);
  }else{
    var assetID= idInputed;
  };
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
            $("#titleSearch-Q3-resultYes").removeClass('d-none');
          }else{
            $("#advisoryA3").removeClass("d-none");
            $("#modalBlockContainer").addClass("d-none");
            $("#titleSearch-Q3-resultNo").removeClass('d-none');
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
        if(getAssetObj.description=="NFTID"||getAssetObj.description.slice(0,5)=="NFTID"){
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
    var image1  = "../data/products/"+barcode+"-1.jpg";
    var image2  = "../data/products/"+barcode+"-2.jpg";
    var image3  = "../data/products/"+barcode+"-3.jpg";
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
      var chatTokenID  = myAssetBookObj[n].chatTokenID;
      var coverage    = myAssetBookObj[n].coverage;
      $("#assetInforTbl-model").html(brand + " <a  href='"+productUrl+"'> "+model+"</a>");
      $("#assetInforTbl-barcode").html(barcode);
      $("#assetInforTbl-description").html(description);
      $("#assetInforTbl-unit").html(unit);
      $("#assetInforTbl-madeIn").html(madeIn);
      $("#assetInforTbl-goodFor").html(coverage);
      $("#titleSearchBBS").attr("onclick", "bulletinBoardFn2('"+chatTokenID+"')");
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
            var setter = "Unknown wallet";
            var jobFunction = "Unknown job title. <a href='utilities.html'>contact setter</a>";
          };
          var index = k+1;
          var displayTbl='<table class="table word-break table-bordered table-sm fs-6 border-info caption-top">'+
                    '<caption>Additional Information ' + index +' / '+i+' </caption>'+
                    '<tr><td class="td-1">Name</td><td class="td-2">' + setter +'</td></tr>'+
                    '<tr><td class="td-1">Wallet</td><td class="td-2">' + setterRS +'</td></tr>'+
                    '<tr><td class="td-1">Job Title</td><td class="td-2">' + jobFunction +'</td></tr>'+
                    '<tr><td class="td-1">Information</td><td class="td-2">' + property + ' : ' + value +'</td></tr></table>';
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
          $("#titleSearch-Q2-resultYes").removeClass('d-none');
        }else{
          $("#titleSearch-Q2-resultNo").removeClass('d-none');
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
        $("#transactionZero-date").html(issuanceTimes[0]+" ; "+ issuanceTimes[1]);
        $("#titleSearch-Q1-resultYes").removeClass('d-none');

      }else{
        $("#titleSearch-Q1-resultNo").removeClass('d-none');
        $("#titleSearch-Q2-resultNA").removeClass('d-none');
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
          var entityName  = "Unknown wallet. Please use <a href='evidence.html' target='_blank'>【Message Token】</a> to proof wallet ownership. ";
          var jobFunction = "Unknown job title. Contact <a href='utilities.html'> token owner</a> .";
        };
        var index       = k+1;
        displayTbl='<table class="table word-break table-bordered table-sm fs-6 border-info caption-top">'+
                  '<caption>Current Owner ' + index +' / '+numberOfAccounts+' </caption>'+
                  '<tr><td class="td-1">Owner</td><td class="td-2">' + entityName +'</td></tr>'+
                  '<tr><td class="td-1">Wallet</td><td class="td-2">' + accountRS +'</td></tr>'+
                  '<tr><td class="td-1">Job Title</td><td class="td-2">' + jobFunction +'</td></tr>'+
                  '<tr><td class="td-1">Qty owned</td><td class="td-2">' + quantity.toFixed(decimals) + '  (quantityQNT: '+quantityQNT+' , decimals: '+decimals+' )'+'</td></tr></table>';
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
        var senderRS      = assetTransferObj.transfers[i].senderRS;
        var recipientRS   = assetTransferObj.transfers[i].recipientRS;
        var quantityQNT   = assetTransferObj.transfers[i].quantityQNT;
        var decimals      = assetTransferObj.transfers[i].decimals;
        var timestamp     = assetTransferObj.transfers[i].timestamp;
        var assetTransfer = assetTransferObj.transfers[i].assetTransfer;
        var factor    = Math.pow(10, decimals);
        var qty       = quantityQNT/factor;
        var localTime = timestampToLocalFn(timestamp);
        //display sender information based on myAddressBook.js----------------
        var m = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(senderRS);
        if (m < 0){
          var senderName       = "Unknown wallet)";
          var senderAssignment = "Unknown job title. Contact <a href='utilities.html'> wallet owner</a>";
        }else{
          var senderName       = myAddressBookObj[m].walletInfo.entityName;
          var senderAssignment = myAddressBookObj[m].walletInfo.walletAssignment;
        };

        //display recipient information based on myAddressBook.js-------------
        var n = myAddressBookObj.map(function(e){return e.walletInfo.accountRS;}).indexOf(recipientRS);
        if (n < 0){
          var recipientName       = "Unknown wallet";
          var recipientAssignment = "Unknown job title. Contact <a href='utilities.html'> wallet owner</a>";
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

        displayTbl='<button type="button" class="btn btn-sm btn-outline-dark border-0" onclick="displayTransactionFn(&apos;'+assetTransfer+'&apos;)"><h5>Transaction '+ index +' / '+length+'</h5></button><br>'+
                   '<table class="table word-break  border-info table-sm fs-6 table-bordered caption-top">'+
                     '<caption>Quantity transfered: ' + qty.toFixed(decimals) + '  &#128337; ' + localTime[0] +' ; '+ localTime[1]+ '</caption>'+
                     '<tr><td class="td-3">&#128228; Sender</td><td class="td-2">' +senderName +  '</td></tr>'+
                     '<tr><td class="td-3">Wallet</td><td class="td-2">' + senderRS +'</td></tr>'+
                     '<tr><td class="td-3">Job Title</td><td class="td-2">' + senderAssignment +'</td></tr>'+
                     '<tr><td class="td-3">&#128229;Recipient</td><td class="td-2">' + recipientName +'</td></tr>'+
                     '<tr><td class="td-3">Wallet</td><td class="td-2">' + recipientRS +'</td></tr>'+
                     '<tr><td class="td-3">Job Title</td><td class="td-2">' + recipientAssignment +'</td></tr>'+
                   '</table>';
        $("#assetIssuerTbl").before(displayTbl);
      };
      if(answersQ4 > 0){
        $("#titleSearch-Q4-resultYes").removeClass('d-none');
        $("#assetInforTbl-activateDate").html(localTime[0] +" ; " + localTime[1] + " . "+localTime[2]+" days");
      }else{
        $("#titleSearch-Q4-resultNo").removeClass('d-none');
        $("#advisoryA4").removeClass("d-none");
        $("#modalBlockContainer").addClass("d-none");
      };
      if(answersQ5 > 0){
        $("#titleSearch-Q5-resultNo").removeClass('d-none');
        $("#advisoryA5").removeClass("d-none");
        $("#modalBlockContainer").addClass("d-none");
      }else{
        $("#titleSearch-Q5-resultYes").removeClass('d-none');
      };
      if(answersQ6 > 0){
        $("#titleSearch-Q6-resultYes").removeClass('d-none');
        $("#advisoryA6").removeClass("d-none");
        $("#modalBlockTransfer").addClass("d-none");
      }else{
        $("#titleSearch-Q6-resultNo").removeClass('d-none');
      };
      if(answersQ7 > 0){
        $("#titleSearch-Q7-resultYes").removeClass('d-none');
        $("#advisoryA7").removeClass("d-none");
        $("#modalBlockTransfer").removeClass("d-none");
      }else{
        $("#titleSearch-Q7-resultNo").removeClass('d-none');
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
      console.log(responseObj);
      if (responseObj.validateTitleToken == "failed"){
        alert("解密失败！\n Decryption failed!");
        $("#validateTitlTokeneResultFail").removeClass("d-none");
      }else if (responseObj.validateTitleToken == "mismatch"){
        alert("验证失败! \n Mismatching!");
        $("#validateTitlTokeneResultMismatch").removeClass("d-none");
        $("#validateTitlTokeneResultMismatchDecrypted").html(responseObj.decrypted);
      }else{
        $("#validateTitlTokeneResultPass").removeClass("d-none");
      };
    }
  });
  $("#validateTitleTokeneResponse").removeClass("d-none");
});

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

//create new wallet address------------------------------------------------start
$("#genNewWalletForm").submit(function(event){
  event.preventDefault();
  // console.log("show me");
  PassPhraseGenerator.generatePassPhrase();
  var newRandomSecret = PassPhraseGenerator.passPhrase;
  var publicKey = NRS.getPublicKey(converters.stringToHexString(newRandomSecret)) ;
  var walletRS = NRS.getAccountIdFromPublicKey(publicKey, true);
  localStorage.setItem("mySecretLS", newRandomSecret);
  localStorage.setItem("myPubKeyLS", publicKey);
  localStorage.setItem("myWalletLS", walletRS);
  $("#consumerWallet").val(walletRS);
  $("#consumerPubKey").val(publicKey);
  $("#requestTitlTokeneResponse").removeClass("d-none");
  $("#genNewWalletResult").removeClass("d-none");
  $("#genNewWalletResultWallet").val(walletRS);
  $("#genNewWalletResultPubKey").val(publicKey);
  $("#genNewWalletResultSecret").val(newRandomSecret);
  // genQRCodeFn(walletRS,"../images/logo-cc14-qr.png","genNewWalletQRCode","#0C8918");
  // genQRCodeFn(newRandomSecret,"../images/logo-cc14-qr.png","genNewWalletQRCode","#177CB0");
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
      // console.log(response);
      var responseObj  = JSON.parse(response);
      console.log(responseObj);

      if (responseObj.requestTitleToken == "failed"){
        alert("解密失败！\n Decryption failed!");
        $("#requestTitlTokeneResultFail").removeClass("d-none");
      }else if (responseObj.requestTitleToken == "mismatch"){
        alert("验证失败! \n Mismatching!");
        $("#requestTitlTokeneResultMismatch").removeClass("d-none");
        $("#requestTitlTokeneResultMismatchDecrypted").html(responseObj.decrypted);
      }else{
        // remove below line for real production-------------------------------
        alert('仅做演示, 不做实际转让 \n Demonstration only! \n "broadcasted": '+ responseObj.broadcasted);
        // remove above line for real production-------------------------------
        $("#requestTitlTokeneResultPass").removeClass("d-none");
        $("#requestTitlTokeneResultPassFullHash").html(responseObj.fullHash);
        $("#requestTitlTokeneJSON").append("<h6>transferAsset</h6><textarea class='form-control border border-info' rows='10'>" + JSON.stringify(responseObj,undefined, 4)+"</textarea>");
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

NRS.constants.ACCOUNT_PREFIX = "CC14";
NRS.constants.ACCOUNT_REGEX_STR = "^(ARDOR|NXT)-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}";
NRS.constants.ACCOUNT_RS_MATCH = NRS.getRsAccountRegex("CC14");
NRS.constants.ACCOUNT_NUMERIC_MATCH = NRS.getNumericAccountRegex();
NRS.constants.ACCOUNT_MASK_PREFIX = "CC14" + "-";
