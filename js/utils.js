/* ==========================================
   EXPENSE TRACKER
   utils.js
   Common Utility Functions
========================================== */

/* ==========================================
   SHORTCUT SELECTORS
========================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* ==========================================
   CREATE ELEMENT
========================================== */

function createElement(tag, className = "", text = "") {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}


/* ==========================================
   FORMAT CURRENCY
========================================== */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR",

        maximumFractionDigits: 2

    }).format(amount);

}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short",

        year: "numeric"

    });

}


/* ==========================================
   FORMAT TIME
========================================== */

function formatTime(date) {

    return new Date(date).toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit"

    });

}


/* ==========================================
   GET TODAY DATE
========================================== */

function todayDate() {

    return new Date().toISOString().split("T")[0];

}


/* ==========================================
   GENERATE UNIQUE ID
========================================== */

function generateId() {

    const expenses = loadExpenses();

    if (expenses.length === 0) {

        return 1;

    }

    return Math.max(

        ...expenses.map(expense => expense.id)

    ) + 1;

}


/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    const toast = $("#toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================
   LOADER
========================================== */

function showLoader() {

    $("#loader").classList.add("show");

}

function hideLoader() {

    $("#loader").classList.remove("show");

}


/* ==========================================
   VALIDATION
========================================== */

function isEmpty(value) {

    return value.trim() === "";

}

function isPositive(number) {

    return Number(number) > 0;

}


/* ==========================================
   RANDOM COLOR
========================================== */

function randomColor() {

    const colors = [

        "#2563eb",

        "#22c55e",

        "#ef4444",

        "#f59e0b",

        "#8b5cf6",

        "#14b8a6",

        "#0ea5e9",

        "#ec4899"

    ];

    return colors[Math.floor(Math.random() * colors.length)];

}


/* ==========================================
   CATEGORY ICONS
========================================== */

const categoryIcons = {

    Food: "🍔",

    Fuel: "⛽",

    Shopping: "🛒",

    Bills: "💡",

    Travel: "✈️",

    Education: "📚",

    Medical: "💊",

    Entertainment: "🎬",

    Others: "📦"

};


/* ==========================================
   CATEGORY COLORS
========================================== */

const categoryColors = {

    Food: "#22c55e",

    Fuel: "#f97316",

    Shopping: "#8b5cf6",

    Bills: "#ef4444",

    Travel: "#0ea5e9",

    Education: "#14b8a6",

    Medical: "#ec4899",

    Entertainment: "#6366f1",

    Others: "#64748b"

};


/* ==========================================
   GET CATEGORY ICON
========================================== */

function getCategoryIcon(category) {

    return categoryIcons[category] || "📦";

}


/* ==========================================
   GET CATEGORY COLOR
========================================== */

function getCategoryColor(category) {

    return categoryColors[category] || "#64748b";

}


/* ==========================================
   CONFIRM DIALOG
========================================== */

function confirmDelete(message = "Delete this expense?") {

    return confirm(message);

}


/* ==========================================
   DEBOUNCE
========================================== */

function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}


/* ==========================================
   SORT BY DATE
========================================== */

function sortByNewest(expenses) {

    return [...expenses].sort((a, b) =>

        new Date(b.date) - new Date(a.date)

    );

}


/* ==========================================
   SORT BY AMOUNT
========================================== */

function sortByAmount(expenses) {

    return [...expenses].sort((a, b) =>

        b.amount - a.amount

    );

}


/* ==========================================
   FILTER BY CATEGORY
========================================== */

function filterCategory(expenses, category) {

    if (category === "All") {

        return expenses;

    }

    return expenses.filter(expense =>

        expense.category === category

    );

}