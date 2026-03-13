import { Environment } from "./Environment"
import { LandingPage } from "./LandingPage"
import { umlsLoginForm } from "./umlsLoginForm"
import { Utilities } from "./Utilities"
import { Header } from "./Header"

//MADiE OKTA Login Class
export class OktaLogin {

    //Commented locators are for the new Okta Login page
    public static readonly usernameInput = '[id="input28"]' //'#okta-signin-username'
    public static readonly passwordInput = '[id="input36"]' //'#okta-signin-password'
    public static readonly signInButton = '[class="button button-primary"]' //'#okta-signin-submit'

    public static readonly needHelpButton = 'a[data-se="needhelp"]'
    public static readonly forgotPassword = '[data-se="forgot-password"]'
    public static readonly helpLink = '[data-se="help"]'
    public static readonly termsAndConditionsButton = '[data-testid="terms-and-conditions-button"]'
    public static readonly tcClose = '[data-testid="terms-and-conditions-close-button"]'
    public static readonly resetViaEmail = '[data-se="email-button"]'
    public static readonly backFromReset = '[data-se="cancel"]'

    // public static AltLogin() {
    //     const currentAltUser = Cypress.env('selectedAltUser')
    //
    //     sessionStorage.clear()
    //     cy.clearAllCookies()
    //     cy.clearLocalStorage()
    //
    //     cy.visit('/login', { onBeforeLoad: (win) => { win.sessionStorage.clear() } })
    //
    //     if (currentAltUser === 'altHarpUser') {
    //         cy.setAccessTokenCookieALT()
    //         cy.get(this.usernameInput).type(Environment.credentials().altHarpUser)
    //         cy.get(this.passwordInput).type(Environment.credentials().passwordALT)
    //     } else if (currentAltUser === 'altHarpUser2') {
    //         cy.setAccessTokenCookieALT2()
    //         cy.get(this.usernameInput).type(Environment.credentials().altHarpUser2)
    //         cy.get(this.passwordInput).type(Environment.credentials().passwordALT2)
    //     }
    //     else if (currentAltUser === 'altHarpUser3') {
    //         cy.setAccessTokenCookieALT3()
    //         cy.get(this.usernameInput).type(Environment.credentials().altHarpUser3)
    //         cy.get(this.passwordInput).type(Environment.credentials().passwordALT3)
    //     }
    //
    //     //setup for grabbing the measure create call
    //     cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls')
    //
    //     cy.get(this.signInButton).click()
    //
    //     cy.wait('@umls', { timeout: 110000 }).then(({ response }) => {
    //
    //         if (response.statusCode === 200) {
    //             //do nothing
    //         }
    //         else {
    //             umlsLoginForm.UMLSLogin()
    //         }
    //
    //     })
    //     cy.get(LandingPage.newMeasureButton).should('be.visible')
    //     cy.log('Login Successful')
    // }


