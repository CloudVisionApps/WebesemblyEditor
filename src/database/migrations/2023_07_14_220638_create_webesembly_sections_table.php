<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('webesembly_sections', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->longText('params')->nullable();
            $table->longText('html');
            $table->bigInteger('page_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('webesembly_sections');
    }
};
