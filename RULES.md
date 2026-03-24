# DUEGO SYSTEM - 작업 규칙 (RULES)

> 이 문서는 모든 작업 시 반드시 준수해야 할 규칙입니다.
> 코드 수정 시 이 문서를 먼저 확인하고 작업을 시작합니다.

---

## ✅ 1. 작업 완료 조건

모든 작업은 아래 두 가지가 **동시에 완료**되어야 합니다.

- [ ] 코드 수정 완료 (html / css / js)
- [ ] `design_system.md` 관련 섹션 업데이트 완료

둘 중 하나라도 빠지면 작업 미완료로 간주합니다.

---

## 🎨 2. 컬러 규칙

- 색상값 하드코딩 **절대 금지** → 반드시 CSS 변수 사용
- 새 색상 추가 시 `design_system.md` Color System 팔레트 스케일 확인 후 등록
- 임의로 새 색상 변수를 만들지 않으며, 기존 팔레트 스케일 내에서 선택
- 변경 발생 시 `design_system.md` → Color System 섹션 즉시 업데이트

### 컬러 팔레트 기준
- **Gray Scale**: gray-0 ~ gray-9 (10단계)
- **Primary Scale**: primary-0 ~ primary-9 (10단계)
- **Semantic 변수**: `--bg-primary`, `--text-primary`, `--text-secondary`, `--surface`, `--border-color`
- **Dark Mode 변수**: `[data-theme='dark']` 기준으로 별도 정의

---

## 🖋️ 3. 타이포그래피 규칙

### Font Family
- 한글,영문: **Pretendard**
- Fallback: `Apple SD Gothic Neo, sans-serif`

### Font Weight 규칙
- 사용 가능한 weight는 아래로 **제한**
  | Token | Value | 용도 |
  | light | 300 | Hero Body, Stats Sub Label |
  | regular | 400 | 본문, 캡션, Footer 주소 |
  | semibold | 600 | 네비, 레이블, Card Link |
  | bold | 700 | 제목, 강조, 버튼, 숫자 |
- **700 초과 weight (800, 900) 사용 금지**
- weight 변경 시 `design_system.md` → Typography 섹션 즉시 업데이트

---

## 📐 4. 레이아웃 / 간격 규칙

- 간격값 하드코딩 금지 → spacing 토큰 또는 CSS 변수 사용
- 새로운 spacing 값 추가 시 `design_system.md` → Spacing 섹션 확인 후 등록
- 브레이크포인트는 `design_system.md` 기준 4단계만 사용
  - Desktop Large: `1440px+`
  - Tablet / Small PC: `~1200px`
  - Native Scroll 전환: `~1024px`
  - Mobile: `~768px`

---

## 🧩 5. 컴포넌트 규칙

- 기존 컴포넌트 스타일 변경 시 `design_system.md` → Components 섹션 업데이트
- 새 컴포넌트 추가 시 스펙(크기, 색상, radius, padding) 명세 후 등록
- 버튼: Pill Type 고정 (`border-radius: 50px`), 임의 변경 금지

---

## 📁 6. 파일 관리 규칙

- 이미지는 `/images` 폴더로 통일
- CSS는 `/css` 폴더에서 관리
- JS는 `/js` 폴더에서 관리
- 새 페이지 추가 시 해당 폴더명으로 서브 디렉토리 생성 (예: `/about`)

---

## 📝 7. MD 문서 관리 규칙

- `design_system.md`: 디자인 토큰 및 컴포넌트 스펙 관리 → 코드 변경 시 동시 업데이트
- `implementation_plan.md`: 기술 구현 계획 관리 → 새 기능 추가 시 업데이트
- `RULES.md` (이 문서): 작업 규칙 관리 → 규칙 변경 시 업데이트
- **MD 파일은 코드 현실을 항상 반영해야 하며, 초기 상태로 방치 금지**