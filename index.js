const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

// Настройки
const URL = 'https://beaconcha.in/api/v1/validator/';
const VALIDATOR_ID = 'afcd5afb7c7d25ee0a23bb545e8b9c86059279222216a942955ab88feb35506f65323b6364efb37cb2d54ed54ff5efed';
const BEACONCHAIN_API_KEY = 'QVViMlRYS09GZmQ4ZTcxSG02OXpvTkJ1UTRNUg';
const TELEGRAM_TOKEN = '7613542993:AAGMFEq6mMGHAPtfpyRWd885qyox2LF8FHg';
const TELEGRAM_CHAT_ID = '9178664';
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL, 10) || 60000;
const NOTIFY_IF_BELOW = parseInt(process.env.NOTIFY_IF_BELOW, 10) || null;

async function getValidatorData() {
    try {
        console.info('Fetching validator data...');
        const response = await axios.get(`${URL}${VALIDATOR_ID}`, {
            headers: {
                'accept': 'application/json',
                'apikey': BEACONCHAIN_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('ERROR Fetching validator data:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function sendTelegramNotification(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
            }),
        });
        console.log('Telegram Notification Sent');
    } catch (error) {
        console.error('ERROR during Telegram Notification:', error);
    }
}

async function monitorBalance() {
    const validatorData = await getValidatorData();
    if (!validatorData || validatorData.status !== 'OK') {
        console.log('ERROR: Validator data format issue');
        return;
    }

    const currentBalance = parseFloat(validatorData.data.balance / 1e9);

    console.log(`Fetched balance: ${currentBalance.toFixed(5)} ETH`);

    let previousBalance = '';
    try {
        previousBalance = parseFloat(fs.readFileSync('balance.txt', 'utf8'));
    } catch (error) {
        console.info('No prev. balance. Create a balance.txt file');
    }

    if (currentBalance !== previousBalance) {


        if (NOTIFY_IF_BELOW !== null) {
            if (currentBalance <= NOTIFY_IF_BELOW) {
                console.log(`Balance changed and it's below ${NOTIFY_IF_BELOW}`);
                await sendTelegramNotification(`Balance changed and it's below ${NOTIFY_IF_BELOW}!\nNew balance: ${currentBalance.toFixed(5)} ETH.\nPrevious was ${previousBalance.toFixed(5)} ETH`);
            } else {
                console.log(`Balance changed but it's not below ${NOTIFY_IF_BELOW}`);
            }
        } else {
            console.log('Balance changed');
            await sendTelegramNotification(`Balance changed!\nNew balance: ${currentBalance.toFixed(5)} ETH.\nPrevious was ${previousBalance.toFixed(5)} ETH`);
        }

        // Сохранить новое значение баланса
        fs.writeFileSync('balance.txt', currentBalance.toFixed(5));
    }
}

monitorBalance().then(() => {
    setInterval(monitorBalance, CHECK_INTERVAL);
})

