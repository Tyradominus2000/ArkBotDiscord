import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstart")
    .setDescription("start the ArkServer"),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    server.handleServer(interaction.member?.user.id);
  },
};
