import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'AI-Lab';
const pagesBasePath = `/${repositoryName}`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        trailingSlash: true,
        basePath: pagesBasePath,
        images: {unoptimized: true}
      }
    : {})
};

export default withNextIntl(nextConfig);
