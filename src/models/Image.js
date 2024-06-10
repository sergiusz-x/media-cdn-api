class Image {
    constructor(hash_id, database_id, base64_image, timestamp_created, channel_id, message_id) {
        this.hash_id = hash_id
        this.database_id = database_id
        this.base64_image = base64_image
        this.timestamp_created = timestamp_created
        this.channel_id = channel_id
        this.message_id = message_id
    }
    //
    fill(new_fields) {
        for(const field in new_fields) {
            if(this.hasOwnProperty(field)) {
                this[field] = new_fields[field]
            }
        }
    }
    //
    fill_from_db_row(row) {
        this.hash_id = row.hash_id
        this.database_id = row.id
        this.timestamp_created = Number(row.timestamp_created)
        this.channel_id = row.channel_id
        this.message_id = row.message_id
    }
    //
    returnDbInsertArray() {
        return [
            this.hash_id,
            this.timestamp_created,
            this.channel_id,
            this.message_id
        ]
    }
    //
    returnApiJson(return_image_base64=false) {
        return {
            id: this.database_id,
            hash_id: this.hash_id,
            database_id: this.database_id,
            timestamp_created: this.timestamp_created,
            base64_image: return_image_base64 ? this.base64_image : undefined
        }
    }
}
//
module.exports = Image  