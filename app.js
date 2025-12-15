// === 1. CONFIGURAÇÃO DO FIREBASE (TROQUE PELOS SEUS DADOS) ===
const firebaseConfig = {
  apiKey: "AIzaSyA53oL_wxFlobwWZlgEiyRt7Zr9usQByD4",
  authDomain: "minha-gestao-financeira-d6543.firebaseapp.com",
  projectId: "minha-gestao-financeira-d6543",
  storageBucket: "minha-gestao-financeira-d6543.firebasestorage.app",
  messagingSenderId: "426355365160",
  appId: "1:426355365160:web:e7ca8d49d5b2929d562c1d"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// === 2. ELEMENTOS ===
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("authMessage");

const currentMonthLabel = document.getElementById("currentMonthLabel");
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");
const paymentGroupFilter = document.getElementById("paymentGroupFilter");
const filterApplyBtn = document.getElementById("filterApplyBtn");

// Cards
const cardTotalIncomes = document.getElementById("card-totalIncomes");
const cardTotalExpenses = document.getElementById("card-totalExpenses");
const cardBalance = document.getElementById("card-balance");
const cardSavings = document.getElementById("card-savings");

// Receitas
const incomeDescription = document.getElementById("incomeDescription");
const incomeAmount = document.getElementById("incomeAmount");
const incomeDate = document.getElementById("incomeDate");
const incomePaymentGroup = document.getElementById("incomePaymentGroup");
const incomeReceived = document.getElementById("incomeReceived");
const saveIncomeBtn = document.getElementById("saveIncomeBtn");
const incomeMessage = document.getElementById("incomeMessage");
const incomeList = document.getElementById("incomeList");

// Despesas
const expenseDescription = document.getElementById("expenseDescription");
const expenseAmount = document.getElementById("expenseAmount");
const expenseDueDate = document.getElementById("expenseDueDate");
const expenseType = document.getElementById("expenseType");
const expensePaymentGroup = document.getElementById("expensePaymentGroup");
const expenseInstallment = document.getElementById("expenseInstallment");
const expenseInstallmentCurrent = document.getElementById("expenseInstallmentCurrent");
const expenseInstallmentTotal = document.getElementById("expenseInstallmentTotal");
const saveExpenseBtn = document.getElementById("saveExpenseBtn");
const expenseMessage = document.getElementById("expenseMessage");
const expenseList = document.getElementById("expenseList");

// Poupança
const savingAmount = document.getElementById("savingAmount");
const savingDate = document.getElementById("savingDate");
const savingGoal = document.getElementById("savingGoal");
const savingNote = document.getElementById("savingNote");
const saveSavingBtn = document.getElementById("saveSavingBtn");
const savingMessage = document.getElementById("savingMessage");
const savingList = document.getElementById("savingList");

// Especiais
const specialDescription = document.getElementById("specialDescription");
const specialAmount = document.getElementById("specialAmount");
const specialDate = document.getElementById("specialDate");
const saveSpecialBtn = document.getElementById("saveSpecialBtn");
const specialMessage = document.getElementById("specialMessage");
const specialList = document.getElementById("specialList");

// Tema
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const themeToggleText = document.getElementById("themeToggleText");

// === 3. TEMA CLARO/ESCURO ===
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    themeToggleIcon.textContent = "🌞";
    themeToggleText.textContent = "Modo claro";
  } else {
    themeToggleIcon.textContent = "🌙";
    themeToggleText.textContent = "Modo escuro";
  }
}

function initTheme() {
  const saved = localStorage.getItem("mgf-theme") || "dark";
  applyTheme(saved);
}

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("mgf-theme", next);
});

initTheme();

// === 4. DATA / MÊS / ANO ===
function getMonthRefFromDateStr(dateStr) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split("-");
  return `${year}-${month}`;
}

function getCurrentYearMonth() {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  };
}

function formatMonthLabel(monthRef) {
  const [year, month] = monthRef.split("-");
  const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d);
}

function getSelectedYear() {
  const y = parseInt(yearFilter.value, 10);
  if (!isNaN(y)) return y;
  return getCurrentYearMonth().year;
}

function getSelectedMonth() {
  const m = parseInt(monthFilter.value, 10);
  if (!isNaN(m) && m >= 1 && m <= 12) return m;
  return getCurrentYearMonth().month;
}

