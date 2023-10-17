"use strict";
const colorTypes = {
    GRASS: "rgb(99, 194, 99)",
    POISON: "rgb(150, 29, 150)",
    BUG: "rgb(31, 147, 31)",
    NORMAL: "rgb(147, 146, 146);",
    FLYING: "rgb(73, 73, 207)",
    WATER: "rgb(108, 177, 220)",
    FIRE: "rgb(186, 63, 63)",
    ELECTRIC: "rgb(193, 193, 107)",
};
const pokeTypes = {
    GRASS: "grass",
    POISON: "poison",
    BUG: "bug",
    NORMAL: "normal",
    FLYING: "flying",
    WATER: "water",
    FIRE: "fire",
    ELECTRIC: "electric",
};
let IS_DROPPED = false;
const renderPokeCard = (detailPoke) => {
    const htmlString = `<div draggable="true" class="card-pokemon">
    <img
      class="card-pokemon__image"
      src="${detailPoke.sprites.front_default}" 
      alt="poke vatar"
    />
    <button id="card-pokemon-btn${detailPoke.id}" class="card-pokemon__button">
      Edit       
    </button>
    <div class="card-pokemon__content">
      <div class="card-pokemon__info">
        <p class="card-pokemon__id">n 00${detailPoke.id}</p>
        <p id="pokemon-name${detailPoke.id}" class="card-pokemon__name">${detailPoke.name}</p>
      </div>
      <div id="elelements${detailPoke.id}" class="card-pokemon__elements">
      </div>
    </div>
    </div>`;
    return htmlString;
};
const renderPokemonTypes = (detailPoke) => {
    const pokeEmlements = document.getElementById(`elelements${detailPoke.id}`);
    if (!pokeEmlements)
        return;
    pokeEmlements.innerHTML = "";
    for (let i = 0; i < detailPoke.types.length; i++) {
        const elelementsTemplate = document.createElement("template");
        const type = detailPoke.types[i].type.name.toUpperCase();
        const elelementHtmlString = `<p class="card-pokemon__element" style="background-color: ${colorTypes[type]};">${detailPoke.types[i].type.name}</p>`;
        elelementsTemplate.innerHTML = elelementHtmlString;
        pokeEmlements.appendChild(elelementsTemplate.content);
    }
};
const countTypes = (filteredPoked, appliedFilterNames) => {
    appliedFilterNames.forEach((name) => {
        const count = filteredPoked.filter((poke) => poke.types.some((item) => item.type.name === name)).length;
        const numberOfPokes = document.getElementById(name);
        if (numberOfPokes) {
            numberOfPokes.innerHTML = `(${count})`;
        }
    });
};
const handleMoveOption = (typeName) => () => {
    var _a;
    const dropdownSelectedOption = document.getElementById(`dropdown-option-${typeName}`);
    const option = document.getElementById(`option-${typeName}`);
    if (!dropdownSelectedOption || !option)
        return;
    (_a = dropdownSelectedOption.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(dropdownSelectedOption);
    option.selected = false;
};
const renderPokeTypesInModal = (types) => {
    const options = document.getElementById("dropdown-options");
    if (!options)
        return;
    options.innerHTML = "";
    Object.values(pokeTypes).forEach((item) => {
        const option = document === null || document === void 0 ? void 0 : document.getElementById(`option-${item}`);
        if (option) {
            option.selected = false;
        }
    });
    types.forEach((item) => {
        const elementTemplates = document.createElement("template");
        const type = item.type.name.toUpperCase();
        elementTemplates.innerHTML = `
      <div id="dropdown-option-${item.type.name}" class="dropdown__choosed-option" style="background-color: ${colorTypes[type]};">
        <span>${item.type.name}</span>
        <button type="button" id="btn-remove-${item.type.name}" style="border: none; outline: none; background-color: transparent;">
          <i class="fas fa-times" style="font-size: small;"></i>
        </button>
      </div>
      `;
        options.appendChild(elementTemplates.content);
        const btnRemoveType = document.getElementById(`btn-remove-${item.type.name}`);
        if (btnRemoveType) {
            btnRemoveType.onclick = handleMoveOption(item.type.name);
        }
        const option = document === null || document === void 0 ? void 0 : document.getElementById(`option-${item.type.name}`);
        if (option) {
            option.selected = true;
        }
    });
};
//curry function
const handleOpenModal = (id) => () => {
    var _a;
    const detailPokes = JSON.parse((_a = localStorage.getItem("detailPokes")) !== null && _a !== void 0 ? _a : "{}");
    const poke = detailPokes.find((detailPoke) => detailPoke.id === id);
    const modal = document.getElementById("bg-modal");
    const pokeImage = document.getElementById("pokemon-image");
    if (!pokeImage || !modal)
        return;
    modal.classList.add("bg-modal--show");
    const input = modal.getElementsByTagName("input");
    if (!input)
        return;
    input[0].value = `n00${id}`;
    input[1].value = poke.name;
    const types = poke.types;
    renderPokeTypesInModal(types);
    pokeImage.src = poke.sprites.front_default;
};
const formModal = document.getElementById("form-modal");
formModal === null || formModal === void 0 ? void 0 : formModal.addEventListener("submit", (e) => {
    var _a;
    e.preventDefault();
    const detailPokes = JSON.parse((_a = localStorage.getItem("detailPokes")) !== null && _a !== void 0 ? _a : "{}");
    const newPokeName = document.getElementById("pokemon-name").value;
    const pokeId = document.getElementById("pokemon-id").value.split("n00")[1];
    const modalClassList = document.getElementById("bg-modal");
    if (!newPokeName || !pokeId || !modalClassList) {
        return;
    }
    const updatedPoke = document.getElementById(`pokemon-name${pokeId}`);
    if (!updatedPoke)
        return;
    updatedPoke.innerHTML = newPokeName;
    const multiSelect = Array.prototype.slice.call(document.getElementById("multiselect"));
    const selectedOptions = multiSelect.filter((item) => item.selected);
    detailPokes.forEach((detailPoke) => {
        if (detailPoke.id.toString() === pokeId) {
            detailPoke.name = newPokeName;
            const newTypes = selectedOptions.map((selectedOption, index) => {
                const obj = {
                    slot: index + 1,
                    type: { name: `${selectedOption.id}`.split("option-")[1], url: "" },
                };
                return obj;
            });
            detailPoke.types = newTypes;
        }
    });
    renderPokemonTypes(detailPokes[+pokeId - 1]);
    localStorage.setItem("detailPokes", JSON.stringify(detailPokes));
    modalClassList.classList.remove("bg-modal--show");
});
window.onload = async () => {
    var _a;
    const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=25");
    const listPoke = await data.json();
    let requests = listPoke === null || listPoke === void 0 ? void 0 : listPoke.results.map((res) => fetch(res.url));
    const response = await Promise.all(requests);
    const detailPokes = await Promise.all(response.map((r) => r.json()));
    detailPokes.forEach((detailPoke) => {
        const htmlString = renderPokeCard(detailPoke);
        const template = document.createElement("template");
        template.innerHTML = htmlString;
        // document.getElementById("list-pokemon").appendChild(template.content);
        const listPokemon = document.getElementById("list-pokemon");
        if (listPokemon) {
            listPokemon.appendChild(template.content);
        }
        const btnEditPoke = document.getElementById(`card-pokemon-btn${detailPoke.id}`);
        if (btnEditPoke) {
            btnEditPoke.onclick = handleOpenModal(detailPoke.id);
        }
        renderPokemonTypes(detailPoke);
    });
    localStorage.setItem("detailPokes", JSON.stringify(detailPokes));
    const filterList = (_a = document
        .getElementById("filter-list")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("input");
    if (!filterList)
        return;
    const filterListArr = Array.prototype.slice.call(filterList);
    filterListArr.forEach((checkedFilter) => {
        const filteredPoke = detailPokes.filter((poke) => poke.types.some((item) => item.type.name === checkedFilter.name));
        const numberOfPokes = document.getElementById(checkedFilter.name);
        if (numberOfPokes) {
            numberOfPokes.innerHTML = `(${filteredPoke.length})`;
        }
    });
};
async function handleSearch(e) {
    e.preventDefault();
    const form = document.getElementById("form");
    const idPoke = form.pokemonId.value;
    try {
        const detailPoke = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${idPoke}`)).json();
        const htmlString = renderPokeCard(detailPoke);
        const listPokemon = document.getElementById("list-pokemon");
        if (listPokemon) {
            listPokemon.innerHTML = htmlString;
        }
        const btnEditPoke = document.getElementById(`card-pokemon-btn${detailPoke.id}`);
        if (btnEditPoke) {
            btnEditPoke.onclick = handleOpenModal(detailPoke.id);
        }
        renderPokemonTypes(detailPoke);
    }
    catch (err) {
        console.log("🚀 ~ file: script.js:45 ~ btnSearchClicked ~ err:", err);
    }
}
const btnSearch = document.getElementById("btn-search");
if (btnSearch)
    btnSearch.onclick = handleSearch;
function handleFilter() {
    var _a, _b;
    const detailPokes = JSON.parse((_a = localStorage.getItem("detailPokes")) !== null && _a !== void 0 ? _a : "{}");
    const listPokemon = document.getElementById("list-pokemon");
    if (!listPokemon)
        return;
    const filterList = (_b = document
        .getElementById("filter-list")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("input");
    const filterListArr = Array.prototype.slice.call(filterList);
    const appliedFilters = filterListArr.filter((item) => item.checked);
    if (!(appliedFilters === null || appliedFilters === void 0 ? void 0 : appliedFilters.length)) {
        return;
    }
    const appliedFilterNames = appliedFilters.map((item) => item.name);
    const filteredPoke = detailPokes.filter((poke) => {
        const result = appliedFilterNames.map((name) => {
            return poke.types.some((item) => item.type.name === name);
        });
        return result.every(Boolean);
    });
    // filterListArr.forEach((checkedFilter) => {
    //   const numberOfPokes = document.getElementById(checkedFilter.name);
    //   if (numberOfPokes) {
    //     numberOfPokes.innerHTML = "(0)";
    //   }
    // });
    if (!(filteredPoke === null || filteredPoke === void 0 ? void 0 : filteredPoke.length)) {
        listPokemon.innerHTML = `<p class"not-found-message">Not found</p`;
    }
    else {
        listPokemon.innerHTML = "";
        filteredPoke.forEach((detailPoke) => {
            const htmlString = renderPokeCard(detailPoke);
            const template = document.createElement("template");
            template.innerHTML = htmlString;
            listPokemon.appendChild(template.content);
            const btnEditPoke = document.getElementById(`card-pokemon-btn${detailPoke.id}`);
            if (btnEditPoke) {
                btnEditPoke.onclick = handleOpenModal(detailPoke.id);
            }
            renderPokemonTypes(detailPoke);
        });
        // countTypes(filteredPoke, appliedFilterNames);
    }
}
const btnFilter = document.getElementById("btn-filter");
if (btnFilter)
    btnFilter.onclick = handleFilter;
const handleCloseModal = () => {
    const modal = document.getElementById("bg-modal");
    if (!modal)
        return;
    modal.classList.remove("bg-modal--show");
};
const btnClose = document.getElementById("btn-close");
if (btnClose)
    btnClose.onclick = handleCloseModal;
const handleShowDropDown = () => {
    const multiSelect = document.getElementById("multiselect");
    if (!multiSelect)
        return;
    if (!IS_DROPPED) {
        IS_DROPPED = true;
        multiSelect.classList.add("dropdown--show");
    }
    else {
        IS_DROPPED = false;
        multiSelect.classList.remove("dropdown--show");
    }
};
const btnShowDropDown = document.getElementById("btn-show-dropdown");
if (btnShowDropDown)
    btnShowDropDown.onclick = handleShowDropDown;
const handleSelectedChange = (e) => {
    const options = Array.prototype.slice.call(e.target);
    const selectedTypes = [];
    options.forEach((item, index) => {
        if (item.selected) {
            const obj = {
                slot: index + 1,
                type: {
                    name: `${item.id}`.split("option-")[1],
                    url: "",
                },
            };
            selectedTypes.push(obj);
        }
    });
    renderPokeTypesInModal(selectedTypes);
};
const multiSelect = document.getElementById("multiselect");
if (multiSelect)
    multiSelect.onchange = handleSelectedChange;
