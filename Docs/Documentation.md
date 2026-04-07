# Technical Documentation: GPA Computation Tool

## 1. Project Overview
The **Academic GPA Computation Tool** is a web-based application designed to help students calculate their Grade Point Average (GPA) based on the **SAFRecords** institutional grading module. It features a dynamic tabular interface, persistent data storage, and an AI-driven performance advisor.

## 2. Technical Architecture
The application is built using a "State-First" approach. Instead of reading data directly from the HTML table, the logic manages a JavaScript Array of Objects, which then renders the UI.

### Data Structure
Each course is represented as an object:
```javascript
{
    id: 1712495000000, // Unique timestamp ID
    code: "COS101",    // Course identifier
    units: 3,          // Credit load
    grade: "A"         // Letter grade
}
```

## 3. Core Logic & Formulas
### GPA Calculation
The system iterates through the `courses` array to calculate the **Quality Point (QP)** for each course (Units × Grade Value). It then applies the standard formula:
GPA = ∑(Units x Grade Value) / ∑ (Total Units)

### Grade-to-Point Mapping
The tool follows a 5.0 scale:
* **A:** 5.0 | **B:** 4.0 | **C:** 3.0 | **D:** 2.0 | **E:** 1.0 | **F:** 0.0

## 4. Key Modules
### Persistent Storage (`LocalStorage`)
To ensure students don't lose their data on page refresh, the `save()` function stringifies the course array and stores it in the browser's local database.
* **Function:** `localStorage.setItem('gpa-courses', JSON.stringify(courses))`

### AI Performance Advisor
This module uses a **Goal-Seeking Algorithm**. It takes the user's `Target GPA` and calculates the required "Quality Points" needed in future units to reach that average.
* **Logic:** `(Target * (CurrentUnits + FutureUnits) - CurrentPoints) / FutureUnits`

### Print Optimization
The application uses a specific CSS `@media print` stylesheet. This removes interactive elements (buttons, inputs, advisor card) and adjusts the table width to 100% for a clean paper/PDF output.

## 5. UI/UX Design
* **Color Palette:** Palette 3 ( #00798C, #003D5B, #EDAE49).
* **Responsiveness:** Implemented via CSS Flexbox and media queries for mobile accessibility.
* **Validation:** Event listeners prevent string inputs in numeric fields and ensure a minimum of 0 units.