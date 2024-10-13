const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const { ServerArk } = require("../class/Server");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop the ArkServer if you have the permission")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  /**
   * @param {ChatInputCommandInteraction<CacheType>} interaction
   * @param {ServerArk} server
   */
  async execute(interaction, server) {
    const result = server.stopServer();

    if(result){
        interaction.reply("Server arrêter");
    }else{
        interaction.reply("Echec de l'arrêt du server")
    }
  },
};
