import { Button } from "../ui/button"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { format } from "date-fns"
import { EditTraining } from "./edit-training"
import { RegisterTraining } from "./register-training"

export function TrainingsList({ trainings, isAdmin }: { trainings: any, isAdmin: boolean }) {
    return (
        <div className="flex flex-col gap-4">
            {trainings.map((training: any) => (
                <div key={training.id} className="rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-8 flex gap-8">
                    <div className="flex-4 flex flex-col gap-2">
                        <h2 className="text-lg font-bold">{training.title}</h2>
                        <p className=" text-muted-foreground">{training.description}</p>
                    </div>
                    <div className="flex-2 flex flex-col gap-2">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                            <CalendarIcon size={18} />
                            <p className=" text-muted-foreground">{format(new Date(training.date), 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                        {/* Location */}
                        <div className="flex items-center gap-2">
                            <MapPinIcon size={18} />
                            <p className=" text-muted-foreground">{training.location}</p>
                        </div>
                        {/* Max participants */}
                        <div className="flex items-center gap-2">
                            <UsersIcon size={18} />
                            <p className=" text-muted-foreground">
                                {training.registrations_count || 0}/{training.max_participants}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1">
                        {isAdmin ? (
                            <EditTraining training={training} />
                        ) : (
                            <RegisterTraining training={training} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}