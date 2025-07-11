<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Training;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Enums\UserRole;

class RegistrationsController extends Controller
{
    /**
     * Display all registrations for admin management
     */
    public function index()
    {
        $registrations = Registration::with(['user', 'training'])
            ->join('trainings', 'registrations.training_id', '=', 'trainings.id')
            ->select('registrations.*')
            ->where('trainings.date', '>=', now())
            ->orderBy('trainings.date', 'asc')
            ->get();

        return Inertia::render('trainings/manage-registrations', [
            'registrations' => $registrations,
        ]);
    }

    /**
     * Store a new registration
     */
    public function store(Request $request)
    {
        Log::info('Registration store method called', [
            'user_id' => auth()->id(),
            'request_data' => $request->all()
        ]);

        try {
            $request->validate([
                'training_id' => 'required|exists:trainings,id',
            ]);

            $user = auth()->user();
            $trainingId = $request->training_id;

            // Check if user is already registered for this training
            $existingRegistration = Registration::where('user_id', $user->id)
                ->where('training_id', $trainingId)
                ->where('status', '!=', 'cancelled')
                ->first();

            if ($existingRegistration) {                
                return redirect()->back()->withErrors([
                    'training_id' => 'You are already registered for this training.',
                ]);
            }

            // Check if training is full
            $training = Training::findOrFail($trainingId);
            $activeRegistrationsCount = Registration::where('training_id', $trainingId)
                ->where('status', '!=', 'cancelled')
                ->count();

            if ($activeRegistrationsCount >= $training->max_participants) {                
                return redirect()->back()->withErrors([
                    'training_id' => 'This training is full. No more spots available.',
                ]);
            }

            // Check if training date is in the future
            if ($training->date <= now()) {                
                return redirect()->back()->withErrors([
                    'training_id' => 'Cannot register for past trainings.',
                ]);
            }

            // Create the registration
            $registration = Registration::create([
                'user_id' => $user->id,
                'training_id' => $trainingId,
                'status' => 'confirmed',
                'registered_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Successfully registered for the training!');

        } catch (\Exception $e) {
            Log::error('Registration failed with exception', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'request_data' => $request->all()
            ]);
            
            return redirect()->back()->withErrors([
                'general' => 'Registration failed. Please try again.',
            ]);
        }
    }

    /**
     * Cancel a registration
     */
    public function destroy($id)
    {
        try {
            $registration = Registration::findOrFail($id);
            
            // Check if the registration belongs to the current user OR if user is admin
            if ($registration->user_id !== auth()->id() && auth()->user()->role !== UserRole::ADMIN) {
                return redirect()->back()->withErrors([
                    'general' => 'You can only cancel your own registrations.',
                ]);
            }

            // Check if the training hasn't started yet
            if ($registration->training->date <= now()) {
                return redirect()->back()->withErrors([
                    'general' => 'Cannot cancel registration for trainings that have already started.',
                ]);
            }

            // Update status to cancelled instead of deleting
            // $registration->update(['status' => 'cancelled']);

            // Delete the registration completely
            $registration->delete();
            return redirect()->back()->with('success', 'Registration cancelled successfully!');

        } catch (\Exception $e) {
            Log::error('Failed to cancel registration', [
                'error' => $e->getMessage(),
                'registration_id' => $id,
                'user_id' => auth()->id()
            ]);
            
            return redirect()->back()->withErrors([
                'general' => 'Failed to cancel registration. Please try again.',
            ]);
        }
    }

    /**
     * Update registration status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,confirmed,cancelled',
            ]);

            $registration = Registration::findOrFail($id);
            $registration->update(['status' => $request->status]);

            return redirect()->back()->with('success', 'Registration status updated successfully!');

        } catch (\Exception $e) {
            Log::error('Failed to update registration status', [
                'error' => $e->getMessage(),
                'registration_id' => $id,
                'user_id' => auth()->id()
            ]);
            
            return redirect()->back()->withErrors([
                'general' => 'Failed to update registration status. Please try again.',
            ]);
        }
    }
}