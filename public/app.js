const offeringsUrl = "./data/mathco_offerings.json";

const leadNameInput = document.querySelector("#leadName");
const linkedInInput = document.querySelector("#leadLinkedIn");
const profileTextInput = document.querySelector("#profileText");
const workNotesInput = document.querySelector("#workNotes");
const meetingGoalInput = document.querySelector("#meetingGoal");
const timelineInput = document.querySelector("#timeline");
const statusEl = document.querySelector("#status");

const summaryEl = document.querySelector("#summary");
const pitchEl = document.querySelector("#pitch");
const emailEl = document.querySelector("#email");
const linkedinEl = document.querySelector("#linkedin");
const copyButtons = document.querySelectorAll("[data-copy-target]");

const sampleProfile = `Senior Director of Revenue Operations at ExampleCorp
Experience:
- Leads global RevOps, GTM analytics, and pipeline optimization
- Prior: Director of Sales Analytics at ScaleUp Inc.
Skills: Revenue Operations, GTM Strategy, CRM, Forecasting, Data Warehousing, AI enablement
Education: MBA, University of Chicago
Interests: Building high-performing sales teams, AI for productivity`;

const agentScrapeButton = document.querySelector("#agentScrape");
const generateButton = document.querySelector("#generate");

const setStatus = (message, variant = "") => {
  statusEl.textContent = message;
  statusEl.className = variant ? `status ${variant}` : "status";
};

agentScrapeButton.addEventListener("click", () => {
  if (profileTextInput.value.trim().length === 0) {
    profileTextInput.value = sampleProfile;
    setStatus("Sample profile added. Click ‘Generate intel & outreach’.", "success");
  } else {
    setStatus("Profile content already present. Ready to generate.");
  }
});

const cleanLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const extractKeywords = (text) => {
  const keywords = new Set();
  const skillMatches = text.match(/skills?:?(.+)/i);
  if (skillMatches) {
    skillMatches[1]
      .split(/[,.]/)
      .map((skill) => skill.trim())
      .filter(Boolean)
      .forEach((skill) => keywords.add(skill.toLowerCase()));
  }

  const tokens = text
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3);

  tokens.forEach((token) => keywords.add(token.toLowerCase()));

  const phraseMatches = [
    "revenue operations",
    "sales analytics",
    "pipeline optimization",
    "gtm strategy",
    "data warehousing",
    "ai enablement",
  ];

  phraseMatches.forEach((phrase) => {
    if (text.toLowerCase().includes(phrase)) {
      keywords.add(phrase);
    }
  });

  return Array.from(keywords);
};

const summarizeProfile = (profileText) => {
  const lines = cleanLines(profileText);
  const headline = lines[0] || "Profile headline unavailable.";
  const experience = lines.filter((line) => line.toLowerCase().includes("- "));
  const interests = lines.filter((line) => line.toLowerCase().includes("interests"));
  const education = lines.filter((line) => line.toLowerCase().includes("education"));

  const summary = [
    `Headline: ${headline}`,
    `Experience highlights: ${experience.slice(0, 3).join(" ") || "N/A"}`,
    `Education: ${education.join(" ") || "N/A"}`,
    `Interests: ${interests.join(" ") || "N/A"}`,
  ];

  return summary.join("\n");
};

const buildPitch = (keywords, offerings, workNotes, meetingGoal, timeline) => {
  const normalizedKeywordSet = new Set(keywords.map((keyword) => keyword.toLowerCase()));

  const relevantOfferings = offerings.filter((offering) =>
    offering.triggers.some((trigger) => normalizedKeywordSet.has(trigger.toLowerCase()))
  );

  const selectedOfferings = relevantOfferings.length
    ? relevantOfferings
    : offerings.slice(0, 2);

  const pitchPoints = selectedOfferings.map(
    (offering) => `• ${offering.name}: ${offering.value}`
  );

  return [
    "Recommended positioning:",
    ...pitchPoints,
    "",
    `Leverage @work notes: ${workNotes || "Add discussion notes to personalize this further."}`,
    `Meeting goal: ${meetingGoal || "Confirm the desired meeting objective."}`,
    `Target timeline: ${timeline || "Set a clear date window for outreach."}`,
  ].join("\n");
};

