const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("Broadcast a message to the server")
    .addStringOption((options) =>
      options
        .setName("broadcast")
        .setDescription("Message you want to broadcast")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    const message = interaction.options.getString("broadcast");
    const result = server.rconBroadcast(message);
    if (result) {
      interaction.reply(`${message} send`);
    } else {
      interaction.reply(`Fail to send message`);
    }
  },
};
