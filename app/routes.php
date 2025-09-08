<?php

declare(strict_types=1);

use App\Application\Actions\Canvas;
use App\Application\Actions\Google;
use App\Application\Actions\SPA;
use App\Application\Middleware\RequireAuthenticationMiddleware;
use GrotonSchool\Slim\GAE;
use GrotonSchool\Slim\LTI;
use GrotonSchool\Slim\LTI\PartitionedSession;
use GrotonSchool\Slim\LTI\PartitionedSession\Middleware\PartitionedSessionMiddleware;
use GrotonSchool\Slim\OAuth2\APIProxy;
use Odan\Session\Middleware\SessionStartMiddleware;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface;

return function (App $app) {
    GAE\RouteBuilder::define($app);
    LTI\RouteBuilder::define($app)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);
    PartitionedSession\RouteBuilder::define($app);
    APIProxy\RouteBuilder::define($app, 'canvas')
        ->add(PartitionedSessionMiddleware::class);

    $app->group('/canvas', function (RouteCollectorProxyInterface $canvas) {
        $canvas->get('/theme/stylesheet', Canvas\Theme\Stylesheet::class);
    })
        ->add(RequireAuthenticationMiddleware::class)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);

    // Google Calendar
    $app->group('/google/calendar', function (RouteCollectorProxyInterface $calendar) {
        $calendar->get('/events', Google\Calendar\Events::class)->add(SessionStartMiddleware::class);
        $calendar->get('/accept', Google\Calendar\Accept::class);
    })
        ->add(RequireAuthenticationMiddleware::class)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);

    // app
    $app->get('/', SPA::class)
        ->add(RequireAuthenticationMiddleware::class)
        ->add(SessionStartMiddleware::class)
        ->add(PartitionedSessionMiddleware::class);
};
