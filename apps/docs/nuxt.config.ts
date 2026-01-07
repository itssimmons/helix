// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	sourcemap: false,
	modules: ['@nuxtjs/i18n'],
	extends: ['shadcn-docs-nuxt'],
	i18n: {
		defaultLocale: 'en',
		locales: [
			{
				code: 'en',
				name: 'English',
				language: 'en-US',
			},
			{
				code: 'es',
				name: 'Español',
				language: 'es-ES',
			},
		],
	},
	content: {
		respectPathCase: true,
	},
 	compatibilityDate: '2024-07-06',
  nitro: {
    prerender: {
			failOnError: false,
      concurrency: 1
    }
  }
});
