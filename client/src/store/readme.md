📄 README.md

# 🧠 Redux Store Setup (Next.js + Redux Toolkit + Persist + Encryption)

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

---

T?i li?u k? thu?t ECSite

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

T?i li?u k? thu?t ECSite

- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite
- T?i li?u k? thu?t ECSite

### 🔐 Encryption:

```ts
const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || '',
  onError: (err) => console.error('Encrypt error:', err),
});

🧩 2. StoreProvider.tsx

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

<StoreProvider>
  {children}
</StoreProvider>

🔐 3. authSlice.ts

T?i li?u k? thu?t ECSite

user (object)

token (string)

Action: setCredentials, logOut, logOutAndRevertAll

🧾 Interface:

interface AuthState {
  user: { id: string; name: string } | null;
  token: string;
}

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

const user = useSelector((state: RootState) => state.auth.user);

T?i li?u k? thu?t ECSite

dispatch(setCredentials({ user, token }));
dispatch(logOutAndRevertAll());

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

✅

T?i li?u k? thu?t ECSite

✅

T?i li?u k? thu?t ECSite

✅

T?i li?u k? thu?t ECSite

✅

T?i li?u k? thu?t ECSite

✅

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite
```
