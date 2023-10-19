type PokeType =
  | "GRASS"
  | "POISON"
  | "BUG"
  | "NORMAL"
  | "FLYING"
  | "WATER"
  | "FIRE"
  | "ELECTRIC";

type ColorTypes = {
  [key in PokeType]: string;
}

type PokeTypes = {
  [key in PokeType]: string;
};

// enum PokeType {
//   GRASS,
//   POISON,
//   BUG,
//   NORMAL,
//   FLYING,
//   WATER,
//   FIRE,
//   ELECTRIC,
// }

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
