import * as Discord from "discord.js";
import fs from "node:fs";
import Rcon from "rcon";
import { spawn } from "child_process";

export class MessageOutServer {
  //* MESSAGE TO SEND TO USER
  //* Information
  /** Message to send when the server as finish to start up */
  static SEND_SERVER_IS_OPEN: string = "Server ouvert";

  /** message to send when the server is already open*/
  static SEND_SERVER_ALREADY_START: string = "Server déjà démarré";

  /** message to send when the server is starting*/
  static SEND_SERVER_STARTING: string = "Server en cours de démarrage";

  //* Error
  /** message to send when the server has failed to start*/
  static SEND_FAIL_TO_START_SERVER: string = "echec du démarrage du server";

  /** message to send when an anomalies occurs (give a error code after it)*/
  static SEND_ERROR_SERVER_START: string =
    "Anomalies contacté l'admin, error code :";
}

export class MessageInServer {
  //*MESSAGE TO LOOK FOR IN CONSOLE */
  /** @type Message in the console when the server as started*/
  static CONSOLE_SERVER_STARTUP: string =
    "[ShooterGameMode] - GameState is ready at startup";
}

export class TypeMessage {
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
export class ServerArk {
  /** Server State */
  private serverStatus: boolean = false;

  /** Are we connecting to the RconPort */
  private rconAuth: boolean = false;

  /** Is the server starting */
  private serverStarting: boolean = false;

  private rconObject: Rcon = null;

  private discordClient: Discord.Client = null;

  /* the path for the folder of the log */
  private pathfileLog: string = null;

  /** the id of the channel where the bot can interact */
  private channelId: string = null;

  /**
   * Initialize the Object
   * @param {RconParam} rcon
   * @param {Discord.Client} client
   * @param {string} path path for the folder where to write log
   * @param {string} channelId name of the channel where you want the bot to interact
   */
  constructor(
    rcon: RconParam,
    client: Discord.Client,
    path: string,
    channelId: string
  ) {
    this.setRconObject(rcon);
    this.setDiscordClient(client);
    this.setPathFileLog(path);
    this.setChannel(channelId);

    this.setRconAuth(false);
    this.setServerStatus(false);
    this.setServerStarting(false);
  }

  /**
   * SETTER
   */
  /**
   * Set the #rconObject
   * @param {RconParam} rcon
   */
  private setRconObject(rcon: RconParam) {
    this.rconObject = new Rcon(
      rcon.host,
      rcon.port,
      rcon.password,
      rcon.options
    );
  }

  /**
   * Set the #discordClient
   * @param {Discord.Client} client
   */
  private setDiscordClient(client: Discord.Client) {
    this.discordClient = client;
  }

  /**
   * Change the state of the property serverStatus with state
   * @param {boolean} state
   */
  private setServerStatus(state: boolean) {
    this.serverStatus = state;
  }

  /**
   * Change the state of the property serverStarting with state
   * @param {boolean} state
   */
  private setServerStarting(state: boolean) {
    this.serverStarting = state;
  }

  /**
   * Change the state of the property rconAuth with state
   * @param {boolean} state
   */
  private setRconAuth(state: boolean) {
    this.rconAuth = state;
  }

  /**
   * Set the path for the log
   * @param {string} path
   */
  private setPathFileLog(path: string) {
    this.pathfileLog = path;
  }

  /**
   * Set the name of the channel
   * @param {string} name
   */
  private setChannel(name: string) {
    this.channelId = name;
  }

