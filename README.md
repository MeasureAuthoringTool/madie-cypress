# MADiE Cypress – New Hire Onboarding & Local Setup Guide

> **Last updated:** March 2026  
> This document walks a new team member through setting up the **madie-cypress** automated-testing project on their local machine, running tests in Cypress Open mode, and understanding the most important parts of the codebase.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Clone the Repository](#3-clone-the-repository)
4. [Install Dependencies](#4-install-dependencies)
5. [Configure Environment Variables](#5-configure-environment-variables)
6. [Run Cypress in Open Mode](#6-run-cypress-in-open-mode)
7. [Running Tests in Headless / CI Mode](#7-running-tests-in-headless--ci-mode)
8. [Project Structure – Key Areas Explained](#8-project-structure--key-areas-explained)
9. [Environment Configuration Files](#9-environment-configuration-files)
10. [Shared Page Objects & Utilities](#10-shared-page-objects--utilities)
11. [Custom Commands & Support Files](#11-custom-commands--support-files)
12. [Plugins & Task Definitions](#12-plugins--task-definitions)
13. [Reporting](#13-reporting)
14. [Parallel Execution](#14-parallel-execution)
15. [Docker (CI Pipeline)](#15-docker-ci-pipeline)
16. [Troubleshooting / FAQ](#16-troubleshooting--faq)

---

## 1. Project Overview

**madie-cypress** is the end-to-end and API test automation suite for the **MADiE** (Measure Authoring Development Integrated Environment) application built by CMS. The suite is written in **TypeScript** and uses the **Cypress** testing framework (v15+). Tests cover:

| Area | Location |
|---|---|
| **UI / WebInterface tests** | `cypress/e2e/WebInterface/` |
| **API / Service tests** | `cypress/e2e/Services/` |

Tests run against multiple target environments: **dev**, **test**, **impl**, **hcqis-dev**, and **hcqis-test**. Each environment has its own config JSON under `cypress/config/`.

---

## 2. Prerequisites

### Mac (macOS)

| Tool | Minimum Version | Install |
|---|---|---|
| **Node.js** | **>24.0.0** | `brew install node` or use [nvm](https://github.com/nvm-sh/nvm): `nvm install 24` |
| **npm** | **>11.6.0** | Comes with Node.js. Verify: `npm -v` |
| **Git** | Latest | `brew install git` |
| **Google Chrome** | Latest stable | Download from [google.com/chrome](https://www.google.com/chrome/) |
| **IDE** | IntelliJ IDEA (recommended) or VS Code | The QA team primarily uses IntelliJ |

### Windows (PC)

| Tool | Minimum Version | Install |
|---|---|---|
| **Node.js** | **>24.0.0** | Download from [nodejs.org](https://nodejs.org/) or use [nvm-windows](https://github.com/coreybutler/nvm-windows): `nvm install 24` |
| **npm** | **>11.6.0** | Comes with Node.js. Verify: `npm -v` |
| **Git** | Latest | Download from [git-scm.com](https://git-scm.com/download/win) |
| **Google Chrome** | Latest stable | Download from [google.com/chrome](https://www.google.com/chrome/) |
| **IDE** | IntelliJ IDEA (recommended) or VS Code | |

> ⚠️ **IMPORTANT:** Do **NOT** install Cypress or its related tools as `sudo` (Mac) or **Administrator** (Windows). Always install as your normal user.

---

## 3. Clone the Repository

```bash
# Mac / Windows (Git Bash or terminal)
git clone <repository-url> madie-cypress
cd madie-cypress
```

Open the cloned folder in **IntelliJ IDEA** (or your preferred IDE).

---

## 4. Install Dependencies

```bash
npm install
```

> **Tip:** If you encounter issues, delete the `node_modules/` folder and `package-lock.json`, then re-run `npm install`.

Verify Cypress installed correctly:

```bash
npx cypress verify
```

You should see a success message with the Cypress version.

### Code Formatting

This project uses Prettier for shared code formatting. Prettier is installed as a project dev dependency, so no global Prettier install is required after running `npm install`. The Prettier configuration is committed to the repo so command-line formatting and IDE formatting use the same rules.

Format one or more files:

```bash
npm run format -- cypress/e2e/path/to/file.cy.ts
```

Check whether one or more files already match the shared formatting:

```bash
npm run format:check -- cypress/e2e/path/to/file.cy.ts
```

Prettier formats the entire file passed to it. To keep PR diffs focused, format the files you are already changing unless the team agrees on a dedicated formatting-only PR.

#### VS Code Users

Install the Prettier extension and enable `prettier.requireConfig` so Prettier only runs in projects that have a repo-level config.

```json
{
    "prettier.requireConfig": true
}
```

---

## 5. Configure Environment Variables

Tests require **credentials** and **API keys** that must never be committed to source control. All variables are set as **shell environment variables** prefixed with `CYPRESS_`.

> **How it works:** Cypress automatically picks up any OS-level environment variable that starts with `CYPRESS_` and strips that prefix at runtime. For example, setting `CYPRESS_TEST_USERNAME` in your shell makes it available in tests as `Cypress.env('TEST_USERNAME')`.

Refer to `cypress.env.default.json` in the project root for the full list of variables you need to set. Ask your team lead or check the team's secure credential store for the actual values.

### Required variables

| Variable (set in shell) | Purpose |
|---|---|
| `CYPRESS_VSAC_API_KEY` | UMLS / VSAC API key for terminology lookups |
| `CYPRESS_TEST_USERNAME` / `CYPRESS_TEST_PASSWORD` | Primary HARP test user credentials |
| `CYPRESS_TEST_USERNAME2` / `CYPRESS_TEST_PASSWORD2` | Second parallel test user |
| `CYPRESS_TEST_USERNAME3` / `CYPRESS_TEST_PASSWORD3` | Third parallel test user |
| `CYPRESS_TEST_ALT_USERNAME` / `CYPRESS_TEST_ALT_PASSWORD` | Alternate user (measure sharing tests) |
| `CYPRESS_TEST_ALT_USERNAME2` / `CYPRESS_TEST_ALT_PASSWORD2` | Second alternate user |
| `CYPRESS_TEST_ALT_USERNAME3` / `CYPRESS_TEST_ALT_PASSWORD3` | Third alternate user |
| `CYPRESS_TEST_MADIE_AUTHURI` | Okta authorization URI |
| `CYPRESS_TEST_MADIE_REDIRECTURI` | OAuth redirect URI |
| `CYPRESS_TEST_MADIE_CLIENTID` | OAuth client ID |
| `CYPRESS_TEST_MEASURESHARING_API_KEY` | Measure sharing API key |
| `CYPRESS_TEST_ADMIN_API_KEY` | Admin API key |
| `CYPRESS_DEV_*`, `CYPRESS_IMPL_*` | Same pattern for other environments |

### Mac (macOS)

Add exports to your shell profile. Use `~/.zshrc` if you're on zsh (default on modern macOS) or `~/.bash_profile` if you use bash:

```bash
# ~/.zshrc  or  ~/.bash_profile

export CYPRESS_VSAC_API_KEY="your_api_key"

# Test environment credentials
export CYPRESS_TEST_USERNAME="your_harp_user"
export CYPRESS_TEST_PASSWORD="your_harp_password"
export CYPRESS_TEST_USERNAME2="second_user"
export CYPRESS_TEST_PASSWORD2="second_password"
export CYPRESS_TEST_USERNAME3="third_user"
export CYPRESS_TEST_PASSWORD3="third_password"
export CYPRESS_TEST_ALT_USERNAME="alt_user"
export CYPRESS_TEST_ALT_PASSWORD="alt_password"
export CYPRESS_TEST_ALT_USERNAME2="alt_user2"
export CYPRESS_TEST_ALT_PASSWORD2="alt_password2"
export CYPRESS_TEST_ALT_USERNAME3="alt_user3"
export CYPRESS_TEST_ALT_PASSWORD3="alt_password3"

# Test environment OAuth
export CYPRESS_TEST_MADIE_AUTHURI="https://..."
export CYPRESS_TEST_MADIE_REDIRECTURI="https://..."
export CYPRESS_TEST_MADIE_CLIENTID="your_client_id"

# Test environment API keys
export CYPRESS_TEST_MEASURESHARING_API_KEY="..."
export CYPRESS_TEST_ADMIN_API_KEY="..."

# Repeat for DEV_* and IMPL_* as needed
```

After saving, reload the profile:

```bash
source ~/.zshrc        # or: source ~/.bash_profile
```

> **Tip:** If you get "Permission denied" editing your profile, run: `sudo chown $(whoami) ~/.zshrc`

### Windows (PC)

#### Option 1 – Permanent (recommended)

Set variables permanently so they persist across terminal sessions:

1. Open **Start → Settings → System → About → Advanced system settings**.
2. Click **Environment Variables**.
3. Under **User variables**, click **New** for each variable (e.g., Name: `CYPRESS_TEST_USERNAME`, Value: `your_harp_user`).
4. Click **OK** and restart your terminal.

#### Option 2 – PowerShell session (temporary)

```powershell
$env:CYPRESS_VSAC_API_KEY = "your_api_key"
$env:CYPRESS_TEST_USERNAME = "your_harp_user"
$env:CYPRESS_TEST_PASSWORD = "your_harp_password"
$env:CYPRESS_TEST_USERNAME2 = "second_user"
$env:CYPRESS_TEST_PASSWORD2 = "second_password"
$env:CYPRESS_TEST_USERNAME3 = "third_user"
$env:CYPRESS_TEST_PASSWORD3 = "third_password"
$env:CYPRESS_TEST_ALT_USERNAME = "alt_user"
$env:CYPRESS_TEST_ALT_PASSWORD = "alt_password"
$env:CYPRESS_TEST_ALT_USERNAME2 = "alt_user2"
$env:CYPRESS_TEST_ALT_PASSWORD2 = "alt_password2"
$env:CYPRESS_TEST_ALT_USERNAME3 = "alt_user3"
$env:CYPRESS_TEST_ALT_PASSWORD3 = "alt_password3"
$env:CYPRESS_TEST_MADIE_AUTHURI = "https://..."
$env:CYPRESS_TEST_MADIE_REDIRECTURI = "https://..."
$env:CYPRESS_TEST_MADIE_CLIENTID = "your_client_id"
$env:CYPRESS_TEST_MEASURESHARING_API_KEY = "..."
$env:CYPRESS_TEST_ADMIN_API_KEY = "..."
# Repeat for DEV_* and IMPL_* as needed
```

> ⚠️ These session variables are lost when you close the terminal. Use Option 1 for a persistent setup.

### Verify your variables are set

```bash
# Mac / Git Bash
echo $CYPRESS_TEST_USERNAME

# Windows PowerShell
echo $env:CYPRESS_TEST_USERNAME
```

If the value prints correctly, you're good to go.

### Alternate approach – `cypress.env.json` file

If you prefer to keep variables in a file rather than your shell profile, you can use a local `cypress.env.json` instead:

1. Copy the template:

   ```bash
   cp cypress.env.default.json cypress.env.json
   ```

2. Open `cypress.env.json` and fill in the values. Obtain the values for each variable from the team, as needed.

   > `cypress.env.json` is **gitignored** — your secrets stay local.

> **Note:** If both shell variables and `cypress.env.json` exist, `cypress.env.json` values take precedence.

---

## 6. Run Cypress in Open Mode

Open mode launches the interactive Cypress Test Runner — this is how you'll develop and debug tests day-to-day.

### Choose your target environment:

| Command | Environment |
|---|---|
| `npm run cypress:open:dev` | **dev** – `https://dev.madie.internal.cms.gov` |
| `npm run cypress:open:test` | **test** – `https://test.madie.internal.cms.gov` |
| `npm run cypress:open:hcqis-dev` | **hcqis-dev** |
| `npm run cypress:open:hcqis-test` | **hcqis-test** |
| `npm run cypress:open:impl` | **impl** – `https://impl.madie.internal.cms.gov` |

**Example – open against the dev environment:**

```bash
npm run cypress:open:dev
```

This will:
1. Launch the Cypress Test Runner GUI.
2. Use Chrome as the browser (`-b chrome`).
3. Load environment-specific config from `cypress/config/dev.json`.
4. Display all `*.cy.ts` spec files under `cypress/e2e/`.

From the GUI you can click on any spec file to run it. You'll see the test execute in a real Chrome browser with full DOM inspection, time-travel debugging, and network-level visibility.

### IntelliJ run/debug configurations

You can also set up **local run/debug configurations in IntelliJ** to execute these commands directly from the IDE instead of the terminal. This is useful for quickly launching a specific environment or spec file with one click.

### Windows-specific notes

The `npm run cypress:open:*` commands work identically on Windows. However, if you use **headless run** scripts, the project provides Windows-specific npm scripts prefixed with `windows:` (e.g., `npm run windows:test:all:tests`). These use Windows-style path separators.

---

## 7. Running Tests in Headless / CI Mode

```bash
# Run all tests against dev (headed – you can see the browser)
npm run cy:run

# Run all UI smoke tests against test env (headed)
npm run test:ui:smoketests:headed

# Run all tests and generate Mochawesome report
npm run dev:all:tests:report
```

Running a `:report` script (e.g., `npm run dev:all:ui:tests:report`) will execute the tests **and** automatically generate a Mochawesome HTML report placed in the `mochawesome-report/` folder. More test scripts can be added and configured in the `package.json` file.

---

## 8. Project Structure – Key Areas Explained

```
madie-cypress/
│
├── cypress.config.ts          ★ Main Cypress configuration (timeouts, viewport, plugins, baseUrl)
├── cypress.env.default.json   ★ Reference list of all required env variables (can copy to cypress.env.json)
├── package.json               ★ npm scripts, dependencies, engine requirements
├── tsconfig.json                TypeScript compiler settings
│
├── cypress/
│   ├── config/                ★ Per-environment config files (dev.json, test.json, impl.json, etc.)
│   │
│   ├── e2e/                   ★ ALL TEST SPECS live here
│   │   ├── WebInterface/        UI tests (Smoke Tests, Measures, CQL Library, Test Cases, etc.)
│   │   └── Services/            API/service-level tests (Measure Service, CQL Library Service, etc.)
│   │
│   ├── Shared/                ★ PAGE OBJECTS & UTILITIES (the most important code to learn)
│   │   ├── OktaLogin.ts         Login / logout flows via Okta
│   │   ├── CreateMeasurePage.ts  Create measures (UI + API helpers)
│   │   ├── MeasuresPage.ts      My Measures / All Measures page interactions
│   │   ├── EditMeasurePage.ts   Edit measure page locators & helpers
│   │   ├── CQLEditorPage.ts     CQL Editor interactions
│   │   ├── TestCasesPage.ts     Test case creation & editing
│   │   ├── MeasureGroupPage.ts  Population criteria / measure groups
│   │   ├── MeasureCQL.ts        CQL code snippets used in tests
│   │   ├── TestCaseJson.ts      JSON bundles used for test cases
│   │   ├── Environment.ts       Maps env vars to credentials per environment
│   │   ├── Utilities.ts         Reusable wait helpers & common utilities
│   │   ├── Header.ts            Top-nav element locators
│   │   └── ... (more page objects)
│   │
│   ├── support/
│   │   ├── e2e.ts             ★ Global setup – runs before every spec (imports, user locking, error handling)
│   │   └── commands.ts        ★ Custom Cypress commands (login cookies, UMLS login, drag helpers, etc.)
│   │
│   ├── plugins/
│   │   └── index.js           ★ Node-side tasks (file I/O, unzip, user lock management)
│   │
│   ├── fixtures/                Static test data (JSON, CQL, Excel, ZIP files)
│   ├── results/                 Mochawesome JSON output (generated at runtime)
│   └── downloads/               Downloaded files during tests
│
├── mochawesome-report/          Generated HTML reports
├── runner-results/              Parallel runner JSON results
├── scripts/                     Helper scripts (e.g., remove-empty-logout.js)
├── Dockerfile                   Docker image for CI pipeline
├── docker-compose.yml           Docker Compose for running tests in containers
├── Jenkinsfile                  CI/CD pipeline definition
└── user-locks/                  User lock files for parallel test execution
```

---

## 9. Environment Configuration Files

**Location:** `cypress/config/`

Each JSON file sets the `baseUrl` and `environment` name for a target:

| File | `baseUrl` | When to use |
|---|---|---|
| `dev.json` | `https://dev.madie.internal.cms.gov` | Day-to-day development testing |
| `test.json` | `https://test.madie.internal.cms.gov` | Formal test environment |
| `impl.json` | `https://impl.madie.internal.cms.gov` | Implementation / staging |
| `hcqis-dev.json` | HCQIS dev environment | Alternate dev infra |
| `hcqis-test.json` | HCQIS test environment | Alternate test infra |

The `--env configFile=dev` flag (in npm scripts) tells the plugin system (`cypress/plugins/index.js`) to load the matching JSON file and merge it into Cypress's config at runtime.

---

## 10. Shared Page Objects & Utilities

**Location:** `cypress/Shared/`

This is the **most important folder to learn**. It follows the **Page Object Model (POM)** pattern:

| File | Purpose |
|---|---|
| **`OktaLogin.ts`** | Handles the full Okta authentication flow. Supports multiple users (`Login`, `AltLogin`, `AdminLogin`) for parallel test isolation and measure-sharing scenarios. Uses `cy.session()` for caching sessions. |
| **`Environment.ts`** | Central mapping of `Cypress.env()` variables to credential objects. The `credentials()` method switches on the active environment (dev/test/impl) to return the right username/password/API key set. The `authentication()` method returns OAuth endpoints per environment. |
| **`CreateMeasurePage.ts`** | Helpers to create measures through the UI and via direct **API calls** (much faster for test setup). Look for methods like `CreateQICoreMeasureAPI()` and `CreateQDMMeasureWithBaseConfigurationFieldsAPI()`. |
| **`MeasuresPage.ts`** | Locators and actions on the My Measures / All Measures list pages. The `actionCenter()` method is used frequently to click Edit, Export, Version, etc. |
| **`EditMeasurePage.ts`** | Element locators for the measure edit view (CQL Editor tab, Test Cases tab, etc.). |
| **`CQLEditorPage.ts`** | Interactions with the CQL code editor component. |
| **`TestCasesPage.ts`** | Create, edit, and validate test cases. |
| **`MeasureGroupPage.ts`** | Configure measure populations / groups (Proportion, Cohort, Ratio, CV). Contains API helpers like `CreateProportionMeasureGroupAPI()`. |
| **`MeasureCQL.ts`** | String constants containing CQL source code used across many tests. |
| **`TestCaseJson.ts`** | FHIR Bundle JSON strings used as test case input. |
| **`Utilities.ts`** | Common helper methods (e.g., `waitForElementVisible()`, waits, retries). |
| **`Header.ts`** | Top-navigation locators (MADiE home button, CQL Library tab, etc.). |

### Why this matters

Most test specs are short and declarative because the heavy lifting is in Shared. When you write a new test, you'll typically:
1. Call an API helper in `beforeEach` to create a measure/group/test-case.
2. Use `OktaLogin.Login()` to authenticate.
3. Use page object methods to navigate and interact.
4. Assert results.

---

## 11. Custom Commands & Support Files

### `cypress/support/commands.ts`
Registers custom Cypress commands available via `cy.*`:
- `cy.setAccessTokenCookie()` / `cy.setAccessTokenCookie2()` / `cy.setAccessTokenCookie3()` – Set auth cookies for different users.
- `cy.setAccessTokenCookieALT()` – Set auth cookie for the alternate user.
- `cy.UMLSAPIKeyLogin()` – Log into UMLS.
- `cy.cssType()` – Type into elements with special handling.
- `cy.dragSashToRight()` – Drag UI sash elements.

### `cypress/support/e2e.ts`
Runs **before every spec file**:
- Imports all plugins: `cypress-real-events`, `cypress-axe`, `cy-verify-downloads`.
- Suppresses uncaught exceptions (so React errors don't fail tests).
- Attaches screenshots to Mochawesome reports on failure.
- **User locking:** Before each spec, acquires an available HARP user (`harpUser`, `harpUser2`, or `harpUser3`) and alternate user via `cy.task('getAvailableUser')`. After the spec, releases them. This prevents credential collisions during parallel runs.

---

## 12. Plugins & Task Definitions

### `cypress/plugins/index.js`
Node-side code that runs in the Cypress server process:

| Task / Feature | What it does |
|---|---|
| `getConfigurationByFile(file)` | Loads the environment-specific JSON config from `cypress/config/` |
| `unzipFile` | Unzips downloaded export files for verification |
| `removeDirectory` | Cleans up download folders |
| `getAvailableUser` / `releaseUser` | File-based mutex system using `userLock.json` for parallel user management |
| `getAvailableAltUser` / `releaseAltUser` | Same for alternate users using `altUserLock.json` |
| `log` / `table` | Console logging from tests |

### `cypress.config.ts`
The master Cypress configuration. Key settings:
- **`chromeWebSecurity: false`** – Allows cross-origin requests (needed for Okta auth flow).
- **`defaultCommandTimeout: 50000`** (50s) – Tests interact with remote environments that can be slow.
- **`pageLoadTimeout: 100000`** (100s) – Generous page load timeout.
- **`viewportWidth: 1300, viewportHeight: 800`** – Desktop viewport.
- **`video: false`** – Video recording disabled to save resources.
- **`watchForFileChanges: false`** – Prevents auto-rerun on file save (intentional for this project).
- **`reporter: 'mochawesome'`** – Uses Mochawesome for test reports.
- Additional Node tasks: `readXlsx`, `readFileSafe`, `parseXML`, `checkUrl`.

---

## 13. Reporting

### Mochawesome Reports

After a headless run, JSON results are saved to `cypress/results/`. To generate an HTML report:

```bash
# Combine all JSON results into one file, then generate HTML
npm run combine:reports
npm run generateOne:report
```

Or use a convenience script that does it all:

```bash
npm run dev:all:ui:tests:report
```

The HTML report appears in `mochawesome-report/`. Open it in a browser to see pass/fail summaries with screenshots of failures.

### Windows note for reports

Use the `windows:` prefixed scripts for path compatibility:

```bash
npm run windows:combine:reports
```

---

## 14. Parallel Execution

The project uses **`cypress-parallel`** to split specs across multiple threads:

```bash
# Run smoke tests in parallel (3 threads) against test env
npm run cy:parallel:test:ui:smoketests
```

Parallel config is in `cypress/parallel-reporter-config.json` and `cypress/parallel-weights.json` (balances test distribution by historical runtime).

**User locking** (via `userLock.json` / `altUserLock.json`) ensures each parallel thread gets its own HARP user credentials — no two threads log in as the same user simultaneously.

---

## 15. Docker (CI Pipeline)

The `Dockerfile` builds an image based on `cypress/base:22.17.0` with:
- Node.js + npm
- Google Chrome
- AWS CLI (for CI artifact uploads)
- All npm dependencies pre-installed

`docker-compose.yml` maps all `CYPRESS_*` environment variables into the container. Jenkins pipelines (`Jenkinsfile`) use this to run tests in isolated containers.

You typically **do not** need Docker for local development — it's for CI/CD.

---

## 16. Troubleshooting / FAQ

### "Cypress could not verify that this server is running"
Make sure you're connected to the CMS network / VPN. The `baseUrl` targets (e.g., `dev.madie.internal.cms.gov`) are internal.

### "No users available" error
The user locking files may be in a stale state. Reset them:
```bash
echo '{}' > cypress/plugins/userLock.json
echo '{}' > cypress/plugins/altUserLock.json
```

### `npm install` fails
1. Delete `node_modules/` and `package-lock.json`.
2. Ensure Node.js ≥ 24 and npm ≥ 11.6 (`node -v && npm -v`).
3. Re-run `npm install`.

### Tests fail at login
- Verify your environment variables are set correctly — check your shell exports (`echo $CYPRESS_TEST_USERNAME`) or your `cypress.env.json` file.
- Ensure the HARP user accounts are active and not locked out.
- Check that the OAuth URIs (`*_MADIE_AUTHURI`, `*_MADIE_CLIENTID`, `*_MADIE_REDIRECTURI`) are correct for your target environment.

### Mac: "Permission denied" editing bash profile
```bash
sudo chown $(whoami) ~/.bash_profile
```

### Windows: Path separator issues
Use the `windows:` prefixed npm scripts (e.g., `npm run windows:test:all:tests`) or run from Git Bash which handles forward slashes.

### Cypress is slow or crashes
The config already includes memory optimizations (`--max-old-space-size=4096`, `--disable-dev-shm-usage`, `numTestsKeptInMemory: 0`, `experimentalMemoryManagement: true`). If you still have issues, close other Chrome instances and resource-heavy applications.

---

## Quick-Start Checklist

- [ ] Node.js >24 and npm >11.6 installed
- [ ] Repository cloned
- [ ] `npm install` completed successfully
- [ ] `npx cypress verify` passes
- [ ] Shell environment variables (`CYPRESS_*`) or `cypress.env.json` configured with credentials (ask your team)
- [ ] Connected to CMS VPN
- [ ] Run `npm run cypress:open:dev` — Cypress Test Runner opens
- [ ] Click a spec file — test executes successfully in Chrome

**Welcome to the team! 🎉**
