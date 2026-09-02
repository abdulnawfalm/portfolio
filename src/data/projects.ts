import type { StaticImageData } from "next/image";

import projectOne from "@/assets/work/project-one.png";
import projectTwo from "@/assets/work/project-two.png";
import projectThree from "@/assets/work/project-three.jpg";
import projectFour from "@/assets/work/project-four.jpg";
import projectFive from "@/assets/work/project-five.png";
import projectSix from "@/assets/work/project-six.jpg";

export type Project = {
  slug: string;
  n: string;
  title: string;
  description: string;
  year: string;
  tags: string[];

  /* Case study */
  client: string;
  role: string;
  duration: string;
  overview: string;
  challenge: string;
  approach: string[];
  outcomes: { value: string; label: string }[];
  live?: string;
  cover: StaticImageData;
};

export const PROJECTS: Project[] = [
  {
    slug: "ship-chartering",
    n: "01",
    title: "Ship Chartering",
    description:
      "A voyage estimation and fleet operations dashboard built for a UAE-based ship chartering company designed to simplify complex maritime workflows into a clean, usable interface.",
    year: "2026",
    tags: ["Product Design", "UI/UX", "Web App"],
    client: "Hilfship",
    role: "Product Designer",
    duration: "2 weeks",
    overview:
      "The dashboard needed to bring together four core workflows Vessels, Cargo Orders, Voyages Estimator, and Report & Bunker Cost into a single, coherent system. Each module served a different part of the chartering desk, and the brief was to design an interface that let traders move between them without losing context or hunting for information they relied on.",
    challenge:
      "Going in, I had no background in ship chartering the terminology, the workflows, none of it. The client walked our team through how the desk actually operated in a series of meetings, and once that picture was clear, we worked through what new features the dashboard needed on top of it. Understanding the product turned out to be a bigger part of the job than designing it.",
    approach: [
      "Sat through walkthrough sessions with the client to learn the chartering workflow from zero",
      "Reviewed the HTML reference file the client provided to understand how the existing screens were structured",
      "Worked with the team to translate the client's explanation into a set of new features for the dashboard",
      "Designed the UI/UX on top of that structure, prioritising clarity given how unfamiliar the domain was",
      "Prototyped the screen-to-screen navigation and interactions so the client could walk through the flow before development",
    ],
  outcomes: [
  { value: "15+", label: "Screens designed" },
  { value: "80%", label: "Overall user experience" },
  { value: "92%", label: "Client satisfaction" },
],
    cover: projectOne,
  },
  {
    slug: "HR Software Redesign",
    n: "02",
    title: "HR Software Dashboard",
    description:
      "Mobile-first banking with a gesture-led navigation model that cut the tap count on core journeys by half.",
    year: "2025",
    tags: ["UI/UX", "Web Redesign", "Add new feature"],
    client: "Internal & External Business",
    role: "UI/UX designer",
    duration: "6 months",
        overview:
      "An HR software web application with strong core functionality but a dated, cluttered interface. Payroll, attendance tracking, leave management, and reporting all worked, but the experience made routine tasks feel harder than they needed to be. The brief was to redesign the dashboard's UI and improve the overall user experience across these workflows.",
    challenge:
      "Partway through the redesign, a new organisation chart feature was added to the scope. Building the visual hierarchy turned out to be harder than expected the underlying role structure was inconsistent across the organisation, so the reporting lines that the chart depended on weren't clearly defined for every role, which made it difficult to represent cleanly.",
    approach: [
      "Redesigned the core dashboard screens payroll, attendance tracking, leave approval workflows, and reports",
      "Rebuilt the visual design system, applying the client's own brand colours in place of the previous generic theme",
      "Designed a new organisation chart feature, working through the inconsistent role hierarchy to arrive at a structure that could be visualised clearly",
      "Collaborated with developers on a GPS-based check-in/check-out system, restricting attendance logging to within a 50m radius of the office location",
    ],
  outcomes: [
  { value: "20+", label: "Screens designed" },
  { value: "60%", label: "Overall user experience" },
  { value: "88%", label: "Client satisfaction" },
],
    cover: projectTwo,
  },
  {
    slug: "hr mobile application",
    n: "03",
    title: "HR Mobile Application",
    description:
      "A comprehensive HR management solution designed for seamless mobile integration and improved employee engagement.",
    year: "2025",
    tags: ["Design System", "End to End Design", "User Experience"],
    client: "Internal & External Business",
    role: "Lead Product Designer",
    duration: "2 months",
        overview:
      "The HR software's web dashboard worked well, but the company also needed a mobile app covering the same core functionality leave balance, requests, approvals, and company info in a form employees could use from their phones. I designed this end-to-end, from information architecture through to developer handoff.",
    challenge:
      "The web dashboard's table-heavy layout multiple columns of data per screen didn't translate directly to mobile. Fields that sat comfortably side by side on a desktop screen had to be rethought as stacked, scannable cards without losing any of the information density users relied on.",
    approach: [
      "Designed the mobile app end-to-end, from navigation structure through to final screens",
      "Restructured multi-column web tables into card-based layouts suited to a single-column mobile screen",
      "Built the UI using Material UI components, so the design language matched what developers could implement directly from the library",
      "Handed off the design to the development team, with Material UI as the shared reference reducing back-and-forth on implementation",
    ],
   outcomes: [
  { value: "100+", label: "Screens designed" },
  { value: "85%", label: "Overall user experience" },
  { value: "90%", label: "Client satisfaction" },
],
    cover: projectThree,
  },
  {
    slug: "real estete",
    n: "04",
    title: "Real Estate Website",
    description:
      "Turning a raw reporting engine into a guided workflow non-analysts could actually finish.",
    year: "2025",
    tags: ["Website", "Research", "React & JavaScript"],
    client: "Internal Business",
    role: "Frontend Developer and UI/UX Designer",
    duration: "2 weeks",
        overview:
      "A real estate website for a UAE-based business, built for the MD to list and manage property sales and rentals covering both buyers and sellers. The site was developed largely with AI assistance, using React and JavaScript as the core stack.",
    challenge:
      "I didn't come in with a development background just a working knowledge of basic front-end concepts and built the site using AI tooling on top of that. The main challenge was debugging the unexpected issues that came up along the way: tracking down bugs, understanding what was actually causing them, and resolving them before the site was ready to go live. I deployed to Vercel first to test everything, then moved it onto the live domain once it was stable.",
    approach: [
      "Designed a modern layout and UI for the site from scratch",
      "Built the site using React and JavaScript, with AI tools supporting the development process",
      "Debugged and resolved issues surfaced during development before moving to production",
      "Deployed to Vercel for staging and testing, then migrated to the live domain",
      "Implemented technical SEO to improve search visibility",
    ],
    outcomes: [
      { value: "80%", label: "Overall user experience" },
      { value: "95%", label: "Technical SEO score" },
      { value: "97%", label: "PageSpeed Insights score" },
    ],
    cover: projectFour,
  },
  {
    slug: "e-commerce",
    n: "05",
    title: "E-commerce Mobile App Design",
    description:
      "Storefront redesign that lifted checkout completion by 34% and halved abandonment on mobile.",
    year: "2026",
    tags: ["E-commerce", "UI/UX", "UI Interaction"],
    client: "Local Super Market",
    role: "UI/UX Designer",
    duration: "1 weeks",
        overview:
      "An e-commerce mobile app for a local supermarket client, covering product browsing, categories, and recommendations. The project was scoped down early the client paused it after a few screens due to budget constraints, so the work stayed at design stage without moving into development.",
    challenge:
      "This project drew directly on prior e-commerce design experience, so the design process itself moved smoothly without any major obstacles the main constraint was working within a short one-week timeline before the client put the project on hold.",
    approach: [
      "Researched existing e-commerce apps to inform UI direction and identify useful patterns",
      "Started with wireframes and reviewed them with developers, adjusting the layout based on their feedback",
      "Built out high-fidelity screens once the wireframe direction was approved",
      "Connected the screens into a prototype to present an MVP structure to the client",
    ],
 outcomes: [
  { value: "5", label: "Screens designed" },
  { value: "55%", label: "Overall user experience" },
  { value: "70%", label: "Client satisfaction" },
],
    cover: projectFive,
  },
  {
    slug: "Dashboard",
    n: "06",
    title: "Learning Dashboard",
    description:
      "Motion-led marketing site for a Series A launch, built to hold up on spotty conference wifi.",
    year: "2026",
    tags: ["Product", "Web Build", "Development"],
    client: "Student Focused",
    role: "Brand and web design",
    duration: "3 months",
        overview:
      "A course learning dashboard aimed at students and fresh graduates who don't make it through campus placements. Many of them know they need new skills before walk-in interviews, but get stuck at the very first step figuring out which course, channel, or career path is actually worth their time. The dashboard curates learning resources from trusted YouTube channels into one structured place, alongside ATS-friendly resume guidance.",
    challenge:
      "There's no shortage of AI tools or course platforms already solving 'help me learn something.'The harder problem was narrowing that down rather than adding to it most students aren't short on options, they're short on a way to tell which option is actually worth their time. The dashboard needed to do less, not more: fewer choices, but the right ones.",
    approach: [
      "Identified the real gap not a lack of learning content, but a lack of curation and direction for students choosing where to start",
      "Curated courses and resources from trusted YouTube channels rather than building generic course listings",
      "Structured learning paths around career goals, so students pick a direction rather than search randomly",
      "Added resume-building guidance with ATS-friendly resume support alongside the learning paths",
      "Currently in active development, with guidance, structure, and career-support features being added iteratively",
    ],
   outcomes: [
  { value: "30-35%", label: "Development progress" },
  { value: "50%", label: "Overall user experience" },
  { value: "80%", label: "Client satisfaction" },
],
    cover: projectSix,
  },
];

export const getProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);