const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("authentificate")
    .setDescription("Authentificate to the RCON"),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    const result = server.rconAuthentificate();
    if (result) {
      interaction.reply("Authentification au rcon");
    } else {
      interaction.reply("Echec de l'authentification au rcon");
    }
  },
};
