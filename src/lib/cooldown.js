const active = new Map(); // key: `${guildId || 'dm'}_${userId}_${command}`

function hasCooldown({ guildId, userId, command, seconds }) {
  const key = `${guildId || 'dm'}_${userId}_${command}`;
  const now = Date.now();
  const expires = active.get(key) || 0;
  if (now < expires) {
    const left = Math.ceil((expires - now) / 1000);
    return { ok: false, left };
  }
  active.set(key, now + (seconds * 1000));
  return { ok: true };
}

function clearCooldown({ guildId, userId, command }) {
  const key = `${guildId || 'dm'}_${userId}_${command}`;
  active.delete(key);
}

module.exports = { hasCooldown, clearCooldown };