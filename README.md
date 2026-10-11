# 블로그매니저 — Netlify 버전

음식장사 블로그의 연재 계획, 원고, 2~3장 사진, 최대 10개 네이버 블로그와 발행 일정을 관리합니다. 기존 디자인과 브라우저 저장 형식을 유지합니다.

## Netlify 연결

1. Netlify에서 **Add new project → Import an existing project → GitHub**를 선택합니다.
2. **goldriver365k/blog** 저장소를 선택합니다.
3. 설정은 `netlify.toml`에서 자동 적용됩니다. Build command는 `npm run build`, Publish directory는 `dist`, Functions directory는 `netlify/functions`입니다.
4. 프로젝트의 **Project configuration → Environment variables**에서 아래 값을 등록합니다. 범위를 고를 수 있다면 Functions를 포함하고 Production에 적용합니다.

| 이름 | 값 |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI에서 발급한 새 API 키 |
| `BLOG_MANAGER_PASSWORD` | 본인이 정한 12~256자 관리자 비밀번호. API 키나 네이버 비밀번호와 다른 값 |
| `OPENAI_MODEL` | 선택 사항. 기본 `gpt-4.1-mini` |

5. 값은 비밀값으로 설정합니다. 코드, GitHub, 채팅에 실제 키나 비밀번호를 넣지 마세요.
6. 저장 후 **Deploys**에서 새 배포를 실행합니다.
7. HTTPS 사이트를 열고 **블로그·설정 → OpenAI 연결 확인**에서 관리자 비밀번호로 로그인합니다. 원고 작업의 **OpenAI로 원고 생성**으로 실제 생성을 확인합니다.

파일 끌어놓기만으로는 Functions 서버를 배포할 수 없으므로 GitHub 연동 배포를 사용하세요. API 키를 브라우저에 입력하는 메뉴는 없습니다. 키는 Netlify 서버에서만 사용합니다. 관리자 비밀번호 미등록 시 서버 API는 사용되지 않습니다.

## 기존 원고 이동

기존 사이트에서 **백업 다운로드**를 누르고, 새 사이트의 **블로그·설정 → 백업 복원**에서 파일을 선택합니다. 주소가 바뀌면 브라우저 저장 공간도 달라져 자동 이전되지 않습니다. 백업 파일에 개인정보가 있다면 GitHub에 업로드하지 마세요.

## 비용과 제한

- 별도 데이터베이스, OpenAI SDK, 추가 npm 패키지 없이 동작합니다.
- 원고 생성 버튼을 누를 때만 OpenAI를 호출하고 자동 재시도하지 않습니다. 기본은 응답이 빠른 `gpt-4.1-mini`, 최대 출력 4,000토큰입니다.
- Netlify 동기 Functions의 60초 제한 안에서 동작하도록 OpenAI 연결을 50초에 중단합니다. 시간 초과된 요청도 OpenAI에서 처리됐을 수 있으므로 즉시 반복하지 마세요.
- 관리자 로그인은 8시간 유효한 HttpOnly/Secure/SameSite 쿠키로 보호합니다. 비밀번호 변경과 재배포 시 기존 세션은 무효화됩니다.
- 관리자 비밀번호는 공유하지 마세요. 이 버전은 전역 호출량 제한이나 월 비용 상한을 보장하지 않습니다. OpenAI 계정의 API 잔액과 사용량도 확인하세요.
- Netlify의 요금제 사용 한도와 OpenAI API 비용은 각각 적용됩니다. 무제한 무료 서비스가 아닙니다.
- 원고는 해당 기기의 브라우저에 저장됩니다. 주기적으로 백업하세요.
- 네이버 자동 게시나 예약 등록은 구현하지 않습니다. 공식 편집기에서 사용자가 최종 발행합니다.
- 무료 사진 검색은 Pexels API 키를 현재 탭에만 입력합니다. 검색 결과의 이용 조건을 확인하세요.

## 개발

Node.js 22 이상:

```sh
npm run build
npm test
```

`public/index.html`은 화면, `netlify/functions/api.mjs`는 관리자 인증 및 OpenAI 서버 호출, `netlify.toml`은 배포 설정입니다. `/api/*` 경로는 Netlify Function의 custom path로 처리됩니다. Sites 전용 인증 헤더나 배포 설정에 의존하지 않습니다.

테스트는 모의 응답만 사용하고 실제 키나 유료 요청 없이 검증합니다. 실제 Netlify 배포와 OpenAI 원고 생성은 환경 변수 등록 후 별도로 확인해야 합니다.
