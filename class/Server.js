const Rcon = require("rcon");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); // Discord.js library
/**
 * The Object representing the Server
 * @author Tyradominus2000
 * @date 20240526
 */
class Server {
  /** @type {boolean} Server State */
  #serverStatus = false;

  /** @type {boolean} Are we connecting the the RconPort */
  #rconAuth = false;

  /** @type {boolean} Is the server starting */
  #serverStarting = false;

  /** @type {Rcon} */
  #rconObject = null;

  /** @type {Client} */
  #discordClient = null;

  /**
   * Initialize the Object (to do every time the bot start)
   * @param {any} rcon
   * @param {Client} client
   */
  constructor(rcon, client) {
    this.#setRconObject(rcon);
    this.#setDiscordClient(client);
    this.#setRconAuth(false);
    this.#setServerStarting(false);
    this.#setServerStatus(false);
  }

  /**
   * SETTER
   */
  /**
   * Set the #rconObject
   * @param {Rcon} rcon
   */
  #setRconObject(rcon) {
    this.#rconObject = new Rcon(
      rcon.host,
      rcon.port,
      rcon.password,
      rcon.options
    );
  }

  /**
   * Set the #discordClient
   * @param {Client} client
   */
  #setDiscordClient(client) {
    this.#discordClient = client;
  }

  /**
   * Change the state of the property serverStatus with state
   * @param {boolean} state
   */
  #setServerStatus(state) {
    this.#serverStatus = state;
  }

  /**
   * Change the state of the property serverStarting with state
   * @param {boolean} state
   */
  #setServerStarting(state) {
    this.#serverStarting = state;
  }

  /**
   * Change the state of the property rconAuth with state
   * @param {boolean} state
   */
  #setRconAuth(state) {
    this.#rconAuth = state;
  }

  /**
   * GETTER
   */
  /**
   * Return the value of #rconObject
   * @returns {Rcon}
   */
  #getRconObject() {
    return this.#rconObject;
  }

  /**
   * Return the value of #discordClient
   * @returns {Client}
   */
  #getDiscordClient() {
    return this.#discordClient;
  }

  /**
   * Return the value of #serverStatus
   * @returns {boolean}
   */
  #getServerStatus() {
    return this.#serverStatus;
  }

  /**
   * Return the value of #serverStarting
   * @returns {boolean}
   */
  #getServerStarting() {
    return this.#serverStarting;
  }

  /**
   * Return the value of #rconAuth
   * @returns {boolean}
   */
  #getRconAuth() {
    return this.#rconAuth;
  }

  /**
   * FUNCTION
   */
  // Send Message
  /**
   * Send a messages in a specifie channels
   * @param {string} channelName
   * @param {string} messageContent
   */
  async sendMessage(channelName, messageContent) {
    console.log(messageContent);
    console.log(channelName);

    const channel = this.#discordClient.channels.cache.find(
      (channel) => channel.name === channelName
    );

    // Send the message
    channel.send(messageContent);
  }

  // Handle The Start of the Server
  async handleStartServer() {
    // Wait for 50 minute
    for (i = 300; !(await server_status()) && ServerStarting; i--) {
      // If 50 minute pass, throw error
      if (i <= 0) {
        console.log("Error Time Out");
        throw "Server n'a pas réussi a s'allumé";
      }
      await wait(10000);
    }
    // If server server as started make serverStarting at false end return true
    ChangeServerStarting(false);
    return true;
  }
  // Send a message back when server started
  async sendMessage(id) {
    try {
      await server_status_startup();
      send_message(global.client, "bots", `<@${id}> Server allumé`);
    } catch (error) {
      send_message(
        global.client,
        "bots",
        `<@${id}> Server n'a pas réussi a s'allumer`
      );
    }
  }

  /**
   * HANDLE THE RCON OBJECT
   */
  async rconAuthentificate() {
    if (!RconAuth) {
      return new Promise((res, rej) => {
        try {
          // Is Auth
          conn.on("auth", () => {
            res(true);
          });
          // Error
          conn.on("error", () => {
            res(false);
          });
          // Connection ended
          conn.on("end", () => {
            res(false);
          });
          if (global.authentificate) {
            conn.connect();
          }
          console.log(conn.hasAuthed);
          res(false);
        } catch (error) {
          rej(error);
        }
      });
    } else {
      return true;
    }
  }

  async rconSendMessageRcon(message) {
    if (RconAuth) {
      conn.send(`serverchat ${message}`);
      return "Message send";
    } else {
      return "Error non Authenticated";
    }
  }
  async rconBroadcast(message) {
    if (RconAuth) {
      conn.send(`broadcast ${message}`);
      return "Broadcast send";
    } else {
      return "Error non Authenticated";
    }
  }
  async rconCommand(message) {
    if (RconAuth) {
      conn.send(message);
      return "Command send";
    } else {
      return "Error non Authenticated";
    }
  }
  async rconKick(player) {
    if (RconAuth) {
      conn.send(`kickplayer ${player}`);
      return `${player} kick`;
    } else {
      return "Error non Authenticated";
    }
  }
  async rconGetPlayer() {
    if (RconAuth) {
      return new Promise((resolve, reject) => {
        let Player;
        conn.send("listplayers");
        conn.on("response", function (str) {
          //console.log("Response: " + str);
          if (typeof str == "string") {
            Player = str.split(" ");
            for (i = 0; i < Player.length; i++) {
              Player[i] = Player[i].replace(/\n/g, "");
              if (Player[i] == "") {
                Player.splice(i, i + 1);
              }
            }
            //console.log(Player);
            resolve(Player);
          }
        });
        conn.on("error", function (err) {
          //console.log("Response: " + err);
          reject(err);
        });
      });
    } else {
      return "Error non Authenticated";
    }
  }
  async rconGetLog() {
    if (RconAuth) {
      conn.send("getchat");
      conn.on("response", function (str) {
        console.log("Response: " + str);
        return str;
      });
      conn.on("error", function (err) {
        console.log("Response: " + err);
        return err;
      });
    } else {
      return "Error non Authenticated";
    }
  }
  async rconSaveWorld() {
    if (RconAuth) {
      conn.send("saveworld");
      return new Promise((resolve, reject) => {
        conn.on("response", function (str) {
          console.log("Response: " + str);
          resolve(str);
        });
        conn.on("error", function (err) {
          console.log("Response: " + err);
          reject(err);
        });
      });
    } else {
      return "Error non Authenticaded";
    }
  }
}

module.exports = {
  Server,
};
