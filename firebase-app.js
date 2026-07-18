import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const config = {
  apiKey: "AIzaSyBJKj7RaLBW7G7XoS9zm_PCrr4My86aYKI",
  authDomain: "our-days-b22c6.firebaseapp.com",
  projectId: "our-days-b22c6",
  storageBucket: "our-days-b22c6.firebasestorage.app",
  messagingSenderId: "209571731890",
  appId: "1:209571731890:web:498f67195d892e03bb6cab",
};
const adminUid = "CzfcMrq7vnN8I1htcNLDnf7SIiA2";
const app = initializeApp(config),
  auth = getAuth(app),
  db = getFirestore(app),
  storage = getStorage(app),
  stateRef = doc(db, "app", "state");
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)],
  todayKey = () => new Date().toISOString().slice(0, 10);
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );

const seed = {
  people: [
    { id: "hunter", name: "Hunter", colour: "#e16b55", target: 300 },
    { id: "amelia", name: "Amelia", colour: "#7867a8", target: 300 },
    { id: "david", name: "David", colour: "#176b5b", target: 300 },
    { id: "lydia", name: "Lydia", colour: "#c78d31", target: 300 },
  ],
  tasks: [
    {
      id: "dress",
      name: "Get dressed",
      person: "hunter",
      category: "Ready for the day",
      points: 0,
      active: true,
    },
    {
      id: "breakfast",
      name: "Eat breakfast",
      person: "hunter",
      category: "Ready for the day",
      points: 0,
      active: true,
    },
    {
      id: "teeth",
      name: "Brush teeth",
      person: "hunter",
      category: "Ready for the day",
      points: 0,
      active: true,
    },
    {
      id: "room",
      name: "Quick bedroom tidy",
      person: "hunter",
      category: "Ready for the day",
      points: 2,
      active: true,
    },
    {
      id: "spell",
      name: "Spelling test",
      person: "hunter",
      category: "Schoolwork",
      points: 5,
      active: true,
    },
    {
      id: "read-h",
      name: "Read together or independently",
      person: "hunter",
      category: "Schoolwork",
      points: 5,
      active: true,
    },
    {
      id: "maths-h",
      name: "Maths activity",
      person: "hunter",
      category: "Schoolwork",
      points: 5,
      active: true,
    },
    {
      id: "science-h",
      name: "Choose: science, geography or geology",
      person: "hunter",
      category: "Schoolwork",
      points: 5,
      active: true,
    },
    {
      id: "dog",
      name: "Walk the dog",
      person: "amelia",
      category: "Essentials",
      points: 0,
      active: true,
    },
    {
      id: "dishwasher",
      name: "Load the dishwasher",
      person: "amelia",
      category: "Essentials",
      points: 0,
      active: true,
    },
    {
      id: "constructive-a",
      name: "Choose something constructive",
      person: "amelia",
      category: "Today",
      points: 5,
      active: true,
    },
    {
      id: "gcse-a",
      name: "Complete a chosen GCSE task",
      person: "amelia",
      category: "Earn more",
      points: 10,
      active: true,
    },
    {
      id: "french-d",
      name: "French learning",
      person: "david",
      category: "Personal goals",
      points: 5,
      active: true,
    },
    {
      id: "exercise-d",
      name: "Run or exercise",
      person: "david",
      category: "Personal goals",
      points: 5,
      active: true,
    },
    {
      id: "project-d",
      name: "Useful job or personal project",
      person: "david",
      category: "Personal goals",
      points: 10,
      active: true,
    },
    {
      id: "phd-l",
      name: "PhD progress",
      person: "lydia",
      category: "Personal goals",
      points: 10,
      active: true,
    },
    {
      id: "yoga-l",
      name: "Yoga, walk or other exercise",
      person: "lydia",
      category: "Personal goals",
      points: 5,
      active: true,
    },
    {
      id: "garden-l",
      name: "Gardening or useful job",
      person: "lydia",
      category: "Personal goals",
      points: 5,
      active: true,
    },
  ],
  outings: [
    {
      id: "whitby",
      name: "Whitby",
      location: "england",
      weather: "either",
      time: "full",
      cost: "paid",
      repeat: "once",
      active: true,
    },
    {
      id: "vindolanda",
      name: "Vindolanda or another Roman site",
      location: "england",
      weather: "either",
      time: "full",
      cost: "paid",
      repeat: "once",
      active: true,
    },
    {
      id: "swim",
      name: "Swimming",
      location: "england",
      weather: "either",
      time: "half",
      cost: "paid",
      repeat: "often",
      active: true,
    },
    {
      id: "park",
      name: "Hexham Park",
      location: "england",
      weather: "dry",
      time: "short",
      cost: "free",
      repeat: "often",
      active: true,
    },
    {
      id: "trampoline",
      name: "Trampoline park",
      location: "england",
      weather: "wet",
      time: "half",
      cost: "paid",
      repeat: "occasional",
      active: true,
    },
    {
      id: "museum",
      name: "Great North Museum",
      location: "england",
      weather: "wet",
      time: "half",
      cost: "free",
      repeat: "once",
      active: true,
    },
    {
      id: "bike",
      name: "Bike ride or pump track",
      location: "england",
      weather: "dry",
      time: "short",
      cost: "free",
      repeat: "often",
      active: true,
    },
    {
      id: "beach-d",
      name: "Dieppe beach and seafront",
      location: "france",
      weather: "dry",
      time: "half",
      cost: "free",
      repeat: "often",
      active: true,
    },
    {
      id: "harbour-d",
      name: "Explore Dieppe harbour",
      location: "france",
      weather: "either",
      time: "short",
      cost: "free",
      repeat: "often",
      active: true,
    },
    {
      id: "estran",
      name: "ESTRAN Cité de la Mer",
      location: "france",
      weather: "wet",
      time: "half",
      cost: "paid",
      repeat: "occasional",
      active: true,
    },
    {
      id: "chateau-d",
      name: "Château-Musée de Dieppe",
      location: "france",
      weather: "wet",
      time: "half",
      cost: "paid",
      repeat: "once",
      active: true,
    },
    {
      id: "pirate-d",
      name: "L’Îlot Pirate",
      location: "france",
      weather: "wet",
      time: "half",
      cost: "paid",
      repeat: "occasional",
      active: true,
    },
    {
      id: "arb",
      name: "Arb’Aventure",
      location: "france",
      weather: "dry",
      time: "half",
      cost: "paid",
      repeat: "once",
      active: true,
    },
    {
      id: "fossils",
      name: "Fossil or rock search",
      location: "france",
      weather: "dry",
      time: "short",
      cost: "free",
      repeat: "often",
      active: true,
    },
    {
      id: "avenue",
      name: "Walk or cycle the Avenue Verte",
      location: "france",
      weather: "dry",
      time: "half",
      cost: "free",
      repeat: "often",
      active: true,
    },
  ],
  completions: [],
  memories: [],
  plans: {
    hunter: "Morning jobs, schoolwork, then see where the day takes us.",
    amelia: "Essentials, something constructive, then the day is yours.",
    david: "Family plans and one personal goal.",
    lydia: "PhD progress if useful; everything else is optional.",
  },
};
const learningSeed = [];
const addLearning = (area, subject, activities) =>
  activities.forEach(
    ([
      name,
      minutes = 10,
      place = "indoors",
      support = "either",
      energy = "calm",
    ]) =>
      learningSeed.push({
        id: `learn-${learningSeed.length + 1}`,
        person: "hunter",
        area,
        subject,
        name,
        minutes,
        place,
        support,
        energy,
        active: true,
      }),
  );

addLearning("English", "Spelling", [
  ["Spelling test"],
  ["Practise four tricky words", 5],
  ["Spelling treasure hunt", 10, "indoors", "either", "active"],
  ["Write words in silly sentences"],
]);
addLearning("English", "Reading", [
  ["Read together", 20, "indoors", "together"],
  ["Read independently", 20, "indoors", "independent"],
  ["Answer five questions about a book", 10],
  ["Retell a story in one minute", 5, "indoors", "either", "active"],
]);
addLearning("English", "Writing", [
  ["Write a letter"],
  ["Write a shopping list", 5],
  ["Describe what you ate", 10],
  ["Make a comic strip", 20],
  ["Write instructions for a simple job", 10],
]);
addLearning("English", "Vocabulary", [
  ["Find five words in a dictionary", 10],
  ["Learn new words from a book", 10],
  ["Act out vocabulary words", 5, "indoors", "together", "active"],
  ["Photograph and label five things", 10, "either", "independent"],
]);

