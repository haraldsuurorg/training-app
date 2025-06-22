import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { TrainingForm } from "./create-training-form";
import { X } from "lucide-react";

export function CreateTraining() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-fit">Create a Training</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Training</DialogTitle>
                    <DialogDescription>
                        Form for adding a new training to the system. Please fill in all the fields below.
                    </DialogDescription>
                </DialogHeader>
                <TrainingForm />
            </DialogContent>
        </Dialog>
    );
}