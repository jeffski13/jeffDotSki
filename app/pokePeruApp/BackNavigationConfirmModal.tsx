import { Button } from 'react-bootstrap';
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
                <p>Are you sure you want to return</p>
                <p>to the selection screen?</p>
                <Button onClick={() => window.location.href = destination}>Yes</Button>
                <Button onClick={() => onCancelNavigation()}>No</Button>
            </div>
        </div>
    );
}