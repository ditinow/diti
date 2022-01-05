//钱包地址、机构名称、现实地址、联系方式、钱包有效期截止日期、钱包级别以及机构职责。
//钱包有效期截止日期之后诞生的权益证明NFT将被视为侵权。
//应用将钱包级别进行权益状态判断。如果需要额外级别对应指定供应链流程请联系CryptoC14。
//walletAssignment: 0-validation, 1-issuance, 2-activation, 3-services, 4-return, 5-authorizedRetailer, 6-dumpster"，
//钱包职责: 0-确认钱包地址专用, 1-授权专用, 2-激活专用, 3-售后服务专用, 4-退货专用, 5-专卖店, 6-垃圾桶"
//钱包地址确认码: use API generateToken on JSON.stringify(myAddressBookObj[x].walletInfo)"

var myAddressBookObj = [
  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fnci9gliqdp0teho4sjshfmnqip9vh07999ntdjptvc7m6opobdc2figudsv0tgqqv81bjc3lo204n992sh15839crv01nfhpmbd6uco9bf43vh15",
    "walletInfo":{
      "accountRS":"CC14-49CE-CXZZ-3QHW-AH4JK",
      "entityName":"CryptoC14 Technology 信息科技",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"validation"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncibiliqul9h2m04skkrd2gqqmsd7pi1vb1ht87eb89q8sut7ufn1jrm2890ilsehvisj4fl2ktdop5pvjv8phtevfkbcf8b4b607djpntg653gv",
    "walletInfo":{
      "accountRS":"CC14-8P4T-FMJU-BXSK-252LG",
      "entityName":"CryptoC14 Technology 信息科技",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"issuance"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncideliq8ts5oi84djs5c65n3n7avi630qnnk7t4jm9806uvtvv4gquahcngaka9om5f7mvcbdesof8tth6f7duinoc1l3332rp2ikk21ojf1b4h",
    "walletInfo":{
      "accountRS":"CC14-H4L7-CTL7-2KMQ-7TCLW",
      "entityName":"CryptoC14 Technology 信息科技",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"activation"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fnciecliqan3461845coimap3c90jbolc74alkn6t29koi26oe0foncovl0pg29bobghjhhofups0899irmf8mttc76l1ktlm42jgrsc5cac6qr0a",
    "walletInfo":{
      "accountRS":"CC14-HXAT-86F4-75BR-HWXSG",
      "entityName":"CryptoC14 Technology 信息科技/Ego LLC",
      "physicalAddress":"Houston, Texas, USA",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"services"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fneuksliqnkpnq9g4adfi2e1lujrcg51hfhmj9mct4kmplp23rqohcrmnpnggik4tkkn294i4pt8d3vtc0j0bis2lfqrqbuinpt2cculj2gbatvkf",
    "walletInfo":{
      "accountRS":"CC14-5KKJ-TXML-FKM3-4SLZB",
      "entityName":"demo issuance wallet one. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://13.52.217.197/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"issuance"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncig8liqjv9miog4nlq12ich4sm8makis6gjlaus7q9j2qu4u8j3u8rqpirg2ps1rf4tkpbtbqfrrh318d047vni8nb47m9s8kpqtmi2sb5saole",
    "walletInfo":{
      "accountRS":"CC14-UEM4-XQBX-HZWW-G2FNW",
      "entityName":"issuance wallet two. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://13.52.217.197/diti/",
      "expDate":"2021-10-31T23:59:59+00:00",
      "walletAssignment":"issuance"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncihmliqv278j9g4aevtsprvshh3p7ndchr827c4no733v2gd8lf9dss1pe0peu73c8qent85n58stc46ch4t8had3lafe10enl4hcobl1ihovpi",
    "walletInfo":{
      "accountRS":"CC14-F4Z6-3E9T-EXSK-HPYWH",
      "entityName":"product activation wallet one. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://13.52.217.197/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"activation"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fnciioliq019dlko4h2mssaap3kh4j5fp8dffhr649ou780v57v29fg5mlih0o42fk9rcsoho8o9ok2vn20l3q7iho6m8385rfl7dpp5nqotgpmkg",
    "walletInfo":{
      "accountRS":"CC14-DUPL-QDTD-ZGDJ-7YJTW",
      "entityName":"product activation wallet two. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://13.52.217.197/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"activation"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncijqliq9567bc040hgcf5un7tlcbbkl167mft11c5su0qbmhuedlrm07hlgvf1krqeqfjpbgsn848et8jae2qli0t0d05m469abij1e82hgcrmu",
    "walletInfo":{
      "accountRS":"CC14-6LFR-HCTG-F2LR-87ZB4",
      "entityName":"services wallet. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://13.52.217.197/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"services"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fofbg8liqrnqbeqg43jovps3n67243rc0onbs4omssl5hb7sbd042ebvptpcgnp2pui2vcvu6071tsmpfpnmhvsmovh8dk0uurqt43t7akbq2tb8d",
    "walletInfo":{
      "accountRS":"CC14-CWWS-4MHT-ZKHY-DGUYC",
      "entityName":"return wallet. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"return"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fofbi6liqq5va9go4iiondpio0ggpggcoiort34jp5tmnm7h4vt78ht734pug69m1jk9ikkn5e859r22nlu23c17kf8dg5ejk6e9o2qv6r7tc750e",
    "walletInfo":{
      "accountRS":"CC14-TFDR-XQ3K-SJ5G-BX3EG",
      "entityName":"return wallet. 演示品牌",
      "physicalAddress":"somewhere",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"authorizedRetailer"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncililiq0c3jmj84hpbjn7vgfi31eudf5s3u51khm7rfodn87r7hpc7r8nug25lbi0vc618pams3564jqaaku6sgbt6mev3vre0mg6v6frclasso",
    "walletInfo":{
      "accountRS":"CC14-85CR-6PAZ-SL4Y-CUCDA",
      "entityName":"London retail store. 演示品牌",
      "physicalAddress":"Washington Boulevard",
      "noFakeURL":"http://www.cryptoc14.com/diti/",
      "expDate":"2022-12-31T23:59:59+00:00",
      "walletAssignment":"authorizedRetailer"
    }
  },

  {
    "validationCode":"crnh9rosg2oeshsbc776kdasdlgci0m66cc23c565kq33e3fncimsliqiod4o5840jjdnhgufe7c3lingibbtj104qrm68p25sf5dj67ohl0robclitlcsk7sd37ka89ago7isoksvhq40ukfkbfkae9rjepi1nu",
    "walletInfo":{
      "accountRS":"CC14-9QS5-MBBX-56MF-ESNEB",
      "entityName":"演示品牌焚毁专用。钱包密钥已遗失，钱包内所有资产将无法转移。",
      "physicalAddress":"",
      "noFakeURL":"http://13.52.217.197/diti/",
      "expDate":"",
      "walletAssignment":"dumpster"
    }
  }
];
