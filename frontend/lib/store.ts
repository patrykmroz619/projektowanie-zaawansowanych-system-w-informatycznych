import { Post, Comment } from "./types";

const POSTS_KEY = "blog_posts";
const COMMENTS_KEY = "blog_comments";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Everyday Life",
    category: "Tech",
    content: `Artificial intelligence is no longer a concept confined to science fiction. It is rapidly becoming a foundational part of our daily lives, from the recommendation algorithms that curate our social media feeds to the voice assistants we use to set reminders and control smart home devices.

The most visible manifestation of AI today is in large language models. These systems can write essays, answer complex questions, generate code, and hold nuanced conversations. But beneath the surface, AI is quietly transforming industries in ways that rarely make headlines.

In healthcare, machine learning models analyze medical imaging with accuracy that rivals — and sometimes exceeds — experienced radiologists. In finance, AI systems detect fraudulent transactions in milliseconds. In agriculture, computer vision tools help farmers identify crop diseases before they spread.

What does this mean for ordinary people? The next decade will likely bring AI-powered tools that make expert-level knowledge more accessible. Imagine a legal assistant that can help you understand a contract, or a health advisor that synthesizes your medical history to flag potential risks. The democratization of expertise through AI could be one of the most significant social shifts of our era.

Of course, these advances come with real challenges: questions of bias, privacy, job displacement, and accountability. How we navigate these issues will define the legacy of this technological moment.`,
    excerpt:
      "Artificial intelligence is no longer a concept confined to science fiction. It is rapidly becoming a foundational part of our daily lives.",
    author: "Jordan Lee",
    createdAt: "2025-03-01T09:00:00Z",
    updatedAt: "2025-03-01T09:00:00Z",
  },
  {
    id: "2",
    title: "Finding Balance: A Minimalist Approach to Modern Living",
    category: "Lifestyle",
    content: `There is a quiet revolution happening in homes across the world. People are decluttering their spaces, simplifying their schedules, and asking a deceptively simple question: what actually adds value to my life?

Minimalism is often misunderstood as an aesthetic — stark white rooms with a single plant and a carefully positioned lamp. But at its core, it is a philosophy about intentionality. It is about directing your finite time, attention, and energy toward the things that matter most to you.

The practical starting point for many people is their physical space. The KonMari method popularized the idea of keeping only things that "spark joy," but you don't need a formal framework. Simply asking "do I use this, do I love this, does this serve a purpose?" is enough to begin.

From there, the principles extend naturally into time and digital life. A packed calendar filled with obligations you resent is just as cluttered as a room full of objects you don't use. Unsubscribing from email lists, limiting social media to specific times of day, and protecting blocks of unscheduled time are all acts of minimalism.

The paradox is that by doing and owning less, many people find they experience more — more presence, more creativity, more genuine connection with the people around them.`,
    excerpt:
      "Minimalism is often misunderstood as an aesthetic. But at its core, it is a philosophy about intentionality and directing your finite energy toward what matters.",
    author: "Sam Rivera",
    createdAt: "2025-03-05T11:30:00Z",
    updatedAt: "2025-03-05T11:30:00Z",
  },
  {
    id: "3",
    title: "Learning How to Learn: The Science Behind Effective Study",
    category: "Education",
    content: `Most of us spend years in school without ever being taught how to study effectively. We highlight textbooks, re-read notes, and cram before exams — techniques that feel productive but are surprisingly ineffective according to decades of cognitive science research.

The most powerful learning techniques share a common characteristic: they are difficult. The brain consolidates memories more strongly when it has to work to retrieve information. This is why passive re-reading barely moves the needle, while active recall — closing your notes and testing yourself — produces dramatically better long-term retention.

Spaced repetition takes this further by scheduling review sessions at increasing intervals. Instead of reviewing material once intensively, you revisit it multiple times over days, weeks, and months. Apps like Anki have turned this principle into a systematic practice used by medical students, language learners, and anyone who needs to retain large volumes of information.

Interleaving — mixing different topics or problem types within a single study session — is another counterintuitive but highly effective technique. It feels harder than blocking (studying one topic at a time), but that difficulty is precisely what drives deeper learning.

Understanding these principles transforms how you approach any new subject. The goal shifts from performing comprehension during study sessions to building durable knowledge that you can actually use.`,
    excerpt:
      "Most of us spend years in school without ever being taught how to study effectively. The science of learning offers surprisingly powerful — and counterintuitive — strategies.",
    author: "Alex Chen",
    createdAt: "2025-03-10T14:00:00Z",
    updatedAt: "2025-03-10T14:00:00Z",
  },
  {
    id: "4",
    title: "Slow Travel: Why Less Ground Covered Means More Discovered",
    category: "Travel",
    content: `The standard tourist playbook is well-known: arrive in a city, check off the major landmarks in two days, move on. It is efficient, and it gives you stories to tell. But more and more travelers are questioning whether this pace actually delivers the experience they are looking for.

Slow travel is a deliberate alternative. Instead of visiting five countries in three weeks, you spend three weeks in one city. You shop at the neighborhood market, discover the café where locals actually eat, learn a handful of words in the local language, and begin to understand the rhythm of everyday life in a place.

The shift changes what travel feels like. You stop feeling like a spectator rushing between staged experiences and start feeling like a temporary resident. You notice the way light hits the old buildings in the late afternoon. You overhear conversations. You get lost and find something better than what you were looking for.

There is also an environmental argument for slow travel. Fewer flights mean a lower carbon footprint. And there is an economic argument: spending more time in fewer places tends to mean more money going to local businesses rather than international hotel chains and tourist-oriented restaurants.

Perhaps most importantly, slow travel is memorable in a way that whirlwind itineraries often aren't. A month in Lisbon will stay with you longer than a week covering six cities.`,
    excerpt:
      "Instead of visiting five countries in three weeks, slow travel invites you to spend three weeks in one place — and discover something far more meaningful.",
    author: "Maya Patel",
    createdAt: "2025-03-12T08:00:00Z",
    updatedAt: "2025-03-12T08:00:00Z",
  },
  {
    id: "5",
    title: "The Overlooked Foundations of Long-Term Health",
    category: "Health",
    content: `There is a vast industry dedicated to selling you complex solutions to health problems that often have simple — if not easy — answers. Supplements, biohacking devices, specialized diets, and recovery protocols generate billions in revenue every year. Yet the research consistently points back to a handful of fundamentals.

Sleep is the most underrated health intervention available. During sleep, the brain clears metabolic waste, consolidates memories, and regulates hormones that control hunger, stress response, and immune function. Chronic sleep deprivation is associated with increased risk of heart disease, diabetes, cognitive decline, and depression. Yet it is the first thing people sacrifice when life gets busy.

Movement — not necessarily intense exercise, but consistent daily movement — is the second pillar. Sitting for extended periods has independent negative health effects even in people who exercise regularly. Building movement into the structure of your day (walking meetings, standing desks, taking stairs) matters alongside dedicated exercise time.

The third foundation is social connection. The research on loneliness is striking: its health effects are comparable in magnitude to smoking. Investing in relationships is not a soft, optional part of a healthy life — it is a biological necessity.

Diet, stress management, and purpose round out the picture. But the point is that the basics, done consistently over decades, account for the vast majority of what we can influence about our health.`,
    excerpt:
      "There is a vast industry selling complex solutions to health problems that often have simple answers. The research consistently points back to a handful of overlooked fundamentals.",
    author: "Dr. Chris Morgan",
    createdAt: "2025-03-14T10:00:00Z",
    updatedAt: "2025-03-14T10:00:00Z",
  },
  {
    id: "6",
    title: "Open Source Software and the Commons of the Digital Age",
    category: "Tech",
    content: `The software that runs the modern internet is, to a surprising degree, free. Not free as in cheap — free as in freely shared, modified, and distributed. Linux powers the majority of web servers. PostgreSQL stores critical data for millions of applications. React, built by Facebook and open-sourced in 2013, underpins countless user interfaces.

Open source software represents one of the most remarkable examples of large-scale voluntary collaboration in human history. Thousands of developers, most unpaid, contribute to codebases that generate enormous economic value. The Linux Foundation estimates that the total value of the open source code in a typical enterprise application is in the billions of dollars.

What motivates this? For many contributors, it is a combination of reputation, learning, and genuine belief in the value of shared infrastructure. Contributing to a respected open source project is a credential — and a way of giving back to tools that accelerated your own work.

But the model has tensions. The most critical infrastructure is often maintained by tiny teams with little funding. When a vulnerability is discovered in a widely-used open source library — as happened with Log4Shell in 2021 — the consequences can cascade across the internet.

Finding sustainable models for open source development remains an open problem. Sponsorship platforms, foundation models, and dual-licensing approaches each have trade-offs. The stakes are high: the digital commons needs tending.`,
    excerpt:
      "The software that runs the modern internet is, to a surprising degree, freely shared. Open source represents a remarkable example of large-scale voluntary collaboration.",
    author: "Jordan Lee",
    createdAt: "2025-03-15T16:00:00Z",
    updatedAt: "2025-03-15T16:00:00Z",
  },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: "Taylor W.",
    content:
      "Really thoughtful piece. The part about democratizing expertise is what excites me most about AI.",
    createdAt: "2025-03-02T10:00:00Z",
  },
  {
    id: "c2",
    postId: "1",
    author: "Priya S.",
    content:
      "The accountability question is huge and I don't think we've figured it out yet. Great read.",
    createdAt: "2025-03-03T08:30:00Z",
  },
  {
    id: "c3",
    postId: "2",
    author: "Marco L.",
    content:
      "This resonates deeply. I cleared out half my apartment last year and it genuinely changed how I feel at home.",
    createdAt: "2025-03-06T09:00:00Z",
  },
  {
    id: "c4",
    postId: "3",
    author: "Lena K.",
    content:
      "I wish someone had shown me spaced repetition in university. Started using it for language learning recently and the difference is remarkable.",
    createdAt: "2025-03-11T15:00:00Z",
  },
  {
    id: "c5",
    postId: "4",
    author: "James O.",
    content:
      "Spent six weeks in Porto last year doing exactly this. It's the only trip I still think about daily.",
    createdAt: "2025-03-13T11:00:00Z",
  },
];

