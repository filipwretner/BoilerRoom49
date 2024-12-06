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
let allCharacters = [];
const messageDiv = document.getElementById("messageDiv");
function fetchCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('./characters.json');
            if (!response.ok) {
                throw new Error("Failed to fetch character data");
            }
            const data = yield response.json();
            allCharacters = data.map((character) => ({
                id: character.id,
                name: character.name,
                image: character.image,
                passive: character.passive,
                basic: character.basic,
                ultimate: character.ultimate
            }));
            displayCharacters(allCharacters);
            const savedTeam = localStorage.getItem("characterTeam");
            if (savedTeam) {
                firstUserTeam = JSON.parse(savedTeam);
                renderTeam();
            }
        }
        catch (error) {
            console.error("Error fetching character data:", error);
            messageDiv.textContent = "Failed to load characters. Please try again later.";
        }
    });
}
function displayCharacters(characterList) {
    const container = document.getElementById("character-container");
    container.innerHTML = "";
    characterList.forEach((character) => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("characterCard");
        characterCard.innerHTML = `
            <img src="${character.image}" alt="Picture of ${character.name}">
            <h3>${character.name}</h3>
            <p>Abilities</p>
            <p class="abilityText">${character.passive}</p>
            <p class="abilityText">${character.basic}</p>
            <p class="abilityText">${character.ultimate}</p>
        `;
        const addButton = document.createElement("button");
        addButton.classList.add("addButton");
        addButton.textContent = "Add to your team";
        addButton.addEventListener("click", () => {
            console.log(`Adding ${character.name} to your team`);
            addToTeam(character);
        });
        characterCard.appendChild(addButton);
        container.appendChild(characterCard);
    });
}
function addToTeam(character) {
    if (firstUserTeam.length < 4 && !firstUserTeam.includes(character.id)) {
        firstUserTeam.push(character.id);
        messageDiv.textContent = "";
        renderTeam();
        saveTeamToLocalStorage();
    }
    else if (firstUserTeam.length >= 4) {
        messageDiv.textContent = "You can only select up to 4 unique characters.";
    }
    else {
        messageDiv.textContent = "You can't select the same character twice.";
    }
    console.log(`Current team: ${firstUserTeam}`);
}
function removeFromTeam(character) {
    firstUserTeam = firstUserTeam.filter(id => id !== character.id);
    messageDiv.textContent = "";
    renderTeam();
    saveTeamToLocalStorage();
}
function renderTeam() {
    const teamContainer = document.getElementById("teamContainer");
    teamContainer.innerHTML = "";
    firstUserTeam.forEach((id) => {
        const character = allCharacters.find(m => m.id === id);
        if (!character) {
            messageDiv.textContent = "No characters saved";
            return;
        }
        const characterCard = document.createElement("div");
        characterCard.classList.add("characterCard");
        characterCard.innerHTML = `
        <img src="${character.image}" alt="Picture of ${character.name}">
        <h3>${character.name}</h3>
        `;
        const removeButton = document.createElement("button");
        removeButton.classList.add("removeButton");
        removeButton.textContent = "Remove from your team";
        removeButton.addEventListener("click", () => {
            console.log(`Removing ${character.name} from your team`);
            removeFromTeam(character);
        });
        characterCard.appendChild(removeButton);
        teamContainer.appendChild(characterCard);
    });
}
function saveTeamToLocalStorage() {
    try {
        localStorage.setItem("characterTeam", JSON.stringify(firstUserTeam));
        console.log("Team saved to localStorage:", firstUserTeam);
    }
    catch (error) {
        console.error("Failed to save team to localStorage:", error);
    }
}
(_a = document.getElementById("resetButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    firstUserTeam = [];
    messageDiv.textContent = "";
    saveTeamToLocalStorage();
    renderTeam();
});
document.addEventListener("DOMContentLoaded", fetchCharacters);
