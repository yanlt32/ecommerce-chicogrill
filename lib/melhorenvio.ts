const BASE_URL =
  process.env.MELHOR_ENVIO_SANDBOX === "false"
    ? "https://melhorenvio.com.br"
    : "https://sandbox.melhorenvio.com.br";

const TOKEN = process.env.MELHOR_ENVIO_TOKEN;
const USER_AGENT = `ChicoGrill ${process.env.STORE_EMAIL ?? "contato@chicogrill.com.br"}`;

const FROM = {
  name: process.env.STORE_NAME ?? "Chico Grill",
  address: process.env.STORE_ADDRESS ?? "Rua dos Pinheiros",
  number: process.env.STORE_NUMBER ?? "850",
  district: process.env.STORE_DISTRICT ?? "Pinheiros",
  city: process.env.STORE_CITY ?? "São Paulo",
  state_abbr: process.env.STORE_STATE ?? "SP",
  postal_code: (process.env.STORE_CEP ?? "05422011").replace(/\D/g, ""),
  country_id: "BR",
  phone: (process.env.STORE_PHONE ?? "11999990000").replace(/\D/g, ""),
  email: process.env.STORE_EMAIL ?? "contato@chicogrill.com.br",
};

// Default dimensions for clothing packages
const DEFAULT_VOLUME = { height: 5, width: 25, length: 35, weight: 0.5 };

export type LabelRequest = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    cep: string;
  };
  serviceId: 1 | 2; // 1 = PAC, 2 = SEDEX
  insuranceValue: number;
  items: Array<{ name: string; quantity: number; price: number }>;
};

export type LabelResult = {
  trackingCode: string | null;
  labelUrl: string | null;
  meOrderId: string;
  mock: boolean;
};

async function me(path: string, method: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Melhor Envio ${res.status}: ${text}`);
  }

  return res.json();
}

// Returns a fake label result used when no token is configured (dev/demo)
function mockLabel(): LabelResult {
  const n = () => Math.floor(10000000 + Math.random() * 89999999);
  return {
    trackingCode: `BR${n()}BR`,
    labelUrl: null,
    meOrderId: `mock_${Date.now()}`,
    mock: true,
  };
}

export async function createShippingLabel(req: LabelRequest): Promise<LabelResult> {
  if (!TOKEN) return mockLabel();

  // 1. Add to cart
  const cart = await me("/api/v2/me/cart", "POST", {
    service: req.serviceId,
    agency: null,
    from: FROM,
    to: {
      name: req.customerName,
      address: req.address.street,
      number: req.address.number,
      district: req.address.district,
      city: req.address.city,
      state_abbr: req.address.state,
      postal_code: req.address.cep.replace(/\D/g, ""),
      country_id: "BR",
      phone: req.customerPhone.replace(/\D/g, ""),
      email: req.customerEmail,
    },
    volumes: [DEFAULT_VOLUME],
    options: {
      insurance_value: req.insuranceValue,
      receipt: false,
      own_hand: false,
      collect: false,
    },
    products: req.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unitary_value: i.price,
    })),
  });

  // 2. Checkout
  await me("/api/v2/me/checkout", "POST", { orders: [cart.id] });

  // 3. Generate label
  await me("/api/v2/me/orders/generate", "POST", { orders: [cart.id] });

  // 4. Fetch generated order details
  const order = await me(`/api/v2/me/orders/${cart.id}`, "GET");

  return {
    trackingCode: order.volumes?.[0]?.correios ?? order.tracking ?? null,
    labelUrl: order.print ?? null,
    meOrderId: cart.id,
    mock: false,
  };
}

export async function getPrintUrl(meOrderId: string): Promise<string | null> {
  if (!TOKEN || meOrderId.startsWith("mock_")) return null;
  try {
    const res = await me(
      `/api/v2/me/orders/${meOrderId}/print?mode=private`,
      "GET"
    );
    return typeof res === "string" ? res : res?.url ?? null;
  } catch {
    return null;
  }
}
