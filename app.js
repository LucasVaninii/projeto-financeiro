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
const rememberMeInput = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("authMessage");

const currentMonthLabel = document.getElementById("currentMonthLabel");
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
const incomeRecurrentMonths = document.getElementById("incomeRecurrentMonths");
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
const expenseRecurrentMonths = document.getElementById("expenseRecurrentMonths");
const expenseInstallment = document.getElementById("expenseInstallment");
const expenseInstallmentCurrent = document.getElementById("expenseInstallmentCurrent");
const expenseInstallmentTotal = document.getElementById("expenseInstallmentTotal");
const expensePaid = document.getElementById("expensePaid");
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
const specialRecurrentMonths = document.getElementById("specialRecurrentMonths");
const specialInstallment = document.getElementById("specialInstallment");
const specialInstallmentCurrent = document.getElementById("specialInstallmentCurrent");
const specialInstallmentTotal = document.getElementById("specialInstallmentTotal");
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

// === 4. DATA / MÊS / UTILS ===
function getCurrentMonthRef() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// 2 meses anteriores, atual, 2 próximos
function getMonthWindowRefs() {
  const today = new Date();
  const refs = [];
  for (let offset = -2; offset <= 2; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    refs.push(`${y}-${m}`);
  }
  return refs;
}

function getMonthRefFromDateStr(dateStr) {
  if (!dateStr) return null;
  const [y, m] = dateStr.split("-");
  return `${y}-${m}`;
}

function formatMonthLabel(monthRef) {
  const [y, m] = monthRef.split("-");
  const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d);
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

function addMonthsToDateStr(dateStr, monthsToAdd) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const base = new Date(y, m - 1, d);
  base.setMonth(base.getMonth() + monthsToAdd);
  const ny = base.getFullYear();
  const nm = String(base.getMonth() + 1).padStart(2, "0");
  const nd = String(base.getDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}

function nextPaymentGroup(current) {
  if (current === 1) return 2;
  if (current === 2) return 3;
  return 1;
}

function generateSeriesId() {
  return db.collection("_series").doc().id;
}

// === 5. AUTENTICAÇÃO (lembrar de mim) ===
(function initRememberMeUI() {
  const saved = localStorage.getItem("mgf-remember") === "1";
  rememberMeInput.checked = saved;
})();

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
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
  const remember = rememberMeInput.checked;

  authMessage.textContent = "";
  authMessage.className = "message";

  if (!email || !password) {
    authMessage.textContent = "Preencha e-mail e senha.";
    authMessage.classList.add("error");
    return;
  }

  try {
    const persistence = remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    await auth.setPersistence(persistence);
    await auth.signInWithEmailAndPassword(email, password);
    localStorage.setItem("mgf-remember", remember ? "1" : "0");
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
  const currentMonthRef = getCurrentMonthRef();
  currentMonthLabel.textContent = `Mês atual: ${formatMonthLabel(currentMonthRef)}`;

  const refs = getMonthWindowRefs();
  monthFilter.innerHTML = "";
  refs.forEach((ref) => {
    const opt = document.createElement("option");
    opt.value = ref;
    opt.textContent = formatMonthLabel(ref);
    if (ref === currentMonthRef) opt.selected = true;
    monthFilter.appendChild(opt);
  });

  filterApplyBtn.addEventListener("click", () => {
    reloadAllData();
  });

  if (!tabsInitialized) {
    setupTabs();
    tabsInitialized = true;
  }

  reloadAllData();
}

function getSelectedMonthRef() {
  return monthFilter.value || getCurrentMonthRef();
}

function getSelectedPaymentGroup() {
  const val = paymentGroupFilter.value;
  if (val === "all") return null;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? null : parsed;
}

