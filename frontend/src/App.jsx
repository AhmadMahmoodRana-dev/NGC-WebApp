import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout       from './components/layout/Layout'
import HomePage     from './pages/HomePage'
import AboutPage    from './pages/AboutPage'
import ContactPage  from './pages/ContactPage'
import CMSLogin     from './pages/CMSLogin'
import CMSDashboard from './pages/CMSDashboard'
import NotFoundPage from './pages/NotFoundPage'
import { lazy, Suspense } from 'react'

const MediaPage        = lazy(() => import('./pages/MediaPage'))
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'))
const CareersPage      = lazy(() => import('./pages/CareersPage'))
const OperationsPage   = lazy(() => import('./pages/OperationsPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 border-[3px] border-ngc-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cms/login"     element={<CMSLogin />} />
        <Route path="/cms/dashboard" element={<CMSDashboard />} />
        <Route element={<Layout />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/about/*"    element={<AboutPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/media/*"    element={<Suspense fallback={<PageLoader />}><MediaPage /></Suspense>} />
          <Route path="/publications/*" element={<Suspense fallback={<PageLoader />}><PublicationsPage /></Suspense>} />
          <Route path="/careers/*"  element={<Suspense fallback={<PageLoader />}><CareersPage /></Suspense>} />
          <Route path="/operations/*" element={<Suspense fallback={<PageLoader />}><OperationsPage /></Suspense>} />
          <Route path="*"           element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
