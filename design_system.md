# DUEGO SYSTEM Design System (Tabular Summary)

이 문서는 DUEGO SYSTEM의 디자인 원칙을 표 형식으로 정리한 마스터 가이드라인입니다.

---

## 🎨 1. Color System

### 브랜드 및 시맨틱 컬러
| 분류 | 변수명 | Hex / Reference | 용도 및 설명 |
| :--- | :--- | :--- | :--- |
| **Main 브랜드** | `--clavis-blue` | `#2B3A8B` (primary-5) | 헤더 포인트, 주 강조색 |
| **액션/포인트** | `--accent` / `--edge` | `#007AFF` | 버튼 링크, 숫자 강조, 포인트 요소 |
| **배경 (주)** | `--bg-primary` | `#FFFFFF` (gray-0) | 페이지 전체 기본 배경색 |
| **배경 (보조)** | `--surface-alt` | `#F8F8F8` (gray-1) | 섹션 구분 및 배경 변화 |
| **텍스트 (주)** | `--text-primary` | `#111111` (gray-9) | 제목 및 주요 본문 텍스트 |
| **텍스트 (보조)** | `--text-secondary` | `#666666` (gray-6) | 캡션, 부가 설명, 푸터 정보 |
| **구분선** | `--border-color` | `#E4E4E4` (gray-3) | 보더, 수평/수직 구분 라인 |

### 🌑 Gray Scale (10 Steps)
| Token | Hex | 비고 |
| :--- | :--- | :--- |
| `gray-0` | `#FFFFFF` | Main Background |
| `gray-1` | `#F8F8F8` | Surface Alt |
| `gray-2` | `#F0F0F0` | Sub Surface |
| `gray-3` | `#E4E4E4` | Border Color |
| `gray-4` | `#CCCCCC` | Inactive Label |
| `gray-5` | `#AAAAAA` | Disabled Text |
| `gray-6` | `#666666` | Text Secondary |
| `gray-7` | `#444444` | Text Muted |
| `gray-8` | `#222222` | Text Deep |
| `gray-9` | `#111111` | Text Primary |

### 🔵 Primary Scale (10 Steps)
| Token | Hex | 비고 |
| :--- | :--- | :--- |
| `primary-0` | `#EEF3FF` | Very Light Tint |
| `primary-1` | `#D6E4FF` | Light Tint |
| `primary-2` | `#ADC8FF` | Tint |
| `primary-3` | `#7EA8F8` | Mid Tint |
| `primary-4` | `#4F75E0` | Brand Light |
| `primary-5` | `#2B3A8B` | **Base (Clavis Blue)** |
| `primary-6` | `#243280` | Brand Dark |
| `primary-7` | `#1D2A6E` | Dark |
| `primary-8` | `#16215C` | Deep Dark |
| `primary-9` | `#0F1848` | Black Tint |

---

## 🖋️ 2. Typography & Layout

### 폰트 패밀리 (Font Family)
| 구분 | 폰트명 | 용도 |
| :--- | :--- | :--- |
| **한글** | `Pretendard` | 전체 텍스트 |
| **영문/숫자** | `Pretendard` | 전체 텍스트 |
| **Fallback** | `Apple SD Gothic Neo, sans-serif` | |

