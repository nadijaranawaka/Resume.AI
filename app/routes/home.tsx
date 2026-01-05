import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume.AI" },
    { name: "description", content: "AI-powered contextual resume feedback" },
  ];
}

export default function Home() {
  return <Welcome />;
}
