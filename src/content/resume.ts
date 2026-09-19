import type { ResumeContent } from './types'

export const RESUME_PDF_PATH = '/Abhrajeet_Mukherjee_Resume_2026.pdf'

/** Source of truth: "Resume Abhrajeet 2026" PDF. Keep wording faithful to the résumé. */
export const resume: ResumeContent = {
  profile: {
    fullName: 'Abhrajeet Mukherjee',
    firstName: 'Abhrajeet',
    title: 'Software Engineer, AI Backend',
    tagline: 'I build the systems behind modern financial intelligence.',
    summary:
      'Software engineer experienced in building LLM-powered backend systems, agentic workflows, scalable APIs, async orchestration, retrieval pipelines and enterprise AI automation platforms.',
    location: 'Bengaluru, India',
    avatarInitials: 'AM',
  },
  contacts: [
    { id: 'email', label: 'Email', value: 'abhrajeet2002@gmail.com', href: 'mailto:abhrajeet2002@gmail.com', external: false },
    { id: 'phone', label: 'Phone', value: '+91 96482 64288', href: 'tel:+919648264288', external: false },
    { id: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/abhrajeet-m-a1b3b7104', href: 'https://www.linkedin.com/in/abhrajeet-m-a1b3b7104/', external: true },
    { id: 'github', label: 'GitHub', value: 'github.com/honitus7', href: 'https://github.com/honitus7', external: true },
    { id: 'resume', label: 'Résumé (PDF)', value: 'Abhrajeet_Mukherjee_Resume_2026.pdf', href: RESUME_PDF_PATH, external: true },
  ],
  experience: [
    {
      id: '73strings-engineer',
      company: '73 Strings',
      role: 'Software Developer, Full Stack AI Engineer',
      location: 'Bengaluru',
      period: { start: '2025-06', end: null, label: 'Jun 2025 – Present' },
      highlights: [
        'Built AI backend systems for PE valuation workflows across KKR, Blackstone and Apollo, enabling scalable portfolio automation.',
        'Redesigned portfolio aggregation using acyclic tree-based metrics rollup engines for hierarchical fund and fund-of-funds analytics.',
        'Contributed to the core Sidebar Agent that triggers platform workflows and tool-based insights via LLM orchestration.',
        'Built the Sheriff validation agent for business-rule governance, workflow reliability and automated financial data-quality checks.',
        'Scaled async orchestration systems from 20 to 150 concurrent jobs at ~50% memory utilisation across distributed enterprise services.',
      ],
      tech: ['Spring Boot', 'Java 21', 'Python', 'LLM Orchestration', 'RabbitMQ', 'Redis', 'PostgreSQL', 'AWS'],
    },
    {
      id: '73strings-intern',
      company: '73 Strings',
      role: 'Software Engineer Intern',
      location: 'Bengaluru',
      period: { start: '2025-01', end: '2025-06', label: 'Jan 2025 – Jun 2025' },
      highlights: [
        'Built backend APIs and enterprise workflows supporting document processing, validation and financial data operations.',
        'Created a Node.js migration pipeline enabling seamless data portability between PROD environments across 4 enterprise products.',
        'Developed Angular-based financial workflow modules for NAV computation and real-time portfolio monitoring.',
        'Reduced API response time by 90% using optimised compression, payload reduction and backend processing improvements.',
      ],
      tech: ['Node.js', 'Angular', 'Spring Boot', 'PostgreSQL', 'Elasticsearch'],
    },
    {
      id: 'unity-growth-fund',
      company: 'Unity Growth Fund',
      role: 'Full Stack Engineer Intern',
      location: 'Remote',
      period: { start: '2024-07', end: '2024-12', label: 'Jul 2024 – Dec 2024' },
      highlights: [
        'Built and maintained a private-equity investment platform focused on portfolio monitoring and investor performance analytics.',
        'Developed scalable modules using React, Redux, Node.js and Flutter for real-time financial workflows.',
        'Designed LoopBack 4 APIs powering 15+ investment workflow features including valuation and fund distribution tracking.',
        'Implemented S3-based document workflows with tagging and retrieval pipelines for operational efficiency.',
      ],
      tech: ['React', 'Redux', 'Node.js', 'LoopBack 4', 'Flutter', 'AWS S3'],
    },
  ],
  projects: [
    {
      id: 'voice-sentiment',
      name: 'Voice Sentiment Analysis Pipeline',
      category: 'Applied ML Research',
      summary: 'Speech-intelligence pipeline that fuses acoustic features with ASR-driven semantic sentiment.',
      highlights: [
        'Built speech intelligence pipelines using MFCCs, formants, F0 tracking and RMS energy profiling.',
        'Combined acoustic embeddings with ASR-driven semantic sentiment and contextual inference classification.',
        'Implemented prosodic analysis for speaking-rate variability, tonal stress and pause segmentation.',
        'Designed adaptive vocal baseline models for emotional deviation and conversational confidence scoring.',
      ],
      tech: ['Python', 'Librosa', 'PyTorch', 'Transformers', 'NumPy'],
    },
    {
      id: 'agentic-sales-calls',
      name: 'Agentic Sales Call Analysis Platform',
      category: 'Conversational AI Analytics',
      summary: 'Hybrid speech + LLM reasoning system that turns sales calls into coaching intelligence.',
      highlights: [
        'Built AI intelligence pipelines extracting objections, buying intent and conversational behaviour signals.',
        'Designed hybrid speech and LLM reasoning systems generating contextual coaching intelligence workflows.',
      ],
      tech: ['Python', 'FastAPI', 'LLM Agents', 'Vector Search', 'RAG'],
    },
    {
      id: 'marketostate',
      name: 'Marketostate',
      category: 'Product & Full Stack Engineering',
      summary: 'Plot visualisation and broker-management software with immersive 3D plot exploration.',
      highlights: [
        'Built immersive 3D visualisation systems enabling interactive plot exploration and guided walkthroughs.',
        'Deployed production-ready real-estate platforms improving customer engagement and remote buyer discovery.',
      ],
      tech: ['React', 'Three.js', 'Node.js', 'PostgreSQL'],
    },
  ],
  skills: [
    { id: 'genai', name: 'Gen AI Systems', skills: ['AI Agents', 'RAG Pipelines', 'LLM Orchestration', 'Prompt Engineering', 'Tool Calling', 'MCP', 'Vector Search', 'AI Workflows', 'Evals', 'Multimodal AI'] },
    { id: 'ml', name: 'ML Frameworks', skills: ['PyTorch', 'Scikit-learn', 'Transformers', 'TensorFlow', 'Librosa', 'Pandas', 'NumPy'] },
    { id: 'backend', name: 'Backend Frameworks', skills: ['Spring Boot', 'Node.js', 'FastAPI'] },
    { id: 'frontend', name: 'Frontend Frameworks', skills: ['React', 'Next.js', 'Angular'] },
    { id: 'infra', name: 'Data & Infrastructure', skills: ['AWS', 'Azure', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Elasticsearch', 'Docker'] },
    { id: 'languages', name: 'Programming Languages', skills: ['C++', 'Python', 'Java', 'TypeScript'] },
  ],
  education: [
    {
      id: 'bits-pilani',
      institution: 'BITS Pilani',
      degree: 'Bachelor of Engineering, Computer Science',
      year: '2025',
      score: 'CGPA 7.17',
      coursework: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'OOP'],
    },
    { id: 'ryan-mumbai', institution: 'Ryan International School, Mumbai', degree: 'Class XII', year: '2021', score: '95%' },
    { id: 'dps-varanasi', institution: 'Delhi Public School, Varanasi', degree: 'Class X', year: '2019', score: '94.2%' },
  ],
  leadership: [
    {
      id: 'quark-controls',
      organisation: 'Quark Controls',
      role: 'Chief Coordinator and Events Head',
      period: { start: '2022-05', end: '2023-06', label: 'May 2022 – Jun 2023' },
      highlights: [
        'Scaled Quark, the annual techno-management fest, increasing revenue by 58% through strategic growth initiatives.',
        'Led a 250+ member cross-functional team managing operations, stakeholders and execution workflows.',
        'Managed a 1+ crore budget using data-driven operational planning and allocation strategies.',
      ],
    },
  ],
}
