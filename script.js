window.onload = async () => {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=25");
  const listPoke = await data.json();
  listPoke?.results.forEach(async (poke) => {
    try {
      const detailPoke = await (await fetch(poke.url)).json();

      const htmlString = `<div class="card-pokemon">
        <img
          class="card-pokemon__image"
          src="${detailPoke.sprites.front_default}"
          alt="poke vatar"
        />
        <div class="card-pokemon__content">
          <div class="card-pokemon__info">
            <p class="card-pokemon__id">n 00${detailPoke.id}</p>
            <p class="card-pokemon__name">${detailPoke.name}</p>
          </div>
          <div class="card-pokemon__elements">
            <p class="card-pokemon__element">Grass</p>
            <p class="card-pokemon__element">Grass</p>
          </div>
        </div>
      </div>`;

      const template = document.createElement("template");
      template.innerHTML = htmlString;
      document.getElementById("list-pokemon").appendChild(template.content);
    } catch (err) {
      console.log(
        "🚀 ~ file: script.js:30 ~ listPoke?.results.forEach ~ err:",
        err
      );
    }
  });
};

async function btnSearchClicked(e) {
  e.preventDefault();

  const idPoke = form.pokemonId.value;

  try {
    const detailPoke = await (
      await fetch(`https://pokeapi.co/api/v2/pokemon/${idPoke}`)
    ).json();

    const htmlString = `<div class="card-pokemon">
            <img
              class="card-pokemon__image"
              src="${detailPoke.sprites.front_default}"
              alt="poke vatar"
            />
            <div class="card-pokemon__content">
              <div class="card-pokemon__info">
                <p class="card-pokemon__id">n 00${detailPoke.id}</p>
                <p class="card-pokemon__name">${detailPoke.name}</p>
              </div>
              <div class="card-pokemon__elements">
                <p class="card-pokemon__element">Grass</p>
                <p class="card-pokemon__element">Grass</p>
              </div>
            </div>
          </div>`;

    document.getElementById("list-pokemon").innerHTML = htmlString;
  } catch (err) {
    console.log("🚀 ~ file: script.js:45 ~ btnSearchClicked ~ err:", err);
  }
}

document.getElementById("btn-search").onclick = btnSearchClicked;
