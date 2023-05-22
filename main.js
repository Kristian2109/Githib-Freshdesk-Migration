const { getGitHubUser, createOrUpdateContactFreshdesk } = require("./helpers");
const { updateOrCreateUserMySql } = require("./database");

const readline = require('readline');

// Create an interface for reading from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
    console.log("You can retrieve the information for the a user in Github to Freshdesk subdomain.")
    rl.question("Enter Github login: ", (githubLogin) => {

        rl.question("Enter Freshdesk subdomain: ", async (freshdeskSubdomain) => {

            const githubUser = await getGitHubUser(githubLogin);
        
            const contact = {
                unique_external_id: githubUser.login,
                name: githubUser.name || "default",
                email: githubUser.email || `${githubUser.login}@default.com`,
                address: githubUser.location || "default"
            };
            // Create or update the contact in Freshdesk
            const updatedContact = await createOrUpdateContactFreshdesk(contact, freshdeskSubdomain);
            console.log("Data for the contact updated:", updatedContact);

            updateOrCreateUserMySql(githubUser);
        
            rl.close();
        });
    });
}

main()