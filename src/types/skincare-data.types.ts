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

/** Combined dataset structure (for convenience) */
export interface SkincareDataset {
  lesions: LesionData[];
  therapies: TherapyData[];
  products: ProductData[];
}
