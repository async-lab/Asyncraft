import React, { useState, useEffect, type FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// API 响应的数据结构 (保持不变)
export interface McSrvStatusResponse {
    online: boolean;
    ip: string;
    port: number;
    hostname?: string;
    version?: string;
    icon?: string;
    motd?: {
        raw: string[];
        clean: string[];
        html: string[];
    };
    players?: {
        online: number;
        max: number;
        list?: {
            name: string;
            uuid: string;
        }[];
    };
    debug: {
        cachetime: number;
        cacheexpire: number;
        apiversion: number;
        [key: string]: any;
    };
}

// 定义组件接收的 props 类型
interface ServerStatusProps {
    address: string;
    bedrock?: boolean;
}

// ---- 辅助组件 ----

// 加载动画组件
const LoadingSpinner: FC = () => (
    <div style={styles.loadingContainer}>
        <div className="spinner" />
        <span style={{ marginLeft: '10px' }}>正在获取服务器状态...</span>
        {/* Spinner 动画样式，通过 style 标签注入 */}
        <style>{`
            .spinner {
                width: 24px;
                height: 24px;
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: #09f;
                border-radius: 50%;
                animation: spin 1s ease infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

// 错误信息展示组件
const ErrorDisplay: FC<{ message: string }> = ({ message }) => (
    <div style={styles.errorContainer}>{message}</div>
);

// MOTD 渲染组件
const MotdDisplay: FC<{ data: McSrvStatusResponse; address: string }> = ({ data, address }) => {
    // 如果服务器离线，显示离线提示
    if (!data?.online) {
        return (
            <div style={styles.offlineContainer}>
                服务器 <strong>{address}</strong> 当前不在线或无法访问。
            </div>
        );
    }

    const onlineStatus = (
        <div style={styles.statusIndicator}>
            <span>{data.players?.online}/{data.players?.max}</span>
            <span style={{ ...styles.statusDot, backgroundColor: '#55FF55' }} />
        </div>
    );
    const motdHtml = data.motd?.html?.map((value, index) => index == 0 ? value + renderToStaticMarkup(onlineStatus) : value).join('<br />') || '';

    return (
        // <div style={styles.motdContainer}>
        //     <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        //         {data.icon && <img src={data.icon} alt="Server Icon" style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} />}
        //         <div>
        //             <strong style={{ fontSize: '1.2em', padding: "4px 8px" }}>{data.hostname || address}</strong>
        //             <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
        //                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: data.online ? '#55FF55' : '#FF5555' }}></span>
        //                 <span style={{ fontWeight: 'bold' }}> {data.online ? `在线` : '离线'} </span>
        //             </div>
        //         </div>
        //     </div>
        //     <hr style={{ borderColor: '#555', borderStyle: 'dashed' }} />

        //     {motdHtml && (
        //         <div style={styles.motdContent}>
        //             <div
        //                 style={styles.motdText}
        //                 dangerouslySetInnerHTML={{ __html: motdHtml }}
        //             />
        //         </div>
        //     )}
        // </div>
        <>
            {motdHtml && (
                <div style={styles.motdContent}>
                    <div
                        style={styles.motdText}
                        dangerouslySetInnerHTML={{ __html: motdHtml }}
                    />
                </div>
            )}
        </>
    );
};


// ---- 主组件 ----
const ServerStatus: FC<ServerStatusProps> = ({ address, bedrock = false }) => {
    const [serverData, setServerData] = useState<McSrvStatusResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!address) {
            setError('错误：必须提供服务器地址。');
            setLoading(false);
            return;
        }

        let isMounted = true; // 处理组件卸载时的状态更新
        setLoading(true);
        setError(null);
        setServerData(null);

        const apiType = bedrock ? 'bedrock/' : '';
        const apiUrl = `https://api.mcsrvstat.us/3/${apiType}${address}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`网络请求失败 (状态: ${response.status})`);
                return response.json() as Promise<McSrvStatusResponse>;
            })
            .then(data => {
                if (isMounted) setServerData(data);
            })
            .catch((err: Error) => {
                console.error("获取服务器状态失败:", err);
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; }; // 清理函数
    }, [address, bedrock]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;

    return <MotdDisplay data={serverData!!} address={address} />;
}

// ---- 样式对象 ----
const containerColor = 'var(--ifm-code-background)';
const borderColor = 'var(--ifm-table-border-color)';

const styles = {
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: containerColor,
        fontColor: 'var(--ifm-font-color-base)'
    },
    errorContainer: {
        padding: '10px',
        border: '1px solid #f44336',
        borderRadius: '8px',
        color: '#f44336',
        backgroundColor: '#ffdddd',
        fontColor: 'var(--ifm-font-color-base)'
    },
    offlineContainer: {
        padding: '10px',
        borderLeft: '4px solid #f44336',
        color: '#333',
        backgroundColor: '#ffdddd',
        fontColor: 'var(--ifm-font-color-base)'
    },
    motdContainer: {
        padding: '20px',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: containerColor,
        backdropFilter: 'blur(5px)',
        fontColor: 'var(--ifm-font-color-base)'
    },
    motdContent: {
        display: 'flex',
    },
    statusIndicator: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        margin: '0 0 0 20px',
    },
    statusDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
    },
    motdText: {
        padding: '10px 15px',
        borderRadius: '8px',
        flexGrow: '1',
        backgroundColor: 'rgba(0, 0, 0)',
        fontFamily: '"Minecraft", "Fira Code", monospace',
        lineHeight: '1.5',
        color: '#AAAAAA',
    }
};

export default ServerStatus;