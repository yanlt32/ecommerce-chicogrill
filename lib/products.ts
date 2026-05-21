export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  badge?: string;
  sizes?: string[];
  material?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Camiseta Artisan Black",
    price: 89.9,
    description:
      "Camiseta 100% algodão premium com estampa em silk screen de alta durabilidade. Conforto e o estilo da churrascaria mais insana de SP.",
    category: "Camisetas",
    material: "100% Algodão Heavyweight",
    sizes: ["P", "M", "G", "GG"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxzH7mnPWhojskUhRpjg0GUBqhQTZOvqK1bzFOyQj9-v95fHqLLeVZodtngSqW4SBo6xDzvqpR5bNKa3A-0VXu-xayLK_BoyhBAyRkuzw8PtRTPjg1znF7fLNLEiCTldOQ7IcdqrRfm4WG1yLrf1Dvfwtw_dh9TDwJcD1TmvXM9s65sqMH8vXU59bEXxyApwPVRAGrB9PQmkIWE7GPNRFtfZVRjA8nbLzoNif1j9UidwuFxDHSfXGFhIuvQDF10fylWEPclgMa4ws",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxzH7mnPWhojskUhRpjg0GUBqhQTZOvqK1bzFOyQj9-v95fHqLLeVZodtngSqW4SBo6xDzvqpR5bNKa3A-0VXu-xayLK_BoyhBAyRkuzw8PtRTPjg1znF7fLNLEiCTldOQ7IcdqrRfm4WG1yLrf1Dvfwtw_dh9TDwJcD1TmvXM9s65sqMH8vXU59bEXxyApwPVRAGrB9PQmkIWE7GPNRFtfZVRjA8nbLzoNif1j9UidwuFxDHSfXGFhIuvQDF10fylWEPclgMa4ws",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByLCI82ctYO7oYsgKdAA9iHmgy8nKjJBzDQss5_GHI-hxcuVat8nl9ev5BkcaoZ9QJXbfyLRMfcj9_AiOuBSc5YKbpllGb1bcu6WnUaGlnSBR4se_LqSvYaUfMyvxhKImLsF7qBxl6MnA-q_4SIb4AwlI46ku6lBUn2skQozE6TN56Q6u8VSsNYULy-kS-2ACbQyrXMIgrz2KUWLe8fDud2_ykPM35D3Y8zdftZVbom5mdfVrQuxvuKj5r6EDH51ywSoejuF9BOf0",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARoXyPDZDW3o8JXALK82X3UGgOsFBYSXVz9wm8Dp5BNsZnr7jr5TLsluvbQ1T_MZvfnNPpHouL3QMQzzEpffkfY9uqHaezl9F7HQrCYOerqgbvfgKcrWCoA_nU8ayljtPyJ_Vmg7FnwvtYT6ZDAMKex48m_QIHttVU8F8ORiDMAJSAREzA6KW8T3oQfZQrp9SEgPSrRraXlRCx6kZtCfWebN5iZ0RbvD7M57NhtSMTvZ8vJu2htSNO-oUTrHy5oU5wSiJRoNnyZqU",
    ],
  },
  {
    id: 2,
    name: "Hoodie Flame Grey",
    price: 189.9,
    description:
      "Moletom premium com capuz, estampa em silk screen exclusiva. Qualidade artesanal que aquece tanto quanto a brasa.",
    category: "Moletons",
    material: "80% Algodão, 20% Poliéster",
    sizes: ["P", "M", "G", "GG"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCsB8mpBiDXHwUOpmDGTDTCDGlXWZV9k_8VqKpJOKeWjB6lmPdmr_hAnxtxbH8Nj_VyD0rYdbsjm5GnDk5DPj1QlNftyTQGoKrmeOXY2o_F4106lpStw311nzQ51ALkFXu0-BHFRohNgJswzySURBoLE_iREA57gjpLkXVstVl1NzMHsVXPsw8MnK2E60rEO24HAK6_-0hoL6y6e8QSQYlGwL1RSv8HmH7fe59-9ZxIUZOyne8ewtslNuPU8HXxzH_x57ONAsBOQ",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCsB8mpBiDXHwUOpmDGTDTCDGlXWZV9k_8VqKpJOKeWjB6lmPdmr_hAnxtxbH8Nj_VyD0rYdbsjm5GnDk5DPj1QlNftyTQGoKrmeOXY2o_F4106lpStw311nzQ51ALkFXu0-BHFRohNgJswzySURBoLE_iREA57gjpLkXVstVl1NzMHsVXPsw8MnK2E60rEO24HAK6_-0hoL6y6e8QSQYlGwL1RSv8HmH7fe59-9ZxIUZOyne8ewtslNuPU8HXxzH_x57ONAsBOQ",
    ],
  },
  {
    id: 3,
    name: "Avental de Couro Raw",
    price: 249.0,
    description:
      "Proteção máxima com estilo. Couro genuíno de alta espessura com fivelas metálicas resistentes.",
    category: "Acessórios",
    badge: "NOVO",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDonmPgV8aY2IHyuhTtTmOaHm2KiF9W-Jv_zCuWOO2tWTjpZqv7K76iJnpyiSyhqr9CQHZbRD0IejI_K-ccG1KsNMPRTAVW6dBDLnV-H9ZlVN4H5uMnbCQvlYutZXs544N4rR7HvWr0D6xacyDJ3NeIg1Ge0vlsXGpRCu2Qac3JmDiI9QfePac965CFvdkeHSSpksW27dideTEyGn_Q2Yb3SqYA08qGW78X_jVr7Y1njVtpeyaruJzYJiSpOFcTcBnGArkG1f6a9n0",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDonmPgV8aY2IHyuhTtTmOaHm2KiF9W-Jv_zCuWOO2tWTjpZqv7K76iJnpyiSyhqr9CQHZbRD0IejI_K-ccG1KsNMPRTAVW6dBDLnV-H9ZlVN4H5uMnbCQvlYutZXs544N4rR7HvWr0D6xacyDJ3NeIg1Ge0vlsXGpRCu2Qac3JmDiI9QfePac965CFvdkeHSSpksW27dideTEyGn_Q2Yb3SqYA08qGW78X_jVr7Y1njVtpeyaruJzYJiSpOFcTcBnGArkG1f6a9n0",
    ],
  },
  {
    id: 4,
    name: "Boné Black Flame",
    price: 119.0,
    description:
      "Snapback aba curva com bordado exclusivo do Chico Grill. Ajuste traseiro para o encaixe perfeito.",
    category: "Acessórios",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2mRFbVSnyLSbeWplkTT2bcaiEN2TBJrmEPJT-ZGN4_HA-7rqnghVB-1GvgGYKXo4Qi5FOdFtK0eqsMjsekcb3uHsYUoTlhEwWqbFBHOUnUX2-AU1CgIsx_bbemNuJm33h1xjeVPAJ_hDwgfpJxGbYQlIiDqH3XpBtkBIDH4MQxOEFRAzuKxYsyXSlYS64CWOM-VeNTAPBEFeMPEKSuM0-o8zv-uutu85SkmipanZcDiCXSMNld4EU4GKZqZvEK2e3NFM4FjbHeyw",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2mRFbVSnyLSbeWplkTT2bcaiEN2TBJrmEPJT-ZGN4_HA-7rqnghVB-1GvgGYKXo4Qi5FOdFtK0eqsMjsekcb3uHsYUoTlhEwWqbFBHOUnUX2-AU1CgIsx_bbemNuJm33h1xjeVPAJ_hDwgfpJxGbYQlIiDqH3XpBtkBIDH4MQxOEFRAzuKxYsyXSlYS64CWOM-VeNTAPBEFeMPEKSuM0-o8zv-uutu85SkmipanZcDiCXSMNld4EU4GKZqZvEK2e3NFM4FjbHeyw",
    ],
  },
  {
    id: 5,
    name: "Faca Butcher Master",
    price: 450.0,
    description:
      "Aço damasco forjado à mão com cabo ergonômico. Para quem leva o corte a sério.",
    category: "Acessórios",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALKNCCB3sDVDlkE7oWRGfVJ2GpBIg3_zYlrmQG7N5Tu7gMpKzOinUUY94R4aPB-qPfK3i8RiA-OzSBhJIORCRBMgNJ5QbBsC1sq7kSceE3kI7P2L4shfHDbGgbD8h8bxQjsL3YT3Hq_h-pI4mz6y1pUZIWaVU9Tf-KSuWmN7Gs4UYYt48zABK8zG7AUWQ7W-ncIw2rGHmh_TDHvzriocB0VWqt2X_y_d69jskeaQsDXA0sQ25_px8s_XCeWNO_tyKog77pS0OtdFs",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALKNCCB3sDVDlkE7oWRGfVJ2GpBIg3_zYlrmQG7N5Tu7gMpKzOinUUY94R4aPB-qPfK3i8RiA-OzSBhJIORCRBMgNJ5QbBsC1sq7kSceE3kI7P2L4shfHDbGgbD8h8bxQjsL3YT3Hq_h-pI4mz6y1pUZIWaVU9Tf-KSuWmN7Gs4UYYt48zABK8zG7AUWQ7W-ncIw2rGHmh_TDHvzriocB0VWqt2X_y_d69jskeaQsDXA0sQ25_px8s_XCeWNO_tyKog77pS0OtdFs",
    ],
  },
  {
    id: 6,
    name: "Camiseta White Smoke",
    price: 89.0,
    description:
      "100% Algodão Mescla. Estampa exclusiva Chico Grill em serigrafia de alta durabilidade.",
    category: "Camisetas",
    material: "100% Algodão Mescla",
    sizes: ["P", "M", "G", "GG"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgstYKpKhVzNys4SgmCEiZrRXyX09ve86KSONhSLWf2G_3QW0KbppaEUvBDK6gmUo0AqZ_ngJvKel6uvHozbWnZw1j1NZAsXbCpsAWC7LaRgETZ3UrbKz0jS-Imcn8uYw5LtrMO1gOMxp2uaIR3wBsd_SNIFQlMD9JWW2bwtAG4ynhqYCwjjsHCHESRirKYNe3H0qYm8aWz3jdYbGI246lwXnRBEaT3PT58_dCHesCX5bPrI1Pukrt7lOL6hkjVYcqPUsRFqMulCk",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgstYKpKhVzNys4SgmCEiZrRXyX09ve86KSONhSLWf2G_3QW0KbppaEUvBDK6gmUo0AqZ_ngJvKel6uvHozbWnZw1j1NZAsXbCpsAWC7LaRgETZ3UrbKz0jS-Imcn8uYw5LtrMO1gOMxp2uaIR3wBsd_SNIFQlMD9JWW2bwtAG4ynhqYCwjjsHCHESRirKYNe3H0qYm8aWz3jdYbGI246lwXnRBEaT3PT58_dCHesCX5bPrI1Pukrt7lOL6hkjVYcqPUsRFqMulCk",
    ],
  },
];

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
