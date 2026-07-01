# ExcelFlow - Easy Data Transformation & ETL Canvas

ExcelFlow is a visual, browser-based ETL (Extract, Transform, Load) workflow canvas designed for data analysts, operations managers, and benefits consultants. Inspired by enterprise tools like Alteryx, ExcelFlow replaces complex, error-prone manual spreadsheet operations with clean, self-documenting visual pipelines.

## 💼 ExcelFlow in Your Day-to-Day Work

If your daily routine involves wrangling client spreadsheets, matching census logs, or formatting data tables, ExcelFlow can automate your entire workflow:

### 1. **Replacing Nested Excel Formulas & Macros**
* **Before**: Writing long, unreadable formulas like `=IF(A2="Life", B2*1000, IF(A2="ADD", C2*2000, ...))` that break when column names change.
* **With ExcelFlow**: Drag a **Formula** or **Volume & Increment Mapping** block. Connect it, configure the mappings visually, and run. Any team member can instantly audit the logic by clicking on the node.

### 2. **Instant Data Profiling & Quality Checks**
* **Problem**: Processing a 20,000-row file only to realize later that 5% of the SSNs were missing or formatted as dates.
* **With ExcelFlow**: The bottom **Live Flow Preview Panel** profiles your data after every execution. It automatically displays the predominant data type (Number, Text, Date, Boolean), the total populated value count, and details any nulls in highlighted orange warning text.

### 3. **Smart Duplicate Key Resolutions (Dependent Matching)**
* **Problem**: Merging claims with employee census records where multiple dependents share the same SSN, causing standard lookup functions to return the wrong name.
* **With ExcelFlow**: The **Smart Match** node uses a weighted criteria scorecard to automatically check First/Last Name similarity (using Levenshtein distance) and normalize relationships (EE, Spouse, Child) to pair claims with the exact correct record.

### 4. **No-Code ETL Pipelines**
* Load multiple files, filter records, stack them vertically (Union), rename columns, split text fields, deduplicate rows, and run custom Python simulations—all in one visual workspace that you can save and reload.

---

## 🚀 Overview of Latest Stability Update & Features

The purpose of this update was to solve critical user experience bugs in the **Live Flow Preview Panel**, add deep profiling metrics underneath column headers, and implement two new major ETL nodes to handle complex client file integrations:
1. **Smart Match / Relationship Match Tool**: Resolves duplicate-key lookups by using multi-column weighted similarity scoring and relation-specific matching.
2. **Volume & Increment Mapping Tool**: Automates volume, increment, and requested increment field population based on auto-detected or manual coverage names and customizable mapping rules.

---

## 🎨 Preview Panel Enhancements

### 1. Preview Sync & Refresh Bug Fix
Previously, when selecting, deselecting, and reselecting properties configuration fields, the preview panel would fail to refresh and continue displaying the stale deselected state.
- **How it works**: 
  - When you edit configuration parameters in any block, the node is marked as `'stale'` and its `outputData` is immediately set to `null` to clear the old cache.
  - When the pipeline runs (standalone or global), a spinner is displayed (`Executing node pipeline...`), and the old preview is wiped.
  - Upon successful execution, the `VirtualTable` is completely rebuilt from scratch using a unique React key containing the execution timestamp (`key="${nodeId}_${lastRunTime}"`). This clears scroll parameters and forces column/row metadata to re-bind.
  - If a node encounters a compilation or execution error, the Preview Panel intercepts the error list and renders a clear error dashboard detailing the failure.

### 2. Column Value Counts & Statistics
The Preview Panel now displays metadata below every column header:
- **Data Type**: Dynamically detects the predominant data type of the column: `(Number)`, `(Date)`, `(Boolean)`, or `(Text)`.
- **Values**: Displays the total count of populated (non-null, non-blank) rows formatted with thousand-separators (e.g. `Values: 12,584`).
- **Nulls**: Displays the count of missing, blank, or null cells (e.g., `Nulls: 32`). If the null count is greater than 0, the text is highlighted in vibrant orange to notify the analyst.

---

## 🔀 Smart Match / Relationship Match Tool

### Purpose
Standard lookup or join operations fail when multiple records have duplicate keys. For example, if a client file contains multiple records with the same Employee SSN (e.g., Employee, Spouse, Son, Daughter), a normal VLOOKUP or JOIN will always return the *first* record it finds, resulting in incorrect data matching downstream.

The **Smart Match Tool** matches records using multiple criteria and a weighted confidence scoring algorithm to select the **best and most accurate** candidate.

### Configuration
1. **Primary Key A & B**: Select the duplicate-containing identifier (e.g. `Employee SSN` in both files).
2. **Matching Criteria Table**: Add rule criteria mapping left columns to right columns:
   - **Match Type**: 
     - `Exact`: Values must be equal (case-insensitive, trimmed).
     - `Fuzzy`: Calculates Levenshtein Similarity ($1 - \frac{\text{Distance}}{\text{Max Length}}$) between strings.
     - `Relationship`: Normalizes common relationship codings (e.g., `EE`, `Self`, `Subscriber` $\rightarrow$ `employee`; `SP`, `Spouse`, `Wife` $\rightarrow$ `spouse`; `CH`, `Child`, `Son` $\rightarrow$ `child`) and checks for equivalence.
   - **Weight**: Set a weight multiplier between `0.1` and `1.0` reflecting the importance of the criterion.
