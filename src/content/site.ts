// Single source of truth for site copy. Facts from resume + live GitHub repos.
// Voice: terse, professional, human. No marketing words.

export const site = {
  name: "Asmi Yadav",
  role: "Making LLMs useful, one production pipeline at a time.",
  location: "Bangalore",
  availability: "Open to AI/ML, GenAI and Agentic AI developer roles.",
  links: {
    email: "asmiyadav2004@gmail.com",
    phone: "+91 99931 00849",
    linkedin: "https://linkedin.com/in/asmi-yadav-b0824724a",
    github: "https://github.com/neuralasmi",
  },
  about:
    "I'm wired to spot what's broken, repetitive, or ready to be automated, and my brain is already planning the fix, usually with a fine-tuned transformer or a RAG pipeline behind FastAPI and Docker. I ran a marketplace solo for 50 students and 10 cooks, and it taught me to ship faster and better.",
  projects: [
    {
      title: "CineSearch",
      line: "Ask questions over your own docs, get streamed answers.",
      stack: ["FastAPI", "LangChain", "FAISS", "Llama3/Ollama", "Docker", "SSE"],
      href: "https://github.com/neuralasmi/CineSearch",
      desc: "RAG over movie metadata and plots: LangChain chunking, sentence-transformer embeddings, sub-50ms FAISS retrieval, answers streamed over SSE. Llama3 runs locally via Ollama. One command setup with docker-compose.",
    },
    {
      title: "StreamServe",
      line: "Model serving with hot-swappable versions and autoscaling.",
      stack: ["FastAPI", "Docker", "Kubernetes", "scikit-learn"],
      href: "https://github.com/neuralasmi/StreamServe",
      desc: "Production-grade serving: versioned models you can hot-swap without downtime, batch inference, health checks for K8s probes, HPA-ready manifests. Multi-stage slim image.",
    },
    {
      title: "MetaTag",
      line: "BERT NER for content metadata, entity F1 ≈ 0.91.",
      stack: ["BERT", "HuggingFace", "PyTorch", "FastAPI"],
      href: "https://github.com/neuralasmi/MetaTag",
      desc: "Fine-tuned bert-base-uncased for named entities across 8 types (character, location, theme, mood and more). Word-to-subword alignment, seqeval eval, FastAPI inference with batch support.",
    },
  ],
  experience: [
    {
      role: "AI Content Analyst, Intern",
      org: "FRND",
      period: "Jan 2026 to Feb 2026",
      desc: "Cleaned chatbot training data until it stopped repeating itself.",
    },
    {
      role: "Software Developer, Freelance",
      org: "Tiffinly",
      period: "Apr 2025 to Sept 2025",
      desc: "Marketplace MVP connecting students with home cooks. 50 students, 10 cooks, one pilot.",
    },
  ],
  skills: [
    { group: "AI/ML", items: ["PyTorch", "HuggingFace Transformers", "Scikit-learn", "XGBoost", "LangChain", "FAISS", "Pandas", "NumPy"] },
    { group: "Backend & Systems", items: ["Python", "FastAPI", "Docker", "docker-compose", "Linux", "REST", "SSE", "Git"] },
    { group: "Data & MLOps", items: ["MongoDB", "MySQL", "MLflow", "W&B", "Postman"] },
    { group: "Languages", items: ["Python", "Java", "C", "C++", "SQL", "HTML/CSS"] },
  ],
  education: [
    { school: "Manipal University Jaipur", detail: "B.Tech CS (IoT & Intelligent Systems), 2022 to 2026" },
    { school: "St. Joseph's Coed Sr. Sec. School, Bhopal", detail: "CBSE 12th, 91.3%" },
  ],
};

export type Site = typeof site;
