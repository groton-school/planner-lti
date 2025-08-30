<?php

declare(strict_types=1);

namespace App\Application\Handlers;

use App\Domain\LTI\LaunchData;
use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\User\UsersTrait;
use GrotonSchool\Slim\LTI\Handlers\LaunchHandlerInterface;
use Packback\Lti1p3\LtiMessageLaunch;
use Psr\Http\Message\ResponseInterface;
use Slim\Views\PhpRenderer;

class LaunchHandler implements LaunchHandlerInterface
{
    use  UsersTrait;


    public function __construct(
        LaunchDataRepositoryInterface $launchData,
        UserRepositoryInterface $users,
        private PhpRenderer $views
    ) {
        $this->initUsers($launchData, $users);
    }

    public function handle(ResponseInterface $response, LtiMessageLaunch $launch): ResponseInterface
    {
        $launchData = new LaunchData($launch);
        $this->launchData->saveLaunchData($launchData);
        $user = $this->users->findUser($launchData->getConsumerInstanceHostname(), $launchData->getUserId());
        if ($user) {
            return $response->withAddedHeader('Location', '/');
        } else {
            return $this->views->render($response, 'permission.php');
        }
    }
}
