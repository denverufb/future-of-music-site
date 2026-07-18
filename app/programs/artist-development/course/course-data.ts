export type CourseLesson = {
  id: string;
  title: string;
  minutes: number;
  narration: string;
  remember: string[];
  tryIt?: string;
};

export type ActivityField = {
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: "short" | "long" | "rating" | "check";
  required?: boolean;
};

export type CourseActivity = {
  title: string;
  intro: string;
  fields: ActivityField[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type CourseQuiz = {
  title: string;
  intro: string;
  questions: QuizQuestion[];
};

export type CourseModule = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  minutes: number;
  product: string;
  goal: string;
  lessons: CourseLesson[];
  activity: CourseActivity;
  quiz?: CourseQuiz;
  accent: string;
};

const q = (
  question: string,
  options: string[],
  answer: number,
  explanation: string,
): QuizQuestion => ({ question, options, answer, explanation });

const unsortedCourseModules: CourseModule[] = [
  {
    id: "orientation",
    number: "00",
    title: "Start Here: Orientation + Baseline",
    shortTitle: "Start here",
    minutes: 10,
    product: "Starting assessment",
    goal: "Understand the journey, protect your privacy, and record where you are starting.",
    accent: "#ff4fa3",
    lessons: [
      {
        id: "0-1",
        title: "Welcome to the Academy",
        minutes: 3,
        narration: `Welcome to the Future of Music Artist Development Academy. This course is for young artists who want to understand not only how to make music, but how to develop a clear identity, communicate professionally, and make informed career decisions.

You do not need a finished song, a large following, a manager, a stage name, or professional equipment to begin. You only need curiosity, honesty, and a willingness to try. You can complete this course from a phone, tablet, or computer. Your progress saves on this device, so you may stop and return whenever you need.

During the academy, you will build an Artist Development Portfolio. It will include your identity statement, sound map, original song idea, brand board, artist bio, mock interview, industry pathway, and release plan. Each activity adds one piece. At the end, you will bring those pieces together and create a practical plan for what comes next.

This is not a contest. You are not being graded on whether your style matches someone else’s idea of what an artist should look or sound like. You are being asked to make thoughtful, original choices and explain them clearly.

Keep your work safe and private. You will never be required to post an assignment publicly. Do not include private information such as your home address, school schedule, passwords, account numbers, or personal contact details in your portfolio. If you are under 18 and receive a business or contract opportunity, involve a parent, guardian, or trusted adult before responding.

There is no promise of fame or instant success at the end of this course. What you will gain is a stronger foundation, a clearer direction, and tools that can help you continue growing. Let’s begin building the artist behind the music.`,
        remember: [
          "No professional experience or equipment is required.",
          "Your course work becomes an Artist Development Portfolio.",
          "Work at your own pace and keep assignments private.",
          "Originality, growth, and clear decisions matter more than perfection.",
          "Ask a trusted adult and qualified professional for help with real contracts.",
        ],
        tryIt: "Think of one reason you chose to begin this course today.",
      },
      {
        id: "0-2",
        title: "How the Course Works",
        minutes: 2,
        narration: `Each module contains short narrated lessons, one guided activity, and a quiz. Listen to or read each lesson, complete the activity while the ideas are fresh, and then take the quiz. If you miss a question, read the explanation and try again. Retakes are allowed.

Every required activity can be completed by typing. The course takes about four and a half hours. You can finish it in several sessions or move through it more quickly. What matters is that your responses are thoughtful and complete.

Your work automatically saves in this browser. It is not uploaded to a public profile, and you do not need an account. Because the beta stores work on this device, clearing browser data or switching devices will not carry your answers with you. Download your workbook regularly as a backup.`,
        remember: [
          "Listen or read, practice, build, and check your understanding.",
          "Quiz retakes are unlimited.",
          "All required work can be typed.",
          "Download your workbook as a personal backup.",
        ],
        tryIt: "Choose a pace: one module today, two lessons at a time, or your own schedule.",
      },
    ],
    activity: {
      title: "Orientation Check + Starting Assessment",
      intro: "Confirm the five safety statements, then rate your starting confidence from 1 (not true yet) to 5 (very true). These ratings are not graded.",
      fields: [
        { id: "safe-private", label: "I understand that my work does not have to be posted publicly.", type: "check", required: true },
        { id: "safe-retakes", label: "I understand that quizzes may be retaken.", type: "check", required: true },
        { id: "safe-certificate", label: "I understand that the certificate requires a completed portfolio and assessments.", type: "check", required: true },
        { id: "safe-original", label: "I will submit original work and credit collaborators.", type: "check", required: true },
        { id: "safe-adult", label: "I will involve a trusted adult before responding to a real contract or sensitive business request.", type: "check", required: true },
        { id: "baseline-identity", label: "I can clearly explain who I am as an artist.", type: "rating", required: true },
        { id: "baseline-sound", label: "I can describe the elements that make my sound unique.", type: "rating", required: true },
        { id: "baseline-song", label: "I have a process for turning an idea into a song.", type: "rating", required: true },
        { id: "baseline-brand", label: "I understand how an artist brand is different from a logo.", type: "rating", required: true },
        { id: "baseline-interview", label: "I feel prepared to introduce myself in an interview.", type: "rating", required: true },
        { id: "baseline-pathways", label: "I understand the difference between independent artists and record labels.", type: "rating", required: true },
        { id: "baseline-rights", label: "I understand the difference between a song and its recorded master.", type: "rating", required: true },
        { id: "baseline-contract", label: "I know what questions to ask before signing an agreement.", type: "rating", required: true },
        { id: "baseline-release", label: "I can build a simple plan to release and promote music.", type: "rating", required: true },
        { id: "baseline-confidence", label: "I feel confident taking my next step as an artist.", type: "rating", required: true },
      ],
    },
  },
  {
    id: "creative-practice",
    number: "03",
    title: "Songwriting, Studio + Performance Practice",
    shortTitle: "Creative practice",
    minutes: 45,
    product: "Original Song Seed + Readiness Checklist",
    goal: "Use a repeatable process to develop and revise an original idea, then prepare it for a session or performance.",
    accent: "#ffd43b",
    lessons: [
      {
        id: "3-1",
        title: "Start With a Clear Song Concept",
        minutes: 5,
        narration: `A song idea becomes easier to develop when you can explain its center in one sentence. That sentence is the song concept. It identifies the subject, point of view, and main emotion or question.

“A song about growing up” is broad. A stronger concept is: “A young person realizes that becoming independent also means leaving familiar things behind.” Now the writer has a tension to explore: excitement and loss at the same time.

Begin with a truth, question, image, moment, or original phrase. Then choose the point of view: is the speaker saying I, speaking to you, telling a story about they, or describing a group as we? Finally, name the movement. What changes by the end? The speaker might decide, admit a truth, ask for another chance, set a boundary, celebrate progress, or see an event differently.

Use this formula: “This is a song in which [speaker] experiences [situation] and moves from [starting emotion or belief] to [ending emotion or belief].” You can combine events or write fiction while communicating an honest emotion.`,
        remember: ["A subject is broad; a concept gives it point of view and movement.", "Start with a truth, question, image, moment, or phrase.", "Decide who is speaking and what changes.", "Emotional honesty does not require private details."],
        tryIt: "Write one concept sentence using the speaker, situation, and movement formula.",
      },
      {
        id: "3-2",
        title: "Structure, Hooks, Verses + Movement",
        minutes: 7,
        narration: `Song structure is the order in which a listener receives information and emotion. It is a tool, not a law. Common sections include intro, verse, pre-chorus, chorus, post-chorus, bridge, breakdown, and outro.

Verses develop details, events, images, or point of view. Verse two should move time forward, reveal information, raise the stakes, or show another side. A pre-chorus creates movement into the chorus. The chorus usually carries the central feeling or statement and often contains the main hook. A hook can be lyrical, melodic, rhythmic, or instrumental. Clarity, contrast, pattern, and intentional repetition make it memorable.

A bridge usually adds contrast late in the song. It may reveal a new thought, change harmony or rhythm, or let the speaker see the situation differently. Draw an energy line for the whole song. If every section has the same density and intensity, movement may disappear. Contrast can come from adding or removing instruments, changing layers, shortening lines, creating silence, or changing delivery.

Before writing full lyrics, give each section one job: Verse 1 introduces the moment. Pre-chorus shows the doubt. Chorus states the decision. Verse 2 shows the consequence. Bridge reveals what the speaker learned. The best structure is the one that helps a listener understand and feel the idea.`,
        remember: ["Structure controls the order of information and energy.", "Verses develop; choruses center; bridges contrast.", "A hook may be lyrical, melodic, rhythmic, or instrumental.", "Give each section a job before perfecting every line."],
        tryIt: "Choose a structure and write the job of each section in five words or fewer.",
      },
      {
        id: "3-3",
        title: "A Repeatable Writing Practice",
        minutes: 5,
        narration: `Waiting to feel inspired can make writing unpredictable. A short process helps you begin even when the first idea is not perfect.

First, set a timer for three minutes and freewrite about the concept. Do not rhyme yet. Include actions, objects, places, sounds, colors, questions, and exact moments. Second, circle strong details and build a bank of 10 to 15 connected words. Add opposites, near-rhymes, internal rhymes, and words with interesting sounds without forcing meaning.

Third, write at least three hook options: one direct, one image-based, and one built around a question or contrast. Say them aloud. Fourth, write four to eight lines leading toward or away from the strongest hook. Specific images and actions often communicate more than naming an emotion.

Fifth, test the section privately. Speak, rap, sing, hum, tap, or play it. Mark crowded rhythm, difficult breath, and unnatural words. Instrumental artists can use the same process with a concept sentence, sound bank, three motifs, a section map, and rough arrangement.`,
        remember: ["Freewrite before perfecting.", "Build a word or sound bank.", "Create several hook or motif options.", "Test the work through sound.", "Instrumental artists can use motifs, textures, and arrangement."],
        tryIt: "Set a three-minute timer and freewrite without editing.",
      },
      {
        id: "3-4",
        title: "Revise + Collaborate Professionally",
        minutes: 5,
        narration: `The first draft proves an idea exists. Revision helps the idea communicate. Use five lenses: clarity, specificity, sound, movement, and originality.

Revise in separate passes. First strengthen meaning. Next improve sound and rhythm. Then remove lines that repeat without adding value. Perform again. Trying to fix meaning, rhyme, melody, timing, and performance all at once makes progress difficult to hear.

Ask for specific feedback: What is the song about? Which moment do you remember? Where did your attention drop? What emotion did you feel? You decide which feedback supports the concept.

Collaboration requires records. Agree on the goal and how files will be shared. Document who contributed lyrics, melody, composition, production, or recording. Discuss ownership while the work is fresh. A split sheet can record the agreement, but important rights questions need qualified review. Never release someone’s work without permission and credit.`,
        remember: ["Revise for clarity, specificity, sound, movement, and originality.", "Make separate revision passes.", "Ask feedback questions that produce evidence.", "Credit collaborators and document contributions."],
        tryIt: "Choose one revision lens and name one change your idea needs.",
      },
      {
        id: "3-5",
        title: "Studio + Performance Readiness",
        minutes: 5,
        narration: `Preparation lets a session or performance focus on expression instead of preventable confusion. You do not need expensive equipment to practice professional habits.

Before recording, know the goal: rough demo, final vocals, instrumental, background parts, or ideas for later. Bring current lyrics or arrangement, correct files, tempo and key when known, contributor names, and labeled reference notes. Back up important files. Confirm date, location, timing, cost, adult supervision when required, and responsibilities.

Before performing, confirm the audience, set length, approved content, clean versions when required, arrival and sound-check times, equipment, tracks, entrances, exits, and playback responsibility. Plan a set list and backup every required track. Rehearse your opening, transitions, recovery from a small mistake, audience communication, and ending.

For both studio and stage work, professionalism means arriving prepared, respecting time, protecting hearing and equipment, crediting the team, and accepting direction without losing your voice. Young artists should have guardian or program-approved adult awareness for sessions, travel, payment, and unfamiliar locations.`,
        remember: ["Define the goal before a session or performance.", "Organize files, credits, schedule, equipment, and backups.", "Rehearse transitions and difficult moments.", "Confirm audience, content rules, sound check, and responsible adults.", "Preparation creates room for confident creative choices."],
        tryIt: "Choose studio or stage and list the first three things you would confirm.",
      },
    ],
    activity: {
      title: "Portfolio 3: Original Song Seed + Readiness",
      intro: "Choose a songwriter/performer path or producer/instrumental path. Complete each prompt in writing; recording is not required.",
      fields: [
        { id: "creative-path", label: "My path: songwriter/performer or producer/instrumental artist", type: "short", required: true },
        { id: "song-concept", label: "One-sentence song or track concept", type: "long", required: true },
        { id: "point-emotion", label: "Point of view and emotional movement", type: "long", required: true },
        { id: "creative-bank", label: "Creative bank", hint: "List 10 words, images, sounds, textures, rhythms, or instruments.", type: "long", required: true },
        { id: "three-options", label: "Three original hook or motif options", type: "long", required: true },
        { id: "developed-section", label: "Develop one option", hint: "Write 4–8 original lines or describe a section and its energy.", type: "long", required: true },
        { id: "section-map", label: "Simple section map", type: "long", required: true },
        { id: "revision", label: "One revision using clarity, specificity, sound, movement, or originality", type: "long", required: true },
        { id: "readiness-path", label: "Readiness pathway: studio or performance", type: "short", required: true },
        { id: "readiness", label: "My readiness checklist", hint: "Goal, files, difficult moments, credits, backups, timing, equipment, cost, travel, and responsible-adult details as relevant.", type: "long", required: true },
        { id: "originality", label: "I confirm this is original work and I named any collaborators.", type: "check", required: true },
      ],
    },
    quiz: {
      title: "Module 3 Quiz",
      intro: "Choose the best answer. You need 5 of 6 to pass.",
      questions: [
        q("Which is the strongest song concept?", ["A song about life", "A young person is excited about independence but realizes change means leaving familiar things behind", "A song exactly like a current hit", "Something emotional"], 1, "It identifies a speaker, situation, tension, and emotional movement."),
        q("What is the main purpose of a section map?", ["Guarantee every song uses the same structure", "Give each section a job and create movement", "Replace listening", "Make a song as long as possible"], 1, "A section map helps each part develop information or energy."),
        q("Which writing sequence is most useful?", ["Perfect every rhyme before choosing the idea", "Freewrite, build a bank, create hook options, draft, and test aloud", "Copy a reference and change the title", "Post the first line immediately"], 1, "This sequence creates material before judging and includes a sound test."),
        q("Which feedback question is most specific?", ["Is it good?", "Do you like me?", "What is the song about, and where did your attention drop?", "Will this make me famous?"], 2, "It asks for evidence that can guide revision."),
        q("After a collaboration, artists should:", ["Assume everyone remembers the same agreement", "Hide who contributed", "Document contributions, credits, and agreed ownership before release", "Release without permission"], 2, "Clear records help protect relationships, credits, and future decisions."),
        q("Which action best prepares an artist for a session or performance?", ["Arrive without knowing the goal", "Organize files, credits, timing, equipment, backups, and responsible-adult details", "Assume someone else has every track", "Share a private location publicly"], 1, "Preparation reduces preventable problems and leaves more time for creative work."),
      ],
    },
  },
  {
    id: "brand",
    number: "04",
    title: "Artist Brand + Image",
    shortTitle: "Build your brand",
    minutes: 30,
    product: "Artist Brand Board",
    goal: "Translate your identity and sound into a clear visual system, story, and communication style.",
    accent: "#7d67ff",
    lessons: [
      {
        id: "4-1",
        title: "Brand Is the Experience",
        minutes: 5,
        narration: `An artist brand is the consistent experience people connect with the artist. A logo can be one element, but brand also includes sound, story, visuals, language, behavior, values, and the way an audience feels after an interaction.

Your brand begins whenever someone hears a song, sees a photo, reads a caption, attends a performance, or works with you. Development makes those signals more intentional. Start with your identity statement and Sound Map. If your music is reflective, warm, and story-focused, chaotic visuals may confuse people unless the contrast is purposeful.

Consistency does not mean every photo or song must be identical. Think of a family resemblance. Different releases can have different concepts while sharing a recognizable point of view.

Complete this promise: “People can expect my work and communication to feel ____, ____, and ____.” The promise includes behavior. A respectful public message becomes inconsistent if deadlines are repeatedly missed or collaborators are mistreated. Do not build a brand around pretending to have a lifestyle that is not yours. A strong brand makes the truth clearer.`,
        remember: ["Brand is the full experience connected with the artist.", "Sound, story, visuals, words, behavior, and values should support one another.", "Consistency means recognizable direction, not identical content.", "A strong brand clarifies an authentic point of view."],
        tryIt: "Choose three words for how people should experience your work and communication.",
      },
      {
        id: "4-2",
        title: "Create a Simple Visual System",
        minutes: 5,
        narration: `A visual system helps you make decisions without redesigning your identity every time. Begin with mood, not decoration.

Choose three to five brand adjectives. Select two main colors and one accent color that support the mood. Make sure text remains readable. Choose one heading style and one simple reading style. Too many type styles become difficult to read on a phone.

Describe photo direction through lighting, background, angle, movement, objects, setting, color, and expression. The purpose is not to criticize or change someone’s body. It is to plan how an image communicates the music. Build mood boards only with materials you own, have permission to use, or that are properly licensed.

A logo is optional. Developing artists often need clear type, strong photos, and consistent colors more than a complicated symbol. Test artwork at phone size. Create a “yes and no” list: what should appear consistently, and what should be avoided for readability, originality, or privacy?`,
        remember: ["Start with adjectives and mood.", "Use a small, repeatable color and type system.", "Direct photos through lighting, setting, movement, and composition.", "Use materials you own or have permission to use.", "Test every design at phone size."],
        tryIt: "Choose two main colors, one accent, and one word for your photo lighting.",
      },
      {
        id: "4-3",
        title: "Brand Voice + Content Pillars",
        minutes: 5,
        narration: `Brand voice is the personality of your words. It affects captions, interviews, emails, website copy, and how you speak to supporters.

Choose three voice qualities: direct, playful, thoughtful, energetic, encouraging, poetic, curious, calm, or educational. Then name what the voice is not. “Playful but not disrespectful” creates a clearer boundary than “playful” alone.

Content pillars are three or four subjects you can return to. Music and craft might include writing, rehearsal, production, practice, or performance. Story and personality can show safe interests or inspiration. Message and community can show values, causes, people, or places. Invitation includes releases, events, questions, or ways to participate.

Content should help people discover, understand, trust, or act. You do not need every trend or every private moment. Protect live location, home address, school schedule, account information, documents, and private contact details. A simple system you can maintain is stronger than an expensive system you cannot repeat.`,
        remember: ["Brand voice guides how you communicate.", "Content pillars create repeatable subjects.", "Content should help people discover, understand, trust, or act.", "Privacy is part of professional brand management."],
        tryIt: "Name three content pillars and one purpose each serves.",
      },
    ],
    activity: {
      title: "Portfolio 4: Artist Brand Board",
      intro: "A written brand board is completely valid. Graphic-design experience is not required.",
      fields: [
        { id: "brand-promise", label: "Brand promise: people can expect my work to feel…", type: "long", required: true },
        { id: "brand-adjectives", label: "Five brand adjectives", type: "short", required: true },
        { id: "colors", label: "Two main colors + one accent", hint: "Add color names or digital color codes.", type: "short", required: true },
        { id: "type-direction", label: "Heading style + reading style", type: "long", required: true },
        { id: "photo-direction", label: "Photo direction", hint: "Describe lighting, setting, movement, background, and objects.", type: "long", required: true },
        { id: "visual-yes", label: "Visual yes list: three choices", type: "long", required: true },
        { id: "visual-no", label: "Visual no list: three boundaries", type: "long", required: true },
        { id: "brand-voice", label: "My voice is…, but never…", type: "long", required: true },
        { id: "content-pillars", label: "Three or four content pillars + one safe idea for each", type: "long", required: true },
        { id: "ownership-check", label: "I will use only original, licensed, or permitted materials.", type: "check", required: true },
      ],
    },
    quiz: {
      title: "Module 4 Quiz",
      intro: "Choose the best answer. You need 4 of 5 to pass.",
      questions: [
        q("An artist brand is:", ["Only a logo", "The consistent experience created by sound, story, visuals, words, behavior, and values", "An expensive photo shoot", "A character that hides the person"], 1, "Brand is the complete and repeated experience, not one design item."),
        q("Which is the strongest visual system?", ["Random colors and fonts every day", "Two main colors, one accent, readable type, and clear photo direction", "Artwork copied from another artist", "Text unreadable on a phone"], 1, "A small readable system is easier to recognize and maintain."),
        q("Photo direction should focus on:", ["Criticizing physical features", "Lighting, setting, movement, background, objects, and composition", "Revealing a private address", "Copying exact photographs"], 1, "These creative elements communicate mood without judging a person’s body."),
        q("A content pillar is:", ["A repeatable subject that supports the artist’s story and goals", "A requirement to post every private moment", "A recording contract", "The number of views"], 0, "Content pillars help an artist return to meaningful subjects consistently."),
        q("Which information should not be shared in a public assignment?", ["A general creative goal", "A brand adjective", "A home address, password, or live location", "A color choice"], 2, "Private and security-sensitive information should never be public."),
      ],
    },
  },
  {
    id: "media",
    number: "05",
    title: "PR + Media Training",
    shortTitle: "PR + media",
    minutes: 30,
    product: "Artist Bio + Mock Interview",
    goal: "Explain your story clearly, prepare key messages, answer professionally, and protect appropriate boundaries.",
    accent: "#ff6d61",
    lessons: [
      {
        id: "5-1",
        title: "Your Artist Story, Bio + Introduction",
        minutes: 5,
        narration: `Public relations, or PR, is the planned way an artist builds understanding and trust with the public, media, partners, and community. It is not attention at any cost.

Begin with three key messages. First: who you are and what you create. Second: why the work matters or what makes your direction distinct. Third: what you are doing next.

A short bio answers five questions: Who is the artist? What do they create? What themes or experience define the work? What relevant experience can be stated accurately? What is next? Write a formal bio in third person, around 50 to 75 words. Never add awards, partnerships, numbers, or claims that cannot be verified. “A developing St. Louis artist building a sound around…” is professional and honest.

Your 20-second spoken introduction can use first person: “I’m [name], a [type of artist] creating [sound or work] centered on [themes or purpose]. Right now, I’m [current project or next step].” Practice until the message feels natural, not memorized.`,
        remember: ["PR builds accurate understanding and trust.", "Prepare messages for identity, meaning, and next step.", "A short bio is specific, truthful, and verifiable.", "A spoken introduction should feel natural in about 20 seconds."],
        tryIt: "Say your artist name, type of work, central theme, and current next step in one breath.",
      },
      {
        id: "5-2",
        title: "Answer Interviews With ABM",
        minutes: 7,
        narration: `An interview feels easier when you prepare messages instead of memorizing every possible answer. Use ABM: Answer, Bridge, Message.

First, answer the fair question honestly and briefly. Second, bridge to a useful idea. Third, deliver the message you want remembered. If asked why you are experimenting with different sounds, you might answer: “I’m still developing, and experimentation is part of that. Each test shows which choices feel natural. My current direction combines reflective writing with energetic production, and the next project will show that more clearly.”

Listen until the question ends. Pause before answering. Use one main idea at a time. Stop when the answer is complete. If you do not know a fact, say: “I don’t want to guess. I can confirm that after the interview.” For a private question: “I keep that part of my life private, but I can share what the experience taught me creatively.” Correct inaccurate information calmly.

For an online interview, use a steady device, a quiet permitted location, and a background without private information. Test sound. No expensive clothing or specific appearance is required. Young artists should make sure a parent, guardian, or approved adult knows about formal media interviews and business requests.`,
        remember: ["Use Answer, Bridge, Message.", "Listen, pause, make one point, and stop.", "Never invent a fact.", "Use respectful boundaries for private questions.", "Young artists should involve a trusted adult."],
        tryIt: "Answer: What are you currently developing? Then bridge to one key message.",
      },
      {
        id: "5-3",
        title: "Difficult Questions + Digital Reputation",
        minutes: 5,
        narration: `A difficult question may challenge your originality, experience, decision, or readiness. Your job is not to win an argument. Your job is to stay accurate, calm, and connected to your message.

If someone asks whether you are copying another artist, do not attack them. Say that comparison is understandable, explain that you study several influences, and describe how your own writing, voice, experiences, and Sound Map support an original direction.

If asked about a mistake, acknowledge what you can confirm, explain the responsible next step, and return to the standard you intend to follow. Avoid excuses and avoid sharing other people’s private details. For a serious situation, pause public responses and involve a guardian, organizational leader, or qualified professional.

Before posting, ask: Is it true? Necessary? Respectful? Does it reveal private information? Would I be comfortable with a school, partner, family member, or future collaborator seeing it later? You do not have to answer every negative comment. Hide, block, or report harassment. Save evidence and tell a trusted adult about threats, pressure, or requests for private information.`,
        remember: ["Stay calm, accurate, and connected to a message.", "Acknowledge facts and explain responsible next steps.", "Review posts for truth, necessity, respect, and privacy.", "Not every comment deserves a response.", "Use safety tools and involve a trusted adult when needed."],
        tryIt: "Write one respectful sentence that protects a private boundary.",
      },
    ],
    activity: {
      title: "Portfolio 5: Bio + Mock Interview",
      intro: "Prepare the messages you want remembered, then practice three interview answers in writing.",
      fields: [
        { id: "message-identity", label: "Key message 1: who I am + what I create", type: "long", required: true },
        { id: "message-meaning", label: "Key message 2: why the work matters or feels distinct", type: "long", required: true },
        { id: "message-next", label: "Key message 3: what I am doing next", type: "long", required: true },
        { id: "short-bio", label: "Short artist bio (50–75 words, third person)", type: "long", required: true },
        { id: "introduction", label: "20-second introduction draft", type: "long", required: true },
        { id: "mock-1", label: "Mock answer 1: How would you describe your sound?", type: "long", required: true },
        { id: "mock-2", label: "Mock answer 2: What do you want listeners to feel or understand?", type: "long", required: true },
        { id: "mock-3", label: "Mock answer 3: A listener compares you to another artist. How do you respond?", type: "long", required: true },
        { id: "mock-review", label: "Self-review", hint: "Did each answer respond, connect to a key message, stay accurate, protect privacy, and remain respectful?", type: "long", required: true },
      ],
    },
    quiz: {
      title: "Module 5 Quiz",
      intro: "Choose the best answer. You need 4 of 5 to pass.",
      questions: [
        q("The main purpose of PR is to:", ["Get attention by any method", "Build clear, accurate understanding and trust", "Invent achievements", "Share every private detail"], 1, "Strong PR communicates a truthful, understandable story and builds trust."),
        q("ABM means:", ["Answer, Bridge, Message", "Advertise, Brag, Move", "Avoid, Blame, Mislead", "Ask, Borrow, Memorize"], 0, "Answer the fair question, bridge naturally, and deliver a key message."),
        q("If an artist does not know a fact, the best response is to:", ["Guess confidently", "Change the facts", "Say they do not want to guess and will confirm it later", "Blame the interviewer"], 2, "Accuracy is more professional than guessing."),
        q("Which is a respectful privacy boundary?", ["I keep that private, but I can share what it taught me creatively.", "Giving an unknown person a home address", "Sharing someone else’s details", "Moving every suspicious message to a private chat"], 0, "This protects privacy while still offering a useful answer."),
        q("When facing a negative comment, an artist should:", ["Respond immediately to every comment", "Post private information", "Decide whether a response is useful and use block or report tools when needed", "Ask for personal contact information"], 2, "Not every comment deserves engagement, and safety tools are appropriate."),
      ],
    },
  },
  {
    id: "identity",
    number: "01",
    title: "Artist Identity + Direction",
    shortTitle: "Artist identity",
    minutes: 25,
    product: "Artist Identity Card",
    goal: "Define the purpose, values, themes, audience experience, and next goal behind your artistry.",
    accent: "#c9ff46",
    lessons: [
      {
        id: "1-1",
        title: "Artist Development Is the Whole Artist",
        minutes: 4,
        narration: `Talent is important, but talent is only one part of becoming a prepared artist. Artist development strengthens the whole artist: creative skill, identity, performance, communication, brand, business knowledge, and professional habits.

Think of artistry as a set of connected choices. What subjects do you return to? What emotion does your music create? How do you treat collaborators? What does your visual style communicate? What should listeners remember? When those choices support one another, people can understand the artist more clearly.

Development does not mean turning yourself into a character designed by someone else. It means learning enough about yourself to make intentional choices. Your identity can change through action: make something, notice what feels true, receive useful feedback, revise, and try again. This module creates a starting point, not a permanent box.

Separate who you are as a human being from the performance of your artist role. Your worth is not measured by streams, comments, likes, awards, or attention. Numbers can provide information, but they do not decide whether your creativity matters.`,
        remember: [
          "Artist development includes craft, identity, communication, business, and habits.",
          "Identity guides choices without trapping the artist.",
          "Identity becomes clearer through creating, reflecting, and revising.",
          "Attention numbers do not measure personal worth.",
        ],
        tryIt: "Finish this sentence: I want people to remember my music because it makes them…",
      },
      {
        id: "1-2",
        title: "Purpose, Message, and Values",
        minutes: 5,
        narration: `Your purpose is the reason you create. It might be to help people feel understood, bring energy to a room, tell stories from your community, experiment with sound, or express ideas that are difficult to say in ordinary conversation.

Your message is what your work repeatedly communicates. Look for themes across several ideas: ambition, friendship, family, change, confidence, faith, humor, community, imagination, or growing up. Those themes help listeners understand your point of view.

Your values describe how you want to create and work. Examples include originality, honesty, respect, discipline, joy, courage, curiosity, service, and collaboration. Values matter because pressure will come. A clear value can help you decide which opportunity, lyric, image, or partnership fits.

Imagine a fictional artist named Nova Lane. Nova wants young listeners to feel brave during change. The repeated messages are growth, curiosity, and choosing your own path. The values are originality, respect, and courage. Those choices can guide sound, lyrics, photos, interviews, and partnerships without making every song the same.

Authenticity does not mean sharing every private detail. You can tell an emotional truth through fiction, combine experiences, or keep a subject private. The goal is to avoid pretending to be someone you are not just because that image seems popular.`,
        remember: [
          "Purpose answers why you create.",
          "Message describes ideas your work returns to.",
          "Values guide creative and professional decisions.",
          "Authenticity and privacy can exist together.",
        ],
        tryIt: "Choose three values you want people to experience when they work with you.",
      },
      {
        id: "1-3",
        title: "Audience Experience + a 90-Day Goal",
        minutes: 4,
        narration: `An audience is not only an age range or location. It is a group of people who connect with a feeling, story, sound, or experience. Instead of starting with “everyone,” ask what kind of moment your music belongs in. Is your listener preparing for a big day, thinking alone at night, celebrating with friends, studying, dancing, healing, or imagining a different future?

Knowing the desired experience helps you make creative decisions. High-energy music for group celebrations may use different tempo, hooks, performance style, and visuals than thoughtful music for quiet reflection. You can have more than one type of listener, but begin with one clear experience.

Turn your identity into action with a 90-day goal. A useful goal names a result you can influence, the actions you will take, and the evidence that will show progress. “Become famous” depends on other people. “Write and revise two original songs, record one private demo, and ask two trusted people for feedback within 90 days” is specific and controllable.

Choose a goal that stretches you without requiring money, connections, or equipment you do not have. A goal focuses your next steps; it does not prove your value.`,
        remember: [
          "Define an audience by connection and experience.",
          "Focus on results and actions you can influence.",
          "A 90-day goal should be specific, realistic, and measurable.",
        ],
        tryIt: "Name one listening moment your music could belong in.",
      },
    ],
    activity: {
      title: "Portfolio 1: Artist Identity Card",
      intro: "Write a clear starting point. You can revise this later as your artistry develops.",
      fields: [
        { id: "artist-name", label: "Artist or working name", hint: "A stage name is optional.", type: "short", required: true },
        { id: "purpose", label: "My purpose: I create music because…", type: "long", required: true },
        { id: "themes", label: "My three recurring themes", type: "long", required: true },
        { id: "values", label: "My three values", type: "short", required: true },
        { id: "strengths", label: "My creative strengths", hint: "List three skills, qualities, or habits.", type: "long", required: true },
        { id: "experience", label: "I want listeners to feel… because…", type: "long", required: true },
        { id: "audience", label: "My music may connect with people who…", type: "long", required: true },
        { id: "goal-90", label: "In the next 90 days, I will…", type: "long", required: true },
        { id: "weekly-actions", label: "Two weekly actions that support my goal", type: "long", required: true },
        { id: "identity-statement", label: "My artist identity statement", placeholder: "I am a developing… who creates… about… so listeners can… I value…", type: "long", required: true },
      ],
    },
    quiz: {
      title: "Module 1 Quiz",
      intro: "Choose the best answer. You need 4 of 5 to pass and may retry anytime.",
      questions: [
        q("Artist development is best described as:", ["Getting a logo before making music", "Strengthening craft, identity, communication, business knowledge, and habits", "Copying a successful artist’s career", "Increasing followers by any method"], 1, "Artist development strengthens the full set of creative and professional skills surrounding the artist."),
        q("Which is the strongest example of an artist purpose?", ["I need everyone to like me.", "I want to create music that helps young people feel understood during change.", "I will use whichever identity is popular this week.", "I only create because an artist is supposed to."], 1, "A purpose explains why the artist creates and the experience they hope to provide."),
        q("Values are useful because they:", ["Guarantee success", "Replace practice", "Help guide creative and professional decisions", "Tell an artist exactly which genre to use"], 2, "Values are decision guides. They do not guarantee outcomes or replace practice."),
        q("Which description identifies an audience by experience?", ["Every person in the world", "People who want energetic music for celebrating with friends", "Only people with more than 10,000 followers", "Anyone who buys something"], 1, "This answer names a situation and connection rather than trying to reach everyone."),
        q("Which is the strongest 90-day goal?", ["Become the biggest artist immediately", "Wait until someone discovers me", "Write two songs, revise both, and record one private demo within 90 days", "Never change my first idea"], 2, "This goal has a result, actions, and a deadline the artist can influence."),
      ],
    },
  },
  {
    id: "sound",
    number: "02",
    title: "Find + Describe Your Sound",
    shortTitle: "Find your sound",
    minutes: 30,
    product: "Personal Sound Map",
    goal: "Identify the ingredients in your sound, study influences ethically, and test several directions.",
    accent: "#ff8cc5",
    lessons: [
      {
        id: "2-1",
        title: "Build Your Sound DNA",
        minutes: 5,
        narration: `Artists are often told to “find your sound” as if one perfect sound is hiding somewhere. A more useful approach is to build your sound by noticing patterns and making choices.

Genre is one clue, but sound is larger than genre. Your Sound DNA has at least six layers. First is voice and delivery: tone, phrasing, energy, rhythm, and how close or distant the performance feels. Second is rhythm and movement: tempo, groove, bounce, pauses, and whether the music feels urgent or relaxed. Third is melody and harmony: wide melodies, layered harmony, repeated notes, spoken delivery, or unusual chord movement.

Fourth is production texture: clean, raw, warm, bright, dark, spacious, crowded, electronic, acoustic, distorted, or minimal. Fifth is subject and emotion: the ideas you naturally return to and the emotions you communicate clearly. Sixth is energy and setting: headphones, live stage, dance floor, study session, car ride, celebration, or quiet room.

“Hip-hop” is a genre label. “Conversational verses, energetic drums, soulful chords, honest storytelling, and a hopeful tone” is a useful creative description. Your Sound Map describes your current direction, not a lifetime contract.`,
        remember: ["Sound is made from creative ingredients, not only a genre label.", "Voice, rhythm, melody, production, subject, emotion, energy, and setting matter.", "A useful description guides a creative decision.", "Your sound is allowed to develop."],
        tryIt: "Choose one word for your delivery, one for your production, and one for your emotional tone.",
      },
      {
        id: "2-2",
        title: "Influence Without Imitation",
        minutes: 5,
        narration: `Every artist has influences. Learning from other work is normal. The goal is to study the choices behind the work without copying lyrics, melodies, recordings, artwork, or another person’s identity.

Ask what specifically attracts you. You may like the space between lines, drum energy, honest writing, harmony, confident performance, or contrast between calm verses and a powerful hook. Study one element at a time. Learn pacing from one source, emotional honesty from another, and production texture from a third. Then add your own story, voice, values, and limitations.

Use this sentence: “I am inspired by the way this work uses ____. I will explore that principle by ____, without copying the original words, melody, recording, artwork, or identity.” A student who admires a quiet-to-energetic change can create a different song using contrast. The lesson is the principle, not the protected expression.

If an idea sounds too close to a reference, change several major elements: melody, rhythm, tempo, key, structure, instrumentation, point of view, and wording. When in doubt, do not release it until a knowledgeable adult or qualified professional has reviewed the concern.`,
        remember: ["Study creative principles rather than copying finished expression.", "Combine multiple influences with your own story and voice.", "Reference music is for analysis, not taking protected work.", "Revise anything that feels too close before sharing."],
        tryIt: "Name one influence and one principle you can explore in an original way.",
      },
      {
        id: "2-3",
        title: "Experiment, Listen + Describe",
        minutes: 5,
        narration: `You discover more by making three small experiments than by waiting for one perfect idea. Choose one original line, melody, rhythm, or beat idea and create three brief versions.

Version A can be your first instinct. In Version B, change energy, tempo, rhythm, or delivery. In Version C, change production texture, point of view, structure, or the amount of space. You can perform each version privately or describe it in writing.

Then listen like a creative director. Which version feels natural? Which communicates the intended emotion? What part feels original? What feels forced? What would you keep if you combined the strongest pieces?

Choose three to five specific adjectives: conversational, cinematic, playful, intense, reflective, raw, polished, rhythmic, spacious, warm, or unpredictable. Then write: “My developing sound combines [delivery], [rhythm or production], and [themes or emotions] to create a [listener experience] feeling.” This is a direction to test, not a final answer.`,
        remember: ["Small experiments create useful evidence.", "Change one or two major elements in each version.", "Evaluate communication and authenticity.", "Use specific adjectives and a one-sentence sound statement."],
        tryIt: "Write three adjectives that describe the direction you want to test.",
      },
    ],
    activity: {
      title: "Portfolio 2: Personal Sound Map",
      intro: "Describe your current creative direction, study an influence responsibly, and compare three small experiments.",
      fields: [
        { id: "delivery", label: "Voice or delivery: choose three words", type: "short", required: true },
        { id: "rhythm", label: "Rhythm and movement", hint: "Describe tempo, groove, pauses, or energy.", type: "long", required: true },
        { id: "melody", label: "Melody or harmony", type: "long", required: true },
        { id: "texture", label: "Production texture: choose three words", type: "short", required: true },
        { id: "sound-themes", label: "Subjects, themes, and main emotions", type: "long", required: true },
        { id: "setting", label: "Best listening setting", type: "long", required: true },
        { id: "influence", label: "Ethical influence study", hint: "What principle inspires you? How will you explore it? What will you avoid copying?", type: "long", required: true },
        { id: "version-a", label: "Version A: first instinct — what worked?", type: "long", required: true },
        { id: "version-b", label: "Version B: change energy, rhythm, tempo, or delivery — what worked?", type: "long", required: true },
        { id: "version-c", label: "Version C: change texture, viewpoint, structure, or space — what worked?", type: "long", required: true },
        { id: "sound-statement", label: "My sound statement", placeholder: "My developing sound combines…", type: "long", required: true },
      ],
    },
    quiz: {
      title: "Module 2 Quiz",
      intro: "Choose the best answer. You need 4 of 5 to pass.",
      questions: [
        q("Which description gives the most useful information about an artist’s sound?", ["Good music", "Hip-hop", "Conversational verses, warm chords, energetic drums, and hopeful storytelling", "Whatever is popular"], 2, "This identifies delivery, harmony, rhythm, and theme rather than using a broad label alone."),
        q("Which action learns from an influence ethically?", ["Copying the same melody with one word changed", "Studying how contrast creates energy, then using contrast in a different original song", "Reusing artwork without permission", "Performing as if you are the other artist"], 1, "Creative principles may inspire new original decisions. Protected expression should not be copied."),
        q("Why create three short versions of an idea?", ["To collect evidence about which choices communicate best", "To avoid decisions", "To make every version identical", "To post unfinished work immediately"], 0, "Experiments help the artist compare choices instead of guessing."),
        q("Which word is most useful in a sound description?", ["Nice", "Music", "Spacious", "Popular"], 2, "Spacious can guide arrangement and production decisions; the other choices are too broad."),
        q("A Sound Map should be treated as:", ["A permanent rule", "A description of the current direction that can develop", "A replacement for creating", "Proof one genre is better"], 1, "A Sound Map is a current creative direction, not a permanent limit."),
      ],
    },
  },
  {
    id: "industry",
    number: "06",
    title: "Labels, Rights + the Music Industry",
    shortTitle: "Industry + rights",
    minutes: 45,
    product: "Industry Pathway Map",
    goal: "Build a plain-language map of industry roles, career pathways, music rights, agreements, and warning signs.",
    accent: "#54d5a4",
    lessons: [
      {
        id: "6-1",
        title: "The Creative + Business Team",
        minutes: 6,
        narration: `The music industry is a network of creators, service providers, rights organizations, venues, media, technology companies, and businesses. Understanding roles helps an artist ask better questions and avoid expecting one person to do everything.

The creative team may include songwriters, producers, recording engineers, mixing and mastering engineers, musicians, and vocalists. One person may perform several roles. The business team can include a manager, entertainment attorney, accountant or business manager, and booking representative. A manager coordinates strategy but does not replace a qualified attorney for legal review.

The communication team can include publicists, marketers, content creators, photographers, designers, and community managers. Industry companies may include record labels, distributors, music publishers, performing rights organizations, royalty collection organizations, licensing companies, venues, promoters, and digital services.

Do not build a large team just to look professional. Add help when there is a clear job, trustworthy person, written expectation, and enough activity to justify the cost. Ask every team member: What exact work will you do? What decisions can you make? How and when will you be paid? How long will this last? Who owns created work? How can either side end the relationship?`,
        remember: ["The industry contains many separate roles and organizations.", "Creative, business, and communication roles solve different problems.", "One person may perform several roles.", "Add team members for a clear need, not appearance.", "Define work, power, payment, ownership, term, and exit in writing."],
        tryIt: "Name one role you might need next year and the exact problem that role would solve.",
      },
      {
        id: "6-2",
        title: "Independent, Distribution + Label Pathways",
        minutes: 7,
        narration: `Independent and signed are not opposite levels of talent. They describe different business structures.

An independent artist releases without a traditional recording agreement controlling the project. They may hire services while keeping more control, but they also carry more responsibility for funding, planning, administration, marketing, and risk.

A distributor helps deliver recordings and metadata to listening services. Some charge a fee, some take a percentage, and some include services or a license. Distribution does not automatically mean an artist keeps every right; the written terms decide.

A label may provide funding, recording support, marketing, distribution, relationships, and project management. In exchange, it may receive ownership or a license in masters, income share, repayment of project costs, approval rights, exclusivity, and control for a term. Artist-services partnerships may fall between independent and traditional structures.

An advance is usually not a gift. Defined costs may be recouped from future artist revenue. Ask what is recoupable, from which income, how accounting works, and what happens if the project earns less than expected. Choose a path based on goals, resources, control, risk, partner quality, and qualified advice—not status.`,
        remember: ["Independent and signed are structures, not talent rankings.", "Distributor services and rights vary by agreement.", "Label support may involve rights, recoupment, control, and term.", "An advance is commonly recoupable.", "Written terms matter more than a deal’s name."],
        tryIt: "Which matters most right now: control, support, money, workload, or speed? Explain why.",
      },
      {
        id: "6-3",
        title: "The Song, the Master + Royalty Categories",
        minutes: 9,
        narration: `One recorded song can involve two different copyrighted works. The musical composition is the underlying music and lyrics. Songwriters and composers create it, and a publisher may own or administer some rights under an agreement. The sound recording, often called the master, is one recorded performance of that composition. An artist, label, producer, or another party may own or share rights in the master.

If one song is recorded as an acoustic version and an electronic version, the underlying composition may be the same while the recordings are separate masters.

In the United States, copyright protection generally begins when an original work is fixed in a tangible form, such as written lyrics, a saved project, or a recording. Registration provides important legal benefits. Ownership and registration decisions deserve knowledgeable adult and qualified professional guidance.

Composition-side income may include public-performance royalties, mechanical royalties, and synchronization fees for pairing the composition with visual media. Master-side income may include streams, downloads, sales, licenses, and synchronization of the recording. Payment paths and rates vary.

A performing rights organization licenses and collects certain composition public-performance royalties. Publishers can administer composition rights. Distributors deliver masters and metadata. In the United States, SoundExchange administers certain statutory royalties from non-interactive digital services. These roles are not interchangeable.

Metadata identifies artist name, title, writers, producers, owners, release date, language, content status, and codes. Errors can delay credits, discovery, reporting, and payments. Keep a private credits sheet for every project.`,
        remember: ["Composition and sound recording are separate works.", "A master is one particular recorded performance.", "Income comes from different rights, uses, and agreements.", "PROs, publishers, distributors, and SoundExchange serve different functions.", "Organize metadata and credits before release."],
        tryIt: "For one project, list who contributed to the composition and who contributed to the recording.",
      },
      {
        id: "6-4",
        title: "Agreements, Split Sheets + Warning Signs",
        minutes: 7,
        narration: `An agreement turns expectations into responsibilities. Before accepting terms, identify the parties and exact services. Review the term and territory: how long and where does it apply?

Review rights and ownership. Does the other party own the work, receive a temporary license, or only permission for one use? Is it exclusive? Does it cover future work, name, image, voice, merchandise, performances, or other income? Review money: flat fee, percentage, royalty, commission, or advance; deductions and recoupment; statements and payment timing; and any upfront fee.

Review approval and exit. Who makes final decisions? What happens if work is late or missing? Can the agreement end, and what happens to rights afterward? A split sheet records the composition, writers, contacts, ownership percentages, and confirmations. Production and master ownership should also be documented. Do not guess percentages later.

Warning signs include guaranteed fame or income, pressure to sign immediately, vague promises, requests for passwords or banking login, unexplained fees, impersonation, missing company details, secrecy from guardians, and refusal to allow legal review. A warning sign means pause and verify independently. Find an official contact yourself, request written terms, compare options, and ask a trusted adult and qualified professional.

Never sign a real agreement as a course exercise. This course provides education, not legal, financial, tax, or contract advice.`,
        remember: ["Review parties, services, term, territory, rights, money, approval, and exit.", "A license and ownership are different.", "Document composition splits and master contributions.", "Pressure, secrecy, impersonation, and sensitive requests are warning signs.", "Pause, verify, and obtain trusted professional review."],
        tryIt: "Write one question you would ask before agreeing to paid creative work.",
      },
    ],
    activity: {
      title: "Portfolio 6: Industry Pathway Map",
      intro: "This is an educational planning exercise, not an agreement. Never enter real sensitive information here.",
      fields: [
        { id: "pathway", label: "Current pathway", placeholder: "Independent for now / services or distribution / label partnership / not sure", type: "short", required: true },
        { id: "pathway-why", label: "Why this path fits right now", hint: "Use needs, control, resources, workload, or rights.", type: "long", required: true },
        { id: "team-roles", label: "Three roles I may need + the problem each would solve", type: "long", required: true },
        { id: "team-questions", label: "One question I would ask each role before working together", type: "long", required: true },
        { id: "rights-map", label: "Rights map for one original project", hint: "Working title; composition, lyrics, production, performance, and recording contributors; proposed ownership or not decided; permissions; missing metadata.", type: "long", required: true },
        { id: "warning-signs", label: "Identify four warning signs", hint: "A stranger guarantees a deal tonight, asks for banking login and identification, and says to tell no one.", type: "long", required: true },
        { id: "safe-steps", label: "Three safe next steps", type: "long", required: true },
        { id: "agreement-questions", label: "Six agreement questions", hint: "Write one question each for services, term, rights, money, approval, and exit.", type: "long", required: true },
      ],
    },
    quiz: {
      title: "Module 6 Quiz",
      intro: "Choose the best answer. You need 6 of 7 to pass.",
      questions: [
        q("Who is specifically qualified to explain and negotiate an entertainment agreement?", ["A fan account", "An entertainment attorney", "Any photographer", "A follower"], 1, "A qualified attorney provides legal review and negotiation."),
        q("Which statement about independent and label pathways is accurate?", ["One path is always best", "Independent artists have no business duties", "The best path depends on goals, resources, control, risk, partner, and terms", "A label guarantees success"], 2, "Career structure should be judged by needs and actual terms, not status."),
        q("A musical composition is:", ["The underlying music and lyrics, when included", "Only the final audio file", "A social page", "A distributor logo"], 0, "The composition is the underlying musical work, including lyrics when present."),
        q("A master is:", ["Any unrecorded idea", "A particular sound recording of a composition", "A guarantee of ownership", "A performance schedule"], 1, "A master is a specific recorded performance of the composition."),
        q("Why is metadata important?", ["It identifies work, contributors, credits, and rights information", "It replaces agreements", "It guarantees streams", "It should be guessed later"], 0, "Accurate data supports identification, credits, reporting, and payments."),
        q("Which belongs in an agreement review?", ["Services, term, rights, money, approval, and exit", "Only the document color", "Only a verbal promise", "Follower count only"], 0, "These categories reveal responsibilities and what happens over time."),
        q("What is safest when an unknown contact guarantees success and requests banking login immediately?", ["Send it before the deadline", "Keep it secret", "Pause, send nothing, verify independently, and involve a trusted adult", "Send a second password"], 2, "Sensitive access should never be sent under pressure. Verify through trusted channels."),
      ],
    },
  },
  {
    id: "release",
    number: "07",
    title: "Marketing, Release Planning + Professionalism",
    shortTitle: "Release planning",
    minutes: 30,
    product: "30-Day Release + Professional Action Plan",
    goal: "Choose an audience goal, prepare release assets, communicate clearly, and protect time, money, and reputation.",
    accent: "#48a6ff",
    lessons: [
      {
        id: "7-1",
        title: "Build Connection, Not Just Attention",
        minutes: 5,
        narration: `Marketing helps the right people discover, understand, and act on the music. Attention without connection may disappear quickly.

Begin with one release goal you can influence: introduce a new sound, bring people to a performance, collect feedback, build a consent-based email list, create a portfolio sample, or help current supporters share the work. Avoid goals that depend entirely on becoming viral.

Use four content purposes. Discover helps a new person notice the work. Understand explains a story, process, or creative decision. Trust comes from accurate information, gratitude, consistency, and follow-through. Act gives a clear invitation such as listen, save, attend, respond, or share.

One idea can become several approved pieces. Do not share unfinished work or another person’s image without permission. Choose a schedule that fits school, family, health, work, and creative practice. More content is not always better. Protect privacy: delay location posts, avoid documents and schedules, and use an approved business contact method. Public posting is optional.`,
        remember: ["Marketing should create discovery, understanding, trust, or action.", "Set one controllable release goal.", "Reuse one idea in approved formats.", "Choose a sustainable schedule and protect privacy."],
        tryIt: "Choose one goal and one audience action for a practice release.",
      },
      {
        id: "7-2",
        title: "Build a Simple Release Plan",
        minutes: 6,
        narration: `A release is a project with creative, legal, technical, and communication steps. Use four phases.

Phase one: Finish. Complete the composition and master. Confirm collaborators, credits, ownership discussions, permissions, clean and explicit versions when relevant, artwork rights, and final file names. Do not release a sample, beat, image, or performance without permission.

Phase two: Set up. Choose a realistic date. Check the distributor’s current requirements and allow extra time. Enter metadata carefully. Prepare artwork, bio, approved photos, lyrics when used, links, and backups.

Phase three: Introduce. Decide what the audience should understand before release. Share the concept, a safe behind-the-scenes detail, approved preview, or reason the project matters. Give accurate dates without promising outcomes you cannot control.

Phase four: Release and follow through. Verify links and credits. Thank collaborators. Share different entry points. Watch useful information about discovery and meaningful response. If files, permission, artwork, or setup are not ready, moving the date can be more professional than releasing incorrect or unauthorized work. A release continues after day one through follow-up and reflection.`,
        remember: ["Finish rights, credits, files, and permissions first.", "Check current delivery requirements and allow time.", "Introduce meaning before asking for action.", "Verify links and credits on release day.", "Follow through and learn after release."],
        tryIt: "Put one task under each phase: Finish, Set Up, Introduce, and Follow Through.",
      },
      {
        id: "7-3",
        title: "Professional Habits + a Sustainable Career",
        minutes: 5,
        narration: `Professionalism makes your work easier to trust. It appears in replying clearly, arriving prepared, meeting deadlines, naming files, tracking decisions, crediting people, and speaking respectfully.

Use a communication pattern: context, request, deadline, thanks. “Hello, I’m following up about the approved cover photo. Please send the high-resolution file and usage permission by Friday so we can complete setup. Thank you.” The message explains why, what, and when.

Keep a project folder with audio, working files, lyrics, credits, agreements, artwork, photos, invoices, and release information. Use names that include project, version, and date. “Final” is not helpful when five files are all named final.

Create a budget before spending. Separate needs from upgrades. Ask what outcome an expense supports, whether a lower-cost option exists, who approves it, and how payment will be documented. Young artists should involve a guardian in financial accounts and paid agreements.

Protect school, family, health, time, and creative energy. You do not need every opportunity. End each project by asking what worked, what did not, what evidence supports that, and what to repeat, stop, or test next. A career grows through many informed cycles.`,
        remember: ["Professionalism appears in communication, records, credits, and follow-through.", "Use context, request, deadline, and thanks.", "Organize files and budget before spending.", "Protect school, family, privacy, safety, and energy.", "Review evidence after every project."],
        tryIt: "Write one professional request using context, request, deadline, and thanks.",
      },
    ],
    activity: {
      title: "Portfolio 7: 30-Day Release + Action Plan",
      intro: "Plan a real future release or a fictional practice release. You are not required to publish anything.",
      fields: [
        { id: "release-title", label: "Project or practice title", type: "short", required: true },
        { id: "release-goal", label: "One release goal + intended audience experience", type: "long", required: true },
        { id: "release-date", label: "Target date or ‘practice only’ + main call to action", type: "short", required: true },
        { id: "week-1", label: "Week 1: Finish — four tasks", type: "long", required: true },
        { id: "week-2", label: "Week 2: Set Up — four tasks", type: "long", required: true },
        { id: "week-3", label: "Week 3: Introduce — three safe content ideas", hint: "Use discover, understand, trust, or act.", type: "long", required: true },
        { id: "week-4", label: "Week 4: Release + Follow Through — four tasks", type: "long", required: true },
        { id: "professional-email", label: "Professional message practice", hint: "Use context, request, deadline, and thanks. Do not use real private contact information.", type: "long", required: true },
        { id: "budget", label: "Budget check", hint: "One required resource, one upgrade, a lower-cost alternative, and whether adult approval is needed.", type: "long", required: true },
      ],
    },
    quiz: {
      title: "Module 7 Quiz",
      intro: "Choose the best answer. You need 4 of 5 to pass.",
      questions: [
        q("A useful marketing goal is:", ["Guarantee a viral song", "Help new listeners understand the artist’s developing sound", "Post private information", "Copy every trend"], 1, "It is a meaningful goal the artist’s communication can influence."),
        q("Which task belongs in the Finish phase?", ["Confirm final files, credits, ownership discussions, and permissions", "Guess songwriter names later", "Use artwork without permission", "Announce before checking music"], 0, "Final rights, credits, and files should be organized before delivery."),
        q("Why check current distributor requirements?", ["Requirements, file specifications, and timelines may vary", "A distributor writes the song", "Every distributor guarantees promotion", "It removes the need for metadata"], 0, "Technical and timing details can differ, so verify current requirements."),
        q("Which professional message is strongest?", ["Send it.", "Please send the approved high-resolution cover file and usage permission by Friday so we can complete setup. Thank you.", "I need everything right now!!!", "A message with no context"], 1, "It provides context, a specific request, deadline, and thanks."),
        q("After a release, an artist should:", ["Avoid reviewing information", "Review what worked, what did not, and what to change next", "Delete all records", "Measure personal worth by one day of numbers"], 1, "A project review turns experience into the next improvement."),
      ],
    },
  },
  {
    id: "final",
    number: "08",
    title: "Final Portfolio + Assessment",
    shortTitle: "Finish + certificate",
    minutes: 30,
    product: "Portfolio, final assessment + reflection",
    goal: "Combine your work, verify core knowledge, measure growth, and unlock your completion certificate.",
    accent: "#c9ff46",
    lessons: [
      {
        id: "8-1",
        title: "Assemble Your Artist Development Portfolio",
        minutes: 15,
        narration: `You have built the parts of an artist development portfolio. Now review, revise, and arrange them into one clear story: Artist Identity Card, Personal Sound Map, Original Song Seed and Readiness Checklist, Artist Brand Board, artist bio and key messages, mock interview reflection, Industry Pathway and Rights Map, 30-Day Release Plan, and revised 90-Day Artist Goal.

Add an opening statement of 75 to 125 words answering three questions: Who am I becoming as an artist? What did I learn about my sound, brand, or career direction? What is the first action I will take after the course?

Review for completeness and connection. Does the purpose connect with the audience experience and goal? Does the Sound Map match the brand direction? Does the release plan fit your current resources and safety boundaries? Are collaborators and permissions named where relevant?

Your portfolio is not judged on fame, expensive design, vocal ability, equipment quality, family resources, or whether a reviewer personally prefers your genre. It demonstrates thoughtful decisions, original work, professional readiness, and a practical next step. Download it before leaving the beta so you have your own backup.`,
        remember: ["Combine all seven portfolio products.", "Add a 75–125 word opening statement.", "Check that identity, sound, brand, and plans connect.", "Confirm originality, credits, permissions, and privacy.", "Download your workbook as a backup."],
        tryIt: "Read your identity statement and 90-day goal together. What needs to change now that you finished the course?",
      },
    ],
    activity: {
      title: "Final Reflection + Post-Assessment",
      intro: "Complete the same confidence ratings, then reflect on your growth. Ratings are required but not graded.",
      fields: [
        { id: "opening-statement", label: "Portfolio opening statement (75–125 words)", hint: "Who are you becoming? What did you learn? What will you do first?", type: "long", required: true },
        { id: "revised-goal", label: "My revised 90-day Artist Goal", type: "long", required: true },
        { id: "post-identity", label: "I can clearly explain who I am as an artist.", type: "rating", required: true },
        { id: "post-sound", label: "I can describe the elements that make my sound unique.", type: "rating", required: true },
        { id: "post-song", label: "I have a process for turning an idea into a song.", type: "rating", required: true },
        { id: "post-brand", label: "I understand how an artist brand is different from a logo.", type: "rating", required: true },
        { id: "post-interview", label: "I feel prepared to introduce myself in an interview.", type: "rating", required: true },
        { id: "post-pathways", label: "I understand independent and label pathways.", type: "rating", required: true },
        { id: "post-rights", label: "I understand the difference between a song and its master.", type: "rating", required: true },
        { id: "post-contract", label: "I know what questions to ask before signing an agreement.", type: "rating", required: true },
        { id: "post-release", label: "I can build a simple release and promotion plan.", type: "rating", required: true },
        { id: "post-confidence", label: "I feel confident taking my next step as an artist.", type: "rating", required: true },
        { id: "reflection-decision", label: "The most important decision I made about my artistry", type: "long", required: true },
        { id: "reflection-use", label: "The portfolio section I am most likely to use again", type: "long", required: true },
        { id: "reflection-industry", label: "One industry idea I understand better", type: "long", required: true },
        { id: "reflection-improve", label: "One part of the course Future of Music should improve", type: "long", required: true },
        { id: "reflection-action", label: "One action I will complete in the next seven days", type: "long", required: true },
        { id: "final-originality", label: "I confirm my portfolio is original or properly credited and contains no private information I do not want saved on this device.", type: "check", required: true },
      ],
    },
    quiz: {
      title: "Final Knowledge Assessment",
      intro: "You need 13 of 16 to pass. Retakes are unlimited, and every answer includes an explanation.",
      questions: [
        q("Artist development includes:", ["Only vocal practice", "Craft, identity, communication, brand, business knowledge, and professional habits", "Buying equipment first", "Becoming similar to another artist"], 1, "Artist development strengthens the whole creative and professional artist."),
        q("Which identity statement is most useful?", ["I make music for everyone about everything.", "I am a developing artist combining reflective writing and energetic production to help young listeners feel confident during change.", "I use whatever image is popular.", "My follower count is my identity."], 1, "It states sound, audience, purpose, and current developmental stage."),
        q("Which practice best supports an original sound?", ["Study principles from several influences and combine them with original choices", "Reuse another artist’s melody", "Copy artwork", "Avoid experimentation"], 0, "Specific principles can inspire original work without copying protected expression."),
        q("What is the job of a song concept?", ["Name the subject, point of view, and emotional movement", "Guarantee a hit", "Replace revision", "Copy a finished song"], 0, "The concept gives the song a clear center and movement."),
        q("Which revision question is strongest?", ["Is every line complicated?", "Does each section add information or energy to the central idea?", "Does it use expensive words?", "Is it identical to the reference?"], 1, "Strong revision checks whether the song develops its central idea."),
        q("An artist brand is:", ["A logo only", "The consistent experience created by sound, story, visuals, language, behavior, and values", "A private address", "A promise to share every detail"], 1, "A brand is the complete repeated experience, not one visual item."),
        q("In an interview, Answer, Bridge, Message helps the artist:", ["Ignore every question", "Respond honestly and connect to a prepared key point", "Invent facts", "Reveal private information"], 1, "ABM combines a fair answer with a clear key message."),
        q("If a reporter asks for a private detail, the artist may:", ["Set a respectful boundary and offer a related public message", "Share passwords", "Give another person’s information", "Agree to an unknown private meeting"], 0, "Artists may protect privacy while remaining professional."),
        q("The composition and master are:", ["Always the same work", "Separate works that may have different contributors and owners", "Owned automatically by a streaming service", "Only relevant to famous artists"], 1, "The underlying work and one particular recording are separate."),
        q("Which statement about a record label is accurate?", ["A label guarantees success.", "A label may provide support in exchange for agreed rights, income shares, control, or recoupment.", "Every agreement is identical.", "The agreement does not matter."], 1, "Label support and artist obligations depend on the agreement."),
        q("What should collaborators do before release?", ["Document contributions, credits, permissions, and agreed ownership", "Guess percentages later", "Remove everyone’s name", "Avoid discussing the master"], 0, "Clear records protect permission, credit, ownership, and relationships."),
        q("Which is a warning sign?", ["A written list of deliverables", "Time for professional review", "Guaranteed fame, immediate pressure, and a request for banking login", "Independent company verification"], 2, "Guarantees, pressure, and sensitive-access requests require a pause and verification."),
        q("Which belongs in the Set Up phase?", ["Accurate metadata, artwork, distribution timing, and file backup", "Copying artwork", "Hiding contributor names", "Deleting the final master"], 0, "Setup includes accurate delivery information, assets, timing, and backups."),
        q("A professional request should include:", ["Context, a clear request, a reasonable deadline, and thanks", "Only capital letters", "No explanation", "Private passwords"], 0, "This structure makes a request easy to understand and answer."),
        q("The strongest way to evaluate a release is to:", ["Measure personal worth with first-day numbers", "Review evidence, identify what worked, and choose the next improvement", "Expect one project to decide the career", "Ignore records"], 1, "Evidence-based review turns one release into better future decisions."),
        q("Before a session or performance, an artist should:", ["Confirm goal, schedule, files, credits, equipment, backups, and responsible-adult details", "Assume files will appear", "Share a live location publicly", "Avoid rehearsing transitions"], 0, "Clear preparation supports safety, teamwork, time management, and stronger performance."),
      ],
    },
  },
];

export const courseModules = unsortedCourseModules.sort((a, b) => Number(a.number) - Number(b.number));

export const totalMinutes = courseModules.reduce((sum, module) => sum + module.minutes, 0);
export const totalLessons = courseModules.reduce((sum, module) => sum + module.lessons.length, 0);
