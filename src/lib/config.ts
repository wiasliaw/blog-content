import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const defaults = {
  content: {
    patterns: ['**/*.md'],
    base: './content/posts',
  },
  schema: {
    dateModifiedField: 'modified',
    optionalDescription: false,
    optionalTags: false,
  },
  remarkPlugins: [] as unknown[],
};

export type SsgConfig = typeof defaults & {
  schema: typeof defaults.schema & {
    extraFields?: (zod: any) => Record<string, any>;
  };
};

export function defineConfig(overrides: Partial<{
  content: Partial<SsgConfig['content']>;
  schema: Partial<SsgConfig['schema']>;
  remarkPlugins: SsgConfig['remarkPlugins'];
}>): SsgConfig {
  return {
    content: { ...defaults.content, ...overrides?.content },
    schema: { ...defaults.schema, ...overrides?.schema },
    remarkPlugins: overrides?.remarkPlugins ?? defaults.remarkPlugins,
  };
}

export async function loadConfig(): Promise<SsgConfig> {
  const configPath = resolve(process.cwd(), 'ssg.config.ts');
  if (!existsSync(configPath)) {
    return defineConfig({});
  }
  try {
    const configUrl = pathToFileURL(configPath).href;
    const mod = await import(/* @vite-ignore */ configUrl);
    return mod.default ?? defineConfig({});
  } catch {
    return defineConfig({});
  }
}
