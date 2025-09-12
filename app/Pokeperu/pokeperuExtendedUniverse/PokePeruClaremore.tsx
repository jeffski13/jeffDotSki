import { PokePeruContent } from "..";
import { monsters } from "../monsters"
import { monstersClaremore } from "./monstersClaremore"
import { Pokedex } from "../pokedex/Pokedex"

const getMonsters = () => {
  return [...monstersClaremore, ...monsters];
}

export default function PokePeruClaremore() {
  return (
    <div className="TitlePage" >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent monsters={getMonsters()} />
    </div>
  );
}

export function PokedexClaremoreContainer() {
  const allMonstersClaremore = [...monstersClaremore, ...monsters];
  return (<Pokedex selectedMonsters={getMonsters()} />);
}
