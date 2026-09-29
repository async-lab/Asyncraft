import React from 'react'

type Props = {
    address: string
    style?: string
    icon?: boolean
    title?: string
    rounded?: boolean
}

export default function PixelStatus({
    address,
    style = 'minecraft',
    icon = false,
    title = '',
    rounded = false,
}: Props) {
    const src = `https://mcstatus.asyncraft.club/v2/widget/java/${address}?style=${style}&&icon=${icon}&&title=${title}&&rounded=${rounded}&&rounded=true`

    return (
        <img
            alt="pixel"
            src={src}
            style={{
                pointerEvents: 'none',
                WebkitUserSelect: 'none',
                imageRendering: "pixelated",
                userSelect: "none",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
            }}
        />
    )
}