function getSelectedMonthRef() {
  const y = getSelectedYear();
  const m = String(getSelectedMonth()).padStart(2, "0");
  return `${y}-${m}`;
}

function formatCurrency(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getPaymentGroupLabel(v) {
  if (v === 1) return "Pagamentos dia 5";
  if (v === 2) return "Pagamentos dia 10";
  if (v === 3) return "Pagamentos dia 20";
  return "-";
}

// === 5. AUTENTICAÇÃO ===
registerBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  authMessage.textContent = "";
  authMessage.className = "message";

  if (!email || !password) {
    authMessage.textContent = "Preencha e-mail e senha.";
    authMessage.classList.add("error");
    return;
  }

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    authMessage.textContent = "Conta criada com sucesso! Você já está logado.";
    authMessage.classList.add("success");
  } catch (err) {
    authMessage.textContent = "Erro ao criar conta: " + err.message;
    authMessage.classList.add("error");
  }
});

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  authMessage.textContent = "";
  authMessage.className = "message";

  if (!email || !password) {
    authMessage.textContent = "Preencha e-mail e senha.";
    authMessage.classList.add("error");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    authMessage.textContent = "Erro ao entrar: " + err.message;
    authMessage.classList.add("error");
  }
});

logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
});

// === 6. ESTADO GLOBAL ===
let currentUser = null;
let filtersInitialized = false;
let tabsInitialized = false;

let lastIncomes = [];
let lastExpenses = [];
let lastSavings = [];
let lastSpecial = [];

// Observador de login
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    authSection.style.display = "none";
    appSection.style.display = "block";
    logoutBtn.style.display = "inline-flex";
    initApp();
  } else {
    currentUser = null;
    authSection.style.display = "block";
    appSection.style.display = "none";
    logoutBtn.style.display = "none";
    emailInput.value = "";
    passwordInput.value = "";
  }
});

// === 7. INICIALIZAÇÃO DO APP ===
function initApp() {
  const { year, month } = getCurrentYearMonth();
  const monthRef = `${year}-${String(month).padStart(2, "0")}`;
  currentMonthLabel.textContent = `Mês atual: ${formatMonthLabel(monthRef)}`;

  // Preenche anos (ano anterior, atual, próximo)
  if (!filtersInitialized) {
    yearFilter.innerHTML = "";
    const years = [year - 1, year, year + 1];
    years.forEach((y) => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      if (y === year) opt.selected = true;
      yearFilter.appendChild(opt);
    });

    // Preenche meses (1..12)
    monthFilter.innerHTML = "";
    for (let m = 1; m <= 12; m++) {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = `${String(m).padStart(2, "0")}`;
      if (m === month) opt.selected = true;
      monthFilter.appendChild(opt);
    }

    filterApplyBtn.addEventListener("click", () => {
      reloadAllData();
    });

    filtersInitialized = true;
  }

  if (!tabsInitialized) {
    setupTabs();
    tabsInitialized = true;
  }

  reloadAllData();
}

// === 8. CARREGAR DADOS ===
function getSelectedPaymentGroup() {
  const val = paymentGroupFilter.value;
  if (val === "all") return null;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? null : parsed;
}

