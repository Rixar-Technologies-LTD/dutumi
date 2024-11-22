<?php

namespace App\Services;

use App\Models\ProjectMember;
use Illuminate\Support\Facades\Auth;

class ProjectsService
{
    /**
     * Register any application services.
     */
    public static function addProjectMember($projectId, $userId): ProjectMember
    {
        return ProjectMember::query()->create([
            'project_id' => $projectId,
            'user_id' => $userId,
            'added_by_user_id' => Auth::id(),
            'status' => ProjectMember::$STATUS_ACTIVE
        ]);
    }


}
