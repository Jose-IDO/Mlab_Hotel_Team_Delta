export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Michael!</h1>
        <p className="text-gray-600 mb-6">Find your bookings, manage your profile, and explore Delta Hotel Booking.</p>
        <a href="/" className="text-red-600 font-medium">Go to latest confirmation</a>
      </div>
    </div>
  );
}
