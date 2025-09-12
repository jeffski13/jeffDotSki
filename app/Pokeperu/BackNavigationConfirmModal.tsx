import { Button } from 'react-bootstrap';
import ROUTES from '~/consts/ROUTES';
import './navigationOverride.css';
import './navigation.css';

interface BackNavigationConfirmModalProps {
    onCancelNavigation: () => void;
    destination: string;
}

export default function BackNavigationConfirmModal({
    onCancelNavigation,
    destination
}: BackNavigationConfirmModalProps) {

    return (
        <div className="back-confirm-modal">
            <div className="back-confirm-content">
                <p>Are you sure?</p>
                <Button onClick={() => window.location.href = destination}>Yes</Button>
                <Button onClick={() => onCancelNavigation()}>No</Button>
            </div>
        </div>
    );
}