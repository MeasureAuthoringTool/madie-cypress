import { Environment } from "./Environment"
import { LandingPage } from "./LandingPage"
import { umlsLoginForm } from "./umlsLoginForm"
import { Header } from "./Header"

export class OktaLogin {

    public static readonly usernameInput = '[id="input28"]'
    public static readonly passwordInput = '[id="input36"]'
    public static readonly signInButton = '[class="button button-primary"]'

    public static readonly needHelpButton = 'a[data-se="needhelp"]'
    public static readonly forgotPassword = '[data-se="forgot-password"]'
    public static readonly helpLink = '[data-se="help"]'
    public static readonly termsAndConditionsButton = '[data-testid="terms-and-conditions-button"]'
    public static readonly tcClose = '[data-testid="terms-and-conditions-close-button"]'
    public static readonly resetViaEmail = '[data-se="email-button"]'
    public static readonly backFromReset = '[data-se="cancel"]'

    // ------------------------------------------------------
    // PUBLIC: keep these intact so tests DO NOT change
    // ------------------------------------------------------
    public static Login(): void {
        this.runLoginFlow({
            selectedEnvVar: 'selectedUser',
            cookieSetters: {
                harpUser:  () => cy.setAccessTokenCookie(),
                harpUser2: () => cy.setAccessTokenCookie2(),
                harpUser3: () => cy.setAccessTokenCookie3(),
            },
            credsForUser: (u) => {
                if (u === 'harpUser')  return { username: Environment.credentials().harpUser,  password: Environment.credentials().password };
                if (u === 'harpUser2') return { username: Environment.credentials().harpUser2, password: Environment.credentials().password2 };
                if (u === 'harpUser3') return { username: Environment.credentials().harpUser3, password: Environment.credentials().password3 };
                return null;
            },
            logPrefix: 'Login',
        });
    }

    public static AltLogin(): void {
        this.runLoginFlow({
            selectedEnvVar: 'selectedAltUser',
            cookieSetters: {
                altHarpUser:  () => cy.setAccessTokenCookieALT(),
                altHarpUser2: () => cy.setAccessTokenCookieALT2(),
                altHarpUser3: () => cy.setAccessTokenCookieALT3(),
            },
            credsForUser: (u) => {
                if (u === 'altHarpUser')  return { username: Environment.credentials().altHarpUser,  password: Environment.credentials().passwordALT };
                if (u === 'altHarpUser2') return { username: Environment.credentials().altHarpUser2, password: Environment.credentials().passwordALT2 };
                if (u === 'altHarpUser3') return { username: Environment.credentials().altHarpUser3, password: Environment.credentials().passwordALT3 };
                return null;
            },
            logPrefix: 'Alt Login',
        });
    }

    public static AdminLogin(): void {
        this.runLoginFlow({
            selectedEnvVar: 'selectedUser',
            cookieSetters: {
                any: () => cy.setAccessTokenCookieAdmin()
            },
            credsForUser: (u) => {
                return { username: Environment.credentials().adminUser, password: Environment.credentials().adminPassword }
            },
            logPrefix: 'Admin Login'
        })

    }

    // ------------------------------------------------------
    // SESSION-CACHED LOGIN
    // Uses cy.session() to avoid repeating the full Okta
    // login flow between tests in the same spec file.
    // Only use in files whose afterEach uses the no-op
    // Logout() — NOT UILogout().
    // ------------------------------------------------------

    public static SessionLogin(): void {
        const who = Cypress.env('selectedUser')

        cy.session('login-' + who, () => {
            // Only acquire the access token via API — no browser navigation.
            // This avoids the cy.intercept/cy.wait('@serviceConfig') race
            // condition that occurs when cy.session() resets the page to
            // about:blank before running the setup function.
            //
            // The cookie-setter commands do pure HTTP requests to Okta
            // (authn → authorize → token) and set the accessToken cookie.
            const cookieSetters: Record<string, () => void> = {
                harpUser:  () => cy.setAccessTokenCookie(),
                harpUser2: () => cy.setAccessTokenCookie2(),
                harpUser3: () => cy.setAccessTokenCookie3(),
            }
            const setter = cookieSetters[who]
            if (setter) {
                setter()
            } else {
                cy.log(`SessionLogin: No cookie setter for user "${who}"`)
            }
        }, {
            validate() {
                cy.getCookie('accessToken').should('exist')
            },
        })

        // After session restore/create, navigate to the app.
        // No intercept/wait for UMLS here — on session restore the request
        // may fire before the intercept is registered, causing a timeout.
        // The landing page assertion below is sufficient: if UMLS login is
        // actually required, the app won't render the landing page.
        cy.visit('/')
        cy.get(LandingPage.newMeasureButton, { timeout: 60000 }).should('be.visible')
    }

