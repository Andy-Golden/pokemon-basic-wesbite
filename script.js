const colorTypes = {
  grass: "rgb(99, 194, 99)",
  poison: "rgb(150, 29, 150)",
  bug: "rgb(31, 147, 31)",
  normal: "rgb(147, 146, 146);",
  flying: "rgb(73, 73, 207)",
  water: "rgb(108, 177, 220)",
  fire: "rgb(186, 63, 63)",
  electric: "rgb(193, 193, 107)",
};

//curry function
const handleOpenModal = (id) => () => {
  const detailPokes = JSON.parse(localStorage.getItem("detailPokes"));
  const poke = detailPokes.find((detailPoke) => detailPoke.id == id);

  const modal = document.getElementById("bg-modal");
  modal.classList.add("bg-modal--show");
  const input = modal.getElementsByTagName("input")[0];
  input.value = poke.name;
  localStorage.setItem("pokeId", id);
};

const formModal = document.getElementById("form-modal");

formModal.addEventListener("submit", (e) => {
  e.preventDefault();

  const pokeId = localStorage.getItem("pokeId");
  const detailPokes = JSON.parse(localStorage.getItem("detailPokes"));

  const newPokeName = document.getElementById("pokemon-name").value;
  document.getElementById(`pokemon-name${pokeId}`).innerHTML = newPokeName;

  detailPokes.forEach((detailPoke) => {
    if (detailPoke.id == pokeId) {
      detailPoke.name = newPokeName;
    }
  });

  localStorage.setItem("detailPokes", JSON.stringify(detailPokes));

  const modalClassList = document.getElementById("bg-modal").classList;
  modalClassList.remove("bg-modal--show");
});

window.onload = async () => {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=25");
  const listPoke = await data.json();

  let requests = listPoke?.results.map((res) => fetch(res.url));

  Promise.all(requests)
    .then((response) => Promise.all(response.map((r) => r.json())))
    .then((detailPokes) => {
      localStorage.setItem("detailPokes", JSON.stringify(detailPokes));
      detailPokes.forEach((detailPoke) => {
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

        const template = document.createElement("template");
        template.innerHTML = htmlString;
        document.getElementById("list-pokemon").appendChild(template.content);

        document.getElementById(`card-pokemon-btn${detailPoke.id}`).onclick =
          handleOpenModal(detailPoke.id);

        for (let i = 0; i < detailPoke.types.length; i++) {
          const elelementsTemplate = document.createElement("template");
          const elelementHtmlString = `<p class="card-pokemon__element" style="background-color: ${
            colorTypes[detailPoke.types[i].type.name]
          };">${detailPoke.types[i].type.name}</p>`;

          elelementsTemplate.innerHTML = elelementHtmlString;
          document
            .getElementById(`elelements${detailPoke.id}`)
            .appendChild(elelementsTemplate.content);
        }
      });
    })
    .catch((err) => console.log("err: ", err));
};

async function handleSearch(e) {
  e.preventDefault();

  const idPoke = form.pokemonId.value;

  try {
    const detailPoke = await (
      await fetch(`https://pokeapi.co/api/v2/pokemon/${idPoke}`)
    ).json();

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

    document.getElementById("list-pokemon").innerHTML = htmlString;

    document.getElementById(`card-pokemon-btn${detailPoke.id}`).onclick =
      handleOpenModal(detailPoke.id);
  } catch (err) {
    console.log("🚀 ~ file: script.js:45 ~ btnSearchClicked ~ err:", err);
  }
}

document.getElementById("btn-search").onclick = handleSearch;

function handleFilter() {
  const detailPokes = JSON.parse(localStorage.getItem("detailPokes"));
  const filterList = document
    .getElementById("filter-list")
    .getElementsByTagName("input");
  const filterListArr = Array.prototype.slice.call(filterList); // conver htmlCollection to arr

  const appliedFilters = filterListArr.filter((item) => item.checked);
  if (!appliedFilters?.length) {
    return;
  }

  const appliedFilterNames = appliedFilters.map((item) => item.name);

  const filteredPoke = detailPokes.filter((poke) => {
    return poke.types.some((item) =>
      appliedFilterNames.includes(item.type.name)
    );
  });

  if (!filteredPoke?.length) {
    document.getElementById("list-pokemon").innerHTML = "Not found";
  } else {
    document.getElementById("list-pokemon").innerHTML = "";

    filteredPoke.forEach((detailPoke) => {
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

      const template = document.createElement("template");
      template.innerHTML = htmlString;
      document.getElementById("list-pokemon").appendChild(template.content);

      document.getElementById(`card-pokemon-btn${detailPoke.id}`).onclick =
        handleOpenModal(detailPoke.id);

      for (let i = 0; i < detailPoke.types.length; i++) {
        const elelementsTemplate = document.createElement("template");
        const elelementHtmlString = `<p class="card-pokemon__element" style="background-color: ${
          colorTypes[detailPoke.types[i].type.name]
        };">${detailPoke.types[i].type.name}</p>`;

        elelementsTemplate.innerHTML = elelementHtmlString;
        document
          .getElementById(`elelements${detailPoke.id}`)
          .appendChild(elelementsTemplate.content);
      }
    });
  }
}

document.getElementById("btn-filter").onclick = handleFilter;

const handleCloseModal = () => {
  const modalClassList = document.getElementById("bg-modal").classList;
  modalClassList.remove("bg-modal--show");
};

document.getElementById("btn-close").onclick = handleCloseModal;
