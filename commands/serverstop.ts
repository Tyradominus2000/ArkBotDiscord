import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { ServerArk } from "../class/Server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstop")
    .setDescription("stop the ArkServer"),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    server: ServerArk
  ) {
    await interaction.deferReply();
    const state = server.getStatus();

    switch (state) {
      case "START":
      case "STARTING":
        const player = server.rconGetPlayer();
        if (player[0] == "No") {
          await server.rconSaveWorld();

          const result = server.stopServer(interaction.member?.user.id);
          if (result) {
            interaction.editReply("Arrêt du Server");
          } else {
            interaction.editReply("Echec arrêt du Server");
          }
        } else {
          interaction.editReply("Il reste des Joueurs !");
        }
        break;
      case "STOP":
      default:
        interaction.editReply("Serveur déjâ arreté ou en court d'arrêt");
        break;
    }
  },
};
