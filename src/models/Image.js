/**
 * Represents an image with various attributes and methods to handle image data
 */
class Image {
    /**
     * Creates an instance of Image
     * @param {string} hash_id - The unique hash identifier for the image
     * @param {number} database_id - The ID of the image in the database
     * @param {string} base64_image - The image in base64 format
     * @param {number} timestamp_created - The timestamp when the image was created
     * @param {string} channel_id - The ID of the Discord channel where message is stored
     * @param {string} message_id - The ID of the Discord message which contains image
     */
    constructor(hash_id, database_id, base64_image, timestamp_created, channel_id, message_id) {
        this.hash_id = hash_id
        this.database_id = database_id
        this.base64_image = base64_image
        this.timestamp_created = timestamp_created
        this.channel_id = channel_id
        this.message_id = message_id
        this.cached = false
    }
    //
    /**
     * Updates the properties of the Image instance with new values
     * @param {Object} new_fields - An object containing new values for the properties
     */
    fill(new_fields) {
        for(const field in new_fields) {
            if(this.hasOwnProperty(field)) {
                this[field] = new_fields[field]
            }
        }
    }
    //
    /**
     * Fills the properties of the Image instance with values from a database row
     * @param {Object} row - A database row containing image data
     */
    fill_from_db_row(row) {
        this.hash_id = row.hash_id
        this.database_id = row.id
        this.timestamp_created = Number(row.timestamp_created)
        this.channel_id = row.channel_id
        this.message_id = row.message_id
    }
    //
    /**
     * Returns an array of values for inserting the image into the database
     * @returns {Array} An array containing the hash_id, timestamp_created, channel_id, and message_id
     */
    returnDbInsertArray() {
        return [
            this.hash_id,
            this.timestamp_created,
            this.channel_id,
            this.message_id
        ]
    }
    //
    /**
     * Returns a JSON representation of the Image instance for API responses
     * @param {boolean} [return_image_base64=false] - Whether to include the base64_image in the response
     * @returns {Object} A JSON object representing the image
     */
    returnApiJson(return_image_base64=false) {
        return {
            id: this.database_id,
            hash_id: this.hash_id,
            database_id: this.database_id,
            timestamp_created: this.timestamp_created,
            cached: this.cached,
            base64_image: return_image_base64 ? this.base64_image : undefined
        }
    }
}
//
module.exports = Image  