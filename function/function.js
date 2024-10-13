/**
 * @deprecated
 */

const wait = require("node:timers/promises").setTimeout;
const {
  ServerStarting,
  ChangeServerStarting,
} = require("../class/Server");
const { authentificate } = require("./rcon");

// Return Server Status
async function server_status() {
  return await authentificate();
}
// Send Message
async function send_message(clients, channels, messages) {
  console.log(messages);
  console.log(channels);
  const generalChannel = clients.channels.cache.find(
    (channel) => channel.name === channels
  );
  generalChannel.send(messages);
}

// Handle The Start of the Server
async function server_status_startup() {
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
async function server_status_client(id) {
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

module.exports = {
  server_status: server_status,
  send_message: send_message,
  server_status_startup: server_status_startup,
  server_status_client: server_status_client,
};
