const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embedMaker(message.author, "No Permission", "You don't have permission to run this command"));
    }

    let dataStore = args[0];
    if(!dataStore) {
        return message.channel.send(client.embedMaker(message.author, "No Datastore Supplied", "You didn't supply a datastore for me to get a value from"));
    }

    let value = args[1];
    if(!value) {
        return message.channel.send(client.embedMaker(message.author, "No Value Supplied", `You didn't supply a value for me to get from the supplied datastore`));
    }

    let newRequest = {
        dataStore: dataStore,
        value: value,

        type: "GetDataValue",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
}

exports.help = async() => {
    let name = "**getdatavalue <datastore> <value>**";
    let description = "Gets the value of the <value> key from the supplied datastore";
    return `${name} - ${description}\n`;
}