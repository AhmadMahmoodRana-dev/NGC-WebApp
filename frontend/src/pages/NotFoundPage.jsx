import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-ngc-off-white">
      <div className="text-center px-4">
        <div className="font-display text-8xl font-bold text-ngc-navy/10 mb-2">404</div>
        <h1 className="font-display text-2xl font-bold text-ngc-navy mb-3">Page Not Found</h1>
        <p className="text-ngc-muted text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary"><Home size={14} /> Go to Homepage</Link>
          <button onClick={() => window.history.back()} className="btn-outline"><ArrowLeft size={14} /> Go Back</button>
        </div>
      </div>
    </div>
  )
}
