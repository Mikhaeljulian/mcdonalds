require('dotenv').config();
import fetch from "node-fetch";
import readlineSync from "readline-sync";
import chalk from "chalk";

const getCurl = async (inputEmail, deviceId) => {
    try {
        const response = await fetch(process.env.API_ENDPOINT, {
            method: "POST",
            headers: {
                'Host': process.env.API_HOST,
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, /',
                'Authorization': process.env.API_AUTHORIZATION,
                'Sec-Fetch-Site': 'same-site',
                'Accept-Language': 'id-ID,id;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Sec-Fetch-Mode': 'cors',
                'Origin': process.env.API_ORIGIN,
                'Content-Length': '97',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Referer': process.env.API_REFERER,
                'Sec-Fetch-Dest': 'empty'
            },
            body: JSON.stringify({
                "email": inputEmail,
                "device_id": deviceId,
                "username": "Nuggets"
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Gagal melakukan permintaan: ${error.message}`);
    }
};

function generateShortDeviceId() {
    const uniquePart1 = generateRandomChars(8);
    const uniquePart2 = generateRandomChars(4);
    const uniquePart3 = generateRandomChars(4);
    const uniquePart4 = generateRandomChars(4);
    const uniquePart5 = generateRandomChars(12);

    const deviceId = `${uniquePart1}-${uniquePart2}-${uniquePart3}-${uniquePart4}-${uniquePart5}`;
    return deviceId;
}

function generateRandomChars(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

(async () => {
    const deviceId = generateShortDeviceId();
    const inputEmail = readlineSync.question(`[?] Masukkan Email Kamu : `);

    try {
        const resultCurl = await getCurl(inputEmail, deviceId);
        console.log(resultCurl);

        if (resultCurl.meta.status === '200') {
            console.log(`[!] Status : ${chalk.green(`Berhasil`)}`);
        } else if (resultCurl.meta.status === `422`) {
            const deskripsi = resultCurl.meta.description;
            console.log(`[!] Status : ${chalk.red(deskripsi)}`);
        } else {
            console.log(`[!] Status : Tidak berhasil Curl`);
        }
    } catch (error) {
        console.error(`[!] Terjadi kesalahan: ${error.message}`);
    }
})();
