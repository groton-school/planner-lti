<?php

declare(strict_types=1);

use App\Application\Actions\API;
use App\Application\Actions\OAuth2;
use App\Application\Actions\Calendar;
use App\Application\Actions\SPA;
use Delight\Cookie\Session;
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

    // api
    $app->group('/api/v1', function (Group $api) {
        $api->get('/brand/stylesheet', API\Brand\Stylesheet::class);
        $api->group('/courses', function (Group $courses) {
            $courses->get('/{course_id}', API\Courses\Get::class);
            $courses->group('/{course_id}', function (Group $course) {
                $course->get('/assignments', API\Assignments\ListForCourse::class);
                $course->get('/assignments/{assignment_id}', API\Assignments\Get::class);
            });
        });
        $api->group('/planner', function (Group $planner) {
            $planner->get('/items', API\Planner\ListItems::class);
            $planner->post('/overrides', API\Planner\CreatePlannerOverride::class);
            $planner->put('/overrides/{override_id}', API\Planner\UpdatePlannerOverride::class);
        });
        $api->group('/users/{user_id}', function (Group $self) {
            $self->get('/colors', API\Users\ListCustomColors::class);
            $self->get('/courses', API\Users\ListCoursesForUser::class);
        });
    })->add(SessionStartMiddleware::class);

    // Google Calendar
    $app->group('/calendar', function (Group $calendar) {
        $calendar->get('/events', Calendar\Events::class)->add(SessionStartMiddleware::class);
        $calendar->get('/accept', Calendar\Accept::class);
    });

    // app
    $app->get('/', SPA::class)->add(SessionStartMiddleware::class);
};
