require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  plugins: [
    new SpotifyPlugin(),
    new YtDlpPlugin()
  ]
});

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;
  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply("Entre em um canal de voz!");
    distube.play(channel, args.join(" "), {
      textChannel: message.channel,
      member: message.member
    });
  }

  if (command === "stop") {
    distube.stop(message);
    message.channel.send("⏹️ Música parada!");
  }
});

distube.on("playSong", (queue, song) =>
  queue.textChannel.send(`🎵 Tocando: \`${song.name}\``)
);

client.login(process.env.TOKEN);
