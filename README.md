# Financial Tracking App

## Introduction

This Financial Tracking App is designed to help users monitor and analyze their spending habits over time. The application features user authentication, real-time updates, and a variety of visualization tools to provide insights into spending patterns.

## Technologies

- **Frontend**: Next.js, React, Tailwind CSS, Material UI
- **Backend**: Node.js with Express
- **Database**: Firebase
- **Deployment**: Vercel

## Features

- User registration and authentication
- Real-time spending updates
- Visual breakdowns of spending via interactive charts
- Transaction management with options to add, edit, and delete records
- Responsive design for desktop and mobile usage

## Setup

### Prerequisites

- Node.js
- npm or yarn
- Git

### Local Development

To get the project running locally, follow these steps:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/spending-tracker.git
   cd spending-tracker

   ```

2. **Install Dependencies**
   npm install

3. **Set up environment variables**
   Create a .env.local file in the root directory and add the necessary Firebase and backend configurations as follows:

NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"

4. **Run the developement server**
   npm run dev

Open http://localhost:3000 with your browser to see the result.

## Building and Running Production

To build the application for production, use:

npm run build
npm start

## Deployment

This app is configured to deploy on Vercel. To deploy:

Push your code to a GitHub repository.
Connect your GitHub repository to Vercel through their interface.
Follow Vercel's prompts to deploy your application.
