import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		sveltekit(),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/onnxruntime-web/dist/*.jsep.*',
					dest: 'wasm'
				}
			]
		})
	],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
		APP_BUILD_HASH: JSON.stringify(process.env.APP_BUILD_HASH || 'dev-build')
	},
	build: {
		sourcemap: true
	},
	worker: {
		format: 'es'
	},
	server: {
		host: 'author.hallnet-ai', // Bind to domain
		port: 5173, // Change if needed
		strictPort: true, // Ensures it fails if the port is unavailable
		https: false, // Set to true if using SSL locally
		cors: {
			origin: 'https://author.hallnet-ai',
			methods: ['GET', 'POST', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true
		},
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8081', // Backend API (FastAPI)
				changeOrigin: true,
				secure: false,
				ws: true
			}
		},
		hmr: {
			host: 'author.hallnet-ai',
			port: 5173,
			protocol: 'wss' // Use `ws` if not running HTTPS
		}
	}
});
