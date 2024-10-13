const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("saveserver")
    .setDescription("Save the server"),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    const result = await server.rconSaveWorld();
    if (result) {
      interaction.reply("Saving world");
    } else {
      interaction.reply("Fail to save world");
    }
  },
};