async function reloadAllData() {
  if (!currentUser) return;
  const monthRef = getSelectedMonthRef();
  const paymentGroup = getSelectedPaymentGroup();

  try {
    await Promise.all([
      loadIncomes(monthRef, paymentGroup),
      loadExpenses(monthRef, paymentGroup),
      loadSavings(monthRef),
      loadSpecial(monthRef),
    ]);
    updateDashboardTotals();
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
}

async function loadIncomes(monthRef, paymentGroup) {
  let query = db
    .collection("incomes")
    .where("userId", "==", currentUser.uid)
    .where("monthRef", "==", monthRef);

  if (paymentGroup != null) {
    query = query.where("paymentGroup", "==", paymentGroup);
  }

  const snap = await query.get();
  lastIncomes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  incomeList.innerHTML = "";
  lastIncomes.forEach((inc) => {
    const li = document.createElement("li");
    li.className = "list-item";

    const left = document.createElement("div");
    left.className = "list-left";

    const title = document.createElement("span");
    title.className = "list-title";
    title.textContent = inc.description || "(Sem descrição)";

    const meta = document.createElement("span");
    meta.className = "list-meta";
    const receivedStr = inc.received ? "Recebido" : "A receber";
    meta.textContent = `${inc.date} • ${getPaymentGroupLabel(inc.paymentGroup)} • ${receivedStr}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("span");
    right.className = "list-value";
    right.textContent = formatCurrency(inc.amount || 0);

    li.appendChild(left);
    li.appendChild(right);

    incomeList.appendChild(li);
  });
}

async function loadExpenses(monthRef, paymentGroup) {
  let query = db
    .collection("expenses")
    .where("userId", "==", currentUser.uid)
    .where("monthRef", "==", monthRef)
    .where("isSpecial", "==", false);

  if (paymentGroup != null) {
    query = query.where("paymentGroup", "==", paymentGroup);
  }

  const snap = await query.get();
  lastExpenses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  expenseList.innerHTML = "";
  lastExpenses.forEach((exp) => {
    const li = document.createElement("li");
    li.className = "list-item";

    const left = document.createElement("div");
    left.className = "list-left";

    const title = document.createElement("span");
    title.className = "list-title";
    title.textContent = exp.description || "(Sem descrição)";

    const meta = document.createElement("span");
    meta.className = "list-meta";
    const typeStr = exp.type || "-";
    let extra = `Tipo: ${typeStr} • ${getPaymentGroupLabel(exp.paymentGroup)}`;
    if (exp.isInstallment) {
      extra += ` • Parcela ${exp.installmentNumber}/${exp.installmentTotal}`;
    }
    meta.textContent = `${exp.dueDate} • ${extra}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("span");
    right.className = "list-value";
    right.textContent = formatCurrency(exp.amount || 0);

    li.appendChild(left);
    li.appendChild(right);

    expenseList.appendChild(li);
  });
}

async function loadSavings(monthRef) {
  const snap = await db
    .collection("savings")
    .where("userId", "==", currentUser.uid)
    .where("monthRef", "==", monthRef)
    .get();

  lastSavings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  savingList.innerHTML = "";
  lastSavings.forEach((sav) => {
    const li = document.createElement("li");
    li.className = "list-item";

    const left = document.createElement("div");
    left.className = "list-left";

    const title = document.createElement("span");
    title.className = "list-title";
    title.textContent = sav.goal || "Sem objetivo";

    const meta = document.createElement("span");
    meta.className = "list-meta";
    meta.textContent = `${sav.date} • ${sav.note || ""}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("span");
    right.className = "list-value";
    right.textContent = formatCurrency(sav.amount || 0);

    li.appendChild(left);
    li.appendChild(right);

    savingList.appendChild(li);
  });
}

async function loadSpecial(monthRef) {
  const snap = await db
    .collection("expenses")
    .where("userId", "==", currentUser.uid)
    .where("monthRef", "==", monthRef)
    .where("isSpecial", "==", true)
    .get();

  lastSpecial = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  specialList.innerHTML = "";
  lastSpecial.forEach((sp) => {
    const li = document.createElement("li");
    li.className = "list-item";

    const left = document.createElement("div");
    left.className = "list-left";

    const title = document.createElement("span");
    title.className = "list-title";
    title.textContent = sp.description || "(Sem descrição)";

    const meta = document.createElement("span");
    meta.className = "list-meta";
    meta.textContent = `${sp.dueDate} • Conta especial`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("span");
    right.className = "list-value";
    right.textContent = formatCurrency(sp.amount || 0);

    li.appendChild(left);
    li.appendChild(right);

    specialList.appendChild(li);
  });
}

function updateDashboardTotals() {
  const totalIncomes = lastIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpenses = lastExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalSavings = lastSavings.reduce((sum, s) => sum + (s.amount || 0), 0);

  const balance = totalIncomes - totalExpenses - totalSavings;

  cardTotalIncomes.textContent = formatCurrency(totalIncomes);
  cardTotalExpenses.textContent = formatCurrency(totalExpenses);
  cardSavings.textContent = formatCurrency(totalSavings);
  cardBalance.textContent = formatCurrency(balance);
}

// === 9. SALVAR REGISTROS ===
saveIncomeBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  incomeMessage.textContent = "";
  incomeMessage.className = "message";

  const description = incomeDescription.value.trim();
  const amount = parseFloat(incomeAmount.value);
  const date = incomeDate.value;
  const paymentGroup = parseInt(incomePaymentGroup.value, 10);
  const received = incomeReceived.checked;
  const monthRef = getMonthRefFromDateStr(date);

  if (!description || isNaN(amount) || !date) {
    incomeMessage.textContent = "Preencha descrição, valor e data.";
    incomeMessage.classList.add("error");
    return;
  }

  try {
    await db.collection("incomes").add({
      userId: currentUser.uid,
      description,
      amount,
      date,
      paymentGroup,
      received,
      monthRef,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    incomeMessage.textContent = "Receita salva!";
    incomeMessage.classList.add("success");
    incomeDescription.value = "";
    incomeAmount.value = "";
    incomeDate.value = "";
    incomeReceived.checked = false;

    await reloadAllData();
  } catch (err) {
    console.error(err);
    incomeMessage.textContent = "Erro ao salvar receita: " + err.message;
    incomeMessage.classList.add("error");
  }
});

saveExpenseBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  expenseMessage.textContent = "";
  expenseMessage.className = "message";

  const description = expenseDescription.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const dueDate = expenseDueDate.value;
  const type = expenseType.value;
  const paymentGroup = parseInt(expensePaymentGroup.value, 10);
  const isInstallment = expenseInstallment.checked;
  const installmentNumber = parseInt(expenseInstallmentCurrent.value || "1", 10);
  const installmentTotal = parseInt(expenseInstallmentTotal.value || "1", 10);
  const monthRef = getMonthRefFromDateStr(dueDate);

  if (!description || isNaN(amount) || !dueDate) {
    expenseMessage.textContent = "Preencha descrição, valor e vencimento.";
    expenseMessage.classList.add("error");
    return;
  }

  try {
    await db.collection("expenses").add({
      userId: currentUser.uid,
      description,
      amount,
      dueDate,
      type,
      paymentGroup,
      isInstallment,
      installmentNumber,
      installmentTotal,
      isSpecial: false,
      monthRef,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    expenseMessage.textContent = "Despesa salva!";
    expenseMessage.classList.add("success");
    expenseDescription.value = "";
    expenseAmount.value = "";
    expenseDueDate.value = "";
    expenseInstallment.checked = false;
    expenseInstallmentCurrent.value = "";
    expenseInstallmentTotal.value = "";

    await reloadAllData();
  } catch (err) {
    console.error(err);
    expenseMessage.textContent = "Erro ao salvar despesa: " + err.message;
    expenseMessage.classList.add("error");
  }
});

saveSavingBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  savingMessage.textContent = "";
  savingMessage.className = "message";

  const amount = parseFloat(savingAmount.value);
  const date = savingDate.value;
  const goal = savingGoal.value.trim();
  const note = savingNote.value.trim();
  const monthRef = getMonthRefFromDateStr(date);

  if (isNaN(amount) || !date) {
    savingMessage.textContent = "Preencha valor e data.";
    savingMessage.classList.add("error");
    return;
  }

  try {
    await db.collection("savings").add({
      userId: currentUser.uid,
      amount,
      date,
      goal,
      note,
      monthRef,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    savingMessage.textContent = "Valor guardado registrado!";
    savingMessage.classList.add("success");
    savingAmount.value = "";
    savingDate.value = "";
    savingGoal.value = "";
    savingNote.value = "";

    await reloadAllData();
  } catch (err) {
    console.error(err);
    savingMessage.textContent = "Erro ao salvar: " + err.message;
    savingMessage.classList.add("error");
  }
});

saveSpecialBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  specialMessage.textContent = "";
  specialMessage.className = "message";

  const description = specialDescription.value.trim();
  const amount = parseFloat(specialAmount.value);
  const date = specialDate.value;
  const monthRef = getMonthRefFromDateStr(date);

  if (!description || isNaN(amount) || !date) {
    specialMessage.textContent = "Preencha descrição, valor e data.";
    specialMessage.classList.add("error");
    return;
  }

  try {
    await db.collection("expenses").add({
      userId: currentUser.uid,
      description,
      amount,
      dueDate: date,
      type: "especial",
      paymentGroup: 0,
      isInstallment: false,
      installmentNumber: 1,
      installmentTotal: 1,
      isSpecial: true,
      monthRef,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    specialMessage.textContent = "Conta especial salva!";
    specialMessage.classList.add("success");
    specialDescription.value = "";
    specialAmount.value = "";
    specialDate.value = "";

    await reloadAllData();
  } catch (err) {
    console.error(err);
    specialMessage.textContent = "Erro ao salvar: " + err.message;
    specialMessage.classList.add("error");
  }
});

// === 10. ABAS ===
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });
}