    public static SessionAltLogin(): void {
        const who = Cypress.env('selectedAltUser')

        cy.session('alt-login-' + who, () => {
            const cookieSetters: Record<string, () => void> = {
                altHarpUser:  () => cy.setAccessTokenCookieALT(),
                altHarpUser2: () => cy.setAccessTokenCookieALT2(),
                altHarpUser3: () => cy.setAccessTokenCookieALT3(),
            }
            const setter = cookieSetters[who]
            if (setter) {
                setter()
            } else {
                cy.log(`SessionAltLogin: No cookie setter for user "${who}"`)
            }
        }, {
            validate() {
                cy.getCookie('accessToken').should('exist')
            },
        })

        cy.visit('/')
        cy.get(LandingPage.newMeasureButton, { timeout: 60000 }).should('be.visible')
    }

    // ------------------------------------------------------
    // PRIVATE: shared hardened engine
    // ------------------------------------------------------
    private static runLoginFlow(args: {
        selectedEnvVar: 'selectedUser' | 'selectedAltUser';
        cookieSetters: Record<string, () => void>;
        credsForUser: (userKey: string) => { username: string; password: string } | null;
        logPrefix?: string;
    }): void {
        const logPrefix = args.logPrefix ?? 'Login';

        // Reset state
        sessionStorage.clear();
        cy.clearAllCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage?.({ log: true });

        // Register intercepts BEFORE any navigation so they are in place
        // when the app fires requests during page load. This prevents the
        // race condition where the UMLS credentials check fires before the
        // intercept is registered, causing cy.wait('@umls') to hang for
        // 110 seconds and fail.
        cy.intercept('/env-config/serviceConfig.json').as('serviceConfig');
        cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');

        // Visit login and ensure fresh sessionStorage (with retry on network errors)
        cy.visitWithRetry('/login', { onBeforeLoad: (win) => win.sessionStorage.clear() });

        // Capture and write feature flags — use a generous timeout because
        // retries inside visitWithRetry can delay when the request fires.
        cy.wait('@serviceConfig', { timeout: 60000 }).then((config) => {
            cy.writeFile('cypress/fixtures/featureFlags', config.response!.body.features);
        });

        // Normalize the user key to a plain string (avoids TS index weirdness)
        const rawWho = Cypress.env(args.selectedEnvVar);
        const who: string = typeof rawWho === 'string' ? rawWho : String(rawWho ?? '');

        // 1) Set token cookie if mapped for this user
        let cookieSet = false;
        if (who && Object.prototype.hasOwnProperty.call(args.cookieSetters, who)) {
            const setCookie = (args.cookieSetters as Record<string, () => void>)[who];
            if (typeof setCookie === 'function') {
                setCookie();
                cookieSet = true;
            }
        }

        // Local selectors (avoid `this` in closures where not needed)
        const selectors = {
            username: this.usernameInput,
            password: this.passwordInput,
            signIn:   this.signInButton,
            landing:  LandingPage.newMeasureButton,
        };

        // Helper: type credentials and click sign-in
        const doFormLogin = () => {
            const creds = who ? args.credsForUser(who) : null;
            if (creds) {
                cy.get(selectors.username, { timeout: 20000 }).should('be.visible').clear().type(creds.username, { log: false });
                cy.get(selectors.password, { timeout: 20000 }).should('be.visible').clear().type(creds.password, { log: false });
            } else {
                cy.log(`${logPrefix}: No credentials mapped for "${who}"—skipping typing.`);
            }

            cy.get(selectors.signIn, { timeout: 20000 }).should('be.visible').should('be.enabled').click();
        };

        // Poller: wait until either login form or landing page is visible
        const waitForEither = (timeoutMs: number, intervalMs = 300): Cypress.Chainable<string> => {
            const deadline = Date.now() + timeoutMs;

            function probe(): any {
                const onLogin =
                    Cypress.$(selectors.username).length > 0 &&
                    Cypress.$(selectors.password).length > 0 &&
                    Cypress.$(selectors.username).is(':visible') &&
                    Cypress.$(selectors.password).is(':visible');

                const onLanding =
                    Cypress.$(selectors.landing).length > 0 &&
                    Cypress.$(selectors.landing).is(':visible');

                if (onLogin)  return 'login';
                if (onLanding) return 'landing';
                if (Date.now() >= deadline) return 'timeout';

                return Cypress.Promise.delay(intervalMs).then(probe);
            }

            return cy.wrap(null, { log: false }).then(() => probe());
        };

        // 2) Re-evaluate auth (navigate to root so route guard runs)
        if (cookieSet) {
            // Re-register the UMLS intercept before navigating — the alias
            // may have been consumed by the initial /login page load.
            cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');
            cy.visitWithRetry('/');
        }

        // 3) First attempt: wait for login form or landing page.
        // Bumped to 60s because the alt-user cookie path can take longer
        // (extra Okta introspect → token → userinfo → user PUT round-trips
        // before /login redirects to /measures).
        waitForEither(60000).then((state) => {
            cy.log(`${logPrefix}: UI state after first wait: ${state}`);

            if (state === 'landing') {
                // Already authenticated — UMLS intercept was registered early
                // so it will have captured/will capture the request.
                return;
            }

            if (state === 'login') {
                cy.log(`${logPrefix}: Login form visible — performing form-based login.`);
                doFormLogin();
                return;
            }

            // state === 'timeout'
            // Cookie-based auth likely failed OR the redirect chain just hadn't
            // finished yet. Re-probe after navigating to /login. Important: do
            // NOT clear cookies up-front — if the cookie auth actually did work
            // we'd be throwing away a valid session and forcing form login,
            // which then fails because /login auto-redirects to /measures.
            cy.log(`${logPrefix}: Timed out detecting UI state. Re-probing after /login navigation...`);

            // Re-register UMLS intercept before navigating — previous alias
            // may have been consumed by earlier page loads.
            cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');

            // Navigate directly to /login (with retry on network errors).
            // If cookies are still valid, the app will bounce to /measures.
            cy.visitWithRetry('/login', { onBeforeLoad: (win) => win.sessionStorage.clear() });

            waitForEither(60000).then((state2) => {
                cy.log(`${logPrefix}: UI state after fallback wait: ${state2}`);

                if (state2 === 'landing') {
                    // Cookie auth completed during the fallback — we're in.
                    return;
                }

                if (state2 === 'login') {
                    cy.log(`${logPrefix}: Login form visible after fallback — performing form-based login.`);
                    doFormLogin();
                    return;
                }

                // Still neither: cookie was truly rejected and form never showed.
                // Last resort: clear cookies and force the form to render.
                cy.log(`${logPrefix}: Still no UI state. Clearing cookies and forcing form login.`);
                cy.clearAllCookies();
                cy.clearLocalStorage();
                cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');
                cy.visitWithRetry('/login', { onBeforeLoad: (win) => win.sessionStorage.clear() });
                cy.get(selectors.username, { timeout: 60000 }).should('be.visible').then(() => {
                    doFormLogin();
                });
            });
        });

        // 4) Post-login checks — wait for UMLS
        cy.wait('@umls', { timeout: 110000 }).then(({ response }) => {
            if (!response || response.statusCode !== 200) {
                umlsLoginForm.UMLSLogin();
            }
        });

        cy.get(selectors.landing, { timeout: 60000 }).should('be.visible');
        cy.log(`${logPrefix} Successful`);
    }

