const { Client, GatewayIntentBits } = require("discord.js")
const config = require("../config/config")
const Logger = require("../utils/logger")
const { wait } = require("../utils/functions")
const logger = new Logger({ file: __filename })
const Image = require("../models/Image")
const axios = require("axios")
//
let clients = []
let current_client_index = -1
function get_client_index() {
    current_client_index++
    if(current_client_index >= clients.length) current_client_index = 0
    return current_client_index
}
//
/**
 * Log in all Discord bots 
 */
async function start() {
    let all_webhook_channels_id = Object.keys(config.webhooks_data.channels)
    //
    // Login all bots
    let bots_count = 0
    config.bot_tokens.forEach((token, index) => {
        const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds] })
        //
        client.once("ready", () => {
            const client_channels = Array.from(client.channels.cache.keys())
            const if_cannot_view_all_channels = all_webhook_channels_id.some(webhook_channel_id => {
                return !client_channels.includes(webhook_channel_id)
            })
            //
            if(if_cannot_view_all_channels) {
                logger.error(`Bot [${index}] with token ending with: "${token.slice(-5)}" doesn"t have access to all webhooks channels`)
            } else {
                clients.push(client)
            }
            //
            bots_count++
        })
        //
        client.login(token).catch(err => {
            bots_count++
            logger.error(`Error while logging bot [${index}] with token ending with: "${token.slice(-5)}":\n`, err)
        })
    })
    //
    while(bots_count < config.bot_tokens.length) {
        await wait(50)
    }
    //
    if(clients.length == 0) throw new Error("No bots found")
    logger.log(`Successfully logged ${clients.length} bots`)
}
//
/**
 * Sends an image to a webhook and returns an Image object
 * @param {Image} image
 * @returns {Promise<Image>}
 */
async function fetch_image_from_channel(image) {
    return new Promise(async (res, err) => {
        if(!image) return err(`No image passed [${image.database_id}]`)
        //
        // Waits if bots are not ready yet
        while(clients.length == 0) {
            await wait(50)
        }
        const client_index = get_client_index()
        //
        const channel = clients[client_index].channels.cache.get(image.channel_id)
        if(!channel) return err(`Channel not found [${image.database_id}]`)
        //
        const message = await channel.messages.fetch(image.message_id).then(message => { return message }).catch(err => { return undefined })
        if(!message) return err(`Message not found [${image.database_id}]`)
        //
        if(!message.attachments.first()) await message.fetch()
        const attachment = message.attachments.first()
        if(!attachment) return err(`Attachment not found [${image.database_id}]`)
        //
        const image_response = await axios.get(attachment.url, { responseType: "arraybuffer" }).catch(err => { err(err) })
        const image_buffer = Buffer.from(image_response.data, "binary")
        //
        image.fill({ base64_image: image_buffer.toString("base64") })
        //
        res(image)
    })
}
//
module.exports = { start, fetch_image_from_channel }