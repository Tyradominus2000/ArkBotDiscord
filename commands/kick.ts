import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription(
      "Kick the player with is SteamID you can get if by doing /showplayer"
    )
    .addIntegerOption((options) =>
      options
        .setName("player")
        .setDescription("SteamID of the player do /showplayer to get it")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    const player = interaction.options.getInteger("player");
    const result = server.rconKick(player);

    if (result) {
      interaction.reply(`Kick player :${player}`);
    } else {
      interaction.reply(`Fail to kick player : ${player}`);
    }
  },
};
