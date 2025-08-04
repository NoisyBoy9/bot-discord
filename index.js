require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

const distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()],
});

client.on('ready', () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {
  const canal = member.guild.channels.cache.find(c => c.name === "bem-vindo");
  if (canal) canal.send(`Seja bem-vindo ${member.user}!`);
});

client.on('messageCreate', async (msg) => {
  if (!msg.content.startsWith('!')) return;
  const args = msg.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    if (!msg.member.voice.channel) return msg.reply('Entre em um canal de voz!');
    distube.play(msg.member.voice.channel, args.join(" "), {
      textChannel: msg.channel,
      member: msg.member,
    });
  }
});

client.login(process.env.TOKEN);
