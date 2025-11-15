const fs = require('fs');
const path = require('path');

function readFilesRecursively(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...readFilesRecursively(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

function loadCommands(client, commandsPath = path.join(__dirname, '..', 'commands')) {
  client.commands = client.commands || new Map();

  if (!fs.existsSync(commandsPath)) {
    console.warn('Pasta de comandos não encontrada:', commandsPath);
    return client.commands;
  }

  const files = readFilesRecursively(commandsPath);
  for (const full of files) {
    try {
      delete require.cache[require.resolve(full)];
    } catch {}
    try {
      const cmd = require(full);
      if (!cmd || !cmd.name || typeof cmd.execute !== 'function') {
        console.warn(`Comando inválido pulado: ${full}`);
        continue;
      }
      // meta default
      cmd.meta = Object.assign({ cooldown: 5, permissions: [], guildOnly: false }, cmd.meta || {});
      client.commands.set(cmd.name, cmd);
      // optionally expose path for debugging
      cmd._filePath = full;
    } catch (err) {
      console.error('Erro ao carregar comando', full, err);
    }
  }

  return client.commands;
}

module.exports = { loadCommands, readFilesRecursively };
