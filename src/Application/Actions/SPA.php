<?php

declare(strict_types=1);

namespace App\Application\Actions;

use App\Application\Middleware\Authenticated;
use App\Domain\LTI\LaunchData;
use GrotonSchool\Slim\Norms\AbstractAction;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\ServerRequest;
use Slim\Http\Response;
use Slim\Views\PhpRenderer;

class SPA extends AbstractAction
{
    public function __construct(private PhpRenderer $views)
    {
    }

    protected function invokeHook(
        ServerRequest $request,
        Response $response,
        array $args = []
    ): ResponseInterface {
        /** @var LaunchData $launch */
        $launch = $request->getAttribute(Authenticated::LAUNCH_MESSAGE);
        $this->views->setLayout('SPA.php');
        return $this->views->render(
            $response,
            'planner.php',
            [
                "consumer_instance_url" => $launch->getConsumerInstanceUrl(),
                'user_email' => $launch->getUserEmail()
            ]
        );
    }
}
