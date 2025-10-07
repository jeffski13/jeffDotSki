import { PokePeruContent } from "..";
import { getClaremoreMonsters } from "./monstersClaremore"
import { Pokedex } from "../pokedex/Pokedex"
import ROUTES from "~/consts/ROUTES";
import { GymLeaderList } from "../gym/GymLeaderList";
import { getClaremoreGymLeaders } from "./gymleadersClaremore";

const CLAREMORE_EDIT_KEY = 'pokedexEditsClaremore';

export default function PokePeruClaremore() {
  return (
    <div className="TitlePage" >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent
        monsters={getClaremoreMonsters()}
        gymLeaders={getClaremoreGymLeaders()}
        monstersEditKey={CLAREMORE_EDIT_KEY}
        dexRoute={ROUTES.pokePeru.pokeClaremoreDex} 
        battleRoute={ROUTES.pokePeru.pokeClaremore} 
        gymRoute={ROUTES.pokePeru.pokeClaremoreGym}
      />
    </div>
  );
}

export function PokedexClaremoreContainer() {
  return (<Pokedex 
    storageKey={CLAREMORE_EDIT_KEY}
    selectedMonsters={getClaremoreMonsters()} 
    battleRoute={ROUTES.pokePeru.pokeClaremore} />);
}

export function GymLeaderListClaremoreContainer() {
  return (<GymLeaderList gymLeaders={getClaremoreGymLeaders()} battleRoute={ROUTES.pokePeru.pokeClaremore} />);
}
