import { AppShell } from '@/components/app/AppShell';
import { ProximamenteScreen } from '@/components/app/ProximamenteScreen';

export default function Habitos() {
  return (
    <AppShell>
      <ProximamenteScreen
        titulo="Tus hábitos"
        mensaje="Aquí vas a poder agregar y ordenar tus hasta 3 hábitos — todavía la estamos construyendo."
      />
    </AppShell>
  );
}