const generateEmail = (leadName, profileSummary, pitch, meetingGoal, timeline) => {
  return [
    `Subject: ${leadName}, quick idea to accelerate your revenue operations`,
    "",
    `Hi ${leadName},`,
    "",
    `I took a look at your background and pulled a few highlights that stood out:`,
    profileSummary,
    "",
    `Based on that, here is a quick idea from MathCo that could help:`,
    pitch,
    "",
    `If this resonates, could we lock ${meetingGoal || "a 20-minute discovery call"} ${
      timeline || "this week"
    }?`,
    "",
    "Thanks!",
    "[Your Name]",
  ].join("\n");
};

const generateLinkedInMessage = (leadName, pitch, meetingGoal) => {
  return [
    `Hi ${leadName} — enjoyed reviewing your profile and RevOps focus.`,
    `One quick idea from MathCo:`,
    pitch.split("\n").slice(0, 4).join("\n"),
    `Would you be open to ${meetingGoal || "a short call"} to explore this?`,
  ].join("\n");
};

const validateInput = (linkedInUrl, profileText) => {
  if (!profileText) {
    return "Paste a LinkedIn profile to generate outputs.";
  }

  if (linkedInUrl && !/^https?:\/\/(www\.)?linkedin\.com\/in\//i.test(linkedInUrl)) {
    return "Please provide a valid LinkedIn profile URL (linkedin.com/in/...).";
  }

  if (profileText.length < 60) {
    return "Please paste a richer profile snippet (headline + experience + skills).";
  }

  return "";
};

const renderOutput = (summary, pitch, email, linkedin) => {
  summaryEl.textContent = summary;
  pitchEl.textContent = pitch;
  emailEl.textContent = email;
  linkedinEl.textContent = linkedin;
};

const loadOfferings = async () => {
  const response = await fetch(offeringsUrl);
  if (!response.ok) {
    throw new Error("Could not load offerings data.");
  }
  return response.json();
};

const handleGenerate = async () => {
  const leadName = leadNameInput.value.trim() || "there";
  const linkedInUrl = linkedInInput.value.trim();
  const profileText = profileTextInput.value.trim();
  const workNotes = workNotesInput.value.trim();
  const meetingGoal = meetingGoalInput.value.trim();
  const timeline = timelineInput.value.trim();

  const validationError = validateInput(linkedInUrl, profileText);
  if (validationError) {
    setStatus(validationError, "error");
    renderOutput(
      "Paste a LinkedIn profile to generate the summary.",
      "Add profile details to generate a pitch.",
      "Add profile details to generate an email.",
      "Add profile details to generate a LinkedIn message."
    );
    return;
  }

  try {
    setStatus("Generating outreach drafts...", "");
    const offerings = await loadOfferings();
    const keywords = extractKeywords(profileText);
    const summaryBase = summarizeProfile(profileText);
    const summary = linkedInUrl
      ? `${summaryBase}\nLinkedIn: ${linkedInUrl}`
      : summaryBase;
    const pitch = buildPitch(keywords, offerings, workNotes, meetingGoal, timeline);
    const email = generateEmail(leadName, summary, pitch, meetingGoal, timeline);
    const linkedin = generateLinkedInMessage(leadName, pitch, meetingGoal);

    renderOutput(summary, pitch, email, linkedin);
    setStatus("Done. Review and copy your outreach drafts.", "success");
  } catch (error) {
    setStatus(error.message || "Something went wrong while generating outputs.", "error");
  }
};

generateButton.addEventListener("click", () => {
  handleGenerate();
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = button.dataset.copyTarget;
    const targetNode = document.querySelector(`#${target}`);
    const content = targetNode?.textContent?.trim();

    if (!content) {
      setStatus(`Nothing to copy from ${target} yet.`, "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setStatus(`${target} copied to clipboard.`, "success");
    } catch (_error) {
      setStatus("Clipboard write failed. Please copy manually.", "error");
    }
  });
});
