import PokePeruExtendedUniverseBattle from "../PokePeruExtendedUniverse";
import { Pokedex } from "../../pokedex/Pokedex"
import { GymLeaderList } from "../../gym/GymLeaderList";
import ROUTES from "~/consts/ROUTES";

import { getExtendedUniverseMonsters } from "./monstersExtendedUniverse"
import { getExtendedUniverseGymLeaders } from "./gymLeadersExtendedUniverse";
import backgroundImageList from "~/pokePeruApp/battle/backgroundImagesList";

const EDIT_KEY = 'pokedexEditsSouthCarolina';
const battleRoute = ROUTES.pokePeru.extendedUniverse.southCarolina.battle;
const dexRoute = ROUTES.pokePeru.extendedUniverse.southCarolina.dex;
const gymRoute = ROUTES.pokePeru.extendedUniverse.southCarolina.gym;

export default function PokePeruExtendedUniverse() {
  return (
    <PokePeruExtendedUniverseBattle
      monsters={getExtendedUniverseMonsters()}
      gymLeaders={getExtendedUniverseGymLeaders()}
      monstersEditKey={EDIT_KEY}
      dexRoute={dexRoute}
      battleRoute={battleRoute}
      gymRoute={gymRoute}
      backgroundImageList={backgroundImageList}
    />
  );
}

export function PokedexExtendedUniverseContainer() {
  return (<Pokedex
    storageKey={EDIT_KEY}
    selectedMonsters={getExtendedUniverseMonsters()}
    battleRoute={battleRoute} />);
}

export function GymLeaderListExtendedUniverseContainer() {
  return (<GymLeaderList
    gymLeaders={getExtendedUniverseGymLeaders()}
    monsterList={getExtendedUniverseMonsters()}
    battleRoute={battleRoute} />);
}
