import { Button } from 'react-bootstrap';
import ROUTES from '~/consts/ROUTES';
import './navigationOverride.css';
import './navigation.css';

interface InfoNavigationConfirmModalProps {
    onCancelNavigation: () => void;
}

export default function InfoNavigationConfirmModal({
    onCancelNavigation,
}: InfoNavigationConfirmModalProps) {

    return (
        <div className="back-confirm-modal">
            <div className="back-confirm-content">
                <p>Are you sure?</p>
                <Button onClick={() => window.location.href = ROUTES.pokePeru.info}>Yes</Button>
                <Button onClick={() => onCancelNavigation()}>No</Button>
            </div>
        </div>
    );
}