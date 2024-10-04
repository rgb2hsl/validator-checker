# Dead-simple ETH validator balance monitor

### How's working

1. Get validator id, beaconcha.in API key and our own Telegram bot. Below is guides for Telegram and Beaconcha.in.
2. Put validator id into `VALIDATOR_ID=` value of `.env` (create it from example, if you haven't yet).
2. Once it run, it will notify you each time validator balance changes.
4. Use `NOTIFY_IF_BELOW` to notify ONLY when balance is below certain value (useful to indicate slashes).

You can also change `CHECK_INTERVAL` if you want. It's in millis.

### Telegram set up

1. Create new bot via BotFather bot's `/newbot` (search online how to do it aor ask GPT)
2. Grab bot token and put it into `TELEGRAM_TOKEN=` value of `.env`. Bot token looks like `0000000000:numbersANDdigits`
3. Find your bot in Telegram by it's name, hit START and send something to it
4. Go to `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates` (replace EXACTLY YOUR_BOT_TOKEN with your bot token from p2)
5. You should see your message and it's chat id. Put chat id (looks like `987654321`, number) into `TELEGRAM_CHAT_ID=` of `.env`

### Beaconcha.in setup

1. Sign in \ up
2. Go to personal settings page, API tab
3. Here's your API key, put it in `BEACONCHAIN_API_KEY=` value of '.env'