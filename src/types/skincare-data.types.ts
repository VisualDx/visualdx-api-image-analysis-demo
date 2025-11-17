/** Lesion dataset structure */
export interface LesionData {
  findingId: number | string;
  lesionName: string;
  inHeirarchyJson: string; // "yes"/"no"
  lesionMessage?: string | null;
  therapyNames?: string | null;
  therapyMessage?: string | null;
  therapyIds?: string | null;
}

/** Therapy dataset structure */
export interface TherapyData {
  therapyId: number | string;
  therapyName: string;
  therapyMessage?: string | null;
  productIds?: string | null; // comma-separated IDs
}

/** Product dataset structure */
export interface ProductData {
  productId: number | string;
  productName: string;
  productDescription?: string | null;
  brandName?: string | null;
  imageUrl?: string | null;
  productUrl?: string | null;
}

/** Product info for recommendations (matches actual data structure) */
export interface ProductInfo {
  productId: number;
  productName: string;
  description: string;
  purchaseLink: string;
  imageFileName?: string;
}

/** Lesion info with resolved products */
export interface LesionInfo {
  name: string;
  lesionMessage: string;
  therapyMessage: string;
  therapyIds: string[];
  products: ProductInfo[];
}

/** Combined dataset structure (for convenience) */
export interface SkincareDataset {
  lesions: LesionData[];
  therapies: TherapyData[];
  products: ProductData[];
}
