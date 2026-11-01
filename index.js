const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config.json');

const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag} (ID: ${client.user.id})`);
  console.log('------');
});

client.on('guildMemberAdd', async (member) => {
  const guild = member.guild;
  const canal = guild.channels.cache.get(config.welcomeChannelId);

  // ---- mensagem no canal geral ----
  if (canal) {
    const embed = new EmbedBuilder()
      .setTitle('Bem-vindo(a)!')
      .setDescription(`${member} acabou de entrar em **${guild.name}**.`)
      .setColor(config.embedColor)
      .setThumbnail(member.displayAvatarURL())
      .setFooter({ text: `Membro #${guild.memberCount}` });

    try {
      await canal.send({ embeds: [embed] });
    } catch (err) {
      console.log(`Sem permissão pra mandar em #${canal.name}: ${err.message}`);
    }
  }

  // ---- DM pra pessoa ----
  const dmEmbed = new EmbedBuilder()
    .setTitle(`Oi, ${member.user.username}!`)
    .setDescription(
      `Bem-vindo(a) ao **${guild.name}**.\n\n` +
      'Dá uma lida nas regras e fica à vontade. ' +
      'Qualquer coisa, chama a moderação.'
    )
    .setColor(config.embedColor)
    .setThumbnail(guild.iconURL());

  try {
    await member.send({ embeds: [dmEmbed] });
  } catch (err) {
    // usuário com DM fechada
    console.log(`DM bloqueada por ${member.user.tag}: ${err.message}`);
  }
});

client.login(TOKEN);1