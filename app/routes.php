<?php

declare(strict_types=1);

use App\Application\Actions\OAuth2;
use App\Application\Actions\SPA;
use GrotonSchool\Slim\GAE\Actions\EmptyAction;
use GrotonSchool\Slim\LTI\Actions as LTI;
use Odan\Session\Middleware\SessionStartMiddleware;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    // return an empty string on GAE start/stop requests
    $app->get('/_ah/{action:.*}', EmptyAction::class);

    // standard LTI endpoints
    $app->group('/lti', function (Group $lti) {
        $lti->post('/launch', LTI\LaunchAction::class);
        $lti->get('/jwks', LTI\JWKSAction::class);
        $lti->get('/register', LTI\RegistrationStartAction::class);
        $lti->post('/login', LTI\LoginAction::class);
    })->add(SessionStartMiddleware::class);

    // OAuth2 authorization for Canvas API
    $app->group('/login', function (Group $login) {
        $login->get('/oauth2', OAuth2\Login::class);
        $login->get('/oauth2/redirect', OAuth2\Redirect::class);
    })->add(SessionStartMiddleware::class);

    // app
    $app->get('/', SPA::class)->add(SessionStartMiddleware::class);
};
