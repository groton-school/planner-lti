<?php

declare(strict_types=1);

namespace App\Application\Actions\OAuth2;

use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface;

class Redirect extends AbstractOAuth2Action
{
    protected function action(): ResponseInterface
    {
        $code = $this->request->getQueryParams()['code'];
        if (empty($code)) {
            $this->response->getBody()->write(json_encode($this->request->getQueryParams()));
            return $this->response->withStatus(401, 'missing authorization code');
        }
        $state = $this->request->getQueryParams()['state'];
        if ($state !== $this->session->get(self::STATE)) {
            $this->response->getBody()->write(json_encode($this->request->getQueryParams()));
            return $this->response->withStatus(401, 'state mismatch');
        }
        $user = $this->users->createUser(
            $this->launchData->getLaunchData()->getConsumerInstanceHostname(),
            $this->launchData->getLaunchData()->getUserId()
        );
        $user->setTokens($this->canvas->getAccessToken('authorization_code', ['code' => $code]));
        $this->users->saveUser($user);
        $this->response->getBody()->write('Token acquired');
        return $this->response;
    }
}
