const Rcon = require("rcon");
const { ip, password, port } = require("../config.json");
const { RconAuth } = require("../constants/constants");

const options = {
  tcp: true,
  challenge: false,
};
const conn = new Rcon(ip, port, password, options);
async function authentificate() {
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

async function send_message_rcon(message) {
  if (RconAuth) {
    conn.send(`serverchat ${message}`);
    return "Message send";
  } else {
    return "Error non Authenticated";
  }
}
async function broadcast(message) {
  if (RconAuth) {
    conn.send(`broadcast ${message}`);
    return "Broadcast send";
  } else {
    return "Error non Authenticated";
  }
}
async function command(message) {
  if (RconAuth) {
    conn.send(message);
    return "Command send";
  } else {
    return "Error non Authenticated";
  }
}
async function kick(player) {
  if (RconAuth) {
    conn.send(`kickplayer ${player}`);
    return `${player} kick`;
  } else {
    return "Error non Authenticated";
  }
}
async function get_player() {
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
async function get_log() {
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
async function save_world() {
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

module.exports = {
  authentificate: authentificate,
  send_message_rcon: send_message_rcon,
  broadcast: broadcast,
  command: command,
  kick: kick,
  get_player: get_player,
  get_log: get_log,
  save_world: save_world,
};
