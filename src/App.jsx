import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Applayout from './layouts/app-layout';
import Landingpage from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Jobpage from './pages/job';
import Joblisting from './pages/job-listing';
import Myjobs from './pages/my-jobs';
import Postjob from './pages/post-job';
import Savedjobs from './pages/saved-job';
import { ThemeProvider } from './components/theme-provider';
import Protectedroute from './components/protected-route';
import StarfieldBackground from './components/StarfieldBackground';
import RemotiveRemoteJobs from './pages/remotiveRemoteJobs';


const router = createBrowserRouter([
  {
    // In your case, the top-level route has element: <Applayout />, meaning <Applayout />
    //  (your layout component) will always render for this route and its nested routes.
    element: <Applayout />,
    //basically hat baar pehle applayout render hoga then header+footer+children load based on the route
    //The top-level route (with element: <Applayout />) acts as a wrapper or layout container. It has no path (it's the root), so it matches everything.
    children: [
      {
        path: '/',
        element: <Landingpage />

      },
      {
        path: '/onboarding',

        element: (
          <Protectedroute>
            <Onboarding />
          </Protectedroute>
        ),
      },
      {
        path: '/job/:id',
        element: (
          <Protectedroute>
            <Jobpage />
          </Protectedroute>
        ),
      },
      {
        path: '/job-listing',
        element: (
          <Protectedroute>
            <Joblisting />
          </Protectedroute>
        ),
      },
      {
        path: '/my-jobs',
        element: (
          <Protectedroute>
            <Myjobs />
          </Protectedroute>
        ),
      },
      {
        path: '/post-job',
        element: (
          <Protectedroute>
            <Postjob />
          </Protectedroute>
        ),
      },
      {
        path: '/saved-job',
        element: (
          <Protectedroute>
            <Savedjobs />
          </Protectedroute>
        ),
      },
      {
        path: '/remotiveRemoteJobs',
        element: (
          <Protectedroute>
            <RemotiveRemoteJobs />
          </Protectedroute>
        ),
      }
    ]
  }
])

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    //   <RouterProvider router={router} />
    // </ThemeProvider>

   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <StarfieldBackground />
      <RouterProvider router={router} />
    </ThemeProvider>
    
    // ✅ So What Happens?
// When App.jsx renders, the <Starfield /> is mounted and renders the canvas first
// All your other content (from shadcn UI or pages) renders on top of it
// Since the canvas is fixed and behind everything, it becomes a moving background layer


  );
}
export default App


// In Context: Why Layout First, Then Children?
// The top-level route (with element: <Applayout />) acts as a wrapper or layout container. It has no path (it's the root), so it matches everything.
// Inside <Applayout />, there's likely an <Outlet /> component (from React Router). This is where the children routes get rendered dynamically based on the current URL.
// Order matters for nesting: The layout (<Applayout />) renders first as the outer shell (e.g., header, footer, sidebar). Then, the matching child route's element (e.g., <Landingpage /> for /) renders inside it via <Outlet />. This creates a consistent layout across pages without duplicating UI code.
// Example Flow
// For URL /: <Applayout /> renders, and <Landingpage /> appears inside its <Outlet />.
// For URL /job/:id: <Applayout /> renders, and <Jobpage /> appears inside its <Outlet />.
// The layout stays the same; only the inner content changes.