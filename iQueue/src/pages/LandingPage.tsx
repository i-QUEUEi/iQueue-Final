import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, Clock, Shield } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Product Sans', 'Google Sans', sans-serif" }}>
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold">
            iQ
          </div>
          <span className="text-xl font-semibold text-gray-900">iQueue</span>
        </div>
        
        <button
          onClick={() => navigate('/admin')}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Admin Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Smart Queue Management for Modern Services
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          iQueue streamlines visitor management with real-time analytics, predictive forecasting, 
          and intelligent queue optimization. Reduce wait times and improve service delivery.
        </p>
        
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-sm text-gray-600">
                Monitor visitor flow, wait times, and service metrics in real-time dashboards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Forecasting</h3>
              <p className="text-sm text-gray-600">
                AI-powered predictions help you plan staffing and resources ahead of time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visitor Management</h3>
              <p className="text-sm text-gray-600">
                Pre-registration, check-in, and arrival tracking for seamless visitor experience.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-sm text-gray-600">
                Enterprise-grade security with 99.8% uptime SLA for mission-critical operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-gray-900 mb-2">50+</p>
              <p className="text-gray-600">Government Agencies</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 mb-2">500K+</p>
              <p className="text-gray-600">Daily Visitors Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 mb-2">45%</p>
              <p className="text-gray-600">Avg Wait Time Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Queue Management?
          </h2>
          <p className="text-gray-600 mb-8">
            Start optimizing your visitor flow today with iQueue's intelligent management system.
          </p>
          
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Access Admin Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2026 iQueue. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