function isInitialized(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("blog_initialized") === "true";
}

function initialize(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(MOCK_POSTS));
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(MOCK_COMMENTS));
  localStorage.setItem("blog_initialized", "true");
}

export function getPosts(): Post[] {
  if (typeof window === "undefined") return MOCK_POSTS;
  if (!isInitialized()) initialize();
  const raw = localStorage.getItem(POSTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getPost(id: string): Post | undefined {
  return getPosts().find((p) => p.id === id);
}

export function savePost(
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
): Post {
  const posts = getPosts();
  const now = new Date().toISOString();
  const newPost: Post = {
    ...data,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  localStorage.setItem(POSTS_KEY, JSON.stringify([newPost, ...posts]));
  return newPost;
}

export function updatePost(
  id: string,
  data: Partial<Omit<Post, "id" | "createdAt">>
): Post | undefined {
  const posts = getPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  posts[idx] = { ...posts[idx], ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return posts[idx];
}

export function deletePost(id: string): void {
  const posts = getPosts().filter((p) => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  // Also delete associated comments
  const comments = getComments().filter((c) => c.postId !== id);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function getComments(postId?: string): Comment[] {
  if (typeof window === "undefined") return MOCK_COMMENTS;
  if (!isInitialized()) initialize();
  const raw = localStorage.getItem(COMMENTS_KEY);
  const comments: Comment[] = raw ? JSON.parse(raw) : [];
  return postId ? comments.filter((c) => c.postId === postId) : comments;
}

export function addComment(
  data: Omit<Comment, "id" | "createdAt">
): Comment {
  const comments = getComments();
  const newComment: Comment = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(COMMENTS_KEY, JSON.stringify([...comments, newComment]));
  return newComment;
}
