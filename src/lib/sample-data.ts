import {
  createId,
  type ResumeStore,
  type ResumeVersion,
} from "@/lib/types";

function buildFrontendResume(): ResumeVersion {
  return {
    id: "version_frontend",
    name: "Frontend Developer",
    updatedAt: Date.now(),
    header: {
      name: "Alex Morgan",
      title: "Frontend Developer",
      phone: "+1 (555) 214-0987",
      email: "alex.morgan@email.com",
      location: "Austin, TX",
      links: [
        {
          id: createId("link"),
          label: "LinkedIn",
          url: "https://linkedin.com/in/alexmorgan",
        },
        {
          id: createId("link"),
          label: "GitHub",
          url: "https://github.com/alexmorgan",
        },
        {
          id: createId("link"),
          label: "Portfolio",
          url: "https://alexmorgan.dev",
        },
      ],
    },
    sections: [
      {
        id: createId("section"),
        title: "Professional Summary",
        visible: true,
        layout: "text",
        text: "Frontend developer with 6+ years building fast, accessible web apps. Strong in React, TypeScript, and design systems. Comfortable owning UI from wireframe to production and partnering closely with design and backend teams.",
        entries: [],
      },
      {
        id: createId("section"),
        title: "Technical Skills",
        visible: true,
        layout: "tags",
        text: "React, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind CSS, Redux, Node.js, REST APIs, Jest, Playwright, Git, Figma, Accessibility (WCAG)",
        entries: [],
      },
      {
        id: createId("section"),
        title: "Experience",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "Senior Frontend Engineer",
            subtitle: "Northstar Labs",
            dateRange: "2022 — Present",
            location: "Austin, TX (Remote)",
            description: "",
            bullets: [
              "Led rebuild of customer dashboard in Next.js and TypeScript, cutting median page load by 38%.",
              "Built a shared component library adopted by 4 product teams, reducing UI duplication.",
              "Partnered with design to ship accessible forms and tables meeting WCAG 2.1 AA.",
            ],
          },
          {
            id: createId("entry"),
            title: "Frontend Developer",
            subtitle: "Brightline Software",
            dateRange: "2019 — 2022",
            location: "Austin, TX",
            description: "",
            bullets: [
              "Delivered React features for a B2B analytics product used by 2,000+ weekly active users.",
              "Improved CI test coverage for UI packages from 42% to 81%.",
              "Mentored two junior engineers on TypeScript patterns and code review practices.",
            ],
          },
        ],
      },
      {
        id: createId("section"),
        title: "Projects",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "Resume Maker",
            subtitle: "Personal project",
            dateRange: "2026",
            location: "",
            description: "",
            bullets: [
              "Built a flexible resume editor with live A4 preview, custom sections, and local multi-version save.",
              "Focused on ATS-friendly typography and print/PDF export that matches the on-screen preview.",
            ],
          },
        ],
      },
      {
        id: createId("section"),
        title: "Education",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "B.S. Computer Science",
            subtitle: "University of Texas at Austin",
            dateRange: "2015 — 2019",
            location: "Austin, TX",
            description: "",
            bullets: [],
          },
        ],
      },
    ],
  };
}

