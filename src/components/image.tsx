// components/image.tsx
import React from 'react'

const Image = ({ src, alt }: { src: string; alt?: string }) => {
  const proxied = `/api/image-proxy?src=${encodeURIComponent(src)}`
  return <img src={proxied} alt={alt ?? 'Image'} style={{ maxWidth: '100%' }} />
}

export default Image
