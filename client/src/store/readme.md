📄 README.md

# 🧠 Redux Store Setup (Next.js + Redux Toolkit + Persist + Encryption)

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text

---

English content normalized from the original source text.

src/
└── lib/
└── store/
├── store.ts
├── StoreProvider.tsx
└── features/
└── auth/
└── authSlice.ts

---

## 🔧 1. `store.ts`

English content normalized from the original source text.

- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text
- English content normalized from the original source text

### 🔐 Encryption:

```ts
const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || '',
  onError: (err) => console.error('Encrypt error:', err),
});

🧩 2. StoreProvider.tsx

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

<StoreProvider>
  {children}
</StoreProvider>

🔐 3. authSlice.ts

English content normalized from the original source text.

user (object)

token (string)

Action: setCredentials, logOut, logOutAndRevertAll

🧾 Interface:

interface AuthState {
  user: { id: string; name: string } | null;
  token: string;
}

English content normalized from the original source text.

English content normalized from the original source text.

const user = useSelector((state: RootState) => state.auth.user);

English content normalized from the original source text.

dispatch(setCredentials({ user, token }));
dispatch(logOutAndRevertAll());

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

✅

English content normalized from the original source text.

✅

English content normalized from the original source text.

✅

English content normalized from the original source text.

✅

English content normalized from the original source text.

✅

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.

English content normalized from the original source text.
```
