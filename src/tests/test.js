const path = require("path")
const fetch = require("node-fetch")
const FormData = require("form-data")
const fs = require("fs")
const { expect } = require("chai")
//
const images = [
    { filename: "test_image.jpeg", expected_status: 200, expected_error: false, expected_message: "Successfully saved image" },
    { filename: "test_image.jpg", expected_status: 200, expected_error: false, expected_message: "Successfully saved image" },
    { filename: "test_image.png", expected_status: 200, expected_error: false, expected_message: "Successfully saved image" },
    { filename: "test_image.webp", expected_status: 400, expected_error: true, expected_message: "File type not allowed" },
    { filename: "test_image_big.png", expected_status: 400, expected_error: true, expected_message: "File size exceeds limit" }
]
const base_url = `http://localhost:3000/api/v1`
//
describe("Image API Tests", async () => {
    let image_ids = []
    //
    before("send images to save", async () => {
        for(const image of images) {
            const form_data = new FormData()
            form_data.append("image", fs.createReadStream(path.join(__dirname, image.filename)))
            //
            const response = await fetch(`${base_url}/image/save`, { method: "POST", body: form_data })
            const data = await response.json()
            //
            image["response"] = response
            image["data"] = data
            //
            if(!data.error) {
                image_ids.push(data.data.id)
            }
        }
    })
    //
    it("should save images", async () => {
        for(const image of images) {
            const { response, data } = image
            //
            expect(response.status).to.equal(image.expected_status)
            expect(data.error).to.equal(image.expected_error)
            expect(data.message).to.equal(image.expected_message)
            //
            delete image.response
            delete image.data
        }
        
    })
    //
    it("should check if images are available", async () => {
        for(const image_id of image_ids) {
            const response = await fetch(`${base_url}/image/check/${image_id}`, { method: "GET" })
            const data = await response.json()
            //
            expect(response.status).to.equal(200)
            expect(data.error).to.equal(false)
            expect(data.message).to.equal("Image exists")
        }
        //
        // Non-existent image
        const response = await fetch(`${base_url}/image/check/0`, { method: "GET" })
        const data = await response.json()
        //
        expect(response.status).to.equal(404)
        expect(data.error).to.equal(true)
        expect(data.message).to.equal("Image not found")
    })
    //
    it("should get the images (with caching)", async () => {
        for(const image_id of image_ids) {
            const response = await fetch(`${base_url}/image/get/${image_id}`, { method: "GET" })
            const data = await response.json()
            //
            expect(response.status).to.equal(200)
            expect(data.error).to.equal(false)
            expect(data.data.cached).to.equal(true)
            expect(data.message).to.equal("Successfully fetched image")
        }
        //
        // Non-existent image
        const response = await fetch(`${base_url}/image/get/0`, { method: "GET" })
        const data = await response.json()
        //
        expect(response.status).to.equal(404)
        expect(data.error).to.equal(true)
        expect(data.message).to.equal("Image not found")
        //
    })
    //
    it("should get the images (without caching)", async () => {
        for(const image_id of image_ids) {
            const response = await fetch(`${base_url}/image/get/${image_id}?cache=false`, { method: "GET" })
            const data = await response.json()
            //
            expect(response.status).to.equal(200)
            expect(data.error).to.equal(false)
            expect(data.data.cached).to.equal(false)
            expect(data.message).to.equal("Successfully fetched image")
        }
    })
})