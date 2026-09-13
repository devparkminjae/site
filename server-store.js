/* Public, read-only values stored in Supabase. Do not store secrets here. */
(async () => {
  const script = document.currentScript;
  const base = new URL('.', script.src);
  const config = await import(`${base}supabase-config.js`).catch(() => null);
  const url = config?.SUPABASE_URL || window.SUPABASE_URL;
  const key = config?.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY;
  const parts = location.pathname.split('/').filter(Boolean);
  const repo = parts.indexOf('site');
  const siteId = repo >= 0 && parts[repo + 1] && parts[repo + 1] !== 'admin' ? parts[repo + 1] : 'home';
  const client = window.supabase?.createClient(url, key);
  const read = async (name, fallback = null) => {
    if (!client) return fallback;
    const { data } = await client.from('site_variables').select('value').eq('site_id', siteId).eq('key', name).single();
    return data?.value ?? fallback;
  };
  const post = async (name, value) => { if (!client) throw new Error('Supabase 연결이 필요합니다.'); const { error } = await client.from('site_variables').upsert({ site_id: siteId, key: name, value, updated_at: new Date().toISOString() }); if (error) throw error; return value; };
  window.SiteStore = Object.freeze({ siteId, get: read, post, list: async (name) => { const value = await read(name, []); return Array.isArray(value) ? value : []; }, all: async () => { if (!client) return {}; const { data } = await client.from('site_variables').select('key,value').eq('site_id', siteId); return Object.fromEntries((data || []).map(row => [row.key, row.value])); } });
  window.dispatchEvent(new Event('site-store-ready'));
})();
