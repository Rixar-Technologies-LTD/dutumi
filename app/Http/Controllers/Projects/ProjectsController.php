<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\BaseController;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Services\ProjectsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class ProjectsController extends BaseController
{

    /**
     * Display the user's profile form.
     */
    public function getProject(Request $request)
    {
        $projects = Project::query()->paginate(50);
        return $this->returnResponse("Projects",$projects);
    }


    /**
     * Display the user's profile form.
     */
    public function addProject(Request $request)
    {
        $request->validate([
            'project_name' => 'required',
            'project_description' => 'required',
            'project_type' => 'required',
            'start_date' => 'required|date',
            'mvp_date' => 'required|date',
        ]);

        $project = Project::query()->create([
            'owner_user_id'=> Auth::id(),
            'project_name' => $request->input('project_name'),
            'project_description' => $request->input('project_name'),
            'project_type' => $request->input('project_name'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'mvp_date' => Carbon::parse($request->input('mvp_date')),
            'status' => Project::$STATUS_ACTIVE
        ]);

        $newProjectMember = ProjectsService::addProjectMember($project->id,Auth::id());

        return $this->returnResponse("Projects",$project);
    }

    public function addProjectMember(Request $request)
    {
        $request->validate([
            'project_id' => 'required',
            'user_id' => 'required',
        ]);

        /// Validate member
        $projectMember = ProjectMember::query()->first([
            'project_id'=>$request->input('project_id'),
            'user_id'=>$request->input('user_id'),
        ]);
        if($projectMember){
            return $this->clientError("Project member already exists",$projectMember);
        }

        $newProjectMember= ProjectsService::addProjectMember($request->input('project_id'),$request->input('user_id'));
        return $this->returnResponse("Member Added",$newProjectMember);
    }



}
