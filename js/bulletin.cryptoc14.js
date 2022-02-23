function bulletinBoardFn(chatTokenID){
  // console.log(chatTokenID);
  if(chatTokenID != undefined){
    // console.log(chatTokenID);
    postFn(chatTokenID);
    chatRoomListFn(chatTokenID);
  }else if(localStorage.getItem("chatTokenID")!= undefined) {
    // console.log(chatTokenID);
    var chatTokenID = localStorage.getItem("chatTokenID");
    postFn(chatTokenID);
  }else {
    // console.log(chatTokenID);
    tabFn("tab2");
  };
};

function bulletinBoardFn2(chatTokenID){
  chatModal.show();
  if(chatTokenID != undefined){
    console.log(chatTokenID);
    localStorage.setItem("chatTokenID",chatTokenID);
    postFn(chatTokenID);
    chatRoomListFn(chatTokenID);

  }else if(localStorage.getItem("chatTokenID")!= undefined) {
    // console.log(chatTokenID);
    var chatTokenID = localStorage.getItem("chatTokenID");
    postFn(chatTokenID);
  }else {
    // console.log(chatTokenID);
    tabFn("tab2");
  };
};

function chatRoomListFn(chatTokenID){
  var getAsset = [
    {name:"requestType", value: "getAsset"},
    {name:"asset",       value: chatTokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAsset,
    success:function(response){
      var responseObj=JSON.parse(response);
      if(responseObj.asset != undefined){
        if(localStorage.getItem("chatTokenIDList") == undefined){
          localStorage.setItem("chatTokenIDList",chatTokenID);
        }else {
          var chatTokenIDlistStr = localStorage.getItem("chatTokenIDList");
          var chatTokenIDlistArr = chatTokenIDlistStr.split(",");
          // console.log(chatTokenIDlistArr);
          if(!chatTokenIDlistArr.includes(chatTokenID)){
            chatTokenIDlistStr += ","+ chatTokenID;
            localStorage.setItem("chatTokenIDList",chatTokenIDlistStr);
            chatRoomListOptionFn();
          }
        };
        if(localStorage.getItem("chatTokenID") == undefined){
          localStorage.setItem("chatTokenID",chatTokenID);
        };
      }
    }
  });
};

function tabFn(selector){
  $("#"+selector).removeClass("d-none");
  if(selector=="tab1"){
    var chatTokenID = localStorage.getItem("chatTokenID");
    postFn(chatTokenID);
    $("#tab1").removeClass("d-none");
    $("#tab2, #tab3").addClass("d-none");
    $("#linktab1").attr("onclick", "postFn('"+chatTokenID+"')");
    $("#linktab1Icon").html("&#x1F503;");
    $("#linktab1").addClass("active");
    $("#linktab2, #linktab3").removeClass("active");
    $("#linktab0, #linktab1, #linktab2, #linktab3").addClass("opacity25");
  }else if(selector=="tab2"){
    $("#tab2").removeClass("d-none");
    $("#tab1, #tab3").addClass("d-none");
    $("#linktab1").attr("onclick", "tabFn('tab1')");
    $("#linktab1Icon").html("&#128204;");
    $("#linktab2").addClass("active");
    $("#linktab1, #linktab3").removeClass("active");
    $("#linktab0, #linktab1, #linktab2, #linktab3").removeClass("opacity25");
  }else {
    $("#tab3").removeClass("d-none");
    $("#tab1, #tab2").addClass("d-none");
    $("#linktab1").attr("onclick", "tabFn('tab1')");
    $("#linktab1Icon").html("&#128204;");
    $("#linktab3").addClass("active");
    $("#linktab1, #linktab2").removeClass("active");
    $("#linktab0, #linktab1, #linktab2, #linktab3").removeClass("opacity25");
  };
};

function strToArrayFn(string){
  var parameter = "|";
  var parameter2 = "§";
  var index     = string.indexOf(parameter2);
  var lastIndex = string.lastIndexOf(parameter2);
  var array=[];
  if(lastIndex > index){
    array[0]=string.substring(0,index);

    array[1]=string.substring(index+1,lastIndex);
    if(lastIndex == string.length-1){
      array[2]="";
    }else {
      array[2]=string.substring(lastIndex+1);
    };
    return array;
  }
};

