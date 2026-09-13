const loginCard = document.querySelector('#login-card');
const editor = document.querySelector('#editor');
const $ = (selector) => document.querySelector(selector);
let client, user;

function setMessage(id, text, kind = '') { const el = $(id); el.textContent = text; el.className = `message ${kind}`; }
function configured() { return window.SUPABASE_URL && window.SUPABASE_ANON_KEY && !window.SUPABASE_URL.includes('YOUR_'); }
async function isAdmin() { const { data } = await client.from('profiles').select('role').eq('id', user.id).single(); return data?.role === 'admin'; }
async function load() { const { data } = await client.from('site_content').select('page_html').eq('id', 'home').single(); $('#page_html').value = data?.page_html || ''; }
async function openEditor() { loginCard.hidden = true; editor.hidden = false; await load(); }
async function restoreSession() { const { data: { session } } = await client.auth.getSession(); if (!session) return; user = session.user; if (!(await isAdmin())) { await client.auth.signOut(); return setMessage('#login-message', '이 계정에는 관리자 권한이 없습니다.', 'error'); } openEditor(); }

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!configured()) return setMessage('#login-message', '먼저 supabase-config.js를 설정하세요.', 'error');
  const { data, error } = await client.auth.signInWithPassword({ email: $('#email').value, password: $('#password').value });
  if (error) return setMessage('#login-message', error.message, 'error');
  user = data.user;
  if (!(await isAdmin())) { await client.auth.signOut(); return setMessage('#login-message', '이 계정에는 관리자 권한이 없습니다.', 'error'); }
  openEditor();
});
$('#html-file').addEventListener('change', async () => { const file = $('#html-file').files[0]; if (!file) return; $('#page_html').value = await file.text(); setMessage('#save-message', `「${file.name}」 파일을 불러왔습니다. 저장을 누르세요.`, 'success'); });
$('#content-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const page_html = $('#page_html').value.trim();
  if (!page_html) return setMessage('#save-message', 'HTML 파일을 업로드하거나 코드를 붙여넣으세요.', 'error');
  $('#save').disabled = true; setMessage('#save-message', '저장 중…');
  const { error } = await client.from('site_content').upsert({ id: 'home', page_html, updated_at: new Date().toISOString() });
  $('#save').disabled = false; setMessage('#save-message', error ? error.message : '저장했습니다. 공개 페이지에 바로 반영됩니다.', error ? 'error' : 'success');
});
$('#logout').addEventListener('click', async () => { await client.auth.signOut(); editor.hidden = true; loginCard.hidden = false; });
if (configured()) { client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY); restoreSession(); } else setMessage('#login-message', 'Supabase 연결 설정이 필요합니다.', 'error');
