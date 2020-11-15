const Discord = require('discord.js');
require('dotenv').config();
const CoinGecko = require('coingecko-api');

const client = new Discord.Client();
const CoinGeckoClient = new CoinGecko();

const PREFIX = "$";

const botStart = async () => {
  console.log("COINBOT ONLINE!")
}

let fetchCrypto = async(message) => {
        let data = []
        var token = message.content.substring(PREFIX.length).split(" ").toString(); 
        data = await CoinGeckoClient.coins.list(); // calls ALL coins from coingecko api
        let getTokenId = data.data.filter(coin => coin.symbol.toUpperCase() === token.toUpperCase() || coin.name.toUpperCase() === token.toUpperCase()) // Filters the returned array for the user's coin.
        let tokenId = getTokenId[0]["id"]; // Sets the id to use in another api call for token data. 
        let fetchCoinInfo = await CoinGeckoClient.coins.fetch(tokenId, []);
        let currentPrice = fetchCoinInfo.data.market_data.current_price.usd; // Gets USD price of token.
        return {
          tokenId, 
          currentPrice
        }
}

client.on('message', async (message) => {
  let coinData; 
  if (!message.author.equals(client.user) && message.content.startsWith(PREFIX)) {
    coinData = await fetchCrypto(message); 
    console.log(coinData.tokenId, coinData.currentPrice)
  }
})

client.login(process.env.CLIENT_LOGIN);
client.on('ready', botStart)



