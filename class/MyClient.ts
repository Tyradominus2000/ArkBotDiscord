import * as Discord from "discord.js";

export default class MyClient extends Discord.Client {
  /**
   * List of the command
   */
  public commands: Discord.Collection<string, any>;

  constructor(option: Discord.ClientOptions) {
    super(option);
    this.commands = new Discord.Collection();
  }
}
