import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelCard } from "@/components/models";
import { useModels } from "@/hooks/use-models";

export function Models() {
  const { models } = useModels();

  return (
    <ScrollArea className="max-h-[90vh] w-full rounded-md border-t-2">
      <div className="grid auto-rows-min sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 p-3">
        {models.map((model) => (
          <ModelCard model={model} />
        ))}
      </div>
    </ScrollArea>
  );
}
