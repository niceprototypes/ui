import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Packages every @niceprototypes/* package must share a single copy of with the app. */
const SHARED_PACKAGES = ['react', 'react-dom', 'styled-components']

/** Singletons: one token registry and one icon registry. */
const SINGLETON_PACKAGES = ['@niceprototypes/styles', '@niceprototypes/icon']

/** Expands a leading `~` to the home folder and resolves the path. */
const expandHome = (folder) => path.resolve(folder.replace(/^~(?=$|\/)/, os.homedir()))

/** Every package in a nice-ux checkout (`packages/*`): its folder and its manifest. */
const getLocalPackages = (local) => {
  const packagesFolder = path.join(expandHome(local), 'packages')
  return fs
    .readdirSync(packagesFolder)
    .map((folder) => ({ folder: path.join(packagesFolder, folder), file: path.join(packagesFolder, folder, 'package.json') }))
    .filter(({ file }) => fs.existsSync(file))
    .map(({ folder, file }) => ({ folder, manifest: JSON.parse(fs.readFileSync(file, 'utf8')) }))
}

/** Names of the publishable packages in a nice-ux checkout (`packages/*`, not private). */
const getLocalPackageNames = (local) =>
  getLocalPackages(local)
    .filter(({ manifest }) => !manifest.private)
    .map(({ manifest }) => manifest.name)

/**
 * The file a private checkout package's import points to (`@niceprototypes/docs/components/DocsPage`):
 * its `exports` entry for the subpath (string entries), else undefined. Private packages are not
 * in the umbrella's install, so they resolve from their own folder.
 */
const resolvePrivateExport = (privatePackages, source) => {
  const match = privatePackages.find(({ manifest }) => source === manifest.name || source.startsWith(`${manifest.name}/`))
  if (!match) return undefined
  const subpath = `.${source.slice(match.manifest.name.length)}`
  const target = match.manifest.exports?.[subpath]
  return typeof target === 'string' ? path.join(match.folder, target) : undefined
}

/**
 * Vite plugin for local mode: resolves every `@niceprototypes/*` import as if it were
 * imported by the umbrella package (`packages/ux`), whose install holds every publishable
 * package; a private package's import (`@niceprototypes/docs/…`) resolves to the file its
 * `exports` names in its own folder.
 * The import stays a bare module request, so each package's `exports` (subpaths such as
 * `@niceprototypes/styles/tokens.css`) apply, and the result is the package's real folder
 * in the checkout.
 *
 * @param {string} local the nice-ux checkout
 * @returns {import('vite').Plugin}
 */
const niceLocal = (local) => {
  const importer = path.join(expandHome(local), 'packages/ux/package.json')
  const privatePackages = getLocalPackages(local).filter(({ manifest }) => manifest.private)
  return {
    name: '@niceprototypes/config-vite:local',
    enforce: 'pre',
    resolveId(source, _importer, options) {
      if (!source.startsWith('@niceprototypes/')) return null
      const privateFile = resolvePrivateExport(privatePackages, source)
      if (privateFile) return this.resolve(privateFile, importer, { ...options, skipSelf: true })
      return this.resolve(source, importer, { ...options, skipSelf: true })
    },
  }
}

/**
 * Vite settings for an app that consumes @niceprototypes/* packages. Merge into the app's
 * config with Vite's `mergeConfig`.
 *
 * - From npm (default): one copy of React, styled-components and the singleton packages.
 * - `local`: the path of a nice-ux checkout (e.g. `~/nice/ui`). Every
 *   `@niceprototypes/*` import resolves to that checkout instead of `node_modules`, so the
 *   app runs unreleased changes. Packages resolve the way their `package.json` points
 *   (their builds today: rebuild with `pnpm --filter <name> build`). React and
 *   styled-components stay the app's copies, the checkout is served (`fs.allow`), and the
 *   packages are excluded from pre-bundling so a stale optimizer cache never hides a change.
 *   The singletons are not deduped here: dedupe resolves from the app root, which would
 *   bypass the checkout, and each one already has a single folder in it.
 *
 * @param {{ appRoot: string, local?: string }} options
 *   appRoot: the app's folder, whose node_modules holds the shared copies.
 * @returns {import('vite').UserConfig}
 */
export const createNiceViteConfig = ({ appRoot, local }) => {
  if (!local) return { resolve: { dedupe: [...SHARED_PACKAGES, ...SINGLETON_PACKAGES] } }

  return {
    resolve: {
      dedupe: SHARED_PACKAGES,
      alias: SHARED_PACKAGES.map((name) => ({
        find: new RegExp(`^${name}(?=$|/)`),
        replacement: path.join(appRoot, 'node_modules', name),
      })),
    },
    optimizeDeps: { exclude: getLocalPackageNames(local) },
    server: { fs: { allow: [appRoot, expandHome(local)] } },
    plugins: [niceLocal(local)],
  }
}

/**
 * Vite plugin: the stored day/night theme on `<html data-theme>` before the first paint, `theme`
 * when nothing is stored (whatever the OS preference). An inline script at the top of `<head>`
 * reads `localStorage[storageKey]` (in try/catch: blocked storage gives `theme`) and writes the
 * key to `<html data-theme-storage>`, where a theme switch finds it to store the reader's choice.
 *
 * @param {{ theme: 'day' | 'night', storageKey: string }} options
 * @returns {import('vite').Plugin}
 */
export const niceThemeBootstrap = ({ theme, storageKey }) => {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(theme)
  const script = `var root = document.documentElement;
root.setAttribute("data-theme-storage", ${key});
try {
  var stored = localStorage.getItem(${key});
  root.setAttribute("data-theme", stored === "day" || stored === "night" ? stored : ${fallback});
} catch (error) {
  root.setAttribute("data-theme", ${fallback});
}`
  return {
    name: '@niceprototypes/config-vite:theme-bootstrap',
    transformIndexHtml: () => [{ tag: 'script', children: script, injectTo: 'head-prepend' }],
  }
}
