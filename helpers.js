require("dotenv").config()

const axios = require("axios");

const GITHUB_URL = "https://api.github.com/users";

async function getGitHubUser(username) {
    const url = `${GITHUB_URL}/${username}`;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    const headers = {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json"
    }

    try {
        let response = await axios.get(url, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.message);
        return null;
    }

}

async function createOrUpdateContactFreshdesk(contact, freshdeskDomain) {

    const FRESHDESK_URL = `https://${freshdeskDomain}.freshdesk.com/api/v2/contacts`

    const FRESHDESK_TOKEN = process.env.FRESHDESK_TOKEN;
    const ENCODED_TOKEN = Buffer.from(FRESHDESK_TOKEN).toString('base64');

    const headers = {
      "Authorization": `Basic ${ENCODED_TOKEN}`,
      "Content-Type": 'application/json'
    };

    try {
        const res = await axios.get(FRESHDESK_URL, { headers });
        const id = findContactId(res.data, contact.unique_external_id);
        console.log(id);

        if (id === null) {
            try {
                const response = await axios.post(FRESHDESK_URL, contact, { headers });
                console.log(`Contact ${contact.unique_external_id} created successfully.`);
                return response.data;
            } catch (error) {
                console.log("Error creating: ", error.message);
            }
        } else {
            try {
                const response = await axios.put(`${FRESHDESK_URL}/${id}`, contact, { headers });
                console.log(`Contact ${contact.unique_external_id} updated successfully.`);
                return response.data;
            } catch (error) {
                console.log("Error updating: ", error.message);
            }
        }
    } catch (error) {
        console.log("Error getting", error.message);
    }
}


function findContactId(contacts, unique_external_id) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].unique_external_id === unique_external_id) {
            return contacts[i].id;
        }
    }

    return null;
}

module.exports = {
    getGitHubUser,
    createOrUpdateContactFreshdesk
}