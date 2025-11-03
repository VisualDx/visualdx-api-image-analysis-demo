import { lesionsData } from './lesions-data';

interface LesionInfo {
  name: string;
  lesionMessage: string;
  therapyMessage: string;
}

// Build lookup maps from the lesions data for faster access
const lesionDatabaseByName: Record<string, LesionInfo> = {};
const lesionDatabaseById: Record<number, LesionInfo> = {};

lesionsData.forEach((lesion) => {
  if (lesion.lesionName && lesion.therapyMessage) {
    const lesionInfo: LesionInfo = {
      name: lesion.lesionName,
      lesionMessage: typeof lesion.lesionMessage === 'string' ? lesion.lesionMessage : '',
      therapyMessage: lesion.therapyMessage
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
  therapyMessage: "Just to be safe, get this checked out by a dermatologist."
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