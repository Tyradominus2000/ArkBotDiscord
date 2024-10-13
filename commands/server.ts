import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    await interaction.deferReply();

    const state = server.getStatus();
    switch (state) {
      case "START":
        const player = await server.rconGetPlayer();
        interaction.editReply(
          `Server ON il y a ${(player.length - 1) / 2} joueurs`
        );
        break;
      case "STARTING":
        interaction.editReply(`Server is Starting`);
        break;
      case "STOP":
      default:
        interaction.editReply(`Server OFF`);
        break;
    }
  },
};
