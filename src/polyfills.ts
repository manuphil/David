import { Buffer } from 'buffer'

// Polyfills globaux pour le navigateur
if (typeof window !== 'undefined') {
  // Buffer global
  window.Buffer = Buffer
  
  // Global object
  window.global = window.global || window
  
  // Process object minimal
  window.process = window.process || {
    env: {},
    version: '',
    platform: 'browser',
    nextTick: (fn: Function) => setTimeout(fn, 0),
  }
}

export {}
