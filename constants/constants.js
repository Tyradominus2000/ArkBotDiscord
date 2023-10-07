let ServerStatus = false; //Server State
let RconAuth = false; //Rcon Auth State
let ServerStarting = false; //Server Starting state
function ChangeServerStatus(NewState) {
  ServerStatus = NewState;
}
function ChangeServerStarting(NewState) {
  ServerStarting = NewState;
}
function ChangeRconAuth(NewState) {
  RconAuth = NewState;
}

module.exports = {
  ChangeRconAuth,
  ChangeServerStarting,
  ChangeServerStatus,
  ServerStarting,
  ServerStatus,
  RconAuth,
};
