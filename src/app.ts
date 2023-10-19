// import { COLOR_TYPES, POKE_TYPES } from "./constants";

const COLOR_TYPES: ColorTypes = {
  GRASS: "#63C263",
  POISON: "#961D96",
  BUG: "#1F931F",
  NORMAL: "#939292",
  FLYING: "#4949CF",
  WATER: "#6CB1DC",
  FIRE: "#BA3F3F",
  ELECTRIC: "#C1C16B",
};

const POKE_TYPES: PokeTypes = {
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

const uperCaseFirstLetter = (str: string) => {
  return str.replace(str[0], str[0].toUpperCase());
};

const castKeyOfObject = (key: string, obj: ColorTypes | PokeTypes) => {
  return key.toUpperCase() as keyof typeof obj;
};

const renderPokeCard = (pokeDetail: PokeDetail) => {
  const pokeName = pokeDetail.name;

  const htmlString = `<div draggable="true" class="card-pokemon">
    <img
      class="card-pokemon__image"
      src="${pokeDetail.sprites.front_default}" 
      alt="poke vatar"
    />
    <button id="card-pokemon-btn${pokeDetail.id}" class="card-pokemon__button">
      Edit       
    </button>
    <div class="card-pokemon__content">
      <div class="card-pokemon__info">
        <p class="card-pokemon__id">n 00${pokeDetail.id}</p>
        <p id="pokemon-name${
          pokeDetail.id
        }" class="card-pokemon__name">${uperCaseFirstLetter(pokeName)}</p>
      </div>
      <div id="elelements${pokeDetail.id}" class="card-pokemon__elements">
      </div>
    </div>
    </div>`;

  return htmlString;
};

const renderPokemonTypes = (pokeDetail: PokeDetail) => {
  const pokeEmlements = document.getElementById(`elelements${pokeDetail.id}`);

  if (!pokeEmlements) return;

  pokeEmlements.innerHTML = "";

  const len = pokeDetail.types.length > 2 ? 2 : pokeDetail.types.length;

  for (let i = 0; i < len; i++) {
    const elelementsTemplate = document.createElement("template");
    const type = pokeDetail.types[i].type.name;

    const elelementHtmlString = `<p class="card-pokemon__element" style="background-color: ${
      COLOR_TYPES[castKeyOfObject(type, COLOR_TYPES)]
    };">${uperCaseFirstLetter(type)}</p>`;

    elelementsTemplate.innerHTML = elelementHtmlString;

    pokeEmlements.appendChild(elelementsTemplate.content);
  }

  if (pokeDetail.types.length > 2) {
    const elelementsTemplate = document.createElement("template");
    const htmlString = `<p style="text-align: center; font-size: large;">...More</p>`;
    elelementsTemplate.innerHTML = htmlString;
    pokeEmlements.appendChild(elelementsTemplate.content);
  }
};

const handleMoveOption = (typeName: string) => () => {
  const dropdownSelectedOption = document.getElementById(
    `dropdown-option-${typeName}`
  );
  const option = document.getElementById(
    `option-${typeName}`
  ) as HTMLOptionElement;

  if (!dropdownSelectedOption || !option) return;

  dropdownSelectedOption.parentNode?.removeChild(dropdownSelectedOption);
  option.selected = false;
};

const renderPokeTypesInModal = (types: Array<Types>) => {
  const options = document.getElementById("dropdown-options");

  if (!options) return;

  options.innerHTML = "";

  Object.keys(POKE_TYPES).forEach((item) => {
    const option = document?.getElementById(
      `option-${POKE_TYPES[castKeyOfObject(item, POKE_TYPES)]}`
    ) as HTMLOptionElement;
    if (option) {
      option.selected = false;
    }
  });

  types.forEach((item: Types) => {
    const elementTemplates = document.createElement("template");
    const type = item.type.name;

    elementTemplates.innerHTML = `
      <div id="dropdown-option-${type}" class="dropdown__choosed-option" style="background-color: ${
      COLOR_TYPES[castKeyOfObject(type, COLOR_TYPES)]
    };">
        <span>${uperCaseFirstLetter(type)}</span>
        <button type="button" id="btn-remove-${type}" style="border: none; outline: none; background-color: transparent;">
          <i class="fas fa-times" style="font-size: small;"></i>
        </button>
      </div>
      `;
    options.appendChild(elementTemplates.content);

    const btnRemoveType = document.getElementById(
      `btn-remove-${item.type.name}`
    );

    if (btnRemoveType) {
      btnRemoveType.onclick = handleMoveOption(item.type.name);
    }

    const option = document?.getElementById(
      `option-${item.type.name}`
    ) as HTMLOptionElement;
    if (option) {
      option.selected = true;
    }
  });
};

const renderFilterTypes = () => {
  const filterList = document.getElementById("filter-list");

  if (!filterList) return;

  Object.values(POKE_TYPES).forEach((type) => {
    const elementTemplates = document.createElement("template");

    const htmlString = `
    <div class="filter-option">
      <input class="filter-option__input" type="checkbox" name="${type}" /> 
      <span>${uperCaseFirstLetter(type)}</span>
      <span id="${type}" style="color: red;"></span>
    </div>`;

    elementTemplates.innerHTML = htmlString;

    filterList.appendChild(elementTemplates.content);
  });
  const elementTemplates = document.createElement("template");
  elementTemplates.innerHTML = `<button type="button" id="btn-filter">Filter</button>`;
  filterList.appendChild(elementTemplates.content);

  const btnFilter = document.getElementById("btn-filter");

  if (btnFilter) {
    btnFilter.onclick = handleFilter;
  }
};

const renderNumberOfTypes = (detailPokes: any) => {
  const filterList = document
    .getElementById("filter-list")
    ?.getElementsByTagName("input");

  if (!filterList) return;

  const filterListArr = Array.prototype.slice.call(filterList);

  filterListArr.forEach((checkedFilter) => {
    const filteredPoke = detailPokes.filter((poke: PokeDetail) =>
      poke.types.some((item) => item.type.name === checkedFilter.name)
    );

    const numberOfPokes = document.getElementById(checkedFilter.name);

    if (numberOfPokes) {
      numberOfPokes.innerHTML = `(${filteredPoke.length})`;
    }
  });
};

const renderOptions = () => {
  const options = document.getElementById("multiselect");

  if (!options) return;

  Object.values(POKE_TYPES).map((type, index) => {
    const elelementsTemplate = document.createElement("template");
    const htmlString = `<option id="option-${type}" value="${index}">${uperCaseFirstLetter(
      type
    )}</option>`;
    elelementsTemplate.innerHTML = htmlString;

    options.appendChild(elelementsTemplate.content);
  });
};

const handleOpenModal = (id: number) => () => {
  const detailPokes = JSON.parse(localStorage.getItem("detailPokes") ?? "{}");

  const poke = detailPokes.find(
    (pokeDetail: PokeDetail) => pokeDetail.id === id
  );

  const modal = document.getElementById("bg-modal");

  const pokeImage = document.getElementById(
    "pokemon-image"
  ) as HTMLImageElement;

  if (!pokeImage || !modal) return;

  modal.classList.add("bg-modal--show");

  const input = modal.getElementsByTagName("input");

  if (!input) return;

  input[0].value = `n00${id}`;
  input[1].value = uperCaseFirstLetter(poke.name);

  const types = poke.types;

  renderPokeTypesInModal(types);

  pokeImage.src = poke.sprites.front_default;
};

const formModal = document.getElementById("form-modal");

formModal?.addEventListener("submit", (e) => {
  e.preventDefault();

  const detailPokes = JSON.parse(localStorage.getItem("detailPokes") ?? "{}");

  const newPokeName = (
    document.getElementById("pokemon-name") as HTMLInputElement
  ).value;
  const pokeId = (
    document.getElementById("pokemon-id") as HTMLInputElement
  ).value.split("n00")[1];

  const modalClassList = document.getElementById("bg-modal");

  if (!newPokeName || !pokeId || !modalClassList) {
    return;
  }

  const updatedPoke = document.getElementById(`pokemon-name${pokeId}`);

  if (!updatedPoke) return;

  updatedPoke.innerHTML = newPokeName;

  const multiSelect = Array.prototype.slice.call(
    document.getElementById("multiselect")
  );

  const selectedOptions = multiSelect.filter((item) => item.selected);

  detailPokes.forEach((pokeDetail: PokeDetail) => {
    if (pokeDetail.id.toString() === pokeId) {
      pokeDetail.name = newPokeName;

      const newTypes = selectedOptions.map((selectedOption, index) => {
        const obj = {
          slot: index + 1,
          type: { name: `${selectedOption.id}`.split("option-")[1], url: "" },
        };

        return obj;
      });
      pokeDetail.types = newTypes;
    }
  });

  renderPokemonTypes(detailPokes[+pokeId - 1]);

  localStorage.setItem("detailPokes", JSON.stringify(detailPokes));

  modalClassList.classList.remove("bg-modal--show");
});

const renderFilterTypesInSideBar = () => {
  const sideBar = document.getElementById("side-bar");

  if (!sideBar) return;

  Object.values(POKE_TYPES).forEach((type) => {
    const elelementsTemplate = document.createElement("template");
    const htmlString = `
    <div class="side-bar-option">
      <input class="side-bar-option__input" type="checkbox" name="${type}"> 
      <span>${uperCaseFirstLetter(type)}</span>
      <span id="side-bar-${type}" style="color: red;"></span>
    </div>`;
    elelementsTemplate.innerHTML = htmlString;

    sideBar.appendChild(elelementsTemplate.content);
  });

  const htmlString = ` <button type="button" id="btn-sidebar" class="side-bar__btn-filter">Filter</button>`;
  const elelementsTemplate = document.createElement("template");
  elelementsTemplate.innerHTML = htmlString;
  sideBar.appendChild(elelementsTemplate.content);
};

const renderNumberOfTypesInSideBar = (detailPokes: any) => {
  const filterList = document
    .getElementById("side-bar")
    ?.getElementsByTagName("input");

  if (!filterList) return;

  const filterListArr = Array.prototype.slice.call(filterList);

  filterListArr.forEach((checkedFilter) => {
    const filteredPoke = detailPokes.filter((poke: PokeDetail) =>
      poke.types.some((item) => item.type.name === checkedFilter.name)
    );

    const numberOfPokes = document.getElementById(
      `side-bar-${checkedFilter.name}`
    );

    if (numberOfPokes) {
      numberOfPokes.innerHTML = `(${filteredPoke.length})`;
    }
  });
};

window.onload = async () => {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=25");
  const listPoke = await data.json();

  let requests = listPoke?.results.map((res: any) => fetch(res.url));

  const response = await Promise.all(requests);

  const detailPokes = await Promise.all(response.map((r) => r.json()));

  detailPokes.forEach((pokeDetail: PokeDetail) => {
    const htmlString = renderPokeCard(pokeDetail);

    const template = document.createElement("template");
    template.innerHTML = htmlString;

    const listPokemon = document.getElementById("list-pokemon");

    if (listPokemon) {
      listPokemon.appendChild(template.content);
    }

    const btnEditPoke = document.getElementById(
      `card-pokemon-btn${pokeDetail.id}`
    );

    if (btnEditPoke) {
      btnEditPoke.onclick = handleOpenModal(pokeDetail.id);
    }

    renderPokemonTypes(pokeDetail);
  });

  localStorage.setItem("detailPokes", JSON.stringify(detailPokes));

  renderFilterTypes();
  renderNumberOfTypes(detailPokes);
  renderOptions();

  renderFilterTypesInSideBar();
  renderNumberOfTypesInSideBar(detailPokes);
};

const handleSearch = async (e: Event) => {
  e.preventDefault();

  const form = document.getElementById("form") as FormElements;

  const idPoke = form.pokemonId.value;

  try {
    const pokeDetail = await (
      await fetch(`https://pokeapi.co/api/v2/pokemon/${idPoke}`)
    ).json();

    const htmlString = renderPokeCard(pokeDetail);

    const listPokemon = document.getElementById("list-pokemon");

    if (listPokemon) {
      listPokemon.innerHTML = htmlString;
    }

    const btnEditPoke = document.getElementById(
      `card-pokemon-btn${pokeDetail.id}`
    );

    if (btnEditPoke) {
      btnEditPoke.onclick = handleOpenModal(pokeDetail.id);
    }

    renderPokemonTypes(pokeDetail);
  } catch (err) {
    console.log("🚀 ~ file: script.js:45 ~ btnSearchClicked ~ err:", err);
  }
};

const btnSearch = document.getElementById("btn-search");

if (btnSearch) {
  btnSearch.onclick = handleSearch;
}

const handleFilter = () => {
  const detailPokes = JSON.parse(localStorage.getItem("detailPokes") ?? "{}");
  const listPokemon = document.getElementById("list-pokemon");

  if (!listPokemon) return;

  const filterList = document
    .getElementById("filter-list")
    ?.getElementsByTagName("input");

  const filterListArr = Array.prototype.slice.call(filterList);

  const appliedFilters = filterListArr.filter((item) => item.checked);

  if (!appliedFilters?.length) {
    return;
  }

  const appliedFilterNames = appliedFilters.map((item) => item.name);
  const filteredPoke = detailPokes.filter((poke: PokeDetail) => {
    const result = appliedFilterNames.map((name) => {
      return poke.types.some((item) => item.type.name === name);
    });

    return result.every(Boolean);
  });

  if (!filteredPoke?.length) {
    listPokemon.innerHTML = `<h1 class="not-found-message">Not found</h1`;
    return;
  }

  listPokemon.innerHTML = "";

  filteredPoke.forEach((pokeDetail: PokeDetail) => {
    const htmlString = renderPokeCard(pokeDetail);
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    listPokemon.appendChild(template.content);

    const btnEditPoke = document.getElementById(
      `card-pokemon-btn${pokeDetail.id}`
    );

    if (btnEditPoke) {
      btnEditPoke.onclick = handleOpenModal(pokeDetail.id);
    }

    renderPokemonTypes(pokeDetail);
  });
};

const handleCloseModal = () => {
  const modal = document.getElementById("bg-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("bg-modal--show");
};

const btnClose = document.getElementById("btn-close");

if (btnClose) {
  btnClose.onclick = handleCloseModal;
}

const handleShowDropDown = () => {
  const multiSelect = document.getElementById("multiselect");

  if (!multiSelect) return;

  if (!IS_DROPPED) {
    IS_DROPPED = true;
    multiSelect.classList.add("dropdown--show");
    return;
  }

  IS_DROPPED = false;
  multiSelect.classList.remove("dropdown--show");
};

const btnShowDropDown = document.getElementById("btn-show-dropdown");

if (btnShowDropDown) {
  btnShowDropDown.onclick = handleShowDropDown;
}

const handleSelectedChange = (e: Event) => {
  const options = Array.prototype.slice.call(e.target);
  const selectedTypes: Array<Types> = [];

  options.forEach((item, index) => {
    if (item.selected) {
      const obj: Types = {
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

if (multiSelect) {
  multiSelect.onchange = handleSelectedChange;
}

const handleFilterInSidebar = () => {
  const detailPokes = JSON.parse(localStorage.getItem("detailPokes") ?? "{}");
  const listPokemon = document.getElementById("list-pokemon");

  if (!listPokemon) return;

  const filterList = document
    .getElementById("side-bar")
    ?.getElementsByTagName("input");

  const filterListArr = Array.prototype.slice.call(filterList);

  const appliedFilters = filterListArr.filter((item) => item.checked);

  if (!appliedFilters?.length) {
    return;
  }

  const appliedFilterNames = appliedFilters.map((item) => item.name);
  const filteredPoke = detailPokes.filter((poke: PokeDetail) => {
    const result = appliedFilterNames.map((name) => {
      return poke.types.some((item) => item.type.name === name);
    });

    return result.every(Boolean);
  });

  if (!filteredPoke?.length) {
    listPokemon.innerHTML = `<h1 class="not-found-message">Not found</h1`;
    return;
  }

  listPokemon.innerHTML = "";

  filteredPoke.forEach((pokeDetail: PokeDetail) => {
    const htmlString = renderPokeCard(pokeDetail);
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    listPokemon.appendChild(template.content);

    const btnEditPoke = document.getElementById(
      `card-pokemon-btn${pokeDetail.id}`
    );

    if (btnEditPoke) {
      btnEditPoke.onclick = handleOpenModal(pokeDetail.id);
    }

    renderPokemonTypes(pokeDetail);
  });
};

const handleShowSidebar = () => {
  const sidebar = document.getElementById("side-bar");
  sidebar?.classList.add("side-bar--show");

  const btnFilterSidebar = document.getElementById("btn-sidebar");
  
  if (btnFilterSidebar) {
    btnFilterSidebar.onclick = handleFilterInSidebar;
  }
};

const btnShowSidebar = document.getElementById("btn-show-side-bar");

if (btnShowSidebar) {
  btnShowSidebar.onclick = handleShowSidebar;
}

const handleCloseSidebar = () => {
  const sidebar = document.getElementById("side-bar");
  sidebar?.classList.remove("side-bar--show");
};

const btnCloseSidebar = document.getElementById("btn-close-side-bar");

if (btnCloseSidebar) {
  btnCloseSidebar.onclick = handleCloseSidebar;
}
