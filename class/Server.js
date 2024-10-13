const { Client } = require("discord.js");
const fs = require("node:fs");
const Rcon = require("rcon");
const { spawn } = require("child_process");

class MessageOutServer {
  //* MESSAGE TO SEND TO USER
  //* Information
  /** @type {string} Message to send when the server as finish to start up */
  static SEND_SERVER_IS_OPEN = "Server ouvert";

  /** @type {string} message to send when the server is already open*/
  static SEND_SERVER_ALREADY_START = "Server déjà démarré";

  /** @type {string} message to send when the server is starting*/
  static SEND_SERVER_STARTING = "Server en cours de démarrage";

  //* Error
  /** @type {string} message to send when the server has failed to start*/
  static SEND_FAIL_TO_START_SERVER = "echec du démarrage du server";

  /** @type {string} message to send when an anomalies occurs (give a error code after it)*/
  static SEND_ERROR_SERVER_START = "Anomalies contacté l'admin, error code :";
}

class MessageInServer {
  //*MESSAGE TO LOOK FOR IN CONSOLE */
  /** @type {string} Message in the console when the server as started*/
  static CONSOLE_SERVER_STARTUP =
    "[ShooterGameMode] - GameState is ready at startup";
}

class TypeMessage {
  /**
   * Error Message
   */
  static Error = "41";

  /**
   * Info Message
   */
  static Information = "44";

  /**
   * Basic Message
   */
  static Basic = "37";
}

/**
 * The Object representing the Server
 * @author Tyradominus2000
 * @date 20240526
 */
class ServerArk {
  /** @type {bool} Server State */
  #serverStatus = false;

  /** @type {bool} Are we connecting to the RconPort */
  #rconAuth = false;

  /** @type {bool} Is the server starting */
  #serverStarting = false;

  /** @type {Rcon} */
  #rconObject = null;

  /** @type {Client} */
  #discordClient = null;

  /** @type {String} the path for the folder of the log */
  #pathfileLog = null;

  /** @type {String} the name of the channel where the bot can interact */
  #channelName = null;

  /**
   * Initialize the Object
   * @param {RconParam} rcon
   * @param {ClientDiscord} client
   * @param {String} path path for the folder where to write log
   * @param {String} channelNamme name of the channel where you want the bot to interact
   */
  constructor(rcon, client, path, channelNamme) {
    this.#setRconObject(rcon);
    this.#setDiscordClient(client);
    this.#setPathFileLog(path);
    this.#setChannel(channelNamme);

    this.#setRconAuth(false);
    this.#setServerStatus(false);
    this.#setServerStarting(false);
  }

