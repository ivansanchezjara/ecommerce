import Link from "next/link";
import { Heading, Text, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 gap-2">
      <p className="text-8xl font-black text-slate-100 select-none">404</p>
      <Heading level={2}>Página no encontrada</Heading>
      <Text variant="bodySm" className="max-w-sm">
        La página que buscas no existe o fue movida.
      </Text>
      <Button as={Link} href="/" variant="primary" size="lg" className="mt-4 rounded-full">
        Volver al inicio
      </Button>
    </div>
  );
}
