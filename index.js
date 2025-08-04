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
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // 🎉 Boas-vindas
  if (message.content === '!bemvindo') {
    message.channel.send(`Seja Bem vindo ${message.author}!`);
  }

  // ▶️ Comando !play
  if (message.content.startsWith('!play')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Entre em um canal de voz primeiro!');

    const song = message.content.replace('!play', '').trim();
    if (!song) return message.reply('Digite o nome ou link da música!');

    distube.play(voiceChannel, song, {
      textChannel: message.channel,
      member: message.member,
    });
  }

  // 🔊 Comando !unmute
  if (message.content === '!unmute') {
    try {
      const voiceChannel = message.guild.members.me.voice.channel;
      if (!voiceChannel) return message.reply('Eu não estou em nenhum canal de voz.');

      await message.guild.members.me.voice.setMute(false);
      message.reply('Desmutado com sucesso! 🔊');
    } catch (err) {
      console.error(err);
      message.reply('Não consegui me desmutar 😢');
    }
  }
});

client.login(process.env.TOKEN);
