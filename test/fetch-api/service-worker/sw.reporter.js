/**
 * A SW Reporter created to be compatible with mocha-headless-chrome's repoter
 * See: https://github.com/direct-adv-interfaces/mocha-headless-chrome/blob/273d9b8bc7445ea1196b10ad0eaf0a8bce6cbd5f/lib/runner.js#L68
 */

const { Spec } = Mocha.reporters
const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_PENDING
} = Mocha.Runner.constants

function SWReporter (runner, options) {
  Spec.call(this, runner, options)

  const all = []
  const passes = []
  const failures = []
  const pending = []

  const error = (err) => {
    if (!err) return {}

    const res = {}
    Object.getOwnPropertyNames(err).forEach((key) => (res[key] = err[key]))
    return res
  }

  const clean = (test) => ({
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    err: error(test.err)
  })

  const getResult = (stats) => ({
    result: {
      stats: {
        tests: all.length,
        passes: passes.length,
        pending: pending.length,
        failures: failures.length,
        start: stats.start.toISOString(),
        end: stats.end.toISOString(),
        duration: stats.duration
      },
      tests: all.map(clean),
      pending: pending.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    }
  })

  runner
    .on(EVENT_TEST_PASS, (test) => {
      passes.push(test)
      all.push(test)
    })
    .on(EVENT_TEST_FAIL, (test) => {
      failures.push(test)
      all.push(test)
    })
    .on(EVENT_TEST_PENDING, (test) => {
      pending.push(test)
      all.push(test)
    })
    .once(EVENT_RUN_END, () => {
      const result = getResult(runner.stats)
      const channel = new BroadcastChannel('sw-result')
      channel.postMessage(JSON.stringify(result))
    })
}

Mocha.utils.inherits(SWReporter, Spec)
