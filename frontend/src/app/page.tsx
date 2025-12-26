export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          OptiChain WS & DWS
        </h1>
        <p className="text-xl text-gray-600">
          Work Schedule and Dispatch Work Schedule Management System
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">WS - Work Schedule</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Task Management</li>
              <li>Checklist System</li>
              <li>Notifications</li>
              <li>Reporting</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">DWS - Dispatch Work Schedule</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Shift Management</li>
              <li>Staff Assignment</li>
              <li>Schedule Templates</li>
              <li>Monthly Planning</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
