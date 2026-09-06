# Sort Smart

Build a polished, modern web application called "SortSmart" — an AI-powered waste segregation assistant designed primarily for students, households, and campus communities.

CORE IDEA

SortSmart helps users figure out how to dispose of everyday waste correctly. A user can type the name/description of an item or upload an image. The system identifies the likely waste category and provides:

1. Waste category

2. Recommended disposal method/bin

3. Whether special handling is required

4. A short explanation of why the recommendation matters

5. A confidence/uncertainty indication when appropriate

6. A reminder that disposal rules can vary by location

The project aligns primarily with:

- SDG 12: Responsible Consumption and Production

- Secondary: SDG 11: Sustainable Cities and Communities

IMPORTANT

This is an educational/prototype project. Do NOT pretend that the application has access to real-time municipal waste databases unless an actual API/database is implemented. For the prototype, use a well-structured local knowledge base and clearly label location-specific information as general guidance.

DESIGN DIRECTION

Create a premium, modern sustainability-focused interface.

Visual style:

- Clean and minimal

- Friendly but professional

- Nature/sustainability inspired

- Soft off-white/light background

- Green as the primary accent

- Subtle secondary colors for different waste categories

- Rounded cards

- Soft shadows

- Modern typography

- Plenty of whitespace

- Smooth micro-interactions

- Responsive on desktop, tablet, and mobile

Do NOT make it look like a generic ChatGPT clone.

The product should feel like a real sustainability/AI startup prototype.

APP STRUCTURE

Create these main sections/pages:

1. LANDING / HOME

2. SORT WASTE

3. RESULT

4. HOW IT WORKS

5. IMPACT / DASHBOARD

6. ABOUT / RESPONSIBLE AI

-----------------------------------

1. HOME PAGE

-----------------------------------

Hero section:

Logo/name:

"SortSmart"

Headline:

"Know where it goes."

Subheadline:

"An AI-powered waste assistant that helps you identify, sort, and dispose of everyday waste responsibly."

Primary CTA:

"Sort an Item"

Secondary CTA:

"How It Works"

Include a visual representation of waste sorting / sustainability, preferably using clean illustrated cards or icons rather than stock-photo-heavy design.

Add a small trust message:

"Designed to make responsible waste segregation simpler."

Below the hero, show four feature cards:

- Identify

  "Understand what type of waste you're dealing with."

- Sort

  "Get a clear recommendation for the appropriate disposal category."

- Learn

  "Understand why correct disposal matters."

- Act Responsibly

  "Get safer guidance for e-waste and hazardous items."

Add a section:

"Why SortSmart?"

Explain the problem:

"People often want to dispose of waste correctly but aren't sure where different items belong. Incorrect segregation can contaminate recyclable or compostable waste and create safety risks for hazardous materials and e-waste."

Use a simple visual flow:

Uncertainty → Incorrect Sorting → Contaminated Waste → Reduced Recycling

Then:

SortSmart helps turn:

Question → Classification → Guidance → Action

-----------------------------------

2. SORT WASTE PAGE

-----------------------------------

This is the main interactive experience.

Header:

"What are you throwing away?"

Subtext:

"Tell SortSmart what you have and we'll help you figure out what to do with it."

Provide two input methods:

A. TEXT INPUT

Large input field:

"e.g. used battery, banana peel, plastic bottle..."

Button:

"Analyze Item"

B. IMAGE INPUT

A large drag-and-drop/upload area:

"Upload a photo"

Subtext:

"JPG, PNG or WEBP"

Button:

"Choose Image"

Allow the user to preview the uploaded image before analysis.

Also provide example quick-select items:

- Banana Peel

- Plastic Bottle

- Used Battery

- Old Charger

- Food Container

- Plastic Wrapper

- Cardboard Box

- Broken Electronics

Clicking one should automatically populate/analyze the item.

Include a small note:

"SortSmart provides general guidance. Disposal rules may differ by municipality."

-----------------------------------

3. AI RESULT

-----------------------------------

After analysis, display a beautiful result card.

Example:

"Used Battery"

Category:

"HAZARDOUS / SPECIAL WASTE"

Recommended Action:

"Take it to an authorized battery collection or e-waste facility."

Special Handling:

"Do not place used batteries in regular household waste."

Why it matters:

"Batteries can contain materials that require specialized handling and recycling."

Also show:

Confidence:

"High confidence"

Use a visual confidence indicator, but do not pretend it is a scientifically calibrated probability.

