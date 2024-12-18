const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const unbanCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(unbanCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "Cooldown", `You're on cooldown! Please try to use this command again after ${Number(process.env.cooldown)} seconds since the last successful attempt`));
    }

    let req = client.request;
    if(req !== "No request") {
        return message.channel.send(client.embedMaker(message.author, "In Use", `Someone already has a request activated! Please wait for this request to expire. If the Roblox servers are down, make this request expire using the force command`));
    }

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
        return message.channel.send(client.embedMaker(message.author, "No Username Supplied", "You didn't supply a username for me to unban from the game"));
    }

    let newRequest = {
        author: message.author.tag,
        usernameToUnBan: username,

        type: "Unban",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
    unbanCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        unbanCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**unban <username>**`;
    let description = "Unbans the username supplied from your game";
    return `${name} - ${description}\n`;
}