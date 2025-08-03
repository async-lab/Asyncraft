import React, { useState, useEffect, type FC, type ReactNode } from 'react';

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
    // 根据需要添加更多字段...
    debug: {
        cachetime: number;
        cacheexpire: number;
        apiversion: number;
        [key: string]: any; // 其他 debug 字段
    };
}

// 定义组件接收的 props 类型
interface ServerStatusProps {
    address: string;
    bedrock?: boolean;
}

// 加载动画组件 (TSX)
const LoadingSpinner: FC = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: '1px solid rgba(192, 192, 192, 0.75)',
        borderRadius: '8px',
        backgroundColor: 'rgba(249, 249, 249, 0.75)',
        color: '#333',
    }}>
        <div className="spinner" />
        <span style={{ marginLeft: '10px' }}>正在获取服务器状态...</span>
        {/* 样式可以移到 CSS 文件中，这里为了简单内联 */}
        <style>{`
      .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border-left-color: #09f;
        animation: spin 1s ease infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    </div>
);

// MOTD 渲染组件 (TSX)
interface MotdProps {
    data: McSrvStatusResponse | null;
    serverAddress: string;
}

const Motd: FC<MotdProps> = ({ data, serverAddress }) => {
    if (!data?.online) {
        return (
            <div style={{ padding: '10px', backgroundColor: '#ffdddd', borderLeft: '4px solid #f44336', color: '#333' }}>
                服务器 <strong>{serverAddress}</strong> 当前不在线或无法访问。
            </div>
        );
    }

    const motdHtml = data.motd?.html?.join('<br />');

    return (
        <div style={{
            padding: '20px',
            border: '2px solid rgba(138, 138, 138, 0.5)',
            borderRadius: '8px',
            backgroundColor: 'rgba(60, 60, 60, 0.5)',
            color: '#fff',
            fontFamily: '"Minecraftia", "Fira Code", monospace', // 使用更合适的字体
            lineHeight: '1.5',
            backdropFilter: 'blur(5px)',
        }}>
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                {data.icon && <img src={data.icon} alt="Server Icon" style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} />}
                <div>
                    <strong style={{ fontSize: '1.2em', padding: "4px 8px" }}>{data.hostname || serverAddress}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: data.online ? '#55FF55' : '#FF5555' }}></span>
                        <span style={{ fontWeight: 'bold' }}> {data.online ? `在线` : '离线'} </span>
                    </div>
                </div>
            </div>
            <hr style={{ borderColor: '#555', borderStyle: 'dashed' }} /> */}
            {
                motdHtml && (
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '0 10px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: data.online ? '#55FF55' : '#FF5555' }}></span>
                            <span style={{ fontWeight: 'bold' }}> {data.online ? `在线(${data.players?.online}/${data.players?.max})` : '离线'} </span>
                        </div>
                        <div style={{ padding: '10px 15px', margin: '0 10px', borderRadius: '8px', flexGrow: '1', wordBreak: 'break-word', backgroundColor: 'rgba(26, 26, 26, 0.5)' }} dangerouslySetInnerHTML={{ __html: motdHtml }} />
                    </div>
                )
            }
        </div>
    );
};


// 主组件 (TSX)
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

        // 重置状态以进行新的请求
        setLoading(true);
        setError(null);
        setServerData(null);

        const apiType = bedrock ? 'bedrock/' : '';
        const apiUrl = `https://api.mcsrvstat.us/3/${apiType}${address}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`网络请求失败 (状态: ${response.status})`);
                }
                return response.json() as Promise<McSrvStatusResponse>;
            })
            .then(data => {
                setServerData(data);
            })
            .catch((err: Error) => {
                console.error("获取服务器状态失败:", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [address, bedrock]); // 依赖项数组保持不变

    if (loading) return <LoadingSpinner />;
    if (error) return <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>{error}</div>;

    return <Motd data={serverData} serverAddress={address} />;
}

export default ServerStatus;