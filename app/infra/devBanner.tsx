import './styles.css';

interface DevBannerProps {
    env: string | undefined | null;
}

export default function DevBanner({env: isDev}:DevBannerProps) {
    if (isDev === 'development'){
        return (
            <div className="dev-banner">
                DEV BUILD
            </div>
        )
    }
    return (<></>)
}