import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resume} from "react-dom/server";
import {resumes} from "~/routes/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume.AI" },
    { name: "description", content: "AI-powered contextual resume feedback" },
  ];
}
export default function Home() {
    return <main className= "bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
            <div className="page-heading">
                <h1>Track Your Applications & Resume Ratings</h1>
                <h2>Submit and get AI-powered feedback</h2>
            </div>
        </section>
        {resumes.map((resume) =>
        <div>
            <h1>{resume.jobTitle}</h1>
        </div>)}
    </main>;
}