const profileOverview = document.querySelector(".overview"); //Div where profile info will appera
const username = "nicolebaggerly"; //Github username
const displayRepoList = document.querySelector(".repo-list"); //UL where repos will be displayed
const reposSection = document.querySelector(".repos"); //Section to display repo info
const repoDataSection = document.querySelector(".repo-data"); //Section to display *individual* repo data
const backButton = document.querySelector(".view-repos") //Back to Repo Gallery button
const filterInput = document.querySelector(".filter-repos") //Selects input to filter repos


//Fetches Github user info 
const profileInfo = async function () {
    const res = await fetch (`https://api.github.com/users/${username}`);
    const data = await res.json();
    console.log(data);
    displayInfo(data);
};
profileInfo();

//Creates new div and displays username info 
const displayInfo = function (data) {
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `<figure>
          <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Bio:</strong> ${data.bio}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div> `;
    profileOverview.append(userInfo);
    repos();
};


//Fetches repos 
const repos = async function () {
    const repoRes = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repoRes.json();
    displayRepos(repoData);
    //console.log(repoData);
};

//Creates list and displays repos via loop  
const displayRepos = function (repos) {
    for (let repo of repos) {
        const item = document.createElement("li");
        item.classList.add("repo");
        item.innerHTML = `<h3>${repo.name}</h3>`; //Use repo (no 's') because looping through each indiv. repo
        displayRepoList.append(item);
    }

    filterInput.classList.remove("hide");
}

//Event listener for clicking a repo
displayRepoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText; 
        repoInfoFetch(repoName);
    }
});

//Fetches info for individual repo
const repoInfoFetch = async function (repoName) {
    const infoRes = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await infoRes.json();
    console.log(repoInfo);
    
    //Fetches languages
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    //Adds languages to empty array
    const languages = [];
    for (let language in languageData) {
        languages.push(language);
    }

    indivRepoInfo(repoInfo, languages);
};

//Displays info about individual repo 
const indivRepoInfo = function (repoInfo, languages) {
    repoDataSection.innerHTML = "";
    const repoDiv = document.createElement("div");
    repoDiv.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

    repoDataSection.append(repoDiv);
    repoDataSection.classList.remove("hide");
    reposSection.classList.add("hide");
    backButton.classList.remove("hide");
}

//Event listener for back button 
backButton.addEventListener("click", function () {
    reposSection.classList.remove("hide");
    repoDataSection.classList.add("hide");
    backButton.classList.add("hide");
});


//Filters repos in search box
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase(); //Takes search text value and converts to lowercase

    for (let repo of repos) {
        const repoLowerCase = repo.innerText.toLowerCase();
        if (repoLowerCase.includes(searchLowerText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});


