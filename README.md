## SparkLoop  
> Swipe → Verify → Talk (or it disappears)

A mobile-first React web-app that kills dating-app ghosting, cat-fish and on-boarding fatigue with a 24-hour conversation timer and 60-second selfie verification.

---

## 🔥 30-Second Pitch
- **Problem**: 63 % of matches never speak, 25 % doubt photos, 46 % abandon long forms.  
- **Solution**: SparkLoop – matches self-destruct in 24 h unless someone talks; real-time selfie vs. profile-pic check (Face++ ≥ 80 %); one-tap Google / GitHub sign-up.  
- **MVP Stack**: React 18 + React Router + Tailwind CSS + Firebase Auth / Firestore + Face++ API + GitHub Actions CI/CD → live on Firebase Hosting.

---

## ⚙️ Tech Highlights
| Requirement | Implementation |
|-------------|----------------|
| Navigation | React Router v6 – smooth transitions (`/`, `/onboarding`, `/discover`, `/chat/:id`, `/verify`) |
| Styling | Tailwind CSS 3 – fully responsive, utility-first |
| Auth | Firebase Authentication – Google & GitHub social login |
| Database | Firestore – real-time matches & messages |
| Live API | Face++ Compare API – identity check before profile goes public |
| Serverless | Cloud Function – deletes match after 24 h if `messageCount === 0` |
| CI/CD | GitHub Actions – auto lint / test / build / deploy to Firebase Hosting on every push to `main` |

---

## 🗂️ Project Tree
```
sparkloop/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── SocialLogin.jsx
│   │   │   └── OnboardingForm.jsx
│   │   ├── Verify/
│   │   │   └── SelfieVerify.jsx
│   │   ├── Discover/
│   │   │   └── Discover.jsx
│   │   ├── Chat/
│   │   │   └── ChatRoom.jsx
│   │   └── Layout/
│   │       └── AppLayout.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useFaceCompare.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── facePlusPlus.js
│   ├── utils/
│   │   └── generateIcebreaker.js
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── functions/               # Firebase Cloud Functions
│   ├── index.js             # 24-h match expiry logic
│   └── package.json
├── .github/workflows/
│   └── deploy.yml           # CI/CD pipeline
├── firebase.json
├── .firebaserc
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js           # or craco / react-scripts
└── package.json
```

---

## 🚀 Quick Start
1. Clone & install  
   ```bash
   git clone https://github.com/your-org/sparkloop.git
   cd sparkloop
   npm install
   ```

2. Add your keys  
   Create `.env` (root):
   ```
   VITE_FIREBASE_API_KEY=xxx
   VITE_FIREBASE_AUTH_DOMAIN=xxx
   VITE_FIREBASE_PROJECT_ID=xxx
   VITE_FIREBASE_STORAGE_BUCKET=xxx
   VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
   VITE_FIREBASE_APP_ID=xxx
   VITE_FACEPLUSPLUS_API_KEY=xxx
   VITE_FACEPLUSPLUS_API_SECRET=xxx
   ```

3. Dev server  
   ```bash
   npm run dev        # vite
   # or
   npm start          # cra
   ```

4. Deploy (auto)  
   Push to `main` → GitHub Actions lints, tests, builds & deploys to Firebase Hosting.  
   (Manual: `npm run build && firebase deploy`)

---

## 📊 Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | local dev server |
| `npm run build` | production build |
| `npm run lint` | ESLint check |
| `npm run test` | unit tests (Vitest / Jest) |
| `npm run preview` | preview production build locally |

---

## 🔗 Live Links
- **Live Demo**: https://sparkloop.web.app  
- **Slides**: https://bit.ly/SparkLoop-Deck  
- **Repo**: https://github.com/your-org/sparkloop  

---

## 📄 License
MIT © 2025 SparkLoop Team
