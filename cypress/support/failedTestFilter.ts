const failedTestTitlesBase64 = Cypress.env('failedTestTitlesBase64')
const failedTestsBase64 = Cypress.env('failedTestsBase64')

function decodeFailedTestTitles(value: unknown): Set<string> {
  if (!value || typeof value !== 'string') {
    return new Set()
  }

  try {
    const json = atob(value)
    const titles = JSON.parse(json)
    if (Array.isArray(titles)) {
      return new Set(titles.filter((title): title is string => typeof title === 'string'))
    }
  } catch (err) {
    // Let the run continue unfiltered rather than failing before specs load.
    // The rerun script prints the exact titles it passes to Cypress.
    // eslint-disable-next-line no-console
    console.warn(`Unable to parse failed test title filter: ${String(err)}`)
  }

  return new Set()
}

function normalizeSpecPath(value: string): string {
  return value.replace(/\\/g, '/')
}

function decodeFailedTestsBySpec(value: unknown): Map<string, Set<string>> {
  if (!value || typeof value !== 'string') {
    return new Map()
  }

  try {
    const json = atob(value)
    const testsBySpec = JSON.parse(json)
    if (!testsBySpec || typeof testsBySpec !== 'object' || Array.isArray(testsBySpec)) {
      return new Map()
    }

    return new Map(
      Object.entries(testsBySpec)
        .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
        .map(([spec, titles]) => [
          normalizeSpecPath(spec),
          new Set(titles.filter((title): title is string => typeof title === 'string'))
        ])
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`Unable to parse failed test map filter: ${String(err)}`)
  }

  return new Map()
}

function titlesForCurrentSpec(testsBySpec: Map<string, Set<string>>): Set<string> {
  const relativeSpec = normalizeSpecPath(Cypress.spec.relative || '')
  const specName = normalizeSpecPath(Cypress.spec.name || '')

  return testsBySpec.get(relativeSpec) ||
    testsBySpec.get(specName) ||
    Array.from(testsBySpec.entries()).find(([spec]) => spec.endsWith(`/${specName}`))?.[1] ||
    new Set()
}

const failedTestsBySpec = decodeFailedTestsBySpec(failedTestsBase64)
const failedTestTitles = failedTestsBySpec.size
  ? titlesForCurrentSpec(failedTestsBySpec)
  : decodeFailedTestTitles(failedTestTitlesBase64)

if (failedTestTitles.size) {
  const suiteStack: string[] = []
  const originalDescribe = (globalThis as any).describe
  const originalIt = (globalThis as any).it

  const fullTitle = (title: string) => [...suiteStack, title].filter(Boolean).join(' ')

  const wrapDescribe = (describeFn: any) => {
    const wrapped = function (title: string, fn?: Mocha.Func) {
      if (typeof fn !== 'function') {
        return describeFn(title, fn)
      }

      return describeFn(title, function (this: Mocha.Suite) {
        suiteStack.push(title)
        try {
          return fn.apply(this)
        } finally {
          suiteStack.pop()
        }
      })
    }

    wrapped.only = describeFn.only ? wrapDescribe(describeFn.only.bind(describeFn)) : undefined
    wrapped.skip = describeFn.skip ? describeFn.skip.bind(describeFn) : undefined

    return wrapped
  }

  const wrapIt = (itFn: any) => {
    const wrapped = function (title: string, fn?: Mocha.Func) {
      const runnable = failedTestTitles.has(fullTitle(title)) ? itFn : itFn.skip
      return runnable(title, fn)
    }

    wrapped.only = itFn.only
      ? function (title: string, fn?: Mocha.Func) {
          const runnable = failedTestTitles.has(fullTitle(title)) ? itFn.only : itFn.skip
          return runnable(title, fn)
        }
      : undefined
    wrapped.skip = itFn.skip ? itFn.skip.bind(itFn) : undefined

    return wrapped
  }

  ;(globalThis as any).describe = wrapDescribe(originalDescribe)
  ;(globalThis as any).context = (globalThis as any).describe
  ;(globalThis as any).it = wrapIt(originalIt)
  ;(globalThis as any).specify = (globalThis as any).it
}