addLearning("Maths", "Number", [
  ["Mental arithmetic challenge", 10],
  ["Number-line jumping", 5, "either", "together", "active"],
  ["Count efficiently in groups", 10],
  ["Times-table ball game", 10, "outdoors", "together", "active"],
]);
addLearning("Maths", "Fractions", [
  ["Make fractions by folding paper", 10],
  ["Use food to show fractions", 10, "indoors", "together", "messy"],
  ["Complete fraction questions", 10],
  ["Find fractions around the house", 10, "indoors", "independent", "active"],
]);
addLearning("Maths", "Shape and measure", [
  ["Paper folding and shape hunt", 10],
  ["Estimate then measure five objects", 10],
  ["Measure ten jumps or throws", 20, "outdoors", "together", "active"],
  ["Build or draw a repeating pattern", 10],
]);
addLearning("Maths", "Money", [
  ["Count a collection of coins", 10],
  ["Make a £5 shopping plan", 10],
  ["Compare two prices", 5],
  ["Read and explain a receipt", 10],
  ["Price something in euros", 10],
]);

addLearning("Science", "Plants", [
  ["Identify three plants", 10, "outdoors"],
  ["Propagate a plant or take a cutting", 20, "outdoors", "together", "messy"],
  ["Press a plant for the scrapbook", 20, "outdoors", "together", "messy"],
  ["Photograph signs of the season", 10, "outdoors", "independent", "active"],
]);
addLearning("Science", "Animals", [
  ["Five-minute bird watch", 5, "outdoors", "independent"],
  ["Identify an insect or arthropod", 10, "outdoors", "either", "active"],
  ["Draw and label an animal", 10],
  ["Make a fact page about an animal", 20],
]);
addLearning("Science", "Human body", [
  ["Learn and label the skeleton", 10],
  ["Learn what three organs do", 10],
  [
    "Investigate pulse before and after exercise",
    10,
    "either",
    "together",
    "active",
  ],
  ["Make a moving-joint model", 20, "indoors", "together", "messy"],
]);
addLearning("Science", "Materials and forces", [
  ["Predict and test what floats", 20, "indoors", "together", "messy"],
  ["Build and test a foil boat", 20, "indoors", "together", "messy"],
  ["Make and compare bubble mixtures", 20, "outdoors", "together", "messy"],
  ["Build a ramp and test objects", 20, "either", "together", "active"],
  ["Make a bottle orchestra", 20, "indoors", "together", "active"],
  [
    "Make something with clay or salt dough",
    20,
    "indoors",
    "together",
    "messy",
  ],
]);

addLearning("The world", "Geography", [
  ["Find Whitby and Dieppe on a map", 10],
  ["Plan a route using map symbols", 10],
  ["Compare the English and French coastlines", 20],
  ["Draw a map of somewhere familiar", 10],
  ["Find and translate a French sign", 5, "outdoors", "together", "active"],
]);
addLearning("The world", "Geology", [
  ["Identify three rocks", 10, "outdoors", "either", "active"],
  [
    "Search for fossils or interesting stones",
    20,
    "outdoors",
    "together",
    "active",
  ],
  ["Investigate the geology of the land", 20, "outdoors", "together", "active"],
  ["Make a rock fact card", 10],
]);
addLearning("The world", "History", [
  ["Investigate Romans or Vindolanda", 20],
  ["Discover one fact about Whitby history", 10],
  ["Compare an old and new photograph", 10],
  ["Ask and answer a local-history question", 10],
]);
addLearning("The world", "French", [
  ["Learn five useful French words", 10],
  ["Order a pretend snack in French", 5, "indoors", "together", "active"],
  ["Make labels for five household objects", 10],
  ["Count or name colours in French", 5],
]);

addLearning("Practical and creative", "Cooking", [
  ["Choose a recipe", 10],
  ["Write a shopping list", 5],
  ["Measure ingredients", 10, "indoors", "together", "messy"],
  ["Help cook tea", 20, "indoors", "together", "messy"],
  ["Prepare a snack", 10, "indoors", "independent", "messy"],
]);
addLearning("Practical and creative", "Making", [
  ["Make some art", 20, "indoors", "independent", "messy"],
  ["Complete part of a jigsaw", 20],
  ["Make a paper model", 20, "indoors", "independent", "messy"],
  ["Build something useful", 20, "either", "together", "messy"],
  ["Take and caption three photographs", 10, "either", "independent"],
]);
addLearning("Practical and creative", "Life skills", [
  ["Practise tying shoelaces", 10],
  ["Clean or check something on the car", 20, "outdoors", "together", "messy"],
  ["Tidy or fix something", 10, "either", "independent", "active"],
  ["Pack a bag for an outing", 10, "indoors", "independent"],
  ["Write or follow a set of instructions", 10],
]);
addLearning("Practical and creative", "Technology", [
  ["Record a one-minute news report", 10],
  ["Create a tiny survey and chart it", 20],
  ["Learn three keyboard shortcuts", 5],
  ["Create an obstacle-course algorithm", 20, "outdoors", "together", "active"],
]);
seed.learningActivities = learningSeed;
seed.learningSelections = [];
const adultLibraryStart = learningSeed.length;

const addPersonal = (
  person,
  area,
  subject,
  names,
  minutes = 20,
  energy = "calm",
) =>
  names.forEach((name) =>
    learningSeed.push({
      id: `wheel-${person}-${learningSeed.length + 1}`,
      person,
      area,
      subject,
      name,
      minutes,
      place: "either",
      support: "independent",
      energy,
      active: true,
    }),
  );

addPersonal("amelia", "GCSE focus", "Choose a subject", [
  "Complete one focused revision block",
  "Make a one-page topic summary",
  "Use flashcards for one weak topic",
  "Watch a lesson and make brief notes",
]);
addPersonal("amelia", "GCSE focus", "Exam technique", [
  "Answer one exam question",
  "Mark an old answer and improve it",
  "Plan a longer answer without writing it fully",
  "Learn what earns the next mark",
]);
addPersonal("amelia", "Creative", "Make something", [
  "Start or continue a craft",
  "Draw, paint or design something",
  "Try clay, resin or another material",
  "Make something for the scrapbook",
]);
addPersonal("amelia", "Reading and writing", "Quiet choice", [
  "Read a chapter",
  "Write privately for twenty minutes",
  "Find and read a good long-form article",
  "Write a letter, review or short story",
]);
addPersonal(
  "amelia",
  "Movement and outdoors",
  "Move",
  [
    "Take a purposeful walk",
    "Do a short workout or stretch",
    "Walk the dog somewhere different",
    "Try a yoga session",
  ],
  20,
  "active",
);
addPersonal("amelia", "Spanish", "Language", [
  "Learn ten useful words",
  "Listen to Spanish and note what you recognise",
  "Practise speaking for ten minutes",
  "Translate a song verse or short paragraph",
]);
addPersonal("amelia", "Independence", "Useful life", [
  "Cook or prepare something",
  "Plan and price a meal",
  "Sort one awkward pile or drawer",
  "Do one job that helps tomorrow",
]);
addPersonal("amelia", "Reset and connect", "Change the mood", [
  "Reset one part of the bedroom",
  "Put the phone away and make a drink",
  "Do something with Hunter",
  "Suggest a family activity",
]);

addPersonal("david", "Languages", "French", [
  "Learn and use ten French words",
  "Complete one French lesson",
  "Listen and repeat for fifteen minutes",
  "Write a tiny diary entry in French",
]);
addPersonal("david", "Words and learning", "English and ideas", [
  "Practise separate, achieve, receive and definitely",
  "Read about an unfamiliar subject",
  "Write or refine something",
  "Learn five words from a dictionary",
]);
addPersonal(
  "david",
  "Movement",
  "Exercise",
  [
    "Go for a run",
    "Take a brisk walk",
    "Cycle somewhere",
    "Do a short strength session",
  ],
  20,
  "active",
);
addPersonal("david", "Nature", "Observe and record", [
  "Identify plants",
  "Identify birds or insects",
  "Take cuttings or propagate something",
  "Add something to a nature scrapbook",
]);
addPersonal(
  "david",
  "Land and home",
  "Useful work",
  [
    "Complete one fencing or digging job",
    "Fix one irritating thing",
    "Tidy one neglected space",
    "Check or clean the car",
  ],
  20,
  "active",
);
addPersonal("david", "Making", "Hands-on", [
  "Make something from wood, clay or resin",
  "Try a paper-folding project",
  "Continue a creative project",
  "Learn how to use a tool or technique",
]);
addPersonal("david", "Food", "Cook and explore", [
  "Choose and cook a recipe",
  "Bake something",
  "Try a new food",
  "Plan a meal using what is already available",
]);
addPersonal("david", "Family", "Shared time", [
  "Read or learn something with Hunter",
  "Do a small project with Amelia",
  "Plan something Lydia would enjoy",
  "Create or record a family memory",
]);

