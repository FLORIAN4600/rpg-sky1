"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const fs_1 = require("fs");
console.log("Loading...");
const client = new discord_js_selfbot_v13_1.Client();
const commands = JSON.parse((0, fs_1.readFileSync)("resources/commands.json", "utf-8"));
const infos = JSON.parse((0, fs_1.readFileSync)("ressources/infos.json", "utf-8"));
var isDead = true;
client.on("debug", console.log);
client.normalLogin(infos["email"], infos["password"], "");
isDead = false;
console.log(client);
console.log("client initiated");
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var i = 0;
    commands.forEach(server => {
        server["commands"].forEach(command => {
            var strJson = JSON.stringify(command["command"]);
            if (strJson.startsWith("[") && strJson.endsWith("]")) {
                command["command"].forEach(cmd => {
                    i += 1;
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { addCommand(server, command, cmd); }), 2055 * i);
                });
            }
            else {
                i += 1;
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return addCommand(server, command, command["command"]); }), 2055 * i);
            }
        });
    });
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if ("``--*/*/\"\"stopdabot\"\"\\*\\*--``" == message.content) {
        message.channel.send("STOPPING");
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            isDead = true;
            client.logout();
        }), 253);
    }
}));
function addCommand(server, command, cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command["type"] == "slash" || command["type"] == "/") {
            var args = [];
            if (command.hasOwnProperty("args")) {
                args = command["args"];
            }
            sendSlashCommand(command["cooldown"], server["channel_id"], command["bot_id"], cmd, ...args);
        }
        else {
            sendCommand(command["cooldown"], server["channel_id"], cmd);
        }
    });
}
function sendSlashCommand(cooldown, channelId, botId, command, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isDead) {
            const channel = yield client.channels.cache.get(channelId);
            if (undefined != channel && !isDead) {
                try {
                    channel.sendSlash(botId, command, ...args);
                }
                catch (_a) {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () { return channel.send("woopsie, typo ^^\'"); }), cooldown * 1000);
                }
                setTimeout(() => __awaiter(this, void 0, void 0, function* () { return sendSlashCommand(cooldown, channelId, botId, command, ...args); }), cooldown * 1000);
            }
        }
    });
}
function sendCommand(cooldown, channelId, command) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isDead) {
            const channel = yield client.channels.cache.get(channelId);
            if (undefined != channel && !isDead) {
                channel.send(command);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () { return sendCommand(cooldown, channelId, command); }), cooldown * 1000);
            }
        }
    });
}
