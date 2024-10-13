import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

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

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    const command = interaction.options.getString("command");
    const message = interaction.options.getString("message");
    if (command !== null) {
      const result = server.rconCommand(command, message);
      if (result) {
        interaction.reply(`${command} send`);
        return;
      }
    }
    interaction.reply(`Fail to send command or invalid command`);
  },
};
