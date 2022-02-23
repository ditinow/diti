//钱包地址、机构名称、现实地址、联系方式、钱包有效期截止日期、钱包级别以及机构职责。
//钱包有效期截止日期之后诞生的权益证明NFT将被视为侵权。
//应用将钱包级别进行权益状态判断。如果需要额外级别对应指定供应链流程请联系CryptoC14。
//walletAssignment: 0-validation, 1-issuance, 2-activation, 3-services, 4-return, 5-authorizedRetailer, 6-dumpster"，
//钱包职责: 0-确认钱包地址专用, 1-授权专用, 2-激活专用, 3-售后服务专用, 4-退货专用, 5-专卖店, 6-垃圾桶"
//钱包地址确认码: use API generateToken on JSON.stringify(myAddressBookObj[x].walletInfo)"

var myAddressBookObj = [
  {
    "walletInfo":{
      "accountRS":"CC14-49CE-CXZZ-3QHW-AH4JK",
      "entityName":"DiTiNOW LLC",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.ditinow.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"validation"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fm2liqts1a8u05t1cb3k64n0rk5epd79oftdnnac4jtiu7vi348e1ma7jgumomgvbe0jcensblcnejk5evr34fm3fe908262co7omm0hc8b35f"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-8P4T-FMJU-BXSK-252LG",
      "entityName":"DiTiNOW LLC",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.ditinow.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"issuance"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fkeliqf4sapeg5aq7vje8738hgqp43gmkmp9tefp1s2mpo87vuhs32sai0vae1nb518cdt78spetljndqe9s889chlgu1ecn76rodchbghnf7q"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-H4L7-CTL7-2KMQ-7TCLW",
      "entityName":"DiTiNOW LLC",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.ditinow.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"activation"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06ff8liqk0tqkmo5g2fn0oiiqvki5pbp99n5qijl9ggeusqolah5dtnug610k544kbgvktk03jkjsinhkhp2ooauugqc05s4k7kb8jsrc004d27r"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-HXAT-86F4-75BR-HWXSG",
      "entityName":"DiTiNOW LLC",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.ditinow.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"services"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fe4liqdto10505h2odu14rgm15874h397mukgskk9s5p9bf277lr4c0s8g72ldcm9vnck4s2d5kk254ade8h9fnk3tijs2a2is3feo23jv9ts4"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-5KKJ-TXML-FKM3-4SLZB",
      "entityName":"Demonstration account: issuance wallet one",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"issuance"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fdcliqsujp9m859a9ggbe0q74ahnt177fuvqk09arssbtm6khc0iu318r0t2co3ov4rp3c64ktfm9tdlcpfng9nb4imerb7n43kcsa0fp0jfmf"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-UEM4-XQBX-HZWW-G2FNW",
      "entityName":"Demonstration account: issuance wallet one",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2021-10-31T23:59:59+00:00",
      "walletAssignment":"issuance"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fcmliqbqd5hs05n53bbpghb4i4l8j88dl0c2fb263ggu6ktqiio1g606kgi3r9svqs9q5a3d5dkc7al09p2q4jjv4o3dko80l9vb8u7nrcclqj"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-F4Z6-3E9T-EXSK-HPYWH",
      "entityName":"Demonstration account: product activation wallet one",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"activation"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fbsliqic8tpb859n7luveasc0ng2hf66ptdfhkt5kaf8fennf40kog5gbggtokvvdam0s1nkf08ga87oqmj0ifr00olqjg8vnshjf6229setlo"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-DUPL-QDTD-ZGDJ-7YJTW",
      "entityName":"Demonstration account: product activation wallet two",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"activation"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fb8liqn151sk05ek8ak2i6g39eeqp8dn11qigp4p6rprv6i86jl5icms50ktccpqp9afu1hpea4mh3jf7qkegr0a7qg7na8159bqpqqjm1u3io"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-6LFR-HCTG-F2LR-87ZB4",
      "entityName":"Demonstration account: services",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"services"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06fa6liqhbhbts05m71mo5mhd2mikgqo5nmu29p0ev44m5p0cpi7465ll8902050953b1dp9vi2722990hv4770ul2g3d3p13i87if82kauuvfp4"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-CWWS-4MHT-ZKHY-DGUYC",
      "entityName":"Demonstration account: return",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"return"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06f70liqj1rsoq05rb36lmr0skuknpdjlt4q16kk03umdrbljhrdema1a4u0brh5k9mbqfg7adgrrv8ddhuv4lv46oq59skg0kdlu7li7arg9jj9"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-TFDR-XQ3K-SJ5G-BX3EG",
      "entityName":"Demonstration account: authorized retailer",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"authorizedRetailer"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06f62liq5aehkm056as0ambpu3d0467qc6vl6j76ujlts25s5r3a2u0ertkgdr06045kurtno1uhfut671g4ro8k8qr734k4qctdplt972d6aisj"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-85CR-6PAZ-SL4Y-CUCDA",
      "entityName":"Demonstration account: London store",
      "physicalAddress":"Washington Boulevard",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"authorizedRetailer"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06f26liqp045a085674jhnrh8mml9i22t3nhmm0c9e7uhjej1pdogssmj5dgfl5uf4sfg5a7gi3d9b9eh5nbnc7c8h9qhi8hmm25898ohd9ler7m"
  },

  {
    "walletInfo":{
      "accountRS":"CC14-9QS5-MBBX-56MF-ESNEB",
      "entityName":"Demonstration account: dumpster",
      "physicalAddress":"",
      "noFakeURL":"http://www.cryptoc14.com/",
      "expDate":"",
      "walletAssignment":"dumpster"
    },
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3f06dealiqvcchhfg5dmuj88oaduce012b1ihfa99o3oei3u3io2mdqaqiqhl0ciieme0lfc1caan44hcqaftpju65i44eq1vfgvbs1jp1fp3tth1l"
  }
];
