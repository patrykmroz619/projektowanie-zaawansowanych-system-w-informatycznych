import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const BASE_URL = process.env.API_URL ?? "http://localhost:3001";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  process.exit(1);
}

interface Tag {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<{ status: number; body: T }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  let body: T;
  try {
    body = (await res.json()) as T;
  } catch {
    body = undefined as T;
  }
  return { status: res.status, body };
}

const TAG_NAMES = ["Tech", "Lifestyle", "Education", "Travel", "Health"];

const SEED_ARTICLES = [
  {
    category: "Tech",
    title: "The Future of Artificial Intelligence in Everyday Life",
    content: `Artificial intelligence is no longer a concept confined to science fiction. It is rapidly becoming a foundational part of our daily lives, from the recommendation algorithms that curate our social media feeds to the voice assistants we use to set reminders and control smart home devices.

The most visible manifestation of AI today is in large language models. These systems can write essays, answer complex questions, generate code, and hold nuanced conversations. But beneath the surface, AI is quietly transforming industries in ways that rarely make headlines.

In healthcare, machine learning models analyze medical imaging with accuracy that rivals experienced radiologists. In finance, AI systems detect fraudulent transactions in milliseconds. In agriculture, computer vision tools help farmers identify crop diseases before they spread.

What does this mean for ordinary people? The next decade will likely bring AI-powered tools that make expert-level knowledge more accessible. Imagine a legal assistant that can help you understand a contract, or a health advisor that synthesizes your medical history to flag potential risks. The democratization of expertise through AI could be one of the most significant social shifts of our era.

Of course, these advances come with real challenges: questions of bias, privacy, job displacement, and accountability. How we navigate these issues will define the legacy of this technological moment.`,
  },
  {
    category: "Lifestyle",
    title: "Finding Balance: A Minimalist Approach to Modern Living",
    content: `There is a quiet revolution happening in homes across the world. People are decluttering their spaces, simplifying their schedules, and asking a deceptively simple question: what actually adds value to my life?

Minimalism is often misunderstood as an aesthetic — stark white rooms with a single plant and a carefully positioned lamp. But at its core, it is a philosophy about intentionality. It is about directing your finite time, attention, and energy toward the things that matter most to you.

The practical starting point for many people is their physical space. Simply asking "do I use this, do I love this, does this serve a purpose?" is enough to begin.

From there, the principles extend naturally into time and digital life. A packed calendar filled with obligations you resent is just as cluttered as a room full of objects you don't use. Unsubscribing from email lists, limiting social media to specific times of day, and protecting blocks of unscheduled time are all acts of minimalism.

The paradox is that by doing and owning less, many people find they experience more — more presence, more creativity, more genuine connection with the people around them.`,
  },
  {
    category: "Education",
    title: "Learning How to Learn: The Science Behind Effective Study",
    content: `Most of us spend years in school without ever being taught how to study effectively. We highlight textbooks, re-read notes, and cram before exams — techniques that feel productive but are surprisingly ineffective according to decades of cognitive science research.

The most powerful learning techniques share a common characteristic: they are difficult. The brain consolidates memories more strongly when it has to work to retrieve information. This is why passive re-reading barely moves the needle, while active recall — closing your notes and testing yourself — produces dramatically better long-term retention.

Spaced repetition takes this further by scheduling review sessions at increasing intervals. Instead of reviewing material once intensively, you revisit it multiple times over days, weeks, and months. Apps like Anki have turned this principle into a systematic practice used by medical students and language learners.

Interleaving — mixing different topics or problem types within a single study session — is another counterintuitive but highly effective technique. It feels harder than blocking (studying one topic at a time), but that difficulty is precisely what drives deeper learning.

Understanding these principles transforms how you approach any new subject. The goal shifts from performing comprehension during study sessions to building durable knowledge that you can actually use.`,
  },
  {
    category: "Travel",
    title: "Slow Travel: Why Less Ground Covered Means More Discovered",
    content: `The standard tourist playbook is well-known: arrive in a city, check off the major landmarks in two days, move on. It is efficient, and it gives you stories to tell. But more and more travelers are questioning whether this pace actually delivers the experience they are looking for.

Slow travel is a deliberate alternative. Instead of visiting five countries in three weeks, you spend three weeks in one city. You shop at the neighborhood market, discover the café where locals actually eat, learn a handful of words in the local language, and begin to understand the rhythm of everyday life in a place.

The shift changes what travel feels like. You stop feeling like a spectator rushing between staged experiences and start feeling like a temporary resident. You notice the way light hits the old buildings in the late afternoon. You overhear conversations. You get lost and find something better than what you were looking for.

There is also an environmental argument for slow travel. Fewer flights mean a lower carbon footprint. And there is an economic argument: spending more time in fewer places tends to mean more money going to local businesses rather than international hotel chains.

Perhaps most importantly, slow travel is memorable in a way that whirlwind itineraries often aren't. A month in Lisbon will stay with you longer than a week covering six cities.`,
  },
  {
    category: "Health",
    title: "The Overlooked Foundations of Long-Term Health",
    content: `There is a vast industry dedicated to selling you complex solutions to health problems that often have simple — if not easy — answers. Supplements, biohacking devices, specialized diets, and recovery protocols generate billions in revenue every year. Yet the research consistently points back to a handful of fundamentals.

Sleep is the most underrated health intervention available. During sleep, the brain clears metabolic waste, consolidates memories, and regulates hormones that control hunger, stress response, and immune function. Chronic sleep deprivation is associated with increased risk of heart disease, diabetes, cognitive decline, and depression.

Movement — not necessarily intense exercise, but consistent daily movement — is the second pillar. Sitting for extended periods has independent negative health effects even in people who exercise regularly. Building movement into the structure of your day matters alongside dedicated exercise time.

The third foundation is social connection. The research on loneliness is striking: its health effects are comparable in magnitude to smoking. Investing in relationships is not a soft, optional part of a healthy life — it is a biological necessity.

Diet, stress management, and purpose round out the picture. But the point is that the basics, done consistently over decades, account for the vast majority of what we can influence about our health.`,
  },
  {
    category: "Tech",
    title: "Open Source Software and the Commons of the Digital Age",
    content: `The software that runs the modern internet is, to a surprising degree, free. Not free as in cheap — free as in freely shared, modified, and distributed. Linux powers the majority of web servers. PostgreSQL stores critical data for millions of applications. React, built by Facebook and open-sourced in 2013, underpins countless user interfaces.

Open source software represents one of the most remarkable examples of large-scale voluntary collaboration in human history. Thousands of developers, most unpaid, contribute to codebases that generate enormous economic value. The Linux Foundation estimates that the total value of the open source code in a typical enterprise application is in the billions of dollars.

What motivates this? For many contributors, it is a combination of reputation, learning, and genuine belief in the value of shared infrastructure. Contributing to a respected open source project is a credential — and a way of giving back to tools that accelerated your own work.

But the model has tensions. The most critical infrastructure is often maintained by tiny teams with little funding. When a vulnerability is discovered in a widely-used open source library, the consequences can cascade across the internet.

Finding sustainable models for open source development remains an open problem. Sponsorship platforms, foundation models, and dual-licensing approaches each have trade-offs. The digital commons needs tending.`,
  },
];

