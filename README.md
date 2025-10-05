# 🎨 TaskTrackr Frontend

Frontend for **TaskTrackr**, a full-stack productivity app built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.  
This interface provides user authentication, project management, and task tracking integrated with a Django REST API backend.

---

## 🚀 Tech Stack

- **Next.js 15 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **React Hot Toast**
- **Axios**
- **Jest + React Testing Library**

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies
```
cd frontend
npm install
```
# 2️⃣ Create environment file
Create a .env.local file in /frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
# 3️⃣ Run the app
```
npm run dev
```
The app will be available at http://localhost:3000

# 🧩 Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── page.tsx
│   ├── context/
│   ├── components/
│   └── __tests__/
│
├── jest.config.js
├── jest.setup.js
└── tsconfig.json
```
# 🧠 Available Pages
```
| Page          | Path         | Description               |
| ------------- | ------------ | ------------------------- |
| **Login**     | `/login`     | User authentication (JWT) |
| **Register**  | `/register`  | Create account            |
| **Dashboard** | `/dashboard` | Manage projects and tasks |

```

# 🧪 Testing
Run all frontend tests using Jest and React Testing Library:
```
npm test
```
# ✅ Current coverage:

- Login → successful login & token storage
- Register → successful registration
- Dashboard → fetching & displaying projects

## 🌈 UI Highlights
- Animated transitions via Framer Motion
- Responsive design (mobile-first)
- Toast notifications for user feedback
- Modal-based project/task creation

# 🧱 Deployment
This app can be deployed on Vercel easily:
- Push this repo to GitHub
- Connect it to Vercel
- Set the environment variable NEXT_PUBLIC_API_URL to your backend’s live API URL

## 🧩 Author
Developed by Özkan Çimenli
📧 cimenliozkan1@gmail.com