function chatEnterFn(){
  var chatTokenID = $("#selectedChatID").val();
  console.log(chatTokenID);
  if(chatTokenID== ""){
    $("#chatTokenIDEmpty").removeClass("d-none");
    $("#selectedChatID").val("please enter or select chat token ID");
  }else {
    isChatTokenIDFn(chatTokenID);
  }
};

function chatLoginFn(){
  var chatTokenID = $("#selectedChatID").val();
  var passphrase = $("#chatWalletPassphrase").val();
  console.log(passphrase);
  var publicKey = NRS.getPublicKey(converters.stringToHexString(passphrase)) ;
  var walletRS  = NRS.getAccountIdFromPublicKey(publicKey, true);
  console.log(walletRS);
  $(".chatAccountRS").val(walletRS);
  localStorage.setItem("chatWalletRS",walletRS);
  $(".chatAccountPK").val(publicKey);
  localStorage.setItem("chatWalletPK",publicKey);
  $(".chatAccountPW").val(passphrase);
  localStorage.setItem("chatWalletPW",passphrase);

  if(passphrase == ""){
    $("#chatAccountEmpty").removeClass("d-none");
  }else {
    if(chatTokenID==""){
      $("#chatTokenIDEmpty").removeClass("d-none");
      $("#selectedChatID").val("please enter or select chat token ID");
    }else {
      // isChatTokenIDFn(chatTokenID);
      //check if accountRS found on CC14 blockchain
      var apiCallData =[
        {name:"requestType", value:"getAccount"},
        {name:"account",       value: walletRS}
      ];
      console.log(apiCallData);
      $.ajax({
        type:"POST",
        url: apiNodeURL,
        data:apiCallData,
        success:function(response){
          var responseObj=JSON.parse(response);
          console.log(responseObj);
          if(responseObj.errorDescription == "Unknown account"){
            newChatAccountModal.show();
          };
        }
      });
    };
  };
};

function isChatTokenIDFn(chatTokenID){
  var apiCallData =[
    {name:"requestType", value:"getAsset"},
    {name:"asset",       value: chatTokenID}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:apiCallData,
    success:function(response){
      var responseObj=JSON.parse(response);
      console.log(responseObj);
      if("errorDescription" in responseObj){
        // localStorage.removeItem("chatTokenID");
        $("#chatTokenIDNotFound").removeClass("d-none");
        $("#selectedChatID").val("Chat token ID not found, please enter or select chat token ID");
      }else {
        localStorage.setItem("chatTokenID", chatTokenID);
        tabFn("tab1");
        chatRoomListFn(chatTokenID);
        $(".chatTokenID").val(chatTokenID);
        $("#summaryChatDesc").val(responseObj.description);
        $("#summaryIssuerRS").val(responseObj.accountRS);
      }
    }
  });
};

function postFn(chatTokenID){
  $("#billboard").html("<span id='displayMessage'></span>");
  $("#chatSummary").removeClass("d-none");
  // getAsset, find out the issuer(manager) for the given chatTokenID
  var getAsset =[
    {name:"requestType", value:"getAsset"},
    {name:"asset",       value: chatTokenID}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAsset,
    success:function(getAssetResponse){
      var getAssetResponseObj=JSON.parse(getAssetResponse);
      // console.log(getAssetResponseObj);
      $("#summaryChatDesc").val(getAssetResponseObj.description);
      $("#summaryIssuerRS").val(getAssetResponseObj.accountRS);
      var chatIssuerRS = getAssetResponseObj.accountRS;

      //list all message sent to chatToken issuer(manager)
      var getBlockchainTransactionsData =[
        {name:"chatTokenID", value: chatTokenID},
        {name:"requestType", value:"getBlockchainTransactions"},
        {name:"account",     value: chatIssuerRS},
        {name:"type",        value: "1"},
        {name:"subtype",     value: "0"}
      ]
      postGetBlockchainTransactionsFn(getBlockchainTransactionsData);
    }
  });
};

