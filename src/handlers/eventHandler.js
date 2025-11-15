// src/handlers/eventHandler.js
const fs = require('fs');
const path = require('path');

function loadEvents(client, eventsPath = path.join(__dirname, '..', 'events')) {
  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const full = path.join(eventsPath, file);
    delete require.cache[require.resolve(full)];
    const event = require(full);
    if (!event || !event.name || typeof event.execute !== 'function') {
      console.warn(`Evento inválido pulado: ${file}`);
      continue;
    }
    if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
    else client.on(event.name, (...args) => event.execute(client, ...args));
  }

  // subpastas opcionais
  const subdirs = fs.readdirSync(eventsPath, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  for (const dir of subdirs) {
    const dirPath = path.join(eventsPath, dir);
    const subFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
    for (const file of subFiles) {
      const full = path.join(dirPath, file);
      delete require.cache[require.resolve(full)];
      const event = require(full);
      if (!event || !event.name || typeof event.execute !== 'function') continue;
      if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
      else client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
}

module.exports = { loadEvents };
