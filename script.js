// Configuration
const gradeScale = { "A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0 };
let courses = JSON.parse(localStorage.getItem('gpa-courses')) || [];

// Selectors
const courseBody = document.getElementById('course-body');
const addRowBtn = document.getElementById('add-row-btn');
const gpaDisplay = document.getElementById('gpa-display');
const targetInput = document.getElementById('target-gpa');

// --- Initialization ---
function init() {
    if (courses.length === 0) addRow(); // Add one empty row
    else renderTable();
    calculateGPA();
}

// --- Core Logic ---
function addRow() {
    const id = Date.now();
    courses.push({ id, code: '', units: '', grade: 'A' });
    renderTable();
    save();
}

function deleteRow(id) {
    courses = courses.filter(c => c.id !== id);
    renderTable();
    calculateGPA();
    save();
}

function updateCourse(id, field, value) {
    const course = courses.find(c => c.id === id);
    if (field === 'units') value = parseFloat(value) || 0;
    course[field] = value;
    calculateGPA();
    save();
}

function calculateGPA() {
    let totalUnits = 0;
    let totalPoints = 0;

    courses.forEach(c => {
        if (c.units > 0) {
            totalUnits += c.units;
            totalPoints += (c.units * gradeScale[c.grade]);
        }
    });

    const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";
    gpaDisplay.innerText = gpa;
    document.getElementById('total-units').innerText = totalUnits;
    document.getElementById('total-points').innerText = totalPoints;
    
    runAdvisor(parseFloat(gpa), totalUnits);
}

// --- AI Performance Advisor (Rule-Based) ---
function runAdvisor(currentGpa, totalUnits) {
    const target = parseFloat(targetInput.value);
    const output = document.getElementById('advisor-output');
    
    if (!target || isNaN(target)) return;

    if (currentGpa >= target) {
        output.innerHTML = "<span style='color:green'>Great work! You are currently meeting your target.</span>";
    } else {
        const gap = (target * (totalUnits + 3) - (currentGpa * totalUnits)) / 3;
        output.innerHTML = `To reach ${target}, your next 3-unit course needs a grade of <strong>${gap > 5 ? 'A+' : 'A'}</strong>.`;
    }
}

// --- DOM Rendering ---
function renderTable() {
    courseBody.innerHTML = '';
    courses.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${c.code}" oninput="updateCourse(${c.id}, 'code', this.value)"></td>
            <td><input type="number" value="${c.units}" oninput="updateCourse(${c.id}, 'units', this.value)"></td>
            <td>
                <select onchange="updateCourse(${c.id}, 'grade', this.value)">
                    ${Object.keys(gradeScale).map(g => `<option value="${g}" ${c.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
                </select>
            </td>
            <td><button onclick="deleteRow(${c.id})" style="color:red; cursor:pointer;">&times;</button></td>
        `;
        courseBody.appendChild(row);
    });
}

function save() { localStorage.setItem('gpa-courses', JSON.stringify(courses)); }

// Event Listeners
addRowBtn.addEventListener('click', addRow);
targetInput.addEventListener('input', () => calculateGPA());
document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm("Clear all records?")) {
        courses = [];
        localStorage.clear();
        init();
    }
});

init();