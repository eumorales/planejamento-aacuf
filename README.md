# 🐧 Planejamento AACUF

## Overview 🌟

The AACUF Task Management System (Computer Science Athletic Association) is a web application designed to manage tasks and responsibilities among the association's board members. The system enables task creation by sector, assignment of responsible individuals, tracking of deadlines and statuses, and user management. 🚀

## Technologies Used 🛠️

### Frontend
- **Next.js** 🚀: React framework with server-side rendering.
- **React** ⚛️: JavaScript library for building interfaces.
- **TypeScript** 📜: Typed superset of JavaScript.
- **Tailwind CSS** 🎨: Utility-first CSS framework.
- **Shadcn/UI** 🖼️: Reusable UI components.
- **Framer Motion** 🎥: Animation library.
- **Lucide React** 🖌️: Icon library.

### Backend
- **Next.js API Routes** 🌐: Serverless API routes.
- **MongoDB** 🗄️: NoSQL database.
- **Next.js Server Actions** ⚙️: For server-side operations.

### Authentication 🔐
- Cookie-based authentication system 🍪.
- Password hashing with SHA-256 🔒.

## Features 🎯

# Authentication System 🔑
The system has two access levels:
- **Admin** 👑: Full access to the system, including user management.
- **Director** 👷: Access to the task dashboard, allowing them to assign and complete tasks.

## 2. Admin Dashboard 🖥️
**Admins** have access to:
- Dashboard with general statistics 📊.
- Task creation and management 📝.
- User (Director) management 👥.
- View of all system tasks 📋.

### 2.1 User Management 👤
- Create new users (Directors) ➕.
- Edit existing user information ✏️.
- Delete users 🗑️.
- Assign sectors to users 🏷️.

### 2.2 Task Management 📅
- Create new tasks with title, description, sector, and due date 📌.
- Edit existing tasks ✍️.
- Delete tasks ❌.
- Mark tasks as completed ✅.
- Reactivate expired tasks (if the due date is still valid) 🔄.

## 3. Director Dashboard 🧑‍💼
**Directors** have access to:
- Dashboard with relevant statistics 📈.
- Task view by sector 🗂️.
- "Your Tasks" section with tasks assigned to the user 📋.
- "Available Tasks" section with unassigned tasks 🔍.
- View of all system tasks 📜.

### 3.1 Director Task Management 📋
- Assign available tasks 🤝.
- Mark their tasks as completed ✔️.
- View tasks by sector 🗃️.

## 4. Task Status System 🚦
Tasks have three possible statuses:
- **Active** 🟢: Task in progress within the deadline.
- **Expired** 🔴: Task not completed after the due date.
- **Completed** ✅: Task finished.

The system automatically updates task statuses when the due date is exceeded. ⏰

### 5. Organization by Sectors 🏢
Tasks are organized by sectors:
- Sports ⚽
- Events 🎉
- Financial 💰
- Marketing 📣
- Products 📦
- Others ❓

## Project Structure 📂

```plaintext
├── app/                      # Main Next.js App Router directory
│   ├── admin/                # Admin dashboard routes 🖥️
│   │   ├── page.tsx          # Main admin page
│   │   └── users/            # User management 👥
│   ├── dashboard/            # Admin dashboard routes 📊
│   │   └── page.tsx          # Main Admin page
│   ├── globals.css           # Global styles 🎨
│   ├── layout.tsx            # Main application layout 🖼️
│   └── page.tsx              # Login page 🔐
├── components/               # Reusable React components 🧩
│   ├── ui/                   # UI components (shadcn) 🖌️
│   ├── admin-*.tsx           # Admin dashboard components 🖥️
│   ├── dashboard-*.tsx       # Admin dashboard components 📈
│   ├── login-form-modern.tsx # Login form 🔑
│   └── ...                   # Other components
├── lib/                      # Utilities and functions 🛠️
│   ├── actions.ts            # Next.js Server Actions ⚙️
│   ├── mongodb.ts            # MongoDB configuration 🗄️
│   └── utils.ts              # Utility functions 🔧
├── public/                   # Static files 📁
│   └── images/               # Project images 🖼️
├── .env.local                # Environment variables (not versioned) 🔒
├── .gitignore                # Files ignored by Git 🚫
├── next.config.js            # Next.js configuration ⚙️
├── tailwind.config.ts        # Tailwind CSS configuration 🎨
└── tsconfig.json             # TypeScript configuration 📜
```

## Installation and Setup 🏃‍♂️

### Prerequisites

- **Node.js 18.x or higher** 🟢  
- **npm or Yarn** 📦  
- **MongoDB** (local or Atlas) 🗄️  

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aacuf-task-system.git
   cd aacuf-task-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env.local` file** in the project root with the required environment variables (see Environment Variables):

   ```env
   MONGODB_URI=mongodb-uri
   MONGODB_DB_NAME=aacuf

   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password

   COOKIE_MAX_AGE=86400
   COOKIE_SECURE=true
   NODE_ENV=development
   ```

4. **Run the project in development mode:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application:**  
   Open your browser and go to: [http://localhost:3000](http://localhost:3000) 