    // public static Login(): void {
    //     const user = Cypress.env('selectedUser');
    //     cy.intercept('/env-config/serviceConfig.json').as('serviceConfig');
    //
    //     sessionStorage.clear();
    //     cy.clearAllCookies();
    //     cy.clearLocalStorage();
    //     cy.clearAllSessionStorage({ log: true });
    //
    //     cy.visit('/login', { onBeforeLoad: (win) => win.sessionStorage.clear() });
    //
    //     cy.wait('@serviceConfig', { timeout: 15000 }).then((config) => {
    //         cy.writeFile('cypress/fixtures/featureFlags', config.response!.body.features);
    //     });
    //
    //     // --- selectors (avoid `this` inside closures) ---
    //     const selectors = {
    //         username: this.usernameInput,
    //         password: this.passwordInput,
    //         signIn: this.signInButton,
    //         // Optional: container if you have one (more stable than inputs):
    //         // formContainer: this.loginFormContainer
    //         landing: LandingPage.newMeasureButton,
    //     };
    //
    //     // --- 1) Set token per selected user ---
    //     let cookieSet = false;
    //     if (user === 'harpUser') {
    //         cy.setAccessTokenCookie(); cookieSet = true;
    //     } else if (user === 'harpUser2') {
    //         cy.setAccessTokenCookie2(); cookieSet = true;
    //     } else if (user === 'harpUser3') {
    //         cy.setAccessTokenCookie3(); cookieSet = true;
    //     }
    //
    //     // --- 2) Force app to re-evaluate auth (stronger than reload on /login) ---
    //     if (cookieSet) {
    //         cy.visit('/'); // let your route guard hide login if token is valid
    //     }
    //
    //     // --- 3) Race: wait until either login form is visible OR landing page is visible ---
    //     const waitForEither = (
    //         opts = { timeout: 25000, interval: 200 }
    //     ) => {
    //         const deadline = Date.now() + opts.timeout;
    //
    //         function probe(): any {
    //             const onLogin =
    //                 Cypress.$(selectors.username).length > 0 &&
    //                 Cypress.$(selectors.password).length > 0 &&
    //                 Cypress.$(selectors.username).is(':visible') &&
    //                 Cypress.$(selectors.password).is(':visible');
    //
    //             const onLanding =
    //                 Cypress.$(selectors.landing).length > 0 &&
    //                 Cypress.$(selectors.landing).is(':visible');
    //
    //             if (onLogin) return 'login';
    //             if (onLanding) return 'landing';
    //
    //             if (Date.now() >= deadline) return 'timeout';
    //
    //             return Cypress.Promise.delay(opts.interval).then(probe);
    //         }
    //
    //         // Wrap in Cypress chain so it shows in the command log and respects test flow
    //         return cy.wrap(null, { log: false }).then(() => probe());
    //     };
    //
    //     // --- 4) Do the right thing once UI state is clear ---
    //     waitForEither().then((state) => {
    //         cy.log(`UI state after wait: ${state}`);
    //
    //         if (state === 'login') {
    //             // Extra safety: let Cypress retry visibility before typing
    //             const typeCreds = (uSel: string, pSel: string, uVal: string, pVal: string) => {
    //                 cy.get(uSel, { timeout: 20000 }).should('be.visible').clear().type(uVal, { log: false });
    //                 cy.get(pSel, { timeout: 20000 }).should('be.visible').clear().type(pVal, { log: false });
    //             };
    //
    //             if (user === 'harpUser') {
    //                 typeCreds(selectors.username, selectors.password, Environment.credentials().harpUser, Environment.credentials().password);
    //             } else if (user === 'harpUser2') {
    //                 typeCreds(selectors.username, selectors.password, Environment.credentials().harpUser2, Environment.credentials().password2);
    //             } else if (user === 'harpUser3') {
    //                 typeCreds(selectors.username, selectors.password, Environment.credentials().harpUser3, Environment.credentials().password3);
    //             } else {
    //                 cy.log(`Unknown selectedUser "${user}". Skipping credential typing.`);
    //             }
    //
    //             // Click sign-in if visible
    //             cy.get('body').then(($body) => {
    //                 const $btn = $body.find(selectors.signIn);
    //                 if ($btn.length && $btn.is(':visible')) {
    //                     cy.get(selectors.signIn, { timeout: 20000 }).should('be.enabled').click();
    //                 } else {
    //                     cy.log('Sign-in button not visible after typing.');
    //                 }
    //             });
    //         }
    //
    //         // If 'landing' (already authenticated), do nothing.
    //         // If 'timeout', continue; the next steps will still verify via UMLS / landing check.
    //     });
    //
    //     // --- 5) Rest of flow ---
    //     cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');
    //
    //     cy.wait('@umls', { timeout: 110000 }).then(({ response }) => {
    //         if (!response || response.statusCode !== 200) {
    //             umlsLoginForm.UMLSLogin();
    //         }
    //     });
    //
    //     cy.get(selectors.landing, { timeout: 60000 }).should('be.visible');
    //     cy.log('Login Successful');
    //
    //     Cypress.env('selectedUser', user);
    // }



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

        // 3) First attempt: wait for login form or landing page
        waitForEither(35000).then((state) => {
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
            // Cookie-based auth likely failed. The app may be mid-redirect
            // (e.g. briefly hit /measures then bounced to /login).
            // We need to get to the login form and enter credentials.
            cy.log(`${logPrefix}: Timed out detecting UI state. Falling back to form-based login...`);

            // Clear cookies since the cookie-based token was rejected
            cy.clearAllCookies();
            cy.clearLocalStorage();

            // Re-register UMLS intercept before navigating — previous alias
            // may have been consumed by earlier page loads.
            cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');

            // Navigate directly to /login (with retry on network errors)
            cy.visitWithRetry('/login', { onBeforeLoad: (win) => win.sessionStorage.clear() });

            // Wait for the login form to appear with a generous timeout
            cy.get(selectors.username, { timeout: 60000 }).should('be.visible').then(() => {
                cy.log(`${logPrefix}: Login form visible after fallback — performing form-based login.`);
                doFormLogin();
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


    public static Logout(): void {


        //commenting out all the logout until logout issue MAT-4520 is resolved

        // cy.get(Header.userProfileSelect).should('exist')
        // cy.get(Header.userProfileSelect, { timeout: 1000000 }).should('be.visible')
        // cy.get(Header.userProfileSelect).should('be.visible')
        // cy.get(Header.userProfileSelect).invoke('click')
        //cy.get(Header.userProfileSelect).click()
        //
        // cy.get(Header.userProfileSelectSignOutOption).should('exist')
        // cy.get(Header.userProfileSelectSignOutOption, { timeout: 1000000 }).should('be.visible')
        // cy.get(Header.userProfileSelectSignOutOption).should('be.visible')
        // cy.get(Header.userProfileSelectSignOutOption).focus()
        // cy.get(Header.userProfileSelectSignOutOption).invoke('click')
        // cy.intercept('POST', '/api/log/logout').as('logout')
        // cy.get(Header.userProfileSelectSignOutOption).click({ force: true })
        // cy.wait('@logout', {timeout: 60000}).then(({response}) => {
        //     expect(response.statusCode).to.eq(405)
        // })
        // cy.window().then((win) => {
        //     win.sessionStorage.clear()
        // })
        // cy.log('Logout Successful')
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
        let user: string

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
        if (!user) {
            cy.log(`⚠️ setupUserSession: User credential is not set. altUser=${altUser}, selectedAltUser=${currentAltUser}, selectedUser=${currentUser}. Ensure the corresponding environment variables (e.g. TEST_ALT_USERNAME) are configured.`)
            return ''
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
