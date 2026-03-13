# SHOPSIFU — FRONTEND PROJECT DESCRIPTION (CV READY)

## 1) Tóm tắt dự án

**Shopsifu** là nền tảng thương mại điện tử fullstack theo mô hình marketplace, gồm khu vực khách hàng và khu vực quản trị (ADMIN/SELLER).  
Dự án tốt nghiệp được phát triển bởi đội ngũ 6 thành viên, trong đó 4 thành viên chính: **ERICSS-FE, TEDDY-BE, HA-FE, NUI-BE**.

Vai trò của tôi tập trung vào **Frontend (Next.js + TypeScript)** với các trọng tâm: tối ưu hiệu năng, SEO, kiến trúc UI component, data fetching, i18n và trải nghiệm người dùng.

---

## 2) Kiến trúc hệ thống frontend

Frontend tổ chức theo cấu trúc rõ ràng, tách lớp theo domain để dễ scale:

- `app/`: App Router, route groups cho `(auth)`, `(client)`, `admin`
- `components/`: component theo module (`client`, `admin`, `ui`)
- `services/`: service layer gọi API theo từng nghiệp vụ
- `hooks/`: custom hooks tái sử dụng logic (auth, data table, responsive, upload, shipping...)
- `providers/`: React Query provider, cart context, socket context...
- `store/`: Redux Toolkit cho global state và auth state
- `constants/`: route map, API constants, sidebar config, search data...
- `lib/`: axios instances, metadata config, utility nền tảng
- `i18n/`: cấu hình đa ngôn ngữ và message loading

Điểm mạnh kiến trúc:

- Tách domain rõ giữa `client` và `admin`.
- Dễ mở rộng module mới nhờ pattern: `types -> service -> hook -> component/page`.
- Tối ưu maintainability bằng cách gom logic dùng chung vào hooks/providers.

---

## 3) Những tính năng frontend nổi bật

### A. Trải nghiệm mua sắm (Client)
- Danh sách sản phẩm + trang chi tiết theo slug.
- Tìm kiếm/lọc/sắp xếp sản phẩm theo nhiều tiêu chí.
- Giỏ hàng và luồng checkout nhiều bước.
- Theo dõi đơn hàng, quản lý hồ sơ người dùng.
- Giao diện responsive cho desktop/mobile.

### B. Dashboard quản trị (Admin/Seller)
- Dashboard thống kê tổng quan.
- Quản lý sản phẩm, danh mục, thương hiệu.
- Quản lý đơn hàng, voucher/discount.
- Quản lý user/role/permission/language (theo quyền).
- Phân tách quyền truy cập rõ ràng giữa ADMIN và SELLER.

### C. Realtime & tương tác
- Tích hợp Socket.IO phía frontend để nhận sự kiện thanh toán realtime.
- UI cập nhật trạng thái payment theo event.

---

## 4) Các điểm kỹ thuật “đáng đưa vào CV” (Frontend focus)

### 4.1 Performance Optimization

- Thiết lập caching chiến lược với **TanStack Query**:
	- `staleTime` 5 phút, `gcTime` 24 giờ
	- giảm refetch không cần thiết (`refetchOnWindowFocus: false`)
- Xây custom hook `useServerDataTable` có:
	- debounce search (500ms)
	- abort request cũ bằng `AbortController`
	- timeout 8s để tránh request treo
	- server-side pagination/sort/search linh hoạt theo config
- Tổ chức provider-level data layer để ổn định state và giảm render thừa.

### 4.2 SEO & Metadata

- Áp dụng metadata theo route với `metadataConfig` cho cả auth/client/admin.
- Tạo metadata động theo slug trên trang sản phẩm/search để tăng SEO relevance.
- Có pipeline sitemap (`next-sitemap`) và robots phục vụ index/search engine.

### 4.3 Data Fetching & API Layer

- Xây 3 axios instances theo mục đích:
	- `publicAxios`
	- `privateAxios`
	- `refreshAxios`
- Dùng interceptor để:
	- inject `x-csrf-token`
	- inject `Accept-Language`
	- xử lý refresh token tự động khi 401
	- queue request trong lúc refresh tránh race condition
- Chuẩn hóa API flow theo service layer, dễ test và tái sử dụng.

### 4.4 i18n / Localization

- Sử dụng `next-intl` cho đa ngôn ngữ (vi/en).
- Đọc locale từ cookie (`NEXT_LOCALE`) và load dynamic messages.
- Thiết kế theo hướng fallback an toàn khi thiếu key translation.
- Đồng bộ ngôn ngữ UI với ngôn ngữ request API qua header.

### 4.5 Auth, Security & Authorization

- Auth guard cho route protection theo trạng thái đăng nhập + role.
- RBAC phía frontend:
	- ADMIN truy cập full admin routes
	- SELLER chỉ truy cập tập route cho phép
	- CLIENT không vào admin routes
- Kết hợp JWT + CSRF + refresh flow để tăng độ an toàn phiên đăng nhập.

### 4.6 UI/UX Engineering

- Xây dựng UI bằng Next.js + Tailwind + Radix/shadcn component patterns.
- Form handling với React Hook Form + schema validation.
- Thiết kế responsive và ưu tiên trải nghiệm mượt trên mobile.
- Duy trì cấu trúc component tái sử dụng cao cho tốc độ phát triển feature.

---

## 5) Tích hợp backend (nêu ngắn gọn trong CV)

Với vai trò frontend, tôi tích hợp với các nhóm chức năng backend chính:

- **Auth**: đăng nhập/đăng ký, 2FA, phiên đăng nhập, phân quyền.
- **Product/Catalog**: sản phẩm, danh mục, thương hiệu, tìm kiếm.
- **Order/Cart/Checkout**: giỏ hàng, đơn hàng, luồng thanh toán.
- **Payment**: VNPay/Sepay + realtime payment events.
- **Voucher/Discount**: áp mã giảm giá trong checkout.
- **Language**: quản lý nội dung đa ngôn ngữ từ backend.

---

## 6) Mô tả vai trò cá nhân (copy cho mục Experience)

- Thiết kế và phát triển kiến trúc frontend cho hệ thống ecommerce đa vai trò bằng Next.js App Router.
- Xây dựng data-fetching layer chuẩn hóa (React Query + axios interceptor + service layer) giúp UI ổn định, dễ mở rộng.
- Tối ưu hiệu năng trang và API interaction bằng debounce, abort request, cache policy, timeout handling.
- Triển khai SEO metadata theo route và metadata động theo slug cho trang sản phẩm/tìm kiếm.
- Phát triển hệ thống i18n vi/en và đồng bộ locale giữa UI và API.
- Xây cơ chế bảo vệ route và phân quyền giao diện theo role (ADMIN/SELLER/CLIENT).
- Tích hợp realtime payment updates bằng Socket.IO để nâng trải nghiệm theo dõi giao dịch.

---

## 7) Phiên bản mô tả ngắn (2–3 dòng cho CV)

Phát triển frontend cho nền tảng ecommerce **Shopsifu** bằng **Next.js + TypeScript**, tập trung vào **performance optimization**, **SEO metadata**, **data-fetching architecture**, **i18n** và **RBAC**.  
Xây dựng hệ thống client/admin theo kiến trúc module hóa, tích hợp realtime payment, checkout flow, product search/filter và dashboard quản trị đa vai trò.

---

## 8) Từ khóa ATS đề xuất

`Next.js` · `TypeScript` · `React Query` · `Redux Toolkit` · `App Router` · `SEO` · `Metadata` · `i18n` · `Axios Interceptors` · `RBAC` · `Socket.IO` · `Tailwind CSS` · `E-commerce Frontend`

