<?php

declare(strict_types=1);

namespace App\Application\Actions\OAuth2;

use Psr\Http\Message\ResponseInterface;

class Login extends AbstractOAuth2Action
{

    protected function action(): ResponseInterface
    {
        $authorizationUrl = $this->canvas->getAuthorizationUrl();
        $this->session->set(self::STATE, $this->canvas->getState());
        return $this->response->withAddedHeader('Location', $authorizationUrl);
    }
}
