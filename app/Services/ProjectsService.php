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
            'workspace_id' => Auth::user()?->default_workspace_id ?? '',
            'project_id' => $projectId,
            'user_id' => $userId,
            'author_id' => Auth::id(),
            'status' => ProjectMember::$STATUS_ACTIVE
        ]);
    }


}
