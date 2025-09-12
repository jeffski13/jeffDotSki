import { PokePeruContent } from "..";
import { getClaremoreMonsters } from "./monstersClaremore"
import { Pokedex } from "../pokedex/Pokedex"
import ROUTES from "~/consts/ROUTES";

export default function PokePeruClaremore() {
  return (
    <div className="TitlePage" >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent monsters={getClaremoreMonsters()} dexRoute={ROUTES.pokePeru.pokeClaremoreDex} />
    </div>
  );
}

export function PokedexClaremoreContainer() {
  return (<Pokedex selectedMonsters={getClaremoreMonsters()} battleRoute={ROUTES.pokePeru.pokeClaremore} />);
}
