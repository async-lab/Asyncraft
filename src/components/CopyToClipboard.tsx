// src/components/CopyToClipboard.tsx

import React, { useState, type FC } from 'react';
import styles from './CopyToClipboard.module.css'

// 一个简单的复制图标
const CopyIcon: FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

// 一个简单的勾选图标
const CheckIcon: FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


interface CopyToClipboardProps {
    title: string;
    show: string
    content: string;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({ title: title, show: showText, content: contentToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(contentToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('无法复制文本: ', err);
        });
    };

    return (
        <code
            onClick={handleCopy}
            className={styles.copyContainer}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
            }}
            // onMouseOver={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            // onMouseOut={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            title={title ? title : "点击复制"}
        >
            {showText ? showText : contentToCopy}
            <span style={{ marginLeft: '8px', color: copied ? 'green' : '#555', display: 'flex' }}>
                {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
        </code>
    );
};

export default CopyToClipboard;