const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ServerArk, TypeMessage } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ping the bot"),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    server.handleLog(
      `${interaction.member.user.username} call commands ping `,
      TypeMessage.Information
    );
    if (interaction.member.user.username === `kwadzarimon`) {
      interaction.reply("PONG mon bro");
    } else if (interaction.member.user.username === `.thepig`) {
      interaction.reply("PONG PONG");
    } else {
      interaction.reply("pong");
    }
  },
};
