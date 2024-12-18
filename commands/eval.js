const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const allowedRanks = process.env.allowedRanks.split(",");
const evalCoolDowns = new Set();

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    if(evalCoolDowns.has(message.author.id)) {
        return message.channel.send(client.embedMaker(message.author, "Cooldown", `You're on cooldown! Please try to use this command again after ${Number(process.env.cooldown)} seconds since the last successful attempt`));
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

    let typeOfENV = args[0];
    if(!typeOfENV) {
        return message.channel.send(client.embedMaker(message.author, "No Type Supplied", "You didn't supply the type of enviroment for me the run code on"));
    }

    if(typeOfENV.toLowerCase() !== "node" && typeOfENV.toLowerCase() !== "roblox") {
        return message.channel.send(client.embedMaker(message.author, "Invalid Type Supplied", "The type of enviroment that you supplied isn't valid"));
    }

    if(typeOfENV.toLowerCase() === "node") {

        let code = args.splice(1).join(" ");
        if(!code) {
            return message.channel.send(client.embedMaker(message.author, "No Code Supplied", `You didn't supply code for me to run on Node`));
        }

        let result = "No result returned";
        let error = "No error returned";

        try {
            result = await eval(code);
        } catch (err) {
            error = err;
        }

        let embed = client.embedMaker(message.author, "Results", `I have successfully executed the code, here are the results`);
        embed.addField("Code", "```js\n" + code + "\n```");
        embed.addField("Result", "```" + result + "```");
        embed.addField("Error", "```" + error + "```");
        return message.channel.send(embed);
    }

    if(typeOfENV.toLowerCase() === "roblox") {

        let req = client.request;
        if(req !== "No request") {
            return message.channel.send(client.embedMaker(message.author, "In Use", `Someone already has a request activated! Please wait for this request to expire. If the Roblox servers are down, make this request expire using the force command`));
        }

        let typeOfExecution = args[1];
        if(!typeOfExecution) {
            return message.channel.send(client.embedMaker(message.author, "No Type Supplied", "You didn't supply the type of execution method for me the run code on"));
        }
    
        if(typeOfExecution.toLowerCase() !== "global" && typeOfExecution.toLowerCase() !== "jobid") {
            return message.channel.send(client.embedMaker(message.author, "Invalid Type Supplied", "The type of execution method that you supplied isn't valid"));
        }

        if(typeOfExecution.toLowerCase() === "global") {

            let code = args.splice(2).join(" ");
            if(!code) {
                return message.channel.send(client.embedMaker(message.author, "No Code Supplied", `You didn't supply code for me to run on all of the Roblox game servers`));
            }

            let newRequest = {
                code: code,
                isGlobal: true,
        
                type: "Execution",
                channelID: message.channel.id,
                authorID: message.author.id
            }

            client.request = newRequest;

            message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down`));
            evalCoolDowns.add(message.author.id);
        
            let timeString = `${process.env.cooldown}s`;
            setTimeout(() => {
                evalCoolDowns.delete(message.author.id);
            }, ms(timeString));
        }

        if(typeOfExecution.toLowerCase() === "jobid") {

            let jobID = args[2];
            if(!jobID) {
                return message.channel.send(client.embedMaker(message.author, "No Job ID Supplied", `You didn't supply a job ID of the game for me to run code on`));
            }

            let code = args.splice(3).join(" ");
            if(!code) {
                return message.channel.send(client.embedMaker(message.author, "No Code Supplied", `You didn't supply code for me to run on all of the Roblox game servers`));
            }

            let newRequest = {
                code: code,
                isGlobal: false,
                jobID: jobID,
        
                type: "Execution",
                channelID: message.channel.id,
                authorID: message.author.id
            }

            client.request = newRequest;

            message.channel.send(client.embedMaker(message.author, "Sent Request", `I have successfully sent the request over for Roblox to read! If there is no response, it's most likely that the server is down or the job ID that you supplied isn't valid`));
            evalCoolDowns.add(message.author.id);
        
            let timeString = `${process.env.cooldown}s`;
            setTimeout(() => {
                evalCoolDowns.delete(message.author.id);
            }, ms(timeString));
        }
    }
}

exports.help = async() => {
    let name = `**eval node <code> | eval roblox global <code> | eval roblox jobid <job id> <code>**`;
    let description = "Runs code on Node or Roblox with the given settings";
    return `${name} - ${description}\n`;
}