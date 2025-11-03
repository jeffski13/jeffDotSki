import { PokePeruContent, type PokePeruContentProps } from "..";

export default function PokePeruExtendedUniverseBattle({
  monsters,
  gymLeaders,
  dexRoute,
  battleRoute,
  gymRoute,
  monstersEditKey
}: PokePeruContentProps) {
  return (
    <div >
      <div className="pokeperu-img-container">
        <img src="/images/pokemoninperu.png" alt="PokePeru" className="pokeperu-logo" />
      </div>
      <PokePeruContent
        monsters={monsters}
        gymLeaders={gymLeaders}
        monstersEditKey={monstersEditKey}
        dexRoute={dexRoute} 
        battleRoute={battleRoute} 
        gymRoute={gymRoute}
      />
    </div>
  );
}