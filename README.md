# Project_CNPM_NEW
web demo
Local host: http://localhost:5173/
my-app/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       └── logo.png
│
├── src/
│   ├── assets/               # Ảnh, icon, font, v.v.
│   ├── components/           # Các component dùng chung (Button, Navbar, Modal, v.v.)
│   ├── pages/                # Các trang (Home, About, Contact, v.v.)
│   ├── layouts/              # Cấu trúc layout tổng thể (Header, Footer, Sidebar)
│   ├── routes/               # Cấu hình routing (react-router-dom)
│   ├── hooks/                # Custom hooks (useAuth, useFetch, ...)
│   ├── context/              # React Context (Global state, AuthContext, ThemeContext)
│   ├── services/             # Gọi API hoặc xử lý logic phía client (axios, fetch, ...)
│   ├── utils/                # Hàm tiện ích (formatDate, validateEmail, ...)
│   ├── App.jsx               # Thành phần gốc
│   ├── main.jsx              # Điểm khởi chạy (render React)
│   └── index.css             # CSS chung hoặc global
│
├── .gitignore
├── package.json
├── vite.config.js (hoặc webpack.config.js)
└── README.md
API KEY google map: AIzaSyCGw-UAp-Jx5DEGDCtIXdI1N5ScdU1q7Q8