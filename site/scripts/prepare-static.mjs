import { cp, access, mkdtemp, rename, rm } from 'node:fs/promises';
import { resolve, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Vinext namespaces an export by basePath. GitHub Pages mounts its artifact
// at that path already, so publish the contents of the namespace as the root.
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(projectRoot, 'dist/client');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

if (basePath) {
  const source = resolve(output, `.${basePath}`);
  if (!source.startsWith(`${output}${sep}`)) {
    throw new Error('The deployment path must stay inside the static export.');
  }
  await access(join(source, 'index.html'));
  const staging = await mkdtemp(resolve(projectRoot, 'dist/.pages-'));
  await cp(source, staging, { recursive: true });
  // The framework emits its fallback page outside the basePath namespace.
  await cp(join(output, '404.html'), join(staging, '404.html'));
  await rm(output, { recursive: true });
  await rename(staging, output);
}

await access(join(output, 'index.html'));
await access(join(output, '.nojekyll'));
console.log(`Static website ready in dist/client (URL path: ${basePath || '/'}).`);
