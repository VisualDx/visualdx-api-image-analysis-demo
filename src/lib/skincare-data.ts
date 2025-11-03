import { lesionsData } from "./lesions-data";
import { therapiesData } from "./therapies-data";
import { productsData } from "./products-data";
import type { SkincareDataset, LesionData, TherapyData } from "@/types/skincare-data.types";

/**
 * Centralized dataset combining lesions, therapies, and products.
 * Used to power lookups, recommendations, and condition mappings.
 */
export const skincareData: SkincareDataset = {
  lesions: lesionsData.map((item: any): LesionData => ({
    findingId: item.findingid,
    lesionName: item.lesionName,
    inHeirarchyJson: item.inHeirarchyJson,
    lesionMessage: item.lesionMessage,
    therapyNames: item.therapynames,
    therapyMessage: item.therapyMessage,
    therapyIds: item.therapyIds,
  })),
  therapies: therapiesData.map((item: any): TherapyData => ({
    therapyId: item.therapyid,
    therapyName: item.therapy,
    therapyMessage: item.therapyMessage,
    productIds: item.productIds,
  })),
  products: productsData,
};

export default skincareData;
