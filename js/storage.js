/* ==========================================
   EXPENSE TRACKER
   storage.js
   Local Storage Manager
========================================== */

const STORAGE_KEYS = {

    EXPENSES: "expense_tracker_expenses",

    SETTINGS: "expense_tracker_settings"

};


/* ==========================================
   LOAD EXPENSES
========================================== */

function loadExpenses() {

    try {

        const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);

        return data ? JSON.parse(data) : [];

    }

    catch (error) {

        console.error("Error loading expenses:", error);

        return [];

    }

}


/* ==========================================
   SAVE EXPENSES
========================================== */

function saveExpenses(expenses) {

    try {

        localStorage.setItem(

            STORAGE_KEYS.EXPENSES,

            JSON.stringify(expenses)

        );

        return true;

    }

    catch (error) {

        console.error("Error saving expenses:", error);

        return false;

    }

}


/* ==========================================
   ADD EXPENSE
========================================== */

function addExpense(expense) {

    const expenses = loadExpenses();

    expenses.push(expense);

    saveExpenses(expenses);

}


/* ==========================================
   UPDATE EXPENSE
========================================== */

function updateExpense(id, updatedExpense) {

    const expenses = loadExpenses();

    const index = expenses.findIndex(

        expense => expense.id === id

    );

    if (index === -1) {

        return false;

    }

    expenses[index] = {

        ...expenses[index],

        ...updatedExpense

    };

    saveExpenses(expenses);

    return true;

}


/* ==========================================
   DELETE EXPENSE
========================================== */

function deleteExpense(id) {

    const expenses = loadExpenses().filter(

        expense => expense.id !== id

    );

    saveExpenses(expenses);

}


/* ==========================================
   DELETE ALL EXPENSES
========================================== */

function clearExpenses() {

    saveExpenses([]);

}


/* ==========================================
   GET EXPENSE BY ID
========================================== */

function getExpenseById(id) {

    return loadExpenses().find(

        expense => expense.id === id

    );

}


/* ==========================================
   SETTINGS
========================================== */

const DEFAULT_SETTINGS = {
    theme: null,
    filter: "month",
    currency: "INR"
};


function loadSettings() {

    try {

        const settings = JSON.parse(

            localStorage.getItem(STORAGE_KEYS.SETTINGS)

        );

        return {

            ...DEFAULT_SETTINGS,

            ...settings

        };

    }

    catch {

        return DEFAULT_SETTINGS;

    }

}


function saveSettings(settings) {

    localStorage.setItem(

        STORAGE_KEYS.SETTINGS,

        JSON.stringify(settings)

    );

}


/* ==========================================
   UPDATE SETTINGS
========================================== */

function updateSetting(key, value) {

    const settings = loadSettings();

    settings[key] = value;

    saveSettings(settings);

}


/* ==========================================
   EXPORT DATA
========================================== */

function exportData() {

    return {

        expenses: loadExpenses(),

        settings: loadSettings(),

        exportedAt: new Date().toISOString()

    };

}


/* ==========================================
   IMPORT DATA
========================================== */

function importData(data) {

    if (!data) {

        return false;

    }

    if (Array.isArray(data.expenses)) {

        saveExpenses(data.expenses);

    }

    if (data.settings) {

        saveSettings(data.settings);

    }

    return true;

}


/* ==========================================
   STORAGE SIZE
========================================== */

function getStorageSize() {

    const data = JSON.stringify(exportData());

    return new Blob([data]).size;

}


/* ==========================================
   STORAGE INFO
========================================== */

function getStorageInfo() {

    const expenses = loadExpenses();

    const totalExpense = expenses.reduce(

        (sum, expense) => sum + Number(expense.amount),

        0

    );

    return {

        totalRecords: expenses.length,

        totalExpense,

        storageSize: getStorageSize()

    };

}


/* ==========================================
   FIRST RUN
========================================== */

(function initializeStorage() {

    if (

        !localStorage.getItem(

            STORAGE_KEYS.SETTINGS

        )

    ) {

        saveSettings(DEFAULT_SETTINGS);

    }

})();