function buildCloudResume(): ResumeVersion {
  return {
    id: "version_cloud",
    name: "Cloud / DevOps",
    updatedAt: Date.now(),
    header: {
      name: "Alex Morgan",
      title: "Cloud & DevOps Engineer",
      phone: "+1 (555) 214-0987",
      email: "alex.morgan@email.com",
      location: "Austin, TX",
      links: [
        {
          id: createId("link"),
          label: "LinkedIn",
          url: "https://linkedin.com/in/alexmorgan",
        },
        {
          id: createId("link"),
          label: "GitHub",
          url: "https://github.com/alexmorgan",
        },
        {
          id: createId("link"),
          label: "Azure",
          url: "https://learn.microsoft.com/en-us/users/alexmorgan",
        },
      ],
    },
    sections: [
      {
        id: createId("section"),
        title: "Professional Summary",
        visible: true,
        layout: "text",
        text: "Cloud engineer focused on Azure, CI/CD, and reliable delivery. Experience automating infrastructure, hardening deployments, and helping teams ship with confidence.",
        entries: [],
      },
      {
        id: createId("section"),
        title: "Technical Skills",
        visible: true,
        layout: "tags",
        text: "Azure, Bicep, Terraform, Docker, Kubernetes, GitHub Actions, Linux, Python, Bash, Monitoring, Networking, Identity & Access",
        entries: [],
      },
      {
        id: createId("section"),
        title: "Experience",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "Cloud Engineer",
            subtitle: "Northstar Labs",
            dateRange: "2022 — Present",
            location: "Austin, TX (Remote)",
            description: "",
            bullets: [
              "Automated Azure environments with Bicep and Terraform for three product lines.",
              "Designed GitHub Actions pipelines that cut release lead time from days to hours.",
              "Introduced observability baselines (logs, metrics, alerts) that reduced MTTR by 30%.",
            ],
          },
          {
            id: createId("entry"),
            title: "DevOps Engineer",
            subtitle: "Brightline Software",
            dateRange: "2019 — 2022",
            location: "Austin, TX",
            description: "",
            bullets: [
              "Migrated legacy services to containerized deployments on AKS.",
              "Implemented least-privilege identity patterns for CI service principals.",
            ],
          },
        ],
      },
      {
        id: createId("section"),
        title: "Azure Projects",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "Multi-region web platform",
            subtitle: "Northstar Labs",
            dateRange: "2024",
            location: "",
            description: "",
            bullets: [
              "Provisioned App Service, Front Door, Key Vault, and monitoring with reusable Bicep modules.",
              "Documented runbooks and rollout strategy used by on-call engineers.",
            ],
          },
        ],
      },
      {
        id: createId("section"),
        title: "Certifications",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "Microsoft Certified: Azure Administrator Associate",
            subtitle: "Microsoft",
            dateRange: "2023",
            location: "",
            description: "",
            bullets: [],
          },
        ],
      },
      {
        id: createId("section"),
        title: "Education",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "B.S. Computer Science",
            subtitle: "University of Texas at Austin",
            dateRange: "2015 — 2019",
            location: "Austin, TX",
            description: "",
            bullets: [],
          },
        ],
      },
    ],
  };
}

function buildGeneralResume(): ResumeVersion {
  const base = buildFrontendResume();
  return {
    ...base,
    id: "version_general",
    name: "General",
    header: {
      ...base.header,
      title: "Software Engineer",
    },
    sections: [
      {
        id: createId("section"),
        title: "Professional Summary",
        visible: true,
        layout: "text",
        text: "Software engineer with experience across frontend, cloud, and delivery. I build reliable products, communicate clearly, and adapt quickly to team and customer needs.",
        entries: [],
      },
      ...base.sections.filter((s) => s.title !== "Professional Summary"),
      {
        id: createId("section"),
        title: "Achievements",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "Engineering excellence award",
            subtitle: "Northstar Labs",
            dateRange: "2024",
            location: "",
            description: "Recognized for leading a cross-team performance initiative that improved core funnel conversion.",
            bullets: [],
          },
        ],
      },
    ],
  };
}

export function createDefaultStore(): ResumeStore {
  const versions = [
    buildFrontendResume(),
    buildCloudResume(),
    buildGeneralResume(),
  ];
  return {
    versions,
    activeVersionId: versions[0].id,
  };
}

export function createBlankVersion(name = "Untitled Resume"): ResumeVersion {
  return {
    id: createId("version"),
    name,
    updatedAt: Date.now(),
    header: {
      name: "Your Name",
      title: "Your Title",
      phone: "",
      email: "",
      location: "",
      links: [],
    },
    sections: [
      {
        id: createId("section"),
        title: "Professional Summary",
        visible: true,
        layout: "text",
        text: "",
        entries: [],
      },
      {
        id: createId("section"),
        title: "Experience",
        visible: true,
        layout: "entries",
        text: "",
        entries: [
          {
            id: createId("entry"),
            title: "",
            subtitle: "",
            dateRange: "",
            location: "",
            description: "",
            bullets: [""],
          },
        ],
      },
    ],
  };
}
