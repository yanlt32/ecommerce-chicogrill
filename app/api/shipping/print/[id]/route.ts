import { NextRequest, NextResponse } from "next/server";
import { getPrintUrl } from "@/lib/melhorenvio";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = await getPrintUrl(id);
    if (!url) return NextResponse.json({ error: "URL não disponível" }, { status: 404 });
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao buscar etiqueta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
