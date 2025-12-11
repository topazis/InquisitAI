export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Demo Page</h1>
        <p>This is the /demo route. If you see this, routing works.</p>
        <a href="/" className="mt-4 inline-block text-blue-400 underline">
          Back to home
        </a>
      </div>
    </main>
  );
}
