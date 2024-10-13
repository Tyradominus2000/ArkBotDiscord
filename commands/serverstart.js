const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstart")
    .setDescription("start the ArkServer"),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    server.handleServer();
  },
};
