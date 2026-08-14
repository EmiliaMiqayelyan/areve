'use client';

type StoreImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
  onError?: () => void;
};

/**
 * Native img — never goes through /_next/image.
 * Product/gallery files live on Express /uploads and 404 via the Next optimizer.
 */
export default function StoreImage({
  src,
  alt,
  className,
  style,
  fill = false,
  priority = false,
  objectFit = 'cover',
  onError,
}: StoreImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={onError}
      style={
        fill
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit,
              ...style,
            }
          : { objectFit, ...style }
      }
    />
  );
}
