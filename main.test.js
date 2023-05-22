const { createOrUpdateContactFreshdesk, getGitHubUser } = require("./helpers")

const GITHUB_TEST_LOGIN = "IvoJoy";
const FRESHDESK_TEST_SUBDOMAIN = "regiocom-help";

test("Checks if we are retrieving the information for the user and then updating the information for the user in the Freshdesk platform correctly.", async () => {

    const githubUser = await getGitHubUser(GITHUB_TEST_LOGIN);

    expect(githubUser.login).toBe(GITHUB_TEST_LOGIN);

    const contact = {
        unique_external_id: githubUser.login,
        name: githubUser.name || "default",
        email: githubUser.email || `${githubUser.login}@default.com`.toLocaleLowerCase(),
        address: githubUser.location || "default"
    };

    const updatedContact = await createOrUpdateContactFreshdesk(contact, FRESHDESK_TEST_SUBDOMAIN);

    expect(updatedContact.name).toBe(contact.name);
    expect(updatedContact.email).toBe(contact.email);
    expect(updatedContact.address).toBe(contact.address);
});

