<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'user_type', 'active_session_id', 'created_at'])
            ->latest()
            ->get()
            ->map(function (User $user): array {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'active' => $user->active_session_id !== null,
                    'created_at' => $user->created_at?->format('Y-m-d H:i'),
                ];
            });

        return response()->json([
            'current_user' => $request->user()?->only(['id', 'name', 'email', 'user_type']),
            'stats' => [
                'total_users' => User::query()->count(),
                'admins' => User::query()->where('user_type', User::TYPE_ADMIN)->count(),
                'clients' => User::query()->where('user_type', User::TYPE_CLIENT)->count(),
                'active_sessions' => DB::table('sessions')->whereNotNull('user_id')->count(),
            ],
            'users' => $users,
        ]);
    }
}
