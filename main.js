const { getGitHubUser, createOrUpdateContactFreshdesk } = require("./helpers");
const { updateOrCreateUserMySql } = require("./database");

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {

    console.log("You can retrieve the information for a user in Github to Freshdesk subdomain.")
    rl.question("Enter Github login: ", (githubLogin) => {

        rl.question("Enter Freshdesk subdomain: ", async (freshdeskSubdomain) => {

            try {
                const githubUser = await getGitHubUser(githubLogin);
        
                const contact = {
                    unique_external_id: githubUser.login,
                    name: githubUser.name || "default",
                    email: githubUser.email || `${githubUser.login}@default.com`,
                    address: githubUser.location || "default"
                };
                // Create or update the contact in Freshdesk
                const updatedContact = await createOrUpdateContactFreshdesk(contact, freshdeskSubdomain);
                console.log("Data for the contact updated:", updatedContact.unique_external_id);
    
                await updateOrCreateUserMySql(githubUser);
            } catch (error) {
                console.log(error.message);
                return;
            }
        
            rl.close();
            return true;
        });
    });
}

main()