function postGetBlockchainTransactionsFn(array){
  var chatTokenID = array[0].value;
  var apiCallData = array.slice(1);
    // console.log(apiCallData);
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:apiCallData,
    success:function(response){
      var responseObj=JSON.parse(response);
        // console.log(responseObj);
        for(i=0; i<responseObj.transactions.length;i++){
          if(responseObj.transactions[i].attachment.message != undefined){
            var posterRS    = responseObj.transactions[i].senderRS;
            var messageStr  = responseObj.transactions[i].attachment.message;
            var timestamp   = responseObj.transactions[i].timestamp;
            var fullHash    = responseObj.transactions[i].fullHash;
            var postTime    = timestampToLocalFn(timestamp);
            var messageArr  = strToArrayFn(messageStr);
            var btnDateTime = "<button type='button' class='btn btn-outline-secondary btn-sm border-0' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>&#128197;&nbsp;"+postTime[0]+" "+postTime[1]+"</button>";
            var btnPoster   = "<button type='button' class='btn btn-outline-dark btn-sm border-0 fs-3' onclick='atPosterFn(&quot;"+posterRS+"&quot;)'>&#128125;</button>";
            var classList   = "row mb-3 ";
            if(messageArr==undefined){
              var message = messageStr;
              classList    += "d-none chatTokenIDNotFound";
            } else {
              var extractedID   = messageArr[0];
              var messageNoMark = messageArr[1];
              var extractedLink = messageArr[2];

              var message = messageNoMark;

              if(messageNoMark.indexOf("CC14-")>=0){
  	            var index = messageNoMark.indexOf("CC14-");
                var walletRS1 = messageNoMark.substr(index,25);
                var walletRS2 = localStorage.getItem("chatWalletRS");
                if(messageNoMark.substr(index,25)==localStorage.getItem("chatWalletRS")){
                  // console.log(localStorage.getItem("chatWalletRS"));
                  var message = messageNoMark.substr(0,index)+"<mark>"+messageNoMark.substr(index,26)+"</mark>"+messageNoMark.substr(index+26);
                }
              };

              if(extractedID != chatTokenID){
                classList += "d-none chatTokenIDMismatch";
              }else {
                classList += "chatTokenID";
              };
              if(extractedLink == ""){
                var btnLink = "";
              }else {
                var link = displayAttachmentFn(extractedLink);
                var btnLink = "<button type='button' class='btn btn-outline-secondary btn-sm border-0'>"+link+"</button>";
              }
            };
            if(posterRS == localStorage.getItem("chatWalletRS")){
              var chatMessage ="<div class='"+classList+" justify-content-end'><div class='col-3'></div><div class='col-8 myPost'>"+message+"<br>"+btnDateTime+btnLink+"</div><div class='col-1'></div></div>";
            }else {
              var chatMessage ="<div class='"+classList+" justify-content-start'><div class='col-1 fs-3'>"+btnPoster+"</div><div class='col-8 notMyPost'>"+message+"<br>"+btnDateTime+btnLink+"</div><div class='col-3'></div></div>";
            };
            $("#displayMessage").after(chatMessage);
          }
        };
        setTimeout(function() {
          jumpToFn('autoJump');
        }, 500);

      }
  });
};

function jumpToFn(selector){
  var elmnt = document.getElementById(selector);
  elmnt.scrollIntoView(true);
};

function displayAttachmentFn(string){
  if(string.substr(0,4)=="http"){
    var link = "<a href='"+string+"' target='_blank'>&nbsp;&#128206;</a>";
  }else {
    var link = "<a class='text-decoration-none' href='https://gateway.ipfs.io/ipfs/"+string+"' target='_blank'>&nbsp;&#128206;</a>";
  };
  return link;
};

function atPosterFn(poster){
  var curPos = document.getElementById("chatMessageTextarea").selectionStart;
  console.log(curPos);
  var entered = $("#chatMessageTextarea").val();

  $("#chatMessageTextarea").val(entered.slice(0, curPos) +" @"+poster+" "+entered.slice(curPos));
};

// Emoji icons
$("#emojiTbl td").click(function(){
	var clicked = $(this).html();
  var curPos = document.getElementById("chatMessageTextarea").selectionStart;
  var entered = $("#chatMessageTextarea").val();
  $("#chatMessageTextarea").val(entered.slice(0, curPos) +" "+clicked+" "+entered.slice(curPos));
});