3. **Criteria List**: Display and delete configured comparison pairs.

### Matching Algorithm
For each row $r_A$ in File A:
1. Fetch all candidate rows in File B matching the primary key $r_A[Key_A] = r_B[Key_B]$.
2. If no candidate matches, the row is classified as **Unmatched**.
3. For each candidate row $r_B$, calculate the total match score:
   $$\text{Score} = \frac{\text{Primary Weight (1.0)} + \sum (\text{Similarity} \times \text{Weight})}{\text{Primary Weight (1.0)} + \sum \text{Weight}}$$
4. Select the candidate with the highest score.
5. Classify the best match:
   - $\text{Score} = 1.0 \rightarrow$ **Perfect Match**
   - $\text{Score} \ge 0.8 \rightarrow$ **Best Match**
   - $\text{Score} \ge 0.5 \rightarrow$ **Possible Match**
   - $\text{Score} < 0.5 \rightarrow$ **Unmatched**
6. Append B's fields (using a `_B` suffix for collisions) along with `Match_Status`, `Match_Confidence`, and `Match_Score` to the output dataset.

### Outputs
- Combined dataset containing all matched and unmatched records.
- **Smart Match Report**: Renders directly in the Properties tab after execution, showing total count of Perfect, Best, Possible, and Unmatched rows, left/right duplicate key counts, and the overall Match Rate percentage.

---

## ⚙️ Volume & Increment Mapping Tool

### Purpose
Automates the population of `Volume`, `Increment`, and `Requested Increment` fields based on the `Coverage Name` column. Since different clients use different naming conventions and layouts, this tool provides a flexible rule engine to replace hardcoded mappings.

### Configuration
1. **Coverage Name Column**: Select the column containing coverage products. Set to `-- Auto-Detect Column --` by default, which automatically scans for columns containing `coverage`, `product`, `plan`, `benefit`, or `class`.
2. **Destination Columns**: Define target output columns (defaults: `Volume`, `Increment`, and `Requested_Increment`).
3. **Overwrite Checkbox**: Toggle whether to overwrite existing columns in the dataset if the name matches. By default, it creates new columns.
4. **Restrict Source Columns (Optional)**: Checkboxes to select a manual subset of input columns. If set, dropdowns in the rule builder only display these checked columns.
5. **Mapping Rules**: Pair a specific coverage name (e.g. `Employee Life`) to:
   - **Volume Source**: Select a column (e.g., `Employee Life Amount`) or type a custom static value.
   - **Increment Source**: Select a column or type a static value.
   - **Requested Increment Source**: Select a column or type a static value.

### Output Generation
During execution:
1. Evaluates the coverage column value for each row.
2. Matches it against the list of rules (case-insensitive, trimmed).
3. If matched, extracts the values (resolving them from the source columns if they exist, or using them as literal values if not) and saves them into the destination columns.
4. If no rule matches, leaves the destination columns blank (or preserves original values if overwrite is disabled).

---

## 📊 Example Workflows

### Example 1: Resolving Dependent Claims (Smart Match)
- **File A (Census)**: Contains `SSN`, `First Name`, `Last Name`, `Relationship`. Has duplicates on SSN because dependents share the employee's SSN.
- **File B (Claims)**: Contains `SSN`, `Claimant Name`, `DOB`.
- **Workflow**:
  1. Add a **Smart Match** block. Connect Census to `In1` and Claims to `In2`.
  2. Set Primary Key A to `SSN` and Primary Key B to `SSN`.
  3. Add a fuzzy match criterion comparing `First Name` (Census) with `Claimant Name` (Claims), weight `0.8`.
  4. Run Pipeline.
  5. The output dataset merges Census and Claims, assigning each claim to the correct dependent (spouse, son, employee) rather than matching everyone to the primary employee.

### Example 2: Client Census Ingestion (Volume Mapping)
- **File A**: Input census containing columns: `CoverageType`, `EE Life Amt`, `Dep Life Amt`.
- **Workflow**:
  1. Add a **Volume & Increment** block.
  2. Leave Coverage Column as `Auto-Detect` (correctly maps to `CoverageType`).
  3. Add rule:
     - Coverage: `EE Life` $\rightarrow$ Volume: `EE Life Amt`, Increment: `10000`, Req. Incr: `10000`
  4. Add rule:
     - Coverage: `Dep Life` $\rightarrow$ Volume: `Dep Life Amt`, Increment: `5000`, Req. Incr: `5000`
  5. Run Pipeline.
  6. The output contains three clean columns (`Volume`, `Increment`, `Requested_Increment`) dynamically filled based on product values.

---

## ⚠️ Limitations
- **Fuzzy Similarity**: String fuzzy matches rely on Levenshtein distance. Very short strings (e.g., initials) may result in high similarity scores and should be weighted lower.
- **Auto-Detection**: Auto-detecting the coverage column relies on string matching. If your coverage column is named something completely unrelated (e.g., `Col_4`), you must select it manually in the properties dropdown.
