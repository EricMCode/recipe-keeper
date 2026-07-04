const STORAGE_KEY = "recipe-keeper-state-v1";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const meals = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

const seedRecipes = [
  {
    id: "seed-1",
    title: "Lemon Chicken and Rice",
    course: "Dinner",
    fare: "balanced",
    cuisine: "Mediterranean",
    calories: 520,
    tags: ["chicken", "rice", "one-pot", "dinner"],
    ingredients: ["Chicken thighs", "Rice", "Lemon", "Garlic", "Chicken broth", "Parsley"],
    instructions: "Brown chicken, toast rice with garlic, add broth and lemon, then simmer until the rice is tender and chicken is cooked through.",
    archived: false
  },
  {
    id: "seed-2",
    title: "Turkey Taco Bowls",
    course: "Dinner",
    fare: "high-protein",
    cuisine: "Tex-Mex",
    calories: 480,
    tags: ["turkey", "rice", "meal-prep", "high-protein"],
    ingredients: ["Ground turkey", "Brown rice", "Black beans", "Corn", "Salsa", "Lime"],
    instructions: "Cook turkey with taco seasoning, layer over rice with beans, corn, salsa, and lime.",
    archived: false
  },
  {
    id: "seed-3",
    title: "Vegetable Fried Rice",
    course: "Dinner",
    fare: "vegetarian",
    cuisine: "Chinese",
    calories: 430,
    tags: ["rice", "vegetarian", "quick", "leftovers"],
    ingredients: ["Cooked rice", "Eggs", "Peas", "Carrots", "Soy sauce", "Green onion"],
    instructions: "Scramble eggs, stir-fry vegetables, add rice and soy sauce, then finish with green onion.",
    archived: false
  },
  {
    id: "seed-4",
    title: "Greek Yogurt Berry Bowl",
    course: "Breakfast",
    fare: "low-calorie",
    cuisine: "Simple",
    calories: 310,
    tags: ["breakfast", "low-calorie", "berries", "protein"],
    ingredients: ["Greek yogurt", "Blueberries", "Strawberries", "Honey", "Granola"],
    instructions: "Spoon yogurt into a bowl, top with berries, a light drizzle of honey, and granola.",
    archived: false
  },
  {
    id: "seed-5",
    title: "Dark Chocolate Mug Cake",
    course: "Dessert",
    fare: "rich",
    cuisine: "Dessert",
    calories: 390,
    tags: ["dessert", "chocolate", "quick"],
    ingredients: ["Flour", "Cocoa powder", "Sugar", "Milk", "Oil", "Chocolate chips"],
    instructions: "Mix ingredients in a mug and microwave until just set. Rest for one minute before eating.",
    archived: false
  },
  {
    id: "seed-6",
    title: "Broccoli Cheddar Soup",
    course: "Lunch",
    fare: "rich",
    cuisine: "Cozy",
    calories: 560,
    tags: ["soup", "broccoli", "cheese", "leftovers"],
    ingredients: ["Broccoli", "Cheddar", "Onion", "Carrot", "Milk", "Vegetable broth"],
    instructions: "Simmer vegetables in broth, blend part of the soup, then stir in milk and cheddar.",
    archived: false
  }
];

