import './styles.css';

interface DevEnvBannerProps {
    env: string | undefined | null;
}

export default function DevEnvBanner({env = null}:DevEnvBannerProps) {
    if (env === 'development'){
        return (
            <div className="dev-banner">
                DEV BUILD
            </div>
        )
    }
    return (<></>)
}