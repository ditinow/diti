//商品条码及对应产品品牌、型号、简述、计量单位、产地、产品官网、产品防伪官网及产品有效期(保质期或保修期)
//productUrl - produt official web site 产品官网
//noFakeUrl - official anti-counterfeiting web site, use the PHP sceipt here to register your product。
//note: due to CORS, request title token by acLink may nor works, suggest perform this task by going to official anti-counterfeiting web site by click "Company Info -> Offical website".
//noFakeUrl - 产品防伪官网，使用个链接的脚本申请权益证明NFT。
//注:CORS原因，间接通过官网noFakeUrl的脚本不一定能完成注册，建议消费者点击"企业信息->防伪官网"完成鉴定及申请权益证明。
var myAssetBookObj = [
  {
    barcode:"6901234567890",
    brand:"演示品牌",
    model:"DT-C123",
    description:"CryptoC14 纪念品 43寸折叠伞，天空之境",
    unit:"件",
    madeIn:"中国，广西，南宁",
    productUrl:"http://www.yourCompany.com/souvenir/",
    noFakeUrl:"http://www.cryptoc14.com/diti/",
    coverage:"12个月",
  },
  {
    barcode:"6902345678901",
    brand:"演示品牌",
    model:"DT-T123",
    description:"CC14信息科技 POLO工作衫 蓝绿码（防伪码+注册码)套装，2件一套",
    unit:"套",
    madeIn:"中国，广西，南宁",
    productUrl:"http://www.yourCompany.com/souvenir/",
    noFakeUrl:"http://www.cryptoc14.com/diti/",
    coverage:"12个月",
  },
  {
    barcode:"6903456789012",
    brand:"演示品牌",
    model:"DT-D456",
    description:"CryptoC14 周年纪念 精品绿茶 200克",
    unit:"件",
    madeIn:"中国，广西，玉林西山",
    productUrl:"http://www.yourCompany.com/souvenir/",
    noFakeUrl:"http://www.cryptoc14.com/diti/",
    coverage:"48个月",
  },
  {
    barcode:"6905678901234",
    brand:"演示品牌",
    model:"DT-C789",
    description:"CC14内部福利 牛奶糖 散装",
    unit:"克",
    madeIn:"中国，广西，南宁",
    productUrl:"http://www.yourCompany.com/souvenir/",
    noFakeUrl:"http://www.cryptoc14.com/diti/",
    coverage:"12个月",
  }
];
