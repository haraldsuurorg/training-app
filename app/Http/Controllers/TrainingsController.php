<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Training;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TrainingsController extends Controller
{
    /**
     * Display all the trainings.
     */
    public function index()
    {
        $trainings = Training::withCount('registrations')
            ->orderBy('date', 'asc')
            ->get();
        $futureTrainings = Training::withCount('registrations')
            ->where('date', '>=', now())
            ->orderBy('date', 'asc')
            ->get();

        return Inertia::render('dashboard', [
            'trainings' => $trainings,
            'futureTrainings' => $futureTrainings,
        ]);
    }

    /**
     * Display the current user's (not admin) registered trainings.
     */
    public function userIndex()
    {
        $user = auth()->user();
        
        $registrations = $user->registrations()
            ->with(['training' => function($query) {
                $query->withCount('registrations');
            }])
            ->where('status', '!=', 'cancelled')
            ->join('trainings', 'registrations.training_id', '=', 'trainings.id')
            ->select('registrations.*')
            ->orderBy('trainings.date', 'asc')
            ->get();
    
        $futureRegistrations = $user->registrations()
            ->with(['training' => function($query) {
                $query->withCount('registrations');
            }])
            ->where('registrations.status', '!=', 'cancelled')
            ->join('trainings', 'registrations.training_id', '=', 'trainings.id')
            ->where('trainings.date', '>=', now())
            ->select('registrations.*')
            ->orderBy('trainings.date', 'asc')
            ->get();

        return Inertia::render('trainings/my-trainings', [
            'registrations' => $registrations,
            'futureRegistrations' => $futureRegistrations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
        ]);

        try {
            Training::create($request->all());
            return redirect()->route('dashboard')->with('success', 'Training created successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to create training: ' . $e->getMessage());
            return redirect()->route('dashboard')->with('error', 'Failed to create training');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
        ]);

        try {
            $training = Training::find($id);
            $training->update($request->all());
            return redirect()->route('dashboard')->with('success', 'Training updated successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to update training: ' . $e->getMessage());
            return redirect()->route('dashboard')->with('error', 'Failed to update training');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $training = Training::find($id);
            $training->delete();
            return redirect()->route('dashboard')->with('success', 'Training deleted successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to delete training: ' . $e->getMessage());
            return redirect()->route('dashboard')->with('error', 'Failed to delete training');
        }
    }
}
