const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const announceCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {
    
    if(announceCoolDowns.has(message.author.id)) {
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

    let strArgs = args.join(" ");

    let title = strArgs.substring(strArgs.indexOf('"') + 1, strArgs.lastIndexOf('"'));
    if(!title) {
        return message.channel.send(client.embedMaker(message.author, "No Title Supplied", "You didn't supply a title for me to set as the announcement's title"));
    }

    let description = strArgs.substring(strArgs.lastIndexOf('"') + 2, strArgs.length);
    if(!description) {
        return message.channel.send(client.embedMaker(message.author, "No Description Supplied", "You didn't supply a description for me to set as the announcement's description"));
    }

    let newRequest = {
        author: message.author.tag,
        title: title,
        description: description,

        type: "Announcement",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
    announceCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        announceCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = `**announce "<title>" <description>**`;
    let description = "Makes a global announcement to the players playing your game, the title must be in quotations";
    return `${name} - ${description}\n`;
}