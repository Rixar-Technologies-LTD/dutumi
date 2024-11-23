<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\BaseController;
use App\Models\ProjectMember;
use App\Models\User;
use App\Services\ProjectsService;
use Illuminate\Http\Request;

class ProjectMembersController extends BaseController
{

    public function addProjectMember(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
        ]);

        /// Validate member
        $projectMember = ProjectMember::query()->where([
            'project_id' => $request->input('project_id'),
            'user_id' => $request->input('user_id'),
        ])->first();
        if ($projectMember) {
            return $this->clientError("Project member already exists", []);
        }

        $newProjectMember = ProjectsService::addProjectMember($request->input('project_id'), $request->input('user_id'));
        return $this->returnResponse("Member Added", $newProjectMember);
    }

    public function fetchProjectMembers(Request $request)
    {
        $request->validate([
            'projectId' => 'required'
        ]);

        $projectMembers = ProjectMember::query()->where([
            'project_id' => $request->input('projectId'),
        ])->paginate(20);

        return $this->returnResponse("Project Members", $projectMembers);
    }

    public function fetchAssignableUsers(Request $request)
    {
        $request->validate([
            'projectId' => 'required'
        ]);

        $projectId = $request->input('projectId');
        $assignableUsers = User::query()
            ->whereDoesntHave('members', function ($query) use ($projectId) {
                $query->where('project_id', $projectId);
            })
            ->paginate(100);

        return $this->returnResponse("Assignable Users", $assignableUsers);
    }


}
