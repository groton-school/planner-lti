<?php

declare(strict_types=1);

namespace App\Application\Actions\API\Planner;

use App\Application\Actions\API\AbstractAPIAction;
use Psr\Http\Message\ResponseInterface;

class UpdatePlannerOverride extends AbstractAPIAction
{
    protected function action(): ResponseInterface
    {
        return $this->proxyRequest(
            'PUT',
            '/api/v1/planner/overrides/' . $this->args['override_id'],
            ['body' => $this->request->getBody()]
        );
    }
}
