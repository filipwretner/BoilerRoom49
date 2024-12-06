"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
let firstUserTeam = [];
let allMonsters = [];
const messageDiv = document.getElementById("messageDiv");
// Fetch monsters from Dungeons & Dragons API
function fetchMonsters() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://www.dnd5eapi.co/api/monsters');
            if (!response.ok) {
                throw new Error("Failed to fetch monster data");
            }
            const data = yield response.json();
            allMonsters = data.results.map((monster) => ({
                id: monster.index,
                name: monster.name,
                image: `https://via.placeholder.com/150?text=${monster.name}`,
                speciality: "A powerful creature from D&D universe."
            }));
            displayMonsters(allMonsters);
            loadSavedTeam();
        }
        catch (error) {
            console.error("Error fetching monster data:", error);
            messageDiv.textContent = "Failed to load monsters. Please try again later.";
        }
    });
}
function displayMonsters(monsterList) {
    const container = document.getElementById("monster-container");
    container.innerHTML = "";
    monsterList.forEach((monster) => {
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
function addToTeam(monster) {
    if (firstUserTeam.length < 4 && !firstUserTeam.includes(monster.id)) {
        firstUserTeam.push(monster.id);
        messageDiv.textContent = "";
        renderTeam();
        saveTeamToLocalStorage();
    }
    else if (firstUserTeam.length >= 4) {
        messageDiv.textContent = "You can only select up to 4 unique monsters.";
    }
    else {
        messageDiv.textContent = "You can't select the same monster twice.";
    }
}
function removeFromTeam(monster) {
    firstUserTeam = firstUserTeam.filter(id => id !== monster.id);
    messageDiv.textContent = "";
    renderTeam();
    saveTeamToLocalStorage();
}
function renderTeam() {
    const teamContainer = document.getElementById("teamContainer");
    teamContainer.innerHTML = "";
    firstUserTeam.forEach((id) => {
        const monster = allMonsters.find(m => m.id === id);
        if (!monster)
            return;
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
function saveTeamToLocalStorage() {
    localStorage.setItem("monsterTeam", JSON.stringify(firstUserTeam));
}
function loadSavedTeam() {
    const savedTeam = localStorage.getItem("monsterTeam");
    if (savedTeam) {
        firstUserTeam = JSON.parse(savedTeam);
        renderTeam();
    }
}
(_a = document.getElementById("resetButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    firstUserTeam = [];
    messageDiv.textContent = "";
    saveTeamToLocalStorage();
    renderTeam();
});
document.addEventListener("DOMContentLoaded", fetchMonsters);