$("#postMessageForm").submit(function(event){
  event.preventDefault();
  var formData= $(this).serializeArray();
  console.log(formData);
  var chatTokenID     = localStorage.getItem("chatTokenID");
  var posterRS   = localStorage.getItem("chatWalletRS");
  var passphrase = localStorage.getItem("chatWalletPW");
  var getAsset = [
    {name:"requestType", value: "getAsset"},
    {name:"asset",       value: chatTokenID},
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:getAsset,
    success:function(response){
      var responseObj=JSON.parse(response);
      // console.log(responseObj);
      var chatManagerRS = responseObj.accountRS;
      var message    = chatTokenID+"§"+formData[0].value+"§"+formData[1].value;
      console.log(message);
      var sendMessageData = [
        {name:"requestType",       value: "sendMessage"},
        {name:"feeNQT",            value: "0"},
        {name:"deadline",          value: "60"},
        {name:"message",           value: message},
        {name:"messageIsText",     value: "true"},
        {name:"messageIsPrunable", value: "true"},
        {name:"recipient",         value: chatManagerRS},
        {name:"secretPhrase",      value: passphrase},
        {name:"broadcast",         value: "true"}
      ];
      console.log(sendMessageData);
      $.ajax({
        type:"POST",
        url: apiNodeURL,
        data:sendMessageData,
        success:function(response){
          var responseObj=JSON.parse(response);
          console.log(responseObj);
          var fullHash = responseObj.fullHash;
          $("#chatMessageTextarea").val("Message posted, transaction:\n "+fullHash);

        }
      });
    }
  });
});

$("#issueChatTokenForm").submit(function(event){
  if(localStorage.getItem("chatTokenIDList")==undefined){
    var chatTokenList=localStorage.getItem("chatTokenID");
    console.log(chatTokenList);
  }else {
    var chatTokenList=localStorage.getItem("chatTokenIDList");
    console.log(chatTokenList);
  };
  event.preventDefault();
  var formData= $(this).serializeArray();
  var issueAsset = [
    {name:"requestType", value: "issueAsset"},
    {name:"name",        value: "chatToken"},
    {name:"description", value: formData[0].value},
    {name:"quantityQNT", value: 1},
    {name:"decimals",    value: 0},
    {name:"secretPhrase",value: formData[1].value},
    {name:"feeNQT",      value: 0},
    {name:"deadline",    value: 60},
    {name:"broadcast",   value: true}
  ];
  $.ajax({
    type:"POST",
    url: apiNodeURL,
    data:issueAsset,
    success:function(response){
      var responseObj=JSON.parse(response);
      console.log(responseObj);
      var fullHash    = responseObj.fullHash;
      var tokenID     = NRS.fullHashToId(fullHash);
      var description = responseObj.transactionJSON.attachment.description
      var issuerRS    = responseObj.transactionJSON.senderRS;
      chatTokenList += ","+ tokenID;
      localStorage.setItem("chatTokenIDList",chatTokenList);
      console.log(localStorage.getItem("chatTokenIDList"));
      $("#issueChatTokenFormSummary").removeClass("d-none");
      $("#issueChatTokenFormID").html("<button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTokenFn(&quot;"+tokenID+"&quot;)'>"+tokenID+"</button>");
      $("#issueChatTokenFormDesc").html(description);
      $("#issueChatTokenFormRS").html(issuerRS);
      $("#issueChatTokenFormIDFullhash").html("<button type='button' class='btn btn-outline-dark btn-sm border-0' onclick='displayTransactionFn(&quot;"+fullHash+"&quot;)'>"+fullHash+"</button>");
      $("#chatRoomList0").after("<option value='"+NRS.fullHashToId(responseObj.fullHash)+"'>"+responseObj.transactionJSON.attachment.description+"</option>");
    }
  });
});

function chatRoomListOptionFn(){
  // console.log(localStorage.getItem("chatTokenIDList"));
  if(localStorage.getItem("chatTokenIDList")!=undefined){
    var chatTokenListStr   = localStorage.getItem("chatTokenIDList");
    var chatTokenIDListArr = chatTokenListStr.split(",");
    // console.log(chatTokenIDListArr);
    for(i=0; i<chatTokenIDListArr.length;i++){
      if(chatTokenIDListArr != "3922836936387876787"){
        var getAsset = [
          {name:"requestType", value: "getAsset"},
          {name:"asset",        value: chatTokenIDListArr[i]}
        ];
        // console.log(getAsset);
        $.ajax({
          type:"POST",
          url: apiNodeURL,
          data:getAsset,
          success:function(response){
            var responseObj=JSON.parse(response);
            // console.log(responseObj);
            var chatTokenID = responseObj.asset;
            var description = responseObj.description;
            $("#chatIDLastOnList").after("<option value='"+chatTokenID+"'>"+description+"</option>");
          }
        });
      }
    }
  };
};
