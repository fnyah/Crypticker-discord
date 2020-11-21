const Discord = require('discord.js');
require('dotenv').config();
const CoinGecko = require('coingecko-api');
const { CanvasRenderService }  = require("chartjs-node-canvas");
const moment = require('moment'); 
moment().format(); 

const client = new Discord.Client();
const CoinGeckoClient = new CoinGecko();

const PREFIX = "$";

const botStart = async () => {
  console.log("ONLINE... Check discord text channel for output.")
}

let fetchCrypto = async(message) => {
  let data = []
  var token = message.content.substring(PREFIX.length).split(" ").toString(); 
  data = await CoinGeckoClient.coins.list(); 

  let getTokenId = data.data.filter(coin => coin.symbol.toUpperCase() === token.toUpperCase() || coin.name.toUpperCase() === token.toUpperCase()) // Filters the returned array for the user's coin.
  let tokenId = getTokenId[0]["id"]; 
  let tokenName = getTokenId[0]["name"];
  let tokenSymbol = getTokenId[0]["symbol"];
  let fetchCoinInfo = await CoinGeckoClient.coins.fetch(tokenId, []);
  let currentPrice = fetchCoinInfo.data.market_data.current_price.usd;
  if (currentPrice >= 1) currentPrice = currentPrice.toFixed(2);  

  let tokenLogo = fetchCoinInfo.data.image.large; 
  let homepage = fetchCoinInfo.data.links.homepage[0];
  let change24 = fetchCoinInfo.data.market_data.price_change_percentage_24h.toFixed(2);
  let change7d = fetchCoinInfo.data.market_data.price_change_percentage_7d.toFixed(2);
  let change1yr = fetchCoinInfo.data.market_data.price_change_percentage_1y.toFixed(2)
  let change1Month = fetchCoinInfo.data.market_data.price_change_percentage_30d.toFixed(2); 
  if (change24 >= 0.1) change24 = "+" + change24; 
  if (change7d >= 0.1) change7d = "+" + change7d; 
  if (change1yr >= 0.1) change1yr = "+" + change1yr; 

  let chartData = []
  chartData = await CoinGeckoClient.coins.fetchMarketChart(tokenId, {
    days: "30"
  });
  chartData = chartData.data.prices; 
  let filterChartData = chartData.map(value => {
    return {
        day: value[0], 
        price: value[1]
    }
  })
  
    let dateForChart = []; 
    let priceForChart = []; 
    for (let i = 0; i < filterChartData.length; i++) {
      filterChartData[i].day = moment(filterChartData[i].day).format("MMM Do 20")
      if (filterChartData[i].price >= 1) filterChartData[i].price = filterChartData[i].price.toFixed(2)
      dateForChart.push(filterChartData[i].day)
      priceForChart.push(parseFloat(filterChartData[i].price))
    }

    return {
      tokenName, 
      currentPrice,
      tokenLogo,
      homepage,
      tokenId,
      tokenSymbol,
      change24,
      change7d,
      change1yr, 
      change1Month,
      dateForChart,
      priceForChart
    }
}

let makeEmbedCard = async(message, coinData) => {
  let bgColor;
  if (coinData.change1Month > 0) {
    bgColor = 'rgba(0, 255, 0, 0.8)';
  } else {
    bgColor = 'rgba(255, 0, 0, 0.8)';
  }
  const embed = new Discord.MessageEmbed()
    .setColor('#43ff0a')
    .setTitle(coinData.tokenName + " " + "(" + coinData.tokenSymbol.toUpperCase() + ")")
    .setURL(coinData.homepage)
    .setAuthor('Crypticker Bot', 'https://cdn2.iconfinder.com/data/icons/cryptocurrency-cryptocurrencies/128/cryptocurrency_cryptocurrencies_4_bitcoin-512.png', 'https://github.com/fnyah/Crypticker-discord')
    .setDescription('https://www.coingecko.com/en/coins/' + coinData.tokenId)
    .setThumbnail(coinData.tokenLogo)
    .addFields(
      { name: 'Current Price:', value: "$" + coinData.currentPrice + " USD"},
      { name: '24 Hour Change:', value: coinData.change24 + "%", inline: true },
      { name: 'One Week Change:', value: coinData.change7d + "%", inline: true },
      { name: 'One Year Change:', value: coinData.change1yr + "%", inline: true },
    )
    .setTimestamp()
    const width = 700;
    const height = 400;
    var type = 'bar';
    const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => { });
    const image = await canvasRenderService.renderToBuffer({
      type: type,
      data: {
        labels: coinData.dateForChart,
        datasets: [{
            label: 'Change over one month ($USD)',
            data: coinData.priceForChart,
            backgroundColor: bgColor,
        }]
        },
        options: {
          legend: {
            display: false, 
              labels: {
                fontColor: "white",
                fontSize: 25
              },
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: "white",
                fontSize: 20,
                beginAtZero: true
              }
            }],
            xAxes: [{
              ticks: {
                fontColor: "white",
                fontSize: 20,
                beginAtZero: false
              } 
            }]
          }
        }
    });
    const attachment = new Discord.MessageAttachment(image, "image.png");
    embed.attachFiles(attachment);
    embed.setImage("attachment://image.png");
    message.channel.send(embed);
}

client.on('message', async (message) => {
  let coinData; 
  if (!message.author.equals(client.user) && message.content.startsWith(PREFIX)) {
    coinData = await fetchCrypto(message).catch((err) => {
      message.reply("Please enter a valid coin name or symbol.", err)
   })
    makeEmbedCard(message, coinData);
  }
})

client.login(process.env.CLIENT_LOGIN); // Put your bot token here
client.on('ready', botStart);


