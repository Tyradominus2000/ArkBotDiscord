import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

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

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    const message = interaction.options.getString("broadcast");
    if (message !== null) {
      const result = server.rconBroadcast(message);
      if (result) {
        interaction.reply(`${message} send`);
        return;
      }
    }
    interaction.reply(`Fail to send message or message invalid`);
  },
};
