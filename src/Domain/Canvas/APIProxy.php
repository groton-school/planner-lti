<?php

namespace App\Domain\Canvas;

use GrotonSchool\Slim\CanvasLMS;

class APIProxy extends CanvasLMS\APIProxy
{
    public function getAuthorizedRedirect(): string
    {
        return '/canvas/login/complete';
    }
}
