import { getModels as ApiGetModels } from "@/api";
import { Notifications } from "@/lib/notifications";
import { Model } from "@intelix/common";
import { useEffect, useState } from "react";

interface UseModels {
  models: Model[];
  getModels: () => Promise<Model[] | void>;
  setModels: (models: Model[]) => void;
}

export const useModels = (): UseModels => {
  const [models, setModels] = useState<Model[]>([]);

  const getModels = async () => {
    const result = await ApiGetModels();
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setModels(result.data);
    return result.data;
  };

  useEffect(() => {
    getModels();
  }, []);

  return { models, getModels, setModels };
};
