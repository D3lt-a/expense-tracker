# 💸 Expense Tracker

A clean, modern **Expense Tracker** built with HTML, CSS, JavaScript, and Firebase Firestore.

It allows you to **add**, **view**, **filter**, **sort**, and **delete** expenses while saving everything in a real-time cloud database. Built to work across devices (e.g., PC and mobile).

---

## 📸 Features

- Add expense entries (name, amount, category)
- Automatically timestamped entries
- View all expenses in a sortable table
- Filter expenses by:
  - Search input (name/category)
  - Date (Newest → Oldest / Oldest → Newest)
  - Category dropdown
- Delete expenses with confirmation
- Firebase Firestore integration (no localStorage!)
- Responsive UI

---

## 🚀 Live Demo

> _Coming soon or hosted manually on your machine_

---

## 🛠️ Setup Instructions

To use this project for your __personal expense tracking__, follow these steps:

---

### ✅ 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
````

---

### 🔥 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. In the project dashboard, go to `Build > Firestore Database`

   * Click **Create database**
   * Start in test mode (for testing only!)
4. Click **Settings > Project settings** and go to **General**

   * Scroll to **Your apps**, click `</>` to add a **Web app**
   * Copy the Firebase config object

---

### ⚙️ 3. Add Firebase Config

Inside `script.js`, replace the Firebase config with your own:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```

OR use environment variables if building a secure app.

---

### 🔐 4. Set Firestore Rules

> ⚠️ For testing only:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, restrict access using [Firebase Authentication](https://firebase.google.com/docs/auth).

---

### 🧪 5. Run Locally

No server required! Just open `index.html` in your browser.

Or use VSCode + Live Server Extension.

---

## 📂 Project Structure

```
expense-tracker/
├── index.html          # Main HTML layout
├── style.css           # Modern, responsive design
├── script.js           # Core logic with Firebase integration
└── README.md           # You're reading it!
```

---

## 📌 Notes

* Built as a personal project for easy expense management
* Not intended for multi-user or financial-grade use
* You **own your own data** — everything stored in **your Firebase project**

---

## 📃 License

MIT License – Use it freely for learning or personal use.

---

## 🙌 Credits

Developed by [@Delta](https://github.com/D3lt-a)