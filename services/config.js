module.exports = function() {
  const { DB_URL, BASE_URL, cloud_name, api_key, api_secret } = process.env;

  if (!DB_URL) throw new Error('DB_URL is not defined.');

  if (!BASE_URL) throw new Error('BASE_URL is not defined.');

  if (!cloud_name) throw new Error('cloud_name is not defined.');

  if (!api_key) throw new Error('api_key is not defined.');

  if (!api_secret) throw new Error('api_secret is not defined.');
};
