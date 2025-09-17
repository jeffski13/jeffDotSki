import { useState } from 'react';
import SelectionResultsScreen from '../selectionResults/SelectionResultsScreen';
import Battle from './Battle';
import type { Monster } from '../monsters';
import './battle.css';
import '../infolink.css';
import BackNavigationConfirmModal from '../BackNavigationConfirmModal';
import ROUTES from '~/consts/ROUTES';

interface BattleProps {
  selectedMonsters: Monster[];
  battleRoute: string;
}

export default function BattleContainer({ selectedMonsters, battleRoute }: BattleProps) {
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
        <Battle selectedMonsters={selectedMonsters} battleRoute={battleRoute} />
      )}

      <a className="info-link-fixed-location" onClick={() => setInfoNavigationConfirm(true)}
        >
        <img
          src="/images/info-icon.png"
          alt="Information Link"
          className="info-link-icon clickable-link-icon"
        />
      </a>
      {showInfoNavigationConfirm && (<BackNavigationConfirmModal onCancelNavigation={() => setInfoNavigationConfirm(false)} destination={ROUTES.pokePeru.info}></BackNavigationConfirmModal>)}
    </div>
  );
}