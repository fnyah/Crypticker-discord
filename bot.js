const Discord = require('discord.js');
require('dotenv').config();
const CoinGecko = require('coingecko-api');

const client = new Discord.Client();
const CoinGeckoClient = new CoinGecko();

const PREFIX = "$";

const botStart = async () => {
  console.log("ONLINE... Check discord text channel for output.")
}

let fetchCrypto = async(message) => {
  let data = []
  var token = message.content.substring(PREFIX.length).split(" ").toString(); 
  data = await CoinGeckoClient.coins.list(); // calls ALL coins from coingecko api

  let getTokenId = data.data.filter(coin => coin.symbol.toUpperCase() === token.toUpperCase() || coin.name.toUpperCase() === token.toUpperCase()) // Filters the returned array for the user's coin.
  let tokenId = getTokenId[0]["id"]; // Sets the id to use in another api call for token data. 
  let tokenName = getTokenId[0]["name"];
  let fetchCoinInfo = await CoinGeckoClient.coins.fetch(tokenId, []);
  let currentPrice = fetchCoinInfo.data.market_data.current_price.usd;
  if (currentPrice >= 1) currentPrice = currentPrice.toFixed(2);  
  
  let image = fetchCoinInfo.data.image.large
  let homepage = fetchCoinInfo.data.links.homepage[0];
  let change24 = fetchCoinInfo.data.market_data.price_change_percentage_24h.toFixed(2);
  let change7d = fetchCoinInfo.data.market_data.price_change_percentage_7d.toFixed(2);
  let change1yr = fetchCoinInfo.data.market_data.price_change_percentage_1y.toFixed(2)

  if (change24 >= 0.1) change24 = "+" + change24; 
  if (change7d >= 0.1) change7d = "+" + change7d; 
  if (change1yr >= 0.1) change1yr = "+" + change1yr; 
  
    return {
      tokenName, 
      currentPrice,
      image,
      homepage,
      tokenId,
      change24,
      change7d,
      change1yr
    }
}

let makeEmbedCard = async(message, coinData) => {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#43ff0a')
    .setTitle(coinData.tokenName)
    .setURL(coinData.homepage)
    .setAuthor('Crypticker Bot', 'https://cdn2.iconfinder.com/data/icons/cryptocurrency-cryptocurrencies/128/cryptocurrency_cryptocurrencies_4_bitcoin-512.png', 'https://github.com/fnyah/Crypticker-discord')
    .setDescription('https://www.coingecko.com/en/coins/' + coinData.tokenId)
    .setThumbnail(coinData.image)
    .addFields(
      { name: 'Current Price:', value: "$" + coinData.currentPrice + " USD"},
      { name: '24 Hour Change:', value: coinData.change24 + "%", inline: true },
      { name: 'One Week Change:', value: coinData.change7d + "%", inline: true },
      { name: 'One Year Change:', value: coinData.change1yr + "%", inline: true },
    )
    .setTimestamp()
  message.channel.send(exampleEmbed);
}

client.on('message', async (message) => {
  let coinData; 
  if (!message.author.equals(client.user) && message.content.startsWith(PREFIX)) {
    coinData = await fetchCrypto(message).catch((err) => {
      console.log(message.reply("Please enter a valid coin name or symbol.", err))
   })
    makeEmbedCard(message, coinData);
  }
})

client.login(process.env.CLIENT_LOGIN);
client.on('ready', botStart);


