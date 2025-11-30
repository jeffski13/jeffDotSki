import { ENV } from './env';
import './styles.css';

interface DevEnvBannerProps {
    env: string | undefined | null;
}

export default function DevEnvBanner({env = null}:DevEnvBannerProps) {
    return (<></>);
    if (env === ENV.DEV){
        return (
            <div className="dev-banner">
                DEV BUILD
            </div>
        );
    }
    return (<></>);
}