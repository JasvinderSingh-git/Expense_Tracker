/* ==========================================
   EXPENSE TRACKER
   export.js
   Export & Import
========================================== */


/* ==========================================
   DOWNLOAD FILE
========================================== */

function downloadFile(filename, content, type) {

    const blob = new Blob([content], {

        type: type

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/* ==========================================
   EXPORT JSON
========================================== */

function exportJSON() {

    const data = exportData();

    downloadFile(

        "expenses.json",

        JSON.stringify(data, null, 4),

        "application/json"

    );

    showToast("JSON Exported Successfully");

}


/* ==========================================
   EXPORT CSV
========================================== */

function exportCSV() {

    const expenses = loadExpenses();

    if (expenses.length === 0) {

        showToast("No expenses to export");

        return;

    }

    let csv =

        "ID,Amount,Category,Description,Date\n";

    expenses.forEach(expense => {

        csv +=

            `${expense.id},` +

            `${expense.amount},` +

            `"${expense.category}",` +

            `"${expense.name}",` +

            `"${expense.date}"\n`;

    });

    downloadFile(

        "expenses.csv",

        csv,

        "text/csv"

    );

    showToast("CSV Exported Successfully");

}


/* ==========================================
   IMPORT JSON
========================================== */

function importJSON(file) {

    const reader = new FileReader();

    reader.onload = function (event) {

        try {

            const data = JSON.parse(

                event.target.result

            );

            importData(data);

            showToast(

                "Data Imported Successfully"

            );

            location.reload();

        }

        catch {

            alert(

                "Invalid JSON File"

            );

        }

    };

    reader.readAsText(file);

}


/* ==========================================
   CREATE IMPORT INPUT
========================================== */

function openImportDialog() {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.onchange = function () {

        if (this.files.length > 0) {

            importJSON(this.files[0]);

        }

    };

    input.click();

}


/* ==========================================
   SHARE DATA
========================================== */

async function shareData() {

    if (!navigator.share) {

        showToast(

            "Sharing not supported"

        );

        return;

    }

    const data = JSON.stringify(

        exportData(),

        null,

        2

    );

    const file = new File(

        [data],

        "expenses.json",

        {

            type: "application/json"

        }

    );

    try {

        await navigator.share({

            title: "Expense Tracker",

            text: "My Expense Data",

            files: [file]

        });

    }

    catch {

        // User cancelled

    }

}


/* ==========================================
   BACKUP
========================================== */

function createBackup() {

    const backup = {

        createdAt:

            new Date().toISOString(),

        version: "1.0",

        data: exportData()

    };

    downloadFile(

        "expense-backup.json",

        JSON.stringify(

            backup,

            null,

            4

        ),

        "application/json"

    );

    showToast(

        "Backup Created"

    );

}


/* ==========================================
   RESTORE BACKUP
========================================== */

function restoreBackup(file) {

    const reader = new FileReader();

    reader.onload = function (event) {

        try {

            const backup = JSON.parse(

                event.target.result

            );

            importData(

                backup.data

            );

            showToast(

                "Backup Restored"

            );

            location.reload();

        }

        catch {

            alert(

                "Invalid Backup File"

            );

        }

    };

    reader.readAsText(file);

}


/* ==========================================
   EXPORT MENU
========================================== */

function getExportOptions() {

    return [

        {

            name: "Export JSON",

            action: exportJSON

        },

        {

            name: "Export CSV",

            action: exportCSV

        },

        {

            name: "Import JSON",

            action: openImportDialog

        },

        {

            name: "Create Backup",

            action: createBackup

        },

        {

            name: "Share",

            action: shareData

        }

    ];

}