<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Training;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TrainingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        public function index()
        {
            $trainings = Training::withCount('registrations')->get();
            return Inertia::render('trainings.index', [
                'trainings' => $trainings,
            ]);
        }

    /**
     * Display the current user's registered trainings.
     */
    public function userIndex()
    {
        $user = auth()->user();
        $registrations = $user->registrations()
            ->with(['training' => function($query) {
                $query->withCount('registrations');
            }])
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->get();

        return Inertia::render('trainings/my-trainings', [
            'registrations' => $registrations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $training = Training::find($id);
        return Inertia::render('trainings.admin.edit', [
            'training' => $training,
        ]);
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
