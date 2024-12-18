const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const setReasonCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(setReasonCoolDowns.has(message.author.id)) {
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
        return message.channel.send(client.embedMaker(message.author, "No Username Supplied", "You didn't supply a username for me to change the ban reason of"));
    }

    let newReason = args.splice(1).join(" ");
    if(!newReason) {
        return message.channel.send(client.embedMaker(message.author, "No Reason Supplied", `You didn't supply a new reason for this user's ban`));
    }

    let newRequest = {
        userBanned: username,
        newReason: newReason,

        type: "SetReason",
        channelID: message.channel.id,
        authorID: message.author.id
    }

    client.request = newRequest;

    message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
    setReasonCoolDowns.add(message.author.id);

    let timeString = `${process.env.cooldown}s`;
    setTimeout(() => {
        setReasonCoolDowns.delete(message.author.id);
    }, ms(timeString));
}

exports.help = async() => {
    let name = "**setreason <username> <new reason>**";
    let description = "Overwrites the supplied username's ban's reason with the new reason supplied";
    return `${name} - ${description}\n`;
}