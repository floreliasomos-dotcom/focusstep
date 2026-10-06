import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

// Ícono de la app: la mascota blob de FocusStep sobre fondo terracota.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#BD5227' }}>
        <div style={{ width: 320, height: 300, borderRadius: '48% 52% 46% 54% / 55% 48% 52% 45%', background: '#F4C9B4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 64 }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: '#3A1D10' }} />
          <div style={{ width: 32, height: 32, borderRadius: 16, background: '#3A1D10' }} />
        </div>
      </div>
    ),
    size,
  );
}
