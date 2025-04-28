<?php

declare(strict_types=1);

namespace App\Application\Actions\API\Planner;

use App\Application\Actions\API\AbstractAPIAction;
use Psr\Http\Message\ResponseInterface;

class CreatePlannerOverride extends AbstractAPIAction
{
    protected function action(): ResponseInterface
    {
        return $this->proxyRequest(
            'POST',
            '/api/v1/planner/overrides',
            ['body' => $this->request->getBody()]
        );
    }
}
