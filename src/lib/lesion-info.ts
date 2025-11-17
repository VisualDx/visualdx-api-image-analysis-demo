import { lesionsData } from './lesions-data';
import { therapiesData } from './therapies-data';
import { productsData } from './products-data';
import type { ProductInfo, LesionInfo } from '@/types/skincare-data.types';

// Helper function to get products from therapy IDs
function getProductsFromTherapyIds(therapyIdsString: any): ProductInfo[] {
  if (!therapyIdsString || typeof therapyIdsString !== 'string') {
    return [];
  }

  const therapyIds = therapyIdsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  const productIds = new Set<number>();

  // Get all product IDs from the therapies
  therapyIds.forEach(therapyId => {
    const therapy = therapiesData.find(t => t.therapyid === therapyId);
    if (therapy && therapy.productIds) {
      const ids = therapy.productIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      ids.forEach(id => productIds.add(id));
    }
  });

  // Get product details
  const products: ProductInfo[] = [];
  productIds.forEach(productId => {
    const product = productsData.find(p => p.productId === productId);
    if (product) {
      products.push({
        productId: product.productId,
        productName: product.productName,
        description: product.description,
        purchaseLink: product.purchaseLink,
        imageFileName: (product as any).imageFileName || undefined
      });
    }
  });

  return products;
}

// Build lookup maps from the lesions data for faster access
const lesionDatabaseByName: Record<string, LesionInfo> = {};
const lesionDatabaseById: Record<number, LesionInfo> = {};

lesionsData.forEach((lesion) => {
  if (lesion.lesionName && lesion.therapyMessage) {
    const therapyIds = typeof lesion.therapyIds === 'string' ? lesion.therapyIds.split(',').map(id => id.trim()) : [];
    const products = getProductsFromTherapyIds(lesion.therapyIds);

    const lesionInfo: LesionInfo = {
      name: lesion.lesionName,
      lesionMessage: typeof lesion.lesionMessage === 'string' ? lesion.lesionMessage : '',
      therapyMessage: lesion.therapyMessage,
      therapyIds: therapyIds,
      products: products
    };
    
    // Index by name (normalized)
    const normalizedName = lesion.lesionName.toLowerCase().trim();
    lesionDatabaseByName[normalizedName] = lesionInfo;
    
    // Index by finding ID
    if (lesion.findingid) {
      lesionDatabaseById[lesion.findingid] = lesionInfo;
    }
  }
});

const defaultResponse: LesionInfo = {
  name: "I'm not sure what the condition of your skin is",
  lesionMessage: "I'm not sure what the condition of your skin is",
  therapyMessage: "Just to be safe, get this checked out by a dermatologist.",
  therapyIds: [],
  products: []
};

export function getLesionData(lesionName: string | undefined): LesionInfo {
  if (!lesionName) {
    return defaultResponse;
  }

  const normalizedName = lesionName.toLowerCase().trim();
  return lesionDatabaseByName[normalizedName] || defaultResponse;
}

export function getLesionDataById(findingId: number | undefined): LesionInfo {
  if (!findingId) {
    return defaultResponse;
  }

  return lesionDatabaseById[findingId] || defaultResponse;
}