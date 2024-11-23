<?php

namespace App\Http\Controllers\Projects;

use App\Enums\FeatureStatus;
use App\Enums\TaskType;
use App\Http\Controllers\BaseController;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FeaturesController extends BaseController
{

    /**
     * Get top level features
     * @param Request $request
     * @return JsonResponse
     */
    public function getFeatures(Request $request)
    {

        $projects = Task::query()->where(['project_id' => $request->input('projectId')])
            ->whereNull('parent_id')
            ->with(['creator', 'owner', 'designer', 'implementor', 'tester', 'approver', 'deployer'])
            ->paginate(50);


        return $this->returnResponse("Top Level Features", $projects);
    }

    public function getDetails(Request $request)
    {
        $feature = Task::query()->where(['id' => $request->input('id')])
            ->with(['creator', 'owner', 'designer', 'implementor', 'tester', 'approver', 'deployer'])
            ->first();
        $responseData['feature'] = $feature;
        return $this->returnResponse("Feature Details", $responseData);
    }

    /**
     * Get child features
     * @param Request $request
     * @return JsonResponse
     */
    public function getSubFeatures(Request $request)
    {
        $projects = Task::query()->where(['parent_id' => $request->input('parentId')])
            ->with(['creator'])
            ->paginate(50);
        return $this->returnResponse("Sub features", $projects);
    }

    public function addFeature(Request $request)
    {
        Log::info(json_encode($request->all()));

        $request->validate([
            'project_id' => 'numeric|required',
//            'parent_id' => 'numeric',
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $project = Task::query()->create([
            'project_id' => $request->input('project_id'),
            'parent_id' => $request->input('parent_id'),
            'creator_id' => Auth::id(),
            'name' => $request->input('name'),
            'priority' => $request->input('priority'),
            'description' => $request->input('description'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'end_date' => Carbon::parse($request->input('end_date')),
            'type' => TaskType::FEATURE->name,
            'status' => FeatureStatus::DEVELOPMENT->name
        ]);

        return $this->returnResponse("Feature Added ", $project);
    }

    public function updateFeature(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:tasks,id'
        ]);

        $project = Task::query()->where(['id' => $request->input('id')])
            ->update([
                'owner_id' => $request->input('owner_id'),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);
        return $this->returnResponse("Feature Updated", $project);
    }

    public function updateFeatureStatus(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:tasks,id',
            'status' => 'required',
        ]);

        $project = Task::query()->where(['id' => $request->input('id')])
            ->update([
                'status' => $request->input('status')
            ]);
        return $this->returnResponse("Feature Updated", $project);
    }

    public function updateProgress(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:tasks,id',
            'status' => 'required',
        ]);

        $project = Task::query()->where(['id' => $request->input('id')])
            ->update([
                'design_status' => $request->input('design_status'),
                'dev_status' => $request->input('dev_status'),
                'test_status' => $request->input('test_status'),
                'approval_status' => $request->input('approval_status'),
                'deployment_status' => $request->input('deployment_status')
            ]);

        return $this->returnResponse("Feature Updated", $project);
    }


    public function assignMembers(Request $request)
    {

        $request->validate([
            'featureId' => 'required|exists:tasks,id'
        ]);

        $project = Task::query()->where([
            'id' => $request->input('featureId')
        ])
            ->update([
                'owner_id' => $request->input('owner_id'),
                'designer_id' => $request->input('designer_id'),
                'implementor_id' => $request->input('implementor_id'),
                'tester_id' => $request->input('tester_id'),
                'approver_id' => $request->input('approver_id'),
                'deployer_id' => $request->input('deployer_id')
            ]);
        return $this->returnResponse("Feature Updated", $project);
    }


}
