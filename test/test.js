const { Server } = require("../class/Server");
const { ip, password, port } = require("../config.json");

const server = new Server({
  host: ip,
  port: port,
  password: password,
  options: {
    tcp: true,
    challenge: false,
  },
});


