async function checkRedis(client, name) {
  const start = Date.now();
  try {
    await client.set('__healthcheck', 'ok', { EX: 5 });
    const value = await client.get('__healthcheck');

    return {
      name,
      status: value === 'ok' ? 'healthy' : 'unhealthy',
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      name,
      status: 'down',
      error: err.message,
    };
  }
}

module.exports = { checkRedis };
