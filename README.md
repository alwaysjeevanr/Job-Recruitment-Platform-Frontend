# Job Recruitment Platform Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</div>

A modern, responsive web application for job seekers and employers to connect and manage job opportunities. Built with React, Bootstrap, and modern web technologies.

## 📋 Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication)
- [UI/UX Features](#-uiux-features)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)
- [Support](#-support)

## 🚀 Features

### For Job Seekers
- 📝 Browse and search job listings
- 🔍 Filter jobs by location and skills
- 📄 Apply to jobs with PDF resume upload
- 📊 Track application status
- 📋 View job details and requirements
- 🔔 Real-time notifications for application updates

### For Employers
- ✏️ Post new job opportunities
- 📊 Manage job listings
- 📄 View applicant resumes
- 🔄 Update job status
- 📈 Track applications
- 📊 Analytics dashboard

## 🛠️ Technologies Used

- **Frontend Framework**
  - React 19.1.0
  - React Router 7.6.2
  - Vite 6.3.5

- **UI Components**
  - Bootstrap 5.3.6
  - React Toastify
  - Bootstrap Icons

- **State Management & API**
  - Axios 1.9.0
  - JWT Authentication
  - Local Storage

- **Development Tools**
  - ESLint
  - Vite
  - npm

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/alwaysjeevanr/Job-Recruitment-Platform-Frontend.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=https://job-recruitment-backend-mv8y.onrender.com
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/         # Reusable components
│   ├── Navbar.jsx     # Navigation component
│   └── ProtectedRoute.jsx  # Route protection
├── pages/             # Page components
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── Dashboard.jsx
│   ├── JobList.jsx
│   ├── PostJob.jsx
│   ├── ApplyJob.jsx
│   └── Applications.jsx
├── axios.js           # Axios instance configuration
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Token stored in localStorage
- Protected routes with automatic redirection
- Role-based access control
- Secure token validation
- Automatic token refresh

## 🎨 UI/UX Features

- 📱 Responsive design for all screen sizes
- 🎯 Modern and clean interface
- 🔔 Toast notifications for user feedback
- ⏳ Loading states and spinners
- ✅ Form validation
- ❌ Error handling
- 🔍 Search functionality
- 📄 PDF preview for resumes

## 🔌 API Integration

The frontend integrates with a RESTful API:
- Base URL: https://job-recruitment-backend-mv8y.onrender.com
- Endpoints:
  - `/auth/login` - User login
  - `/auth/register` - User registration
  - `/jobs` - Job listings
  - `/jobs/:id` - Job details
  - `/apply` - Job applications
  - `/applications` - User applications

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jeevan R**
- GitHub: [@alwaysjeevanr](https://github.com/alwaysjeevanr)
- LinkedIn: [@alwaysjeevanr](https://linkedin.com/in/alwaysjeevanr)
- Email: alwaysjeevanr@gmail.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Bootstrap](https://getbootstrap.com/) - UI framework
- [React Router](https://reactrouter.com/) - Navigation
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Notifications
- [Axios](https://axios-http.com/) - HTTP client

## 📞 Support

For support:
- Email: jeevanjeevu233@gmail.com
- Open an issue in the repository
- Contact through LinkedIn

---

<div align="center">
  Made with ❤️ by Jeevan R
</div>
