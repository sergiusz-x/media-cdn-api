const { WebhookClient, AttachmentBuilder } = require("discord.js")
const config = require("../config/config")
const Logger = require("../utils/logger")
const { random_hash } = require("../utils/functions")
const logger = new Logger({ file: __filename })
const Image = require("../models/Image")
const { compress_image } = require("../utils/compress_image")
//
let webhooks = []
let current_webhook_index = -1
function get_webhook_index() {
    current_webhook_index++
    if(current_webhook_index >= webhooks.length) current_webhook_index = 0
    return current_webhook_index
}
//
/**
 * Creats webhooks and appends them to array
 */
async function start() {
    //
    // Creating webhook clients
    let all_webhooks_count = 0
    const all_channels_id = Object.keys(config.webhooks_data.channels)
    all_channels_id.forEach(channel_id => {
        all_webhooks_count += config.webhooks_data.channels[channel_id].webhooks_url.length
    })
    //
    let failed_count = 0, all_count = 0
    let index_channel = -1
    while(webhooks.length + failed_count < all_webhooks_count) {
        index_channel++
        if(index_channel >= all_channels_id.length) index_channel = 0
        //
        try {
            const channel_id = all_channels_id[index_channel]
            //
            let webhooks_url = config.webhooks_data.channels[channel_id].webhooks_url
            if(!webhooks_url) continue
            //
            let hook_url = webhooks_url.shift()
            if(!hook_url) continue
            //
            const webhook = new WebhookClient({ url: hook_url })
            if(webhook) webhooks.push(webhook)
        } catch (error) {
            failed_count++
            logger.error("Error creating WebhookClient: ", error)
        }
        //
        all_count++
        if(all_count > all_webhooks_count+100) break
    }
    //
    if(webhooks.length == 0) throw new Error("No webhooks found")
    logger.log(`Successfully loaded ${webhooks.length} webhooks`)
    //
}
//
/**
 * Sends an image to a webhook and returns an Image object.
 * @returns {Promise<Image>}
 */
async function send_image(image_base64) {
    return new Promise(async (res, err) => {
        const webhook_index = get_webhook_index()
        const image_hash_id = random_hash()
        //
        try {
            image_base64 = await compress_image(image_base64)
            //
            const attachment = new AttachmentBuilder(Buffer.from(image_base64, "base64"), { name: `${image_hash_id}.jpg` })
            //
            webhooks[webhook_index].send({ files: [attachment], content: `${attachment.name}` }).then(message => {
                const image = new Image(image_hash_id, undefined, image_base64, Date.now(), message.channel_id, message.id)
                res(image)
            }).catch(error => {
                logger.error("Error sending image to webhook: ", error)
                err(error)
            })
        } catch (error) {
            logger.error("Error in send_image function: ", error)
            err(error)
        }
    })
}
//
module.exports = { start, send_image }