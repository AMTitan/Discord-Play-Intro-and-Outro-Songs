require("dotenv").config();
const ytdl = require('ytdl-core');
const fs = require('fs');

const {
	Client
} = require('discord.js');
const client = new Client();
const PREFIX = "!S";

client.on('ready', () => {
	console.log(`${client.user.tag} bot is on`);
	client.user.setActivity(`${PREFIX}join`, {
			type: 'WATCHING'
		})
		.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
		.catch(console.error);
})

client.on('message', (message) => {
	if (message.author.bot === true) return;
	if (!message.content.startsWith(PREFIX)) return;
	console.log(`[${message.author.tag}]: ${message.content}`);
	const [commandName, ...args] = message.content
		.trim()
		.substring(PREFIX.length)
		.split(/\s+/);
	if (commandName === "join") {
		const {
			voice
		} = message.member;
		if (!voice.channelID) {
			message.reply("You have to be in a voice channel");
			return;
		}

		const streamOptions = {
			seek: 0,
			volume: 1
		};
		voice.channel.join().then(connection => {

			//const stream = ytdl(`https://www.youtube.com/watch?v=MFw3E6X5aoA`, { filter : 'audioonly' });
			const stream = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Hi I am ${client.user.username}&tl=en`;
			const dispatcher = connection.play(stream, streamOptions);
			client.on('voiceStateUpdate', (oldMember, newMember) => {
				if (oldMember.serverDeaf !== null) {
					if (oldMember.serverDeaf === newMember.serverDeaf && oldMember.serverMute === newMember.serverMute && oldMember.selfDeaf == newMember.selfDeaf && oldMember.selfMute === newMember.selfMute && oldMember.selfVideo === newMember.selfVideo && oldMember.streaming === newMember.streaming) {} else {
						return
					}
				}
				if (oldMember.channelID === null && newMember.channelID !== null) {
					//const stream = ytdl(`https://www.youtube.com/watch?v=MFw3E6X5aoA`, { filter : 'audioonly' });
					const stream = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Hi ${oldMember.member.user.username}&tl=en`;
					const dispatcher = connection.play(stream, streamOptions);
				} else {
					//const stream = ytdl(`https://www.youtube.com/watch?v=mN7ai6ql8bQ`, { filter : 'audioonly' });
					const stream = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Bye ${oldMember.member.user.username}&tl=en`;
					const dispatcher = connection.play(stream, streamOptions);
				}
				if (oldMember.guild.channels.cache.get(oldMember.channelID)) {
					if (oldMember.guild.channels.cache.get(oldMember.channelID).members.size === 1) {
						oldMember.guild.channels.cache.get(oldMember.channelID).leave();
						return;
					}
				}
			})
		}).catch(err => console.log(err));
	}

})
client.login(process.env.DISCORD_BOT_TOKEN);
