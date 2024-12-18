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

    client.request = "No request";
    return message.channel.send(client.embedMaker(message.author, "Success", `I have successfully forced the on-going request to close`));
}

exports.help = async() => {
    let name = "**force**";
    let description = "Forces the on-going request to close";
    return `${name} - ${description}\n`;
}