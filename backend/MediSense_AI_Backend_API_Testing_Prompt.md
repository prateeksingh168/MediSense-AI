# MediSense AI — Backend API Test & Fix Prompt

> Use this prompt AFTER the backend (from the PRD) is built and running. Paste this directly into Google Antigravity. It works whether the backend is already running locally or needs to be started first.

---

## Prompt to paste:

```
You are testing the MediSense AI FastAPI backend located in `backend/`. Do the following, in order, and do not skip or shortcut any step.

STEP 1 — START THE SERVER
Start the backend with `uvicorn app.main:app --reload` (or the correct entrypoint if different). Confirm it boots without errors and that Swagger UI is reachable at `/docs`. If it fails to start, fix the startup error first and report exactly what was broken and how you fixed it before continuing.

STEP 2 — ENUMERATE EVERY ENDPOINT
List every single registered route from the OpenAPI schema (`/openapi.json`), grouped by method (GET, POST, PUT, DELETE, PATCH — include all that exist). For each route, note its expected request schema, response schema, and whether it requires authentication (patient JWT, doctor JWT, or none).

STEP 3 — TEST EVERY ENDPOINT, EVERY METHOD
For EACH endpoint, write and run an automated test (pytest + httpx, or direct curl/requests calls) that covers:
- The happy path (valid input, correct auth) — expect success and validate the exact response shape.
- At least one invalid-input case (expect a proper 4xx, not a 500).
- Auth failure case where relevant (missing token, wrong role) — expect 401/403.
- Not-found case where relevant (invalid ID) — expect 404.

This includes explicitly testing:
- POST /auth/register and POST /auth/login
- GET/PUT /patients/{patient_id}
- POST /symptoms/analyze and GET /symptoms/history/{patient_id}
- POST/GET /health-records
- GET /doctor/cases and GET /doctor/cases/{case_id}
- POST /doctor/decision
- Any other route not listed above that exists in the actual codebase.

STEP 4 — REPORT RESULTS WITH ZERO HIDING
Produce a full results table with these exact columns: Endpoint | Method | Test Case | Status (PASS / FAIL / SKIPPED) | Reason (if FAIL or SKIPPED).
- Do not omit any failing test from the report.
- Do not silently skip a test and leave it out of the table — if something is skipped (e.g. AI service not available, dependency missing), it must appear in the table with SKIPPED and the exact reason.
- For every FAIL, give the root cause: is it a validation bug, a wrong status code, a missing field in the response, an auth bug, a DB constraint issue, a wrong data type, a broken foreign key, an unhandled exception, etc.? Show the actual error/traceback, not a paraphrase.
- Give a one-line summary at the top: total tests run, total passed, total failed, total skipped.

STEP 5 — FIX EVERY FAILURE
For every FAIL in the table, go fix the actual root cause in the backend code (not the test — don't weaken the test to make it pass unless the test itself was wrong, and if so, explain why it was wrong).
After each fix, re-run that specific test and confirm it now passes. Update the results table to reflect the new status.

STEP 6 — RE-VERIFY EVERYTHING END-TO-END
After all fixes, re-run the ENTIRE test suite from Step 3 again (not just the previously-failing ones) to confirm no regressions were introduced. Report the final full results table again.

STEP 7 — MANUAL SWAGGER UI VERIFICATION
Open `/docs` and for each endpoint, confirm:
- It appears with the correct HTTP method badge (GET/POST/PUT/DELETE).
- The request body schema (if any) renders correctly with example values.
- The response schema renders correctly (no raw untyped dict).
- "Try it out" actually works end-to-end for at least one call per endpoint (register a test user, log in, use the token via the Authorize button, and hit at least one protected endpoint successfully).
Report any endpoint where Swagger UI rendering is broken, missing a schema, or "Try it out" fails, along with the fix applied.

STEP 8 — FINAL SUMMARY
Give a final honest summary: is every single endpoint (GET, POST, PUT, DELETE) fully working with correct status codes, correct response shape, and correct Swagger UI rendering? If anything is still not fully working, say so explicitly — do not report success if something is still broken or was only partially tested.
```

---

### Notes for you (Arin) before using this
- If Member 4's real AI service isn't ready yet, the "AI service not available" SKIPPED result is expected and fine — just make sure the report says so explicitly instead of hiding it, and that the stub client (from the PRD, Phase 4/Section 6) is still fully tested on its own.
- Run this prompt again any time after merging in database/AI changes from teammates — integration often breaks things that passed in isolation.
