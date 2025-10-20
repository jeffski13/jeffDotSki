import PokePeruExtendedUniverseBattle from "../PokePeruExtendedUniverse";
import { Pokedex } from "../../pokedex/Pokedex"
import { GymLeaderList } from "../../gym/GymLeaderList";
import ROUTES from "~/consts/ROUTES";

import { getExtendedUniverseMonsters } from "./monstersExtendedUniverse"
import { getExtendedUniverseGymLeaders } from "./gymLeadersExtendedUniverse";

const EDIT_KEY = 'pokedexEditsClaremore';
const battleRoute = ROUTES.pokePeru.extendedUniverse.claremore.battle;
const dexRoute = ROUTES.pokePeru.extendedUniverse.claremore.dex;
const gymRoute = ROUTES.pokePeru.extendedUniverse.claremore.gym;

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
    monsterList={getExtendedUniverseMonsters()}
    battleRoute={battleRoute} />);
}
