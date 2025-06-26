import { Button } from 'react-bootstrap';
import ROUTES from '~/consts/ROUTES';
import './navigationOverride.css';
import './navigation.css';

interface BackNavigationConfirmModalProps {
    onCancelNavigation: () => void;
}

export default function BackNavigationConfirmModal({
    onCancelNavigation,
}: BackNavigationConfirmModalProps) {

    return (
        <div className="back-confirm-modal">
            <div className="back-confirm-content">
                <p>Are you sure?</p>
                <Button onClick={() => window.location.href = ROUTES.pokePeru.battle}>Yes</Button>
                <Button onClick={() => onCancelNavigation()}>No</Button>
            </div>
        </div>
    );
}