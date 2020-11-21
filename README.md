# Crypticker Discord Bot

Crypticker is a nodejs powered Discord bot to get a quick and concise price readout of any cryptocurrency listed on [CoinGecko](https://www.coingecko.com/en). Add to your server today! 

# Demo 

<p align="center">
    <img width="400" alt="demo-image" src="https://user-images.githubusercontent.com/7035086/99868454-9b8e2080-2b90-11eb-8c23-8de41a6862e4.png">
</p>

# Installation and Usage

To use a discord bot, you must have a discord developer account and an application created in the discord developer center. You will need to replace the bot login token with your own. If you have no experience setting up a discord bot, you can start [here](https://discord.com/developers/docs/intro) with the discord developer docs. Or check out "The Coding Train" for his series on discord bots that is very useful for getting started [here](https://www.youtube.com/watch?v=7A-bnPlxj4k). 

## Bot commands

Use the prefix "$" followed by any token name or symbol listed on CoinGecko to recieve an instant price readout. 

## Installation 

Clone this project to a desired local folder. 

```
$ git clone https://github.com/fnyah/Crypticker-discord/
$ cd Crypticker-discord
```

Install project dependencies. 

```
$ npm install
```

Run the bot!

```
node bot.js
```

# Required Dependencies

* [discord.js](https://discord.js.org/#/)
* [coingecko-api](https://www.npmjs.com/package/coingecko-api)
* [Chart.js](https://www.chartjs.org/)
* [moment.js](https://github.com/moment/moment/)

# License

MIT ©  [fnyah](https://github.com/fnyah)
