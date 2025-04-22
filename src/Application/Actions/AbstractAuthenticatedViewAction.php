<?php

declare(strict_types=1);

namespace App\Application\Actions;

use App\Domain\LTI\LaunchDataRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\User\UsersTrait;
use Psr\Http\Message\ResponseInterface;

abstract class AbstractAuthenticatedViewAction extends AbstractAction
{
    use UsersTrait, ViewsTrait;

    public function __construct(
        LaunchDataRepositoryInterface $launchData,
        UserRepositoryInterface $users
    ) {
        $this->initUsers($launchData, $users);
        $this->initViews();
    }

    protected function action(): ResponseInterface
    {
        $user = $this->getCurrentUser();
        if ($user) {
            return $this->authenticatedAction();
        }
        // TODO store redirect to return to this page after authentication
        return $this->response->withAddedHeader('Location', '/login/oauth2');
    }

    protected abstract function authenticatedAction(): ResponseInterface;
}