  /**
   * SETTER
   */
  /**
   * Set the #rconObject
   * @param {RconParam} rcon
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
   * @param {ClientDiscord} client
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
   * Set the path for the log
   * @param {String} path
   */
  #setPathFileLog(path) {
    this.#pathfileLog = path;
  }

  /**
   * Set the name of the channel
   * @param {String} name
   */
  #setChannel(name) {
    this.#channelName = name;
  }

  /**
   * FUNCTION
   */
  /**
   * Start the server and start the log process
   * @param {String} idUser the identifier of the discord user
   */
  handleServer(idUser) {
    const server = this;
    server.handleLog(
      `Function : handleServer call by ${idUser}`,
      TypeMessage.Information
    );

    // Server is Starting
    if (server.#serverStarting === true) {
      server.handleLog(
        `Try to Start Server but already starting by ${idUser}`,
        TypeMessage.Information
      );
      server.sendMessage(
        server.#channelName,
        `<@${idUser}> ${MessageOutServer.SEND_SERVER_STARTING}`
      );
      return;
    }
    // Server is On
    if (server.#serverStatus === true) {
      server.handleLog(
        `Try to Start Server but Server already start by ${idUser}`,
        TypeMessage.Information
      );
      server.sendMessage(
        server.#channelName,
        `<@${idUser}> ${MessageOutServer.SEND_SERVER_ALREADY_START}`
      );
      return;
    }

    const batFile = spawn("cmd.exe", ["../server/server.bat"]);
    server.handleLog(`Starting Server`, TypeMessage.Information);

    // Check the data send by the server and print it
    batFile.stdout.on("data", (data) => {
      server.handleLog(`Server : ${data}`, TypeMessage.Basic);
      // When the server has started
      if (data.toString().includes(MessageInServer.CONSOLE_SERVER_STARTUP)) {
        server.#setServerStarting(false);
        server.#setServerStatus(true);
        server.sendMessage(
          server.#channelName,
          `<@${idUser}> ${MessageOutServer.SEND_SERVER_IS_OPEN}`
        );
      }
    });

    // When an error is send (send it in console with red background)
    batFile.stderr.on("data", (error) => {
      server.handleLog(`Error Server : ${error}`, TypeMessage.Error);
    });

    // When the server close (send it in console with blue background)
    batFile.on("close", (code) => {
      server.handleLog(`Exit with code ${code}`, TypeMessage.Information);
    });
  }

  /**
   * Close the server
   * @param {String} idUser the identifier of the discord user
   * @return {Boolean}
   */
  stopServer(idUser) {
    const server = this;
    server.handleLog(
      `Function : stopServer call by ${idUser}`,
      TypeMessage.Information
    );
    try {
      spawn("cmd.exe", ["../server/killserv.bat"]);
      server.handleLog(`Server : Stop the server`, TypeMessage.Information);
      return true;
    } catch (error) {
      server.handleLog(
        `Error : fail to stop the server`,
        TypeMessage.Information
      );
      return false;
    }
  }

  /**
   * Return the status of server
   * @returns {'START'|'STARTING'|'STOP'}
   */
  getStatus() {
    const server = this;

    if (server.#serverStatus) {
      return "START";
    }
    if (server.#serverStarting) {
      return "STARTING";
    }
    return "STOP";
  }

  /**
   * If the Discord client is on
   * @param {string} name the name of the function that check the client status
   * @returns {Boolean}
   */
  isClientOn(name) {
    const server = this;

    server.handleLog(`Function : isClientOn call`, TypeMessage.Information);
    if (!server.#discordClient.readyAt) {
      server.handleLog(
        `Intern Error : Client is not on - call by ${name}`,
        TypeMessage.Error
      );
      return false;
    } else {
      return true;
    }
  }

  /**
   * Send a messages in a specifie channels
   * @param {string} channelName
   * @param {string} messageContent
   */
  sendMessage(channelName, messageContent) {
    const server = this;
    server.handleLog(`Function : sendMessage call`, TypeMessage.Information);

    if (server.isClientOn(this.sendMessage.name)) {
      const channel = server.#discordClient?.channels?.cache?.find(
        (channel) => channel.name === channelName
      );
      if (channel !== undefined) {
        server.handleLog(
          `Sending a message in the channel : ${channelName} with content : ${messageContent}`,
          TypeMessage.Information
        );
        channel.send(messageContent);
      } else {
        server.handleLog(
          `Intern Error : Couldn't find channel ${channelName}`,
          TypeMessage.Error
        );
      }
    }
  }

  /**
   * HANDLE THE RCON OBJECT
   */
  /**
   * Authentificate to the rcon port
   * @returns {boolean}
   */
  rconAuthentificate() {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(
      `Function : rconAuthentificate call`,
      TypeMessage.Information
    );

    try {
      rcon.connect();
      server.handleLog(`Rcon : Connecting to Rcon `, TypeMessage.Information);
      return true;
    } catch (error) {
      server.handleLog(`Error : Fail to connect to Rcon`, TypeMessage.Error);
      return false;
    }
  }

  /**
   * Send a message into the chat of the server
   * @param {string} message content of the message
   * @returns {boolean}
   */
  rconSendMessage(message) {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(
      `Function : rconSendMessage call`,
      TypeMessage.Information
    );

    if (server.#rconAuth) {
      rcon.send(`serverchat ${message}`);
      server.handleLog(
        `Rcon : send message via Rcon - ${message}`,
        TypeMessage.Information
      );
      return true;
    } else {
      server.handleLog(
        `Error : fail to send message - ${message}`,
        TypeMessage.Error
      );
      return false;
    }
  }

  /**
   * Send a broadcast into the chat of the server
   * @param {string} message content of the message
   * @returns {boolean}
   */
  rconBroadcast(message) {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(`Function : rconBroadcast call`, TypeMessage.Information);

    if (server.#rconAuth) {
      rcon.send(`broadcast ${message}`);
      server.handleLog(
        `Rcon : broadcast message via Rcon - ${message}`,
        TypeMessage.Information
      );
      return true;
    } else {
      server.handleLog(
        `Error : fail to broadcast message via Rcon - ${message}`,
        TypeMessage.Error
      );
      return false;
    }
  }

  /**
   * Send a command to the server
   * @param {string} command the command to send
   * @param {string|null} message content of the message
   * @returns
   */
  rconCommand(command, message) {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(`Function : rconCommand call`, TypeMessage.Information);

    if (server.#rconAuth) {
      rcon.send(command + (message ?? ""));
      server.handleLog(
        `Rcon : send command via Rcon - ${command + (message ?? "")}`,
        TypeMessage.Information
      );
      return true;
    } else {
      server.handleLog(
        `Error : fail to send command via Rcon - ${command + (message ?? "")}`,
        TypeMessage.Error
      );
      return false;
    }
  }

  /**
   * Kick a player
   * @param {int} idPlayer steam identificator of the player to kick
   * @returns {boolean}
   */
  rconKick(idPlayer) {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(`Function : rconKick call`, TypeMessage.Information);
    if (server.#rconAuth) {
      rcon.send(`kickplayer ${idPlayer}`);
      server.handleLog(
        `Rcon : kick player via Rcon - ${idPlayer}`,
        TypeMessage.Information
      );
      return true;
    } else {
      server.handleLog(
        `Error : fail to kick player via Rcon - ${idPlayer}`,
        TypeMessage.Error
      );
      return false;
    }
  }

  /**
   * Get the list of player
   * @returns {Promise<Array>}
   */
  async rconGetPlayer() {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(`Function : rconGetPlayer call`, TypeMessage.Information);

    if (server.#rconAuth) {
      return new Promise((resolve, reject) => {
        let Player;
        rcon.send("listplayers");
        rcon.on("response", function (playerList) {
          Player = playerList.split(" ");
          server.handleLog(
            `Rcon : get player via Rcon`,
            TypeMessage.Information
          );
          resolve(Player);
        });
        rcon.on("error", function (err) {
          server.handleLog(
            `Rcon : fail to get player via Rcon`,
            TypeMessage.Error
          );
          reject(err);
        });
      });
    } else {
      return false;
    }
  }

  // async rconGetLog() {
  //   if (RconAuth) {
  //     conn.send("getchat");
  //     conn.on("response", function (str) {
  //       return str;
  //     });
  //     conn.on("error", function (err) {
  //       return err;
  //     });
  //   } else {
  //     return "Error non Authenticated";
  //   }
  // }

  /**
   * Save the world of the server
   * @returns {Promise<Boolean>}
   */
  async rconSaveWorld() {
    const server = this;
    const rcon = server.#rconObject;
    server.handleLog(`Function : rconSaveWorld call`, TypeMessage.Information);

    if (server.#rconAuth) {
      rcon.send("saveworld");
      return new Promise((resolve, reject) => {
        rcon.on("response", function (str) {
          server.handleLog(
            `Rcon : save world via Rcon`,
            TypeMessage.Information
          );
          resolve(true);
        });
        rcon.on("error", function (err) {
          server.handleLog(
            `Error : fail to save world via Rcon`,
            TypeMessage.Error
          );
          reject(false);
        });
      });
    } else {
      return false;
    }
  }

  /**
   * Handle the log (make a console log and write it into a file)
   * @param {String} text text to log
   * @param {TypeMessage} type type of the message
   */
  handleLog(text, type) {
    const server = this;
    const date = ServerArk.getDate();
    const time = ServerArk.getTime();

    const content = time.concat(" ", text);
    console.log(`${time}\x1b[${type}m ${text} \x1b[0m`);
    fs.writeFile(
      server.#pathfileLog.concat(date, ".txt"),
      "\n".concat(content),
      { flag: "a" },
      (err) => {
        if (err) {
          console.error(
            `${time}\x1b[${
              TypeMessage.Error
            }m Fail to write log in file : ${server.#pathfileLog.concat(
              date,
              ".txt"
            )} with content : ${text} - ${err} \x1b[0m`
          );
        }
      }
    );
  }

  /**
   * Get the date
   * @returns {String} format Y-m-d
   */
  static getDate() {
    const time = new Date();

    let day = time.getDate().toString();
    day = day.padStart(2, "0");
    let month = time.getMonth().toString();
    month = month.padStart(2, "0");

    const year = time.getFullYear();

    return `${year}-${month}-${day}`;
  }

  /**
   * Get the time
   * @returns {string} format H:i:s.u
   */
  static getTime() {
    const time = new Date();

    let hour = time.getHours();
    hour = hour.toString().padStart(2, "0");
    let minute = time.getMinutes();
    minute = minute.toString().padStart(2, "0");
    let second = time.getSeconds();
    second = second.toString().padStart(2, "0");
    const millisecond = time.getMilliseconds();

    return `[${hour}:${minute}:${second}.${millisecond}]`;
  }
}

module.exports = {
  ServerArk,
  TypeMessage,
};
