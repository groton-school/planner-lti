<?php

namespace App\Application\Actions;

use Psr\Http\Message\ResponseInterface;

class SPA extends AbstractAuthenticatedViewAction
{
    protected function authenticatedAction(): ResponseInterface
    {
        return $this->renderView($this->response, 'SPA.php', [
            "consumer_instance_url" => $this->getLaunchData()->getConsumerInstanceUrl()
        ]);
    }
}