addPersonal("lydia", "PhD", "Gentle progress", [
  "Work on one clearly bounded PhD task",
  "Tidy one section or reference list",
  "Write the next small paragraph",
  "Make a short finishing plan",
]);
addPersonal("lydia", "PhD", "Closing down", [
  "List what remains",
  "Send or prepare one necessary message",
  "Resolve one lingering note or comment",
  "Choose tomorrow's first step",
]);
addPersonal(
  "lydia",
  "Movement",
  "Gentle movement",
  [
    "Do a yoga session",
    "Take a short walk",
    "Stretch for ten minutes",
    "Walk somewhere pleasant",
  ],
  20,
  "active",
);
addPersonal("lydia", "Garden and outdoors", "Outside", [
  "Do one small gardening job",
  "Choose or tend a plant",
  "Sit outside with a drink and a book",
  "Take a short nature walk",
]);
addPersonal("lydia", "Creative", "Make or enjoy", [
  "Continue a craft",
  "Try a small creative idea",
  "Take photographs",
  "Make something for the scrapbook",
]);
addPersonal("lydia", "Reading and learning", "Quiet interest", [
  "Read a chapter",
  "Read something unrelated to the PhD",
  "Listen to a thoughtful podcast",
  "Learn about something chosen purely from interest",
]);
addPersonal("lydia", "Home", "Light reset", [
  "Tidy one surface",
  "Sort one drawer or small pile",
  "Do one job that makes tomorrow easier",
  "Choose one room improvement",
]);
addPersonal("lydia", "Wellbeing and family", "Choose kindly", [
  "Have proper time alone without work",
  "Do something with Hunter",
  "Suggest a family activity",
  "Plan something enjoyable with David",
]);

addPersonal("amelia", "GCSE focus", "Recall and review", [
  "Test yourself without notes",
  "Teach a difficult idea aloud",
  "Make five strong flashcards",
]);
addPersonal("amelia", "Creative", "Try something different", [
  "Learn a new craft technique",
  "Design something digitally",
  "Turn an ordinary object into something interesting",
]);
addPersonal("amelia", "Reading and writing", "Express an idea", [
  "Write a thoughtful journal page",
  "Review a book, film or place",
  "Create a short piece inspired by a photograph",
]);
addPersonal(
  "amelia",
  "Movement and outdoors",
  "Fresh air",
  [
    "Explore a new footpath",
    "Take photographs on a walk",
    "Walk while listening to music or a podcast",
  ],
  20,
  "active",
);
addPersonal("amelia", "Spanish", "Culture and listening", [
  "Find a Spanish recipe, place or tradition",
  "Watch a short Spanish-language clip",
  "Build a playlist of Spanish-language music",
]);
addPersonal("amelia", "Independence", "Plan ahead", [
  "Organise something for next week",
  "Research a future purchase or trip",
  "Learn one useful household skill",
]);
addPersonal("amelia", "Reset and connect", "Screen-free choice", [
  "Read, craft or make something for half an hour",
  "Do something downstairs with the family",
  "Choose a job, finish it and enjoy the result",
]);
addPersonal("amelia", "GCSE focus", "Subject rotation", [
  "Choose the subject not studied recently",
  "Revisit a mock-paper weakness",
  "Improve one grade-8 answer towards grade 9",
]);

addPersonal("david", "Languages", "Language in use", [
  "Label useful things in French",
  "Translate signs, menus or packaging",
  "Have a tiny spoken French exchange",
]);
addPersonal("david", "Words and learning", "Curiosity", [
  "Follow one interesting question",
  "Read a chapter of non-fiction",
  "Make notes on something worth remembering",
]);
addPersonal(
  "david",
  "Movement",
  "Outdoors",
  [
    "Walk a new footpath",
    "Ride somewhere without a destination",
    "Combine exercise with an errand",
  ],
  20,
  "active",
);
addPersonal("david", "Nature", "Grow and collect", [
  "Press or photograph a specimen",
  "Propagate a plant",
  "Start or improve a labelled collection",
]);
addPersonal("david", "Land and home", "Maintain", [
  "Inspect something before it becomes a problem",
  "Complete a small outdoor repair",
  "Improve one practical system",
]);
addPersonal("david", "Making", "Experiment", [
  "Try resin, clay or salt dough",
  "Take something apart to understand it",
  "Prototype an idea using scrap materials",
]);
addPersonal("david", "Food", "Find and try", [
  "Visit a shop for an unfamiliar ingredient",
  "Learn one French cooking term or technique",
  "Make something Hunter can help with",
]);
addPersonal("david", "Family", "Record and remember", [
  "Add a proper scrapbook memory",
  "Interview someone about the day",
  "Photograph an ordinary family moment well",
]);

addPersonal("lydia", "PhD", "Review and decide", [
  "Read one section as an examiner might",
  "Resolve one decision instead of postponing it",
  "Separate essential finishing work from optional polishing",
]);
addPersonal(
  "lydia",
  "Movement",
  "Restore",
  [
    "Choose a short restorative yoga practice",
    "Walk without turning it into an errand",
    "Move gently while listening to something enjoyable",
  ],
  20,
  "active",
);
addPersonal("lydia", "Garden and outdoors", "Tend and notice", [
  "Notice what has changed in the garden",
  "Tend one small area",
  "Choose something to grow or improve",
]);
addPersonal("lydia", "Creative", "Play without an outcome", [
  "Experiment with a material",
  "Arrange or photograph something beautiful",
  "Return to an unfinished creative idea",
]);
addPersonal("lydia", "Reading and learning", "Follow curiosity", [
  "Read about something chosen at random",
  "Listen to an interview or lecture",
  "Save and summarise one interesting idea",
]);
addPersonal("lydia", "Home", "Make a space nicer", [
  "Improve one visible corner",
  "Remove or relocate five unnecessary things",
  "Do a small job with an immediate payoff",
]);
addPersonal("lydia", "Wellbeing and family", "Enjoyable time", [
  "Choose something purely because it sounds pleasant",
  "Share a drink, walk or programme with someone",
  "Plan one thing to look forward to",
]);
addPersonal("lydia", "Garden and outdoors", "Gentle project", [
  "Plan a small planting idea",
  "Photograph the garden through the season",
  "Do ten minutes, then freely decide whether to stop",
]);

