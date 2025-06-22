import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { TrainingForm } from "./create-training-form";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Training } from "@/types";

interface EditTrainingProps {
    training: Training;
}

export function EditTraining({ training }: EditTrainingProps) {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <Edit className="" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Training</DialogTitle>
                    <DialogDescription>
                        Update the training details below.
                    </DialogDescription>
                </DialogHeader>
                <TrainingForm training={training} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
} 