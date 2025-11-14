# Hirely

**Hirely** is a modern job portal designed for both job seekers and employers. Built with React, it offers a seamless and responsive user experience with advanced features for job discovery and management.

## Features

### Core Functionality
- **Job Listings:** Browse and search for jobs posted by employers with advanced filtering
- **Employer Dashboard:** Post and manage job openings with real-time updates
- **Job Seeker Profiles:** Create and update professional profiles
- **Authentication:** Secure sign-in and sign-up powered by [Clerk](https://clerk.com/)
- **Database Integration:** All data is managed using [Supabase](https://supabase.com/)
- **Modern UI:** Styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) components

### Remote Jobs Integration
- **Remotive API Integration:** Access thousands of remote jobs from [Remotive.com](https://remotive.com/)
- **External Job Listings:** Browse remote jobs without leaving the platform
- **Smart Caching:** 7-hour cache system to respect API rate limits (max 4 requests/day)
- **Dedicated Remote Jobs Page:** Separate page for remote job listings with search functionality
- **External Job Applications:** Direct links to apply on company websites

### Advanced Job Management
- **Advanced Filtering:** Filter jobs by location, company, and search by job title
- **Job Saving:** Save interesting jobs for later review
- **Application Tracking:** Track your job applications and their status
- **Smart Pagination:** Efficient pagination system showing 6 jobs per page with intelligent page navigation
- **Real-time Updates:** Live updates for job status and application counts

### User Experience Features
- **Responsive Design:** Fully responsive across all devices (mobile, tablet, desktop)
- **Loading States:** Smooth loading animations and skeleton screens
- **Error Handling:** Comprehensive error handling with user-friendly messages

### Employer Features
- **Job Posting:** Rich text editor for job requirements using Markdown
- **Company Management:** Add and manage company profiles with logo uploads
- **Application Management:** View and manage job applications
- **Hiring Status Control:** Open/close job postings dynamically
- **Job Analytics:** Track application counts and job performance

### Security & Performance
- **Row Level Security:** Supabase RLS policies for data protection
- **Rate Limiting:** Respectful API usage with proper caching
- **Image Storage:** Secure file uploads to Supabase storage buckets
- **Optimized Queries:** Efficient database queries with proper indexing

## Tech Stack

- **Frontend:** React 18 with Vite
- **Authentication:** Clerk (with Supabase integration)
- **Database & Backend:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React hooks and custom useFetch hook
- **File Storage:** Supabase Storage
- **External APIs:** Remotive Jobs API
- **Form Handling:** React Hook Form with Zod validation
- **Markdown Editor:** @uiw/react-md-editor
- **Icons:** Lucide React
- **Loading:** React Spinners

## Key Components

### Custom Hooks
- **useFetch:** Custom hook for API calls with loading states and error handling
- **usePagination:** Reusable pagination logic for all job listings

### UI Components
- **JobCard:** Reusable job display component with save/delete functionality
- **RemoteJobCard:** Specialized component for external remote jobs
- **CustomPagination:** Smart pagination with ellipsis and responsive design
- **ApplyJobDrawer:** Modal for job applications with file upload
- **AddCompanyDrawer:** Modal for adding new companies

### Pages
- **Landing Page:** Hero section with company showcase and FAQ
- **Job Listing:** Main jobs page with filters and pagination
- **Remote Jobs:** External remote jobs from Remotive API
- **Job Details:** Individual job page with application functionality
- **Post Job:** Job creation form with rich text editor
- **My Jobs:** Employer dashboard for managing posted jobs
- **Saved Jobs:** User's saved job listings
- **Applications:** Track job applications and status

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Hirely
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase:**
   - Set up Row Level Security policies
   - Create storage buckets for company logos and resumes
   - Configure Clerk integration

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## API Integration

### Remotive Jobs API
- **Rate Limiting:** Maximum 4 requests per day, 2 requests per minute
- **Caching Strategy:** 7-hour localStorage cache to minimize API calls
- **Data Structure:** Jobs include title, company, description, salary, location, and application URLs

### Supabase Integration
- **Real-time Updates:** Live job status and application tracking
- **File Storage:** Secure upload and retrieval of company logos and resumes
- **Row Level Security:** User-specific data access and modification

## Deployment

The application is optimized for deployment on platforms like:
- Vercel
- Netlify
- Railway
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request



---

**Hirely** streamlines the job search and hiring process with a robust, scalable, and user-friendly platform that combines internal job postings with external remote job opportunities.
