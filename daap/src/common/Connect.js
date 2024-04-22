import React, { useState, useEffect } from 'react';
import { Connector, useChainId, useConnect } from 'wagmi';

export function Connect() {
    const chainId = useChainId();
    const { connectors, connect } = useConnect();

    return (
        <div className="buttons">
            {connectors.map((connector) => (
                <ConnectorButton
                    key={connector.uid}
                    connector={connector}
                    onClick={() => connect({ connector, chainId })}
                />
            ))}
        </div>
    );
}

function ConnectorButton({ connector, onClick }) {
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const fetchProvider = async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);
        };

        fetchProvider();
    }, [connector]);

    return (
        <button
            className="button"
            disabled={!ready}
            onClick={onClick}
            type="button"
        >
            {connector.name}
        </button>
    );
}