const expandedHunterStart = learningSeed.length;
addLearning("English", "Spelling", [
  ["Sort words into spelling patterns", 10],
  ["Make a word ladder", 10],
  ["Find and practise homophones", 10],
]);
addLearning("English", "Reading", [
  ["Choose and read some non-fiction", 20],
  ["Find three clues about a character", 10],
  ["Read with different voices", 10, "indoors", "together", "active"],
]);
addLearning("English", "Writing", [
  ["Write a six-sentence adventure", 20],
  ["Caption a sequence of photographs", 10],
  ["Invent an advert for an ordinary object", 10],
]);
addLearning("English", "Vocabulary", [
  ["Create a word-of-the-day poster", 10],
  ["Find synonyms for five everyday words", 10],
  ["Play a category word race", 5, "indoors", "together", "active"],
]);
addLearning("Maths", "Number", [
  ["Create and solve a number puzzle", 10],
  ["Practise counting in 2s, 5s and 10s", 10],
  ["Estimate a collection then count it", 10],
]);
addLearning("Maths", "Fractions", [
  ["Design a fraction pizza", 10],
  ["Compare halves, quarters and thirds", 10],
  ["Make a fraction matching game", 20],
]);
addLearning("Maths", "Shape and measure", [
  ["Build the tallest paper tower", 20, "indoors", "together", "active"],
  ["Time three household activities", 10],
  ["Find lines of symmetry", 10],
]);
addLearning("Maths", "Money", [
  ["Run a pretend shop", 20, "indoors", "together", "active"],
  ["Work out change from £1 and £5", 10],
  ["Compare a UK and French price", 10],
]);
addLearning("Science", "Plants", [
  ["Make a leaf identification page", 20, "outdoors"],
  ["Test what a plant needs", 20, "either", "together", "messy"],
]);
addLearning("Science", "Animals", [
  ["Make a simple habitat survey", 20, "outdoors", "together", "active"],
  ["Group animals by their features", 10],
  ["Invent a creature suited to a habitat", 20],
]);
addLearning("Science", "Human body", [
  [
    "Test balance with eyes open and closed",
    10,
    "either",
    "together",
    "active",
  ],
  ["Measure and compare reaction times", 10, "indoors", "together", "active"],
]);
addLearning("Science", "Materials and forces", [
  ["Test which paper bridge is strongest", 20, "indoors", "together", "active"],
  ["Make a waterproofing investigation", 20, "outdoors", "together", "messy"],
  ["Explore shadows with a torch", 10],
]);
addLearning("The world", "Geography", [
  ["Make a compass-direction challenge", 10, "outdoors", "together", "active"],
  ["Compare two places using photographs", 10],
  ["Create a treasure map", 20],
]);
addLearning("The world", "Geology", [
  ["Sort rocks by visible properties", 10, "outdoors"],
  ["Model layers of the Earth", 20, "indoors", "together", "messy"],
]);
addLearning("The world", "History", [
  ["Make a timeline of five events", 20],
  ["Investigate one historical object", 10],
  ["Imagine a diary entry from Roman Britain", 20],
]);
addLearning("The world", "French", [
  ["Make a French picture dictionary", 20],
  ["Play a French word treasure hunt", 10, "either", "together", "active"],
  ["Learn a short French rhyme", 10],
]);
addLearning("Practical and creative", "Cooking", [
  ["Design a healthy snack", 10],
  ["Compare tastes and textures", 10, "indoors", "together", "messy"],
  ["Learn one safe kitchen skill", 10, "indoors", "together"],
]);
addLearning("Practical and creative", "Making", [
  ["Build a bridge from scrap materials", 20, "indoors", "together", "messy"],
  [
    "Create a collage from found textures",
    20,
    "either",
    "independent",
    "messy",
  ],
]);
addLearning("Practical and creative", "Life skills", [
  ["Learn to fold and put away clothes", 10],
  ["Make a checklist for leaving the house", 10],
  ["Learn one basic first-aid fact", 10, "indoors", "together"],
]);
addLearning("Practical and creative", "Technology", [
  ["Take photographs that show a process", 10, "either", "independent"],
  ["Make a simple stop-motion sequence", 20],
  [
    "Give precise instructions to a human robot",
    10,
    "indoors",
    "together",
    "active",
  ],
]);
const expandedHunterSeed = learningSeed.slice(expandedHunterStart);
const twinklIdeasStart = learningSeed.length;
addLearning("English", "Reading", [
  ["Read a short text and make a film-style review", 20],
  ["Create five comprehension questions", 10],
  ["Match a sentence to the best summary", 10],
]);
addLearning("English", "Writing", [
  ["Rewrite sentences from present to past tense", 10],
  ["Build new words with prefixes and suffixes", 10],
  ["Write a summer postcard from an imaginary place", 20],
]);
addLearning("Maths", "Number", [
  ["Solve a summer code-breaker", 20],
  ["Make a colour-by-number calculation puzzle", 20],
  ["Create a number maze for someone else", 20],
]);
addLearning("Maths", "Shape and measure", [
  ["Run a potions measuring challenge", 20, "indoors", "together", "messy"],
  ["Make a shape mosaic", 20],
  ["Design a dot-to-dot using numbered points", 20],
]);
addLearning("Science", "Materials and forces", [
  ["Make and investigate silly putty", 20, "indoors", "together", "messy"],
  ["Create a tornado in a jar", 20, "indoors", "together", "messy"],
  ["Make a simple lava lamp", 20, "indoors", "together", "messy"],
  ["Test materials for a useful purpose", 20, "either", "together", "messy"],
]);
addLearning("Science", "Animals", [
  ["Design a healthy meal for a human", 20],
  ["Match living things to their habitats", 10],
  ["Make a food-chain strip", 20],
]);
addLearning("Practical and creative", "Making", [
  ["Make a summer maths mosaic", 20, "indoors", "independent", "messy"],
  ["Design a floating-boat challenge certificate", 10],
  ["Create a reflection page about something learned", 10],
]);
const twinklInspiredSeed = learningSeed.slice(twinklIdeasStart);
const adultLearningSeed = learningSeed.slice(
  adultLibraryStart,
  expandedHunterStart,
);
const expandedArea = (item) => {
  if ((item.person || "hunter") !== "hunter") return item;
  if (["Plants", "Animals"].includes(item.subject))
    return { ...item, area: "Nature and outdoors" };
  if (["Geography", "History", "Geology"].includes(item.subject))
    return { ...item, area: "Geography and history" };
  if (item.subject === "French") return { ...item, area: "French and France" };
  if (["Cooking", "Life skills"].includes(item.subject))
    return { ...item, area: "Practical skills" };
  if (["Making", "Technology"].includes(item.subject))
    return { ...item, area: "Creative and technology" };
  return item;
};
for (let i = 0; i < learningSeed.length; i++)
  learningSeed[i] = expandedArea(learningSeed[i]);

seed.learningActivities = learningSeed;
seed.wheelLibraryVersion = 4;
seed.wheelHistory = {};

let data = structuredClone(seed),
  currentPerson = "hunter",
  manageType = "tasks",
  pendingTaskId = null,
  learningPath = [],
  learningPendingChoice = null,
  learningSpinning = false,
  outingSpinning = false,
  lastOutingId = null,
  unsubscribe = null,
  ready = false;

