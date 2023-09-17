# Overview :

This is a bot to handle a ArkServer running on the same server

# Requirement

You will need a server Folder containing 2 .bat file :

- One name `server.bat` starting you server with the desired parameter.
- One name `killserv.bat` killing ShooterGameServer.exe.

## You also need a `config.json` file containing :

```
"token": your discord bot token here,
"clientId": your client Id here,
"guildId": your guild Id here,
"ip": the ip of the arc server,
"password": the password of the ark server,
"port": the port of the RCON port
```

# Starting

You need to do `npm run deploy` the first time use want to use it and every time you add new command.  
You need to do `npm start` to start the bot
