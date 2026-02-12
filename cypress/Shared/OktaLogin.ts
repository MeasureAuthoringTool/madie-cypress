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

        cy.intercept('/env-config/serviceConfig.json').as('serviceConfig');

        // Reset state
        sessionStorage.clear();
        cy.clearAllCookies();
        cy.clearLocalStorage();
        cy.clearAllSessionStorage?.({ log: true });

        // Visit login and ensure fresh sessionStorage
        cy.visit('/login', { onBeforeLoad: (win) => win.sessionStorage.clear() });

        // Capture and write feature flags
        cy.wait('@serviceConfig', { timeout: 15000 }).then((config) => {
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

        // 2) Re-evaluate auth (navigate to root so route guard runs)
        if (cookieSet) {
            cy.visit('/');
        }

        // Local selectors (avoid `this` in closures where not needed)
        const selectors = {
            username: this.usernameInput,
            password: this.passwordInput,
            signIn:   this.signInButton,
            landing:  LandingPage.newMeasureButton,
        };

        // 3) Race: wait until either login form is visible OR landing is visible
        const waitForEither = (opts = { timeout: 25000, interval: 200 }) => {
            const deadline = Date.now() + opts.timeout;

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

                return Cypress.Promise.delay(opts.interval).then(probe);
            }

            return cy.wrap(null, { log: false }).then(() => probe());
        };

        // 4) Act based on state
        waitForEither().then((state) => {
            cy.log(`${logPrefix}: UI state after wait: ${state}`);

            if (state === 'login') {
                const creds = who ? args.credsForUser(who) : null;
                if (creds) {
                    cy.get(selectors.username, { timeout: 20000 }).should('be.visible').clear().type(creds.username, { log: false });
                    cy.get(selectors.password, { timeout: 20000 }).should('be.visible').clear().type(creds.password, { log: false });
                } else {
                    cy.log(`${logPrefix}: No credentials mapped for "${who}"—skipping typing.`);
                }

                cy.get('body').then(($body) => {
                    const $btn = $body.find(selectors.signIn);
                    if ($btn.length && $btn.is(':visible')) {
                        cy.get(selectors.signIn, { timeout: 20000 }).should('be.enabled').click();
                    } else {
                        cy.log(`${logPrefix}: Sign-in button not visible after typing.`);
                    }
                });
            }
        });

        // 5) Post-login checks
        cy.intercept('GET', '/api/vsac/umls-credentials/status').as('umls');

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

        cy.wait(4500)
        cy.reload()
        Utilities.waitForElementVisible(Header.mainMadiePageButton, 50000)
        cy.wait(3000)
        cy.url().then((url) => {
            if (url != 'https://impl-madie.hcqis.org/login') {
                Utilities.waitForElementVisible(Header.userProfileSelect, 10000)
                cy.get(Header.userProfileSelect).scrollIntoView()
                cy.get(Header.userProfileSelect).click()
                Utilities.waitForElementVisible(Header.userProfileSelectSignOutOption, 60000)
                cy.get(Header.userProfileSelectSignOutOption).click({ force: true })
                Utilities.waitForElementVisible(this.usernameInput, 500000)
                cy.log('Log out successful')
            }
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
                default:
                    throw new Error(`Unknown user type: ${currentAltUser}`)
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
                default:
                    throw new Error(`Unknown user type: ${currentUser}`)
            }
        }

        // doing this here to match dev work, rather than trying to track down each individual config
        return user.toLowerCase()
    }
}
