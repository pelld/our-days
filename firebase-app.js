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

let data = structuredClone(seed),
  currentPerson = "hunter",
  manageType = "tasks",
  pendingTaskId = null,
  learningPath = [],
  learningSpinning = false,
  unsubscribe = null,
  ready = false;

async function save() {
  if (ready) await setDoc(stateRef, data);
}
async function startData() {
  const snap = await getDoc(stateRef);
  if (!snap.exists()) await setDoc(stateRef, seed);
  else if (!snap.data().learningActivities) {
    await setDoc(
      stateRef,
      { learningActivities: learningSeed, learningSelections: [] },
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
  $("#learningSpin").onclick = spinLearning;
  $("#learningBack").onclick = () => {
    learningPath.pop();
    renderLearningWheel();
  };
  $("#learningRestart").onclick = () => {
    learningPath = [];
    renderLearningWheel();
  };
  ["learnTime", "learnPlace", "learnSupport", "learnEnergy"].forEach(
    (id) =>
      ($(`#${id}`).onchange = () => {
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
        $("#loginEmail").value,
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
function todayLearningSelection() {
  return (data.learningSelections || []).find(
    (item) => item.person === "hunter" && item.date === todayKey(),
  );
}
function renderLearningToday() {
  const host = $("#learningToday");
  if (currentPerson !== "hunter") {
    host.innerHTML = "";
    return;
  }
  const selection = todayLearningSelection(),
    activity =
      selection &&
      data.learningActivities.find((item) => item.id === selection.activityId),
    taskId = `learning-${todayKey()}`,
    done = completed(taskId);
  host.innerHTML = `<section class="task-section learning-today"><div class="learning-title"><h3>Today's learning</h3><button class="text-link" id="chooseLearning">${activity ? "Choose again" : "Spin the learning wheel"}</button></div>${activity ? `<label class="task ${done ? "done" : ""}"><input type="checkbox" id="learningComplete" ${done ? "checked" : ""}><span class="task-copy"><span>${esc(activity.name)}</span><small>${esc(activity.area)} · ${esc(activity.subject)} · ${activity.minutes} minutes</small></span><span class="points">+5</span></label>` : `<button class="learning-launch" id="learningLaunch"><strong>Let the wheels decide</strong><span>Area → subject → activity</span></button>`}</section>`;
  const open = () => openLearningWheel();
  $("#chooseLearning").onclick = open;
  if ($("#learningLaunch")) $("#learningLaunch").onclick = open;
  if ($("#learningComplete"))
    $("#learningComplete").onchange = (event) =>
      toggleLearningComplete(event.target.checked);
}
function toggleLearningComplete(on) {
  const taskId = `learning-${todayKey()}`;
  data.completions = data.completions.filter(
    (item) => !(item.taskId === taskId && item.date === todayKey()),
  );
  if (on)
    data.completions.push({
      taskId,
      person: "hunter",
      date: todayKey(),
      points: 5,
      choice: todayLearningSelection()?.activityId || "",
    });
  save();
}
function openLearningWheel() {
  learningPath = [];
  renderLearningWheel();
  $("#learningDialog").showModal();
}
function eligibleLearning() {
  const time = $("#learnTime").value,
    place = $("#learnPlace").value,
    support = $("#learnSupport").value,
    energy = $("#learnEnergy").value;
  return (data.learningActivities || []).filter(
    (item) =>
      item.active &&
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
function renderLearningWheel() {
  const options = learningOptions(),
    wheel = $("#learningWheel"),
    stage = learningPath.length;
  $("#learningStageTitle").textContent =
    [
      "First: choose the area",
      "Next: choose the subject",
      "Finally: choose the activity",
    ][stage] || "Chosen";
  $("#learningBreadcrumb").textContent = learningPath.join(" → ");
  $("#learningFilters").hidden = stage > 0;
  $("#learningBack").hidden = stage === 0;
  $("#learningRestart").hidden = stage === 0;
  $("#learningSpin").disabled = !options.length || learningSpinning;
  const colours = [
    "#176b5b",
    "#e7b84b",
    "#e16b55",
    "#789f91",
    "#263d5b",
    "#c78d31",
    "#7867a8",
    "#4f8da0",
  ];
  const size = options.length ? 360 / options.length : 360;
  wheel.style.background = options.length
    ? `conic-gradient(${options.map((_, i) => `${colours[i % colours.length]} ${i * size}deg ${(i + 1) * size}deg`).join(",")})`
    : "#d9ddd7";
  wheel.style.transform = "rotate(0deg)";
  wheel.innerHTML = options.length
    ? options
        .map((label, i) => {
          const angle = (i + 0.5) * size;
          return `<span class="wheel-option" style="--angle:${angle}deg">${esc(label)}</span>`;
        })
        .join("")
    : '<span class="wheel-empty">No matching activities</span>';
}
function spinLearning() {
  if (learningSpinning) return;
  const options = learningOptions();
  if (!options.length) return;
  learningSpinning = true;
  $("#learningSpin").disabled = true;
  const chosenIndex = Math.floor(Math.random() * options.length),
    chosen = options[chosenIndex],
    segment = 360 / options.length,
    target = 1800 - (chosenIndex + 0.5) * segment,
    wheel = $("#learningWheel");
  wheel.style.transform = `rotate(${target}deg)`;
  setTimeout(() => {
    learningSpinning = false;
    learningPath.push(chosen);
    if (learningPath.length === 3) selectLearningActivity();
    else renderLearningWheel();
  }, 2400);
}
function selectLearningActivity() {
  const [area, subject, name] = learningPath,
    activity = data.learningActivities.find(
      (item) =>
        item.active &&
        item.area === area &&
        item.subject === subject &&
        item.name === name,
    );
  if (!activity) return;
  data.learningSelections = (data.learningSelections || []).filter(
    (item) => !(item.person === "hunter" && item.date === todayKey()),
  );
  data.learningSelections.push({
    person: "hunter",
    date: todayKey(),
    activityId: activity.id,
  });
  data.completions = data.completions.filter(
    (item) =>
      !(item.taskId === `learning-${todayKey()}` && item.date === todayKey()),
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
  const list = data.outings.filter(
      (o) => o.location === $("#locationFilter").value,
    ),
    n = list.filter(eligible).length;
  $("#eligibleCount").textContent = `${n} available`;
  $("#outingList").innerHTML = list
    .map(
      (o) =>
        `<div class="outing ${eligible(o) ? "" : "ineligible"}"><div><strong>${o.name}</strong><p>${o.time} · ${o.weather} weather · ${o.cost}</p></div><span class="tag">${o.repeat}</span></div>`,
    )
    .join("");
}
function spin() {
  const options = data.outings.filter(eligible);
  if (!options.length) {
    $("#wheelLabel").textContent = "No matches";
    return;
  }
  const choice = options[Math.floor(Math.random() * options.length)],
    wheel = $("#wheel");
  wheel.classList.remove("spinning");
  void wheel.offsetWidth;
  wheel.classList.add("spinning");
  $("#wheelLabel").textContent = "Spinning…";
  setTimeout(() => {
    $("#wheelLabel").textContent = choice.name;
    wheel.classList.remove("spinning");
  }, 2200);
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
    `<p class="muted small">Each row is one possible final result. Areas and subjects automatically become the first two wheels.</p><div class="table-wrap"><table class="manage-table"><thead><tr><th>Order</th><th>Area</th><th>Subject</th><th>Activity</th><th>Min</th><th>Place</th><th>Help</th><th>Style</th><th>Active</th><th></th></tr></thead><tbody>${items
      .map(
        (item, i) =>
          `<tr><td class="row-actions"><button data-move="up" data-i="${i}" ${i === 0 ? "disabled" : ""}>↑</button><button data-move="down" data-i="${i}" ${i === items.length - 1 ? "disabled" : ""}>↓</button></td><td><input data-field="area" data-i="${i}" value="${esc(item.area)}"></td><td><input data-field="subject" data-i="${i}" value="${esc(item.subject)}"></td><td><input data-field="name" data-i="${i}" value="${esc(item.name)}"></td><td><select data-field="minutes" data-i="${i}">${options(
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
              ["together", "With Daddy"],
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
      person: "hunter",
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
    $("#loginScreen").classList.add("hidden");
    await startData();
  } else {
    ready = false;
    unsubscribe?.();
    $("#loginScreen").classList.remove("hidden");
  }
});
