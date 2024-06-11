const sharp = require("sharp")
//
/**
 * Compresses an image given in base64 format
 * @param {string} base64Image - The image in base64 format
 * @param {number} [quality=50] - The quality of the compressed image (1-100)
 * @returns {Promise<string>} - A promise that resolves to the compressed image in base64 format
 */
async function compress_image(base64Image, quality=50) {
    try {
        const imageBuffer = Buffer.from(base64Image, "base64")
        //
        const compressedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: quality, mozjpeg: true })
            .toBuffer()
        //
        return compressedBuffer.toString("base64")
    } catch (error) {
        throw new Error(`Error compressing image: ${error.message}`)
    }
}
//
module.exports = { compress_image }