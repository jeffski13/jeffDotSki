import PokePeruExtendedUniverseBattle from "../PokePeruExtendedUniverse";
import { Pokedex } from "../../pokedex/Pokedex"
import { GymLeaderList } from "../../gym/GymLeaderList";
import ROUTES from "~/consts/ROUTES";

import { getExtendedUniverseMonsters } from "./monstersExtendedUniverse"
import { getExtendedUniverseGymLeaders } from "./gymLeadersExtendedUniverse";

const EDIT_KEY = 'pokedexEditsSouthCarolina';
const battleRoute = ROUTES.pokePeru.extendedUnivers.southCarolina.battle;
const dexRoute = ROUTES.pokePeru.extendedUnivers.southCarolina.dex;
const gymRoute = ROUTES.pokePeru.extendedUnivers.southCarolina.gym;

export default function PokePeruExtendedUniverse() {
  return (
    <PokePeruExtendedUniverseBattle
      monsters={getExtendedUniverseMonsters()}
      gymLeaders={getExtendedUniverseGymLeaders()}
      monstersEditKey={EDIT_KEY}
      dexRoute={dexRoute}
      battleRoute={battleRoute}
      gymRoute={gymRoute}
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
    battleRoute={battleRoute} />);
}
