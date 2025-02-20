import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button, IconButton } from "@/components/ui/button";
import { useModalsStore } from "@/context/use-modals-store";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { EModals } from "@/shared/enums";
import { Model } from "@intelix/common";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const { setActiveModal } = useModalsStore();

  const openModalAddAgent = () => {
    setActiveModal({ activeModal: EModals.MODAL_ADD_AGENT, modalProps: { form: model.form ?? [] } });
  };

  return (
    <Card className="py-6 flex flex-col gap-6">
      <CardContent className="flex flex-col gap-2 items-start justify-between">
        <div className="flex items-center gap-2 w-full">
          <CardTitle className="text-lg">{model.name}</CardTitle>
          <div className="w-6 h-6">
            <img src={`${model.logo}`} alt="" />
          </div>
          <IconButton className="h-7 w-7 ml-auto" onClick={() => window.open(model.docs)}>
            <ExternalLink />
          </IconButton>
        </div>

        <CardDescription>{model.description}</CardDescription>
        <div className="flex gap-2 flex-wrap mt-2">
          {model.features.map((badge) => (
            <Badge className="bg-slate-200 text-slate-600 inline-block hover:bg-slate-300">{badge}</Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button disabled={!model.form?.length} onClick={openModalAddAgent} className="w-full">
          {model.form?.length ? "Add AI Agent" : "Coming soon ..."}
        </Button>
      </CardFooter>
    </Card>
  );
}
