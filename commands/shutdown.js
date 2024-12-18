const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const shutDownCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(shutDownCoolDowns.has(message.author.id)) {
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

    let type = args[0];
    if(!type) {
        return message.channel.send(client.embedMaker(message.author, "No Type Supplied", `You didn't supply the type of shutdown for me to preform`));
    }

    if(type.toLowerCase() !== "global" && type.toLowerCase() !== "jobid") {
        return message.channel.send(client.embedMaker(message.author, "Invalid Type Supplied", "The type of shutdown that you supplied isn't valid"));
    }

    if(type.toLowerCase() === "global") {
        
        let reason = args.splice(1).join(" ");
        if(!reason) {
            return message.channel.send(client.embedMaker(message.author, "No Reason Supplied", `You didn't supply a reason for me to shutdown all the servers`));
        }

        let newRequest = {
            author: message.author.tag,
            reason: reason,
            isGlobal: true,

            type: "Shutdown",
            channelID: message.channel.id,
            authorID: message.author.id
        }

        client.request = newRequest;

        message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
        shutDownCoolDowns.add(message.author.id);

        let timeString = `${process.env.cooldown}s`;
        setTimeout(() => {
            shutDownCoolDowns.delete(message.author.id);
        }, ms(timeString));
    } else {

        let jobID = args[1];
        if(!jobID) {
            return message.channel.send(client.embedMaker(message.author, "No Job ID Supplied", `You didn't supply a job id for the server that you want me to shutdown`));
        }

        let reason = args.splice(2).join(" ");
        if(!reason) {
            return message.channel.send(client.embedMaker(message.author, "No Reason Supplied", `You didn't supply a reason for me to shutdown the server`));
        }

        let newRequest = {
            author: message.author.tag,
            reason: reason,
            jobID: jobID,
            isGlobal: false,

            type: "Shutdown",
            channelID: message.channel.id,
            authorID: message.author.id
        }

        client.request = newRequest;

        message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down or the job ID that you supplied isn't valid`));
        lockCoolDowns.add(message.author.id);

        let timeString = `${process.env.cooldown}s`;
        setTimeout(() => {
            lockCoolDowns.delete(message.author.id);
        }, ms(timeString));
    }
}

exports.help = async() => {
    let name = "**shutdown global <reason> | shutdown jobid <job id> <reason>**";
    let description = "Shutdowns servers with the given settings";
    return `${name} - ${description}\n`;
}