async function save() {
  if (ready) await setDoc(stateRef, data);
}
async function startData() {
  const snap = await getDoc(stateRef);
  if (!snap.exists()) await setDoc(stateRef, seed);
  else if ((snap.data().wheelLibraryVersion || 0) < 4) {
    const version = snap.data().wheelLibraryVersion || 0;
    let activities = (snap.data().learningActivities || []).map((item) => ({
      ...item,
      person: item.person || "hunter",
    }));
    if (version < 2) activities.push(...adultLearningSeed);
    if (version < 3) activities.push(...expandedHunterSeed);
    if (version < 4) activities.push(...twinklInspiredSeed);
    activities = activities.map(expandedArea);
    await setDoc(
      stateRef,
      {
        learningActivities: activities,
        learningSelections: snap.data().learningSelections || [],
        wheelHistory: snap.data().wheelHistory || {},
        wheelLibraryVersion: 4,
      },
      { merge: true },
    );
  }
  unsubscribe?.();
  unsubscribe = onSnapshot(stateRef, (s) => {
    if (s.exists()) {
      data = s.data();
      ready = true;
      renderAll();
    }
  });
}
function completed(id) {
  return data.completions.some((x) => x.taskId === id && x.date === todayKey());
}
function initUI() {
  $("#todayDate").textContent = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  bind();
}
function bind() {
  $$(".bottom-nav button").forEach(
    (b) => (b.onclick = () => showPage(b.dataset.page)),
  );
  $("#settingsButton").onclick = () => showPage("manage");
  $("#signOutButton").onclick = () => signOut(auth);
  $("#personSelect").onchange = (e) => {
    currentPerson = e.target.value;
    learningPath = [];
    learningPendingChoice = null;
    learningSpinning = false;
    if ($("#learningDialog").open) $("#learningDialog").close();
    $("#learningResult").innerHTML = "";
    $("#activityDetail").innerHTML = "";
    renderToday();
  };
  $("#changePlan").onclick = () => {
    $("#planInput").value = data.plans[currentPerson] || "";
    $("#planDialog").showModal();
  };
  $("#savePlan").onclick = () => {
    data.plans[currentPerson] = $("#planInput").value;
    save();
  };
  $("#quickMemory").onclick = $("#addMemory").onclick = () =>
    $("#memoryDialog").showModal();
  $("#cancelMemory").onclick = () => $("#memoryDialog").close();
  $("#memoryForm").onsubmit = addMemory;
  $("#choiceForm").onsubmit = saveTaskChoice;
  $("#cancelChoice").onclick = () => {
    pendingTaskId = null;
    $("#choiceDialog").close();
    renderToday();
  };
  ["location", "weather", "time", "cost"].forEach(
    (x) => ($(`#${x}Filter`).onchange = renderOutings),
  );
  $("#spinButton").onclick = spin;
  $("#wheel").onclick = spin;
  $("#learningSpin").onclick = spinLearning;
  $("#learningWheel").onclick = () => {
    if (!learningPendingChoice) spinLearning();
  };
  $("#learningWheel").onkeydown = (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      !learningPendingChoice
    ) {
      event.preventDefault();
      spinLearning();
    }
  };
  $("#learningBack").onclick = () => {
    learningPendingChoice = null;
    learningPath.pop();
    renderLearningWheel();
  };
  $("#learningRestart").onclick = () => {
    learningPendingChoice = null;
    learningPath = [];
    renderLearningWheel();
  };
  $("#learningRespin").onclick = () => {
    learningPendingChoice = null;
    renderLearningWheel();
  };
  ["learnTime", "learnPlace", "learnSupport", "learnEnergy"].forEach(
    (id) =>
      ($(`#${id}`).onchange = () => {
        learningPendingChoice = null;
        learningPath = [];
        renderLearningWheel();
      }),
  );
  $$(".manage-tabs button").forEach(
    (b) =>
      (b.onclick = () => {
        manageType = b.dataset.manage;
        $$(".manage-tabs button").forEach((x) =>
          x.classList.toggle("active", x === b),
        );
        renderManage();
      }),
  );
  $("#addRow").onclick = addRow;
  $("#resetData").onclick = () => {
    if (confirm("Reset all tasks, outings, points and memories?")) {
      data = structuredClone(seed);
      save();
    }
  };
  $("#loginForm").onsubmit = async (e) => {
    e.preventDefault();
    $("#loginError").textContent = "";
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(
        auth,
        $("#loginEmail").value.includes("@")
          ? $("#loginEmail").value.trim()
          : `${$("#loginEmail").value.trim().toLowerCase()}@our-days.family`,
        $("#loginPassword").value,
      );
    } catch {
      $("#loginError").textContent = "The email or password was not accepted.";
    }
  };
}
function showPage(id) {
  $$(".page").forEach((p) => p.classList.toggle("active", p.id === id));
  $$(".bottom-nav button").forEach((b) =>
    b.classList.toggle("active", b.dataset.page === id),
  );
  if (id === "manage") renderManage();
  window.scrollTo(0, 0);
}
function renderAll() {
  const selected = $("#personSelect").value || currentPerson;
  $("#personSelect").innerHTML = data.people
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join("");
  currentPerson = data.people.some((p) => p.id === selected)
    ? selected
    : "hunter";
  $("#personSelect").value = currentPerson;
  renderToday();
  renderOutings();
  renderProgress();
  renderMemories();
  renderManage();
}
function renderToday() {
  const groups = {};
  data.tasks
    .filter(
      (t) =>
        t.person === currentPerson &&
        t.active &&
        !(currentPerson === "hunter" && t.category === "Schoolwork"),
    )
    .forEach((t) => (groups[t.category] ??= []).push(t));
  $("#planText").textContent = data.plans[currentPerson] || "";
  renderLearningToday();
  $("#taskGroups").innerHTML = Object.entries(groups)
    .map(
      ([g, ts]) =>
        `<section class="task-section"><h3>${esc(g)}</h3><div class="task-grid">${ts
          .map((t) => {
            const completion = data.completions.find(
              (x) => x.taskId === t.id && x.date === todayKey(),
            );
            return `<label class="task ${completion ? "done" : ""}"><input type="checkbox" data-task="${t.id}" ${completion ? "checked" : ""}><span class="task-copy"><span>${esc(t.name)}</span>${completion?.choice ? `<small>${esc(completion.choice)}</small>` : t.choices?.length ? `<small>Choose when completed</small>` : ""}</span>${t.points ? `<span class="points">+${t.points}</span>` : ""}</label>`;
          })
          .join("")}</div></section>`,
    )
    .join("");
  $$("[data-task]").forEach(
    (c) => (c.onchange = () => toggleTask(c.dataset.task, c.checked)),
  );
}
const wheelProfiles = {
  hunter: {
    title: "Today's learning",
    button: "Spin the learning wheel",
    eyebrow: "HUNTER'S LEARNING WHEEL",
    tagline: "Area → subject → activity",
  },
  amelia: {
    title: "Choose something for today",
    button: "Spin Amelia's wheel",
    eyebrow: "AMELIA'S CHOICE WHEEL",
    tagline: "Area → direction → activity",
  },
  david: {
    title: "What shall I do?",
    button: "Spin David's wheel",
    eyebrow: "DAVID'S ACTIVITY WHEEL",
    tagline: "Area → direction → activity",
  },
  lydia: {
    title: "An optional nudge",
    button: "Spin Lydia's wheel",
    eyebrow: "LYDIA'S CHOICE WHEEL",
    tagline: "Area → direction → activity",
  },
};
function todayLearningSelection() {
  return (data.learningSelections || []).find(
    (item) => item.person === currentPerson && item.date === todayKey(),
  );
}
function renderLearningToday() {
  const host = $("#learningToday"),
    profile = wheelProfiles[currentPerson],
    selection = todayLearningSelection(),
    activity =
      selection &&
      data.learningActivities.find((item) => item.id === selection.activityId),
    taskId = `wheel-${currentPerson}-${todayKey()}`,
    done = completed(taskId);
  host.innerHTML = `<section class="task-section learning-today"><div class="learning-title"><h3>${profile.title}</h3><button class="text-link" id="chooseLearning">${activity ? "Choose again" : profile.button}</button></div>${activity ? `<label class="task ${done ? "done" : ""}"><input type="checkbox" id="learningComplete" ${done ? "checked" : ""}><span class="task-copy"><span>${esc(activity.name)}</span><small>${esc(activity.area)} · ${esc(activity.subject)} · ${activity.minutes} minutes</small></span><span class="points">+5</span></label>` : `<button class="learning-launch" id="learningLaunch"><span class="mini-wheel" aria-hidden="true"></span><span class="launch-copy"><strong>${profile.button}</strong><span>${profile.tagline}</span></span></button>`}</section>`;
  const open = () => openLearningWheel();
  $("#chooseLearning").onclick = open;
  if ($("#learningLaunch")) $("#learningLaunch").onclick = open;
  if ($("#learningComplete"))
    $("#learningComplete").onchange = (event) =>
      toggleLearningComplete(event.target.checked);
}
function toggleLearningComplete(on) {
  const taskId = `wheel-${currentPerson}-${todayKey()}`;
  data.completions = data.completions.filter(
    (item) => !(item.taskId === taskId && item.date === todayKey()),
  );
  if (on)
    data.completions.push({
      taskId,
      person: currentPerson,
      date: todayKey(),
      points: 5,
      choice: todayLearningSelection()?.activityId || "",
    });
  save();
}
function openLearningWheel() {
  learningPath = [];
  learningPendingChoice = null;
  $("#learningResult").innerHTML = "";
  $("#activityDetail").innerHTML = "";
  $("#learningFilterPanel").open = false;
  $("#learningDialog").showModal();
  $("#wheelEyebrow").textContent = wheelProfiles[currentPerson].eyebrow;
  renderLearningWheel();
}
function eligibleLearning() {
  const time = $("#learnTime").value,
    place = $("#learnPlace").value,
    support = $("#learnSupport").value,
    energy = $("#learnEnergy").value;
  return (data.learningActivities || []).filter(
    (item) =>
      item.active &&
      (item.person || "hunter") === currentPerson &&
      (time === "any" || item.minutes === +time) &&
      (place === "any" || item.place === "either" || item.place === place) &&
      (support === "any" ||
        item.support === "either" ||
        item.support === support) &&
      (energy === "any" || item.energy === energy),
  );
}
function learningOptions() {
  const activities = eligibleLearning();
  if (!learningPath.length)
    return [...new Set(activities.map((item) => item.area))];
  if (learningPath.length === 1)
    return [
      ...new Set(
        activities
          .filter((item) => item.area === learningPath[0])
          .map((item) => item.subject),
      ),
    ];
  return activities
    .filter(
      (item) =>
        item.area === learningPath[0] && item.subject === learningPath[1],
    )
    .map((item) => item.name);
}
function wheelSegments(options) {
  if (options.length < 2 || options.length > 4) return [...options];
  return Array.from(
    { length: Math.ceil(8 / options.length) },
    () => options,
  ).flat();
}
const wheelPalette = [
  "#176b5b",
  "#d3a33a",
  "#d96c55",
  "#3f6987",
  "#7d9f8e",
  "#75628f",
  "#b66b3c",
  "#3f8794",
];
function wheelColours(options) {
  const unique = [...new Set(options)];
  return new Map(
    unique.map((label, index) => [
      label,
      wheelPalette[index % wheelPalette.length],
    ]),
  );
}
function renderLearningWheel() {
  const options = learningOptions(),
    displayOptions = wheelSegments(options),
    wheel = $("#learningWheel"),
    stage = learningPath.length;
  learningPendingChoice = null;
  $("#learningStageTitle").textContent =
    [
      "First: choose the area",
      "Next: choose the subject",
      "Finally: choose the activity",
    ][stage] || "Chosen";
  $("#learningBreadcrumb").textContent = learningPath.join(" → ");
  $("#learningFilterPanel").hidden = stage > 0;
  $("#learningBack").hidden = stage === 0;
  $("#learningRestart").hidden = stage === 0;
  $("#learningSpin").disabled = !options.length || learningSpinning;
  $("#learningSpin").textContent = "Spin";
  $("#learningResult").hidden = true;
  $("#activityDetail").hidden = true;
  $("#learningRespin").hidden = true;
  $$("[data-learning-step]").forEach((step) => {
    const index = +step.dataset.learningStep;
    step.classList.toggle("active", index === stage);
    step.classList.toggle("done", index < stage);
  });
  const colours = wheelColours(options);
  const size = displayOptions.length ? 360 / displayOptions.length : 360;
  wheel.classList.toggle("dense", displayOptions.length >= 7);
  wheel.style.setProperty(
    "--wheel-radius",
    displayOptions.length >= 7 ? "min(29vw, 205px)" : "min(26vw, 180px)",
  );
  wheel.style.background = displayOptions.length
    ? `conic-gradient(${displayOptions.map((label, i) => `${colours.get(label)} ${i * size}deg ${(i + 1) * size}deg`).join(",")})`
    : "#d9ddd7";
  wheel.style.setProperty("--counter-rotation", "0deg");
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheel.innerHTML = displayOptions.length
    ? displayOptions
        .map((label, i) => {
          const angle = (i + 0.5) * size;
          return `<span class="wheel-option" style="--angle:${angle}deg">${esc(label)}</span>`;
        })
        .join("")
    : '<span class="wheel-empty">No matching activities</span>';
  void wheel.offsetWidth;
  wheel.style.transition = "";
}
function chooseWheelOption(options, stage) {
  data.wheelHistory ||= {};
  const key = [currentPerson, stage, ...learningPath].join("|");
  let history = (data.wheelHistory[key] || []).filter((value) =>
    options.includes(value),
  );
  let available = options.filter((value) => !history.includes(value));
  if (!available.length) {
    history = [];
    available = [...options];
  }
  const chosen = available[Math.floor(Math.random() * available.length)];
  data.wheelHistory[key] = [...history, chosen];
  return chosen;
}
function activityForPath(name) {
  return data.learningActivities.find(
    (item) =>
      (item.person || "hunter") === currentPerson &&
      item.active &&
      item.area === learningPath[0] &&
      item.subject === learningPath[1] &&
      item.name === name,
  );
}
function activityInstructions(activity) {
  const name = activity.name,
    minutes = activity.minutes;
  let what = `Spend about ${minutes} minutes on “${name}”. Keep it small enough to begin immediately.`;
  let needs =
    "Use whatever you would normally need; improvise with what is already available.";
  let finished = "Finish by showing, explaining or recording what you did.";
  if (/foil boat/i.test(name)) {
    what =
      "Make a boat from one sheet of foil. Predict how many coins it will hold, test it, then improve the design and try again.";
    needs = "A sheet of foil, coins and a bowl or sink of water.";
    finished = "Record the totals for both designs.";
  } else if (/bubble/i.test(name)) {
    what =
      "Mix a small bubble solution, test it, then change one thing and compare the bubbles.";
    needs = "Water, washing-up liquid, a container and a bubble wand or loop.";
    finished = "Say which mixture worked better and why you think it did.";
  } else if (/tornado in a jar/i.test(name)) {
    what =
      "Fill a clear jar mostly with water, add a small drop of washing-up liquid, close it tightly and swirl it to form a vortex. Observe how the water moves.";
    needs =
      "A clear jar with a secure lid, water and washing-up liquid; glitter is optional.";
    finished = "Describe what makes the vortex appear and how long it lasts.";
  } else if (/lava lamp/i.test(name)) {
    what =
      "With an adult, combine coloured water and oil in a clear container, then add part of an effervescent tablet and observe the moving bubbles.";
    needs =
      "A clear container, water, cooking oil, food colouring and an effervescent tablet.";
    finished = "Explain why the oil and water remain in separate layers.";
  } else if (/silly putty/i.test(name)) {
    what =
      "With an adult, follow a child-safe putty or cornflour-mixture recipe. Change the proportions slightly and compare the texture.";
    needs =
      "A washable work surface and ingredients from the chosen child-safe recipe.";
    finished =
      "Describe how the mixture behaves when squeezed, stretched or left alone.";
  } else if (/potions measuring/i.test(name)) {
    what =
      "Set several target volumes, then measure coloured water accurately into different containers. Combine amounts and predict the new total.";
    needs =
      "Measuring jugs or cups, water, containers and optional food colouring.";
    finished =
      "Hit at least three target measurements and check the combined totals.";
  } else if (/spelling test/i.test(name)) {
    what =
      "Choose a short set of useful or tricky words. Read each aloud, write it from memory, then correct mistakes in a different colour.";
    needs = "Paper, pencil and a short word list.";
    finished = "Practise every word that was initially incorrect.";
  } else if (/bird watch/i.test(name)) {
    what =
      "Watch quietly for five minutes. Count the birds and identify as many as possible by shape, colour or call.";
    needs = "A window or outdoor spot; optionally binoculars or a bird guide.";
    finished = "Record at least three observations.";
  } else if (/revision block/i.test(name)) {
    what =
      "Choose one GCSE subject and one precise topic. Work without the phone until the timer ends, producing something you can review later.";
    needs = "The relevant book, notes or revision site and a timer.";
    finished =
      "Produce a page of notes, completed questions or reviewed flashcards.";
  } else if (/exam question/i.test(name)) {
    what =
      "Choose one suitable past-paper question, answer it under sensible time pressure, then check it against the mark scheme.";
    needs = "A question, paper or document, timer and mark scheme.";
    finished = "Identify one specific improvement for the next answer.";
  } else if (/PhD/i.test(name)) {
    what = `Define one small, concrete result that can be completed in about ${minutes} minutes, then work only on that result.`;
    needs = "The relevant document, notes or reference manager.";
    finished = "Leave a clear note stating the next action.";
  } else if (/recipe|cook|bake|meal|snack/i.test(name)) {
    what = `Choose a manageable food task and complete as much as is sensible in about ${minutes} minutes.`;
    needs = "A recipe if useful, ingredients and normal kitchen equipment.";
    finished =
      "Food is prepared, or the recipe and ingredients are ready for the next step.";
  } else if (/photograph|photographs/i.test(name)) {
    what =
      "Take a small, purposeful set of photographs that tells a story or records useful details.";
    needs = "A phone or camera.";
    finished = "Choose the best images and add captions or a scrapbook note.";
  }
  return { what, needs, finished };
}
function showActivityDetail(activity) {
  const detail = activityInstructions(activity),
    panel = $("#activityDetail");
  panel.innerHTML = `<h4>${esc(activity.name)}</h4><p class="detail-meta">${activity.minutes} minutes · ${esc(activity.place)} · ${activity.support === "together" ? "with someone" : esc(activity.support)} · ${esc(activity.energy)}</p><dl><div><dt>What to do</dt><dd>${esc(detail.what)}</dd></div><div><dt>What you need</dt><dd>${esc(detail.needs)}</dd></div><div><dt>Finished when</dt><dd>${esc(detail.finished)}</dd></div></dl>`;
  panel.hidden = false;
}
function spinLearning() {
  if (learningSpinning) return;
  if (learningPendingChoice) {
    learningPath.push(learningPendingChoice);
    learningPendingChoice = null;
    if (learningPath.length === 3) selectLearningActivity();
    else renderLearningWheel();
    return;
  }
  const options = learningOptions();
  if (!options.length) return;
  learningSpinning = true;
  $("#learningSpin").disabled = true;
  $("#learningSpin").textContent = "Spinning…";
  $("#learningResult").hidden = true;
  const chosen = chooseWheelOption(options, learningPath.length),
    displayOptions = wheelSegments(options),
    matchingIndices = displayOptions
      .map((value, index) => (value === chosen ? index : -1))
      .filter((index) => index >= 0),
    chosenIndex =
      matchingIndices[Math.floor(Math.random() * matchingIndices.length)],
    segment = 360 / displayOptions.length,
    target = 2880 - (chosenIndex + 0.5) * segment,
    wheel = $("#learningWheel"),
    stage = learningPath.length;
  wheel.style.setProperty("--counter-rotation", "0deg");
  wheel.style.transform = `rotate(${target}deg)`;
  setTimeout(() => {
    learningSpinning = false;
    learningPendingChoice = chosen;
    const result = $("#learningResult");
    result.textContent = `The wheel chose: ${chosen}`;
    result.hidden = false;
    if (stage === 2) {
      const activity = activityForPath(chosen);
      if (activity) showActivityDetail(activity);
      $("#learningRespin").hidden = false;
    }
    $("#learningSpin").textContent =
      stage === 0
        ? "Continue to subject"
        : stage === 1
          ? "Continue to activity"
          : "Use this activity";
    $("#learningSpin").disabled = false;
  }, 7800);
}
function selectLearningActivity() {
  const [area, subject, name] = learningPath,
    activity = data.learningActivities.find(
      (item) =>
        (item.person || "hunter") === currentPerson &&
        item.active &&
        item.area === area &&
        item.subject === subject &&
        item.name === name,
    );
  if (!activity) return;
  data.learningSelections = (data.learningSelections || []).filter(
    (item) => !(item.person === currentPerson && item.date === todayKey()),
  );
  data.learningSelections.push({
    person: currentPerson,
    date: todayKey(),
    activityId: activity.id,
  });
  data.completions = data.completions.filter(
    (item) =>
      !(
        item.taskId === `wheel-${currentPerson}-${todayKey()}` &&
        item.date === todayKey()
      ),
  );
  save();
  $("#learningDialog").close();
}
function toggleTask(id, on) {
  data.completions = data.completions.filter(
    (x) => !(x.taskId === id && x.date === todayKey()),
  );
  if (!on) return save();
  const task = data.tasks.find((x) => x.id === id);
  if (task.choices?.length) {
    pendingTaskId = id;
    $("#choiceTitle").textContent = task.name;
    $("#taskChoice").innerHTML = task.choices
      .map((choice) => `<option value="${esc(choice)}">${esc(choice)}</option>`)
      .join("");
    $("#choiceDialog").showModal();
    return;
  }
  completeTask(task);
}
function completeTask(task, choice = "") {
  data.completions.push({
    taskId: task.id,
    person: task.person,
    date: todayKey(),
    points: task.points,
    choice,
  });
  save();
}
function saveTaskChoice(event) {
  event.preventDefault();
  const task = data.tasks.find((x) => x.id === pendingTaskId);
  if (task) completeTask(task, $("#taskChoice").value);
  pendingTaskId = null;
  $("#choiceDialog").close();
}
function eligible(o) {
  const loc = $("#locationFilter").value,
    w = $("#weatherFilter").value,
    t = $("#timeFilter").value,
    c = $("#costFilter").value;
  return (
    o.active &&
    o.location === loc &&
    (w === "either" || o.weather === "either" || o.weather === w) &&
    (t === "any" || o.time === t) &&
    (c === "any" || o.cost === c)
  );
}
function renderOutings() {
  const options = data.outings.filter(eligible),
    displayOptions = wheelSegments(options.map((item) => item.name)),
    wheel = $("#wheel"),
    colours = wheelColours(options.map((item) => item.name)),
    size = displayOptions.length ? 360 / displayOptions.length : 360;
  wheel.classList.toggle("dense", displayOptions.length >= 7);
  wheel.style.setProperty(
    "--wheel-radius",
    displayOptions.length >= 7 ? "min(31vw, 205px)" : "min(27vw, 180px)",
  );
  wheel.style.setProperty("--counter-rotation", "0deg");
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  wheel.style.background = displayOptions.length
    ? `conic-gradient(${displayOptions.map((label, i) => `${colours.get(label)} ${i * size}deg ${(i + 1) * size}deg`).join(",")})`
    : "#d9ddd7";
  wheel.innerHTML = displayOptions.length
    ? displayOptions
        .map(
          (label, i) =>
            `<span class="wheel-option" style="--angle:${(i + 0.5) * size}deg">${esc(label)}</span>`,
        )
        .join("")
    : '<span class="wheel-empty">No matching outings</span>';
  void wheel.offsetWidth;
  wheel.style.transition = "";
  $("#spinButton").disabled = !options.length || outingSpinning;
  $("#spinButton").textContent = "Spin the wheel";
  $("#outingResult").hidden = true;
}
function spin() {
  const options = data.outings.filter(eligible);
  if (!options.length || outingSpinning) return;
  const available =
      options.length > 1
        ? options.filter((item) => item.id !== lastOutingId)
        : options,
    choice = available[Math.floor(Math.random() * available.length)],
    displayOptions = wheelSegments(options.map((item) => item.name)),
    indices = displayOptions
      .map((name, index) => (name === choice.name ? index : -1))
      .filter((index) => index >= 0),
    chosenIndex = indices[Math.floor(Math.random() * indices.length)],
    segment = 360 / displayOptions.length,
    target = 2880 - (chosenIndex + 0.5) * segment,
    wheel = $("#wheel");
  outingSpinning = true;
  lastOutingId = choice.id;
  $("#spinButton").disabled = true;
  $("#spinButton").textContent = "Spinning…";
  $("#outingResult").hidden = true;
  wheel.style.setProperty("--counter-rotation", "0deg");
  wheel.style.transform = `rotate(${target}deg)`;
  setTimeout(() => {
    outingSpinning = false;
    const result = $("#outingResult");
    result.innerHTML = `<strong>${esc(choice.name)}</strong><br><span>${esc(choice.time)} · ${esc(choice.weather)} weather · ${esc(choice.cost)}</span>`;
    result.hidden = false;
    $("#spinButton").disabled = false;
    $("#spinButton").textContent = "Spin again";
  }, 7800);
}
function renderProgress() {
  const totals = Object.fromEntries(
    data.people.map((p) => [
      p.id,
      data.completions
        .filter((c) => c.person === p.id)
        .reduce((s, c) => s + c.points, 0),
    ]),
  );
  $("#progressCards").innerHTML = data.people
    .map((p) => {
      const pts = totals[p.id],
        next = Math.ceil((pts + 1) / 100) * 100 || 100,
        cash = Math.floor(pts / 100) * 5;
      return `<article class="progress-card"><div class="avatar" style="background:${p.colour}">${p.name[0]}</div><h3>${p.name}</h3><strong>${pts} points</strong><div class="progress-track"><div class="progress-fill" style="width:${pts % 100}%"></div></div><p class="muted">${next - pts} to the next £5 · £${cash} unlocked</p></article>`;
    })
    .join("");
}
async function compress(file) {
  const image = await createImageBitmap(file),
    scale = Math.min(1, 1800 / Math.max(image.width, image.height)),
    canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
}
async function addMemory(e) {
  e.preventDefault();
  const title = $("#memoryTitle").value.trim();
  if (!title) return;
  const button = $("#saveMemory"),
    file = $("#memoryPhoto").files[0];
  button.textContent = "Saving…";
  button.disabled = true;
  try {
    let photoPath = "";
    if (file) {
      const blob = await compress(file);
      photoPath = `memories/${crypto.randomUUID()}.jpg`;
      await uploadBytes(ref(storage, photoPath), blob, {
        contentType: "image/jpeg",
      });
    }
    data.memories.unshift({
      id: crypto.randomUUID(),
      title,
      text: $("#memoryText").value,
      date: todayKey(),
      photoPath,
    });
    await save();
    $("#memoryForm").reset();
    $("#memoryDialog").close();
  } catch (err) {
    alert(`The memory could not be saved: ${err.message}`);
  } finally {
    button.textContent = "Add memory";
    button.disabled = false;
  }
}
function renderMemories() {
  const el = $("#memoryList");
  if (!data.memories.length) {
    el.innerHTML =
      '<div class="empty">Your Summer 2026 memories will appear here.<br>Add ordinary moments as well as big days out.</div>';
    return;
  }
  el.innerHTML = data.memories
    .map(
      (m) =>
        `<article class="memory-card">${m.photoPath ? `<img data-photo="${m.photoPath}" alt="">` : ""}<div class="memory-body"><p class="memory-date">${new Date(m.date + "T12:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p><h3>${m.title}</h3><p>${m.text || ""}</p></div></article>`,
    )
    .join("");
  $$("[data-photo]").forEach(async (img) => {
    try {
      img.src = await getDownloadURL(ref(storage, img.dataset.photo));
    } catch {
      img.alt = "Photo unavailable";
    }
  });
}
function options(values, current) {
  return values
    .map(
      ([value, label]) =>
        `<option value="${value}" ${current === value ? "selected" : ""}>${label}</option>`,
    )
    .join("");
}
function renderManage() {
  if (manageType === "learningActivities") {
    renderLearningManage();
    return;
  }
  const items = data[manageType],
    isTask = manageType === "tasks";
  $("#manageTable").innerHTML =
    `<div class="table-wrap"><table class="manage-table"><thead><tr><th>Order</th><th>Name</th>${isTask ? "<th>Person</th><th>Section</th><th>Type</th><th>Frequency</th><th>Choices</th><th>Points</th>" : "<th>Location</th><th>Weather</th><th>Time</th>"}<th>Active</th><th></th></tr></thead><tbody>${items
      .map(
        (x, i) =>
          `<tr><td class="row-actions"><button data-move="up" data-i="${i}" aria-label="Move up" ${i === 0 ? "disabled" : ""}>↑</button><button data-move="down" data-i="${i}" aria-label="Move down" ${i === items.length - 1 ? "disabled" : ""}>↓</button></td><td><input data-field="name" data-i="${i}" value="${esc(x.name)}"></td>${
            isTask
              ? `<td><select data-field="person" data-i="${i}">${data.people.map((p) => `<option value="${p.id}" ${x.person === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></td><td><input data-field="category" data-i="${i}" value="${esc(x.category)}"></td><td><select data-field="kind" data-i="${i}">${options(
                  [
                    ["required", "Required"],
                    ["optional", "Optional"],
                    ["bonus", "Bonus"],
                  ],
                  x.kind || "optional",
                )}</select></td><td><select data-field="frequency" data-i="${i}">${options(
                  [
                    ["daily", "Daily"],
                    ["weekdays", "Weekdays"],
                    ["weekly", "Weekly"],
                    ["anytime", "Any time"],
                  ],
                  x.frequency || "daily",
                )}</select></td><td><input data-field="choices" data-i="${i}" value="${esc((x.choices || []).join(", "))}" placeholder="Maths, English…"></td><td><input type="number" min="0" data-field="points" data-i="${i}" value="${x.points || 0}"></td>`
              : `<td><select data-field="location" data-i="${i}">${options(
                  [
                    ["england", "England"],
                    ["france", "France"],
                  ],
                  x.location,
                )}</select></td><td><select data-field="weather" data-i="${i}">${options(
                  [
                    ["either", "Either"],
                    ["dry", "Dry"],
                    ["wet", "Wet"],
                  ],
                  x.weather,
                )}</select></td><td><select data-field="time" data-i="${i}">${options(
                  [
                    ["short", "Short"],
                    ["half", "Half-day"],
                    ["full", "Full day"],
                  ],
                  x.time,
                )}</select></td>`
          }<td class="check-cell"><input type="checkbox" data-field="active" data-i="${i}" ${x.active ? "checked" : ""}></td><td><button class="delete-row" data-delete="${i}" aria-label="Delete ${esc(x.name)}">Delete</button></td></tr>`,
      )
      .join("")}</tbody></table></div>`;
  $$("#manageTable [data-field]").forEach(
    (el) =>
      (el.onchange = () => {
        const item = data[manageType][+el.dataset.i],
          f = el.dataset.field;
        item[f] =
          f === "choices"
            ? el.value
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean)
            : el.type === "checkbox"
              ? el.checked
              : el.type === "number"
                ? +el.value
                : el.value;
        save();
      }),
  );
  $$("#manageTable [data-move]").forEach(
    (button) =>
      (button.onclick = () =>
        moveRow(+button.dataset.i, button.dataset.move === "up" ? -1 : 1)),
  );
  $$("#manageTable [data-delete]").forEach(
    (button) => (button.onclick = () => deleteRow(+button.dataset.delete)),
  );
}
function renderLearningManage() {
  const items = data.learningActivities || [];
  $("#manageTable").innerHTML =
    `<p class="muted small">Each row is one possible final result. Areas and subjects automatically become the first two wheels.</p><div class="table-wrap"><table class="manage-table"><thead><tr><th>Order</th><th>Person</th><th>Area</th><th>Subject</th><th>Activity</th><th>Min</th><th>Place</th><th>Help</th><th>Style</th><th>Active</th><th></th></tr></thead><tbody>${items
      .map(
        (item, i) =>
          `<tr><td class="row-actions"><button data-move="up" data-i="${i}" ${i === 0 ? "disabled" : ""}>↑</button><button data-move="down" data-i="${i}" ${i === items.length - 1 ? "disabled" : ""}>↓</button></td><td><select data-field="person" data-i="${i}">${data.people.map((person) => `<option value="${person.id}" ${(item.person || "hunter") === person.id ? "selected" : ""}>${esc(person.name)}</option>`).join("")}</select></td><td><input data-field="area" data-i="${i}" value="${esc(item.area)}"></td><td><input data-field="subject" data-i="${i}" value="${esc(item.subject)}"></td><td><input data-field="name" data-i="${i}" value="${esc(item.name)}"></td><td><select data-field="minutes" data-i="${i}">${options(
            [
              [5, "5"],
              [10, "10"],
              [20, "20"],
            ],
            item.minutes,
          )}</select></td><td><select data-field="place" data-i="${i}">${options(
            [
              ["either", "Either"],
              ["indoors", "Indoors"],
              ["outdoors", "Outdoors"],
            ],
            item.place,
          )}</select></td><td><select data-field="support" data-i="${i}">${options(
            [
              ["either", "Either"],
              ["independent", "Independent"],
              ["together", "With someone"],
            ],
            item.support,
          )}</select></td><td><select data-field="energy" data-i="${i}">${options(
            [
              ["calm", "Calm"],
              ["active", "Active"],
              ["messy", "Messy"],
            ],
            item.energy,
          )}</select></td><td class="check-cell"><input type="checkbox" data-field="active" data-i="${i}" ${item.active ? "checked" : ""}></td><td><button class="delete-row" data-delete="${i}">Delete</button></td></tr>`,
      )
      .join("")}</tbody></table></div>`;
  $$("#manageTable [data-field]").forEach(
    (el) =>
      (el.onchange = () => {
        const item = data.learningActivities[+el.dataset.i],
          field = el.dataset.field;
        item[field] =
          field === "minutes"
            ? +el.value
            : el.type === "checkbox"
              ? el.checked
              : el.value;
        save();
      }),
  );
  $$("#manageTable [data-move]").forEach(
    (button) =>
      (button.onclick = () =>
        moveRow(+button.dataset.i, button.dataset.move === "up" ? -1 : 1)),
  );
  $$("#manageTable [data-delete]").forEach(
    (button) => (button.onclick = () => deleteRow(+button.dataset.delete)),
  );
}
function moveRow(index, direction) {
  const items = data[manageType],
    target = index + direction;
  if (target < 0 || target >= items.length) return;
  [items[index], items[target]] = [items[target], items[index]];
  save();
}
function deleteRow(index) {
  const item = data[manageType][index];
  if (confirm(`Delete “${item.name}”?`)) {
    data[manageType].splice(index, 1);
    save();
  }
}
function addRow() {
  if (manageType === "learningActivities")
    data.learningActivities.push({
      id: crypto.randomUUID(),
      area: "English",
      subject: "New subject",
      name: "New activity",
      minutes: 10,
      place: "indoors",
      support: "either",
      energy: "calm",
      active: true,
    });
  else if (manageType === "tasks")
    data.tasks.push({
      id: crypto.randomUUID(),
      name: "New task",
      person: currentPerson,
      category: "Other",
      kind: "optional",
      frequency: "daily",
      choices: [],
      points: 5,
      active: true,
    });
  else
    data.outings.push({
      id: crypto.randomUUID(),
      name: "New outing",
      location: "england",
      weather: "either",
      time: "half",
      cost: "free",
      repeat: "often",
      active: true,
    });
  save();
}

initUI();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    $("#settingsButton").hidden = user.uid !== adminUid;
    $("#loginScreen").classList.add("hidden");
    await startData();
  } else {
    $("#settingsButton").hidden = true;
    ready = false;
    unsubscribe?.();
    $("#loginScreen").classList.remove("hidden");
  }
});
