interface ColorTypes {
  GRASS: string;
  POISON: string;
  BUG: string;
  NORMAL: string;
  FLYING: string;
  WATER: string;
  FIRE: string;
  ELECTRIC: string;
}

interface PokeTypes {
  GRASS: string;
  POISON: string;
  BUG: string;
  NORMAL: string;
  FLYING: string;
  WATER: string;
  FIRE: string;
  ELECTRIC: string;
}

interface Sprites {
  front_default: string;
}

interface Type {
  name: string;
  url: string;
}

interface Types {
  slot: number;
  type: Type;
}

interface PokeDetail {
  id: number;
  name: string;
  sprites: Sprites;
  types: Array<Types>;
}

interface FormElements extends HTMLFormElement {
  pokemonId: HTMLInputElement;
}
