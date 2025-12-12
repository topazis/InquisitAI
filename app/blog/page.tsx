import Link from "next/link";

export default function BlogIndex() {
  const posts = [
    {
      slug: "ai-scam-patterns-2025",
      title: "5 AI Scam Patterns Everyone Should Recognize in 2025",
      excerpt:
        "AI has supercharged the speed and believability of scams. Here are the patterns that matter most.",
    },
    {
      slug: "is-this-voicemail-real",
      title: "Is This Voicemail Real? How to Tell in Under 30 Seconds",
      excerpt:
        "Voice cloning has changed everything. But you can still spot the tells if you know what to look for.",
    },
    {
      slug: "verify-screenshots",
      title: "How to Verify Screenshots in a World Where Anyone Can Fake Them",
      excerpt:
        "Screenshots have become the easiest things to fake — here's how to stay ahead.",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-white">
      <h1 className="text-3xl font-bold mb-8">InquistAI Blog</h1>
      <div className="space-y-10">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-xl hover:bg-gray-800 transition cursor-pointer">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-400 mt-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
