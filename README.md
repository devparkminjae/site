# GitHub Pages + Supabase 사이트

정적 페이지는 GitHub Pages에서, 콘텐츠·로그인·이미지는 Supabase에서 처리합니다. 저장하면 재배포 없이 공개 사이트에 반영됩니다.

## 처음 한 번 설정

1. Supabase에서 프로젝트를 만들고 SQL Editor에서 [`supabase/schema.sql`](supabase/schema.sql)을 실행합니다.
2. Storage에서 `images`라는 **Public** 버킷을 만듭니다.
3. Authentication에서 관리자 계정을 만든 뒤, 해당 UUID로 `profiles`에 `role = 'admin'` 행을 추가합니다.
4. [`supabase-config.example.js`](supabase-config.example.js)를 복사해 루트의 `supabase-config.js`로 만들고 Project URL과 anon key를 입력합니다. service_role 키는 절대 넣지 마세요.
5. `supabase-config.js`를 포함해 GitHub에 푸시한 뒤, GitHub Pages를 `main` 브랜치의 `/root`로 배포합니다. anon key는 브라우저용 공개 키이며, 실제 쓰기 권한은 RLS 정책이 제어합니다.

배포 후 `https://아이디.github.io/저장소이름/admin/`에서 로그인해 콘텐츠를 수정합니다.
