import React, { useState, useEffect, type FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as mcs from 'node-mcstatus';
import * as cheerio from 'cheerio';

// 定义组件接收的 props 类型
interface ServerStatusProps {
    address: string;
    bedrock?: boolean;
}

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

const ErrorDisplay: FC<{ message: string }> = ({ message }) => (
    <div style={styles.errorContainer} dangerouslySetInnerHTML={{ __html: message }}></div>
);

const StatusDisplay: FC<{ data: mcs.JavaStatusResponse }> = ({ data }) => (
    <div style={styles.statusIndicator}>
        <span>{data.version?.protocol == -1 ? `${data.version?.name_raw}` : `${data.players?.online} / ${data.players?.max}`}</span>
        <span style={{ ...styles.statusDot, backgroundColor: `${data.version?.protocol == -1 ? '#FF5555' : '#55FF55'}` }} />
    </div>
)

// MOTD 渲染组件
const MotdDisplay: FC<{ data: mcs.JavaStatusResponse; }> = ({ data }) => {
    if (!data?.online) {
        return (
            <ErrorDisplay message={`服务器当前不在线或无法访问。`} />
        );
    }

    const motdHtml = data.motd?.html || ''
    const $ = cheerio.load(motdHtml);
    const outermostSpan = $('body>span').first();
    const firstSpan = outermostSpan.children('span').first();
    firstSpan.after(renderToStaticMarkup(<StatusDisplay data={data} />) + "<br/>")

    let innerHTML = $('body>span').html()
    if (!innerHTML) {
        return <ErrorDisplay message="无法解析 MOTD 内容。" />;
    }

    return (
        <div style={styles.motdContent}>
            <div
                style={styles.motdText}
                dangerouslySetInnerHTML={{ __html: $('body>span').html()!! }}
            />
        </div>
    );
};


// ---- 主组件 ----
const ServerStatus: FC<ServerStatusProps> = ({ address, bedrock = false }) => {
    const [serverData, setServerData] = useState<mcs.JavaStatusResponse | null>(null);
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

        let host = address.split(':')[0];
        let port = Number(address.split(':')[1] || '25565');

        mcs.statusJava(host, port, { query: true })
            .then((result) => {
                if (isMounted) setServerData(result);
            })
            .catch((err: Error) => {
                console.error("获取服务器状态失败:", err);
                if (isMounted) setError(err.message);
            }).finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; }; // 清理函数
    }, [address, bedrock]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;

    return <MotdDisplay data={serverData!!} />;
}

// ---- 样式对象 ----
const containerColor = 'var(--ifm-code-background)';
const borderColor = 'var(--ifm-table-border-color)';

const styles: Record<string, React.CSSProperties> = {
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: containerColor,
        color: 'var(--ifm-font-color-base)'
    },
    errorContainer: {
        padding: '10px',
        borderLeft: '4px solid #f44336',
        backgroundColor: '#ffdddd',
        color: '#333',
    },
    motdContainer: {
        padding: '20px',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: containerColor,
        backdropFilter: 'blur(5px)',
        color: 'var(--ifm-font-color-base)'
    },
    motdContent: {
        display: 'flex',
    },
    statusIndicator: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        margin: '0 0 0 20px',
        float: 'right',
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
        fontFamily: 'var(--mc-font-family), "Fira Code", monospace',
        lineHeight: '1.5',
        color: '#AAAAAA',
        width: '35em'
    }
};

export default ServerStatus;