    public static UILogout(): void {

        // UILogout is called from afterEach/after hooks. If it throws,
        // it cascades and skips remaining tests in the suite. Wrap
        // everything so cleanup failures are logged, not fatal.
        cy.wait(4500)
        cy.reload()
        cy.get('body', { timeout: 50000 }).should('exist').then(() => {
            // Check if we're already on the login page
            cy.url().then((url) => {
                if (url.endsWith('/login')) {
                    cy.log('Already on login page — skipping logout')
                    return
                }

                // Try to find the profile menu; if page is broken, skip gracefully
                cy.get('body').then(($body) => {
                    const $profile = $body.find(Header.userProfileSelect)
                    if ($profile.length > 0 && $profile.is(':visible')) {
                        cy.get(Header.userProfileSelect).scrollIntoView().click()
                        cy.get(Header.userProfileSelectSignOutOption, { timeout: 60000 })
                            .should('be.visible')
                            .click({ force: true })
                        // Wait briefly for logout to take effect, but don't assert
                        // on the Okta login form — the selector is brittle and
                        // failure here shouldn't kill the suite.
                        cy.wait(3000)
                        cy.log('Log out successful')
                    } else {
                        cy.log('⚠️ User profile menu not found — skipping UI logout')
                    }
                })
            })
        })
    }


