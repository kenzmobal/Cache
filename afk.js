/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../events');
const {MessageType} = require('@adiwajshing/baileys');

const Language = require('../language');
const Lang = Language.getString('afk');

var AFK = {
    isAfk: false,
    Reason false,
    lastseen: 0
};

// https://stackoverflow.com/a/37096512
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " " + 'h' + ", " : " " + 'h' + ", ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " " + 'm' + ", " : " " + 'm' + ", ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " " + 's' : " " + 's') : "";
    return hDisplay + mDisplay + sDisplay; 
}

Asena.addCommand({on: 'text', fromMe: false, deleteCommand: false}, (async (message, match) => {   
    if (AFK.isAfk && ((!message.jid.includes('-')) || (message.jid.includes('-') && 
        (( message.mention !== false && message.mention.length !== 0 ) || message.reply_message !== false)))) {
        if (message.jid.includes('-') && (message.mention !== false && message.mention.length !== 0)) {
            message.mention.map(async (jid) => {
                if (message.client.user.jid.split('@')[0] === jid.split('@')[0]) {
                    await message.client.sendMessage(message.jid,'Im *AFK* right now.' +
                    (AFK.reason !== false ? '\n' + 'Reason' + ': ```' + AFK.reason + '```' : '') + 
                    (AFK.lastseen !== 0 ? '\n' + 'Last Seen' + ': ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + ' ago```' : ''), MessageType.text, {quoted: message.data});            
                }
            })
        } else if (message.jid.includes('-') && message.reply_message !== false) {
            if (message.reply_message.jid.split('@')[0] === message.client.user.jid.split('@')[0]) {
                await message.client.sendMessage(message.jid,'Im *AFK* right now.' +
                    (AFK.reason !== false ? '\n' + 'Reason' + ': ```' + AFK.reason + '```' : '') + 
                    (AFK.lastseen !== 0 ? '\n' + 'Last Seen' + ': ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + ' ago```' : ''), MessageType.text, {quoted: message.data});
            }
        } else {
            await message.client.sendMessage(message.jid,'Im *AFK* right now.' +
            (AFK.reason !== false ? '\n' + 'Reason' + ': ```' + AFK.reason + '```' : '') + 
            (AFK.lastseen !== 0 ? '\n' + 'Last Seen' + ': ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + ' ago```' : ''), MessageType.text, {quoted: message.data});    
        }
    }
}));

Asena.addCommand({on: 'text', fromMe: true, deleteCommand: false}, (async (message, match) => {
    if (AFK.isAfk && !message.id.startsWith('3EB0')) {
        AFK.lastseen = 0;
        AFK.reason = false;
        AFK.isAfk = false;

        await message.client.sendMessage(message.jid,Lang.IM_NOT_AFK,MessageType.text);
    }
}));

Asena.addCommand({pattern: 'afkk ?(.*)', fromMe: true, deleteCommand: false, desc: Lang.AFK_DESC}, (async (message, match) => {     
    if (!AFK.isAfk) {
        AFK.lastseen = Math.round((new Date()).getTime() / 1000);
        if (match[1] !== '') { AFK.reason = match[1]; }
        AFK.isAfk = true;

        await message.client.sendMessage(message.jid,Lang.IM_AFK + (AFK.reason !== false ? ('\n' + 'Reason' +': ```' + AFK.reason + '```') : ''),MessageType.text);
    }
}));

module.exports = { secondsToHms };