const recipeIdeas = [
  {
    title: "Sheet Pan Miso Salmon",
    course: "Dinner",
    fare: "low-calorie",
    cuisine: "Japanese-inspired",
    tags: ["salmon", "sheet-pan", "low-calorie"],
    ingredients: ["Salmon", "Miso", "Broccoli", "Rice vinegar", "Scallions"],
    instructions: "Roast salmon and vegetables with a miso glaze. Serve with rice or cucumber salad."
  },
  {
    title: "Chicken Lettuce Wraps",
    course: "Dinner",
    fare: "low-calorie",
    cuisine: "Chinese-inspired",
    tags: ["chicken", "low-calorie", "quick"],
    ingredients: ["Ground chicken", "Lettuce", "Water chestnuts", "Soy sauce", "Ginger"],
    instructions: "Cook the filling until glossy and spoon into crisp lettuce leaves."
  },
  {
    title: "Coconut Chickpea Curry",
    course: "Dinner",
    fare: "vegetarian",
    cuisine: "Indian-inspired",
    tags: ["chickpeas", "vegetarian", "curry"],
    ingredients: ["Chickpeas", "Coconut milk", "Tomatoes", "Spinach", "Curry powder"],
    instructions: "Simmer chickpeas in spiced coconut tomato sauce and fold in spinach."
  },
  {
    title: "Peach Crisp for Two",
    course: "Dessert",
    fare: "rich",
    cuisine: "Dessert",
    tags: ["dessert", "fruit", "baked"],
    ingredients: ["Peaches", "Oats", "Brown sugar", "Butter", "Cinnamon"],
    instructions: "Bake peaches under an oat topping until bubbling."
  },
  {
    title: "Pesto Turkey Meatballs",
    course: "Dinner",
    fare: "high-protein",
    cuisine: "Italian-inspired",
    tags: ["turkey", "pesto", "high-protein"],
    ingredients: ["Ground turkey", "Pesto", "Breadcrumbs", "Egg", "Zucchini"],
    instructions: "Bake turkey meatballs with pesto and serve with zucchini or pasta."
  },
  {
    title: "Southwest Sweet Potato Hash",
    course: "Breakfast",
    fare: "balanced",
    cuisine: "Southwest",
    tags: ["breakfast", "eggs", "sweet-potato"],
    ingredients: ["Sweet potato", "Eggs", "Bell pepper", "Black beans", "Avocado"],
    instructions: "Saute sweet potato and peppers, add beans, then top with eggs."
  }
];

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { recipes: seedRecipes, plan: {}, collapsedSlots: {}, collapsedMeals: {} };

  try {
    const parsed = JSON.parse(saved);
    return {
      recipes: Array.isArray(parsed.recipes) ? parsed.recipes : seedRecipes,
      plan: parsed.plan || {},
      collapsedSlots: parsed.collapsedSlots || {},
      collapsedMeals: parsed.collapsedMeals || {}
    };
  } catch {
    return { recipes: seedRecipes, plan: {}, collapsedSlots: {}, collapsedMeals: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function slugList(value) {
  return value
    .split(/[\n, ]+/)
    .map((item) => item.trim().replace(/^#/, "").toLowerCase())
    .filter(Boolean);
}

function lineList(value) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function textList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return lineList(value);
  return [];
}

function tagList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim().replace(/^#/, "").toLowerCase()).filter(Boolean);
  if (typeof value === "string") return slugList(value);
  return [];
}

function getActiveRecipes() {
  return state.recipes.filter((recipe) => !recipe.archived);
}

function recipeText(recipe) {
  return [
    recipe.title,
    recipe.course,
    recipe.fare,
    recipe.cuisine,
    recipe.tags.join(" "),
    recipe.ingredients.join(" ")
  ].join(" ").toLowerCase();
}

function fareLabel(fare) {
  const labels = {
    "low-calorie": "Low calorie",
    balanced: "Balanced",
    rich: "Richer fare",
    "high-protein": "High protein",
    vegetarian: "Vegetarian"
  };
  return labels[fare] || fare;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function renderAll() {
  renderStats();
  renderTags();
  renderRecipes();
  renderPlanner();
  renderIdeas();
}

function renderStats() {
  const active = getActiveRecipes();
  const archiveStats = document.querySelector("#archiveStats");
  if (!archiveStats) return;

  const saved = active.length;
  const dinners = active.filter((recipe) => recipe.course === "Dinner").length;
  const lighter = active.filter((recipe) => recipe.fare === "low-calorie").length;
  archiveStats.textContent = `${saved} saved recipe${saved === 1 ? "" : "s"} - ${dinners} dinner option${dinners === 1 ? "" : "s"} - ${lighter} lighter pick${lighter === 1 ? "" : "s"}`;
}

function renderTags() {
  const tags = [...new Set(getActiveRecipes().flatMap((recipe) => recipe.tags))].sort();
  const cloud = document.querySelector("#tagCloud");
  cloud.innerHTML = "";

  tags.slice(0, 18).forEach((tag) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.textContent = `#${tag}`;
    button.addEventListener("click", () => {
      document.querySelector("#search").value = tag;
      renderRecipes();
    });
    cloud.append(button);
  });
}

function renderRecipes() {
  const list = document.querySelector("#recipeList");
  const template = document.querySelector("#recipeCardTemplate");
  const query = document.querySelector("#search").value.trim().toLowerCase();
  const course = document.querySelector("#filterCourse").value;
  const fare = document.querySelector("#filterFare").value;
  const showArchived = document.querySelector("#showArchived").checked;

  const recipes = state.recipes.filter((recipe) => {
    if (recipe.archived && !showArchived) return false;
    if (course && recipe.course !== course) return false;
    if (fare && recipe.fare !== fare) return false;
    if (query && !recipeText(recipe).includes(query.replace(/^#/, ""))) return false;
    return true;
  });

  list.innerHTML = "";

  if (!recipes.length) {
    list.innerHTML = '<div class="empty">No recipes match that search yet.</div>';
    return;
  }

  recipes.forEach((recipe) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.classList.toggle("is-archived", recipe.archived);
    card.querySelector("h3").textContent = recipe.title;
    card.querySelector(".recipe-card__meta").textContent = `${recipe.course} - ${recipe.cuisine || "Any cuisine"}${recipe.calories ? ` - ${recipe.calories} cal` : ""}`;
    card.querySelector(".fare-pill").textContent = fareLabel(recipe.fare);
    card.querySelector(".recipe-card__ingredients").textContent = recipe.ingredients.slice(0, 7).join(", ");
    card.querySelector(".tags").innerHTML = recipe.tags.map((tag) => `<span>#${tag}</span>`).join("");
    card.querySelector(".detail-body").innerHTML = `
      <div><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</div>
      <div><strong>Instructions:</strong> ${recipe.instructions}</div>
    `;
    card.querySelector(".edit-recipe").addEventListener("click", () => editRecipe(recipe.id));
    card.querySelector(".archive-recipe").textContent = recipe.archived ? "Restore" : "Archive";
    card.querySelector(".archive-recipe").addEventListener("click", () => toggleArchive(recipe.id));
    list.append(card);
  });
}

function editRecipe(id) {
  const recipe = state.recipes.find((item) => item.id === id);
  if (!recipe) return;

  document.querySelector("#editingId").value = recipe.id;
  document.querySelector("#title").value = recipe.title;
  document.querySelector("#course").value = recipe.course;
  document.querySelector("#fare").value = recipe.fare;
  document.querySelector("#cuisine").value = recipe.cuisine || "";
  document.querySelector("#calories").value = recipe.calories || "";
  document.querySelector("#tags").value = recipe.tags.map((tag) => `#${tag}`).join(" ");
  document.querySelector("#ingredients").value = recipe.ingredients.join("\n");
  document.querySelector("#instructions").value = recipe.instructions;
  document.querySelector('[data-tab="recipes"]').click();
  document.querySelector("#title").focus();
}

function toggleArchive(id) {
  state.recipes = state.recipes.map((recipe) => recipe.id === id ? { ...recipe, archived: !recipe.archived } : recipe);
  saveState();
  renderAll();
}

function resetForm() {
  document.querySelector("#recipeForm").reset();
  document.querySelector("#editingId").value = "";
}

function setBackupStatus(message, type = "") {
  const status = document.querySelector("#backupStatus");
  status.textContent = message;
  status.dataset.type = type;
}

function exportRecipes() {
  const payload = {
    app: "Recipe Keeper",
    version: 1,
    exportedAt: new Date().toISOString(),
    recipes: state.recipes
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = URL.createObjectURL(blob);
  link.download = `recipe-keeper-backup-${date}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  setBackupStatus(`Exported ${state.recipes.length} recipe${state.recipes.length === 1 ? "" : "s"} to a backup file.`, "success");
}

function normalizeImportedRecipe(rawRecipe, index) {
  if (!rawRecipe || typeof rawRecipe !== "object") return null;

  const title = String(rawRecipe.title || rawRecipe.name || "").trim();
  const ingredients = textList(rawRecipe.ingredients);
  const instructions = String(rawRecipe.instructions || rawRecipe.method || "").trim();

  if (!title || !ingredients.length || !instructions) return null;

  const course = String(rawRecipe.course || rawRecipe.meal || "Dinner").trim();
  const fare = String(rawRecipe.fare || "balanced").trim();
  const tags = tagList(rawRecipe.tags);

  if (!tags.includes(fare)) tags.push(fare);
  if (!tags.includes(course.toLowerCase())) tags.push(course.toLowerCase());

  return {
    id: `imported-${Date.now()}-${index}`,
    title,
    course,
    fare,
    cuisine: String(rawRecipe.cuisine || "").trim(),
    calories: Number(rawRecipe.calories) || null,
    tags,
    ingredients,
    instructions,
    archived: Boolean(rawRecipe.archived)
  };
}

function recipeKey(recipe) {
  return `${recipe.title.trim().toLowerCase()}::${recipe.ingredients.join("|").trim().toLowerCase()}`;
}

function importRecipes(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      const rawRecipes = Array.isArray(parsed) ? parsed : parsed.recipes;
      if (!Array.isArray(rawRecipes)) throw new Error("Missing recipes array");

      const imported = rawRecipes
        .map((recipe, index) => normalizeImportedRecipe(recipe, index))
        .filter(Boolean);

      if (!imported.length) {
        setBackupStatus("No valid recipes were found in that file.", "error");
        return;
      }

      const mode = document.querySelector("#importMode").value;
      if (mode === "replace") {
        state.recipes = imported;
        state.plan = {};
        state.collapsedSlots = {};
        state.collapsedMeals = {};
        setBackupStatus(`Imported ${imported.length} recipe${imported.length === 1 ? "" : "s"} and replaced the archive.`, "success");
      } else {
        const existingKeys = new Set(state.recipes.map(recipeKey));
        const uniqueImports = imported.filter((recipe) => {
          const key = recipeKey(recipe);
          if (existingKeys.has(key)) return false;
          existingKeys.add(key);
          return true;
        });

        state.recipes = [...uniqueImports, ...state.recipes];
        setBackupStatus(`Imported ${uniqueImports.length} new recipe${uniqueImports.length === 1 ? "" : "s"}${imported.length !== uniqueImports.length ? " and skipped duplicates" : ""}.`, "success");
      }

      saveState();
      renderAll();
    } catch {
      setBackupStatus("That file could not be imported. Choose a Recipe Keeper JSON backup file.", "error");
    } finally {
      event.target.value = "";
    }
  });

  reader.addEventListener("error", () => {
    setBackupStatus("The backup file could not be read.", "error");
    event.target.value = "";
  });

  reader.readAsText(file);
}

function saveRecipe(event) {
  event.preventDefault();
  const id = document.querySelector("#editingId").value || `recipe-${Date.now()}`;
  const recipe = {
    id,
    title: document.querySelector("#title").value.trim(),
    course: document.querySelector("#course").value,
    fare: document.querySelector("#fare").value,
    cuisine: document.querySelector("#cuisine").value.trim(),
    calories: Number(document.querySelector("#calories").value) || null,
    tags: slugList(document.querySelector("#tags").value),
    ingredients: lineList(document.querySelector("#ingredients").value),
    instructions: document.querySelector("#instructions").value.trim(),
    archived: false
  };

  if (!recipe.tags.includes(recipe.fare)) recipe.tags.push(recipe.fare);
  if (!recipe.tags.includes(recipe.course.toLowerCase())) recipe.tags.push(recipe.course.toLowerCase());

  const existing = state.recipes.findIndex((item) => item.id === id);
  if (existing >= 0) state.recipes[existing] = { ...state.recipes[existing], ...recipe };
  else state.recipes.unshift(recipe);

  saveState();
  resetForm();
  renderAll();
}

function renderPlanner() {
  const grid = document.querySelector("#plannerGrid");
  const active = getActiveRecipes();
  grid.innerHTML = "";

  const header = document.createElement("div");
  header.className = "planner-header-row";
  header.innerHTML = `
    <div class="planner-corner">Meal</div>
    ${days.map((day) => `<div class="planner-day-heading">${day}</div>`).join("")}
    <div class="planner-row-action">Week</div>
  `;
  grid.append(header);

  meals.forEach((meal) => {
    const row = document.createElement("section");
    const isMealCollapsed = Boolean(state.collapsedMeals[meal]);
    row.className = `planner-meal-row${isMealCollapsed ? " is-row-collapsed" : ""}`;
    row.innerHTML = `<h3>${meal}</h3>`;

    days.forEach((day) => {
      const key = `${day}-${meal}`;
      const selectedId = state.plan[key] || "";
      const recipe = active.find((item) => item.id === selectedId);
      const isSlotCollapsed = Boolean(state.collapsedSlots[key]);
      const options = active
        .filter((item) => item.course === meal)
        .map((item) => `<option value="${item.id}" ${item.id === selectedId ? "selected" : ""}>${item.title}</option>`)
        .join("");

      const slot = document.createElement("div");
      slot.className = `planner-slot${isSlotCollapsed ? " is-collapsed" : ""}`;
      slot.innerHTML = isSlotCollapsed ? `
        <button class="slot-expand" data-expand-slot="${key}" type="button" aria-label="Expand ${day} ${meal}">+</button>
        <span>${day}</span>
      ` : `
        <div class="slot-topline">
          <span>${day}</span>
          <button class="slot-collapse" data-collapse-slot="${key}" type="button" aria-label="Collapse ${day} ${meal}">-</button>
        </div>
        <select data-plan-key="${key}">
          <option value="">Choose ${meal.toLowerCase()}</option>
          ${options}
        </select>
        ${recipe ? `
          <details class="planned-recipe">
            <summary>${recipe.title}</summary>
            <p>${recipe.ingredients.slice(0, 6).join(", ")}</p>
            <p>${recipe.instructions}</p>
            <button class="ghost view-recipe" data-recipe-id="${recipe.id}" type="button">View in archive</button>
          </details>
        ` : '<strong class="open-slot">Open slot</strong>'}
      `;
      row.append(slot);
    });

    const rowAction = document.createElement("div");
    rowAction.className = "meal-row-toggle-wrap";
    rowAction.innerHTML = `
      <button class="meal-row-toggle" data-toggle-meal="${meal}" type="button">
        ${isMealCollapsed ? "Expand" : "Minimize"}
      </button>
    `;
    row.append(rowAction);
    grid.append(row);
  });

  document.querySelectorAll("[data-plan-key]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const key = event.target.dataset.planKey;
      if (event.target.value) state.plan[key] = event.target.value;
      else delete state.plan[key];
      saveState();
      renderPlanner();
    });
  });

  document.querySelectorAll("[data-collapse-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      state.collapsedSlots[button.dataset.collapseSlot] = true;
      saveState();
      renderPlanner();
    });
  });

  document.querySelectorAll("[data-expand-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      delete state.collapsedSlots[button.dataset.expandSlot];
      saveState();
      renderPlanner();
    });
  });

  document.querySelectorAll("[data-toggle-meal]").forEach((button) => {
    button.addEventListener("click", () => {
      const meal = button.dataset.toggleMeal;
      if (state.collapsedMeals[meal]) delete state.collapsedMeals[meal];
      else state.collapsedMeals[meal] = true;
      saveState();
      renderPlanner();
    });
  });

  document.querySelectorAll(".view-recipe").forEach((button) => {
    button.addEventListener("click", () => {
      const recipe = state.recipes.find((item) => item.id === button.dataset.recipeId);
      if (!recipe) return;
      document.querySelector('[data-tab="recipes"]').click();
      document.querySelector("#search").value = recipe.title;
      renderRecipes();
      document.querySelector("#recipeList")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function autoPlanWeek() {
  const criteria = document.querySelector("#plannerCriteria").value;
  const used = new Set();

  days.forEach((day) => {
    meals.forEach((meal) => {
      const key = `${day}-${meal}`;
      const pool = getActiveRecipes().filter((recipe) => {
        if (criteria && recipe.fare !== criteria && !recipe.tags.includes(criteria)) return false;
        return recipe.course === meal;
      });
      const freshPool = pool.filter((recipe) => !used.has(recipe.id));
      const pick = randomFrom(freshPool.length ? freshPool : pool);
      if (pick) {
        state.plan[key] = pick.id;
        used.add(pick.id);
      }
    });
  });

  saveState();
  renderPlanner();
}

function clearPlan() {
  state.plan = {};
  saveState();
  renderPlanner();
}

function matchIngredients() {
  const terms = slugList(document.querySelector("#availableIngredients").value);
  const target = document.querySelector("#ingredientMatches");
  if (!terms.length) {
    target.innerHTML = '<div class="empty">Add a few ingredients first.</div>';
    return;
  }

  const matches = getActiveRecipes()
    .map((recipe) => {
      const text = recipeText(recipe);
      const score = terms.filter((term) => text.includes(term)).length;
      return { recipe, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!matches.length) {
    target.innerHTML = '<div class="empty">Nothing saved uses those ingredients yet. Try the new recipe ideas below.</div>';
    return;
  }

  target.innerHTML = matches.map(({ recipe, score }) => `
    <div class="recipe-card">
      <p class="recipe-card__meta">${score} ingredient match${score > 1 ? "es" : ""}</p>
      <h3>${recipe.title}</h3>
      <p>${recipe.ingredients.join(", ")}</p>
    </div>
  `).join("");
}

function renderIdeas() {
  const list = document.querySelector("#ideaList");
  const savedTags = new Set(getActiveRecipes().flatMap((recipe) => recipe.tags));
  const sorted = [...recipeIdeas].sort((a, b) => {
    const aScore = a.tags.filter((tag) => savedTags.has(tag)).length;
    const bScore = b.tags.filter((tag) => savedTags.has(tag)).length;
    return bScore - aScore || Math.random() - 0.5;
  });

  list.innerHTML = sorted.slice(0, 3).map((idea, index) => `
    <article class="idea-card">
      <p class="recipe-card__meta">${idea.course} - ${fareLabel(idea.fare)} - ${idea.cuisine}</p>
      <h3>${idea.title}</h3>
      <p>${idea.ingredients.join(", ")}</p>
      <button class="ghost add-idea" data-idea-index="${recipeIdeas.indexOf(idea)}" type="button">Save idea</button>
    </article>
  `).join("");

  document.querySelectorAll(".add-idea").forEach((button) => {
    button.addEventListener("click", () => {
      const idea = recipeIdeas[Number(button.dataset.ideaIndex)];
      state.recipes.unshift({
        ...idea,
        id: `idea-${Date.now()}`,
        archived: false
      });
      saveState();
      renderAll();
    });
  });
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelector(`#${tab.dataset.tab}`).classList.add("is-active");
    });
  });

  document.querySelector("#recipeForm").addEventListener("submit", saveRecipe);
  document.querySelector("#resetForm").addEventListener("click", resetForm);
  ["#search", "#filterCourse", "#filterFare", "#showArchived"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", renderRecipes);
    document.querySelector(selector).addEventListener("change", renderRecipes);
  });
  document.querySelector("#autoPlan").addEventListener("click", autoPlanWeek);
  document.querySelector("#clearPlan").addEventListener("click", clearPlan);
  document.querySelector("#exportRecipes").addEventListener("click", exportRecipes);
  document.querySelector("#importRecipes").addEventListener("change", importRecipes);
  document.querySelector("#matchIngredients").addEventListener("click", matchIngredients);
  document.querySelector("#refreshIdeas").addEventListener("click", renderIdeas);
}

bindEvents();
renderAll();