    public static setupUserSession(altUser: boolean) {
        let user = ''

        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        if (altUser) {
            switch (currentAltUser) {

                case 'altHarpUser2':
                    cy.setAccessTokenCookieALT2()
                    user = Environment.credentials().altHarpUser2
                    break
                case 'altHarpUser3':
                    cy.setAccessTokenCookieALT3()
                    user = Environment.credentials().altHarpUser3
                    break
                case 'altHarpUser':
                default:
                    cy.setAccessTokenCookieALT()
                    user = Environment.credentials().altHarpUser
            }
        } else if (altUser === false) {
            switch (currentUser) {
                case 'harpUser2':
                    cy.setAccessTokenCookie2()
                    user = Environment.credentials().harpUser2
                    break;
                case 'harpUser3':
                    cy.setAccessTokenCookie3()
                    user = Environment.credentials().harpUser3
                    break
                case 'harpUser':
                default:
                    cy.setAccessTokenCookie()
                    user = Environment.credentials().harpUser
            }
        }
        if (user == '') {
            cy.log(`⚠️ setupUserSession: User credential is not set. altUser=${altUser}, selectedAltUser=${currentAltUser}, selectedUser=${currentUser}. Ensure the corresponding environment variables (e.g. TEST_ALT_USERNAME) are configured.`)
            return user
        }
        cy.log('Current user is: ' + user)
        // doing this here to match dev work, rather than trying to track down each individual config
        return user.toLowerCase()
    }

    public static getUser(altUser: boolean) {
        let user: string
        const currentAltUser = Cypress.env('selectedAltUser')
        const currentUser = Cypress.env('selectedUser')

        if (altUser) {
            switch (currentAltUser) {
                case 'altHarpUser':
                    user = Environment.credentials().altHarpUser
                    break
                case 'altHarpUser2':
                    user = Environment.credentials().altHarpUser2
                    break
                case 'altHarpUser3':
                    user = Environment.credentials().altHarpUser3
                    break
                case undefined:
                    // selectedAltUser not yet set; fall back to default alt user
                    user = Environment.credentials().altHarpUser
                    break
                default:
                    cy.log(`⚠️ getUser: Unknown user type: ${currentAltUser}`)
                    user = ''
            }
        } else {
            switch (currentUser) {
                case 'harpUser':
                    user = Environment.credentials().harpUser
                    break
                case 'harpUser2':
                    user = Environment.credentials().harpUser2
                    break;
                case 'harpUser3':
                    user = Environment.credentials().harpUser3
                    break
                case undefined:
                    // selectedUser not yet set; fall back to default user
                    user = Environment.credentials().harpUser
                    break
                default:
                    cy.log(`⚠️ getUser: Unknown user type: ${currentUser}`)
                    user = ''
            }
        }

        if (!user) {
            cy.log(`⚠️ getUser: User credential is not set. altUser=${altUser}, selectedAltUser=${currentAltUser}, selectedUser=${currentUser}. Ensure the corresponding environment variables (e.g. TEST_ALT_USERNAME) are configured.`)
            return ''
        }

        cy.log('Grabbing username: ' + user)
        // doing this here to match dev work, rather than trying to track down each individual config
        return user.toLowerCase()
    }

    public static setupAdminSession() {

        sessionStorage.clear()
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.clearAllSessionStorage({ log: true })

        cy.setAccessTokenCookieAdmin()
    }
}
