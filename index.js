const Discord = require('discord.js');
const client = new Discord.Client();
const { token } = require('./token.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
  if (!startsWith(';;generate', message.content)) return;
  const letters = message.content.split(' ')[1].split('');
  console.log(letters);
});

const startsWith = (prefix, string) => {
  return prefix.split('').reduce((acc, cur, i) => {
    return acc && string[i] === cur;
  }, true);
};

client.login(token);
