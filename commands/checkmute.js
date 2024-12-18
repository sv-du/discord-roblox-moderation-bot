const Discord = require('discord.js');

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

    let username = args[0];
    if(!username) {
        return message.channel.send(client.embedMaker(message.author, "No Username Supplied", `You didn't supply a username for me to check mute status on`))
    }

    let newRequest = {
        userToCheck: username,

        type: "CheckMute",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
}

exports.help = async() => {
    let name = "**checkmute <username>**";
    let description = "Checks the mute status of the supplied username";
    return `${name} - ${description}\n`;
}