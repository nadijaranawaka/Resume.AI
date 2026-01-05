import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume.AI" },
    { name: "description", content: "AI-powered contextual resume feedback" },
  ];
}

export default function Home() {
    return <main>
        <section className="main-section">
            <div className="page-heading">
                <h1>Track Your Applications & Resume Ratings</h1>
            </div>
        </section>
    </main>;
}