For uncertain cases, show:

"Not completely sure"

"Please provide more information about the item or check your local disposal guidelines."

IMPORTANT:

Never confidently provide a dangerous or incorrect disposal instruction when the classification is uncertain.

Add buttons:

- "Sort Another Item"

- "Learn More"

- "Find Local Guidance"

The "Find Local Guidance" button can open a modal asking for:

- Country

- City/municipality

For the prototype, explain that local rules would be connected to a municipal knowledge source in a production version.

-----------------------------------

4. WASTE CATEGORIES

-----------------------------------

Use four primary categories:

1. BIODEGRADABLE

Examples:

- Fruit/vegetable peels

- Food scraps

- Garden waste

General recommendation:

Organic/compost collection where available.

2. RECYCLABLE

Examples:

- Clean paper

- Cardboard

- Some plastic bottles

- Metal cans

General recommendation:

Recycling collection, subject to local rules.

3. HAZARDOUS / SPECIAL WASTE

Examples:

- Batteries

- Certain chemicals

- Paint-related waste

General recommendation:

Authorized hazardous/special waste collection.

4. E-WASTE

Examples:

- Chargers

- Cables

- Phones

- Small electronic devices

General recommendation:

Authorized e-waste collection/recycling.

IMPORTANT:

Some objects may not fit perfectly into one category. The system should be able to return:

"Needs more information"

when material, condition, contamination, or local rules affect the recommendation.

-----------------------------------

5. LOCAL KNOWLEDGE BASE

-----------------------------------

Implement a simple local data structure containing example disposal guidance.

Create a structured dataset for at least 15–20 common items.

Example fields:

{

  name,

  aliases,

  category,

  recommendedAction,

  specialHandling,

  explanation,

  confidence,

  keywords

}

Include examples such as:

- banana peel

- apple core

- vegetable scraps

- cardboard box

- newspaper

- plastic bottle

- aluminum can

- glass bottle

- plastic wrapper

- food container

- used battery

- phone charger

- USB cable

- old mobile phone

- broken headphones

- electronic toy

- paint container

Use keyword matching/fuzzy matching for the prototype if no real AI API is connected.

ARCHITECTURE:

User input

→ normalize input

→ identify likely item

→ classify category

→ retrieve guidance

→ generate structured response

Keep the classification logic modular so that a real AI/vision API can be connected later.

-----------------------------------

6. AI INTEGRATION DESIGN

-----------------------------------

Structure the application so the analysis service can eventually be replaced with an actual AI API.

Create a service/function such as:

analyzeWasteItem(input)

It should return:

{

  itemName,

  category,

  recommendedAction,

  specialHandling,

  explanation,

  confidence,

  requiresVerification

}

For the current prototype, use mock/local logic if no API key is available.

DO NOT expose API keys in frontend code.

If an AI API is integrated, use a secure server-side function/backend endpoint.

For image analysis, design the UI and service interface so a computer vision model can be connected later.

-----------------------------------

7. EXAMPLE INTERACTIONS

-----------------------------------

Make these work in the prototype:

Input:

"banana peel"

Output:

Category: Biodegradable

Action: Organic/compost collection where available

Special handling: None

Explanation: Food and plant scraps can generally be composted or processed as organic waste.

Input:

"plastic bottle"

Output:

Category: Recyclable

Action: Recycling collection, subject to local rules

Special handling: Empty/rinse where appropriate

Explanation: Many plastic beverage bottles are recyclable, although acceptance varies by local program.

Input:

"used battery"

Output:

Category: Hazardous / Special Waste

Action: Battery collection point or authorized facility

Special handling: Do not place in regular household waste.

Explanation: Batteries require specialized handling and recycling.

Input:

"old phone charger"

Output:

Category: E-waste

Action: Authorized e-waste collection/recycling

Special handling: Do not place in general waste where e-waste collection is available.

Explanation: Chargers contain electronic components and should be processed through appropriate e-waste channels.

Input:

"plastic wrapper"

Output:

Category:

"Recyclability depends on material and local rules"

Do NOT automatically claim that every plastic wrapper is recyclable.

-----------------------------------

8. IMPACT DASHBOARD

-----------------------------------

Create a simple prototype dashboard showing the potential impact of SortSmart.

Do not claim these are real measured results.

Clearly label them:

"Prototype / illustrative metrics"

Show cards such as:

Items Sorted

"128"

Correct Guidance Provided

