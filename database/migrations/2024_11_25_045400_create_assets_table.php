<?php

use App\Enums\AssetCategory;
use App\Enums\AssetUsageStatus;
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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("workspace_id")->nullable();
            $table->bigInteger('project_id')->unsigned();
            $table->bigInteger('asset_group_id')->unsigned();
            $table->bigInteger('author_id')->unsigned();

            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->string('type')->nullable();
            $table->string('category')->default(AssetCategory::SERVER->name);

            $table->string('remarks')->nullable();

            $table->double('unit_price')->default(0);

            $table->string('ownership')->nullable();
            $table->string('vendor')->nullable();
            $table->string('url')->nullable();

            $table->string('usage_status')->default(AssetUsageStatus::IN_USE->name);
            $table->integer('subscription_months_count')->default(0);
            $table->dateTime('next_payment_date')->nullable();

            $table->string('host_name')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('mac_address')->nullable();

            $table->integer('processor_cores_count')->nullable();
            $table->string('processor_type')->nullable();

            $table->integer('storage_size')->nullable();
            $table->string('storage_type')->nullable();
            $table->integer('memory_size')->nullable();
            $table->string('memory_type')->nullable();

            $table->string('operating_system')->nullable();

            $table->string('price_currency')->default(0);
            $table->double('unit_price_in_default_currency')->default(0)->nullable();
            $table->string('location')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