const SEED_COMMENTS: Array<{ articleTitle: string; content: string }> = [
  {
    articleTitle: "The Future of Artificial Intelligence in Everyday Life",
    content:
      "Really thoughtful piece. The part about democratizing expertise is what excites me most about AI.",
  },
  {
    articleTitle: "The Future of Artificial Intelligence in Everyday Life",
    content:
      "The accountability question is huge and I don't think we've figured it out yet. Great read.",
  },
  {
    articleTitle: "Finding Balance: A Minimalist Approach to Modern Living",
    content:
      "This resonates deeply. I cleared out half my apartment last year and it genuinely changed how I feel at home.",
  },
  {
    articleTitle: "Learning How to Learn: The Science Behind Effective Study",
    content:
      "I wish someone had shown me spaced repetition in university. Started using it for language learning recently and the difference is remarkable.",
  },
  {
    articleTitle: "Slow Travel: Why Less Ground Covered Means More Discovered",
    content:
      "Spent six weeks in Porto last year doing exactly this. It's the only trip I still think about daily.",
  },
];

async function main() {
  console.log(`Connecting to API at ${BASE_URL}...\n`);

  // Step 1: Login as admin
  const loginRes = await apiFetch<{ token?: string; message?: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (loginRes.status !== 200 || !loginRes.body.token) {
    console.error(`Login failed (${loginRes.status}): ${loginRes.body.message ?? "unknown error"}`);
    console.error("Make sure the API is running and ADMIN_EMAIL/ADMIN_PASSWORD are correct.");
    process.exit(1);
  }

  const token = loginRes.body.token;
  console.log("Logged in as admin.\n");

  // Step 2: Create tags
  let tagsCreated = 0;
  let tagsSkipped = 0;

  for (const name of TAG_NAMES) {
    const res = await apiFetch<{ id?: number; message?: string }>(
      "/api/tags",
      { method: "POST", body: JSON.stringify({ name }) },
      token,
    );
    if (res.status === 201) {
      console.log(`  Tag created: ${name}`);
      tagsCreated++;
    } else if (res.status === 409) {
      console.log(`  Tag skipped (exists): ${name}`);
      tagsSkipped++;
    } else {
      console.warn(`  Tag "${name}" failed (${res.status}): ${res.body.message}`);
    }
  }

  // Step 3: Fetch all tags to build lookup
  const tagsRes = await apiFetch<Tag[]>("/api/tags");
  const tagsByName: Record<string, number> = {};
  for (const tag of tagsRes.body) {
    tagsByName[tag.name] = tag.id;
  }

  // Step 4: Create articles
  let articlesCreated = 0;
  let articlesSkipped = 0;
  const createdArticlesByTitle: Record<string, number> = {};

  for (const article of SEED_ARTICLES) {
    // Check if it already exists
    const checkRes = await apiFetch<{ data: Article[]; total: number }>(
      `/api/articles?title=${encodeURIComponent(article.title)}&limit=10`,
    );
    const existing = checkRes.body.data?.find(
      (a) => a.title.toLowerCase() === article.title.toLowerCase(),
    );
    if (existing) {
      console.log(`  Article skipped (exists): "${article.title}"`);
      createdArticlesByTitle[article.title] = existing.id;
      articlesSkipped++;
      continue;
    }

    const tagId = tagsByName[article.category];
    const createRes = await apiFetch<Article & { message?: string }>(
      "/api/articles",
      {
        method: "POST",
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          tagIds: tagId ? [tagId] : [],
        }),
      },
      token,
    );

    if (createRes.status === 201) {
      console.log(`  Article created: "${article.title}"`);
      createdArticlesByTitle[article.title] = createRes.body.id;
      articlesCreated++;
    } else {
      console.warn(`  Article failed (${createRes.status}): ${createRes.body.message}`);
    }
  }

  // Step 5: Create comments
  let commentsCreated = 0;
  let commentsSkipped = 0;

  for (const comment of SEED_COMMENTS) {
    const articleId = createdArticlesByTitle[comment.articleTitle];
    if (!articleId) {
      console.log(`  Comment skipped (article not found): "${comment.articleTitle}"`);
      commentsSkipped++;
      continue;
    }

    const res = await apiFetch<{ id?: number; message?: string }>(
      `/api/articles/${articleId}/comments`,
      { method: "POST", body: JSON.stringify({ content: comment.content }) },
      token,
    );

    if (res.status === 201) {
      commentsCreated++;
    } else {
      console.warn(`  Comment failed (${res.status}): ${res.body.message}`);
    }
  }

  console.log("\n--- Seed complete ---");
  console.log(`Tags:     ${tagsCreated} created, ${tagsSkipped} skipped`);
  console.log(`Articles: ${articlesCreated} created, ${articlesSkipped} skipped`);
  console.log(`Comments: ${commentsCreated} created, ${commentsSkipped} skipped`);
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
