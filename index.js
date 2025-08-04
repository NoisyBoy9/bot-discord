const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  plugins: [new YtDlpPlugin()],
});

client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Mensagem de boas-vindas
  if (message.content === 'ibemvindo') {
    message.channel.send(`Seja Bem vindo ${message.author}!`);
  }

  // Comando !play
  if (message.content.startsWith('!play')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Entre em um canal de voz primeiro!');

    const music = message.content.replace('!play', '').trim();
    if (!music) return message.reply('Digite o nome ou link da música!');

    distube.play(voiceChannel, music, {
      textChannel: message.channel,
      member: message.member,
    });
  }
});

client.login(process.env.TOKEN);