### 폰트 규격 (Desktop vs Mobile)
| 구분 | Desktop | Mobile | Weight / Style |
| :--- | :--- | :--- | :--- |
| **Main Hero** | `86px` | `56px` | Bold 700 |
| **Section Title** | `52px` | `32px` | Bold 700 |
| **Page Title (Sub)** | `60px` | `36px` | Bold 700 |
| **Section Title (Sub)** | `48px` | `26px` | Bold 700 |
| **Trust & Performance** | `48px` | `32px` | Bold 700 |
| **Section Label** | `14px` | `12px` | Bold 700, Upper |
| **Card Title (Active)** | `48px` | `32px` | Bold 700 |
| **Card Title (Small)** | `26px` | `22px` | Bold 700 |
| **Card Link** | `20px` | `16px` | Semi Bold 600 |
| **GNB / Footer Logo** | `24px` | `20px` | Bold 700 |
| **Footer Address** | `14px` | `12px` | Regular 400 |
| **Company Link** | `28px` | `22px` | Bold 700 |
| **Hero Body** | `20px` | `16px` | Light 300 |
| **Hero Button** | `16px` | `14px` | Bold 700 |
| **Stats Big Num** | `280px` | `100px` | Bold 700, Italic |
| **Stats Item Num**| `80px` | `40px` | Bold 700 |
| **Stats Item Label**| `18px` | `16px` | Bold 700 |
| **Stats Label** | `14px` | `12px` | Bold 700 |
| **Stats Sub Label** | `16px` | `14px` | Light 300 |
| **Stats Item Sub**| `12px` | `10px` | Regular 400 |
| **Body Text** | `18px` | `16px` | Regular 400 |
| **Nav / Labels** | `16px` | `14px` | Semi Bold 600 |

### 폰트 가중치 (Font Weight)
| Token | Value | 용도 |
| :--- | :--- | :--- |
| **light** | `300` | Hero Body, Stats Sub Label |
| **regular** | `400` | 본문, 캡션, Footer 주소 |
| **semibold** | `600` | 네비, 레이블, Card Link |
| **bold** | `700` | 제목, 강조, 버튼, 숫자 |

### 반응형 브레이크포인트
| 단계 | 범위 | 기준 및 활용 |
| :--- | :--- | :--- |
| **Desktop Large** | `1440px+` | 최대 너비 제한 (1440px) |
| **Tablet / Small PC** | `~1200px` | 좌우 패딩 5%로 유동적 변경 |
| **Native Scroll 전환** | `~1024px` | 풀페이지 스크롤 -> 일반 스크롤 전환 |
| **Mobile** | `~768px` | 텍스트 크기 축소, 1열 배치 적용 |

---

## 🧩 3. Components Spec

### UI 요소 규격
| 컴포넌트 | 속성 | 명세 (Specs) | 비고 |
| :--- | :--- | :--- | :--- |
| **GNB (Nav)** | Height | Desktop `94px`, Mobile `70px` | 상단 고정 (Sticky/Fixed) |
| **Buttons** | Shape | Pill Type (반원형) | `border-radius: 50px` |
| **Buttons** | Padding | `10px 30px` (Light), `12px 35px` (Hiring) | 아이콘 좌우 간격 8px |
| **Radius (md)** | Size | `8px` | 카드, 비디오 박스 기본값 |
| **Radius (scale)** | Scale | `2px` / `4px` / `8px` / `16px` / `24px` | 유동적 사용 (md 중심) |

### 인터랙션 명세
| 컴포넌트 | 효과 | 상세 내용 |
| :--- | :--- | :--- |
| **Hero Slogan** | 시차 등장 | 1번줄 -> 2번줄 -> 설명글 순차 Fade-in |
| **Hero Slogan** | 동시 퇴장 | 사라질 때는 모든 요소 동시에 0.8s Exit |
| **Tech Cards** | 아코디언 | Flex-grow를 통한 0.7s 슬라이딩 확장 |
| **Stats Num** | Count-up | 숫자 0부터 타겟까지 1s 내 순차 증가 |
| **Cases Video** | Immersive | 스크롤 시 800px -> Full View 시각적 확장 |

---

## 📏 4. Spacing Principles
| 구분 | 명세 | 기준 |
| :--- | :--- | :--- |
| **Section Gap** | `100vh` (Desktop) / `100px` (Mobile) | 모바일은 콘텐츠 기반 자동 높이 |
| **Inner Padding** | `10%` (Desktop) / `20px` (Mobile) | 공통 콘텐츠 좌우 여백 |
| **Item Margin** | `20px` ~ `40px` | 컴포넌트 간 수직 간격 |
