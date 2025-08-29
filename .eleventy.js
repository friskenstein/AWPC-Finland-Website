import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import http from 'node:http'

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyImageTransformPlugin)

	eleventyConfig.setInputDirectory('src')
	eleventyConfig.setOutputDirectory('dist')

	// Dev server: proxy /api/* to local API (http://localhost:3000)
	eleventyConfig.setServerOptions({
		middleware: [
			function apiProxy(req, res, next) {
				if (!req.url.startsWith('/api/')) return next()

				const targetPath = req.url.replace(/^\/api/, '') || '/'
				const options = {
					host: 'localhost',
					port: 3000,
					method: req.method,
					path: targetPath,
					headers: {
						...req.headers,
						host: 'localhost:3000',
					},
				}

				const proxyReq = http.request(options, (proxyRes) => {
					res.writeHead(proxyRes.statusCode || 500, proxyRes.headers)
					proxyRes.pipe(res, { end: true })
				})

				proxyReq.on('error', (err) => {
					res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' })
					res.end(`API proxy error: ${err.message}`)
				})

				req.pipe(proxyReq, { end: true })
			},
		],
	})
}