"91%"

E-waste Identified

"24"

Potentially Diverted from General Waste

"73"

These should be mock/demo data and clearly labeled as such.

Add a simple chart showing example categories analyzed:

- Biodegradable

- Recyclable

- E-waste

- Hazardous

Include a section:

"Potential Impact"

Explain:

"By making waste segregation easier to understand, SortSmart aims to reduce incorrect sorting, improve recycling awareness, and encourage safer disposal of e-waste and hazardous materials."

-----------------------------------

9. HOW IT WORKS

-----------------------------------

Create a visual four-step process:

01 — Tell Us

"Enter an item name, description, or photo."

02 — Identify

"SortSmart determines the likely material and waste category."

03 — Check Guidance

"The system retrieves relevant disposal guidance from its knowledge base."

04 — Take Action

"You receive a clear disposal recommendation and explanation."

Add a technical architecture diagram:

User Input

↓

AI / Classification Layer

↓

Waste Knowledge Base

↓

Disposal Recommendation

↓

Explanation + Safety Guidance

-----------------------------------

10. RESPONSIBLE AI PAGE

-----------------------------------

Create a section explaining the responsible AI principles behind SortSmart.

Principles:

PRIVACY

"Only information needed to identify the waste should be used. Avoid collecting unnecessary personal information."

TRANSPARENCY

"Explain why a particular disposal recommendation was made."

UNCERTAINTY

"If the system cannot confidently identify an item, it should say so instead of guessing."

SAFETY

"Provide additional caution for hazardous waste and e-waste."

LOCAL CONTEXT

"Disposal systems differ between locations. Users should verify local municipal guidance."

Add a highlighted statement:

"SortSmart is an assistance tool, not a substitute for official local waste-management instructions."

-----------------------------------

11. ABOUT / PROJECT PAGE

-----------------------------------

Show:

SortSmart

"AI for smarter waste segregation."

Problem:

"People often struggle to determine how everyday waste should be disposed of."

Solution:

"An AI-assisted system that identifies waste categories and provides understandable disposal guidance."

SDG Alignment:

SDG 12

Responsible Consumption and Production

SDG 11

Sustainable Cities and Communities

Target Users:

- Students

- Households

- Campus communities

- Sustainability-conscious users

-----------------------------------

12. UI/UX REQUIREMENTS

-----------------------------------

Make the experience extremely simple.

A first-time user should understand what to do within 5 seconds.

Use:

- clear headings

- large input area

- obvious CTA

- category icons

- readable result cards

- accessible contrast

- responsive layout

- keyboard navigation

- meaningful hover/focus states

- loading animation during analysis

- empty states

- error states

Add subtle animations but don't overdo them.

When analyzing:

Show:

"Analyzing your item..."

Then:

"Identifying waste type..."

"Checking disposal guidance..."

Then reveal the result.

-----------------------------------

13. TECHNICAL REQUIREMENTS

-----------------------------------

Use:

- React

- TypeScript

- Tailwind CSS

- modern component architecture

- reusable components

- clean folder structure

Prefer a simple architecture that is easy for a student to understand and explain.

Suggested components:

Navbar

Hero

WasteInput

ImageUploader

ExampleItems

AnalysisLoader

WasteResult

CategoryBadge

SafetyNotice

ImpactDashboard

HowItWorks

ResponsibleAI

Footer

Create a central waste-analysis service so the UI isn't tightly coupled to the classification logic.

-----------------------------------

14. IMPORTANT HONESTY REQUIREMENT

-----------------------------------

This is a prototype.

Do NOT fabricate:

- real AI accuracy

- real municipal partnerships

- real recycling rates

- real environmental impact

- real collection-center availability

- real user statistics

If demo data is shown, label it:

"Demo data"

or

"Illustrative prototype metric"

If no AI API is connected, make that architecture clear in the code and use local/mock classification.

-----------------------------------

15. FINAL EXPERIENCE

-----------------------------------

The finished application should feel like a real student-built AI sustainability product that could be presented in a 1M1B project showcase.

The user journey should be:

Landing Page

→ Sort an Item

→ Enter/upload waste

→ Analyze

→ Get category

→ Get disposal recommendation

→ Understand why

→ Learn about responsible disposal

Make the application polished enough for a project demonstration.

Prioritize:

1. Functionality

2. Clarity

3. Responsible AI

4. Sustainability storytelling

5. Visual polish

6. Easy explanation during an interview

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
