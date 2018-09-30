const Discord = require('discord.js');
const chunk = require('lodash.chunk');
const config = require('./config.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`👋🏻 Logged in as ${client.user.tag}!`);
});

function getChannelBasedOnGuild(guilId) {
	return config.serverChannels.find(s => s.serverId === guilId);
}

function listEmoji(msg) {
	var emojiArray = [];

  	msg.guild.emojis.forEach(function(emoji) {
  		emojiArray.push(emoji.toString()) 
  	});
	
	var chunks = chunk(emojiArray, config.maxPerLine);
	const channel = client.channels.get(getChannelBasedOnGuild(msg.guild.id).channelId)
	
	chunks.forEach(line => channel.send(line.join(' ')));
}

client.on('message', msg => {
  if (msg.content === '!emoji') {
  	if(!msg.member.hasPermission('ADMINISTRATOR')) {
  		return;
  	}
	
	const botId = client.user.id;

	msg.channel.fetchMessages({limit: 10})
  		.then(messages => messages.filter(m => m.author.id === botId))
  		.then(messages => messages.deleteAll())
  		.catch(console.error);

	listEmoji(msg);
	msg.delete()
		.catch(console.error);
  }
});


client.login(config.token);
