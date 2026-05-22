import { NextRequest, NextResponse } from "next/server";
import { createShippingLabel, LabelRequest } from "@/lib/melhorenvio";

export async function POST(req: NextRequest) {
  try {
    const body: LabelRequest = await req.json();
    const result = await createShippingLabel(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao gerar etiqueta";
    console.error("[shipping/label]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
