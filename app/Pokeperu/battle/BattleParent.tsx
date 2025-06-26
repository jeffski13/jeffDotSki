import { useState } from 'react';
import SelectionResultsScreen from '../selectionResults/SelectionResultsScreen';
import Battle from './Battle';
import type { Monster } from '../monsters';
import ROUTES from '~/consts/ROUTES';
import './battle.css';
import '../infolink.css';
import InfoNavigationConfirmModal from '../InfoNavigationConfirmModal';

interface BattleProps {
  selectedMonsters: Monster[]
}

export default function BattleContainer({ selectedMonsters }: BattleProps) {
  const [isBattleClicked, setBattleClicked] = useState(false);

  const [showInfoNavigationConfirm, setInfoNavigationConfirm] = useState(false);

  if (selectedMonsters.length !== 2) {
    return <></>;
  }

  return (
    <div className="MonsterSelectionResults">
      {!isBattleClicked ? (
        <SelectionResultsScreen
          monster1={selectedMonsters[0]}
          monster2={selectedMonsters[1]}
          setBattleClicked={() => setBattleClicked(true)}
        />
      ) : (
        <Battle selectedMonsters={selectedMonsters} />
      )}

      <a className="info-link" onClick={() => setInfoNavigationConfirm(true)}
        >
        <img
          src="/images/info-icon.png"
          alt="Information Link"
          className="info-link-icon clickable-link-icon"
        />
      </a>
      {showInfoNavigationConfirm && (<InfoNavigationConfirmModal onCancelNavigation={() => setInfoNavigationConfirm(false)}></InfoNavigationConfirmModal>)}
    </div>
  );
}