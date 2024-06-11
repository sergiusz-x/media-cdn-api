const Image = require("../models/Image")
//
class ImageCache {
    constructor(maxSize = 100, maxAge = 1000 * 60 * 10) {
        this.maxSize = maxSize
        this.maxAge = maxAge
        this.cache = new Map()
    }
    //
    /**
     * Adds image to cache
     * @param {Number} id
     * @param {Image} imageData
     */
    add_image(id, imageData) {
        const now = Date.now()
        this.cache.set(id, { imageData, timestamp: now })
        //
        if(this.cache.size > this.maxSize) {
            this.clean_cache()
        }
    }
    //
    /**
     * Get image from cache
     * @param {Number} id
     * @returns {Promise<Image>}
     */
    get_image(id) {
        const cachedImage = this.cache.get(id)
        if(cachedImage) {
            const isExpired = (Date.now() - cachedImage.timestamp) > this.maxAge
            if(isExpired) {
                this.cache.delete(id)
                return null
            }
            cachedImage.imageData.cached = true
            return cachedImage.imageData
        }
        return null
    }
    //
    /**
     * Cleans cache, TTL and max_size
     */
    clean_cache() {
        const now = Date.now()
        this.cache.forEach((value, key) => {
            if((now - value.timestamp) > this.maxAge) {
                this.cache.delete(key)
            }
        })
        //
        while(this.cache.size > this.maxSize) {
            const oldestKey = this.cache.keys().next().value
            this.cache.delete(oldestKey)
        }
    }
}
//
module.exports = ImageCache