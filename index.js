const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

const NOUNS = ['a', 'e', 'i', 'o', 'u', 'y'];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const helpMessage = `Format your query like this: \`;;generate <letters> <length of desired names> <number of names generated>\`,\nfor example: \`;;generate harrypotter 8 30\``;

client.on('message', (message) => {
  if (message.content === ';;generate help') return message.reply(helpMessage);
  if (!startsWith(';;generate', message.content)) return;
  const command = message.content.split(' ');
  const letters = command[1].split('');
  const nameLength = +command[2];
  let nameCount = +command[3];

  if (Number.isNaN(nameLength)) {
    return message.reply('Invalid name length.');
  }

  if (Number.isNaN(nameCount)) {
    return message.reply('Invalid name count.');
  }

  if (nameLength > 20) {
    return message.reply('Longest name length is 20 characters.');
  }

  if (letters.length > 20) {
    return message.reply('Can use at most 20 letters.');
  }

  if (nameCount > 50) {
    return message.reply('Cannot generate more than 50 names.');
  }

  const permutations = getPermutations(letters, nameLength).map((p) =>
    p.join('')
  );
  const filteredNames = permutations.filter(nameFilter);

  if (filteredNames.length < nameCount) {
    nameCount = filteredNames.length;
  }
  const names = Array.from(Array(nameCount)).map(
    () => filteredNames[getRandomInt(0, filteredNames.length - 1)]
  );

  if (names === []) {
    return message.reply('Name letters / count / length too restrictive.');
  }
  const response = names.map((name) => `\`${name}\``).join(', ');
  message.reply(response);
});

const nameFilter = (name) => {
  let previousVowelCount = 0;
  for (letter of name) {
    if (NOUNS.some((n) => n === letter)) continue;
    previousVowelCount += 1;
    if (letter === ' ') previousVowelCount === 0;
    if (previousVowelCount === 4) return false;
  }
  return true;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPermutations = (array, size) => {
  const p = (t, i) => {
    if (t.length === size) {
      result.push(t);
      return;
    }
    if (i + 1 > array.length) {
      return;
    }
    p(t.concat(array[i]), i + 1);
    p(t, i + 1);
  };

  const result = [];
  p([], 0);
  return result;
};

const startsWith = (prefix, string) => {
  return prefix.split('').reduce((acc, cur, i) => {
    return acc && string[i] === cur;
  }, true);
};

console.log(process.env);
client.login(process.env.DISCORD_BOT_TOKEN);
