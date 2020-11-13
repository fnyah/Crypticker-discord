const Discord = require('discord.js');
require('dotenv').config();
const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();
const client = new Discord.Client();
client.login(process.env.CLIENT_LOGIN);
let data = []

const botStart = () => {
  console.log("COINBOT ONLINE!")
}

let fetchCrypto = async(message) => {
  const PREFIX = "$"; 
    if (!message.content.startsWith(PREFIX)) return;  // Checks user input string for the prefix of '$' 
    var token = message.content.substring(PREFIX.length).split(" ").toString(); 
    data = await CoinGeckoClient.coins.list(); // calls ALL coins from coingecko api
    let getTokenId = data.data.filter(coin => coin.symbol.toUpperCase() === token.toUpperCase() || coin.name.toUpperCase() === token.toUpperCase()) // Filters the returned array for the user's coin.
    let tokenId = getTokenId[0]["id"]; // Sets the id to use in another api call for token data. 
    let fetchCoinInfo = await CoinGeckoClient.coins.fetch(tokenId, []);
    let currentPrice = fetchCoinInfo.data.market_data.current_price.usd; // Gets USD price of token.
    message.channel.send("$" + currentPrice + " USD") 
}

client.on('ready', botStart) 
client.on('message', fetchCrypto)
