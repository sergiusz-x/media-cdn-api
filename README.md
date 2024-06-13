# 🖼️ MediaCDN API

MediaCDN API leverages Discord as a storage medium to host and serve media files, turning it into a Content Delivery Network (CDN).

The goal of the project was to create an API that stores and returns photos, but it didn't necessarily have to be fast, so I used Discord as a data storage medium.


## Features

- **Storage on Discord**: Utilize Discord's servers to store media files.
- **API Access**: Access and manage stored media through a simple API.
- **Caching**: Improve performance with caching mechanisms (max-size and TTL).
- **Using Multiple Webhooks**: Send images to Discord using multiple webhooks to spread the load.
- **Using Multiple Bots**: Fetch images using multiple bots to distribute the load.
## API Reference
*Base endpoint: `/api/v1`*

### Saves new photo
```
  POST /image/save
```

| Multipart Form | Type | Required | Description |
| :- | :- | :- | :- |
| `image` | `photo` | yes | Photo to sav |

**Response**
```js
{
    "error": false,
    "message": "Successfully saved image",
    "data": {
        // Image data
    }
}
```
| Value  | Description |
| :- | :- |
| `error` | Whether image have been saved successfully |
| `message` | Information message |
| `data` | Image data |



### Fetches photo
```
  GET /image/get/:id
```

| Parameter | Type | Required | Description |
| :- | :- | :- | :- |
| `id` | `number` | yes | ID of the photo |

| Query | Type | Required | Description |
| :- | :- | :- | :- |
| `cache` | `boolean` | no | Wheter to get image from cache (if set to false it forces API to fetch image from Discord) |

**Response**
```js
{
    "error": false,
    "message": "Successfully saved image",
    "data": {
        "id": 1,
        "hash_id": "a6ed45914a6b77700b9c85ab2676868ed233b1f23ea00b1933a1bcb16dc63637",
        "database_id": 1,
        "timestamp_create": 1718129880615,
        "cached": true,
        "base64_image": "IMAGE_IN_BASE64_FORMAT"
    }
}
```
| Value  | Description |
| :- | :- |
| `error` | Whether image have been successfully fetched |
| `message` | Information message |
| `data` | Image data (without base64 image) |



### Check if photo exists
```
  GET /image/check/:id
```

| Parameter | Type | Required | Description |
| :- | :- | :- | :- |
| `id` | `number` | yes | ID of the photo |

**Response**
```json
{
    "error": false,
    "message": "Image exists",
    "data": {}
}
```
| Value  | Description |
| :- | :- |
| `error` | Whether image have been found |
| `message` | Information message |
| `data` | Empty object |

## Installation

Clone the repository:
```bash
git clone https://github.com/sergiusz-x/media-cdn-api.git
```

Navigate to the project directory:
```bash
cd media-cdn-api
```

Install dependencies:
```bash
npm install
```

## Configuration
**Complete files:**

**.env** (./env)
```json
PORT_HTTP=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=PASSWORD
MYSQL_DATABASE=media_cdn_api
```

**bot_tokens.json** (src/config/bot_tokens.json)
```json
{
    "tokens": [
        "BOT_TOKEN"
    ]
}
```
Fill: `BOT_TOKEN`


**webhooks.json** (src/config/webhooks.json)
```json
{
    "channels": {
        "DISCORD_CHANNEL_ID": {
            "webhooks_url": [
                "DISCORD_WEBHOOK_URL"
            ]
        }
    }
}
```
Fill: `DISCORD_CHANNEL_ID` and `DISCORD_WEBHOOK_URL`

**Create database table**
```sql
CREATE TABLE `mediacdn_images` (
  `id` int(11) NOT NULL,
  `hash_id` text NOT NULL,
  `timestamp_created` text NOT NULL,
  `channel_id` text NOT NULL,
  `message_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `mediacdn_images`
  ADD PRIMARY KEY (`id`);
```
## Usage

Tests:
```bash
npm test
```

Start the server:
```bash
npm start
```