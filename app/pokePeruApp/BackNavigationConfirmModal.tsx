import { Button } from 'react-bootstrap';
import './navigationOverride.css';
import './navigation.css';

interface BackNavigationConfirmModalProps {
    onCancelNavigation: () => void;
    destination: string;
    destinationText: string;
}

export default function BackNavigationConfirmModal({
    onCancelNavigation,
    destination,
    destinationText,
}: BackNavigationConfirmModalProps) {

    return (
        <div className="back-confirm-modal">
            <div className="back-confirm-content">
                <div className="back-confirm-content-text-container">
                    <p className="back-confirm-content-text">Are you sure you want to go</p>
                    
                    
                    <p className="back-confirm-content-text">to the {destinationText} ?</p>
                </div>
                <Button onClick={() => window.location.href = destination}>Yes</Button>
                <Button onClick={() => onCancelNavigation()}>No</Button>
            </div>
        </div>
    );
}