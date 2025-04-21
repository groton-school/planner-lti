<?php

declare(strict_types=1);

namespace App\Application\Handlers;

use App\Domain\LTI\LaunchData;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use GrotonSchool\Slim\LTI\Handlers\LaunchHandlerInterface;
use Packback\Lti1p3\LtiConstants;
use Packback\Lti1p3\LtiMessageLaunch;
use Psr\Http\Message\ResponseInterface;
use Slim\Views\PhpRenderer;

class LaunchHandler implements LaunchHandlerInterface
{
    private LaunchDataRepositoryInterface $lti;
    private UserRepositoryInterface $users;
    private PhpRenderer $renderer;

    public function __construct(LaunchDataRepositoryInterface $lti, UserRepositoryInterface $users)
    {
        $this->lti = $lti;
        $this->users = $users;
        $this->renderer = new PhpRenderer(__DIR__ . '/../../../templates');
    }

    public function handle(ResponseInterface $response, LtiMessageLaunch $launch): ResponseInterface
    {
        $lti = new LaunchData($launch);
        $this->lti->saveLaunchData($lti);
        $user = $this->users->findUser($lti->getConsumerInstanceHostname(), $lti->getUserId());
        if ($user) {
            return $this->renderer->render($response, 'ui.php');
        } else {
            return $this->renderer->render($response, 'permission.php');
        }
    }
}
