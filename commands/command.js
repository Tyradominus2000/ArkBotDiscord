const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("command")
    .setDescription("send command to server via rcon")
    .addStringOption((options) =>
      options
        .setName("command")
        .setDescription("Command you want to make")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("message")
        .setDescription("Additional message to the command")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    const command = interaction.options.getString("command");
    const message = interaction.options.getString("message");
    const result = server.rconCommand(command, message);
    if (result) {
      interaction.reply(`${command} send`);
    } else {
      interaction.reply(`Fail to send command`);
    }
  },
};
