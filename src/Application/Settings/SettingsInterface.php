<?php

declare(strict_types=1);

namespace App\Application\Settings;

use GrotonSchool\Slim\GAE;
use GrotonSchool\Slim\LTI;
use GrotonSchool\Slim\LTI\Infrastructure;

interface SettingsInterface extends
    GAE\SettingsInterface,
    LTI\SettingsInterface,
    Infrastructure\GAE\SettingsInterface
{
    /**
     * @param string $key
     * @return mixed
     */
    public function get(string $key = '');
}
