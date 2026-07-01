# EXCELFLOW - DEVELOPMENT EXECUTION RULES

1. NEVER ASSUME THE CODEBASE: Before writing any code, inspect and understand the entire codebase that is relevant to the requested change. Do not assume how anything works.
2. NEVER REWRITE WORKING CODE: Do not replace working implementations. Extend existing functionality. If an existing implementation already works correctly, leave it untouched.
3. IMPLEMENT SMALL CHANGES: Never modify multiple unrelated systems at once. Complete one feature. Verify it. Then move to the next feature.
4. CHECK DEPENDENCIES: Before modifying any file determine which files depend on it, which files it depends on, how data flows through it, and what side effects will occur.
5. NEVER BREAK EXISTING FEATURES: The Workflow Canvas, Execution Engine, Existing Tools, Save/Load, UI, Undo/Redo must continue working exactly as they do today.
6. DIAGNOSE BEFORE CODING: Look for Runtime errors, Infinite loops, Soft locks, Hard locks, Circular execution, State inconsistencies, Memory leaks, Duplicate execution, Race conditions, Broken dependencies before adding new functionality.
7. REGRESSION TEST EVERY CHANGE: After every implementation verify the project builds successfully, no compile/runtime errors exist, and existing workflows still execute.
8. PRESERVE APPLICATION ARCHITECTURE: Do not redesign the Folder structure, State management, UI, Component hierarchy, Workflow engine, Data model, Tool architecture.
9. ERROR HANDLING: Every new implementation must include validation, error handling, safe failure behavior, helpful error messages, and graceful recovery.
10. PERFORMANCE: Do not introduce unnecessary re-renders, duplicate calculations, large object cloning, blocking operations, memory leaks, or excessive event listeners.
11. THINK LIKE A SENIOR ENGINEER: First understand. Then plan. Then implement. Then verify. Then test.
12. PROTECT THE CODEBASE: Treat the codebase like production software. Never sacrifice stability for speed.
