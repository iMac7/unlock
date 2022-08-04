// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingActions: {
    submitUser: 'SUBMIT_USER'
  }
  eventsCausingServices: {}
  eventsCausingGuards: {
    isExistingUser: 'CONTINUE'
    isNotExistingUser: 'CONTINUE'
  }
  eventsCausingDelays: {}
  matchesStates: 'ENTER_EMAIL' | 'EXIT' | 'SIGN_IN' | 'SIGN_UP'
  tags: never
}
