import { Client } from "discord.js-selfbot-v13";
import { readFileSync } from "fs";

console.log("Loading...");


const client = new Client();
const commands = JSON.parse(readFileSync("resources/commands.json", "utf-8"));
const infos = JSON.parse(readFileSync("resources/infos.json", "utf-8"));
var isDead: boolean = true;

client.on("debug", console.log);

client.normalLogin(infos["email"], infos["password"], "")

isDead = false;

console.log(client);

console.log("client initiated");


client.on("ready", async () => {
  var i: number = 0
  commands.forEach(server => {
    server["commands"].forEach(command => {
      var strJson: string = JSON.stringify(command["command"]);
      if (strJson.startsWith("[") && strJson.endsWith("]")) {
        command["command"].forEach(cmd => {
          i += 1;
          setTimeout(async () => { addCommand(server, command, cmd) }, 2055 * i);
        })
      } else {
        i += 1;
        setTimeout(async () => addCommand(server, command, command["command"]), 2055 * i);
      }
    });
  });
});

client.on("messageCreate", async message => {
  if ("``--*/*/\"\"stopdabot\"\"\\*\\*--``" == message.content) {
    message.channel.send("STOPPING");
    setTimeout(async () => {
      isDead = true;
      client.logout();
    }, 253);
  }
});

async function addCommand(server: any, command: any, cmd: string) {
  if (command["type"] == "slash" || command["type"] == "/") {
    var args = [];
    if (command.hasOwnProperty("args")) {
      args = command["args"]
    }
    sendSlashCommand(command["cooldown"], server["channel_id"], command["bot_id"], cmd, ...args);
  } else {
    sendCommand(command["cooldown"], server["channel_id"], cmd);
  }
}

async function sendSlashCommand(cooldown: number, channelId: string, botId: string, command: string, ...args: string[]) {
  if (!isDead) {
    const channel = await client.channels.cache.get(channelId);
    if (undefined != channel && !isDead) {
      try {
        channel.sendSlash(botId, command, ...args);
      } catch {
        setTimeout(async () => channel.send("woopsie, typo ^^\'"), cooldown * 1000)
      }
      setTimeout(async () => sendSlashCommand(cooldown, channelId, botId, command, ...args), cooldown * 1000);
    }
  }
}

async function sendCommand(cooldown: number, channelId: string, command: string) {
  if (!isDead) {
    const channel = await client.channels.cache.get(channelId);
    if (undefined != channel && !isDead) {
      channel.send(command);
      setTimeout(async () => sendCommand(cooldown, channelId, command), cooldown * 1000);
    }
  }
}
