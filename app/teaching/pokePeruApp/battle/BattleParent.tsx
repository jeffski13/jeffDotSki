import { useState } from 'react';
import SelectionResultsScreen from '../selectionResults/SelectionResultsScreen';
import Battle from './Battle';
import type { Monster } from '../monsters';
import './battle.css';
import '../infolink.css';
import BackNavigationConfirmModal from '../BackNavigationConfirmModal';
import ROUTES from '~/consts/ROUTES';
import type { GymLeader } from '../gymleaders';

interface BattleProps {
  selectedMonsters: Monster[];
  gymLeaders: GymLeader[];
  battleRoute: string;
  backgroundImageList: string[];
}

export default function BattleContainer({ selectedMonsters, gymLeaders, battleRoute, backgroundImageList }: BattleProps) {
  const [isBattleClicked, setBattleClicked] = useState(false);

  const [showInfoNavigationConfirm, setInfoNavigationConfirm] = useState(false);

  if (selectedMonsters.length !== 2) {
    return <></>;
  }

  const trainer1 = gymLeaders.find(e => e.id.toLowerCase() === selectedMonsters[0].trainerId.toLowerCase());
  const trainer2 = gymLeaders.find(e => e.id.toLowerCase() === selectedMonsters[1].trainerId.toLowerCase());

  return (
    <div className="MonsterSelectionResults">
      {!isBattleClicked ? (
        <SelectionResultsScreen
          monster1={selectedMonsters[0]}
          monster2={selectedMonsters[1]}
          trainer1={trainer1}
          trainer2={trainer2}
          setBattleClicked={() => setBattleClicked(true)}
          battleRoute={battleRoute}
        />
      ) : (
        <Battle
          selectedMonsters={selectedMonsters}
          battleRoute={battleRoute}
          trainer1={trainer1}
          trainer2={trainer2}
          backgroundImageList={backgroundImageList}
        />
      )}

      <a className="info-link-fixed-location info-link-fixed-location-battle" onClick={() => setInfoNavigationConfirm(true)}
      >
        <img
          src="/images/info-icon.png"
          alt="Information Link"
          className="info-link-icon clickable-link-icon"
        />
      </a>
      {showInfoNavigationConfirm && (<BackNavigationConfirmModal destinationText='info page' onCancelNavigation={() => setInfoNavigationConfirm(false)} destination={ROUTES.pokePeru.info}></BackNavigationConfirmModal>)}
    </div>
  );
}