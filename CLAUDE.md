# Project Rules

항상 docs 폴더의 문서를 먼저 확인할 것.

## 필수 참고 문서

- docs/requirements.md
- docs/folder-structure.md
- docs/conventions.md

## 개발 규칙

- 상태관리는 zustand 사용
- API 요청은 axios instance 사용
- UI는 TailwindCSS 기반
- 절대경로 import 사용
- 컴포넌트는 전통적인 CRA 방식 폴더 구조 사용 (components / pages / hooks / store / api / types / utils / constants)

## 금지사항

- Context API 사용 금지
- inline style 금지
<!-- - any 타입 금지 (리팩토링 시 복원) -->

## 공통 컴포넌트

- 2개 이상의 페이지에서 쓰이면 components/로 분리
- 페이지 전용이면 pages/ 파일 내 local component로
