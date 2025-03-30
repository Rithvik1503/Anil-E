import AdminStats from '@/components/AdminStats'
import RecentActivity from '@/components/RecentActivity'

export default function AdminDashboard() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Overview</h2>
          <AdminStats />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
} 