  /**
   * FUNCTION
   */
  /**
   * Start the server and start the log process
   * @param {string|undefined} idUser the identifier of the discord user
   */
  public handleServer(idUser: string | undefined) {
    const server = this;
    server.handleLog(
      `Function : handleServer call by ${idUser}`,
      TypeMessage.Information
    );

    // Server is Starting
    if (server.serverStarting === true) {
      server.handleLog(
        `Try to Start Server but already starting by ${idUser}`,
        TypeMessage.Information
      );
      server.sendMessage(
        server.channelId,
        `<@${idUser}> ${MessageOutServer.SEND_SERVER_STARTING}`
      );
      return;
    }
    // Server is On
    if (server.serverStatus === true) {
      server.handleLog(
        `Try to Start Server but Server already start by ${idUser}`,
        TypeMessage.Information
      );
      server.sendMessage(
        server.channelId,
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
      if (data.tostring().includes(MessageInServer.CONSOLE_SERVER_STARTUP)) {
        server.setServerStarting(false);
        server.setServerStatus(true);
        server.sendMessage(
          server.channelId,
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
   * @param {string|undefined} idUser the identifier of the discord user
   * @return {boolean}
   */
  public stopServer(idUser: string | undefined): boolean {
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
  public getStatus(): "START" | "STARTING" | "STOP" {
    const server = this;

    if (server.serverStatus) {
      return "START";
    }
    if (server.serverStarting) {
      return "STARTING";
    }
    return "STOP";
  }

  /**
   * If the Discord client is on
   * @param {string} name the name of the function that check the client status
   * @returns {boolean}
   */
  public isClientOn(name: string): boolean {
    const server = this;

    server.handleLog(`Function : isClientOn call`, TypeMessage.Information);
    if (!server.discordClient.readyAt) {
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
  public sendMessage(channelName: string, messageContent: string) {
    const server = this;
    server.handleLog(`Function : sendMessage call`, TypeMessage.Information);

    if (server.isClientOn(this.sendMessage.name)) {
      server.discordClient?.channels
        ?.fetch(channelName)
        .then((channel: Discord.TextChannel) => {
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
        });
    }
  }

  /**
   * HANDLE THE RCON OBJECT
   */
  /**
   * Authentificate to the rcon port
   * @returns {boolean}
   */
  public rconAuthentificate(): boolean {
    const server = this;
    const rcon = server.rconObject;
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
  public rconSendMessage(message: string): boolean {
    const server = this;
    const rcon = server.rconObject;
    server.handleLog(
      `Function : rconSendMessage call`,
      TypeMessage.Information
    );

    if (server.rconAuth) {
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
  public rconBroadcast(message: string): boolean {
    const server = this;
    const rcon = server.rconObject;
    server.handleLog(`Function : rconBroadcast call`, TypeMessage.Information);

    if (server.rconAuth) {
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
  public rconCommand(command: string, message: string | null) {
    const server = this;
    const rcon = server.rconObject;
    server.handleLog(`Function : rconCommand call`, TypeMessage.Information);

    if (server.rconAuth) {
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
   * @param {Number} idPlayer steam identificator of the player to kick
   * @returns {boolean}
   */
  public rconKick(idPlayer: Number): boolean {
    const server = this;
    const rcon = server.rconObject;
    server.handleLog(`Function : rconKick call`, TypeMessage.Information);
    if (server.rconAuth) {
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
  public async rconGetPlayer(): Promise<Array<any>> {
    const server = this;
    const rcon = server.rconObject;
    server.handleLog(`Function : rconGetPlayer call`, TypeMessage.Information);

    return new Promise((resolve, reject) => {
      if (server.rconAuth) {
        let Player: Array<any>;
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
      } else {
        return false;
      }
    });
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
   * @returns {Promise<boolean>}
   */
  public async rconSaveWorld(): Promise<boolean> {
    const server = this;
    const rcon = server.rconObject;
    server.handleLog(`Function : rconSaveWorld call`, TypeMessage.Information);

    if (server.rconAuth) {
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
   * @param {string} text text to log
   * @param {TypeMessage} type type of the message
   */
  public handleLog(text: string, type: TypeMessage) {
    const server = this;
    const date = ServerArk.getDate();
    const time = ServerArk.getTime();

    const content = time.concat(" ", text);
    console.log(`${time}\x1b[${type}m ${text} \x1b[0m`);
    fs.writeFile(
      server.pathfileLog.concat(date, ".txt"),
      "\n".concat(content),
      { flag: "a" },
      (err) => {
        if (err) {
          console.error(
            `${time}\x1b[${
              TypeMessage.Error
            }m Fail to write log in file : ${server.pathfileLog.concat(
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
   * @returns {string} format Y-m-d
   */
  public static getDate(): string {
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
  public static getTime(): string {
    const time = new Date();

    let hour = time.getHours().toString();
    hour = hour.padStart(2, "0");
    let minute = time.getMinutes().toString();
    minute = minute.padStart(2, "0");
    let second = time.getSeconds().toString();
    second = second.padStart(2, "0");
    const millisecond = time.getMilliseconds();

    return `[${hour}:${minute}:${second}.${millisecond}]`;
  }
}
