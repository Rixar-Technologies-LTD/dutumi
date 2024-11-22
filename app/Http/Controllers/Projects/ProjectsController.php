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


    public function getProject(Request $request)
    {
        $projects = Project::query()->paginate(50);
        return $this->returnResponse("Projects",$projects);
    }

    public function addProject(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'type' => 'required',
            'start_date' => 'required|date',
            'mvp_date' => 'required|date',
        ]);

        $project = Project::query()->create([
            'owner_user_id'=> Auth::id(),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'mvp_date' => Carbon::parse($request->input('mvp_date')),
            'status' => Project::$STATUS_ACTIVE
        ]);

        ProjectsService::addProjectMember($project->id,Auth::id());

        return $this->returnResponse("Projects",$project);
    }

    public function updateProject(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:projects,id',
            'name' => 'required',
            'description' => 'required',
            'type' => 'required',
            'start_date' => 'required|date',
            'mvp_date' => 'required|date',
        ]);

        $project = Project::query()->where(['id' => $request->input('id')])
            ->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'mvp_date' => Carbon::parse($request->input('mvp_date'))
        ]);
        return $this->returnResponse("Project Updated",$project);
    }



    public function addProjectMember(Request $request)
    {
        $request->validate([
            'project_id' => 'required',
            'user_id' => 'required',
        ]);

        /// Validate member
        $projectMember = ProjectMember::query()->where([
            'project_id'=>$request->input('project_id'),
            'user_id'=>$request->input('user_id'),
        ])->first();
        if($projectMember){
            return $this->clientError("Project member already exists",[]);
        }

        $newProjectMember= ProjectsService::addProjectMember($request->input('project_id'),$request->input('user_id'));
        return $this->returnResponse("Member Added",$newProjectMember);
    }

    public function fetchProjectMembers(Request $request)
    {
        $request->validate([
            'projectId' => 'required'
        ]);

         $projectMembers = ProjectMember::query()->where([
            'project_id'=>$request->input('projectId'),
        ])->paginate(20);

        return $this->returnResponse("Project Members",$projectMembers);
    }



}
