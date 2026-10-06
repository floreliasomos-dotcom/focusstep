import { ImageResponse } from 'next/og';

export const alt = 'FocusStep — Un solo paso a la vez, sin culpa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Tarjeta que se ve al compartir el enlace en redes y chats.
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: 80, background: '#FBF1E8', color: '#3A1D10' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#BD5227' }}>FocusStep</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>Un solo paso a la vez, sin culpa</div>
          <div style={{ fontSize: 32, marginTop: 32, color: '#6B5547' }}>Hábitos con % semanal, no rachas que castigan.</div>
        </div>
        <div style={{ width: 280, height: 260, borderRadius: '48% 52% 46% 54% / 55% 48% 52% 45%', background: '#E3A58C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: '#3A1D10' }} />
          <div style={{ width: 28, height: 28, borderRadius: 14, background: '#3A1D10' }} />
        </div>
      </div>
    ),
    size,
  );
}
