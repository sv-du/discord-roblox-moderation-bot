const Discord = require('discord.js');
const ms = require('ms');

require('dotenv').config();

const embedColor = process.env.embedColor;

/**
* @param {Discord.Message} message
* @param {Discord.Client} client
* @param {String[]} args
*/

exports.run = async(message, client, args) => {

    let embed = new Discord.MessageEmbed();
    embed.setColor(embedColor);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle("Command List");
    embed.setFooter('Command created by zachariapopcorn#8105 - https://discord.gg/XGGpf3q');

    let description = `There are ${client.commandList.length} commands\n\n`;

    for(var i = 0; i < client.commandList.length; i++) {
        let concatedString = "";

        try {
            concatedString = await client.commandList[i].file.help();
        } catch {
            concatedString = "**Load Failed** - Help display of command failed to load\n";
        }

        description += concatedString;
    }

    embed.setDescription(description);
    return message.channel.send(embed);
}

exports.help = async() => {
    let name = `**help**`;
    let description = "Displays the help menu";
    return `${name} - ${description}\n`;
}