# Overview :

This is a bot to handle a Ark Server and a Discord Bot running on the same server

# Dependancy

You need a valid **Node** setup and minimum version of 20.0.0 (you may try lower but it could break)
You need a valid **TypeScript** setup

# Requirement

You will need a server Folder containing 2 .bat file :

- One name `server.bat` starting you server with the desired parameter.
- One name `killserv.bat` killing ShooterGameServer.exe.

## You also need a `config.json` file containing :

```
"token": your discord bot token here,
"clientId": your client Id here,
"guildId": your guild Id here,
"ip": the ip of the ark server,
"password": the password of the ark server,
"port": the port of the RCON port
"channelId" : the id where you want your bots to send message
"pathLog" : complete path where you want log to be store
```

# Starting
You need to run the command `npm i` to install all the dependancy
You need to build the project via using the command `tsc`
You need to do `npm run deploy` the first time use want to use it and every time you add new command.  
You need to do `npm start` to start the bot

# Stop
If you want to stop the bot just to ^C on the terminal and close the ark server instance if you dindn't launch the command before