// === 8. CARREGAR DADOS ===
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
  let q = db
    .collection("incomes")
    .where("userId", "==", currentUser.uid)
    .where("monthRef", "==", monthRef);

  if (paymentGroup != null) {
    q = q.where("paymentGroup", "==", paymentGroup);
  }

  const snap = await q.get();
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
    const statusText = inc.received ? "Recebido" : "A receber";
    meta.textContent = `${inc.date} • ${getPaymentGroupLabel(inc.paymentGroup)} • ${statusText}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "list-right";

    const statusPill = document.createElement("span");
    statusPill.className = "status-pill " + (inc.received ? "status-received" : "status-pending");
    statusPill.textContent = inc.received ? "Recebido" : "A receber";

    const valueSpan = document.createElement("span");
    valueSpan.className = "list-value";
    valueSpan.textContent = formatCurrency(inc.amount || 0);

    const chips = document.createElement("div");
    chips.className = "chips";

    const toggleChip = document.createElement("button");
    toggleChip.className = "chip success";
    toggleChip.textContent = inc.received ? "Marcar a receber" : "Marcar recebido";
    toggleChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      await db.collection("incomes").doc(inc.id).update({ received: !inc.received });
      reloadAllData();
    });

    const groupChip = document.createElement("button");
    groupChip.className = "chip info";
    groupChip.textContent = "Mudar grupo";
    groupChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newGroup = nextPaymentGroup(inc.paymentGroup || 1);
      await db.collection("incomes").doc(inc.id).update({ paymentGroup: newGroup });
      reloadAllData();
    });

    const delChip = document.createElement("button");
    delChip.className = "chip danger";
    delChip.textContent = "Excluir";
    delChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("Excluir esta receita?")) return;
      await db.collection("incomes").doc(inc.id).delete();
      reloadAllData();
    });

    chips.appendChild(toggleChip);
    chips.appendChild(groupChip);
    chips.appendChild(delChip);

    right.appendChild(statusPill);
    right.appendChild(valueSpan);
    right.appendChild(chips);

    li.appendChild(left);
    li.appendChild(right);

    incomeList.appendChild(li);
  });
}

async function loadExpenses(monthRef, paymentGroup) {
  let q = db
    .collection("expenses")
    .where("userId", "==", currentUser.uid)
    .where("monthRef", "==", monthRef)
    .where("isSpecial", "==", false);

  if (paymentGroup != null) {
    q = q.where("paymentGroup", "==", paymentGroup);
  }

  const snap = await q.get();
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
    const paidStr = exp.paid ? "Pago" : "Em aberto";
    meta.textContent = `${exp.dueDate} • ${extra} • ${paidStr}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "list-right";

    const statusPill = document.createElement("span");
    statusPill.className = "status-pill " + (exp.paid ? "status-paid" : "status-open");
    statusPill.textContent = exp.paid ? "Pago" : "Em aberto";

    const valueSpan = document.createElement("span");
    valueSpan.className = "list-value";
    valueSpan.textContent = formatCurrency(exp.amount || 0);

    const chips = document.createElement("div");
    chips.className = "chips";

    const toggleChip = document.createElement("button");
    toggleChip.className = "chip success";
    toggleChip.textContent = exp.paid ? "Marcar em aberto" : "Marcar pago";
    toggleChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      await db.collection("expenses").doc(exp.id).update({ paid: !exp.paid });
      reloadAllData();
    });

    const groupChip = document.createElement("button");
    groupChip.className = "chip info";
    groupChip.textContent = "Mudar grupo";
    groupChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newGroup = nextPaymentGroup(exp.paymentGroup || 1);
      await db.collection("expenses").doc(exp.id).update({ paymentGroup: newGroup });
      reloadAllData();
    });

    const delChip = document.createElement("button");
    delChip.className = "chip danger";
    delChip.textContent = "Excluir";
    delChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      const currentMonthRef = getSelectedMonthRef();

      if (exp.seriesId && exp.originMonthRef === currentMonthRef) {
        const all = confirm(
          "Esta despesa é recorrente/parcelada. Deseja apagar TODAS as ocorrências desta série?"
        );
        if (!all) return;

        const qSeries = await db
          .collection("expenses")
          .where("userId", "==", currentUser.uid)
          .where("seriesId", "==", exp.seriesId)
          .get();

        const deletions = qSeries.docs.map((doc) => doc.ref.delete());
        await Promise.all(deletions);
      } else {
        if (!confirm("Excluir apenas esta despesa?")) return;
        await db.collection("expenses").doc(exp.id).delete();
      }
      reloadAllData();
    });

    chips.appendChild(toggleChip);
    chips.appendChild(groupChip);
    chips.appendChild(delChip);

    right.appendChild(statusPill);
    right.appendChild(valueSpan);
    right.appendChild(chips);

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

  // Pequeno resumo por objetivo
  if (lastSavings.length > 0) {
    const summaryLi = document.createElement("li");
    summaryLi.className = "list-item";

    const left = document.createElement("div");
    left.className = "list-left";

    const title = document.createElement("span");
    title.className = "list-title";
    title.textContent = "Resumo por objetivo";

    const meta = document.createElement("span");
    meta.className = "list-meta";

    const byGoal = {};
    lastSavings.forEach((s) => {
      const key = s.goal || "Sem objetivo";
      byGoal[key] = (byGoal[key] || 0) + (s.amount || 0);
    });

    meta.textContent = Object.entries(byGoal)
      .map(([g, v]) => `${g}: ${formatCurrency(v)}`)
      .join(" • ");

    left.appendChild(title);
    left.appendChild(meta);

    summaryLi.appendChild(left);
    savingList.appendChild(summaryLi);
  }

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

    const right = document.createElement("div");
    right.className = "list-right";

    const valueSpan = document.createElement("span");
    valueSpan.className = "list-value";
    valueSpan.textContent = formatCurrency(sav.amount || 0);

    const chips = document.createElement("div");
    chips.className = "chips";

    const delChip = document.createElement("button");
    delChip.className = "chip danger";
    delChip.textContent = "Excluir";
    delChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("Excluir este valor guardado?")) return;
      await db.collection("savings").doc(sav.id).delete();
      reloadAllData();
    });

    chips.appendChild(delChip);

    right.appendChild(valueSpan);
    right.appendChild(chips);

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
    let extra = "Conta especial";
    if (sp.isInstallment) {
      extra += ` • Parcela ${sp.installmentNumber}/${sp.installmentTotal}`;
    }
    meta.textContent = `${sp.dueDate} • ${extra}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "list-right";

    const valueSpan = document.createElement("span");
    valueSpan.className = "list-value";
    valueSpan.textContent = formatCurrency(sp.amount || 0);

    const chips = document.createElement("div");
    chips.className = "chips";

    const delChip = document.createElement("button");
    delChip.className = "chip danger";
    delChip.textContent = "Excluir";
    delChip.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("Excluir esta conta especial?")) return;
      await db.collection("expenses").doc(sp.id).delete();
      reloadAllData();
    });

    chips.appendChild(delChip);

    right.appendChild(valueSpan);
    right.appendChild(chips);

    li.appendChild(left);
    li.appendChild(right);

    specialList.appendChild(li);
  });
}

function updateDashboardTotals() {
  const totalIncomes = lastIncomes.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpenses = lastExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalSavings = lastSavings.reduce((s, sv) => s + (sv.amount || 0), 0);

  const balance = totalIncomes - totalExpenses - totalSavings;

  cardTotalIncomes.textContent = formatCurrency(totalIncomes);
  cardTotalExpenses.textContent = formatCurrency(totalExpenses);
  cardSavings.textContent = formatCurrency(totalSavings);
  cardBalance.textContent = formatCurrency(balance);
}

// === 9. CRIAÇÃO DE SÉRIES (RECORRÊNCIA / PARCELAS) ===
async function createIncomeSeries(base) {
  const months = Math.max(1, parseInt(base.recurrentMonths || "1", 10));
  const seriesId = months > 1 ? generateSeriesId() : null;
  const originMonthRef = getMonthRefFromDateStr(base.date);

  for (let i = 0; i < months; i++) {
    const dateI = addMonthsToDateStr(base.date, i);
    const monthRefI = getMonthRefFromDateStr(dateI);
    await db.collection("incomes").add({
      userId: currentUser.uid,
      description: base.description,
      amount: base.amount,
      date: dateI,
      paymentGroup: base.paymentGroup,
      received: !!base.received,
      monthRef: monthRefI,
      seriesId,
      originMonthRef,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
}

async function createExpenseSeries(base) {
  const originMonthRef = getMonthRefFromDateStr(base.dueDate);
  const isPaid = !!base.paid;

  if (base.isInstallment && base.installmentTotal > 1) {
    // Parcelada: todas as parcelas respeitam o status "pago" inicial
    const seriesId = generateSeriesId();
    for (let i = 0; i < base.installmentTotal; i++) {
      const dateI = addMonthsToDateStr(base.dueDate, i);
      const monthRefI = getMonthRefFromDateStr(dateI);
      await db.collection("expenses").add({
        userId: currentUser.uid,
        description: base.description,
        amount: base.amount,
        dueDate: dateI,
        type: base.type,
        paymentGroup: base.paymentGroup,
        isInstallment: true,
        installmentNumber: i + 1,
        installmentTotal: base.installmentTotal,
        isSpecial: base.isSpecial || false,
        paid: isPaid,
        monthRef: monthRefI,
        seriesId,
        originMonthRef,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  } else {
    // Recorrente simples (sem parcelas)
    const months = Math.max(1, parseInt(base.recurrentMonths || "1", 10));
    const seriesId = months > 1 ? generateSeriesId() : null;

    for (let i = 0; i < months; i++) {
      const dateI = addMonthsToDateStr(base.dueDate, i);
      const monthRefI = getMonthRefFromDateStr(dateI);
      await db.collection("expenses").add({
        userId: currentUser.uid,
        description: base.description,
        amount: base.amount,
        dueDate: dateI,
        type: base.type,
        paymentGroup: base.paymentGroup,
        isInstallment: false,
        installmentNumber: 1,
        installmentTotal: 1,
        isSpecial: base.isSpecial || false,
        paid: isPaid,
        monthRef: monthRefI,
        seriesId,
        originMonthRef,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
}

// === 10. SALVAR REGISTROS ===
saveIncomeBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  incomeMessage.textContent = "";
  incomeMessage.className = "message";

  const description = incomeDescription.value.trim();
  const amount = parseFloat(incomeAmount.value);
  const date = incomeDate.value;
  const paymentGroup = parseInt(incomePaymentGroup.value, 10);
  const recurrentMonths = parseInt(incomeRecurrentMonths.value || "1", 10);
  const received = incomeReceived.checked;

  if (!description || isNaN(amount) || !date) {
    incomeMessage.textContent = "Preencha descrição, valor e data.";
    incomeMessage.classList.add("error");
    return;
  }

  try {
    await createIncomeSeries({
      description,
      amount,
      date,
      paymentGroup,
      recurrentMonths,
      received,
    });

    incomeMessage.textContent = "Receita(s) salva(s)!";
    incomeMessage.classList.add("success");
    incomeDescription.value = "";
    incomeAmount.value = "";
    incomeDate.value = "";
    incomeRecurrentMonths.value = "1";
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
  const recurrentMonths = parseInt(expenseRecurrentMonths.value || "1", 10);
  const isInstallment = expenseInstallment.checked;
  const installmentCurrent = parseInt(expenseInstallmentCurrent.value || "1", 10);
  const installmentTotal = parseInt(expenseInstallmentTotal.value || "1", 10);
  const paid = expensePaid.checked;

  if (!description || isNaN(amount) || !dueDate) {
    expenseMessage.textContent = "Preencha descrição, valor e vencimento.";
    expenseMessage.classList.add("error");
    return;
  }

  try {
    await createExpenseSeries({
      description,
      amount,
      dueDate,
      type,
      paymentGroup,
      recurrentMonths,
      isInstallment,
      installmentNumber: installmentCurrent,
      installmentTotal,
      paid,
      isSpecial: false,
    });

    expenseMessage.textContent = "Despesa(s) salva(s)!";
    expenseMessage.classList.add("success");
    expenseDescription.value = "";
    expenseAmount.value = "";
    expenseDueDate.value = "";
    expenseType.value = "fixa";
    expensePaymentGroup.value = "1";
    expenseRecurrentMonths.value = "1";
    expenseInstallment.checked = false;
    expenseInstallmentCurrent.value = "";
    expenseInstallmentTotal.value = "";
    expensePaid.checked = false;

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
  const recurrentMonths = parseInt(specialRecurrentMonths.value || "1", 10);
  const isInstallment = specialInstallment.checked;
  const installmentCurrent = parseInt(specialInstallmentCurrent.value || "1", 10);
  const installmentTotal = parseInt(specialInstallmentTotal.value || "1", 10);

  if (!description || isNaN(amount) || !date) {
    specialMessage.textContent = "Preencha descrição, valor e data.";
    specialMessage.classList.add("error");
    return;
  }

  try {
    await createExpenseSeries({
      description,
      amount,
      dueDate: date,
      type: "especial",
      paymentGroup: 0,
      recurrentMonths,
      isInstallment,
      installmentNumber: installmentCurrent,
      installmentTotal,
      paid: false,
      isSpecial: true,
    });

    specialMessage.textContent = "Conta(s) especial(is) salva(s)!";
    specialMessage.classList.add("success");
    specialDescription.value = "";
    specialAmount.value = "";
    specialDate.value = "";
    specialRecurrentMonths.value = "1";
    specialInstallment.checked = false;
    specialInstallmentCurrent.value = "";
    specialInstallmentTotal.value = "";

    await reloadAllData();
  } catch (err) {
    console.error(err);
    specialMessage.textContent = "Erro ao salvar: " + err.message;
    specialMessage.classList.add("error");
  }
});

// === 11. ABAS ===
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