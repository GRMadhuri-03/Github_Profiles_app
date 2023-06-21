const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

getUser("GRMadhuri-03");
async function getUser(username) {
    showLoading(); // Show loading effect
    
    try {
        const resp = await fetch(APIURL + username);
        const respData = await resp.json();

        createUserCard(respData);
        getRepos(username);
    } catch (error) {
        showError("An error occurred while fetching the user");
    }

    hideLoading(); // Hide loading effect
}

async function getRepos(username) {
    try {
        const resp = await fetch(APIURL + username + "/repos");
        const respData = await resp.json();

        addReposToCard(respData);
    } catch (error) {
        showError("An error occurred while fetching the repositories");
    }
}

function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <button class="close-btn" onclick="closeUserCard()">&#10005;</button>
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info">
                <h2>${user.name || user.login}</h2>
                ${user.bio ? `<p>${user.bio}</p>` : ''}
                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function showLoading() {
    main.innerHTML = '<div class="loading">Loading...</div>';
}

function hideLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function showError(message) {
    main.innerHTML = `<div class="error">${message}</div>`;
}

function closeUserCard() {
    main.innerHTML = "";
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
});
