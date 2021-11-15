const profileOverview = document.querySelector(".overview"); //Div where profile info will appera
const username = "nicolebaggerly"; //Github username
const displayRepoList = document.querySelector(".repo-list"); //UL where repos will be displayed

//Fetches Github user info 
const profileInfo = async function () {
    const res = await fetch (`https://api.github.com/users/${username}`);
    const data = await res.json();
    console.log(data);
    displayInfo(data);
};
profileInfo();

//Creates new div and displays fetched info 
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
};


const displayRepos = function (repos) {
    for (let repo of repos) {
        const item = document.createElement("li");
        item.classList.add("repo");
        item.innerHTML = `<h3>${repo.name}</h3>`; //Use repo (no S) because looping through each indiv. repo
        displayRepoList.append(item);
    }
}