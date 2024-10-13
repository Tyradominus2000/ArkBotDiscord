import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop the ArkServer if you have the permission")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    const result = server.stopServer(interaction.member?.user.id);

    if (result) {
      interaction.reply("Server arrêter");
    } else {
      interaction.reply("Echec de l'arrêt du server");
    }
  },
};
