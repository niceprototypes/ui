import type { Plugin, UserConfig } from 'vite'

export type NiceViteConfigOptions = {
  /** The app's folder, whose node_modules holds the shared React and styled-components. */
  appRoot: string
  /** Local mode: the path of a nice-ux checkout (e.g. `~/nice/ui`); every `@niceprototypes/*` import resolves there. Omit to use the npm install. */
  local?: string
}

/** Vite settings for an app consuming @niceprototypes/* packages; merge with `mergeConfig`. */
export declare const createNiceViteConfig: (options: NiceViteConfigOptions) => UserConfig

export type NiceThemeBootstrapOptions = {
  /** The theme when nothing is stored, whatever the OS preference. */
  theme: 'day' | 'night'
  /** The localStorage key holding the reader's choice; written to `<html data-theme-storage>` for a theme switch to store into. */
  storageKey: string
}

/** Vite plugin: the stored theme (else `theme`) on `<html data-theme>` before the first paint, from an inline script in `<head>`. */
export declare const niceThemeBootstrap: (options: NiceThemeBootstrapOptions) => Plugin
