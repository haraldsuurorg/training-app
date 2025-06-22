import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DateTimePicker } from "../ui/datetime-picker";
import { Training } from "@/types";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    date: z.date(),
    location: z.string().min(1, { message: "Location is required" }),
    max_participants: z.string().regex(/^[1-9]\d*$/, { message: "Max participants is a required field" }),
});

interface TrainingFormProps {
    training?: Training;
    onSuccess?: () => void;
}

export function TrainingForm({ training, onSuccess }: TrainingFormProps = {}) {
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!training;
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: training?.title || "",
            description: training?.description || "",
            date: training?.date ? new Date(training.date) : new Date(),
            location: training?.location || "",
            max_participants: training?.max_participants?.toString() || "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const formData = {
            ...values,
            max_participants: parseInt(values.max_participants),
        }

        const endpoint = isEditing 
            ? route('trainings.update', training.id) 
            : route('trainings.store');
        const method = isEditing ? 'put' : 'post';

        router[method](endpoint, formData, {
            onSuccess: () => {
                if (!isEditing) form.reset();
                setIsLoading(false);
                onSuccess?.();
                toast.success(`Training ${isEditing ? 'updated' : 'created'} successfully`);
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    form.setError(key as any, {
                        message: errors[key]
                    });
                });
                setIsLoading(false);
            }
        })
    }

    function handleDelete() {
        router.delete(route('trainings.destroy', training?.id), {
            onSuccess: () => {
                onSuccess?.();
                toast.success('Training deleted successfully');
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="hidden">Date</FormLabel>
                            <FormControl>
                                <DateTimePicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="max_participants"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Participants</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isEditing ? 'Update Training' : 'Create Training'}
                    {isLoading ? 
                    <Loader2 className="w-4 h-4 animate-spin" /> : ''}
                </Button>
                {isEditing ? 
                <Button type="button" variant="destructive" className="ml-2" onClick={handleDelete}>
                    Delete Training
                </Button> : null}
            </form>
        </Form>
    )
}