/**
 * Local ESLint Plugin
 *
 * Custom rules for email-builder project
 */

module.exports = {
  rules: {
    'no-sync-event-emit-in-handlers': require('./rules/no-sync-event-emit-in-handlers'),
  },
};
