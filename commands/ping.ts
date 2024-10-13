import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { ServerArk, TypeMessage } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ping the bot"),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    if (interaction.member) {
      server.handleLog(
        `${interaction.member.user.username} call commands ping `,
        TypeMessage.Information
      );
      if (interaction.member.user.username === `kwadzarimon`) {
        interaction.reply("PONG mon bro");
      } else if (interaction.member.user.username === `.thepig`) {
        interaction.reply("PONG PONG");
      } else {
        interaction.reply("pong");
      }
    }
  },
};
