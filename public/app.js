const offeringsUrl = "../data/mathco_offerings.json";

const leadNameInput = document.querySelector("#leadName");
const linkedInInput = document.querySelector("#leadLinkedIn");
const profileTextInput = document.querySelector("#profileText");
const workNotesInput = document.querySelector("#workNotes");
const meetingGoalInput = document.querySelector("#meetingGoal");
const timelineInput = document.querySelector("#timeline");

const summaryEl = document.querySelector("#summary");
const pitchEl = document.querySelector("#pitch");
const emailEl = document.querySelector("#email");
const linkedinEl = document.querySelector("#linkedin");

const sampleProfile = `Senior Director of Revenue Operations at ExampleCorp
Experience:
- Leads global RevOps, GTM analytics, and pipeline optimization
- Prior: Director of Sales Analytics at ScaleUp Inc.
Skills: Revenue Operations, GTM Strategy, CRM, Forecasting, Data Warehousing, AI enablement
Education: MBA, University of Chicago
Interests: Building high-performing sales teams, AI for productivity`;

const agentScrapeButton = document.querySelector("#agentScrape");
const generateButton = document.querySelector("#generate");

agentScrapeButton.addEventListener("click", () => {
  if (profileTextInput.value.trim().length === 0) {
    profileTextInput.value = sampleProfile;
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
  const relevantOfferings = offerings.filter((offering) =>
    offering.triggers.some((trigger) => keywords.includes(trigger))
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

const renderOutput = (summary, pitch, email, linkedin) => {
  summaryEl.textContent = summary;
  pitchEl.textContent = pitch;
  emailEl.textContent = email;
  linkedinEl.textContent = linkedin;
};

const loadOfferings = async () => {
  const response = await fetch(offeringsUrl);
  return response.json();
};

const handleGenerate = async () => {
  const leadName = leadNameInput.value.trim() || "there";
  const profileText = profileTextInput.value.trim();
  const workNotes = workNotesInput.value.trim();
  const meetingGoal = meetingGoalInput.value.trim();
  const timeline = timelineInput.value.trim();

  if (profileText.length === 0) {
    renderOutput(
      "Paste a LinkedIn profile to generate the summary.",
      "Add profile details to generate a pitch.",
      "Add profile details to generate an email.",
      "Add profile details to generate a LinkedIn message."
    );
    return;
  }

  const offerings = await loadOfferings();
  const keywords = extractKeywords(profileText);
  const summary = summarizeProfile(profileText);
  const pitch = buildPitch(keywords, offerings, workNotes, meetingGoal, timeline);
  const email = generateEmail(leadName, summary, pitch, meetingGoal, timeline);
  const linkedin = generateLinkedInMessage(leadName, pitch, meetingGoal);

  renderOutput(summary, pitch, email, linkedin);
};

generateButton.addEventListener("click", () => {
  handleGenerate();
});
