<?php

use App\Enums\TaskType;
use App\Models\Task;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("project_id")->unsigned();
            $table->bigInteger("creator_user_id")->unsigned();
            $table->bigInteger("assignee_user_id");

            $table->string("name");

            $table->string("type")->default(TaskType::FEATURE->name);
            $table->dateTime("start_date")->nullable();
            $table->dateTime("end_date")->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }

};
