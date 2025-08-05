import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyImageTransformPlugin)
	eleventyConfig.setInputDirectory('src')
	eleventyConfig.setOutputDirectory('dist')
}
