const axios = require('axios')
const AWS = require('aws-sdk')
const jsdom = require('jsdom')


const sourceUrl = "https://www.gov.uk/guidance/red-list-of-countries-and-territories"
const destinationPath = '2021/02/football/epl.json'

const s3 = new AWS.S3()

const version = 1

var s3params = {
    Bucket: "gdn-cdn",
    // Key: `2021/jan/jhu/processed-jhu-data.json`,
    ACL: 'public-read',
    ContentType: 'application/json',
    CacheControl: 'max-age=300'
}


async function fetcher() {


    const resp = await axios.default.get(sourceUrl)

    const dom = new jsdom.JSDOM(resp.data)

    const table = dom.window.document.querySelector("#red-list-of-countries-and-territories ~ table > tbody");

    if (table) {

        for (var i = 0; i < table.getElementsByTagName("th").length; i++) {
            console.log(table.getElementsByTagName("th")[i].innerHTML)
            console.log(table.getElementsByTagName("td")[i].innerHTML)
        }
     
    }
}

async function wrapper() {

    await fetcher()
    return 'end'

}


const handler = async(event) => {

    await wrapper()
    const response = {
        statusCode: 200,
        body: `complete at ${(new Date).toLocaleString()} using ${version}`,
    };
    return response;
};

const init = async() => {
    if (!process.env['LAMBDA_ENV']) {
        await wrapper()
        console.log('finished')
        return 'end'
    } else {

    }
}

init()