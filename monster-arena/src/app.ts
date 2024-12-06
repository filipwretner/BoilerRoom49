interface Monster {
    id: string;
    name: string;
    image: string;
    speciality: string;
}

let firstUserTeam: string[] = [];
let allMonsters: Monster[] = [];
const messageDiv = document.getElementById("messageDiv") as HTMLElement;

async function fetchMonsters(): Promise<void> {
    try {

        const response = await fetch('https://www.dnd5eapi.co/api/monsters');
        
        if (!response.ok) {
            throw new Error("Failed to fetch monster data");
        }

        const data = await response.json();

        allMonsters = data.results.map((monster: any) => ({
            id: monster.index,
            name: monster.name,
            image: `https://via.placeholder.com/150?text=${monster.name}`,
            speciality: "A powerful creature from D&D universe."
        }));

        displayMonsters(allMonsters);
        
        const savedTeam = localStorage.getItem("monsterTeam");

        if (savedTeam) {
            firstUserTeam = JSON.parse(savedTeam);
            renderTeam();
        }

    } catch (error) {
        console.error("Error fetching monster data:", error);
        messageDiv.textContent = "Failed to load monsters. Please try again later.";
    }
}

function displayMonsters(monsterList: Monster[]): void {

    const container = document.getElementById("monster-container") as HTMLElement;
    container.innerHTML = "";

    monsterList.forEach((monster: Monster) => {
        const monsterCard = document.createElement("div");
        monsterCard.classList.add("monsterCard");

        const monsterImg = document.createElement("img");
        monsterImg.src = monster.image;
        monsterImg.alt = monster.name;

        const monsterDetails = document.createElement("div");
        monsterDetails.classList.add("monsterDetails");

        const monsterName = document.createElement("h3");
        monsterName.classList.add("monsterName");
        monsterName.textContent = monster.name;

        const monsterSpeciality = document.createElement("p");
        monsterSpeciality.classList.add("monsterSpeciality");
        monsterSpeciality.textContent = monster.speciality;

        const addButton = document.createElement("button");
        addButton.classList.add("addButton");
        addButton.textContent = "Add to your team";
        addButton.addEventListener("click", () => addToTeam(monster));

        monsterCard.appendChild(monsterImg);
        monsterCard.appendChild(monsterDetails);
        monsterDetails.appendChild(monsterName);
        monsterDetails.appendChild(monsterSpeciality);
        monsterDetails.appendChild(addButton);

        container.appendChild(monsterCard);
    });
}

function addToTeam(monster: Monster): void {

    if (firstUserTeam.length < 4 && !firstUserTeam.includes(monster.id)) {
        firstUserTeam.push(monster.id);
        messageDiv.textContent = "";
        renderTeam();
        saveTeamToLocalStorage();

    } else if (firstUserTeam.length >= 4) {
        messageDiv.textContent = "You can only select up to 4 unique monsters.";
    } else {
        messageDiv.textContent = "You can't select the same monster twice.";
    }
}

function removeFromTeam(monster: Monster): void {
    
    firstUserTeam = firstUserTeam.filter(id => id !== monster.id);
    messageDiv.textContent = "";
    renderTeam();
    saveTeamToLocalStorage();

}

function renderTeam(): void {

    const teamContainer = document.getElementById("teamContainer") as HTMLElement;
    teamContainer.innerHTML = "";

    firstUserTeam.forEach((id: string) => {

        const monster = allMonsters.find(m => m.id === id);
        if (!monster) return;

        const monsterCard = document.createElement("div");
        monsterCard.classList.add("monsterCard");

        const monsterImg = document.createElement("img");
        monsterImg.src = monster.image;
        monsterImg.alt = monster.name;

        const monsterDetails = document.createElement("div");
        monsterDetails.classList.add("monsterDetails");

        const monsterName = document.createElement("h3");
        monsterName.classList.add("monsterName");
        monsterName.textContent = monster.name;

        const monsterSpeciality = document.createElement("p");
        monsterSpeciality.classList.add("monsterSpeciality");
        monsterSpeciality.textContent = monster.speciality;

        const removeButton = document.createElement("button");
        removeButton.classList.add("removeButton");
        removeButton.textContent = "Remove from your team";
        removeButton.addEventListener("click", () => removeFromTeam(monster));

        monsterCard.appendChild(monsterImg);
        monsterCard.appendChild(monsterDetails);
        monsterDetails.appendChild(monsterName);
        monsterDetails.appendChild(monsterSpeciality);
        monsterDetails.appendChild(removeButton);

        teamContainer.appendChild(monsterCard);
    });
}

function saveTeamToLocalStorage(): void {
    localStorage.setItem("monsterTeam", JSON.stringify(firstUserTeam));
}

document.getElementById("resetButton")?.addEventListener("click", () => {

    firstUserTeam = [];
    messageDiv.textContent = "";
    saveTeamToLocalStorage();
    renderTeam();

});

document.addEventListener("DOMContentLoaded", fetchMonsters);