# 사이트 저장 변수와 리스트

관리자 페이지의 **저장 변수 / 리스트** 영역에서 사이트별 데이터를 저장할 수 있습니다. 데이터는 Supabase에 저장되므로 페이지를 새로 열어도 유지됩니다.

> 이 데이터는 방문자가 읽을 수 있습니다. 비밀번호, API secret, 개인정보는 저장하지 마세요.

## 관리자에서 저장하기

1. `/admin/`에서 편집할 사이트를 선택합니다.
2. 변수 이름을 입력합니다. 영문, 숫자, `_`, `-`만 사용할 수 있습니다.
3. 값에 JSON을 입력하고 저장합니다.

JSON 예시:

```json
"환영합니다"
```

```json
42
```

```json
true
```

리스트 예시:

```json
["사과", "바나나", "포도"]
```

객체 예시:

```json
{ "name": "민재", "theme": "green" }
```

## HTML 코드에서 불러오기

저장한 HTML 파일의 `</body>` 바로 앞에 아래 두 줄을 넣으세요. `site` 부분은 GitHub 저장소 이름입니다.

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="https://devparkminjae.github.io/site/server-store.js"></script>
```

그 다음 JavaScript에서 사용합니다. `site-store-ready` 이벤트 뒤에는 `SiteStore`를 사용할 수 있습니다.

```html
<script>
  window.addEventListener('site-store-ready', async () => {
    const message = await SiteStore.get('welcome_message', '기본 문구');
    document.querySelector('#message').textContent = message;
  });
</script>
```

리스트는 `SiteStore.list()`로 읽습니다.

```html
<ul id="menu"></ul>
<script>
  window.addEventListener('site-store-ready', async () => {
    const items = await SiteStore.list('menu_items');
    document.querySelector('#menu').innerHTML = items
      .map(item => `<li>${item}</li>`)
      .join('');
  });
</script>
```

모든 값을 한 번에 읽으려면 `SiteStore.all()`을 사용합니다.

```js
const variables = await SiteStore.all();
console.log(variables.welcome_message);
```

`SiteStore.get('이름', 기본값)`은 값이 없을 때 기본값을 반환합니다.

## API처럼 GET / POST 사용하기

`server-store.js`를 포함하면 아래 함수가 API 역할을 합니다.

```js
// GET: 공개 데이터 읽기
const value = await SiteStore.get('welcome_message', '기본 문구');

// GET: 리스트 읽기
const items = await SiteStore.list('menu_items');

// POST: 값 저장 (관리자 로그인 세션에서만 가능)
await SiteStore.post('welcome_message', '새 문구');
await SiteStore.post('menu_items', ['사과', '바나나']);
```

`POST`는 관리자 권한을 가진 로그인 상태에서만 성공합니다. 일반 방문자가 마음대로 저장하지 못하도록 Supabase 정책이 막습니다. 일반 방문자의 댓글·주문처럼 공개 쓰기가 필요한 API는 스팸 방지와 별도 권한 설계가 필요하므로, 별도 요청으로 추가하세요.
